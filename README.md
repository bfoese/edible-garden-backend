![lint-test](https://github.com/bfoese/edible-garden-backend/workflows/lint-test/badge.svg)

## Description

An extended [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository which integrates the following technologies:

<ul>
<li>NestJS</li>
<li>OpenAPI</li>
<li>TypeORM with external schema definition</li>
<li>Postgres</li>
<li>Redis</li>
<li>Passport JWT</li>
</ul>

## Installation & Running

The application requires Redis and Postgres instances to run, which can be
startet via Docker Compose. The docker-compose declaration will also start the
application in a container named 'main'. For local development I prefer to stop
the main container while leaving the others running and install and start the
application locally via npm, because the main container is watching file changes
but local node_modules changes are not reflected and require a rebuild.

```bash
$ npm install
# development with watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# Start all Services & App with Docker Compose
$ docker-compose --env-file .env.container.dev build --build-arg GH_PKG_TOKEN="secret" --build-arg NODE_ENV=production --no-cache
$ docker-compose --env-file .env.container.dev up

# Only start databases with Docker Compose without the container for the app
$ docker-compose start postgres redis
```

In the Docker Container for the application the node_modules directory is
defined as an anonymous volume. These types of volumes only get removed, when
their parent container is removed. This means that node_module updates on the
local machine aren't reflected in the container!! After adding/removing
libraries in package.json you need to enforce the deletion of the anonymous
volume:

```bash
# Enforces an npm install and the -v argument will remove any anonymous
# volumes and create them again as well as removing orphan containers
docker-compose up --build -V --remove-o
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Debugging in VSCode

There are different options for debugging a NestJS app. The easiest seems to be to write a config, that creates a debugger which can be attached to any of the currently running NodeJS processes. This is described in the following lines.

<ul><li>Create a .vscode/launch.json as described here: https://github.com/microsoft/vscode-recipes/tree/master/nodemon; Make sure to also add "sourceMaps=true" in the launch.json so that the debugger will point you to .ts code instead of .js code</li>


<li>Click Ctrl+Shift+P and search for "Debug: Toggle Auto Attach". There are different options. When you choose 'disable', your debugger won't connect to the application. When you choose 'Only with Flag...', you have to start your app with '--inspect' flag otherwise the debugger won't connect to it. At the beginning you can choose 'Always'</li>

<li>Start the application as you normally do, for example: nest start --watch. Basically, you can use your normal startup script. Except when you choose 'Only with flag' in the previous step, then you also have to include the option '--inspect'</li>
<li>Open the debug view: Ctrl+Shift+D. In the top you can choose between existing launch configs. They are named and the name is defined in the property 'name' within the launch config json. Just select the one which belongs to the launch.json you created two steps earlier. Then click F5. In the top of the screen a small window will open where you can see your currently running node.js processes. Chose the process of your running application. And thats it: the debugger will connect to that instance.</li>
<li>Debugger can be disconnected in den debug view under 'Call stack'</li>
</ul>


## Application Specifics
### DOTENV Files

Priority of the files

<ul>
    <li>Dev: (npm run start:dev): .env.development.local, .env.development, .env.local, .env</li>
    <li>Dev: (npm run start:dev:qa): .env.qa.local, .env.qa, .env.local, .env</li>
    <li>Prod: (npm run start:dev:prod): .env.production.local, .env.production, .env.local, .env</li>
</ul>

Conventions for this project:

<ul>
    <li>Properties which should be handled as a secret belong into the .env.{development|qa|production}.local files. These files are on gitignore list and won't appear in the remote repository. These properties will be configured manually in the CI/CD pipeline tools</li>
    <li>Secrets that are used both in development and production can go into the .env.local file, which is also on gitignore list</li>
    <li>Properties which are not secret but rather used can go into the .env.{development|qa|production} files. These files are not on gitignore list and therefore appear in the remote repository where they can be used to serve the CI/CD pipelines as a file import.</li>
</ul>

### API Documentation

API endpoint is currently only available in ENV development.

```bash
# Browsing the Swagger Documentation of the exposed endpoints
http://localhost:3000/api

# Downloadable JSON File of the endpoints
http://localhost:3000/api-json
```

### Database & ORM

The main database being used is PostgreSQL in combination with a Redis database for certain use cases. The ORM Tool of choice is TypeORM.

#### Table Name Conventions

Table and column names should be in lowercase snake-case format. With mixed-case or upper-case names
you are required to reference table names with double quotes in some database admin tools,
which is a pain, e.g.

```bash
select * from public."FOO_MyTable"
```
This is the preferred table name format which is automatically enforced by a custom naming strategy that is registered in TypeORM:

```bash
select * from public.foo_my_table
```
#### Database Migration

The project is configured to utilize the TypeORM migration mechanism instead of
auto-synchronizing the database based on the model. There are two different
migration directories configured: 'migration-gen' is used as a sink for the
auto-generated migration files. This directory is in the gitignore list as it is
only meant to be a holder for untested migration files which are work in
progress. The second directory 'migration' is being used as the source directory
for the actual migration process. Migration files which need to be tested as
well as the final ones need to be copied into this directory. Before committing
a new migration file, make sure to manually test it by running the
'migration:run' command and afterwards 'migration:revert' for proper cleanup.

##### TypeORM Migration Preconditions:

<ul>
<li>Build app: TypeORM migration operates on the generated JS code. In order to detect changes, we need to build the project first.</li>
<li>There should be a ormconfig.js file being generated into the build output dir.</li>
<li>`npm run schema:log` - This command will display the schema changes. If the result says that there are no changes, but you know there should, it is possible, that the property cli.entitiesDir in the ormconfig file is not properly defined. The path of that property must be relative to the ormconfig file and the general context is the build output directory</li>
</ul>

##### TypeORM Migration Commands

```bash
# See schema changes which are not reflected within the database yet
$npm run schema:log

# Auto-generate a migration file after entity changes into the configured migration-gen file directory
$npm run migration:generate -- -n <migration-file-name>

# Auto-generate an empty migration skeleton file into the configured migration-gen file directory
$npm run migration:create -- -n <migration-file-name>

# Running migrations manually which are in the configured migrations directory
$npm run migration:run

# Reverting the last migration manually
$npm run typeorm:cli -- migration:revert

# Using other TypeORM CLI features
$npm run typeorm:cli -- <command>

```

#### Working with TypeORM

Currently I use a patched version of TypeORM that supports embedded entities in external schema definition: https://github.com/typeorm/typeorm/pull/6318. Waiting for it to be released.

<ul><li><strong>Update an entity</strong>It is not necessary to load the entity, map the new fields onto it and then save it. You can also just provide a Partial of the entity with the fields you really want to change plus the primary key of the object. TypeORM will then only change the fields contained in that Partial.</li>
<li><strong>Loading an entity</strong>In this repo I use external schema files to have a clear separation between domain and persistence layer. The schema files point to classes from the domain, but TypeORM treats these classes as interfaces. When you load an entity from the database with TypeORM, you can cast it to your domain class but it is in fact no class instance. You will receive an object with the properties of that class. If you really want to return a class instance from the persistence layer, you can use a tool like class-transformer which transforms the plain object to the desired class. This is important to know when you have instance methods in your domain objects, which are not getters or setters. These will be undefined in the objects returned from TypeORM, unless you transform that object into a class.</li>
<li><strong>Loading relationships</strong>By default, the relationships of an object are not loaded when you load the object, unless you defined them to be eager or you explicitly name them in the query. TypeORM also has an experimental lazy-load mechanism which would work like lazy-loading in Hinbernate: the first time you access the field of the relationship, it will be loaded. Therefore these relationship fields are provided as Promises. But, as far as I read, lazy loading is still considered to be experimental.</li>
<li><strong>Auto-generated migration files</strong>It is possible to let TypeORM auto-generate migration files based on changes in entities or schema files which saves some work of writing them yourself.  However, I noticed that often unneccessary statements are contained (dropping default uuid generation and recreating it). Also statements for dropping sequences which do not exist are being generated. And some statements need manual correction. In summary, you have to check the generated migration files and often need to correct them. At least this is the case when using external schema files. At first I used schema annotations and I don't remember these problems from that time.</li>
</ul>

#### PostgreSQL

Sometimes it's useful to check Postgres state via CLI.

```bash
#Running postgres under user 'postgres':
$ docker exec -it <db-container-name> psql -U postgres

# Connecting to a database:
$ \c <databaseName>

#List all tables:
$ \d

# Details of a specific table:
\d+ <table_name>

# Exit the container:
\q

# Restart with clean local database:
$ docker-compose down --volumes
```

##### Postgres Error Handling

During development with TypeORM sync mode turned on, exceptions from postgres can arise. Here are some workarounds.

<ul>
    <li>Exceptions concerning enum types - enum types are stored in 'pg_catalog.pg_enum' and can be deleted with: 'drop type <enumType> cascade;'</li>
</ul>

### i18n

Docs: https://github.com/ToonvanStrijp/nestjs-i18n

We have a field user.preferredLocale. Requests for a registered user should
favor this locale. If a request without associated user must be handled, a custom
header sent by the frontend application could be the second preference.
Localization by query param is also active, in case we need to generate links
without user context. And last preference would be the accept language of the
users browser agent.
In the application code, the resolved locale can be accessed like this:

```bash
  @Get() sample(@I18nLang() lang: string) {}
```

Outside of a controller you need to considrate whether the code runs inside or outside the context of a request.
Eg18nService has two methods which can be used for each of both cases.

### Bulls Queue

<ul>
<li>Bulls ignores jobs whose jobID is the same as the jobID of a previously performed job, unless you use 'removeOnCompleted'. Using this option will purge the information about previously performed Jobs after completion so they can't be considered the next time you add a job.</li>
</ul>

### Data Security

<ul>
    <li>User passwords in database are hashed with pepper and salt.</li>
    <li>Database must not contain sensitive personal data of the users (real name, email, address, phone, etc.) in plain text (in case the database is being leaked). Therefore this sensitive data is encrypted using AES with ECB mode. This must be considered when querying data: the query must contain the encrypted values.</li>
    <li>Prevent leaking secrets in Docker history and image layer tarballs: https://www.alexandraulsh.com/2018/06/25/docker-npmrc-security/</li>
</ul>

### Email

#### Gmail
To securely send Emails via a Gmail Account you have to create an App Password
with access to the Google account email functionality. How to create such a
password for the app is described here along with the SMTP host and port
information to set everything up:
https://support.google.com/mail/answer/7126229?p=BadCredentials&visit_id=637466758146187794-1782866574&rd=2#cantsignin

In short: You have to enable 2-Factor-Authentication for the Google Account,
then choose Google Account > Security > Sign In with Google > "App Passwords"
and here you can create a password which only has access to the Email
functionalities of your account.

Gmail Sending limits: According to one page there is a limit of 500 outgoing
Mails within 24 hours. I assume the mails above that limit will be purged to
avoid exploitation.

Its a good idea to have a counter for the apps mail sending queue to not run
into that limit by delaying mails above the limit for a few hours.

#### Gandi
SMTP
https://docs.gandi.net/en/simple_hosting/common_operations/smtp.html
Nodemailer: https://nodemailer.com/smtp/

#### Handlebars Templates

##### i18n

I was looking for possibilies to translate the emails. Considerations:

The templates contain html tags and the amount of html and css tags will likely increase in the future to provide styled emails.
It is not very handy to have the html tags inside the translations files, changing the html would be a nightmare.
It is also not very handy to create translations for text within a html tag (e.g. <p>{{i18n content}}<br>{{i18n content2}}</p>), because this would be a nightmare for the translator to define the translations in a semantic way for each language.

As a sidenote, I started to create a handlebar helper function that could be used to translate a key within a template by reusing the apps i18n service. But this helper would have been asynchron and according to this post https://stackoverflow.com/a/23939596/11964644 it is not possible to define an asnychronous handlebars helper function (the post is rather old, might have changed, but not high priority right now to further investigate).

So best idea at this point is to duplicate the email templates for each language. This offers the benefit of customized templates per locale with the disadvantage of some overhead when template variables etc. need to be changed.


## Heroku

### Deployment

NodeJS apps kann be deployed to Heroku via the NodeJS buildback or as a containerized application. These solutions need slightly differen configuration.

#### Deployment with NodeJS Buildpack

<ul>
<li>See GitHub Action "deploy-nodejs-prod"</li>
<li>Does NOT require the "heroku.yml" File. And I haven't testet, if the file has a negative effect.</li>
<li>Requires the Procfile file it would only be used as a fallback when no heroku.yml file exists</li>
<li>package.json contains some scripts prefixed with "heroku:" these are not used by Heroku, as we provide a Container. However, you can manually call them from heroku.yaml or the Dockerfile</li>
</ul>

### Deployment as Container

<ul>
<li>See GitHub Action "deploy-container-prod"</li>
<li>Requires the "heroku.yml" File</li>
<li>Does NOT require the Procfile file. It would only be used as a fallback when no heroku.yml file exists</li>
<li>package.json contains some scripts prefixed with "heroku:" these are not used by Heroku, as we provide a Container. However, you can manually call them from heroku.yaml or the Dockerfile</li>
</ul>



There are two Github Actions defined for deployment: one for deploying as NodeJS app and one for deploying as containerized NodeJS app.


### CLI

Infos about customizing Heroku builds for Node.JS: https://devcenter.heroku.com/articles/nodejs-support#heroku-specific-build-steps

```bash
$ heroku login
$ heroku releases
$ heroku releases:output <release number>

# Restart app
$ heroku restart --app <app-name>

# See environment variable names with their values
$ heroku config --app <app-name>

# Reset Database
heroku pg:reset DATABASE --app <app-name>

#See server logs
$ heroku logs --app <app-name> --tail -n <lines count>

# See files on server
$ heroku run bash --app <app-name>
$ cd <app-name>
$ dir
```

### Heroku App Organisation

<ul>
<li>By default the Herku app domains are SSL secured. You can have your own domain for free, but if you want to use the own doamin with SSL, it seems to be 20 EUR per month and app. There is one proposal using Cloudflare in between, but Cloudflare with SSL is also 20 EUR per month</li>
<li>How to deploy multiple apps (from one or multiple git repos) on the same Heroku instance: https://stackoverflow.com/questions/41461517/deploy-two-separate-heroku-apps-from-same-git-repo</li>
<li>Reroute to other Heroku App: https://github.com/ryandotsmith/nginx-buildpack/issues/59</li>
</ul>

## Self-signed Certificates for HTTPS under localhost

For using HTTPS under localhost (or other local dev domain, e.g. dev.local or
whatever) you can use a self signed certificate that can be generated with the
tool mkcert. The certificate and the key can be easily provided in the NestJS
bootstrap process: https://docs.nestjs.com/faq/multiple-servers This way the
server is quickly running under https://localhost.

<ol>
<li>Install mkcert</li>
<li>Create certificate and key for desired domain</li>
<li>Concatenate the root certificate and the certificate of the domain into one file (fullchain)<li>
<li>start NestJS by providing the fullchain certificate and the key file of the domain</li>
<ol>

```bash
# creates localhost.pem and localhost-key.pem
$ mkcert localhost
# Show path of root certificate
$ mkcert -CAROOT
# Concatenate root certificate and localhost certifiate into one file
cat localhost.pem > localhost-fullchain.pem
cat "$(mkcert -CAROOT)/rootCA.pem" >> localhost-fullchain.pem
```

## Reading
<ul>
<li>https://whuysentruit.medium.com/securing-your-single-page-application-anno-2019-754bc4c29119</li></ul>




## Lib Optimization

Lib is currently a CommonJS Module. For Angular it is not optimal, as the
bundlers an minifiers can not optimize these modules. It would be better to
implement it as a ECMAScript module. In Angular you can suppress warnings about
the CommonJS modules by explicitly allowing them in angular.json build options
for browser builder: allowedCommonJsDependencies

TODO Investigate how to transition the CommonJS lib to a ECMAScript lib. First
try resulted in errors when starting NestJS.

https://redfin.engineering/node-modules-at-war-why-commonjs-and-es-modules-cant-get-along-9617135eeca1
https://medium.com/dev-genius/nodejs-using-es-modules-instead-of-commonjs-9c6e801e7508


## NestJS Notes

<ul>
<li>https://dev.to/nestjs/advanced-nestjs-how-to-build-completely-dynamic-nestjs-modules-1370</li>
</ul>

### Logging
https://www.datadoghq.com/blog/node-logging-best-practices/

### Cron Jobs

Cron Jobs which reside in a service will run automagically when the service is
listed in the provider list of a module (does not even need to be exportet) and
this module is being imported into the main module. No need to inject the cron
job service somewhere explicitly.

### Validation via class-validator
The validator is enabled globally and will validate DTOs which have been
received by a request automagically. Precondition for validation is, that the
DTO has validation annotations. The thrown error is a 400 BadRequest exception.
The "message" field contains an array of messages corresponding to the invalid
fields.

While automatic validation on DTO objects from a request is nice, it requires to
duplicate the Validators across all DTO objects when you have multiple DTOs for
different use cases concerning a domain object. For example, you might have a
DTO for signup and one for password change. Both contain a password field which
must be validated by the rules of the password field in the domain layer. You
could copy the validation decorators from the domain object to both of the DTOs,
but then you have three places which would require change when the password
pattern changes. I prefer to thave the validation annotations in only one place:
the domain object.

Class-Validator allows you to define groups, which provides fine
granulated control of when a field should be validated and when not. With having
theses groups, it should be managable to have the validator annotations only in
the domain layer. Disadvantage of this solution is, that the validation call
must be done explicitly as described above. So workflow would be:
<ol><li>Receive data as DTO in Request</li>
<li>Map DTO onto a domain class instance</li>
<li>perform validation on domain class instance</li></ol>

The domain objects must be validated manually, by calling the validation functions, e.g.
```typescript
const newData = {...} as User;
await validateOrReject(plainToClass(User, newData)).catch((error) => throw new ValidationException(error))
```
Notice that the object must be transformed to a class, otherwise no validation
is being transformed.

Global DTO validation is still turned on and could be used for some edge cases.


