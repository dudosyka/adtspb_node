<template>
  <div class="page2">
    <h1>Page2 Page</h1>
  </div>
</template>

<script>
// @ is an alias to /src
    import {Proposal} from '../models/Proposal';

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
          Proposal.renderPdf(18);
      }
  },
  async created()
  {
      this.generatePdf();
  }
}
</script>
