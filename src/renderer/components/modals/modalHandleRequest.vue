<template>
  <div class="modal">
    <div class="modal-main top" @click.stop>
      <div class="modal-body">
        <div class="personal_info">
          <p class="modal-title">{{$locale['handleReq'][$i18n.locale.value]}}</p>
          <table class="handle-request">
            <tr>
              <th>{{$locale['stepName'][$i18n.locale.value]}}</th>
              <th>{{$locale['status'][$i18n.locale.value]}}</th>
              <th>{{$locale['time'][$i18n.locale.value]}}</th>
            </tr>
            <tr v-if="requests?.old">
              <td>{{$locale['startRequest'][$i18n.locale.value]}}</td>
              <td :class="requests?.old?.status">{{reqTypes?.[requests?.old?.status]||'-'}}</td>
              <td>{{dateFilter(requests?.old?.date)}}</td>
            </tr>
            <tr v-show="(key != 'old')&&(key != 'full')" v-for="el,key,index in requests" :key="index">
              <td>{{reqList?.[key] || ''}}</td>
              <td :class="el?.status">{{reqTypes?.[el?.status]||'-'}}</td>
              <td>{{dateFilter(el?.date)}}</td>
            </tr>
          </table>
          <div class="new-apl-block">
            <button v-if="(((requests?.full?.status != 'end')&&(requests?.full?.status != 'failed'))&&(step == 2))" @click="stopHandleReq" class="red-filled-btn">{{$locale['stop'][$i18n.locale.value]}}</button>
            <button v-else @click="modalHide" class="red-filled-btn">{{$locale['cancel'][$i18n.locale.value]}}</button>
            <button v-if="step == 1" @click="submit" class="blue-filled-btn">{{$locale['startHandleReq'][$i18n.locale.value]}}</button>
            <button v-if="step == 2" @click="resubmit" :disabled="((requests?.full?.status != 'end')&&(requests?.full?.status != 'failed'))" class="blue-filled-btn">{{$locale['resend'][$i18n.locale.value]}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Icons from './icons.vue'
import { ipcRenderer } from 'electron';
import eventNames from '@/universal/eventNames.js';

export default {
  data() {
    return {
      file: null,
      parent_id: null,
      step: 1,
      reqList:{
        connect: this.$locale['checkConnection'][this.$i18n.locale.value],
        date: this.$locale['checkDate'][this.$i18n.locale.value],
        billing: this.$locale['billing'][this.$i18n.locale.value],
        current: this.$locale['currentData'][this.$i18n.locale.value],
        archive: this.$locale['archiveData'][this.$i18n.locale.value],
        event: this.$locale['journal'][this.$i18n.locale.value],
      },
      reqTypes:{
        succeed: this.$locale['success'][this.$i18n.locale.value],
        sent: this.$locale['pollInProgress'][this.$i18n.locale.value],
        failed: this.$locale['failed'][this.$i18n.locale.value],
        next: this.$locale['missed'][this.$i18n.locale.value],
        stopped: this.$locale['stopped'][this.$i18n.locale.value],
        pending: this.$locale['pending'][this.$i18n.locale.value],
        success: this.$locale['successfully'][this.$i18n.locale.value],
      },
      requests: {},
      name: undefined
    }
  },
  components: {
    // Icons
  },
  props: {
    idx: String,
    active: Object
  },
  methods: {
    dateFilter(e){
      if(e){
        let date = new Date(e)
        let newtime = ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+':'+('0'+date.getSeconds()).slice(-2)+':'+('0'+date.getMilliseconds()).slice(-3)
        return  newtime
      }else{
        return "-"
      }
    },
    async stopHandleReq(){
      Object.keys(this.requests).map((k)=>{
        if((this.requests[k]?.status == 'sent')||(this.requests[k]?.status == 'pending')){
          this.requests[k].status = 'stopped'
          this.requests[k].date = new Date()
        }
      })
      await ipcRenderer.invoke(eventNames.stopManualRequestEvent, { id: this.active?.meter }).then((res) => {
        if(res?.error == false){
          this.requests.full = {status:'end',date: new Date()}
        }
      })
      .catch(async (error)=>{
        console.log(error);
      })
    },
    async resubmit(){
      await ipcRenderer.invoke(eventNames.startManualRequest, { id: this.active?.meter }).then((res) => {
        if(res){
          this.name = res?.meter_name
          this.requests = {old: {status:'pending',date: new Date()}}
        }
      })
      .catch(async (error)=>{
        console.log(error);
      })
      ipcRenderer.on('manual-request', (event, message) => {
        if(message.where == 'connect'){
          this.requests.old = {status:'success',date: new Date()}
        }
        this.requests[message.where] = {status: message.status,date: new Date()}
        if(message.where == 'full'){
          Object.keys(this.requests).map((k)=>{
            if((this.requests[k]?.status == 'sent')||(this.requests[k]?.status == 'pending')){
              this.requests[k] = {status:message.status,date: new Date()}
            }
          })
        }
      });
    },
    async submit() {
      this.step++
      await ipcRenderer.invoke(eventNames.startManualRequest, { id: this.active?.meter }).then((res) => {
        if(res){
          this.name = res?.meter_name
          this.requests = {old: {status:'pending',date: new Date()}}
        }
      })
      .catch(async (error)=>{
        console.log(error);
      })
      ipcRenderer.on('manual-request', (event, message) => {
        if(message.where == 'connect'){
          this.requests.old = {status:'success',date: new Date()}
        }
        this.requests[message.where] = {status: message.status,date: new Date()}
        if(message.where == 'full'){
          Object.keys(this.requests).map((k)=>{
            if((this.requests[k]?.status == 'sent')||(this.requests[k]?.status == 'pending')){
              this.requests[k] = {status:message.status,date: new Date()}
            }
          })
        }
      });
    },
    modalHide() {
      this.requests= {}
      this.$emit("modalShow", false);
    },
  },
  async mounted() {
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
  max-height: 620px;
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