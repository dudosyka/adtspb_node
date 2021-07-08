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

Status.prototype.selectByProposal = async function (proposal, showHidden = 0) {
    return await this.db.select(this, '`proposal_id` = ? AND (`hidden` = 0 OR `hidden` = ?)' , [ proposal.id, showHidden ]).then(data => data).catch(err => { console.log(err); });
}

Status.prototype.setToCreate = function () {
    this.fields = Object.assign(this.fields, {
        num: 1,
        text: "Подано",
        hidden: 0
    });
    console.log(this.fields);
    this.save();
}

Status.prototype.setToRecall = async function (proposal_id = null) {
    this.__set('proposal_id', proposal_id ?? this.__get('proposal_id'));
    this.__set('text', 'Отозвано');
    return await this.db.query("UPDATE " + this.table + " SET `text` = ?, `num` = ? WHERE `proposal_id` = ? AND `hidden` = ?", [ this.__get('text'), 0, this.__get('proposal_id'), 0 ]);
}

Status.prototype.table = "proposal_status";

module.exports = (new Status());
