const baseEntity require('./BaseEntity');

let Proposal = function () {}

Proposal.prototype = Object.assign(Proposal.prototype, baseEntity.prototype);

Proposal.prototype.getInstance = () => Proposal;

Proposal.fields = {
    id: null,
};

Proposal.table = "proposal";
