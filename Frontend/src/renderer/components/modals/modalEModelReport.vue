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
        <div class="personal_info" v-if="!loading"> 
          <p class="modal-title">{{ edit ? $locale['edit'][$i18n.locale.value] : $locale['new'][$i18n.locale.value] }} {{$locale['object'][$i18n.locale.value]}}</p> 
          <div v-if="!edit" class="new-apl-file">
            <Select @getSelected="getSelected($event,'type')" :options="objType ? (arrays[objType]) : arrays.options" :label="$locale['typeObj'][$i18n.locale.value]" id="select_id"/>
          </div>
          <div class="new-apl-file">
            <label for="">{{$locale['nameOfTheProperty'][$i18n.locale.value]}}</label>
            <input v-model="payload.name" type="text" :placeholder="$locale['enterNameOfTheProperty'][$i18n.locale.value]">
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
import Select from '../select.vue'
// import Icons from './icons.vue'
export default {
  data() {
    return {
      arrays:{
        options: [
          {
            "classificator": "main",
            "name": this.$locale['calc_main'][this.$i18n.locale.value],
          },
          {
            "classificator": "child",
            "name": this.$locale['calc_child'][this.$i18n.locale.value],
          },
        ],
        main: [
          {
            "classificator": "child",
            "name": this.$locale['calc_child'][this.$i18n.locale.value],
          },
          {
            "classificator": "end",
            "name": this.$locale['calc_meter'][this.$i18n.locale.value],
          },
        ],
        child: [
          {
            "classificator": "child",
            "name": this.$locale['calc_child'][this.$i18n.locale.value],
          },
          {
            "classificator": "end",
            "name": this.$locale['calc_meter'][this.$i18n.locale.value],
          },
        ],
      },
      meters:[],
      payload:{},
      loading: true,
    }
  },
  components: {
    // Icons,
    Select
  },
  props:{
    idx: String,
    objType: String,
    model: String,
    edit: Boolean
  },
  methods: {
    async submit(){
      if(!this.edit){
        if(this.idx){
          this.payload.parent_object = this.idx
        }
        delete this.payload.id
        let data = JSON.stringify({...this.payload})
        await this.$axios.post('/calculation/create', JSON.parse(data)).then((res) => {
          if(res) {
            this.modalHide()
            this.$emit('response',res)
          }
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'post'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.submit()
              }).catch((err)=>{
                this.$emit('response',err)
              })
            }
          }else{
            this.$emit('response',error)
          }
        })
      }else{
        delete this.payload.id
        let data = JSON.stringify({...this.payload})
        await this.$axios.put(('/calculation/update/'+this.idx), JSON.parse(data)).then((res) => {
          if(res){
            this.modalHide()
            this.$emit('response',res)
          }
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'post'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.submit()
              }).catch((err)=>{
                this.$emit('response',err)
              })
            }
          }else{
            this.$emit('response',error)
          }
        })
      }
    },
    getSelected(e,type){
      this.payload[type] = e
    },
    modalHide() {
      this.$emit("modalShow", false);
    },
  },
  async mounted(){
    this.loading = true
    if(this.edit && this.idx){
      await this.$axios.get(`/calculation/single/${this.idx}?type=${this?.objType}`).then((res) => {
        var data = res?.data ? res?.data?.data : '';
        this.payload.name = data?.name
        this.payload.id = data?._id
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.$axios.get(`/calculation/single/${this.idx}?type=${this?.objType}`).then((res) => {
                var data = res?.data ? res?.data?.data : '';
                this.payload.name = data?.name
                this.payload.id = data?._id
              }).catch((err)=>{
                console.log(err);
              })
            }).catch((err)=>{
              console.log(err);
            })
          }
        }
      })
    }
    this.loading = false
  }
};
</script>
<style scoped>
.personal_info{
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
}
</style>