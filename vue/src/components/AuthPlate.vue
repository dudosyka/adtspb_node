<template>
  <div class="plate">
    <h1 class="title"> {{ title }} </h1>

    <aside class="social-media-list container">
      <ul class="social-media-list ul">
          <li class="social-media-list li">
            <a href="https://t.me/adtspb" class="fab fa-telegram-plane social-media-link" target="_blank"></a>
          </li>
          <li class="social-media-list li">
            <a href="https://vk.com/adtspb" class="fab fa-vk social-media-link" target="_blank"></a>
          </li>
          <li class="social-media-list li">
            <a href="https://www.facebook.com/adtspb" class="fab fa-facebook-square social-media-link" target="_blank"></a>
          </li>
          <li class="social-media-list li">
            <a href="https://www.instagram.com/adtspb" class="fab fa-instagram social-media-link" target="_blank"></a>
          </li>
      </ul>
    </aside>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>
