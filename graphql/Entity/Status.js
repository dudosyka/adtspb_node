const baseEntity = require('./BaseEntity');

let Status = function () {}

Status.prototype = Object.assign(Status.prototype, baseEntity.prototype);

Status.prototype.getInstance = () => Status;

Status.prototype.fields = {
    id: null,
};

Status.prototype.selectByProposal = async function (proposal, showHidden = 0) {
    return await this.db.select(this, '`proposal_id` = ? AND (`hidden` = 0 OR `hidden` = ?)' , [ proposal.id, showHidden ]).then(data => data).catch(err => { console.log(err); });
}

Status.prototype.table = "proposal_status";

module.exports = (new Status());
