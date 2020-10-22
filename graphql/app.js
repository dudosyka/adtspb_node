const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const {GraphQLSchema} = require("graphql");
const User = require("./types/EntityTypes/User")

let schema = new GraphQLSchema({
    query: require('./types/Query'),
    mutation: require('./types/Mutation'),
});

let app = express();


app.use('/api', graphqlHTTP({
    schema: schema,
    rootValue: { user: async (args, request) => new Object({id: 12, name: "User"}) },
    graphiql: true
}));

app.listen(8081);