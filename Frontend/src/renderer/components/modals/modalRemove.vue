<template>
  <div class="modal" @click="modalHide">
    <div class="modal-main top" @click.stop>
      <div class="modal-body">
        <div class="personal_info">
          <p class="modal-title">{{$locale['removeObj'][$i18n.locale.value]}}</p>
          <!-- <p>ID: {{ idx ? idx : '-' }}</p> -->
          <h2 v-if="data?.activeFolder?.meters">{{$locale['yohave'][$i18n.locale.value]}} {{data?.activeFolder?.meters}} {{$locale['yohaveMeter'][$i18n.locale.value]}}</h2>
          <h1>{{$locale['confirmation'][$i18n.locale.value]}} {{$locale['remove'][$i18n.locale.value]?.toLowerCase()}} {{name||$locale['object'][$i18n.locale.value]}} ?</h1>
          <div class="new-apl-block">
            <button @click="modalHide" class="red-filled-btn">{{$locale['cancel'][$i18n.locale.value]}}</button>
            <button @click="submit" class="blue-filled-btn">{{$locale['remove'][$i18n.locale.value]}}</button>
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
      meter_id: null,
      name: undefined
    }
  },
  components: {
    // Icons
  },
  props: {
    idx: String,
    data: Object,
    report: Boolean,
  },
  methods: {
    async submit() {
      if(this.data?.objType){
        let requestName = this.data?.objType === 'meter' ? ('/meter/remove-meter/'+this.meter_id):('/meter/remove-folder/'+this.meter_id);
        await this.$axios.delete(requestName).then((res) => {
          if(res) {
            this.modalHide()
            this.$emit('response',res)
          }
        }).catch(async (err)=>{
          if(err.response.status == 406){
            if(err.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.submit()
              }).catch((err)=>{
                console.log(err);
              })
            }
          }
        })
      }else{
        let requestName = this.report === true ? ('/calculation/delete/'+this.idx):('/electricity/delete/'+this.idx);
        await this.$axios.delete(requestName).then((res) => {
          if(res) {
            this.modalHide()
            this.$emit('response',res)
          }
        }).catch(async (err)=>{
          if(err.response.status == 406){
            if(err.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.submit()
              }).catch((err)=>{
                console.log(err);
              })
            }
          }
        })
      }
      this.modalHide()
    },
    modalHide() {
      this.$emit("modalShow", false);
    },
  },
  async mounted() {
    if(this.data?.objType){
      if(this.data?.objType == 'meter'){
        this.meter_id = this.data?.active?.meter
      }else{
        this.meter_id = this.idx
      }
      this.name = this.data?.active?.name
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
.modal-main h2{
  text-align: center;
  color: #022134;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.48px;
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