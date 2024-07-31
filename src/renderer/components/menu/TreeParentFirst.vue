<template>
  <li :style="isOpen ? 'max-height:'+beforeFLBValue*400+'px ;' : ''" :class="{open:isOpen}" v-if="(role == 'admin' || newModel.type != 'factory') || (newModel.type == 'factory' && open_factory.includes(newModel._id))">
    <div class="lb fbl">
      <div
        :class="[ isFolder ? 'bold' : '',newModel.type ]"
        class="div"
        :name="newModel.type"
        :title="newModel.name"
        @contextmenu="activeContext(newModel._id,newModel)"
        :id="newModel._id"
        @click="toggle(newModel._id,newModel)">
        <div :class="newModel.type" :name="newModel.type" :id="newModel._id">
          <Icons class="tree-icon" v-if="icon" :name="newModel.type" :icon="newModel.type"/> 
          <div :name="newModel.type" :id="newModel._id" class="line-2"> {{ newModel.name }} </div>
        </div>
        <svg class="arrow" :class="newModel.type + ' ' + isOpen" :name="newModel.type" :id="newModel._id" v-if="newModel.child_objects?.length && (newModel.type != 'meter')" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :name="newModel.type" :class="newModel.type" d="M9.95998 4.47501L6.69998 7.73501C6.31498 8.12001 5.68498 8.12001 5.29998 7.73501L2.03998 4.47501" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    <ul v-if="isFolder">
      <tree-parent-first
        class="tree-item"
        :icon="icon"
        :trsn="trsn"
        :beforeFLBValue="beforeFLBValue"
        v-for="newModelItem in newModel.child_objects"
        :model="newModelItem"
        :accessEmits="accessEmits"
        @getModel="getModel($event)"
        @getfilter="getfilter($event)"
        @getId="emitter($event)"
        @activeParam="activeParam($event)"
        @activeLocation="activeLocation($event)"
        :key="newModelItem">
      </tree-parent-first>
    </ul>
  </li>
</template>
  
<script setup>
  import { ipcRenderer } from 'electron';
  import { ref, computed, defineProps, defineEmits, getCurrentInstance } from 'vue'
  import eventNames from '@/universal/eventNames.js';
  const props = defineProps({
    model: Object,
    first: Object,
    accessEmits: {type:String,default: () => ''},
    beforeFLBValue: {type:Number,default: () => 100},
    icon: {type:Boolean,default: () => true},
    trsn: {type:Boolean,default: () => false},
  })
  const app = getCurrentInstance();
  const locale = app.appContext.config.globalProperties;
  const emit = defineEmits(['activeParam','activeLocation','getId','getModel','getfilter'])
  const isOpen = ref(false)
  const newModel = ref({})
  let open_factory = ref(JSON.parse(sessionStorage.getItem('open_factory')) || [])
  let role = ref((sessionStorage.getItem('user_tools')) || 'admin')
  
  newModel.value = {...props.model}
  const isFolder = computed(() => {
    return newModel.value.child_objects && newModel.value.child_objects.length
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
  function activeLocation(id){
    props.accessEmits?.split(',').forEach(el=>{
      if(el == 'activeLocation') emit('activeLocation',id);
    })
  }

  function getfilter(filter){
    props.accessEmits?.split(',').forEach(el=>{
      if(el == 'getfilter') emit('getfilter',filter);
    })
  }
  function getModel(id){
    props.accessEmits?.split(',').forEach(el=>{
      if(el == 'getModel') emit('getModel',id);
    })
  }
  
  async function toggle(id,model) {
    if((role?.value == 'admin' || newModel.value?.type != 'factory') || (newModel.value?.type == 'factory' && open_factory.value?.includes(newModel.value?._id))) {
      if(id.split('_')[0] != model.type){
        if(id){
          await ipcRenderer.invoke(eventNames.getSingleObjectEvent,{id:id,type:model?.type}).then((res) => {
            var data = res.args ? JSON.parse(res.args) : '';
            var location = res?.args ? JSON.parse(res.args)?.location : '';
            let current = data?.block
            let current_data = []
            current = current?.filter((k) => (k.parameter_type != 'journal'))
            data?.params?.map((el)=>{
              if(el) current_data.push(el)
            })
            current?.forEach((el,index)=>{
              current[index].obis = []
              Object.keys(data?.obis).map((element) => {
                if(data?.obis[element] == el?.channel_full_id){
                  current[index].obis.push(element)
                }
              });
            })
            let archive_data = ['energyarchive_A+','energyarchive_A-','energyarchive_R+','energyarchive_R-']
            let archive = [
              {param_name:locale.$locale['param_ap'][locale.$i18n.locale.value],param_short_name:'energyarchive_A+'},
              {param_name:locale.$locale['param_rp'][locale.$i18n.locale.value],param_short_name:'energyarchive_R+'},
              {param_name:locale.$locale['param_am'][locale.$i18n.locale.value],param_short_name:'energyarchive_A-'},
              {param_name:locale.$locale['param_rm'][locale.$i18n.locale.value],param_short_name:'energyarchive_R-'}
            ]
            let newArr = [
              {
                label: locale.$locale['archiveData'][locale.$i18n.locale.value],
                data: archive_data,
                fulldata: archive,
                type: 'archive'
              },
              {
                label: locale.$locale['currentData'][locale.$i18n.locale.value],
                data: current_data,
                fulldata: current,
                type: 'current'
              }
            ]
            props.accessEmits?.split(',').forEach(el=>{
              if(el == 'getfilter') emit('getfilter',newArr);
              setTimeout(() => {
                if(el == 'getModel') emit('getModel',model);
                if(el == 'getId') emit('getId',id);
              }, 100);
            })
            if(data){
              isOpen.value = !isOpen.value
            }
            activeParam(data);
            activeLocation(location);
            if(!document.getElementById(id).classList.contains('clicked')){
              if(props.model._id == data._id){
                // eslint-disable-next-line
                newModel.value.child_objects = data?.child_objects
              }
            }
            let els = document.getElementsByClassName('div');
            for(let i=0;i<els.length;i++){
              if(els[i].id == id){
                els[i].classList.add('isFocus')
                els[i].classList.add('clicked')
              }else{
                els[i].classList.remove('isFocus')
              }
            }
            if((data.type == 'feeder')&&(newModel.value.child_objects.length<2)&&(props.trsn)){
              if(data?.ct){
                // eslint-disable-next-line
                newModel.value.child_objects.push({_id:('transformatorelec_'+data?._id), name: locale.$locale['tn'][locale.$i18n.locale.value],type:'transformatorelec',data:data?.ct})
              }
              if(data?.vt){
                // eslint-disable-next-line
                newModel.value.child_objects.push({_id:('transformatorvoltage_'+data?._id), name:locale.$locale['tt'][locale.$i18n.locale.value],type:'transformatorvoltage',data:data?.vt})
              }
            }
          }).catch((error)=>{
            console.log(error);
          })
        }
      }else{
        activeParam(model);
        let els = document.getElementsByClassName('div');
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
  }
  async function activeContext(id,model) {
    activeParam(model);
    let els = document.getElementsByClassName('div');
    for(let i=0;i<els.length;i++){
      if(els[i].id == id){
        els[i].classList.add('isFocus')
        els[i].classList.add('clicked')
      }else{
        els[i].classList.remove('isFocus')
      }
    }
  }
  if(props.first?.type == 'factory'){
    toggle(props.first?._id,props.first)
  }

</script>