<template>
  <div class="page2">
    <h1>Page2 Page</h1>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Page2',
  components: {
  },
  data() {
      return {
      }
  },
  methods: {
      generatePdf() {
          const req = `
          query($proposal: ProposalInput) {
              generateProposalPdf(proposal: $proposal)
            }
          `;
          const data = {
              proposal: {
                  id: 18
              }
          };

          api.request(req, data).then(async res => {
              //Получаешь этот татуй и суёшь его в этот гобан
              await downloadPdfFromBase64(res.generateProposalPdf);
          }).catch(err => {
              console.error(err);
          })
      }
  },
  async created()
  {
      this.generatePdf();
  }
}
</script>
