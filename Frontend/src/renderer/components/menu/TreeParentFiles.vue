<template>
  <li :style="isOpen ? 'max-height:'+beforeFLBValue*400+'px ;' : ''" :class="{open:isOpen}" v-if="(role == 'admin' || model.folder_type != 'folder') || (model.folder_type == 'folder' && ((!model?.parent_id ? open_folders.includes(model._id) : true)))">
    <div class="lb fbl">
      <div
        :class="[ isFolder ? 'bold' : '',model.folder_type ]"
        :name="model.folder_type"
        class="div"
        @contextmenu="activeContext(model._id,model)"
        :id="model._id"
        @click="toggle(model._id,model)">
        <div :name="model.folder_type" :class="model.folder_type" :id="model._id">
          <Icons v-show="(model.folder_type == 'meter') && !trsn" :name="model.folder_type" :class="model.folder_type + (((requestMeters.get(model.meter))?.last == 'sent')?' visiblity':' notvisible')" icon="downFilled"/>
          <img :name="model.folder_type" v-if="icon && (model.folder_type == 'meter')" :src="require('../../assets/svg/meter.svg')" alt="">
          <svg :name="model.folder_type" :class="model.folder_type" :id="model._id" v-if="icon && (model.folder_type != 'meter')" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :name="model.folder_type" :class="model.folder_type" :id="model._id" d="M21.4904 10.8608L21.4914 10.8861L21.495 10.9111C21.499 10.9388 21.5 10.9901 21.5 11.0704V16.6504C21.5 19.3243 19.3239 21.5004 16.65 21.5004H7.35C4.67614 21.5004 2.5 19.3243 2.5 16.6504V9.94043H21.3642C21.4361 10.2353 21.4773 10.5394 21.4904 10.8608Z" fill="#987704" stroke="#987704"/>
            <path :name="model.folder_type" :class="model.folder_type" :id="model._id" d="M21.0017 8.94H2.5V6.42C2.5 4.25614 4.25614 2.5 6.42 2.5H8.75C9.51213 2.5 9.9501 2.62406 10.2601 2.80535C10.5779 2.99123 10.8166 3.26718 11.1394 3.69926L11.1405 3.70069L12.5405 5.56069L12.5412 5.56155C12.5518 5.57564 12.5627 5.59013 12.5738 5.60494C12.6956 5.76755 12.8461 5.96848 13.064 6.08752C13.3132 6.22369 13.5953 6.23 13.87 6.23L16.66 6.23L16.6621 6.23C18.5596 6.22199 20.2128 7.32689 21.0017 8.94Z" fill="#987704" stroke="#987704"/>
          </svg>
          {{ model.name }}
        </div>
        <!-- <span v-if="meterStatus?.id == model._id">r</span> -->
        <svg :name="model.folder_type" class="arrow" :class="model.folder_type + ' ' + isOpen" :id="model._id" v-if="model.child_folders?.length && (model.folder_type != 'meter')" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :name="model.folder_type" :id="model._id" d="M9.95998 4.47501L6.69998 7.73501C6.31498 8.12001 5.68498 8.12001 5.29998 7.73501L2.03998 4.47501" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div :name="model.folder_type" :class="model.folder_type" class="d-f gap-10" v-if="((model.folder_type == 'meter') && !trsn)">
          <Icons :name="model.folder_type" :class="model.folder_type" size="custom" width="30" height="16" :icon="(requestMeters.get(model.meter))?.archive == 'succeed' ? 'tickMeter' : 'cancelMeter'"/>
          <Icons :name="model.folder_type" :class="model.folder_type" size="custom" width="30" height="16" :icon="(requestMeters.get(model.meter))?.current == 'succeed' ? 'tickMeter' : 'cancelMeter'"/>
          <Icons :name="model.folder_type" :class="model.folder_type" size="custom" width="30" height="16" :icon="(requestMeters.get(model.meter))?.event == 'succeed' ? 'tickMeter' : 'cancelMeter'"/>
        </div>
      </div>
    </div>
    <ul v-if="isFolder">
      <tree-parent-files
        class="tree-item"
        :icon="icon"
        :trsn="trsn"
        :beforeFLBValue="beforeFLBValue"
        v-for="model in model.child_folders"
        :model="model"
        :accessEmits="accessEmits"
        :arrSuccSend="requestMeters"
        @getId="emitter($event)"
        @model="getModel($event)"
        @activeParam="activeParam($event)"
        :key="model">
      </tree-parent-files>
    </ul>
  </li>
</template>
  
<script setup>
  import { ref, computed, defineProps, defineEmits } from 'vue'
  import axios from '@/renderer/plugins/axios';
  const props = defineProps({
    model: Object,
    first: Object,
    accessEmits: {type:String,default: () => ''},
    beforeFLBValue: {type:Number,default: () => 100},
    arrSuccSend: {type:Object,default: () => new Map()},
    icon: {type:Boolean,default: () => true},
    trsn: {type:Boolean,default: () => false},
  })
  const emit = defineEmits(['activeParam','getId','activeParam','model'])
  const isOpen = ref(false)
  // let meterStatus = ref([])
  let open_folders = ref(JSON.parse(sessionStorage.getItem('open_folders')) || [])
  let role = ref((sessionStorage.getItem('user_tools')) || 'admin')
  
  const isFolder = computed(() => {
    return props.model.child_folders && props.model.child_folders.length
  })
  
  const requestMeters = computed(() => {
    return props.arrSuccSend
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
  
  function getModel(e){
    props.accessEmits?.split(',').forEach(el=>{
      if(el == 'model') emit('model',e);
    })
  }
  async function toggle(id,model) {
    if((role?.value == 'admin' || props.model?.folder_type != 'folder') || (props.model?.folder_type == 'folder' && ((!props.model?.parent_id ? open_folders.value?.includes(props.model?._id) : true)))) {
      if(id != model.folder_type){
        let allArr = []
        await axios.get('/folder/one/'+id).then((res) => {
          var data = res?.data ? res?.data?.data : '';
          if(data?.meter){
            emitter(data?.meter)
          }
          props.accessEmits?.split(',').forEach(el=>{
            if(el == 'model') emit('model',data?.meter_detail);
          })
          data?.parameters?.forEach((el)=>{
            allArr.push(el?.param_details[0])
          })
          if(data){
            isOpen.value = !isOpen.value
          }
          activeParam(data);
          if(!document.getElementById(id).classList.contains('clicked')){
            // eslint-disable-next-line
            props.model.child_folders = data?.child_folders
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
    toggle(id,model)
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

  if(props.first?.folder_type == 'folder'){
    toggle(props.first?._id,props.first)
  }

</script>