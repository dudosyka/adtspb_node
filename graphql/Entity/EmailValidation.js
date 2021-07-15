const baseEntity = require('./BaseEntity');

const Mail = require('../utils/Mail');
const mail = new Mail();

let EmailValidation = function () {}

EmailValidation.prototype = Object.assign(EmailValidation.prototype, baseEntity.prototype);

EmailValidation.prototype.getInstance = () => EmailValidation;

EmailValidation.prototype.fields = {
    id: null,
    code: null,
    user_id: null,
    timestamp: null,
};

EmailValidation.prototype.checkConfirmation = async function (user_id) {
    let res = await this.db.select(this, '`user_id` = ?', [ user_id ]);
    if (res.length <= 0) {
        this.__set('code', null);
        this.__set('timestamp', null);
        this.__set('user_id', user_id);
        return this;
    }
    else {
        const model = this.newModel();
        model.fields = {...res[0]};
        return model;
    }
}

EmailValidation.prototype.confirmUser = async function (code, user_id) {
    let res = await this.db.select(this, '`user_id` = ?', [ user_id ]);
    let answ = {
        code: null,
        user_id: user_id
    }
    if (res.length > 0)
    {
        if (res[0].code == code)
        {
            this.db.query('DELETE FROM `email_validation` WHERE `user_id` = ?', [ user_id ]);
            return answ;
        }
        else
        {
            answ.code = code;
            return answ;
        }
    }
    return answ;
}

EmailValidation.prototype.generateToken = function (l) {
    let res = "";
    let getRandomSymbol = () => {
        const symbols = "a,b,c,d,e,f,g,h,j,k,,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,J,K,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,1,2,3,4,5,6,7,8,9".split(",");
        return symbols[Math.floor(Math.random() * (symbols.length - 1))];
    }
    for (let i = 0; i < l; i++) {
        let symbol = getRandomSymbol();
        while (typeof symbol == 'undefined')
        {
            symbol = getRandomSymbol();
        }
        res += symbol;
    }
    return res;
}

EmailValidation.prototype.setOnConfirmation = async function (user_id, email, fullname) {
    //Rewrite code if exists
    let res = await this.db.select(this, '`user_id` = ?', [ user_id ]);
    this.__set('code', this.generateToken(4));
    this.__set('user_id', user_id);
    this.__set('timestamp', Math.floor(Date.now() / 1000));
    // mail.sendEmail(email, "Код подтверждения" , "Здравствуйте, " + fullname + "! Код подтверждения для вашего аккаунта в личном кабинете Академии Цифровых Технологий: " + this.__get('code') + " (Никому не сообщайте его)");
    if (res.length > 0) {
        this.__set('id', res[0].id);
        await this.update();
    }
    else {
        await this.save();
    }
    return this;
}

EmailValidation.prototype.table = "email_validation";

module.exports = (new EmailValidation());
