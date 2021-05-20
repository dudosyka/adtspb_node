const baseEntity = require('./BaseEntity');

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
        return await this.baseCreateFrom(res[0]);
    }
}

EmailValidation.prototype.confirmUser = async function (code, user_id) {
    let res = await this.db.select(this, '`user_id` = ? AND `code` = ?', [ user_id, code ]);
    if (res.length > 0)
    {
        if (res[0].code == code)
        {
            this.db.query('DELETE FROM `email_validation` WHERE `user_id` = ?', [ user_id ]);
            return true;
        }
        else
        {
            return false;
        }
    }
    return true;
}

EmailValidation.prototype.generateToken = function (l) {
    let res = "";
    let getRandomSymbol () {
        const symbols = "a,b,c,d,e,f,g,h,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,1,2,3,4,5,6,7,8,9".split(",");
        return symbols[Math.floor(0 + Math.random() * (symbols.length + 1 - 0))];
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

EmailValidation.prototype.setOnConfirmation = async function (user_id) {
    this.__set('code', this.generateToken(4));
    this.__set('user_id', user_id);
    this.__set('timestamp', Math.floor(Date.now() / 1000));
    await this.save();
    return this;
}

EmailValidation.prototype.table = "email_validation";

module.exports = (new EmailValidation());
