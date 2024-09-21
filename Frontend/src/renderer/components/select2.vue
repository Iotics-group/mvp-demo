<template>
  <div class="select">
    <div class="input-wrapper">
      <div
        class="input-div dropdown-input"
        :class="((this.dropdownID == id ? 'active ' : ' ')+ (required && !payload.channel ? 'required-err': '')) + (bottom ? 'bottom-select' : '')"
        :id="id"
      >
        <span
          class="placeholder"
          :class="this.payload.channel !== '' ? 'not-empty' : ''"
          :id="id"
        >
          {{ channel }}
        </span>
        <img
          src="../assets/svg/arrow-down-w.svg"
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
            @click.stop="choosed(option.classificator)"
            :class="option.classificator == this.payload.channel ? 'chosen' : ''"
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
  name: 'select-com',
  data() {
    return {
      file: null,
      tab: 1,
      dropdownID: '',
      dropdownListOpen: false,
      required: false,
      payload: {
        pin: '',
        channel: ''
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
    placeholder: {
      type: String
    },
    bottom: {
      type: Boolean,
      default: () => false,
    },
    maxHeight: {
      type: String,
      default: () => null,
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

    choosed(id) {
      this.payload.channel = id
      this.$emit('getSelected',id)  // emit parent component
      this.dropdownID = ''
      this.timeOut = setTimeout(() => {
        this.dropdownListOpen = ''
      }, 150)
    },
  },
  computed:{
    channel() {
      if(this.payload.channel !== '') {
        return this.options.find((obj) => obj.classificator == this.payload.channel)?.name
      }
      else return this.placeholder || this.$locale['pleaseSelect'][this.$i18n.locale.value]
    },
  },
  
  beforeUnmount() {
    const _t = this
    document.removeEventListener("click", _t.drop)
  },
  async mounted(){
    const _t = this
    document.addEventListener("click", _t.drop)
    this.options?.forEach((el)=>{
      if(el.default == 'active'){
        this.choosed(el?.classificator)
      }
    })
  },
};
</script>