<template>
  <div class="input-container">
    <label
      class="label"
      v-bind:class="{'label-up': login}
    ">
      номер телефона/электронная почта
    </label><br>
    
    <input type="text" v-model="login" class="type" tabindex="1">
  </div>
</template>

<style scoped>

</style>

<script>
  export default
</script>
