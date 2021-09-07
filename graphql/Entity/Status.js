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

Status.prototype.editStatus = async function (input, logger, admin_id, proposal, allowed) {
    if (!input.id)
        throw Error('Must provide `id` field into `input`');

    const model = this.newModel();
    const oldData = await model.db.query('SELECT * FROM `proposal_status` WHERE `id` = ?', [ input.id ]);

    const association_id = await this.db.query('SELECT `association_id` FROM `proposal` WHERE `id` = ?', [ oldData[0].proposal_id ]).then(data => data[0].association_id);
    if (allowed.indexOf(association_id) == -1)
        throw Error('Forbidden');

    model.load(oldData[0]);
    await logger.logModel(model, input, admin_id);
    this.load(input);
    await this.update();
}

Status.prototype.getAll = async function (query, queryData, selections = {}, asObject = false) {
    const res = await this.db.select(this, query, queryData);
    if (asObject) {
        const result = {};
        res.map(el => {
            if (!result[el.proposal_id]) {
                result[el.proposal_id] = [ el ];
            }
            else {
                result[el.proposal_id].push(el);
            }
        });
        return result;
    }
    return res;
}

Status.prototype.table = "proposal_status";

module.exports = (new Status());
