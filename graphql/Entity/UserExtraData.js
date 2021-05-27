const baseEntity = require('./BaseEntity');

let UserExtraData = function () {}

UserExtraData.prototype = Object.assign(UserExtraData.prototype, baseEntity.prototype);

UserExtraData.prototype.getInstance = () => UserExtraData;

UserExtraData.prototype.createFrom = async function (data) {
    if (data.user_id) {
        const req = await this.db.select(this, '`user_id` = ?', [ data.user_id ]);
        if (req.length) {
            const model = this.newModel();
            const newData = Object.assign(req[0], data);
            model.fields = newData;
            return model;
        }
        else
            return await this.baseCreateFrom(data);
    }
    return this.baseCreateFrom(data);
}

UserExtraData.prototype.createNew = async function (data) {
    this.fields = data;
    this.__save();
}

UserExtraData.prototype.validateRules = function () {
    return [
    ];
}

UserExtraData.prototype.fields = {
    id: null,
    birthday: null
};

UserExtraData.prototype.calculateAge = function (birthday = 0) {
    const now = Date.now();
    const birth = (birthday == 0) ? this.__get('birthday') : birthday;
    const diff = now - birth;
    return Math.floor(diff / 31557600000);
}

UserExtraData.prototype.__save = async function () {
    if (this.__get('ovz_type') !== null && typeof this.__get('ovz_type') == 'object')
        this.__set('ovz_type', this.__get('ovz_type').id);
    if (this.__get('disability_group') !== null && typeof this.__get('disability_group') == 'object')
        this.__set('disability_group', this.__get('disability_group').id);
    // console.log('onSave', this.fields);
    // console.log(this.fields);
    if (this.fields.id)
        return await this.update();
    else
        return await this.save();
}

UserExtraData.prototype.checkChildData = function () {
    this.validateRules = function () {
        return [
            this.validator(
                [
                    'relationship', 'state', 'studyPlace',
                    'registration_address', 'registration_flat',
                    'residence_address', 'residence_flat',
                    'birth_certificate', 'ovz', 'ovz_type',
                    'disability', 'disability_group'
                ],
                'Can`t be empty'
            ).notNull(),
            this.validator(
                [
                    'ovz', 'disability'
                ],
                'Invalid format'
            ).match(/^[0-1]{1}$/),
            this.validator(
                [
                    'birth_certificate'
                ],
                'Invalid format'
            ).match(/^[A-Za-zА-Яа-яЕеЁёЫыЙйЪъЬьЖжЗз]{1,}[0-9]{6}$/),
        ];
    }

    return this.validate();
}

UserExtraData.prototype.setChildData = async function () {
    // console.log(this.fields);
    const validate = this.checkChildData();
    if (validate !== true) {
        throw Error(JSON.stringify(validate));
    }
    return this.__save() !== false;
}

UserExtraData.prototype.table = "user_extra_data";

module.exports = (new UserExtraData());
