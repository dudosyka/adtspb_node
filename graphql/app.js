const express = require("express");
const cors = require("cors");
const bodyParcer = require("body-parser");
let app = express();
app.use(cors());
app.use(bodyParcer.json());
const expressWs = require('express-ws')(app);
const {graphqlHTTP} = require("express-graphql");
const {GraphQLSchema} = require("graphql");
const {gql} = require('graphql-tag');
const User = require("./Entity/User");

const { instance } = require('./utils/Redis');

const Jwt = require('./utils/Jwt');
const bodyParser = require("body-parser");
const multer = require('multer');

const jwt = new Jwt();
const upload = multer();

const AppConfig = require('./config/AppConfig');
const EmailValidation = require('./Entity/EmailValidation');

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
	console.log(req.body);
    const endPointName = gql`
        ${req.body.query}
    `.definitions[0].selectionSet.selections[0].name.value;
    //Authorization: Bearer [token]
    let token = req.header("Authorization");

    if (typeof token === 'undefined')
    {
        res.status(403).send();
        return;
    }
    else
    {
        token = token.split(" ")[1];
        console.log(token);
        let data = await jwt.parse(token);
        console.log(data);
        if (data !== false && Object.keys(data).length != 1)
        {
            //If request is not in white list start checking email_validation
            if (!AppConfig.requestWhiteList.includes(endPointName))
            {
                //If email_confirmation parm is not set in token return refresh
                if (data.confirm == null) {
                    const response = {message: "refresh"};
                    res.status(200).end(JSON.stringify(response));
                    return;
                }
                //If email_confirmation parm set but false check it
                else if (data.confirm == false) {
                    const confirm = await EmailValidation.checkConfirmation(data.id);
                    //If email_confirmation truly false as set in token return not confirmed
                    if (confirm.__get('code') != null) {
                        const response = {message: "Not confirmed"};
                        res.status(200).end(JSON.stringify(response));
                        return;
                    }
                    //If information in token and in DB isnt same return refresh
                    else {
                        const response = {message: "refresh"};
                        res.status(200).end(JSON.stringify(response));
                        return;
                    }
                }
            }
            rootValue = {
                ...rootValue,
                viewer: {
                    id: data.id,
                    isConfirmed: data.confirm
                },
            };
        }
        else {
            res.status(403).send();
            return;
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

app.use('/endoor', (req, res, next) => {
	console.log(req.body);
    try {
        next();
    } catch (err) {
        console.log(err);
    }
});

app.use('/endoor', graphqlHTTP({
    schema: schemaForNonLogin,
    rootValue: () => {
        return {};
        // return rootValue;
    },
    graphiql: true,
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
