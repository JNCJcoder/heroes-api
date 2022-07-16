const Joi = require('joi');

const BaseRoute = require('./base.routes');

class HeroRoutes extends BaseRoute
{
    constructor(database)
    {
        this.database = database;
    }

    list()
    {
        return {
            path: '/herois',
            method: 'GET',
            config:
            {
                tags: ['api'],
                description: 'Listar Herois',
                notes: 'Retorna a base inteira de Herois.',
                validate:
                {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown()
                }
            },
            handler: (_request, _headers) => 
            {
                return this.database.read()
            }
        }
    }

    create()
    {
        return {
            path: '/herois',
            method: 'POST',
            config:
            {
                tags: ['api'],
                description: 'Cadastrar Herois',
                notes: 'Cadastra um Heroi por nome e poder',
                validate:
                {
                    failAction: (_request, _h, err) =>
                    {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    payload:
                    {
                        nome: Joi.string().max(100).required(),
                        poder: Joi.string().max(30).required()
                    }
                },
            },
            handler: (request, _headers) =>
            {
                const payload = request.payload
                return this.db.create(payload)
            }
        }
    }

    update()
    {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config:
            {
                tags: ['api'],
                description: 'Atualizar Herois',
                notes: 'Atualiza um Heroi por ID',
                validate:
                {
                    failAction: (_request, _h, err) =>
                    {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params:
                    {
                        id: Joi.string().required()
                    },
                    payload:
                    {
                        nome: Joi.string().max(100),
                        poder: Joi.string().max(30)
                    }
                },
            },
            handler: (request, _headers) =>
            {
                const payload = request.payload;
                const id = request.params.id;
                return this.db.update(id, payload)
            }
        }
    }

    delete()
    {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Remover Herois',
                notes: 'remove um heroi por id',
                validate:
                {
                    failAction: (_request, _h, err) =>
                    {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params:
                    {
                        id: Joi.string().required()
                    }
                }
            },
            handler: (request, _headers) =>
            {
                const id = request.params.id;
                return this.db.delete(id)
            }
        }
    }
}

module.exports = HeroRoutes;