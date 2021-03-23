const { SchemaComposer } = require( 'graphql-compose');

const schemaComposer = new SchemaComposer();
const { RoomQuery } = require ('./rooms');

schemaComposer.Query.addFields({
    ...RoomQuery
});

module.exports = schemaComposer.buildSchema();