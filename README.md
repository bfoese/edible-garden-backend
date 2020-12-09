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

```bash
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
$ docker exec -it <db-container-name> psql -U postgres

Connecting to a database:
$ \c <databaseName>

List all tables:
$ \d

Details of a specific table:
\d+ <table_name>

Exit the container:
\q

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

## Helpful Resources

<ul>
<li>TypeORM Migrations: <a href="https://wanago.io/2019/01/28/typeorm-migrations-postgres/">wanago.io - TypeORM Migrations</a> </li>
<li>TypeORM Initial Data Seed: <a href="https://medium.com/@bansalsushil_34403/how-to-seed-typeorm-d9637a5948cc">Medium.com - How to seed TypeORM</a> </li>
</ul>
