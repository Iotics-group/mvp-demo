<template>
  <div class="modal" @click.self="modalHide">
    <div class="modal-main top">
      <!-- <div class="modal-header">
        <i @click="modalShow" class="icon-close" style="cursor: pointer;">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.7549 22.2459L22.2449 13.7559" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22.2449 22.2459L13.7549 13.7559" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.5 33H22.5C30 33 33 30 33 22.5V13.5C33 6 30 3 22.5 3H13.5C6 3 3 6 3 13.5V22.5C3 30 6 33 13.5 33Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </i>
      </div> -->
      <div class="modal-body">
        <div class="personal_info">
          <p class="modal-title">Новая временная зона</p>
          <div class="new-apl-file">
            <label for="">Название тарификации</label>
            <input v-model="payload.name" type="text" placeholder="Введите название тарификации">
          </div>
          <div class="new-apl-file">
            <Select label="Стоимость КВат" placeholder="Введите стоимость КВат в сумах" @getSelected="getPosition($event)" :options="options" id="uspd"/>
          </div>
          <div class="new-apl-file">
            <Select label="Начало временной зоны" placeholder="Выберите начало временной зоны" @getSelected="getMeter($event)" :options="options2" id="uspd1"/>
          </div>
          <div class="new-apl-file">
            <Select label="Конец временной зоны" placeholder="Выберите конец временной зоны" @getSelected="getMeter($event)" :options="options2" id="uspd2"/>
          </div>
          <div class="new-apl-block">
            <button @click="modalHide" class="red-filled-btn">Отмена</button>
            <button @click="submit" class="blue-filled-btn">Добавить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Icons from './icons.vue'
import Select from '../select.vue'
export default {
  data() {
    return {
      file: null,
      parent_id: null,
      payload: {},
      options: [
          {
              "classificator": "minister",
              "name": "Vazir",
          },
          {
              "classificator": "cleaner",
              "name": "Farrosh",
          },
      ],
      options2: [
          {
              "classificator": "admin",
              "name": "Admin",
          },
          {
              "classificator": "user",
              "name": "User",
          },
      ],
      name: undefined
    }
  },
  components: {
    Select,
    // Icons
  },
  props: {
    idx: String
  },
  methods: {
    getRole(e){
      this.payload.role = e
    },
    getPosition(e){
      this.payload.position = e
    },
    async submit() {
      // await ipcRenderer.invoke(eventNames.insertServerRequestFolders, { name: this.name ,parent_id:this.idx})
      // response && response.status === 200 ? alert('Success sended!') : alert("Something went wrong")
      this.modalHide()
    },
    modalHide() {
      this.$emit("modalShow", false);
    },
  },
  mounted() {
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
  height: auto;
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