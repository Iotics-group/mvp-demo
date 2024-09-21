<template>
  <div class="modal">
    <div class="modal-main top" @click.stop>
      <div class="modal-body">
        <div class="personal_info">
          <p class="modal-title">{{$locale['serverUrl'][$i18n.locale.value]}}</p>
          <div class="new-apl-file">
            <label for="">{{$locale['link'][$i18n.locale.value]}}</label>
            <input @keypress.enter="submit" @keydown.esc="modalHide" v-model="url" type="text" :placeholder="$locale['enterServerUrl'][$i18n.locale.value]">
          </div>
          <div class="new-apl-block">
            <button @click="modalHide" class="red-filled-btn">{{$locale['cancel'][$i18n.locale.value]}}</button>
            <button @click="submit" class="blue-filled-btn">{{$locale['add'][$i18n.locale.value]}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Icons from './icons.vue'
import { ipcRenderer } from 'electron';
export default {
  data() {
    return {
      url: null
    }
  },
  components: {
    // Icons
  },
  props: {
    idx: String
  },
  methods: {
    async submit() {
      if(this.url){
        await localStorage.setItem('BASE_URL',this.url)
        ipcRenderer.send('relaunch')
      }
    },
    modalHide() {
      this.$emit("modalShow", false);
    },
  },
  mounted() {
    if(localStorage.getItem('BASE_URL')){
      this.url = localStorage.getItem('BASE_URL')
    }
  }
};
</script>
<style scoped>
.personal_info {
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 100%;
}

.modal {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background: #010D1D80;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-main {
  max-width: 1000px;
  width: 90%;
  height: 90%;
  max-height: 400px;
  border-radius: 12px;
  background: white;
  padding: 12px 20px;
  position: relative;
}

.modal-title {
  font-weight: 400;
  font-size: 24px;
  line-height: 150%;
  text-align: center;
  height: 48px;
  letter-spacing: 0.04em;
  align-items: center;
  display: flex;
  justify-content: center;
  border-radius: 5px;
  color: white;
  background: linear-gradient(215deg, #012F46 0%, #010D1D 47.19%, #01354C 141.84%);
}

.modal-body {
  width: 100%;
  height: 100%;
  padding: 0;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}</style>