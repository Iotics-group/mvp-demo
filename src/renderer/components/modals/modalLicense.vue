<template>
  <div class="modal" @click="modalHide">
    <div class="modal-main top" @click.stop>
      <div class="modal-body">
        <div class="personal_info">
          <p class="modal-title">{{$locale['autentification'][$i18n.locale.value]}}</p>
          <div class="licence-upload-block">
            <div class="licence-upload" v-if="!license">
              <span>JSON</span> 
              <h2> {{$locale['fileInformation'][$i18n.locale.value]}} </h2>
              <Icons @click="download" size="custom" color="#022134" width="48" height="48" icon="download"/>
            </div>
            <div class="licence-upload">
              <span>ILF</span> 
              <h2 v-if="!document"> {{$locale['fileLicense'][$i18n.locale.value]}} </h2>
              <h2 class="line-1-h1" v-else> {{document.name}} </h2>
              <input @change="setImage" v-show="false" type="file" accept=".ilf" id="license">
              <label for="license">
                <Icons size="custom" color="#022134" width="48" height="48" icon="upload"/>
              </label>
            </div>
            <span v-if="errorLimit" class="required mt-12">{{$locale['meterLimitError1'][$i18n.locale.value]}} {{limit}} {{$locale['meterLimitError2'][$i18n.locale.value]}}</span>
          </div>
          <div class="new-apl-block">
            <button @click="modalHide" class="red-filled-btn">{{$locale['cancel'][$i18n.locale.value]}}</button>
            <button @click="submit" class="blue-filled-btn">{{$locale['upload'][$i18n.locale.value]}}</button>
          </div>
        </div>
        <!-- <div class="personal_info">
          <p class="modal-title">Активация лицензии</p>
          <h1>Лицензия установлена и готова к работе</h1>
          <div class="new-apl-block">
            <button @click="submit" class="blue-filled-btn">Понятно</button>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>

import { ipcRenderer } from 'electron';
import eventNames from '@/universal/eventNames.js';
export default {
  data() {
    return {
      document: null,
      errorLimit: false,
      limit: 0,
      error: false,
    };
  },
  computed:{
    license(){
      return (this.$license?.license?.value ? Object.keys(this.$license?.license?.value)?.length : 0)
    }
  },
  methods: {
    async submit() {
      let payload = {pathRoot:this.document?.path}
      let data = JSON.stringify(payload)
      ipcRenderer.invoke(eventNames.newLicenseEvent,JSON.parse(data)).then(async (res) => {
        if(res){
          await ipcRenderer.invoke(eventNames.getlicenseData).then((res) => {
            this.$license.setLic(res?.data)
          }).catch(async (error)=>{
            console.log(error);
          })
          this.modalHide()
          this.$emit('response',res)
        }
      }).catch(async (error)=>{
        console.log(error);
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 400) {
          this.limit = Number(error.response?.data?.data?.baza_meters_length||0) - Number(error.response?.data?.data?.license_limit||0) 
          this.error = true
        }
      })
    },
    modalHide() {
      this.$emit("modalShow", false);
    },
    setImage(e) {
        this.document = e.target.files[0];
        this.$emit("getValue",this.document)
        this.$emit("getRequire",(this.document||this.documentUrl))
    },
    download(){
      ipcRenderer.invoke(eventNames.getUUIDLicenseData).then((response) => {
          var file = (new Blob([response]))
          var fileURL = window.URL.createObjectURL(new Blob([file]))
          var fileLink = document.createElement("a")
          fileLink.href = fileURL
          fileLink.setAttribute("download", `license.json`)
          document.body.appendChild(fileLink)
          fileLink.click()
          return "fileUploaded"
        }).catch(async (err)=>{
          console.log(err);
      })
    }
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
  max-height: 518px;
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