<template>
  <div class="modal" @click.self="modalHide">
    <div class="modal-main right">
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
          <p class="modal-title">Добавление УСПД</p>
          <div class="new-apl-file">
            <label for="">Название УСПД</label>
            <input v-model="parameters.name" type="text" placeholder="Введите название УСПД папки">
          </div>
          <div class="new-apl-g2">
            <div class="new-apl-file">
              <Select :options="options" @getSelected="getChannel($event)" label="Канал связи" id="channel"/>
            </div>
            <div class="new-apl-file">
              <label for="">IP адрес устройства</label>
              <input v-model="parameters.ipAddress" type="text" placeholder="Введите IP адрес устройства">
            </div>
          </div>
          <div class="new-apl-g2">
            <div class="new-apl-file">
              <label for="">Связной адрес счетчика</label>
              <input v-model="parameters.port" type="text" placeholder="Введите порт устройства">
            </div>
            <div class="new-apl-file">
              <label for="">Допустимая разница по времени</label>
              <input v-model="parameters.timeDifference" type="text"
                placeholder="Введите допустимую разницу по времени в секундах">
            </div>
          </div>
          <div class="new-apl-file">
            <label for="">Номер УСПД</label>
            <input v-model="parameters.number_uspd" type="text" placeholder="Введите номер УСПД">
          </div>
          <div class="new-apl-g2">
            <div class="new-apl-file">
              <label for="">Логин УСПД</label>
              <input v-model="parameters.login" type="text" placeholder="Введите логин УСПД">
            </div>
            <div class="new-apl-file">
              <label for="">Пароль УСПД</label>
              <input v-model="parameters.password" type="password" placeholder="Введите пароль УСПД">
            </div>
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
      tab: 1,
      dropdownID: '',
      dropdownListOpen: false,
      required: false,
      parameters: {},
      options: [
          {
              "classificator": "tcp",
              "name": "TCP/IP",
          },
          {
              "classificator": "modem",
              "name": "Modem",
          },
      ],
      payload: {
        pin: '',
        channel: ''
      },
    }
  },
  components: {
    // Icons
    Select
  },
  props: {
    idx: String
  },
  methods: {
    getChannel(e){
      this.parameters.connection_channel = e
    },
    async submit() {
      this.parameters.id = this.idx
			// const data = JSON.stringify({...this.parameters})
      // await ipcRenderer.invoke(eventNames.insertServerRequestUspd, data)
      // response && response.status === 200 ? alert('Success sended!') : alert("Something went wrong")
      this.modalHide()
    },
    modalHide() {
      this.$emit("modalShow", false);
    },
    drop(event) {
      if (this.dropdownID !== event.target.id) {
        this.dropdownID = event.target.id
        this.dropdownListOpen = event.target.id
      }
      else {
        this.dropdownID = ''
        this.timeOut = setTimeout(() => {
          this.dropdownListOpen = ''
        }, 150)
      }
    },

  },

  beforeUnmount() {
    const _t = this
    document.removeEventListener("click", _t.drop)
  },
  async mounted() {
    const _t = this
    document.addEventListener("click", _t.drop)
  },
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
  z-index: 10000;
  position: fixed;
  background: #010D1D80;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
}

.modal-main {
  width: calc(100% - 120px);
  height: calc(100% - 40px);
  border-radius: 0 0 0 100px;
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
  gap: 20px;
  justify-content: space-between;
}
</style>