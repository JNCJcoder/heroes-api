const IDatabase = require('./IDatabase');

class ContextStrategy extends IDatabase
{
    constructor(database)
    {
        super();
        this._database = database;
    }

    isConnected()
    {
        return this._database.isConnected();
    }

    connect()
    {
        return this._database.connect()
    }

    create(item)
    {
        return this._database.create(item);
    }

    read(item)
    {
        return this._database.read(item);
    }

    update(id, item, upsert)
    {
        return this._database.update(id, item, upsert);
    }

    delete(id)
    {
        return this._database.delete(id);
    }
}

module.exports = ContextStrategy;