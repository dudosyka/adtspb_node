const graphql = require("graphql");
const Status = require('../../Entity/Status');
const User = require('../../Entity/User');
const Association = require('../../Entity/Association');

module.exports = new graphql.GraphQLObjectType({
    name: "Proposal",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        id: {
            type: graphql.GraphQLID,
        },
        association: {
            type: AssociationType,
            async resolve (obj, data) {
                return (await Association.baseCreateFrom({id: obj.association_id})).fields;
            }
        },
        child: {
            type: UserType,
            async resolve (obj, data) {
              return (await User.baseCreateFrom({id: obj.child_id})).fields;
            }
        },
        parent: {
            type: UserType,
            async resolve (obj, data) {
              return (await User.baseCreateFrom({id: obj.parent_id})).fields;
            }
        },
        status: {
            type: graphql.GraphQLList(StatusType),
            args: {
            //Should we send hidden statuses? [true|false]
                showHidden: {
                  type: graphql.GraphQLBoolean,
                }
            },
            async resolve (obj, { showHidden }) {
                console.log('OBJ 2: ', obj);
                let statuses = await Status.selectByProposal(obj, showHidden);
                console.log(statuses);
                return statuses;
            },
        },
        isHiddent: {
            type: graphql.GraphQLBoolean,
        }
    })
});

//Moved here to prevent from circular dependence err.
const AssociationType = require('./Association');
const StatusType = require('./Status');
const UserType = require('./User');



//
//
// let Validator  = function (value, onErr = "Validate error") {
//     this.value = value;
//     this.onErr = onErr;
// }
//
// Validator.prototype.result = true;
//
// Validator.prototype.reject = function () {
//     this.result = false;
//     return this;
//
// Validator.prototype.value = null;
//
// Validator.prototype.onErr = "Validate error";
//
// Validator.prototype.canBeNull = true;
//
// Validator.prototype.int = function () {
//     this.value.map(str => {
//       let num = parseInt(str, 10);
//       if (isNan(num))
//         this.reject();
//       let strFromNum = num.toString();
//       if (strFromNum.length != str.length)
//         this.reject();
//     });
//     return this;
// }
//
// Validator.prototype.email = function () {
//     this.value.map(el => {
//         if (el === null)
//             return this.reject();
//
//         if (el.search(/^[a-zA-Z0-9._-]{1,}[@]{1}[a-zA-Z]{1,}[.]{1}[a-zA-Z]{1,}$/) == -1)
//             this.reject();
//     });
//     return this;
// }
//
// Validator.prototype.phone = function () {
//     this.value.map(el => {
//         if (el === null)
//             return this.reject();
//
//         if (el.search(/^[0-9]{11}$/) == -1)
//             this.reject();
//     });
//     return this;
// }
//
// Validator.prototype.notNull = function () {
//     this.canBeNull = false;
//
//     this.value.map(el => {
//         if (el === null)
//             this.reject();
//     });
//
//     return this;
// }
//
// Validator.prototype.len = function (max = null, min = null) {
//     if (max === null && min === null)
//         return this;
//
//     if (max === null && min !== null)
//     {
//         this.value.map(el => {
//             if (el.length < min)
//                 this.reject();
//         });
//     }
//     else
//     {
//         this.value.map(el => {
//             if (el.length > max)
//                 this.reject();
//         });
//     }
//
//     return this;
// }
//
// Validator.prototype.check = function () {
//     if (this.canBeNull) {
//         return this.result;
//     }
//     else {
//         for (el in this.value) {
//             if (el === null)
//                 return false;
//         }
//         return true;
//     }
// }
//
// module.exports = Validator;
