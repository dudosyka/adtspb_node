const baseEntity = require('./BaseEntity');
const DataOnEdit = require('./DataOnEdit');

let UserExtraData = function () {}

UserExtraData.prototype = Object.assign(UserExtraData.prototype, baseEntity.prototype);

UserExtraData.prototype.getInstance = () => UserExtraData;

UserExtraData.prototype.createFromField = "user_id";

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
    if (this.__get('ovz_type') == 0)
        this.__set('ovz_type', null);
    if (this.__get('disability_group') == 0)
        this.__set('disability_group', null);
    console.log(this.__get('ovz_type'));
    console.log(this.__get('disability_group'));
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
                    'disability', 'disability_group', 'birthday'
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
            this.validator(
                [
                    'birthday'
                ],
                'Student should be older than 6 yo'
            ).age(6)
        ];
    }

    return this.validate();
}

UserExtraData.prototype.setChildData = async function () {
    const validate = this.checkChildData();
    if (validate !== true) {
        return JSON.stringify(validate);
    }
    return (await this.__save().catch(err => { throw Error("Saving data failed") })) !== false;
}

UserExtraData.prototype.table = "user_extra_data";

module.exports = (new UserExtraData());
