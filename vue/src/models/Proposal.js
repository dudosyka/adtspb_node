const Proposal = {};

Proposal.downloadPdfFromBase64 = async function (hash, name) {
    return await fetch("data:application/pdf;base64," + hash)
        .then(base64 => { base64.blob()
            .then(blob => {
              console.log(blob);
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = name + ".pdf";
              document.body.appendChild(a);
              a.click();
              a.remove();
          });
        });
}

Proposal.renderPdf = async function (proposal_id, name = "tatui") {
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

    api.request(req, data).then(async res => {
        //Получаешь этот татуй и суёшь его в этот гобан
        await this.downloadPdfFromBase64(res.generateProposalPdf, name);
    }).catch(err => {
        console.error(err);
    })
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

    return await api.request(req, data).then(data => data.createProposal);
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

    return await api.request(req, data).then(data => data.canJoinAssociation);
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

    return await api.request(req, data).then(data => data);
}

export {Proposal};
