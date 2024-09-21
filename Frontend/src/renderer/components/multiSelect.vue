<template>
  <div class="select">
    <div class="input-wrapper">
      <label :id="id" for="">{{label}} </label>
      <div
        class="input-div dropdown-input"
        :class="((this.dropdownID == id ? 'active ' : ' ')+ (required && !payload.channel ? 'required-err': '')) + (bottom ? 'bottom-select' : '')"
        :id="id"
      >
      <div>
        <span
          class="placeholder"
          :class="payload.channel?.length ? 'not-empty' : ''"
          v-for="el,index in payload.channel"
          :id="id"
          :key="index"
        >
          {{ el?.name }} ,
        </span>
        <span :id="id" v-if="!payload.channel?.length" class="placeholder">{{ placeholder }}</span>
      </div>
        <img
          src="../assets/svg/arrow-down.svg"
          alt=""
          :id="id"
        >
        <div
          v-if="dropdownListOpen == id"
          class="dropdown-list"
          :style="maxHeight ? ('max-height:'+maxHeight) : ''"
        >
          <button
            v-for="option in options"
            :key="option.id"
            @click.stop="choosed(option)"
            :class="payload.channel.includes(option) ? 'chosen' : ''"
          >
            <span>
              {{ option?.name }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Icons from './icons.vue'
export default {
  name: 'select-com-multi',
  data() {
    return {
      file: null,
      tab: 1,
      dropdownID: '',
      dropdownListOpen: false,
      required: false,
      payload: {
        channel: []
      },
    }
  },
  components: {
    // Icons
  },
  props:{
    id: {
      type: String,
      required: true
    },
    label: {
      type: String
    },
    maxHeight: {
      type: String,
      default: () => null,
    },
    placeholder: {
      type: String
    },
    bottom: {
      type: Boolean,
      default: () => false,
    },
    options: {
      type: Array,
      required: true
    }
  },
  methods: {
    drop(event) {
      if(this.dropdownID !== event.target.id) {
        this.dropdownID = event.target.id
        this.dropdownListOpen = event.target.id
      }
      else {
        this.dropdownID = ''
        this.timeOut = setTimeout(() => {
          this.dropdownListOpen = ''
        }, 150)
      }
    },

    choosed(item) {
      let index = this.payload.channel.findIndex(e=> e.classificator == item.classificator)
      if(index<0){
        this.payload.channel.push(item)
      }else{
        this.payload.channel.splice(index,1)
      }
      let a = []
      this.payload?.channel?.forEach((el)=>{a.push(el.classificator)})
      this.$emit('getSelected',a)  // emit parent component
      this.dropdownID = ''
      let th = this
      this.timeOut = setTimeout(() => {
        th.dropdownListOpen = ''
      }, 150)
    },
  },
  // computed:{
  //   channel() {
  //     if(this.payload.channel?.length) {
  //       this.payload.channel.forEach
  //       return this.options.find((obj) => obj.classificator == this.payload.channel)?.name
  //     }
  //     else return this.placeholder || this.$locale['pleaseSelect'][this.$i18n.locale.value]
  //   },
  // },
  
  beforeUnmount() {
    const _t = this
    document.removeEventListener("click", _t.drop)
  },
  async mounted(){
    const _t = this
    document.addEventListener("click", _t.drop)
    this.options.forEach((el)=>{
      if(el.default == 'active'){
        this.choosed(el)
      }
    })
    
  },
};
</script>