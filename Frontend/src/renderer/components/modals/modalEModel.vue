<template>
  <div class="modal">
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
          <p class="modal-title">{{ edit ? $locale['edit'][$i18n.locale.value] : $locale['new'][$i18n.locale.value] }} {{nameNewObj(objType)}}</p> 
          <div v-if="!edit" class="new-apl-file">
            <Select v-if="!loading" @getSelected="getSelected($event,'type')" :options="objType ? (arrays[objType]) : arrays.options" :label="$locale['typeObj'][$i18n.locale.value]" id="select_id"/>
            <p v-else>{{$locale['dataUploading'][$i18n.locale.value]}}</p>
          </div>
          <div class="new-apl-file">
            <label for="">{{$locale['nameOfTheProperty'][$i18n.locale.value]}}</label>
            <input v-model="payload.name" type="text" :placeholder="$locale['enterNameOfTheProperty'][$i18n.locale.value]">
          </div>
          <div class="new-apl-g2">
            <div v-if="(!edit)&&(objType == 'feeder')" class="new-apl-file">
              <Select @getSelected="getSelected($event,'meter_id')" :options="meters" :label="$locale['meter'][$i18n.locale.value]" id="select_meter"/>
            </div>
            <div v-if="((objType == 'feeder') && (!edit)) || ((objType == 'meter') && (edit))" class="new-apl-file">
              <div class="calendar-blocks">
                <div class="calendar-block">
                  <label for="">{{$locale['replacementDatetransformator'][$i18n.locale.value]}}</label>
                  <p class="calendar-input" @click.stop="opener('openDAte')">{{inpFilter.date || $locale['ddmmyyyy'][$i18n.locale.value]}} <icons color="white" icon="calendar"/></p>
                  <datepicker :changedDate="payload.date" @date="setdate($event,'date')"  @click.stop v-if="openDAte"/>
                </div>
              </div>
            </div>
          </div>
          <div v-if="((objType == 'feeder') && (!edit)) || ((objType == 'meter') && (edit))" class="meter-t">
            <h3>{{$locale['tt'][$i18n.locale.value]}}</h3>
            <div class="meter-tt">
              <Select v-if="!loading" @getSelected="getSelected($event,'tn1')" :bottom="true" :options="arrays.tn1" :label="$locale['tn1'][$i18n.locale.value]" id="select_current1"/>
              <Select v-if="!loading" @getSelected="getSelected($event,'tn2')" :bottom="true" :options="arrays.tn2" :label="$locale['tn2'][$i18n.locale.value]" id="select_current2"/>
              <div class="meter-coef">
                <p>{{$locale['coeffitsient'][$i18n.locale.value]}}</p>
                <span>{{ this.payload?.multiply?.[0] || 1 }}</span>
              </div>
            </div>
          </div>
          <div v-if="((objType == 'feeder') && (!edit)) || ((objType == 'meter') && (edit))" class="meter-t">
            <h3>{{$locale['tn'][$i18n.locale.value]}}</h3>
            <div class="meter-tt meter-tn">
              <Select v-if="!loading" @getSelected="getSelected($event,'tt')" :bottom="true" :options="arrays.tt" :label="$locale['voltage'][$i18n.locale.value]" id="select_voltage"/>
              <div class="meter-coef">
                <p>{{$locale['coeffitsient'][$i18n.locale.value]}}</p>
                <span>{{ this.payload?.multiply?.[1] || 1 }}</span>
              </div>
            </div>
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
import datepicker from '@/renderer/components/datepicker/datepicker.vue'
// import Icons from './icons.vue'
export default {
  data() {
    return {
      loading: true,
      id: null,
      arrays:{
        options: [
            {
                "classificator": "factory",
                "default": "active",
                "name": this.$locale['factory'][this.$i18n.locale.value],
            },
        ],
        factory: [
            {
                "classificator": "substation",
                "name": this.$locale['substation'][this.$i18n.locale.value],
            },
            {
                "classificator": "tire_section",
                "name": this.$locale['tire_section'][this.$i18n.locale.value],
            },
            {
                "classificator": "feeder",
                "name": this.$locale['feeder'][this.$i18n.locale.value],
            },
        ],
        substation: [
            {
                "classificator": "substation",
                "name": this.$locale['substation'][this.$i18n.locale.value],
            },
            {
                "classificator": "tire_section",
                "name": this.$locale['tire_section'][this.$i18n.locale.value],
            },
            {
                "classificator": "feeder",
                "name": this.$locale['feeder'][this.$i18n.locale.value],
            },
        ],
        tire_section: [
            {
                "classificator": "feeder",
                "name": this.$locale['feeder'][this.$i18n.locale.value],
            },
        ],
        feeder: [
            {
                "classificator": "meter",
                default: "active",
                "name": this.$locale['meter'][this.$i18n.locale.value],
            },
        ],
        tn1: [
            {
                "classificator": 1,
                default: "active",
                "name": "1",
            },
            {
                "classificator": 25,
                "name": "25",
            },
            {
                "classificator": 50,
                "name": "50",
            },
            {
                "classificator": 75,
                "name": "75",
            },
            {
                "classificator": 100,
                "name": "100",
            },
            {
                "classificator": 150,
                "name": "150",
            },
            {
                "classificator": 200,
                "name": "200",
            },
            {
                "classificator": 250,
                "name": "250",
            },
            {
                "classificator": 300,
                "name": "300",
            },
            {
                "classificator": 400,
                "name": "400",
            },
            {
                "classificator": 500,
                "name": "500",
            },
            {
                "classificator": 600,
                "name": "600",
            },
            {
                "classificator": 800,
                "name": "800",
            },
            {
                "classificator": 1000,
                "name": "1000",
            },
            {
                "classificator": 1200,
                "name": "1200",
            },
            {
                "classificator": 1500,
                "name": "1500",
            },
            {
                "classificator": 2000,
                "name": "2000",
            },
            {
                "classificator": 2500,
                "name": "2500",
            },
            {
                "classificator": 3000,
                "name": "3000",
            },
            {
                "classificator": 3500,
                "name": "3500",
            },
            {
                "classificator": 4000,
                "name": "4000",
            },
            {
                "classificator": 5000,
                "name": "5000",
            },
        ],
        tn2: [
            {
                "classificator": 1,
                default: "active",
                "name": "1",
            },
            {
                "classificator": 5,
                "name": "5",
            },
        ],
        tt: [
            {
                "classificator": 1,
                "name": "0,22 кВ",
            },
            {
                "classificator": 2,
                "name": "0,4 кВ",
            },
            {
                "classificator": 3,
                "name": "6 кВ",
            },
            {
                "classificator": 4,
                "name": "10 кВ",
            },
            {
                "classificator": 5,
                "name": "27,5 кВ",
            },
            {
                "classificator": 6,
                "name": "35 кВ",
            },
            {
                "classificator": 7,
                "name": "110 кВ",
            },
            {
                "classificator": 8,
                "name": "220 кВ",
            },
            {
                "classificator": 9,
                "name": "500 кВ",
            },
        ],
        coef_tn: [
          {
            "dividend": 220,
            "divisor": 220
          },
          {
            "dividend": 380,
            "divisor": 380
          },
          {
            "dividend": 6000,
            "divisor": 100
          },
          {
            "dividend": 10000,
            "divisor": 100
          },
          {
            "dividend": 27500,
            "divisor": 100
          },
          {
            "dividend": 35000,
            "divisor": 100
          },
          {
            "dividend": 110000,
            "divisor": 100
          },
          {
            "dividend": 220000,
            "divisor": 100
          },
          {
            "dividend": 500000,
            "divisor": 100
          },
        ]
      },
      openDAte: false,
      meters:[],
      inpFilter: {
        date: null,
      },
      payload:{}
    }
  },
  components: {
    // Icons,
    Select,
    datepicker
  },
  props:{
    idx: String,
    objType: String,
    edit: Boolean
  },
  methods: {
    setdate(e,type){
      let date = new Date(e?.unformat)
      let date1 = date && date?.toISOString()
      this.payload[type] = date1
      this.inpFilter[type] = e?.format
      this.opener()
    },
    opener(e){
      const fl = ['openDAte']
      this[e] = !this[e]
      fl?.forEach((j)=>{if (j!=e) {
        this[j] = false
      }})
    },
    nameNewObj(e){
      let r;
      if(!this.edit){
        if(e == 'feeder'){
          r = this.$locale['meter'][this.$i18n.locale.value].toLowerCase()
        }else if(e == 'tire_section'){
          r = this.$locale['feeder'][this.$i18n.locale.value].toLowerCase()
        }else if(e == 'substation'){
          r = this.$locale['tire_section'][this.$i18n.locale.value].toLowerCase()
        }else if(e == 'factory'){
          r = this.$locale['substation'][this.$i18n.locale.value].toLowerCase()
        }else {
          r = this.$locale['factory'][this.$i18n.locale.value].toLowerCase()
        }
      }else{
        if(e == 'feeder'){
          r = this.$locale['feeder'][this.$i18n.locale.value].toLowerCase()
        }else if(e == 'tire_section'){
          r = this.$locale['tire_section'][this.$i18n.locale.value].toLowerCase()
        }else if(e == 'substation'){
          r = this.$locale['substation'][this.$i18n.locale.value].toLowerCase()
        }else if(e == 'factory'){
          r = this.$locale['factory'][this.$i18n.locale.value].toLowerCase()
        }else {
          r = this.$locale['factory'][this.$i18n.locale.value].toLowerCase()
        }
      }
      return r
    },
    async submit(){
      if(this.payload.type != 'meter'){
        delete this.payload.date
      }
      if(!this.edit){
        if((this.payload.type == 'meter' && this.payload.name && this.payload.meter_id)||(this.payload.type != 'meter')){
            if(this.idx){
              this.payload.parent_object = this.idx
            }
            if(this.payload.type == 'meter'){
              if(!this.payload?.vt?.dividend){
                this.payload.vt = {...this.payload.vt,dividend: 1}
              }
              if(!this.payload?.vt?.divisor){
                this.payload.vt = {...this.payload.vt,divisor: 1}
              }
              if(!this.payload?.ct?.dividend){
                this.payload.ct = {...this.payload.ct,dividend: 1}
              }
              if(!this.payload?.ct?.divisor){
                this.payload.ct = {...this.payload.ct,divisor: 1}
              }
              this.payload = {...this.payload, multiply: [ (this.payload?.vt?.dividend/this.payload?.vt?.divisor),((this.payload?.ct?.dividend/this.payload?.ct?.divisor)) ]}
            }
            let requestName = this.payload.type == 'meter' ? '/electricity/create-meter':'/electricity/create-folder'
            let data = JSON.stringify({...this.payload})
            await this.$axios.post(requestName, JSON.parse(data)).then((res) => {
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
          }
          else{
            this.$emit('response',{status:500, message: this.$locale['fillInputnmaeObjAndMeter'][this.$i18n.locale.value]})
          }
        }else{
          if(this.payload.name && this.id){
            if(this.payload.type == 'meter'){
              if(!this.payload?.vt?.dividend){
                this.payload.vt = {...this.payload.vt,dividend: 1}
              }
              if(!this.payload?.vt?.divisor){
                this.payload.vt = {...this.payload.vt,divisor: 1}
              }
              if(!this.payload?.ct?.dividend){
                this.payload.ct = {...this.payload.ct,dividend: 1}
              }
              if(!this.payload?.ct?.divisor){
                this.payload.ct = {...this.payload.ct,divisor: 1}
              }
              this.payload = {...this.payload, multiply: [ (this.payload?.vt?.dividend/this.payload?.vt?.divisor),((this.payload?.ct?.dividend/this.payload?.ct?.divisor)) ]}
            }
            let requestName = this.payload.type == 'meter' ? ('/electricity/update-meter/'+this.idx):('/electricity/update-folder/'+this.idx)
            delete this.payload.type
            let data = JSON.stringify({...this.payload})
            await this.$axios.put(requestName, JSON.parse(data)).then((res) => {
              if(res){
                this.modalHide()
                this.$emit('response',res)
              }
            }).catch(async (error)=>{
              const statusCode = (error.response || {}).status || -1;
              if (statusCode == 406) {
                if(error.config.method == 'put'){
                  this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                    localStorage.setItem('session',res?.data?.session)
                    this.submit()
                  }).catch((err)=>{
                    this.$emit('response',err)
                  })
                }
              }else{
                this.$emit('response',error)
              }
            })
          }
          else{
            this.$emit('response',{status:500, message: this.$locale['fillInputnmaeObjAndMeter'][this.$i18n.locale.value]})
          }
        }
      
    },
    getSelected(e,type){
      if((type != 'tn1') && (type != 'tn2') && (type != 'tt')) {
        this.payload[type] = e
      }else if(type == 'tn1'){
        this.payload.vt = {
          ...this.payload.vt,
          dividend: e
        }
      }else if(type == 'tn2'){
        this.payload.vt = {
          ...this.payload.vt,
          divisor: e
        }
      }else if(type == 'tt'){
        this.payload = {...this.payload,ct:this.arrays.coef_tn?.[e-1]}
      }
      if(this.payload.type == 'meter'){
        this.payload = {...this.payload, multiply: [ ((this.payload?.vt?.dividend&&this.payload?.vt?.divisor) ? (this.payload?.vt?.dividend/this.payload?.vt?.divisor) : 1),((this.payload?.ct?.dividend&&this.payload?.ct?.divisor) ? (this.payload?.ct?.dividend/this.payload?.ct?.divisor) : 1) ]}
      }
    },
    modalHide() {
      this.$emit("modalShow", false);
    },
  },
  async mounted(){
    this.loading = true
    this.inpFilter.date = (new Date()).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }); 
    this.payload.date = (new Date()).toISOString()
    if(this.edit && this.idx){
      await this.$axios.get(`/electricity/single/${this.idx}`,{params:{type:this?.objType}}).then((res) => {
        var data = res?.data ? res?.data?.data : '';
        this.payload.name = data?.name
        this.payload.type = data?.type
        this.id = data?._id
        if(this.objType == 'meter'){
          this.payload.multiply = [ (data?.vt?.dividend/data?.vt?.divisor),(data?.ct?.dividend/data?.ct?.divisor) ]
          this.arrays.tn1.forEach((el,index)=>{
            if((el.classificator == data?.vt.dividend) && (data?.vt.dividend != 1)){
              this.arrays.tn1[index].default = 'active'
            }
          })
          this.arrays.tn2.forEach((el,index)=>{
            if((el.classificator == data?.vt.divisor) && (data?.vt.dividend != 1)){
              this.arrays.tn2[index].default = 'active'
            }
          })
          this.arrays.coef_tn.forEach((el,index)=>{
            if((el.dividend == data?.ct.dividend) && (el.divisor == data?.ct.divisor)){
              this.arrays.tt[index].default = 'active'
            }
          })
        }
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.$axios.get(`/electricity/single/${this.idx}`,{params:{type:this?.objType}}).then((res) => {
                var data = res?.data ? res?.data?.data : '';
                this.payload.name = data?.name
                this.payload.id = data?._id
                if(this.objType == 'meter'){
                  this.payload.multiply = [ (data?.vt?.dividend/data?.vt?.divisor),(data?.ct?.dividend/data?.ct?.divisor) ]
                  this.arrays.tn1.forEach((el,index)=>{
                    if(el.classificator == data?.vt.dividend){
                      this.arrays.tn1[index].default = 'active'
                    }
                  })
                  this.arrays.tn2.forEach((el,index)=>{
                    if(el.classificator == data?.vt.divisor){
                      this.arrays.tn2[index].default = 'active'
                    }
                  })
                  this.arrays.coef_tn.forEach((el,index)=>{
                    if((el.dividend == data?.ct.dividend) && (el.divisor == data?.ct.divisor)){
                      this.arrays.tt[index].default = 'active'
                    }
                  })
                }
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
    await this.$axios.get('/electricity/meter-use').then((res) => {
      if(res.data) {
        this.meters = (res?.data?.data);
        this.meters.forEach((el,index)=>{
          this.meters[index].classificator = el.id
        })
      }
    }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.$axios.get('/electricity/meter-use').then((res) => {
                if(res.data) {
                  this.meters = (res.data);
                  this.meters.forEach((el,index)=>{
                    this.meters[index].classificator = el.id
                  })
                }
              }).catch((err)=>{
                console.log(err);
              })
            }).catch((err)=>{
              console.log(err);
            })
          }
        }
      })
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