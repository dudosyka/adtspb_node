const baseEntity = require('./BaseEntity');

let UserExtraData = function () {}

UserExtraData.prototype = Object.assign(UserExtraData.prototype, baseEntity.prototype);

UserExtraData.prototype.getInstance = () => UserExtraData;

UserExtraData.prototype.createFrom = async function (data) {
    if (data.user_id) {
        const req = await this.db.select(this, '`user_id` = ?', [ data.user_id ]);
        if (req.length) {
            const newData = Object.assign(req[0], data);
            this.fields = newData;
            return this;
        }
        else
            return await this.baseCreateFrom(data);
    }
    return this.baseCreateFrom(data);
}

UserExtraData.prototype.validateRules = function () {
    return [
    ];
}

UserExtraData.prototype.fields = {

};

UserExtraData.prototype.__save = async function () {
    this.__set('ovz_type', this.__get('ovz_type').id);
    this.__set('disability_group', this.__get('disability_group').id);
    // console.log('onSave', this.fields);
    if (this.fields.id)
        return await this.update();
    else
        return await this.save();
}

UserExtraData.prototype.setChildData = async function () {
    // console.log(this.fields);
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
    let validate = this.validate();
    if (validate !== true) {
        throw Error(JSON.stringify(validate));
    }
    return this.__save() !== false;
}

UserExtraData.prototype.table = "user_extra_data";

module.exports = (new UserExtraData());
