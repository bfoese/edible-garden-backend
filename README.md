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


```
## API Documentation
```bash
# Browsing the Swagger Documentation of the exposed Endpoints
http://localhost:3000/api

# Downloadable JSON File of the Endpoints
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
migration process. Migration files that needs to be tested as well as the final ones need to be copied into
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
Auto-generated migration files will be created in a local directory


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

## Helpful Resources

<ul>
<li>TypeORM Migrations: <a href="https://wanago.io/2019/01/28/typeorm-migrations-postgres/">wanago.io - TypeORM Migrations</a> </li>
<li>TypeORM Initial Data Seed: <a href="https://medium.com/@bansalsushil_34403/how-to-seed-typeorm-d9637a5948cc">Medium.com - How to seed TypeORM</a> </li>
</ul>
