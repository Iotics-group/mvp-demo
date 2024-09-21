<template>
  <li :style="isOpen ? 'max-height:'+beforeFLBValue*2000+'px ;' : ''" :class="{open:isOpen}" v-if="(role == 'admin' || model.type != 'factory' && model.type != 'main') || ((model.type == 'factory' || model.type == 'main') && open_factory.includes(model._id))">
    <div class="lb fbl">
      <div
        :class="[ isFolder ? 'bold' : '',model.type ]"
        class="div2 param-block"
        :name="model.type"
        :title="model.name"
        :id="model._id"
        @click="toggle(model._id,model)">
        <div :class="model.type" :name="model.type" :id="model._id">
          <Icons color="white" :icon="model.type"/> 
          <div :id="model._id" class="line-2"> {{ model.name }} </div>
        </div>
        <svg class="arrow" :class="model.type + ' ' + isOpen" :name="model.type" :id="model._id" v-if="model.child_objects?.length && (model.type != 'meter')" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :class="model.type" d="M9.95998 4.47501L6.69998 7.73501C6.31498 8.12001 5.68498 8.12001 5.29998 7.73501L2.03998 4.47501" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div :class="(isFolder ? ' bold ' : ' ') + model.type + (activeParamBlock ? ' activeParam ' : ' ')"
        class="div2 param-toggle-block" :id="model._id" :name="model.type">
        <div class="param-toggle-div" :id="model._id" @click="toggleBlock(model._id,model)">
          <div :class="model.type" :name="model.type" :id="model._id" class="">
            {{$locale['options'][$i18n.locale.value]}}
          </div>
          <svg class="arrow" :class="model.type + ' ' + activeParamBlock" :name="model.type" :id="model._id" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path  :id="model._id" :class="model.type" d="M9.95998 4.47501L6.69998 7.73501C6.31498 8.12001 5.68498 8.12001 5.29998 7.73501L2.03998 4.47501" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div>
          
          <div v-if="activeParams?.length" class="param-check my-10">
            <button @click="checkAll(model._id,activeParams)">
              <span :class="(checkAllStatus)?'checked':'notCheck'"><span v-if="checkAllStatus">&#10003;</span></span>
            </button>
            {{$locale['all'][$i18n.locale.value]}}
          </div>
          <div class="pl-24"> 
            <div class="param-toggle-div" v-for="el,index in activeParams" :key="index">
              <div class="d-f gap-16">
                <div class="param-check">
                  <button @click="el.status = !el.status,emitParams(el)">
                    <span :class="el.status?'checked':'notCheck'"><span v-if="el.status">&#10003;</span></span>
                  </button>
                </div>
                <p>{{ el?.param_name?.[$i18n.locale.value] || el?.param_name }}</p>
              </div>
              <div class="toggle">
                <label class="switch" @click="el.sign = !el.sign,emitParams(el)">
                  <input type="checkbox" disabled v-model="el.sign">
                  <span class="slider round">- +</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ul v-if="isFolder">
      <tree-parent-sec
        class="tree-item"
        :icon="icon"
        :trsn="trsn"
        :beforeFLBValue="beforeFLBValue"
        v-for="model in model.child_objects"
        :model="model"
        :report="report"
        :params="params"
        :active="active"
        :accessEmits="accessEmits"
        @getModel="getModel($event)"
        @getId="emitter($event)"
        @setParam="setParam($event)"
        @activeParam="activeParam($event)"
        :key="model">
      </tree-parent-sec>
    </ul>
  </li>
</template>
  
<script setup>
  import axios from '@/renderer/plugins/axios';
  import { ref, computed, defineProps, defineEmits, watch } from 'vue'
  const props = defineProps({
    model: Object,
    first: Object,
    icon: {type:Boolean,default: () => true},
    beforeFLBValue: {type:Number,default: () => 100},
    active: {type:Object,default: () => {}},
    report: {type:Boolean,default: () => false},
    accessEmits: {type:String,default: () => ''},
    trsn: {type:Boolean,default: () => false},
    params: {type:Array,default: () => []},
  })
  const emit = defineEmits(['activeParam','getId','getModel','setParam'])
  const isOpen = ref(false)
  let activeParamBlock = ref(false)
  let checkAllStatus = ref(false)
  let comActiveParams = ref([])
  let activeParams = ref([])
  let newparams = ref(new Map())
  let open_factory = ref(JSON.parse(sessionStorage.getItem('open_factory')) || [])
  let role = ref((sessionStorage.getItem('user_tools')) || 'admin')
  const isFolder = computed(() => {
    return props.model.child_objects && props.model.child_objects.length
  })
  function emitter(id){
    props.accessEmits?.split(',').forEach(el=>{
      if(el == 'getId') emit('getId',id);
    })
  }
  function activeParam(id){
    props.accessEmits?.split(',').forEach(el=>{
      if(el == 'activeParam') emit('activeParam',id);
    })
  }
  function getModel(id){
    props.accessEmits?.split(',').forEach(el=>{
      if(el == 'getModel') emit('getModel',id);
    })
  }
  watch(() => props.active, 
    () => {
      activeEmitParams()
    },
    {deep: true}
  );
  watch(() => props.params, 
    () => {
      setParamSign()
    },
    {deep: true}
  );
  async function activeEmitParams() {
    activeParams.value?.forEach((element2,index) => {
      activeParams.value[index].status = false
      checkAllStatus.value = false
    })
    props.active?.parameters?.forEach(element => {
      if(element.meter == props.model?.meter_id){
        activeParams.value?.forEach((element2,index) => {
          if((props.model?.type == 'feeder')){
            if((element?.params_feeder?.[element2?.obis[0]] != undefined)){
              activeParams.value[index].status = true
              activeParams.value[index].sign = element.params_feeder[element2?.obis[0]]
            }
          }
          if((props.model?.type == 'meter')){
            if((element?.params_meter?.[element2?.obis[0]] != undefined)){
              activeParams.value[index].status = true
              activeParams.value[index].sign = element.params_meter[element2?.obis[0]]
            }
          }
        });
      }
      if(element.from == props.model?._id){
        activeParams.value?.forEach((element2,index) => {
          if((props.model?.type != 'feeder') && (props.model?.type != 'meter')){
            if((element?.params_feeder?.[element2?.obis[0]] != undefined)){
              activeParams.value[index].status = true
              activeParams.value[index].sign = element.params_feeder[element2?.obis[0]]
            }
            if((element?.params_meter?.[element2?.obis[0]] != undefined)){
              activeParams.value[index].status = true
              activeParams.value[index].sign = element.params_meter[element2?.obis[0]]
            }
          }
        });
      }else{
        if( props.active?._id == props.model?._id){
          if((props.model?.type != 'feeder') && (props.model?.type != 'meter')){
            activeParams.value?.forEach((element2,index) => {
              if((element?.params_feeder?.[element2?.obis[0]] != undefined)){
                activeParams.value[index].status = true
                activeParams.value[index].sign = element.params_feeder[element2?.obis[0]]
              }
              if((element?.params_meter?.[element2?.obis[0]] != undefined)){
                activeParams.value[index].status = true
                activeParams.value[index].sign = element.params_meter[element2?.obis[0]]
              }
            });
          }
        }
      }
    });
    emitParams()
  }
  
  async function checkAll(id,params) {
    newparams.value = (new Map())
    checkAllStatus.value = !checkAllStatus.value
    params?.forEach((el)=>{
      el.status = checkAllStatus.value
    })
    let emitarr = {}
    await activeParams.value?.forEach((w)=> {
      if(w.status){
        w?.obis?.forEach(element => {
          newparams.value.set(props.model._id,{...newparams.value.get(props.model._id),[element]:w?.sign})
        });
      }
    })
    let setparams = []
    await comActiveParams?.value?.forEach((el,index)=>{
      let res_feeder = {}
      let res_meter = {}
      activeParams?.value?.forEach((el2)=>{
        if(el?.params_meter){
          // eslint-disable-next-line
          for (let [key,value] of newparams.value) {
            for (let prop in el?.params_meter) {
              if ((el2?.obis?.includes(prop))&&(value[prop] !== undefined)) {
                res_meter[prop] = value[prop];
              }
            }
          }
        }
        if(el?.params_feeder){
          // eslint-disable-next-line
          for (let [key,value] of newparams.value) {
            for (let prop in el?.params_feeder) {
              if ((el2?.obis?.includes(prop))&&(value[prop] !== undefined)) {
                res_feeder[prop] = value[prop];
              }
            }
          }
        }
        let requesttype = props.report === true ? 'calculation_object':'elect_object';
        emitarr = {...comActiveParams?.value[index],params_feeder:res_feeder,params_meter:res_meter,type:requesttype,model_type:props.model?.type,from:props.model?._id}
      })
      setparams.push(emitarr)
    })
    props.accessEmits?.split(',').forEach(el=>{
        if((el == 'setParam')){
          setTimeout(() => {
            emit('setParam',setparams);
          }, 200);
        } 
    })
  }
  async function toggleBlock(id) {
    activeParamBlock.value = !activeParamBlock.value
    let els = document.getElementsByClassName('div2');
    for(let i=0;i<els.length;i++){
      if(els[i].id == id){
        els[i].classList.add('isFocus')
        els[i].classList.add('clicked')
      }else{
        // els[i].classList.remove('activeParam')
        els[i].classList.remove('isFocus')
      }
    }
  }
  async function emitParams() {
    let emitarr = {}
    newparams.value = (new Map())
    let all = 0
    await activeParams.value?.forEach((w)=> {
      if(w.status){
        all++
        w?.obis?.forEach(element => {
          newparams.value.set(props.model._id,{...newparams.value.get(props.model._id),[element]:w?.sign})
        });
      }
    })
    let params = []
    await comActiveParams?.value?.forEach((el,index)=>{
      let res_feeder = {}
      let res_meter = {}
      activeParams?.value?.forEach((el2)=>{
        if(el?.params_feeder){
          // eslint-disable-next-line
          for (let [key,value] of newparams.value) {
            for (let prop in el?.params_feeder) {
              if ((el2?.obis?.includes(prop))&&(value[prop] !== undefined)) {
                res_feeder[prop] = value[prop];
              }
            }
          }
        }
        if(el?.params_meter){
          // eslint-disable-next-line
          for (let [key,value] of newparams.value) {
            for (let prop in el?.params_meter) {
              if ((el2?.obis?.includes(prop))&&(value[prop] !== undefined)) {
                res_meter[prop] = value[prop];
              }
            }
          }
        }
        let requesttype = props.report === true ? 'calculation_object':'elect_object';
        emitarr = {...comActiveParams?.value[index],params_feeder:res_feeder,params_meter:res_meter,type:requesttype,model_type:props.model?.type,from:props.model?._id}
      })
      params.push(emitarr)
    })

    props.accessEmits?.split(',').forEach(el=>{
        if((el == 'setParam')){
          setTimeout(() => {
            emit('setParam',params);
          }, 200);
        } 
    })
    if(all==activeParams.value?.length){
      checkAllStatus.value = true
    }else{
      checkAllStatus.value = false
    }
  }
  async function setParam(activeParameter) {
    props.accessEmits?.split(',').forEach(el=>{
      if((el == 'setParam')) emit('setParam',activeParameter);
    })
  }
  
  async function toggle(id,model) {
    if((role?.value == 'admin' || model.value?.type != 'factory') || (model.value?.type == 'factory' && open_factory.value?.includes(model.value?._id))) {
      if(id.split('_')[0] != model.type){
        props.accessEmits?.split(',').forEach(el=>{
          if(el == 'getModel') emit('getModel',model);
        })
        emitter(id)
        let requestName = props.report === true ? 'calculation':'electricity';
        if(id){
        await axios.get(`/${requestName}/single/${id}`,{params:{type:model?.type}}).then((res) => {
          var data = res?.data ? res?.data?.data : '';
          comActiveParams.value = data?.parameters
          activeParams.value = data?.block?.filter((k) => (k.parameter_type != 'journal'))
          activeParams?.value?.forEach((el,index)=>{
            activeParams.value[index].obis = []
            Object.keys(data?.obis).map((element) => {
              if(data?.obis[element] == el?.channel_full_id){
                activeParams.value[index].obis.push(element)
              }
            });
            activeParams.value[index].sign = true
            activeParams.value[index].status = false
          })
          if(data){
            isOpen.value = !isOpen.value
          }
          activeParam(data);
          if(props.model._id == data._id){
            // eslint-disable-next-line
            props.model.child_objects = data?.child_objects
          }
          let els = document.getElementsByClassName('div2');
          for(let i=0;i<els.length;i++){
            if(els[i].id == id){
              els[i].classList.add('isFocus')
              els[i].classList.add('clicked')
            }else{
              // els[i].classList.remove('activeParam')
              els[i].classList.remove('isFocus')
            }
          }
          }).catch(async (error)=>{
            const statusCode = (error.response || {}).status || -1;
            if (statusCode == 406) {
              if(error.config.method == 'get'){
                await axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                  localStorage.setItem('session',res?.data?.session)
                  await toggle(id,model)
                }).catch((err)=>{
                  console.log(err);
                })
              }
            }
          })
        }
      }else{
        activeParam(model);
        let els = document.getElementsByClassName('div2');
        for(let i=0;i<els.length;i++){
          if(els[i].id == id){
            els[i].classList.add('isFocus')
            els[i].classList.add('clicked')
          }else{
            els[i].classList.remove('isFocus')
          }
        }
      }
    }
    activeEmitParams()
    setParamSign()
  }
  async function setParamSign() {
    setTimeout(() => {
      if(props.params?.length){
        props.params.forEach(element => {
          if(comActiveParams.value?.some(e => e.meter == element.meter)){
            activeParams.value.forEach((element2,index) => {
              if(props.model.type == 'meter'){
                element?.params_meter && Object.keys(element.params_meter).map(e2=>{
                  if(element.params_feeder?.[e2] != undefined){
                    element.params_feeder[e2] = element.params_meter[e2]
                  }
                })
                element?.params_feeder && Object.keys(element.params_feeder).map(e2=>{
                  if (element2.obis.includes(e2)) {
                    activeParams.value[index].sign = element.params_feeder[e2]
                  }
                })
              }else if(props.model.type == 'feeder'){
                element?.params_feeder && Object.keys(element.params_feeder).map(e2=>{
                  if(element.params_meter?.[e2] != undefined){
                    element.params_meter[e2] = element.params_feeder[e2]
                  }
                })
                element?.params_meter && Object.keys(element.params_meter).map(e2=>{
                  if (element2.obis.includes(e2)) {
                    activeParams.value[index].sign = element.params_meter[e2]
                  }
                })
              }else if((props.model.type != 'meter')&&(props.model.type != 'feeder')){
                element?.params_feeder && Object.keys(element.params_feeder).map(e2=>{
                  if (element2.obis.includes(e2)) {
                    activeParams.value[index].sign = element.params_feeder[e2]
                  }
                })
                element?.params_meter && Object.keys(element.params_meter).map(e2=>{
                  if (element2.obis.includes(e2)) {
                    activeParams.value[index].sign = element.params_meter[e2]
                  }
                })
              }
            });
          }
        });
      }
    }, 300);
  }
  if(props.first?.type == 'factory'){
    toggle(props.first._id,props.first)
  }
  if((props.first?.type == 'main')||(props.first?.type == 'child')){
    toggle(props.first._id,props.first)
  }

</script>