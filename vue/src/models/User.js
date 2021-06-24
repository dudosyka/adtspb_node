import {Validator} from "../utils/Validator";
import {Parser} from "../utils/Parser";

let User = {};

User.login = async function ({login, pass}) {
    let req = `
      mutation($login: String, $password: String) {
          login(login: $login, password: $password) {
              token, id
          }
      }
    `;

    const errs = [];
    if (!Validator.validateNotEmpty(pass))
        errs.push('password');

    if (!Validator.validateEmail(login) && !Validator.validatePhone(login))
        errs.push('login');

    if (errs.length)
        throw {msg: errs};

    const data = {
        login: login,
        password: pass
    }

    return await endoor.request(req, data)
    .then(async data => {
        const isConfirmed = await this.checkConfirmation(data.login.id);
        console.log(isConfirmed);
        console.log(data.login.token);
        if (isConfirmed)
            this.auth(data.login.token);
        else
            this.setOnConfirm();
    });
}

User.auth = function (token) {
    localStorage.setItem('token', token);
    window.location = window.location;
    return;
}

User.checkConfirmation  = async function (id) {
    let req = `
      query ($user_id: Int) {
        checkUserConfirmation (user_id: $user_id) {
            isConfirmed
        }
      }
    `;

    const data = {
        user_id: id
    };

    return await endoor.request(req, data).then(check => {
        return check.checkUserConfirmation.isConfirmed;
    }).catch(err => { return err; });
}

User.setOnConfirm = function () {
    // window.location = '/confirmation';
}

User.signUp = async function (data) {
    data.phone = "8"+data.phone;
    let errs = [];
    const validateRes = Validator.validateNotEmpty(data, true);

    if (validateRes !== true)
        errs = validateRes;

    if (!Validator.validatePhone(data.phone))
        errs.push('phone');

    if (!Validator.validateEmail(data.email))
        errs.push('email');

    if (errs.length)
        throw {msg: errs};

    let request = `
      mutation($user: UserInput) {
        createUser(user: $user) {
          token, id, status
        }
      }
    `;

    return await endoor.request(request, { user: data })
    .then(async res => {
          const isConfirmed = await this.checkConfirmation(res.createUser.id);
          if (isConfirmed)
              this.auth(res.createUser.token);
          else
              this.setOnConfirm();
    });
}

User.getParentRequests = async function () {
    let req = `
      query {
        getParentRequests {
            id, name, surname, phone
        }
      }
    `

    return await api.request(req)
      .then(data => {
        return data.getParentRequests;
    });

}

User.agreeParentRequest = async function (request_id, userData) {
    let errs = [];
    const validateRes = Validator.validateNotEmpty(userData, true);

    if (validateRes !== true)
        errs = validateRes;

    if (errs.length)
        throw {msg: errs};

    let req = `
      mutation ($request_id: Int, $userData: UserInput) {
        agreeParentRequest(request_id: $request_id, newData: $userData)
      }
    `

    let data = {
      request_id
    }

    return await api.request(req, data).then(data => {
        return data.agreeParentRequest;
    });
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
           birth_certificate: null,
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
        getChildren {
            `+ fieldsOnGet +`
        }
      }
    `;

    console.log(req);

    return await api.request(req).then(data => {
        console.log(data);
        data.getChildren.map(el => {
            if (!parse)
                return el;
            const birth = Parser.timestampToObj(el.birthday);
            el.birthday = birth.year + "-" + birth.month + "-" + birth.day;

            el.registration_address = Parser.addressToObj(el.registration_address);
            el.residence_address = Parser.addressToObj(el.residence_address);

            el.masked = {};

            let formattingPhone = el.phone.split('');
            formattingPhone.shift();
            el.masked.phone = formattingPhone.join('');

            el.sex = el.sex;

            return el;
        });
        return data.getChildren;
    });
}

User.editMainData = async function (obj, target_id = 0) {
    let req = `
    mutation ($data: UserInput, $target_id: Int) {
        editMainUserData(newData: $data, target_id: $target_id)
    }
    `;

    let errs = [];
    console.log(obj);
    const validateRes = Validator.validateNotEmpty(obj, true);

    if (validateRes !== true)
        errs = validateRes;

    obj.phone = "8" + obj.phone;
    if (!Validator.validatePhone(obj.phone))
        errs.push('phone');

    if (!Validator.validateEmail(obj.email))
        errs.push('email');

    if (errs.length)
        throw {msg: errs};

    obj.id = Number(obj.id)

    let data = {
        data: {
            name: obj.name,
            surname: obj.surname,
            lastname: obj.lastname,
            email: obj.email,
            phone: obj.phone,
            sex: obj.sex,
        },
        target_id: obj.id
    }

    return await api.request(req, data).then(async data => {
        console.log(data)
        // this.edit.message = 'Данные отпралены успешно'
        return await this.editExtraData(obj, target_id);
    });
}

User.editExtraData = async function (obj, target_id) {
    let req = `
      mutation ($data: UserInput, $target_id: Int) {
        editExtraUserData(newData: $data, target_id: $target_id)
      }
    `

    obj.registration_address = Parser.objToAddress(obj.registration_address);
    obj.residence_address = Parser.objToAddress(obj.residence_address);

    obj.birthday = (new Date(obj.birthday)).getTime();

    obj.id = Number(obj.id);

    let data = {
      data: {
        birthday: obj.birthday,
        birth_certificate: obj.birth_certificate,

        state: obj.state,
        relationship: obj.relationship,
        studyPlace: obj.studyPlace,
        ovz: obj.ovz,
        ovz_type: { id: obj.ovz_type.id },
        disability: obj.disability,
        disability_group: { id: obj.disability_group.id },

        registration_address: obj.registration_address,
        registration_flat: obj.registration_flat,

        residence_address: obj.residence_address,
        residence_flat: obj.residence_flat,
      },
      target_id: obj.id
  };

    return await api.request(req, data)
      .then(data => {
        console.log(data)
        return data.editExtraUserData;
    });
}

User.removeChild = async function (id, comment, remove_account) {
      let req = `
        mutation ($child_id: Int, $removeAccount: Boolean, $comment: String) {
          removeChild(child_id: $child_id, removeAccount: $removeAccount, comment: $comment)
        }
      `;

      let data = {
        child_id: id,
        removeAccount: remove_account,
        comment: comment
      }

      return await api.request(req, data);
}

export {User};
