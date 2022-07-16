const Joi = require('joi')
const Boom = require('@hapi/boom')
const Jwt = require('jsonwebtoken')

const BaseRoute = require('./base.routes');
const PasswordHelper = require('../helpers/password.helper')

class AuthRoutes extends BaseRoute
{
    constructor(key, database)
    {
        super();
        this.secret = key;
        this.database = database;
    }

    login()
    {
        return {
            path: '/login',
            method: 'POST',
            config:
            {
                auth: false,
                tags: ['api'],
                description: 'Fazer Login',
                notes: 'Retorna o Token',
                validate:
                {
                    payload:
                    {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, _headers) =>
            {
                const { username, password } = request.payload;

                const [ user ] = await this.database.read({
                    username: username.toLowerCase()
                });

                if (!user)
                {
                    return Boom.unauthorized('O Usuario informado não existe.')
                }

                const match = await PasswordHelper.comparePassword(password, user.password)

                if (!match)
                {
                    return Boom.unauthorized('O Usuario e senha são invalidos!')
                }

                return {
                    token: Jwt.sign({ username: username }, this.secret)
                }
            }
        }
    }
}
module.exports = AuthRoutes