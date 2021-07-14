<template>
  <main class="home">
      <navigation />

      <article class="home-content">
        <section class="warning-container shadow">
                <p>Функционал станет доступнен в даты подачи заявлений. Объявление будет размещено заранее, следите за информацией в официальных сообщества Академии Цифровых Технологий и <a href="https://adtspb.ru" target="_blank" class="link_text">на сайте</a>.</p>
                <div class="link-container">
                    <div class="social-media-list li">
                        <a href="https://t.me/adtspb" class="fab fa-telegram-plane social-media-link" target="_blank"></a>
                    </div>
                    <div class="social-media-list li">
                        <a href="https://vk.com/adtspb" class="fab fa-vk social-media-link" target="_blank"></a>
                    </div>
                    <div class="social-media-list li">
                        <a href="https://www.facebook.com/adtspb" class="fab fa-facebook-square social-media-link" target="_blank"></a>
                    </div>
                    <div class="social-media-list li">
                        <a href="https://www.instagram.com/adtspb" class="fab fa-instagram social-media-link" target="_blank"></a>
                    </div>
                </div>
            </section>
      </article>
  </main>
</template>

<style scoped>
.home-content {
    padding: 30px;
}
.warning-container {
    padding: 20px;
    margin-bottom: 30px;
    max-width: 600px;
    min-width: 300px;
    box-sizing: border-box;
}
.link-container {
    padding: 10px;
    height: 35px;
    display: flex;
    justify-content: space-around;
    background-color: #615d39;
    border-radius: 30px;
}  
</style>

<script>
  import navigation from '../../components/Navigation.vue'

  export default {
    name: '',
    components: {
      navigation,
    },
    data() {
      return {

      }
    },
  }
</script>
