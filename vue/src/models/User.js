import {Validator} from "../utils/Validator";
import {Parser} from "../utils/Parser";
import {Corrector} from "../utils/Corrector";
import {AccessControl} from '../utils/AccessControl'

let User = {};

User.login = async function ({login, pass}) {
    let req = `
      mutation($login: String, $password: String) {
          login(login: $login, password: $password) {
              token, id, isConfirmed
          }
      }
    `;

    const errs = [];
    if (!Validator.validateNotEmpty(pass))
        errs.push('password');

    if (login.indexOf('@') == -1) {
        if (!Validator.validatePhone(login, true))
            errs.push('login');
        else {
            login = login.substr(1);
        }
    }
    else {
        if (!Validator.validateEmail(login))
            errs.push('login');
    }

    if (errs.length)
        throw {msg: errs};

    const data = {
        login: login,
        password: pass
    }

    return _request("endoor", req, data).then(data => {
        console.log(data);
        if (data === undefined)
            return;
        this.auth(data.login.token);

        if (data.login.isConfirmed)
            this.auth(data.login.token, true);
        else
            this.setOnConfirm();
    });
}

User.auth = function (token, redir = false) {
    localStorage.setItem('token', token);
    if (redir)
        window.location = window.location;
    return;
}

User.checkConfirmation  = async function (id) {
    let req = `
      query {
          user {
              checkConfirmation {
                  user_id, isConfirmed
              }
          }
      }
    `;

    const data = {
    };
    try {
        refreshApiToken();
    } catch (err) {
        window.location = window.location;
    }

    return await _request("api", req, data).then(check => {
        console.log(check);
        return check.user.checkConfirmation.isConfirmed;
    }).catch(err => {
        console.error(err);
        throw err;
    });
}

User.setOnConfirm = function () {
    window.location = '/confirmation';
}

User.confirmUser = async function (code) {
  let req = `
    mutation($code: String) {
        user {
            confirm(code: $code) {
                isConfirmed, token
            }
        }
    }
  `;

  let data = {
    code: code,
  };

  return _request("api", req, data)
    .then(data => {
        console.log(data);
      if (data.user.confirm.isConfirmed) {
          AccessControl.refreshApiToken(data.user.confirm.token);
          AccessControl.refreshAccess();
          window.location = '/';
          return true;
      }
      return false;
  }).catch(err => {
      console.error(err);
      throw err;
  });
}

User.sendNewConfirmationCode = async function () {
    let req = `
      mutation {
          user {
            generateNewConfirmationCode {
                isConfirmed
            }
          }
      }
    `;

    return _request("api", req).catch(err => {
        console.error(err);
        throw err;
    });
}

User.signUp = async function (data, makeParent = false) {
    console.log(data);

    let errs = [];
    const validateRes = Validator.validateNotEmpty(data, true, ['lastname']);

    if (validateRes !== true)
        errs = validateRes;

    if (!Validator.validatePhone(data.phone))
        errs.push('phone');

    if (!Validator.validateEmail(data.email))
        errs.push('email');

        console.log(errs);
    if (errs.length) {
        data.phone = data.phone.substr(1);
        throw {msg: errs};
    }

    let request = `
      mutation($user: UserInput, $makeParent: Boolean) {
        createUser(user: $user, makeParent: $makeParent) {
          token, id, status
        }
      }
    `;

    return await _request("endoor", request, { user: data, makeParent: makeParent })
    .then(async res => {
          this.auth(res.createUser.token);
          const isConfirmed = await this.checkConfirmation(res.createUser.id);
          if (isConfirmed)
              this.auth(res.createUser.token, true);
          else
              this.setOnConfirm();
    });
}

User.getParentRequests = async function () {
    let req = `
      query {
          user {
            parentRequests {
                id, name, surname, phone
            }
          }
      }
    `

    return await _request("api", req)
      .then(data => {
        return data.user.parentRequests;
    });

}

User.agreeParentRequest = async function (parent_id, userData) {
    parent_id = Number(parent_id);
    console.log(parent_id, userData);
    let errs = [];
    const validateRes = Validator.validateNotEmpty(userData, true, ['lastname', 'registration_flat', 'residence_flat']);

    if (validateRes !== true)
        errs = validateRes;

    if (errs.length)
        throw {msg: errs};

    let req = `
      mutation ($parent_id: Int, $userData: UserInput) {
          user {
              agreeParentRequest(parent_id: $parent_id, newData: $userData)
          }
      }
    `;

    userData.registration_address = Parser.objToAddress(userData.registration_address);
    userData.residence_address = Parser.objToAddress(userData.residence_address);

    userData.birthday = Parser.birthdayToTimestamp(userData.birthday);

    let data = {
      parent_id,
      userData
    }

    return await _request("api", req, data).then(data => {
        return data.agreeParentRequest;
    });
}

function userDataProcessing(entity, parse = true) {
    console.log(entity);
    let errors = {};

    const birth = Parser.timestampToObj(entity.birthday ?? Date.now());
    entity.birthday = birth.year + "-" + birth.month + "-" + birth.day;

    entity.registration_address = Parser.addressToObj(entity.registration_address);
    entity.residence_address = Parser.addressToObj(entity.residence_address);

    Object.keys(entity).map(field => {
       const fieldValue = entity[field];
       if (typeof fieldValue === 'object' && fieldValue !== null) {
           Object.keys(fieldValue ?? {}).map(subfield => {
               if (errors[field])
                  errors[field][subfield] = false;
               else
                  errors[field] = { [subfield]: false };
           });
       }
       else {
           errors[field] = false;
       }
    });

    if (!parse)
        return {
            data: entity,
            errors
        };

    if (entity.phone) {
        entity.masked = {
            phone: entity.phone
        };
    }

    return {
        data: entity,
        errors
    };
}

User.getChildren = async function (fields = null, parse = true) {
    if (fields === null) {
        fields = {
           id: null,
           name: null,
           surname: null,
           lastname: null,
           email: null,
           phone: null,
           sex: null,
           birthday: null,
           state: null,
           relationship: null,
           studyPlace: null,
           ovz: null,
           ovz_type: {
               id: null
           },
           disability: null,
           disability_group: {
               id: null,
           },
           registration_address: null,
           registration_flat: null,
           residence_address: null,
           residence_flat: null
       };
    }
    const fieldsOnGet = Parser.objToGraphQlQuery(fields);

    let req = `
      query {
          user {
            children {
                `+ fieldsOnGet +`
            }
          }
      }
    `;

    return await _request("api", req).then(data => {
        const res = data.user.children.map(el => userDataProcessing(el, parse));
        return res;
    });
}

User.getFullData = async function (fields = null, id = null, parse = true) {
    if (fields === null) {
        fields = {
           id: null,
           name: null,
           surname: null,
           lastname: null,
           email: null,
           phone: null,
           sex: null,
           birthday: null,
           state: null,
           relationship: null,
           studyPlace: null,
           ovz: null,
           ovz_type: {
               id: null
           },
           disability: null,
           disability_group: {
               id: null,
           },
           registration_address: null,
           registration_flat: null,
           residence_address: null,
           residence_flat: null
       };
    }
    const fieldsOnGet = Parser.objToGraphQlQuery(fields);

    let req = `
      query ($id: Int) {
          user {
            data (id: $id) {
                `+ fieldsOnGet +`
            }
          }
      }
    `;

    id = id === null ? null : Number(id);

    const data = {
        id: id == 0 ? null : id
    };

    return await _request("api", req, data).then(data => {
        const el = data.user.data;

        return userDataProcessing(el, parse);
    });
}

User.editMainData = async function (obj, target_id = 0) {
    let req = `
    mutation ($data: UserInput, $target_id: Int) {
        user {
            editMainData(newData: $data, target_id: $target_id)
        }
    }
    `;

    let errs = [];
    const validateRes = Validator.validateNotEmpty(obj, true, [ 'lastname' ]);

    if (validateRes !== true)
        errs = validateRes;

    if (obj.phone) {
        if (!Validator.validatePhone(obj.phone))
            errs.push('phone');
    }

    if (obj.email) {
        if (!Validator.validateEmail(obj.email))
            errs.push('email');
    }

    if (errs.length)
        throw {msg: errs};

    if (Object.keys(obj).includes("sex")) {
        obj.sex = Number(obj.sex);
    }

    let data = {
        data: obj,
        target_id: target_id
    }

    return _request("api", req, data);
}

User.editExtraData = async function (obj, target_id = 0) {
    let req = `
      mutation ($data: UserInput, $target_id: Int) {
        user {
            editExtraData(newData: $data, target_id: $target_id)
        }
      }
    `;

    const validateRes = Validator.validateNotEmpty(obj, true, [ 'lastname', 'registration_flat', 'residence_flat' ]);

    if (validateRes !== true)
        throw validateRes;

    if (obj.registration_address)
        obj.registration_address = Parser.objToAddress(obj.registration_address);

    if (obj.residence_address)
        obj.residence_address = Parser.objToAddress(obj.residence_address);

    if (obj.birthday)
        obj.birthday = Parser.birthdayToTimestamp(obj.birthday);

    if (obj.disability_group) {
        if (typeof obj.disability_group === 'string') {
            obj.disability_group = {
                id: Number(obj.disability_group)
            };
        }
    }

    if (obj.ovz_type) {
        console.log(obj.ovz_type);
        if (typeof obj.ovz_type === 'string') {
            obj.ovz_type = {
                id: Number(obj.ovz_type)
            };
        }
    }

    let data = {
      data: obj,
      target_id: target_id
  };

    return await _request("api", req, data)
      .then(data => {
        console.log(data)
        return data.editExtraUserData;
    });
}

User.addChild = async function (child) {
    const req = `
      mutation ($user: UserInput) {
          user {
              createChild(child: $user)
          }
      }
    `;

    let errs = [];
    const validateRes = Validator.validateNotEmpty(child, true, ['lastname', 'residence_flat', 'registration_flat']);

    if (validateRes !== true)
        errs = validateRes;

    if (!Validator.validatePhone(child.phone))
        errs.push('phone');

    if (!Validator.validateEmail(child.email))
        errs.push('email');

    if (errs.length)
        throw {msg: errs};

    child.registration_address = Parser.objToAddress(child.registration_address);
    child.residence_address = Parser.objToAddress(child.residence_address);

    child.birthday = Parser.birthdayToTimestamp(child.birthday);

    child.ovz = Number(child.ovz)
    child.ovz_type.id = Number(child.ovz_type.id)
    child.disability = Number(child.disability)
    child.disability_group.id = Number(child.disability_group.id)

    let data = {
      user: child
    };

    return _request("api", req, data)
      .then(data => {
        return data.user.createChild;
    });
}

User.sendParentRequest = async function (login) {
  let req = `
    mutation ($child_data: String) {
        user {
            addChild(child_data: $child_data)
        }
    }
  `

  let data = {
      child_data: login
  }

  return _request("api", req, data).then(data => {
        return data.user.addChild;
  }).catch(err => {
      console.log(err);
      throw err;
  });
}

User.removeChild = async function (id, comment, remove_account) {
  let req = `
    mutation ($child_id: Int, $removeAccount: Boolean, $comment: String) {
        user {
            removeChild(child_id: $child_id, removeAccount: $removeAccount, comment: $comment)
        }
    }
  `;

  let data = {
    child_id: id,
    removeAccount: remove_account,
    comment: comment
  };

  return await _request("api", req, data);
}

User.calculateAge = function (birthday) {
    console.log(birthday)
    let d = birthday.split('-');
    if( typeof d[2] !== "undefined" ) {
        birthday = d[2]+'.'+d[1]+'.'+d[0];
        return ((new Date().getTime() - new Date(birthday)) / (24 * 3600 * 365.25 * 1000)) | 0;
    }
    return 0;
}

User.getDataOnEdit = function (target = 0) {
    const req = `
        query ($target: Int) {
            user {
                dataOnEdit(target_id: $target) {
                    field, new_value
                }
            }
        }
    `;

    const data = {
        target: Number(target)
    };

    return _request("api", req, data).then(data => {
        return data.user.dataOnEdit.map(el => {
            if (el.field == 'registration_address' || el.field == 'residence_address') {
                el.new_value = Parser.addressToObj(el.new_value);
            }
            if (el.field == 'birthday') {
                const birth = Parser.timestampToObj(Number(el.new_value));
                el.new_value = birth.year + "-" + birth.month + "-" + birth.day;
            }
            if (el.field == 'disability_group' || el.field == 'ovz_type') {
                el.new_value = {
                    id: (Number(el.new_value) - 1)
                };
            }
            return el;
        });
    }).catch(err => {
        console.log(err);
    });
}

export {User};
