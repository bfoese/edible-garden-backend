![lint-test](https://github.com/bfoese/edible-garden-backend/workflows/lint-test/badge.svg)

## Description

An extended [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository which integrates the following technologies:

<ul>
<li>NestJS</li>
<li>Typescript</li>
<li>Swagger</li>
<li>TypeORM</li>
<li>Postgres</li>
<li>Postgres Admin</li>
<li>Docker multi-stage build</li>
<li>Docker Compose for the app and its related services</li>
<li>.ENV-FLOW for switching between multiple environments (e.g. development, production)</li>
</ul>

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# Start all Services & App with Docker Compose
$ docker-compose up

# Only start Database with Docker Compose
$ docker-compose start postgres
```

In the Docker Container for the application the node_modules directory is defined as an anonymous volume. These types
of volumes only get removed, when their parent container is removed. This means that node_module updates on the
local machine aren't reflected in the container!!
After adding/removing libraries in package.json you need to enforce the deletion of the anonymous volume:

```bash
# Enforces an npm install and the -v argument will remove any anonymous volumes and create them again

docker-compose up --build -V
```

## API Documentation

```bash
# Browsing the Swagger Documentation of the exposed endpoints
http://localhost:3000/api

# Downloadable JSON File of the endpoints
http://localhost:3000/api-json
```

## Database & ORM

This project uses Postgres database. The docker-compose file also setups a Postgres Admin interface connected to the
postgres database container.

This project also uses TypeORM and is configured to utilize the TypeORM migration mechanism instead of auto-synchronizing
the database based on the model.
There are two different migration directories configured: 'migration-gen' is used as a sink for the auto-generated
migration files. This directory is in the gitignore list as it is only meant to be a holder for untested migration files
which are work in progress. The second directory 'migration' is being used as the source directory for the actual
migration process. Migration files which need to be tested as well as the final ones need to be copied into
this directory. Before committing a new migration file, make sure to manually test it by running the 'migration:run'
command and afterwards 'migration:revert' for proper cleanup.

TypeORM Migration Preconditions:

<ul>
<li>Build app: TypeORM migration operates on the generated JS code. In order to detect changes, we need to build the project first.</li>
<li>There should be a ormconfig.js file being generated into the build output dir.</li>
<li>`npm run schema:log` - This command will display the schema changes. If the result says that there are no changes, but you know there should, it is possible, that the property cli.entitiesDir in the ormconfig file is not properly defined. The path of that property must be relative to the ormconfig file and the general context is the build output directory</li>
</ul>

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

Auto-generated migration files will be created in a local directory.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### PostgreSQL CLI

Sometimes it's useful to check Postgres state via CLI.

Running postgres under user 'postgres':
\$ docker exec -it <db-container-name> psql -U postgres

Connecting to a database:
\$ \c <databaseName>

List all tables:
\$ \d

Details of a specific table:
\d+ <table_name>

Exit the container:
\q

Restart with clean local database:
```bash
$ docker-compose down --volumes
```

# Postgres Error Handling

During development with TypeORM sync mode turned on, exceptions from postgres can arise. Here are some workarounds.

<ul>
    <li>Exceptions concerning enum types - enum types are stored in 'pg_catalog.pg_enum' and can be deleted with: 'drop type <enumType> cascade;'</li>
</ul>

# Table Name Conventions

Table and column names should be lowercase. With mixed-case or upper-case names you are required to reference table names with double quotes, e.g.

```bash
select * from public."FOO_MyTable"
```

at least in SQLDeveloper. Also some features, like data view, can't be used at all because of thrown exceptions. Don't know if this is a problem of the Postgres JDBC driver or implementation of SQLDeveloper or both. PGAdmin can handle these table names, but I personally don't like the user experience with that tool.

So with lower-case table names, you can use all features of SQLDeveloper and SQL statements can be done without double quotes, e.g.

```bash
select * from public.foo_my_table
```

## DOTENV Files

Priority of the files

<ul>
    <li>Dev: (npm start): .env.development.local, .env.development, .env.local, .env</li>
    <li>Prod: (npm run build): .env.production.local, .env.production, .env.local, .env</li>
</ul>

Conventions for this project:

<ul>
    <li>Properties which should be handled as a secret belong into the .env.{development|production}.local files. These files are on gitignore list and won't appear in the remote repository. These properties will be configured manually in the CI/CD pipeline tools</li>
    <li>Secrets that are used both in development and production can go into the .env.local file, which is also on gitignore list</li>
    <li>Properties which are not secret but rather used can go into the .env.{development|production} files. These files are not on gitignore list and therefore appear in the remote repository where they can be used to serve the CI/CD pipelines as a file import.</li>
</ul>

## TypeORM Limitations & Cons

<ul>
    <li>It is possible to completely separate domain model and persistence model by separating entity definitions into schema files as demonstrated in this repo. However, the external schema implementation lacks some features which are supported by TypeORM Entity decorators.
        <ul><li>The current version 0.2.29 does not support embedded entities in external schema. There is an open issue for that and a pull request with a fix was created, but no sign of progress on this topic: https://github.com/typeorm/typeorm/pull/6318</li>
        <li>TypeORM has different implementations for tree structures, e.g. closure tables. Didn't find options to define a closure table or the other tree implementations in external schema. Assume it's not supported yet.</li></ul>
    </li>
<li>It is possible to generate migration files based on changes in entities or schema files which saves some work of writing them yourself. However, I noticed that often unneccessary statements are contained (dropping default uuid generation and recreating it). Also statements for dropping sequences which do not exist are being generated. And some statements need manual correction. In summary, you have to check the generated migration files and often need to correct them.</li>
<li>Quite long standing open issue concerning performance issues with queries: https://github.com/typeorm/typeorm/issues/3857#issuecomment-609863113</li>
</ul>

## Heroku

```bash
$ heroku releases
$ heroku releases:output <release number>

```

Reset Database
```bash
heroku pg:reset DATABASE --app <app-name>
```

## Self-signed Certificates for HTTPS under localhost

For using HTTPS under localhost (or other local dev domain, e.g. dev.local or whatever) you can use a self signed certificate that can be generated with the tool mkcert.
The certificate and the key can be easily provided in the NestJS bootstrap process: https://docs.nestjs.com/faq/multiple-servers
This way the server is quickly running under https://localhost.

But I ran into problems when generating the OpenAPI source code for the Angular
client using ng-openapi-gen. First error that was shown was "unable to verify
the first certificate". This error occured when I only registered the
localhost-key.pem and localhost.pem file with NestJS. The problem can be solved
by concatenating the root certificate together with the localhost certificate
into one file and register that with NestJS as shown below. Second error
afterwards was "self signed certificate in certificate chain". But this must be
solved on client side.

<ol>
<li>Install mkcert</li>
<li>Create certificate and key for desired domain</li>
<li>Concatenate the root certificate and the certificate of the domain into one file (fullchain)<li>
<li><li>
<li>start NestJS by providing the fullchain certificate and the key file of the domain</li>
<ol>

```bash
# creates localhost.pem and localhost-key.pem
$mkcert localhost
# Show path of root certificate
$mkcert -CAROOT
# Concatenate root certificate and localhost certifiate into one file
cat localhost.pem > localhost-fullchain.pem
cat "$(mkcert -CAROOT)/rootCA.pem" >> localhost-fullchain.pem
```
