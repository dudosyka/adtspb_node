const baseEntity = require('./BaseEntity');

const User = require('./User');
const UserExtraData = require('./UserExtraData');

const AssociationExraData = require('./AssociationExraData');
const Association = require('./Association');

const Status = require('./Status');

const AppConfig = require('../config/AppConfig');
const Pdf = require('../utils/pdf/Pdf');

let Proposal = function () {}

Proposal.prototype = Object.assign(Proposal.prototype, baseEntity.prototype);

Proposal.prototype.getInstance = () => Proposal;

Proposal.prototype.fields = {
    id: null,
    association_id: null,
    parent_id: null,
    child_id: null,
    document_taken: null
};

Proposal.prototype.aliases = {
    association: "association_id",
    child: "child_id",
    parent: "parent_id"
}

Proposal.prototype.table = "proposal";

Proposal.prototype.createFromInput = async function (proposal) {
    let data = {
        id: proposal["id"] ? proposal["id"] : null,
        association_id: proposal["association"] ? proposal["association"]["id"] ? parseInt(proposal["association"]["id"]) : null : null,
        parent_id: proposal["parent"] ? proposal["parent"]["id"] ? parseInt(proposal["parent"]["id"]) : null : null,
        child_id: proposal["child"] ? proposal["child"]["id"] ? parseInt(proposal["child"]["id"]) : null : null,
    };

    return await this.baseCreateFrom(data);
}

Proposal.prototype.calculateReserve = async function (association, proposal_id) {
    if (association == undefined)
        return null;

    let i = 1;
    for (proposal of association.proposals) {
        if (proposal.id == proposal_id) {
            return (i > AppConfig.group_size * association.group_count);
        }
        if (proposal.status[0].num != 0)
            i++
    }
}

Proposal.prototype.selectProposalsList = async function (field, arr, selections, where = "", whereData = [], userModel = null) {
    const { ids, query } = this.db.createRangeQuery(false, arr, field);
    let fullQuery = "SELECT `main`.* FROM " + this.table + " AS `main` WHERE `main`." + query + where;
    const proposals = await this.db.query(fullQuery, ids);
    if (proposals.length <= 0)
        return [];

    let associations = {};
    if (selections.association) {
        const association = Association.newModel();
        const range = this.db.createRangeQuery('association_id', proposals, 'id');
        associations = await association.getAssociationsAsObject(null, selections.association, null, " WHERE `main`." + range.query, range.ids);
    }

    let statuses = {};
    if (selections.status) {
        const status = Status.newModel();
        const range = this.db.createRangeQuery('id', proposals, 'proposal_id');
        statuses = await status.getAll(range.query, range.ids, selections, true);
    }

    let parents = {};
    if (selections.parent) {
        parents = await userModel.getFullDataAsObject(proposals.map(el => el.parent_id), selections);
    }

    let children = {};
    if (selections.child) {
        const range = this.db.createRangeQuery('id', proposals, 'child_id');
        children = await userModel.getFullDataAsObject(proposals.map(el => el.child_id), selections);
    }
    let isReserve = {};
    if (selections.isReserve) {
        if (Object.keys(associations) > 0) {
            //GET FROM `associations` object
        } else {
            const association = Association.newModel();
            const range = this.db.createRangeQuery('association_id', proposals, 'id');
            isReserve = await association.getAssociationsAsObject(null, {proposals: {status: true}}, this.newModel(), " WHERE `main`." + range.query, range.ids);
        }
    }

    const res = {};

    proposals.map(el => {
        el.child = children[el.child_id];
        el.parent = parents[el.parent_id];
        el.status = statuses[el.id] == undefined ? [] : statuses[el.id];
        el.association = associations[el.association_id];
        el.isReserve = this.calculateReserve(isReserve[el.association_id], el.id);
        if (res[el[field]]) {
            res[el[field]].push(el);
        }
        else {
            res[el[field]] = [el];
        }
        return el;
    });

    return res;
}

Proposal.prototype.setSelected = async function (proposals, group_id, dataForReserve) {
    for (proposal of proposals) {
        const isReserve = await this.calculateReserve(dataForReserve, proposal);
        if (isReserve)
            throw Error('Proposal in reserve');
    }
    const { ids, query } = this.db.createRangeQuery(false, proposals, "id");
    ids.unshift(group_id);
    this.db.query("UPDATE `proposal` SET `group_selected` = ? WHERE " + query, ids);
}

Proposal.prototype.getProposalAmount = async function (association_id = null) {
    if (association_id === null)
        return (await this.db.query("SELECT COUNT(*) as `amount` FROM `proposal` as `main` RIGHT JOIN `proposal_status` as `sub` ON `main`.`id` = `sub`.`proposal_id` WHERE `sub`.`num` != 0"))[0].amount;
    else
        return (await this.db.query("SELECT COUNT(*) as `amount` FROM `proposal` as `main` RIGHT JOIN `proposal_status` as `sub` ON `main`.`id` = `sub`.`proposal_id` WHERE `sub`.`num` != 0 AND `main`.`association_id` = ?", [ association_id ]))[0].amount;
}

Proposal.prototype.selectByChild = async function (child_id) {
    return await this.db.select(this, "`child_id` = ?", [ child_id ]).then(data => data).catch(err => { console.error(err); });
};

Proposal.prototype.checkProposalExists = async function () {
    const proposals = await this.db.query('SELECT * FROM `'+ this.table +'` as `main` LEFT JOIN `proposal_status` as `sub` ON `main`.`id` = `sub`.`proposal_id` WHERE `main`.`child_id` = ? AND `main`.`association_id` = ?', [ this.__get('child'), this.__get('association') ]);
    let exists = false;
    proposals.map(el => {
        if (el.num != 0)
            exists = true;
    })
    return exists;
}

Proposal.prototype.checkStudyLoad = async function () {
    const proposals = await this.selectProposalsList('child_id', [this.__get('child')], {status: true, association: true});

    console.log("PROPOSALS", proposals);

    let association_ids = [];

    if (Object.keys(proposals).length <= 0)
        return 0;

    proposals[this.__get('child')].map(el => {
        if (el.status.num != 0)
            association_ids.push({id: el.association.id});
    });

    console.log(association_ids);

    const associations = await AssociationExraData.getList(association_ids);
    console.log(associations);
    let hours = 0;

    associations.map(el => {
        hours += el.hours_week;
    });

    return hours;
}

Proposal.prototype.canJoinAssociation = async function (userModel, userExtraDataModel, fromAdmin = false) {
        if (this.__get('parent') == null || this.__get('child') == null || this.__get('association') == null)
            if (!fromAdmin)
                throw Error('Bad request');

        let data = {
            id: this.__get('parent')
        };

        const parent = await userModel.createFrom(data, true, false);
        const children = await parent.getChildrenIds();

        //Check can parent create proposals
        if (!parent.hasAccess(13) && !fromAdmin) {
            throw Error('Forbidden');
        }

        //Check relation
        if (!children.includes(this.__get('child')))
            throw Error("Child not found");

        const child = await userExtraDataModel.createFrom({user_id: this.__get('child')});
        const age = child.calculateAge();

        //Check if proposal had already created
        if (await this.checkProposalExists())
            throw Error('Proposal had already created');

        const associationData = await AssociationExraData.createFrom({association_id: this.__get('association_id')});
        if (associationData.__get('min_age') === null)
            throw Error("Association not found");

        const canJoin = await associationData.canJoinAssociation(false, child);

        //Check does child pass by age
        if (canJoin !== true)
            throw Error(canJoin);

        //Check hours at week
        const loadCheck = await this.checkStudyLoad();

        if (age < 14) {
            if (loadCheck > AppConfig.min_hours_week)
                throw Error('Too many hours');
        } else {
            if (loadCheck > AppConfig.max_hours_week)
                throw Error('Too many hours')
        }

        return true;
}

Proposal.prototype.createNew = async function (userModel, userExtraDataModel, fromAdmin = false) {
    await this.canJoinAssociation(userModel, userExtraDataModel, fromAdmin);
    console.log("djhdjahjdkjsa");

    const proposal = await this.save(true);

    if (proposal === false)
        throw Error('Saving data failed');

    const status = Status.newModel();
    status.load({ proposal_id: proposal.insertId });
    await status.setToCreate();

    return true;
};

Proposal.prototype.setDocumentTaken = async function (proposal, logger, admin_id, allowed)  {
    const oldData = await this.db.select(this, "`id` = ?", [ proposal ]).then(data => {
        return data[0];
    });

    if (allowed.indexOf(oldData.association_id) == -1)
        throw Error('Forbidden');

    const model = this.newModel();
    model.load(oldData);
    await logger.logModel(model, { document_taken: 1 }, admin_id);
    model.__set('document_taken', 1);
    await model.update(true);
    return true;
}

Proposal.prototype.recall = async function (requester, admin = false) {
    if (this.__get('association_id') === null)
        throw Error('Proposal not found');

    if (requester !== this.__get('parent_id') && !admin) {
            throw Error('Forbidden');
    }

    if (this.__get('document_taken') == 1) {
        throw Error('Document taken');
    }

    if (this.__get('group_selected') != 0) {
        await this.db.query('DELETE FROM `user_group` WHERE `user_id` = ? AND `group_id` = ?; UPDATE `proposal` SET `group_selected` = ? WHERE `id` = ?', [ this.__get('child_id'), this.__get('group_selected'), 0, this.__get('id') ]);
    }

    return await Status.setToRecall(this.__get('id'));
}

Proposal.prototype.generatePdf = async function (childModel, parentModel, userExtraModel, associationModel) {
    const pdf = new Pdf(this);
    const child = await childModel.baseCreateFrom({id: this.__get('child')});
    const parent = await parentModel.baseCreateFrom({id: this.__get('parent')});
    const child_extra = await userExtraModel.createFrom({user_id: this.__get('child')})
    const association = await associationModel.baseCreateFrom({id: this.__get('association')});
    const data = await association.getAssociationsAsObject(null, {proposals: {status: true}}, this.newModel(), " WHERE `main`.`id` = ?", [ this.__get('association') ]);
    const isReserve = await this.calculateReserve(data[this.__get('association')], this.__get('id'));
    if (isReserve)
        throw Error('Proposal in reserve');

    return await pdf.generateProposal(child, parent, child_extra, association);
}

Proposal.prototype.generateResolution = async function (child, parent, childExtraData) {
    let pdf = new Pdf(this);
    const buffer = await pdf.generateResolution(child, parent, childExtraData);
    return buffer.toString('base64');
}

module.exports = (new Proposal());
