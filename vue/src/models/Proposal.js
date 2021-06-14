const Proposal = {};

Proposal.downloadPdfFromBase64 = async function (hash, name = "tatui") {
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

Proposal.renderPdf = async function (proposal_id) {
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
        await this.downloadPdfFromBase64(res.generateProposalPdf);
    }).catch(err => {
        console.error(err);
    })
}
