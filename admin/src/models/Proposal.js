let Proposal = {};

Proposal.getPdfBlob = async function (proposal_id, child = false) {
    let req = `
    query($proposal: ProposalInput) {
        proposal {
            generatePdf(proposal: $proposal)
        }
      }
    `;
    let data = {
        proposal: {
            id: proposal_id
        }
    };
    if (child != false) {
        req = `
            query($child_id: Int) {
                user {
                    generateResolution(child_id: $child_id)
                }
              }
        `;
        data = {
            child_id: Number(child),
        }
    }

    return await _request("api", req, data).then(async res => {
        if (child == false) {
            return await fetch("data:application/pdf;base64," + res.proposal.generatePdf).then(base64 =>  base64.blob() );
        }
        else {
            return await fetch("data:application/pdf;base64," + res.user.generateResolution).then(base64 =>  base64.blob() );
        }
    }).catch(err => {
        console.error(err);
        throw err;
    })
}

Proposal.printResolution = async function (child_id) {
    const blob = await this.getPdfBlob(false, child_id);
    let url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Согласие.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
}

Proposal.downloadPdf = async function (proposal_id, name) {
    const blob = await this.getPdfBlob(proposal_id);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name + ".pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
}

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

    const data = {
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

Proposal.setGroupByStudent = async function (child, association, group) {
    const req = `
        mutation ($child: Int, $association: Int, $group: Int) {
            admin {
                set_group_by_student (child: $child, association: $association, group: $group)
            }
        }
    `;

    const data = {
        child: Number(child),
        association: Number(association),
        group: Number(group)
    };

    return await _request('api', req, data).then(data => {
        console.log(data);
        return data.admin ?? data;
    }).catch(err => {
        console.log(err);
        throw err;
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

Proposal.setDocumentTakenByStudent = async function (proposal, child, group) {
    const req = `
        mutation ($child: Int, $group: Int) {
            admin {
                set_document_taken (child: $child, group: $group)
            }
        }
    `;

    const data = {
        child, group
    };

    return await _request('api', req, data).then(res => {
        console.log(res);
        return res.admin ?? res;
    })
}

Proposal.editStatus = async function (proposal_id, new_status) {
    const req = `
        mutation ($input: ProposalStatusInput) {
            admin {
                edit_proposal_status (input: $input)
            }
        }
    `;

    const data = {
        input: {
            id: Number(new_status.id),
            text: new_status.text,
            num: Number(new_status.value),
            proposal_id: Number(proposal_id)
        }
    };

    return await _request('api', req, data).then(res => {
        console.log(res);
        return res.admin ?? res;
    }).catch(err => {
        console.log(err);
    })
}

Proposal.editStatusByStudent = async function (student, group, new_status) {
    const req = `
        mutation ($input: ProposalStatusInput) {
            admin {
                edit_proposal_status (input: $input)
            }
        }
    `;

    const data = {
        input: {
            id: Number(new_status.id),
            text: new_status.text,
            num: Number(new_status.value),
            student: Number(student),
            group: Number(group)
        }
    };

    return await _request('api', req, data).then(res => {
        console.log(res);
        return res.admin ?? res;
    }).catch(err => {
        console.log(err);
    })
}

Proposal.recallByStudent = async function (student, group) {
    const req = `
        mutation ($child: Int, $group: Int) {
            admin {
                recall_proposal (child: $child, group: $group)
            }
        }
    `;

    const data = {
        child: Number(student),
        group: Number(group)
    };

    return await _request('api', req, data).then(res => {
        console.log(res);
        return res.admin ?? res;
    }).catch(err => {
        console.log(err);
    })
}

export {Proposal}
