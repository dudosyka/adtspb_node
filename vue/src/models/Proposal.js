const Proposal = {};

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
    const iframe = document.createElement('iframe');
    iframe.src = url;
    document.body.appendChild(iframe);
    url = URL.revokeObjectURL(blob);
    iframe.contentWindow.print();
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

Proposal.printPdf = async function (proposal_id) {
    const blob = await this.getPdfBlob(proposal_id);
    let url = window.URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.src = url;
    document.body.appendChild(iframe);
    url = URL.revokeObjectURL(blob);
    iframe.contentWindow.print();
}

Proposal.create = async function (association, child) {
    const req = `
    mutation($proposal: ProposalInput) {
        proposal {
            create(proposal: $proposal)
        }
    }`;

    const data = {
        proposal: {
            association: {
                id: association
            },
            child: {
                id: child
            }
        }
    };

    return await _request("api", req, data).then(data => data.proposal.create).catch(err => {throw err;});
}

Proposal.createFromObject = async function (obj, child_id) {
    console.log(obj);
    let result = [];
    for (let index in obj) {
        const assoc = obj[index];
        const childId = Number(child_id);
        const assocId = Number(assoc.id);

        console.log(index, assocId);

        if (assoc.already)
            continue;

        console.log(assoc);
        console.log(child_id);

        await Proposal.create(assocId, childId).catch(err => {
            throw {msg: getError(err), assoc: assoc};
        });
    }
}

Proposal.recall = async function (proposal_id) {
    const req = `
        mutation($proposal_id: Int) {
            proposal {
                recall(proposal_id: $proposal_id)
            }
        }
    `;

    const data = {
        proposal_id: Number(proposal_id)
    };

    return await _request("api", req, data).then(data => data.proposal.recall).catch(err => {throw err;});
}

export {Proposal};
