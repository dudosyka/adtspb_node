const baseEntity = require('./BaseEntity');

let Status = function () {}

Status.prototype = Object.assign(Status.prototype, baseEntity.prototype);

Status.prototype.getInstance = () => Status;

Status.prototype.fields = {
    id: null,
    num: null,
    text: null,
    hidden: null
};

Status.prototype.createFrom = async function (data) {
    if (data.proposal_id) {
        const req = await this.db.select(this, '`proposal_id` = ?', [ data.proposal_id ]);
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

Status.prototype.table = "proposal_status";

module.exports = (new Status());
