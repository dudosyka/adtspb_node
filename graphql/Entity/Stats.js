const AppConfig = require('../config/AppConfig');
const Db = require('../utils/Db');
const db = new Db();

const Proposal = require('../Entity/Proposal');

let Stats = function () {

}

Stats.prototype.getParentAmount = async function () {
    return (await db.query('SELECT COUNT(DISTINCT `parent_id`) as `amount` FROM `user_child` WHERE 1'))[0].amount;
}

Stats.prototype.getChildrenAmount = async function () {
    return (await db.query('SELECT COUNT(DISTINCT `child_id`) as `amount` FROM `user_child` WHERE 1'))[0].amount;
}

function getFullness(actual, planned) {
    if (actual == 0 || planned == 0)
        return 0;
    else
        return Math.floor((actual / planned) * 100);
}

Stats.prototype.getAssociationsStat = async function (arr, associationModel, userModel, proposalModel) {
    const { query, ids } = db.createRangeQuery(false, arr, "id");

    const whereQuery = " WHERE `main`." + query;

    const associations = await associationModel.getAssociations(null, { proposals: true }, proposalModel, whereQuery, ids, userModel);

    let reserve = 0;
    const res = associations.map(association => {
        //name, planned, actual, fullness_percent
        let actual = 0;
        let document_taken = 0;
        let planned = association.group_count * AppConfig.group_size;

        (association.proposals ?? []).map(el => {
            if (el.status[0].num != 0)
                actual++;
            if (el.document_taken == 1)
                document_taken++;
        });

        const association_reserve = (actual - planned);
        reserve += association_reserve > 0 ? association_reserve : 0;

        return {
            id: association.id,
            name: association.name,
            planned,
            actual,
            document_taken,
            group_amount:  association.group_count,
            fullness_percent: getFullness(actual, planned)
        }
    });

    res[0].reserve = reserve;
    return res;
}

Stats.prototype.getStat = async function (adminModel, associationModel, userModel, proposalModel) {
    const allowed = await adminModel.getAllowedAssociations();

    const parent_amount = await this.getParentAmount();
    const child_amount = await this.getChildrenAmount();

    const proposal = Proposal.newModel();
    const proposal_amount = await proposal.getProposalAmount();

    const proposal_amount_document_taken = await proposal.getProposalAmountDocumentTaken();

    const associations = await this.getAssociationsStat(allowed, associationModel, userModel, proposalModel);

    const proposal_reserve_amount = associations[0].reserve;

    return {
        parent_amount,
        child_amount,
        proposal_amount,
        proposal_amount_document_taken,
        proposal_reserve_amount,
        associations,
    }
}

module.exports = Stats;
