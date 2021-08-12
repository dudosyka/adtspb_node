const baseEntity = require('./BaseEntity');

let Status = function () {}

Status.prototype = Object.assign(Status.prototype, baseEntity.prototype);

Status.prototype.getInstance = () => Status;

Status.prototype.fields = {
    id: null,
    proposal_id: null,
    num: null,
    text: null,
    hidden: null
};

Status.prototype.createFromField = 'proposal_id';

Status.prototype.setToCreate = function () {
    this.fields = Object.assign(this.fields, {
        num: 1,
        text: "Подано",
        hidden: 0
    });

    this.save(true);
}

Status.prototype.setToRecall = async function (proposal_id = null) {
    this.__set('proposal_id', proposal_id ?? this.__get('proposal_id'));
    this.__set('text', 'Отозвано');
    return await this.db.query("UPDATE " + this.table + " SET `text` = ?, `num` = ? WHERE `proposal_id` = ? AND `hidden` = ?", [ this.__get('text'), 0, this.__get('proposal_id'), 0 ]);
}

Status.prototype.editStatus = async function (input, logger, admin_id) {
    if (!input.id)
        throw Error('Must provide `id` field into `input`');

    const model = this.newModel();
    const oldData = await model.db.query('SELECT * FROM `proposal_status` WHERE `id` = ?', [ input.id ]);
    model.load(oldData[0]);
    await logger.logModel(model, input, admin_id);
    this.load(input);
    await this.update();
}

Status.prototype.table = "proposal_status";

module.exports = (new Status());
