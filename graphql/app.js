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
    viewer: null
};

// app.use(bodyParcer.urlencoded({ extended: true }));

//Auth middleware
app.use(async (req, res, next) => {
    let token = req.header("Authorization");

    if (typeof token === 'undefined')
    {
        res.status(403).send();
    }
    else
    {
        token = token.split(" ")[1];
        let data = await jwt.parse(token);
        if (data !== false)
        {
            let count = 0;
            expressWs.getWss().clients.forEach((curVal) => {
                count++;
            });
            rootValue = {
                ...rootValue,
                viewer: await User.createFrom(data)
            };
        }
        console.log(rootValue);
    }
    next();
});

app.use('/api', graphqlHTTP({
    schema: schema,
    rootValue: () => {
        return rootValue;
    },
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
