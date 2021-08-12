const baseEntity = require('./BaseEntity');
const UserDataOnEdit = require('./UserDataOnEdit');
const AppConfig = require('../config/AppConfig');

let UserExtraData = function () {}

UserExtraData.prototype = Object.assign(UserExtraData.prototype, baseEntity.prototype);

UserExtraData.prototype.getInstance = () => UserExtraData;

UserExtraData.prototype.createFromField = "user_id";

UserExtraData.prototype.createNew = async function (data) {
    this.fields = data;
    return await this.__save();
}

UserExtraData.prototype.fields = {
    id: null,
    user_id: null,
    relationship: null,
    state: null,
    studyPlace: null,
    study_class: null,
    registration_address: null,
    registration_flat: null,
    residence_address: null,
    residence_flat: null,
    birthday: null,
    ovz: null,
    ovz_type: null,
    disability: null,
    disability_group: null,
};

UserExtraData.prototype.calculateAge = function (birthday = 0) {
    const now = new Date(AppConfig.year, 8, 1, 0, 0);
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
    if (this.fields.id)
        return await this.update(true);
    else
        return await this.save(true);
}

UserExtraData.prototype.baseValidate = function () {
    return [
        this.validator(
            [
                'relationship', 'state', 'studyPlace',
                'registration_address',
                'residence_address',
                'ovz', 'ovz_type',
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
    ];
}

UserExtraData.prototype.checkChildData = async function (fieldsOnValidate = null) {
    this.validateRules = function () {
        return this.baseValidate().concat(
            [
                this.validator(
                    [
                        'birthday'
                    ],
                    'Invalid age'
                ).age(6, 18)
            ]
        );
    }

    return await this.validate(fieldsOnValidate);
}

UserExtraData.prototype.checkAdultData = async function (fieldsOnValidate = null) {
    this.validateRules = function () {
        return this.baseValidate().concat(
            [
                this.validator(
                    [
                        'birthday'
                    ],
                    'Invalid age'
                ).age(18)
            ]
        );
    }


    return this.validate(fieldsOnValidate);
}

UserExtraData.prototype.setChildData = async function () {
    const validate = await this.checkChildData();
    if (validate !== true) {
        return JSON.stringify(validate);
    }
    return (await this.__save().catch(err => { throw Error("Saving data failed") })) !== false;
}

UserExtraData.prototype.table = "user_extra_data";

module.exports = (new UserExtraData());
