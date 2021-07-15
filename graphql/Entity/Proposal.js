const baseEntity = require('./BaseEntity');

const User = require('./User');
const UserExtraData = require('./UserExtraData');

const AssociationExraData = require('./AssociationExraData');

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

Proposal.prototype.selectProposalsList = async function (field, arr, selections) {
    const { ids, query } = this.db.createRangeQuery(false, arr, field);

    //Check if we have sub-selections and add them to query if exists
    let sub1Query = "";
    if (selections.association) {
        sub1Query += "LEFT JOIN `association` AS `sub1` ON `sub1`.`id` = `main`.`association_id` LEFT JOIN `association_extra_data` AS `sub1_1` ON `sub1`.`id` = `sub1_1`.`association_id` ";
    }

    let sub2Query = "";
    if (selections.status) {
        sub2Query += "LEFT JOIN `proposal_status` AS `sub2` ON `sub2`.`proposal_id` = `main`.`id` ";
    }

    sub1Selections = sub1Query == "" ? "" : ' "" as `sub1_decorator`, `sub1`.*, `sub1_1`.*,';
    sub2Selections = sub2Query == "" ? "" : ' "" as `sub2_decorator`, `sub2`.*,';
    mainSelections = ' "" as `main_decorator`, `main`.*';
    fullSelections = sub1Selections + sub2Selections + mainSelections;

    let fullQuery = "SELECT " + fullSelections + " FROM " + this.table + " AS `main` " + sub1Query + sub2Query + "WHERE `main`." + query;
    const res = await this.db.query(fullQuery, ids);

    if (res.length <= 0)
        return [];

    proposals = {};
    res.map(proposal => {
        let parsed = {};

        let pushIntoSub1 = false;
        let pushIntoSub2 = false;

        let association = {};
        let status = {};
        let main = {};

        Object.keys(proposal).map(selectedField => {
            const value = proposal[selectedField];
            if (selectedField == 'sub1_decorator') {
                pushIntoSub1 = true;
                pushIntoSub2 = false;
            }
            if (selectedField == 'sub2_decorator') {
                pushIntoSub1 = false;
                pushIntoSub2 = true;
            }
            if (selectedField == 'main_decorator') {
                pushIntoSub1 = false;
                pushIntoSub2 = false;
            }
            if (pushIntoSub1) {
                association[selectedField] = value;
            }
            if (pushIntoSub2) {
                status[selectedField] = value;
            }
            if (!pushIntoSub1 && !pushIntoSub2) {
                main[selectedField] = value;
            }
            if (selectedField == field) {
                main[selectedField] = value;
            }
        });

        delete main.main_decorator;
        if (association.proposal_id) {
            main.id = association.proposal_id;
            delete association.proposal_id;
        }

        if (status.proposal_id) {
            main.id = status.proposal_id;
            delete status.proposal_id;
        }

        delete association.sub1_decorator;
        association.id = association.association_id;
        delete association.association_id;

        delete status.sub2_decorator;

        parsed = {
            ...main,
            association,
            status
        };

        if (proposals[ proposal[ field ] ]) {
            proposals[ proposal[ field ] ].push(parsed);
        }
        else {
            proposals[ proposal[ field ] ] = [ parsed ];
        }
    });
    return proposals;
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
    const proposals = await this.selectProposalsList('child_id', [this.__get('child')], {status: true});

    let association_ids = [];

    proposals[this.__get('child')].map(el => {
        if (el.status.num != 0)
            association_ids.push({id: el.id});
    });

    const associations = await AssociationExraData.getList(association_ids);
    let hours = 0;

    associations.map(el => {
        hours += el.hours_week;
    });

    return hours;
}

Proposal.prototype.canJoinAssociation = async function (userModel, userExtraDataModel) {
        if (this.__get('parent') == null || this.__get('child') == null || this.__get('association') == null)
            throw Error('Bad request');

        let data = {
            id: this.__get('parent')
        };

        const parent = await userModel.createFrom(data, true, false);
        const children = await parent.getChildrenIds();

        //Check can parent create proposals
        if (!parent.hasAccess(13)) {
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

Proposal.prototype.createNew = async function (userModel, userExtraDataModel) {
    await this.canJoinAssociation(userModel, userExtraDataModel);

    const proposal = await this.save(true);

    if (proposal === false)
        throw Error('Saving data failed');

    const status = Status.newModel();
    status.load({ proposal_id: proposal.insertId });
    await status.setToCreate();

    return true;
};

Proposal.prototype.recall = async function (requester) {
    if (this.__get('association_id') === null)
        throw Error('Proposal not found');

    if (requester !== this.__get('parent_id')) {
        // const user = User.createFrom({id: requester});
        // Проверять тут проавило позволяющее админам отзывыать любые заявления
        // if ()
        throw Error('Forbidden');
    }

    if (this.__get('document_taken') == 1) {
        throw Error('Document taken');
    }

    return await Status.setToRecall(this.__get('id'));
}

Proposal.prototype.generatePdf = async function (childModel, parentModel, userExtraModel, associationModel) {
    const pdf = new Pdf(this);
    const child = await childModel.baseCreateFrom({id: this.__get('child')});
    const parent = await parentModel.baseCreateFrom({id: this.__get('parent')});
    const child_extra = await userExtraModel.createFrom({user_id: this.__get('child')})
    const association = await associationModel.baseCreateFrom({id: this.__get('association')});;
    return await pdf.generateProposal(child, parent, child_extra, association);
}

Proposal.prototype.generateResolution = async function (child, parent, childExtraData) {
    let pdf = new Pdf(this);
    const buffer = await pdf.generateResolution(child, parent, childExtraData);
    return buffer.toString('base64');
}
module.exports = (new Proposal());
