const Proposal = {};

Proposal.getPdfBlob = async function (proposal_id) {
    const req = `
    query($proposal: ProposalInput) {
        generateProposalPdf(proposal: $proposal)
      }
    `;
    const data = {
        proposal: {
            id: proposal_id
        }
    };

    return await _request("api", req, data).then(async res => {
        return await fetch("data:application/pdf;base64," + res.generateProposalPdf).then(base64 =>  base64.blob() );
    }).catch(err => {
        console.error(err);
        throw err;
    })
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
        createProposal(proposal: $proposal)
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

    return await _request("api", req, data).then(data => data.createProposal);
}

Proposal.createFromObject = async function (obj, child_id) {
    Object.keys(obj).map(async index => {
      const assoc = obj[index];
      const childId = Number(child_id);
      const assocId = Number(assoc.id);

      if (assoc.already)
          return;

      await Proposal.create(assocId, childId);
    });
}

Proposal.canJoinAssociation = async function (association, child) {
    const req = `
        query($proposal: ProposalInput) {
            canJoinAssociation(data: $proposal)
        }
    `;

    const data = {
        proposal: {
            association: association,
            child: child
        }
    };

    return await _request("api", req, data).then(data => data.canJoinAssociation);
}

Proposal.getChildProposal = async function (child_id) {
    const req = `
    query($child_id: Int) {
        getChildProposals(child_id: $child_id) {
            child {
                name
            },
            parent {
                name
            },
            association {
                name
            }
        }
    }`;

    const data = {
        child_id: child_id
    };

    return await _request("api", req, data).then(data => data);
}

export {Proposal};
