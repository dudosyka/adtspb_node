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
    if (actual == 0)
        return 0;
    else
        return Math.floor((actual / planned) * 100);
}

Stats.prototype.getAssociationsStat = async function (arr) {
    const { query, ids } = db.createRangeQuery(false, arr, "id");

    const data = await db.query("" +
        "SELECT `main`.`id`, `main`.`name`, `sub1`.`group_count` as `planned`, `sub3`.`num` as `status` FROM `association` as `main`" +
        "LEFT JOIN `association_extra_data` as `sub1` ON `main`.`id` = `sub1`.`association_id`" +
        "LEFT JOIN `proposal` as `sub2` ON `main`.`id` = `sub2`.`association_id`" +
        "LEFT JOIN `proposal_status` as `sub3` ON `sub2`.`id` = `sub3`.`proposal_id` WHERE `main`." + query, ids
    );
    let parsed = {};

    data.map(item => {
        const id = item.id;
        if (parsed[id] && item.status !== null && item.status != 0) {
            parsed[id].actual++;
        }
        else {
            let actual = 0;
            if (item.status != 0 && item.status != null)
                actual = 1;
            parsed[id] = {
                name: item.name,
                planned: item.planned * AppConfig.group_size,
                actual,
            };
        }
    });

    const res = [];
    Object.keys(parsed).map(id => {
        res.push({
            id: id,
            ...parsed[id],
            fullness_percent: getFullness(parsed[id].actual, parsed[id].planned),
        });
    });
    return res;
}

Stats.prototype.getStat = async function (adminModel) {
    const allowed = await adminModel.getAllowedAssociations();

    const parent_amount = await this.getParentAmount();
    const child_amount = await this.getChildrenAmount();

    const proposal = Proposal.newModel();
    const proposal_amount = await proposal.getProposalAmount();

    const associations = await this.getAssociationsStat(allowed);

    return {
        parent_amount,
        child_amount,
        proposal_amount,
        associations,
    }
}

module.exports = Stats;
