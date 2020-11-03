const express = require("express");
const bodyParcer = require("body-parser");
let app = express();

const expressWs = require('express-ws')(app);
const {graphqlHTTP} = require("express-graphql");
const {GraphQLSchema} = require("graphql");
const User = require("./Entity/User");

const { instance } = require('./utils/Redis');

const Jwt = require('./utils/Jwt');

const jwt = new Jwt();

let schema = new GraphQLSchema({
    query: require('./types/Query'),
    mutation: require('./types/Mutation'),
});

let rootValue = {
    user: null
};

// app.use(bodyParcer.urlencoded({ extended: true }));

//Auth middleware
app.use(async (req, res, next) => {
    let token = req.header("Authorization").split(" ")[1];
    console.log(token);
    let data = await jwt.parse(token);
    console.log(data);
    if (data !== false)
    {
        let count = 0;
        expressWs.getWss().clients.forEach((curVal) => {
            count++;
        });
        rootValue = {
            ...rootValue,
            user: await User.createFrom(data)
        };
    }
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
