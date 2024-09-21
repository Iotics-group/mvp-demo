<template>
  <div class="modal" @click="modalHide">
    <div class="modal-main top" @click.stop>
      <div class="modal-body">
        <div class="personal_info">
          <p class="modal-title">{{$locale['nameFolder'][$i18n.locale.value]}}</p>
          <div class="new-apl-file">
            <label for="">{{$locale['nameFolders'][$i18n.locale.value]}}</label>
            <input v-model="name" type="text" :placeholder="$locale['enterNameFolders'][$i18n.locale.value]">
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
// import Icons from './icons.vue'
export default {
  data() {
    return {
      file: null,
      parent_id: null,
      name: undefined
    }
  },
  components: {
    // Icons
  },
  props: {
    idx: String,
    active: Object
  },
  methods: {
    async submit() {
      let data = {
        name: this.name
      }
      if(!this.active?._id && this.idx){
        data.parent_id = this.idx
      }
      let requestName = '/folder/create';
      if(this.active?._id){
        requestName = '/folder/update/'+this.active?._id;
      }
      await this.$axios[this.active?._id ? 'patch' : 'post'](requestName,data).then((res)=>{
        if(res){
          this.modalHide()
        }
      }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if((error.config.method == 'post')||(error.config.method == 'patch')){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.submit()
              }).catch((err)=>{
                console.log(err);
              })
            }
          }
      })
    },
    modalHide() {
      this.$emit("modalShow", false);
    },
  },
  mounted() {
    if(this.active){
      this.name = this.active.name
    }
  }
};
</script>
<style scoped>
.personal_info {
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
  height: 90%;
  max-height: 400px;
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
}</style>