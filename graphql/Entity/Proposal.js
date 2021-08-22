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

Proposal.prototype.selectProposalsList = async function (field, arr, selections, where = null, whereData = []) {
    console.log(selections);
    const { ids, query } = this.db.createRangeQuery(false, arr, field);

    //Check if we have sub-selections and add them to query if exists
    let sub1Query = "";
    if (selections.association) {
        sub1Query += "LEFT JOIN `association` AS `sub1` ON `sub1`.`id` = `main`.`association_id` LEFT JOIN `association_extra_data` AS `sub1_1` ON `sub1`.`id` = `sub1_1`.`association_id`";
    }

    let sub2Query = "";
    if (selections.status) {
        sub2Query += "LEFT JOIN `proposal_status` AS `sub2` ON `sub2`.`proposal_id` = `main`.`id` ";
    }

    let sub3Query = "";
    if (selections.child) {
        sub3Query += "LEFT JOIN `user` AS `sub3` ON `sub3`.`id` = `main`.`child_id` OR `sub3`.`id` = `main`.`parent_id` LEFT JOIN `user_extra_data` AS `sub3_extra` ON `sub3`.`id` = `sub3_extra`.`user_id` ";
    }

    sub1Selections = sub1Query == "" ? "" : ' "" as `sub1_decorator`, `sub1`.*, `sub1_1`.*,';
    sub2Selections = sub2Query == "" ? "" : ' "" as `sub2_decorator`, `sub2`.*,';
    sub3Selections = sub3Query == "" ? "" : ' "" as `sub3_decorator`, `sub3`.*, `sub3_extra`.*,';
    mainSelections = ' "" as `main_decorator`, `main`.*';
    fullSelections = sub1Selections + sub2Selections + sub3Selections + mainSelections;

    if (where == null)
        where = "";

    let fullQuery = "SELECT " + fullSelections + " FROM " + this.table + " AS `main` " + sub1Query + sub2Query + sub3Query + "WHERE `main`." + query + where;
    whereData=ids.concat(whereData);
    const res = await this.db.query(fullQuery, ids);

    if (res.length <= 0)
        return [];

    let copies = {};
    proposals = {};

    for (let i = (selections.child) ? 1 : 0; i < res.length; i+=(selections.child) ? 2 : 1) {
        let withChildData = res[i];
        let withParentData = {};
        if (selections.child) {
            withParentData = res[i - 1];
        }
        let parsed = {};

        let pushIntoSub1 = false;
        let pushIntoSub2 = false;
        let pushIntoSub3 = false;

        let association = {};
        let child = {};
        let parent = {};
        let status = {};
        let main = {};

        Object.keys(withChildData).map(selectedField => {
            const childValue = withChildData[selectedField];
            const parentValue = withParentData[selectedField];
            if (selectedField == 'sub1_decorator') {
                pushIntoSub1 = true;
                pushIntoSub2 = false;
                pushIntoSub3 = false;
            }
            if (selectedField == 'sub2_decorator') {
                pushIntoSub1 = false;
                pushIntoSub2 = true;
                pushIntoSub3 = false;
            }
            if (selectedField == 'sub3_decorator') {
                pushIntoSub1 = false;
                pushIntoSub2 = false;
                pushIntoSub3 = true;
            }
            if (selectedField == 'main_decorator') {
                pushIntoSub1 = false;
                pushIntoSub2 = false;
                pushIntoSub3 = false;
            }
            if (pushIntoSub1) {
                association[selectedField] = childValue;
            }
            if (pushIntoSub2) {
                status[selectedField] = childValue;
            }
            if (pushIntoSub3) {
                child[selectedField] = childValue;
                parent[selectedField] = parentValue;
            }
            if (!pushIntoSub1 && !pushIntoSub2 && !pushIntoSub3) {
                main[selectedField] = childValue;
            }
            if (selectedField == field) {
                main[selectedField] = childValue;
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
        delete status.sub2_decorator;

        delete association.sub1_decorator;
        association.id = association.association_id;
        delete association.association_id;

        delete child.sub3_decorator;
        if (selections.child) {
            child.id = Number(main.child_id);
        }

        delete parent.sub3_decorator;
        if (selections.parent) {
            parent.id = Number(main.parent_id);
        }

        parsed = {
            ...main,
            association,
            child,
            parent,
            status: [status],
        }

        if (copies[main.id]) {
            proposals[ withChildData[ field ] ][ copies[main.id] ].status.push(parsed.status[0]);
        }
        else {
            if (proposals[ withChildData[ field ] ]) {
                proposals[ withChildData[ field ] ].push(parsed);
            }
            else {
                proposals[ withChildData[ field ] ] = [ parsed ];
            }
            copies[main.id] = proposals[ withChildData[ field ] ].length - 1;
        }
    }

    if (selections.isReserve) {
        for (id of Object.keys(proposals)) {
            const child = proposals[id];
            for (proposal of child) {
                const data = await this.db.query("SELECT `proposal`.`id` as `id`, `status`.`num` as `num` FROM `proposal` LEFT JOIN `proposal_status` as `status` ON `status`.`proposal_id` = `proposal`.`id` WHERE `proposal`.`association_id` = ?", [ proposal.association.id ]);
                let i = 1;
                data.map(el => {
                    const id = el.id;
                    if (id < proposal.id && el.num != 0) {
                        i++;
                    }
                });
                if (i > AppConfig.group_size * proposal.association.group_count)
                    proposal.isReserve = true;
                else
                    proposal.isReserve = false;
            }
        }
    }

    if (selections.association && Object.keys(proposals).length > 0) {
        let links = {};

        let association_ids = [];
        let association_query = "";
        Object.keys(proposals).map(id => {
            let i = 0;
            proposals[id].map(proposal => {
                association_ids.push(proposal.association.id);
                if (links[proposal.association.id]) {
                    links[proposal.association.id].push(id, i);
                }
                else {
                    links[proposal.association.id] = [
                        id, i
                    ];
                }
                i++;
            });
        });

        for (let i = 0; i < association_ids.length - 1; i++) {
            association_query += "?,";
        }
        association_query += "?";

        const associationModel = Association.newModel();
        const result = await associationModel.getAssociations(null, selections.association, null,"WHERE `main`.`id` IN (" + association_query + ")", association_ids);

        result.map(association => {
            const index = links[association.id];
            for (let i = 1; i < index.length; i+=2) {
                const first = index[i - 1];
                const second = index[i];
                proposals[first][second].association = association;
            }
        });
    }

    console.log(proposals[1]);

    return proposals;
}

Proposal.prototype.setSelected = async function (proposals, group_id) {
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
    const proposals = await this.selectProposalsList('child_id', [this.__get('child')], {status: true});

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
    const association = await associationModel.baseCreateFrom({id: this.__get('association')});;
    return await pdf.generateProposal(child, parent, child_extra, association);
}

Proposal.prototype.generateResolution = async function (child, parent, childExtraData) {
    let pdf = new Pdf(this);
    const buffer = await pdf.generateResolution(child, parent, childExtraData);
    return buffer.toString('base64');
}

module.exports = (new Proposal());
