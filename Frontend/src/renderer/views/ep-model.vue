
<template>
  <div class="wrapper">
    <div class="header">
      <h3>{{$locale['calc_model'][$i18n.locale.value]}}</h3>
      <div class="breadcrumbs">
        <p>{{$locale['object_rep'][$i18n.locale.value]}}</p>
        <img src="../assets/svg/arrR.svg" alt="">
        <p>{{$locale['calc_model'][$i18n.locale.value]}}</p>
      </div>
    </div>
    <div class="e-model empanel">
      <div class="model-block" @click="unFocus">
        <div class="wrapblock tree-emodel">
          <div class="beforeB" :style="div ? ('height:'+(div)+'px') : ''">
            <div class="beforeFLB" :style="'top:'+(64*(index)+21) + 'px;'" v-for="el,index in beforeFLBValue" :key="index"></div>
          </div>
          <div id="empanel" class="model-div">
            <ul class="tree-menu">
              <TreeParentFirst :beforeFLBValue="beforeFLBValue" accessEmits="getId,activeParam" @click.stop="getH" @activeParam="activeParam($event)" @getId="getId()" v-for="(item,index) in data" :key="index" class="tree-item" :first="data[0]" :model="item"></TreeParentFirst>
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
            <div class="model-voltage-text">
              <p>{{$locale['meterType'][$i18n.locale.value]}}:</p><span> {{ active?.type == 'main' ? 'Начальный узел' : active?.type == 'child' ? 'Промежуточный узел' : 'Конечный узел' }} </span>
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
            <ul class="tree-menu tree-sec" v-if="!preload">
              <TreeParentSec :beforeFLBValue="beforeFLBValue" :first="dataElec[0]" :params="params" accessEmits="setParam" @setParam="setParam($event)" v-show="modelType == 'electObj'" v-for="(item,index) in dataElec" :key="index" class="tree-item" :model="item" :trsn="true"></TreeParentSec>
              <TreeParentSec :beforeFLBValue="beforeFLBValue" :first="dataCalc[0]" :params="params" accessEmits="setParam" :icon="false" :report="true" @setParam="setParam($event)" v-show="modelType == 'calcObj'" v-for="(item,index) in dataCalc" :key="index" class="tree-item" :model="item" :trsn="true"></TreeParentSec>
            </ul>
          </div>
        </div>
        <div class="model-btn">
          <!-- <button v-if="params?.length && (user_tools == 'admin')" @click="attachParams">{{$locale['saveChanges'][$i18n.locale.value]}}</button> -->
        </div>
      </div>
    </div>
    <transition name="modal" :duration="600">
      <modalEModel :edit="edit" @response="setstatus($event)" :objType="objType" :idx="idx" @modalShow="modalShow" v-if="modal"/>
    </transition>
    <transition name="modal" :duration="600">
      <modalRemove :report="true" @response="setstatus($event)" :idx="idx" @modalShow="modalShow" v-if="remove"/>
    </transition>
    <transition name="notify" :duration="10000">
      <notify :main="$locale['successfully'][$i18n.locale.value]" :text="$locale['requestCompletedSuccessfully'][$i18n.locale.value]" @close="success=false" typeModal="success" v-if="success"/>
    </transition>
    <transition name="notify" :duration="10000">
      <notify :main="$locale['error'][$i18n.locale.value]" :text="wrongM" @close="wrong=false" typeModal="error" v-if="wrong"/>
    </transition>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron';
import TreeParentFirst from '../components/menu/TreeParentFirst2.vue';
import TreeParentSec from '../components/menu/TreeParentSec.vue';
import Select from '../components/select2.vue'
import modalEModel from '../components/modals/modalEModelReport.vue';
import modalRemove from '../components/modals/modalRemove.vue';
export default {
  data() {
    return {
      open: false,
      arrow: `
        <svg class="svg" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.95998 4.47501L6.69998 7.73501C6.31498 8.12001 5.68498 8.12001 5.29998 7.73501L2.03998 4.47501" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
      toggle: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 12.5L11.5 14L15.5 10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="0.5" y="0.5" width="23" height="23" rx="4.5" stroke="white"/></svg>',
      div: null,
      wrongM: this.$locale['somethingWrong'][this.$i18n.locale.value],
      data: [],
      dataElec: [],
      dataCalc: [],
      active: null,
      openDate: null,
      openDateV: null,
      indexes: [],
      beforeFLBValue: 100,
      allArr: [],
      objType: null,
      modal: false,
      preload: false,
      idx: null,
      success: false,
      wrong: false,
      remove: false,
      params: [],
      paramWId: new Map(),
      modelType: 'electObj',
      options: [
        {
          "classificator": "electObj",
          "name": this.$locale['side_map'][this.$i18n.locale.value],
        },
        {
          "classificator": "calcObj",
          default: 'active',
          "name": this.$locale['side_object'][this.$i18n.locale.value],
        },
      ],
      user_tools: 'super',
      edit: false
    };
  },
  components:{
    TreeParentFirst,
    TreeParentSec,
    modalEModel,
    modalRemove,
    Select
  },
  methods: {
    getH(){
      const t = this
      setTimeout(() => {
        t.div = document.getElementById('empanel')?.clientHeight
      }, 1000);
    },
    modalShow(){
      this.modal = false
      this.remove = false
      this.beforeFLB()
      this.data = []
      this.dataElec = []
      this.dataCalc = []
      this.getH()
      this.mountFunc()
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

      await this.$axios.patch(('/calculation/attach-params/'+this.active._id),JSON.parse(data)).then((res) => {
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
          this.paramWId= new Map()
          this.mountFunc()
        }
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'patch'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.$axios.patch(('/calculation/attach-params/'+this.active._id),JSON.parse(data)).then(async (res) => {
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
                  this.paramWId= new Map()
                  await this.mountFunc()
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
        this.paramWId= new Map()
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
    getPosition(e){
      this.modelType = e
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
    },
    opener(e){
      if(this.openDate == e){
        this.openDate = null
      }else{
        this.openDate = e
      }
    },
    changeVoltage(e,idx){
      this.openDateV = idx
      this.allArr[e] = idx
      this.openDate = null
    },
    async mountFunc(){
      await this.$axios.get('/electricity/list').then((res) => {
        this.dataElec = res?.data?.data
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.$axios.get('/electricity/list').then((res) => {
                this.dataElec = res?.data?.data
              }).catch((err)=>{
                console.log(err);
              })
            }).catch((err)=>{
              console.log(err);
            })
          }
        }
      })
      await this.$axios.get('/calculation/list').then((res) => {
        this.data = res?.data?.data
        this.dataCalc = res?.data?.data
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.$axios.get('/calculation/list').then((res) => {
                this.data = res?.data?.data
                this.dataCalc = res?.data?.data
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
  mounted() {
    this.user_tools = sessionStorage.getItem('user_tools')
    this.beforeFLB()
    this.mountFunc()
    ipcRenderer.on('context-menu-edit', () => {
      this.edit = true
      this.modal = !this.modal
    })
    ipcRenderer.on('context-menu-add-obj', () => {
      this.edit = false
      this.modal = !this.modal
    })
    ipcRenderer.on('context-menu-rename', () => {
      this.modal = !this.modal
    })
    ipcRenderer.on('context-menu-delete', () => {
      this.remove = !this.remove
    })
    this.getH()
    // document.getElementById('empanel')?.addEventListener('contextmenu', (e) => {
    //   if((this.user_tools=='admin') && e.target.id) {
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