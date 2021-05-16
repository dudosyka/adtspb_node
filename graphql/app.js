const express = require("express");
const cors = require("cors");
const bodyParcer = require("body-parser");
let app = express();
app.use(cors());

const expressWs = require('express-ws')(app);
const {graphqlHTTP} = require("express-graphql");
const {GraphQLSchema} = require("graphql");
const User = require("./Entity/User");

const { instance } = require('./utils/Redis');

const Jwt = require('./utils/Jwt');
const bodyParser = require("body-parser");
const multer = require('multer');

const jwt = new Jwt();
const upload = multer();

let schema = new GraphQLSchema({
    query: require('./types/Query'),
    mutation: require('./types/Mutation'),
});

let schemaForNonLogin = new GraphQLSchema({
    mutation: require('./types/NonLogin/Mutation'),
    query: require('./types/NonLogin/Query'),
});

let rootValue = {
    viewer: null
};

//console.log("WORK!");

// TEMP: Uncommented to generate test role and rule.
// const Rbac = require('./utils/Rbac');
//
// const rbac = new Rbac();
//
// app.use('/genRoleAndRules', async (req, res, next) => {
//   const role = await rbac.addRole('common user', 'TEST ROLE.');
//   const rule = await rbac.addRule('simple rule', 'TEST RULE.');
//   rbac.assign(role, rule);
//   rbac.addRoleToUser(1, role);
//   rbac.minimize();
//   res.send();
// });

//Check user token. If valid -> next(), invalid -> HTTP 403
app.use('/api', async (req, res, next) =>
{
    //Authorization: Bearer [token]
    let token = req.header("Authorization");

    if (typeof token === 'undefined')
    {
        res.status(403).send();
    }
    else
    {
        token = token.split(" ")[1];
        console.log(token);
        let data = await jwt.parse(token);
        console.log(data);
        if (data !== false && Object.keys(data).length != 1)
        {
            let usr = await User.createFrom(data);
            // if (usr.__get("isConfirmed").code == null) {
                rootValue = {
                    ...rootValue,
                    viewer: usr,
                };
            // }
            // else {
                // res.status(403).send("acount is not confirmed");
            // }
        }
        else {
            res.status(403).send();
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

//app.use('/endoor', (req, res, next) => { console.log('WORK!'); res.end("RESPONSE"); });

app.use('/endoor', graphqlHTTP({
    schema: schemaForNonLogin,
    rootValue: () => {
        return {};
        // return rootValue;
    },
    graphiql: true
}));

//We really needn`t chat? (Delete if yes)
//Listen for WS connections
// expressWs.getWss().on('connection', (ws) => {
//     //When connect get current from rootValue
//     let id = rootValue.user.fields.id;
//
//     //Setting id to WS and redis
//     ws.id = id;
//     instance.hmset(['ws', id, id], (err, res) => {
//         // console.log(err,res);
//     });
//     //When connection closed delete id from redis
//     ws.on('close', () => {
//         instance.hdel(['ws', ws.id], (err, res) => {
//             // console.log(res);
//         });
//     })
// });
// app.wss = expressWs.getWss();

module.exports = app;
