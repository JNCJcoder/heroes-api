const path          = require('path');
const { ok }        = require('assert');
const { config }    = require('dotenv');

const Hapi          = require('@hapi/hapi')
const HapiJwt       = require('hapi-auth-jwt2')
const HapiSwagger   = require('hapi-swagger')
const Vision        = require('@hapi/vision')
const Inert         = require('@hapi/inert')

const env = process.env.NODE_ENV || "dev";
ok(env === "prod" || env === "dev", "environment inválida! Ou prod ou dev");

const configPath = path.resolve(__dirname, '..', 'config', `.env.${env}`);

config({
    path: configPath
});

const Context = require('./database/base/context.strategy');
const MongoDB = require('./database/mongodb/mongodb.strategy');
const PostgresDB = require('./database/postgres/postgresSQL.strategy');

const HeroRoutes = require('./routes/hero.routes');
const UtilRoutes = require('./routes/util.routes');
const AuthRoutes = require('./routes/auth.routes');

const HeroSchema = require('./database/mongodb/schemas/hero.schema');
const UserSchema = require('./database/postgres/schemas/user.schema');

const MINHA_CHAVE_SECRETA = process.env.JWT_KEY;

const swaggerConfig =
{
    info:
    {
        title: 'API Herois',
        version: 'v1.0'
    },
    lang: 'pt'
}

const app = new Hapi.Server({
    port: process.env.PORT
})

function mapRoutes(instance, methods)
{
    return methods.map(method => instance[method]())
}

async function main()
{
    const connectionPostgres = await PostgresDB.connect();
    const model = await PostgresDB.defineModel(connectionPostgres, UserSchema);
    const postgresModel = new Context(new PostgresDB(connectionPostgres, model));

    const connection = MongoDB.connect();
    const mongoDb = new Context(new MongoDB(connection, HeroSchema));


    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerConfig
        }
    ]);

    app.auth.strategy('jwt', 'jwt', {
        key: MINHA_CHAVE_SECRETA,
        validate: (_dado, _request) =>
        {
            return {
                isValid: true
            }
        }
    });

    app.auth.default('jwt');

    app.route([
        ...mapRoutes(new HeroRoutes(mongoDb), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(MINHA_CHAVE_SECRETA, postgresModel), AuthRoutes.methods()),
        ...mapRoutes(new UtilRoutes(), UtilRoutes.methods())
    ]);

    await app.start();
    console.log('server running at', app.info.port);

    return app;
}

module.exports = main();