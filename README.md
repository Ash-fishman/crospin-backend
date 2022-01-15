# crospin-backend

## Installation Guide

### Prerequisites

- Node 16 or above

### Steps to follow

- _npm install_
- To generate datamodel
  - On Dev Database
    - npm run db:rollback ( if you want to remove everything !! Be careful !! )
    - npm run db:migrate
  - On Test Database
    - npm run db:rollback:test 
    - npm run db:migrate:test
- _npm test_
- To generate code coverage: _npm run test:cov_
- To run a single test: _TESTTORUN="Test name" npm t_
- To run a test suite: _SUITETORUN="Suite name" npm t_
- To create a migration: _npm run make:migration_

### Verification

In order to check if backend started correctly, just open http://localhost:3001/healthcheck in your browser

## Swagger

Swagger is responding on http://localhost:3001/docs/

## Development tips

### Compilation

It is strongly recommended that, to check project is following typescript rules defined on _.eslint.rc_, you run this command:
`npm run lint && npm run build`

## Tests

To run test suite, you must run:
`npm test`

And, to generate **code coverage** on _coverage_ folder on your project directory, you must run:
`npm run test:cov`
To see coverage report, just execute index.html file on _coverage/lcov-report_ directory

To create a new test, all you have to do is:

- Register your new test on <crospin-backend>/test/src/tests/index.ts file
- Decorate test class with **@TestSuite** decorator and test method with **@Test** decorator
  Example:

```
@TestSuite('Categories Suite')
export class CategoriesTest extends AbstractTestSuite {
  @Test('Get All')
  public async getAll() {
    const { body: categories } = await this.httpGet('/categories/get-all').expect(HttpStatus.OK);
    expect(categories.length).toBeGreaterThan(0);
  }
}
```

To run a specific Test Suite, you can run: `SUITETORUN='Suite Name' npm t`, and to run a specific Test, you can run: `TESTTORUN='Suite Name' npm t`

## Swagger

Swagger is a nice tool to generate API's documentation. There are several decorators you need to add on every DTO and API. Examples:

- DTO

```
export class CategoryCreateDto {
  @ApiProperty()    // Swagger decorator
  name: string;

  @ApiProperty()    // Swagger decorator
  url: string;
}
```

- API

```
  @ApiResponse({ status: HttpStatus.CREATED })      // Swagger decorator
  create(@Body() dto: CategoryCreateDto): Promise<Category> {
    return this.categoryService.create(dto);
  }
```

You can see Swagger documentation starting the app and executing in your browser:
`http://localhost:3001/docs`

## Migrations

`knex` is the library on this project to run and create migration and seeds files. Of course, migrations and seeds must be executed on **dev** and **test** database.

- To run migrations: `npm run db:migrate` and `npm run db:migrate:test`
- To rollback migrations: `npm run db:rollback` and `npm run db:rollback:test`
- To create a migration: `npm run make:migration`

## Transactions

Every request that changes database state **MUST** be wrapped in a database transaction. In order to do that, you must use **@Transactional()** decorator. Example:

```
@Transactional()
create(@Body() dto: CategoryCreateDto): Promise<Category> {
    return this.categoryService.create(dto);
}
```

## Logger

Fine library called `winston` its been used to log app messages. `winston` supports several core transports. In order to configure your app log level, just control it via **LOG_LEVEL** var on .env files

**DONT BE SHY ADDING LOG MESSAGES**
