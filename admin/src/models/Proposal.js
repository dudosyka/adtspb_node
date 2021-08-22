let Proposal = {};

Proposal.recall = async function (proposal) {
    const req = `
        mutation ($proposal: Int) {
            admin {
                recall_proposal (proposal: $proposal)
            }
        }
    `;
    const data = {
        proposal
    };

    return await _request('api', req, data).then(res => {
        console.log(res);
        return res.admin ?? res;
    });
}

Proposal.joinGroup = async function (proposal, group_id) {
    const req = `
        mutation ($input: GroupStructureInput) {
            admin {
                join_group (input: $input)
            }
        }
    `;
    const data {
        input: {
            group_id,
            proposals: [ proposal ]
        }
    };

    return await _request('api', req, data).then(res => {
        console.log(res);
        return res.admin ?? res;
    })
}

Proposal.setDocumentTaken = async function (proposal) {
    const req = `
        mutation ($proposal: Int) {
            admin {
                set_document_taken (proposal: $proposal)
            }
        }
    `;

    const data = {
        proposal
    };

    return await _request('api', req, data).then(res => {
        console.log(res);
        return res.admin ?? res;
    })
}
