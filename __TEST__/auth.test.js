const assert        = require('assert');
const api           = require('../src/api');
const Context       = require('./../src/database/base/context.strategy');
const PostgresDB    = require('./../src/database/postgres/postgresSQL.strategy');
const UserSchema    = require('./../src/database/postgres/schemas/user.schema');

let app = {}

const USER = 
{
    username: 'xuxadasilva',
    password: '321123'
}

const USER_DB = 
{
    ...USER,
    password: '$2b$04$SdlyEJsy.o5UgsgVr5csJ.ralZVyPviGH80BOb0zJCTSis30RB8Ba'
}


describe('Auth test suite', function ()
{
    this.beforeAll(async () => 
    {
        app = await api

        const connectionPostgres = await PostgresDB.connect()
        const model = await PostgresDB.defineModel(connectionPostgres, UserSchema)
        const postgresModel = new Context(new PostgresDB(connectionPostgres, model));
        await postgresModel.update(null, USER_DB, true)
    });

    it('deve obter um token', async () =>
    {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(JSON.parse(result.payload).token.length > 10)
    });

    it('deve retornar não autorizado ao tentar obter um token com login errado', async () =>
    {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload:
            {
                username: 'jncjcoder',
                password: '1234'
            }
        });
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(JSON.parse(result.payload).error, "Unauthorized")
    })
});