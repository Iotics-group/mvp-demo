<template>
  <li :style="isOpen ? 'max-height:'+beforeFLBValue*400+'px ;' : ''" :class="{ open: isOpen }" v-if="(role == 'admin' || model.type != 'main') || (model.type == 'main' && open_factory.includes(model._id))">
    <div class="lb">
      <div
        :class="(isFolder ? 'bold ' : ' ') + model.type"
        class="div"
        :id="model._id"
        :title="model.name"
        @contextmenu="activeContext(model._id, model)"
        :name="model.type"
        @click="toggle(model._id, model)"
      >
        <div
          :title="model.name"
          :class="model.type"
          :name="model.type"
          :id="model._id"
        >
        <Icons class="tree-icon" v-if="model.type == 'main'" color="#987704" :icon="model.type"/> 
        <Icons class="tree-icon" v-else-if="model.type == 'end'" color="#008A00" :icon="model.type"/> 
        <Icons class="tree-icon" v-else :color="colors[countCom]" :icon="model.type"/> 
        {{ model.name }}
        </div>
        <svg
          :title="model.name"
          :name="model.type"
          class="arrow" :class="model.type + ' ' + isOpen"
          v-if="model.child_objects?.length && model.type != 'meter'"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :title="model.name"
            :class="model.type"
            :name="model.type"
            d="M9.95998 4.47501L6.69998 7.73501C6.31498 8.12001 5.68498 8.12001 5.29998 7.73501L2.03998 4.47501"
            stroke="black"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <ul v-if="isFolder">
      <tree-parent-first-2
        class="tree-item"
        :icon="icon"
        v-for="model in model.child_objects"
        :beforeFLBValue="beforeFLBValue"
        :accessEmits="accessEmits"
        @getfilter="getfilter($event)"
        :model="model"
        :count="countCom"
        @getId="emitter($event)"
        @activeParam="activeParam($event)"
        :key="model"
      >
      </tree-parent-first-2>
    </ul>
  </li>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, getCurrentInstance } from "vue";
import axios from '@/renderer/plugins/axios';
const props = defineProps({
  accessEmits: { type: String, default: () => "" },
  count: { type: Number, default: () => 0 },
  beforeFLBValue: {type:Number,default: () => 100},
  model: Object,
  first: Object,
  icon: { type: Boolean, default: () => true },
});
const emit = defineEmits(["activeParam", "getId",'getfilter']);
const isOpen = ref(false);

const app = getCurrentInstance();
const locale = app.appContext.config.globalProperties;
let open_factory = ref(JSON.parse(sessionStorage.getItem('open_factory')) || [])
let role = ref((sessionStorage.getItem('user_tools')) || 'admin')
const colors = ref(['#0057FF','#AD00FF', '#7851A9', '#03fcfc', '#db188d', '#4728ad', '#b51b49', '#800080', '#7851A9', '#fc3d03'])
const isFolder = computed(() => {
  return props.model.child_objects && props.model.child_objects.length;
});
const countCom = computed(() => {
  var newCount = props.count + 1
  return newCount;
});
function emitter(id) {
  props.accessEmits?.split(",").forEach((el) => {
    if (el == "getId") emit("getId", id);
  });
}

function activeParam(id) {
  props.accessEmits?.split(",").forEach((el) => {
    if (el == "activeParam") emit("activeParam", id);
  });
}
function getfilter(filter){
  props.accessEmits?.split(',').forEach(el=>{
    if(el == 'getfilter') emit('getfilter',filter);
  })
}

async function toggle(id, model) {
  if (id != model.type) {
    if (!id) return;
    await axios.get(`/calculation/single/${id}?type=${model?.type}`).then((res) => {
      var data = res?.data ? res?.data?.data : '';
      let current = data?.block
      let current_data = []
      current = current?.filter((k) => (k.parameter_type != 'journal'))
      Object.keys(data?.obis)?.map((el)=>{
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
          if(el == "activeParam") emit("activeParam", data);
          if(el == 'getId') emit('getId',id);
        }, 100);
      })
      if (data) {
        isOpen.value = !isOpen.value;
      }
      if (!document.getElementById(id).classList.contains("clicked")) {
        // eslint-disable-next-line
        props.model.child_objects = data?.child_objects;
      }
      let els = document.getElementsByClassName("div");
      for (let i = 0; i < els.length; i++) {
        if (els[i].id == id) {
          els[i].classList.add("isFocus");
          els[i].classList.add("clicked");
        } else {
          els[i].classList.remove("isFocus");
        }
      }
      if (data.type == "feeder" && props.model.child_objects.length < 2) {
        if (data?.ct) {
          // eslint-disable-next-line
          props.model.child_objects.push({
            _id: "transformatorelec",
            name: locale.$locale['tn'][locale.$i18n.locale.value],
            type: "transformatorelec",
            data: data?.ct,
          });
        }
        if (data?.vt) {
          // eslint-disable-next-line
          props.model.child_objects.push({
            _id: "transformatorvoltage",
            name: locale.$locale['tt'][locale.$i18n.locale.value],
            type: "transformatorvoltage",
            data: data?.vt,
          });
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
  } else {
    activeParam(model);
    let els = document.getElementsByClassName("div");
    for (let i = 0; i < els.length; i++) {
      if (els[i].id == id) {
        els[i].classList.add("isFocus");
        els[i].classList.add("clicked");
      } else {
        els[i].classList.remove("isFocus");
      }
    }
  }
}
async function activeContext(id, model) {
  activeParam(model);
  let els = document.getElementsByClassName("div");
  for (let i = 0; i < els.length; i++) {
    if (els[i].id == id) {
      els[i].classList.add("isFocus");
      els[i].classList.add("clicked");
    } else {
      els[i].classList.remove("isFocus");
    }
  }
}

if((props.first?.type == 'main')||(props.first?.type == 'child')){
  toggle(props.first?._id,props.first)
}

</script>
