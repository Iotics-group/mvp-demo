<template>
  <div class="modal" @click="modalHide">
    <div class="modal-main top" @click.stop>
      <div class="modal-body">
        <div class="personal_info">
          <p class="modal-title">Удаление временной зоны</p>
          <!-- <p>ID: {{ idx ? idx : '-' }}</p> -->
          <h1>Вы уверены, что хотите удалить временную зону Тариф 1 без возвратно?</h1>
          <div class="new-apl-block">
            <button @click="modalHide" class="red-filled-btn">Отмена</button>
            <button @click="submit" class="blue-filled-btn">Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Icons from './icons.vue'
export default {
  data() {
    return {
      parent_id: null,
      name: undefined
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
      // let response = await ipcRenderer.invoke(eventNames.insertServerRequestFolders, { name: this.name ,parent_id:this.idx})
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
  max-height: 400px;
  border-radius: 12px;
  background: white;
  padding: 12px 20px;
  position: relative;
}
.modal-main h1{
  text-align: center;
  color: #022134;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.48px;
  margin-bottom: 30px;
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