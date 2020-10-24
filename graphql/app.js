const express = require("express");
let app = express();

const expressWs = require('express-ws')(app);
const {graphqlHTTP} = require("express-graphql");
const {GraphQLSchema} = require("graphql");
const User = require("./Entity/User");

const { instance } = require('./utils/Redis');

let schema = new GraphQLSchema({
    query: require('./types/Query'),
    mutation: require('./types/Mutation'),
});

let rootValue = {};

//Auth middleware
app.use((req, res, next) => {
    let count = 0;
    expressWs.getWss().clients.forEach((curVal) => {
        count++;
    });
    rootValue = {
        ...rootValue,
        user: new User({
            id: count
        })
    };
    next();
});

app.use('/api', graphqlHTTP({
    schema: schema,
    rootValue: rootValue,
    graphiql: true
}));

//Listen for WS connections
expressWs.getWss().on('connection', (ws) => {
    //When connect get current from rootValue
    let id = rootValue.user.fields.id;

    //Setting id to WS and redis
    ws.id = id;
    instance.hmset(['ws', id, id], (err, res) => {
        // console.log(err,res);
    });

    //When connection closed delete id from redis
    ws.on('close', () => {
        instance.hdel(['ws', ws.id], (err, res) => {
            // console.log(res);
        });
    })
});

app.listen(8081);