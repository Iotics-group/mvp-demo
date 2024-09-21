
<template>
  <div class="wrapper">
    <div class="header">
      <h3>{{$locale['elect_model'][$i18n.locale.value]}}</h3>
      <div class="breadcrumbs">
        <p>{{$locale['object_rep'][$i18n.locale.value]}}</p>
        <img src="../assets/svg/arrR.svg" alt="">
        <p>{{$locale['elect_model'][$i18n.locale.value]}} </p>
      </div>
    </div>
    <div class="e-model empanel">
      <div class="model-block" @click="unFocus">
        <div class="wrapblock tree-emodel">
          <div class="beforeB" :style="div ? ('height:'+(div)+'px') : ''">
            <div class="beforeFLB" :style="'top:'+(64*(index)+21) + 'px;'" v-for="el,index in beforeFLBValue" :key="index"></div>
          </div>
          <div id="emodel" class="model-div">
            <ul class="tree-menu">
              <TreeParentFirst :first="data[0]" accessEmits="getId,activeParam" :trsn="true" :beforeFLBValue="beforeFLBValue" @click.stop="getH" @activeParam="activeParam($event)" @getId="getId()" v-for="(item,index) in data" :key="index" class="tree-item" :model="item"></TreeParentFirst>
            </ul>
          </div>
        </div>
        <div class="model-btn">
          <!-- <button v-if="(user_tools == 'admin')" @click="newObjAdd">{{$locale['newObject'][$i18n.locale.value]}}</button> -->
        </div>
      </div>
      <div class="model-block">
        <div class="model-voltage-gis">
          <h1>{{$locale['propertyInformation'][$i18n.locale.value]}}</h1>
          <div class="model-voltage-ginfo" v-if="active">
            <div class="model-voltage-text">
              <p>{{$locale['nameOfTheProperty'][$i18n.locale.value]}}:</p><span> {{ active?.name }} </span>
            </div>
            <div v-if="active?.meter_type" class="model-voltage-text">
              <p>{{$locale['meterType'][$i18n.locale.value]}}:</p><span> {{ meters?.[active?.meter_type] || '-' }} </span>
            </div>
            <div v-if="active?.number_meter" class="model-voltage-text">
              <p>{{$locale['factoryNumber'][$i18n.locale.value]}}: </p><span>{{ active?.number_meter }}</span>
            </div>
            <div class="model-voltage-text" v-if="active?.type == 'transformatorelec'">
              <p>{{$locale['voltage'][$i18n.locale.value]}}: </p><span>{{active?.data?.dividend}} / {{active?.data?.divisor}}</span>
            </div>
            <div class="model-voltage-text" v-if="active?.type == 'transformatorvoltage'">
              <p>{{$locale['current'][$i18n.locale.value]}}: </p><span>{{active?.data?.dividend}} / {{active?.data?.divisor}}</span>
            </div>
          </div>
        </div>
        <div class="model-voltage-block" v-if="active?.parameters">
          <h3>{{$locale['options'][$i18n.locale.value]}}:</h3>
          <div v-show="item?.parameter_type != 'journal'" class="model-voltage-select-block" v-for="item,idx in active?.block" :key="idx">
            <label for="">{{item?.param_name?.[$i18n.locale.value] || item?.param_name}}</label>
            <div class="model-voltage-select">
              {{item.text?.[$i18n.locale.value] || item?.text}}
            </div>
          </div>
        </div>
        <!-- <div class="model-btn">
          <button disabled>Добавить параметр</button>
        </div> -->
      </div>
      <div class="model-block gradient">
        <div class="wrapblock tree-emodel mh-30h">
          <div class="model-div">
            <div class="model-voltage-gis">
              <h1>{{$locale['options'][$i18n.locale.value]}}</h1>
              <div class="model-voltage-select-block">
                <div class="model-voltage-select">
                  <Select :placeholder="$locale['elect_model'][$i18n.locale.value]" @getSelected="getPosition($event)" :options="options" id="uspd"/>
                </div>
              </div>
            </div>
            <ul class="tree-menu tree-sec">
              <div class="d-f fd-c gap-20" v-if="modelType == 'electObj'">
                <TreeParentSec :beforeFLBValue="beforeFLBValue" :active="active" :first="dataElec[0]" :params="params" accessEmits="setParam" @setParam="setParam($event)" v-for="(item,index) in dataElec" :key="index" class="tree-item" :model="item" :trsn="true"></TreeParentSec>
              </div>
              <div class="d-f fd-c gap-20" v-if="modelType == 'calcObj'">
                <TreeParentSec :beforeFLBValue="beforeFLBValue" :active="active" :first="dataCalc[0]" :params="params" :icon="false" accessEmits="setParam" @setParam="setParam($event)" :report="true" v-for="(item,index) in dataCalc" :key="index" class="tree-item" :model="item" :trsn="true"></TreeParentSec>
              </div>
            </ul>
          </div>
        </div>
        <div class="model-btn">
          <!-- <button v-if="params?.length && (user_tools == 'admin') && (active?.type != 'transformatorvoltage') && (active?.type != 'transformatorelec')" @click="attachParams">{{$locale['saveChanges'][$i18n.locale.value]}} </button> -->
        </div>
      </div>
    </div>
    <transition name="notify" :duration="10000">
        <notify :main="$locale['successfully'][$i18n.locale.value]" :text="$locale['requestCompletedSuccessfully'][$i18n.locale.value]" @close="success=false" typeModal="success" v-if="success"/>
    </transition>
    <transition name="notify" :duration="10000">
        <notify :main="$locale['error'][$i18n.locale.value]" :text="wrongM" @close="wrong=false" typeModal="error" v-if="wrong"/>
    </transition>
    <transition name="notify" :duration="10000">
        <notify :main="$locale['warning'][$i18n.locale.value]" :text="$locale['onlyOneMeterCanBeAddedToAFeeder'][$i18n.locale.value]" @close="warning=false" typeModal="warning" v-if="warning"/>
    </transition>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron';
import TreeParentFirst from '../components/menu/TreeParentFirst.vue';
import Select from '../components/select2.vue'
import TreeParentSec from '../components/menu/TreeParentSec.vue';
export default {
  data() {
    return {
      open: false,
      div: null,
      modal: false,
      idx: null,
      success: false,
      wrongM: this.$locale['somethingWrong'][this.$i18n.locale.value],
      wrong: false,
      warning: false,
      meters:{},
      options: [
        {
          "classificator": "electObj",
          default: 'active',
          "name": this.$locale['side_map'][this.$i18n.locale.value],
        },
        {
          "classificator": "calcObj",
          "name": this.$locale['side_object'][this.$i18n.locale.value],
        },
      ],
      data: [],
      dataElec: [],
      dataCalc: [],
      active: null,
      openDate: null,
      beforeFLBValue: 100,
      allArr: [],
      objType: null,
      remove: false,
      params: [],
      modelType: 'electObj',
      user_tools: 'super',
      edit: false
    };
  },
  components:{
    TreeParentFirst,
    TreeParentSec,
    Select,
  },
  methods: {
    getH(){
      const t = this
      setTimeout(() => {
        t.div = document.getElementById('emodel')?.clientHeight
      }, 1000);
    },
    newParam(e,f){
      let newarr = []
      f?.forEach((j)=>{
        let newarr2 = e.filter(w => (w?.param_details?.[0]?.param_short_name) == j)
        if(newarr2?.length){
          newarr = newarr2
        }
      })
      return newarr
    },
    newObjAdd(){
      this.idx = null
      this.objType = null
      this.modal = true
    },
    getPosition(e){
      this.modelType = e
    },
    setParam(a){
      if(!a?.length){return}
      let arr = [...a]
      arr?.forEach(e => {
        if(e?.model_type == 'feeder'){
          this.params.forEach((obj) => {
            if (obj?.meter == e?.meter) {
              if(obj?.params_meter && Object.keys(obj?.params_meter)?.length){
                e.params_meter = obj?.params_meter
              }
            }
          })
        }else if(e?.model_type == 'meter'){
          this.params.forEach((obj) => {
            if (obj?.meter == e?.meter) {
              if(obj?.params_feeder && Object.keys(obj?.params_feeder)?.length){
                e.params_feeder = obj?.params_feeder
              }
            }
          })
        }
        if(Object.keys(e)?.length){
          if(e?.params_feeder && !Object.keys(e?.params_feeder)?.length){
            delete e?.params_feeder
          }
          if(e?.params_meter && !Object.keys(e?.params_meter)?.length){
            delete e?.params_meter
          }
          this.params = this.params?.filter((el)=> (!!(el?.params_meter && Object.keys(el?.params_meter)?.length || el?.params_feeder && Object.keys(el?.params_feeder)?.length)))
          if((((e?.params_meter && Object.keys(e?.params_meter)?.length) == undefined) && ((e?.params_feeder && Object.keys(e?.params_feeder)?.length) == undefined))){
            return
          }
          if(this.params?.length){
            let found = false;
            this.params.forEach((obj,index) => {
              if ((obj?.meter != undefined) && (obj.meter == e.meter)) {
                let concatenatedObj = {};
                for (let key in this.params[index]) {
                  concatenatedObj[key] = this.params[index][key];
                }
                for (let key in e) {
                  concatenatedObj[key] = e[key];
                }
                for (let key in concatenatedObj) {
                  if(e[key] == undefined){
                    delete concatenatedObj[key]
                  }
                }
                if((!e?.params_feeder)&&(obj?.params_feeder)){
                  concatenatedObj.multiply = obj?.multiply
                }else if((e?.params_feeder)&&(!obj?.params_feeder)){
                  concatenatedObj.multiply = e?.multiply
                }
                this.params[index] = concatenatedObj;
                found = true;
              }
            });
            if (!found) {
              this.params.push(e);
            }
          }else{
            this.params = a
          }
        }
      });
    },
    async attachParams(){
      this.params?.forEach((el,indx)=>{
        delete this.params[indx]._id
        delete this.params[indx].model_type
      })
      let data = JSON.stringify({
        parameters:this.params
      })
      if((this.active.type == 'feeder')){
        this.wrong = true
        this.wrongM = this.$locale['cannotAttachParameterToFeeder'][this.$i18n.locale.value]
        let _t = this
        setTimeout(()=>{
          _t.wrong = false
        },5000)
      }else if((this.active.type == 'meter')){
        this.wrong = true
        this.wrongM = this.$locale['cannotAttachParameterToCounter'][this.$i18n.locale.value]
        let _t = this
        setTimeout(()=>{
          _t.wrong = false
        },5000)
      }else{
        await this.$axios.patch(('/electricity/attach-params/'+this.active._id),JSON.parse(data)).then((res) => {
          if(res && (res.status < 300)) {
            this.success = true
            let _t = this
            setTimeout(()=>{
              _t.success = false
            },5000)
            this.idx = null
            this.data = []
            this.dataElec = []
            this.dataCalc = []
            this.allArr = []
            this.objType = null
            this.params = []
            this.mountFunc()
          }
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'patch'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.$axios.patch(('/electricity/attach-params/'+this.active._id),JSON.parse(data)).then((res) => {
                  if(res && (res.status < 300)) {
                    this.success = true
                    let _t = this
                    setTimeout(()=>{
                      _t.success = false
                    },5000)
                    this.idx = null
                    this.data = []
                    this.dataElec = []
                    this.dataCalc = []
                    this.allArr = []
                    this.objType = null
                    this.params = []
                    this.mountFunc()
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
    },
    setstatus(e){
      if(e.status < 300){
        this.success = true
        let _t = this
        this.idx = null
        this.data = []
        this.dataElec = []
        this.dataCalc = []
        this.allArr = []
        this.objType = null
        this.params = []
        this.mountFunc()
        setTimeout(()=>{
          _t.success = false
        },5000)
      }else{
        this.wrong = true
        this.wrongM = e.message
        let _t = this
        setTimeout(()=>{
          _t.wrong = false
        },5000)
      }
    },
    modalShow(){
      this.modal = false
      this.remove = false
      this.data = []
      this.dataElec = []
      this.dataCalc = []
      this.beforeFLB()
      this.getH()
      this.mountFunc()
    },
    beforeFLB(){
      let len = document.getElementsByClassName('lb')?.length || 100
      this.beforeFLBValue = len+1
    },
    getId(){
      let _t= this
      setTimeout(()=>{
        _t.beforeFLB()
        _t.getH()
      },100)
    },
    activeParam(e){
      this.active = e
      this.params = this.active?.parameters
      if((e.type != 'transformatorelec')&&(e.type != 'transformatorvoltage')){
        this.active?.parameters?.forEach((el,index)=>{this.allArr[index] = 0})
      }
    },
    unFocus() {
      let els = document.getElementsByClassName('div');
      for(let i=0;i<els.length;i++){
        els[i].classList.remove('isFocus')
      }
      let els2 = document.getElementsByClassName('div2');
      for(let i=0;i<els2.length;i++){
        els2[i].classList.remove('isFocus')
      }
    },
    opener(e){
      if(this.openDate == e){
        this.openDate = null
      }else{
        this.openDate = e
      }
    },
    async mountFunc(){
      await this.$axios.get('/electricity/list').then((res) => {
        this.data = res?.data?.data
        this.dataElec = res?.data?.data
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.$axios.get('/electricity/list').then((res) => {
                this.data = res?.data?.data
                this.dataElec = res?.data?.data
              })
            })
          }
        }
      })
      await this.$axios.get('/calculation/list').then((res) => {
        this.dataCalc = res?.data?.data
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.$axios.get('/calculation/list').then((res) => {
                this.dataCalc = res?.data?.data
              })
            })
          }
        }
      })
    }
  },
  async mounted() {
    this.user_tools = sessionStorage.getItem('user_tools')
    this.beforeFLB()
    await this.mountFunc()
    ipcRenderer.on('context-menu-edit', () => {
      this.edit = true
      this.modal = !this.modal
    })
    ipcRenderer.on('context-menu-add-obj', async () => {
      this.edit = false
      if(this.idx){
        await this.$axios.get(`/electricity/single/${this.idx}`,{params:{type:this?.objType}}).then((res) => {
          var data = res?.data ? res?.data?.data : '';
          if((data.type == "feeder") && data?.child_objects?.length){
            this.warning = true
            let _t = this
            setTimeout(()=>{
              _t.warning = false
            },5000)
          }else{
            this.modal = !this.modal
          }
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.$axios.get(`/electricity/single/${this.idx}`,{params:{type:this?.objType}}).then((res) => {
                  var data = res?.data ? res?.data?.data : '';
                  if((data.type == "feeder") && data?.child_objects?.length){
                    this.warning = true
                    let _t = this
                    setTimeout(()=>{
                      _t.warning = false
                    },5000)
                  }else{
                    this.modal = !this.modal
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
    })
    ipcRenderer.on('context-menu-delete', () => {
      this.remove = !this.remove
    })
    await this.$axios.get('/meter/meter-list').then((res)=>{
      if(res?.data?.data){
        this.meters = res?.data?.data
      }
    }).catch(async (error)=>{
      const statusCode = (error.response || {}).status || -1;
      if (statusCode == 406) {
        if(error.config.method == 'get'){
          await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
            localStorage.setItem('session',res?.data?.session)
            await this.$axios.get('/meter/meter-list').then((res)=>{
              if(res?.data?.data){
                this.meters = res?.data?.data
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
    this.getH()
    // document.getElementById('emodel')?.addEventListener('contextmenu', (e) => {
    //   if((this.user_tools=='admin') && e.target.id && !e.target.classList.contains('transformatorelec') && !e.target.classList.contains('transformatorvoltage')) {
    //     this.objType = e.target.getAttribute('name')
    //     this.idx = e.target.id
    //     e.preventDefault()
    //     ipcRenderer.send('show-context-emodel',this.objType,this.$i18n.locale.value)
    //   }
    // })
  },
};
</script>
<style>
</style>