<template>
  <div class="modal" @click.self="modalHide">
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
          <p class="modal-title">{{user?._id  ? $locale['edit'][$i18n.locale.value] : $locale['new'][$i18n.locale.value] }} {{$locale['user'][$i18n.locale.value]}}</p>
          <div class="new-apl-file">
            <label for="">{{$locale['FIO'][$i18n.locale.value]}}</label>
            <input v-model="payload.name" type="text" :placeholder="$locale['enterFIO'][$i18n.locale.value]">
          </div>
          <div v-if="!loading && ((role=='super')||((role=='admin')&&(!user))||((role=='admin')&&(user?.role == 'super')))" class="new-apl-file">
            <Select maxHeight="246px" :placeholder="$locale['selectAccessProfile'][$i18n.locale.value]" :label="$locale['accessProfile'][$i18n.locale.value]" @getSelected="getPages($event)" :options="options" id="uspd1"/>
          </div>
          <div v-if="!loading && folderShow && ((role=='super')||((role=='admin')&&(!user))||((role=='admin')&&(user?.role == 'super')))" class="new-apl-file">
            <Select maxHeight="246px" :placeholder="$locale['enterAccessServerReqFolder'][$i18n.locale.value]" :label="$locale['accessServerReqFolder'][$i18n.locale.value]" @getSelected="getFolders($event)" :options="folders" id="uspd0"/>
          </div>
          <div v-if="!loading && electShow && ((role=='super')||((role=='admin')&&(!user))||((role=='admin')&&(user?.role == 'super')))" class="new-apl-file">
            <Select maxHeight="246px" :placeholder="$locale['enterAccessElectObject'][$i18n.locale.value]" :label="$locale['accessElectObject'][$i18n.locale.value]" @getSelected="getElectobj($event)" :options="electobjs" id="electobj"/>
          </div>
          <div v-if="!loading && calcShow && ((role=='super')||((role=='admin')&&(!user))||((role=='admin')&&(user?.role == 'super')))" class="new-apl-file">
            <Select maxHeight="246px" :placeholder="$locale['enterAccessCalcObject'][$i18n.locale.value]" :label="$locale['accessElectObject'][$i18n.locale.value]" @getSelected="getCalcobj($event)" :options="calcobjs" id="calcobj"/>
          </div>
          <div class="new-apl-file">
            <label for="">{{$locale['loginUser'][$i18n.locale.value]}}</label>
            <input v-model="payload.login" type="text" :placeholder="$locale['enterLoginUser'][$i18n.locale.value]">
          </div>
          <div class="new-apl-file">
            <label for="">{{$locale['passwordUser'][$i18n.locale.value]}}</label>
            <input v-model="payload.password" type="password" :placeholder="$locale['enterPasswordUser'][$i18n.locale.value]">
          </div>
          <span class="required" v-if="loginFalse">{{$locale['dublicateLogin'][$i18n.locale.value]}}</span>
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
import Select from '../multiSelect.vue'
export default {
  data() {
    return {
      role: null,
      file: null,
      parent_id: null,
      payload: {},
      loading: true,
      options: [
          {
              "classificator": "1",
              "name": this.$locale['server_req'][this.$i18n.locale.value],
          },
          {
              "classificator": "2",
              "name": this.$locale['side_map'][this.$i18n.locale.value],
          },
          {
              "classificator": "3",
              "name": this.$locale['side_object'][this.$i18n.locale.value],
          },
          {
              "classificator": "4",
              "name": this.$locale['side_dashboard'][this.$i18n.locale.value],
          },
          // {
          //     "classificator": "10",
          //     "name": this.$locale['schema'][$i18n.locale.value],
          // },
          {
              "classificator": "5",
              "name": this.$locale['graph-panel'][this.$i18n.locale.value],
          },
          {
              "classificator": "6",
              "name": this.$locale['vector-diagram'][this.$i18n.locale.value],
          },
          {
              "classificator": "7",
              "name": this.$locale['table-diagram'][this.$i18n.locale.value],
          },
          {
              "classificator": "8",
              "name": this.$locale['report'][this.$i18n.locale.value],
          },
          {
              "classificator": "11",
              "name": this.$locale['journal'][this.$i18n.locale.value],
          },
          {
              "classificator": "9",
              "name": this.$locale['side_settings'][this.$i18n.locale.value],
          },
      ],
      electobjs:[],
      calcobjs:[],
      folders:[],
      name: undefined,
      loginFalse: false
    }
  },
  components: {
    Select,
    // Icons
  },
  props: {
    idx: String,
    user: {
      type: Object,
      default: () => null,
    },
  },
  computed:{
    folderShow(){
      return this.payload.open_page?.includes('1')
    },
    electShow(){
      return this.payload.open_page?.includes('2')
    },
    calcShow(){
      return this.payload.open_page?.includes('3')
    },
  },
  methods: {
    getElectobj(e){
      this.payload.open_factory1 = e
    },
    getFolders(e){
      this.payload.open_folders = e
    },
    getCalcobj(e){
      this.payload.open_factory2 = e
    },
    getPages(e){
      this.payload.open_page = e
    },
    getRole(e){
      this.payload.role = e
    },
    getPosition(e){
      this.payload.position = e
    },
    async submit() {
      let data = null
      if((this.role == 'super') || ((this.role=='admin')&&(!this.user)) || ((this.role == 'admin')&&(this.user?.role=='super'))){
        this.payload.open_factory = this.payload.open_factory2?.length ? this.payload.open_factory1.concat(this.payload.open_factory2) : this.payload.open_factory1
        data = {
          name: this.payload.name,
          login: this.payload.login,
          open_page: this.payload.open_page || [],
          open_factory: this.payload.open_factory || [],
          open_folders: this.payload.open_folders || [],
          password: this.payload.password,
          role: 'super',
        }
      }else{
        data = {
          name: this.payload.name,
          login: this.payload.login,
          password: this.payload.password,
        }
      }
      if(this.user){
        let payload = JSON.parse(JSON.stringify(data))
        await this.$axios.patch(`/admin/update/${this.user._id}`,payload).then((res)=>{
          res && res.status < 300 ? this.modalHide() : ''
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'patch'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.submit()
              }).catch((err)=>{
                console.log(err);
              })
            }
          }
        })
      }else{
        let payload = JSON.parse(JSON.stringify(data))
        await this.$axios.post(`/admin/create`,payload).then((res)=>{
          res && res.status < 300 ? this.modalHide() : ''
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          this.loginFalse = false
          if(statusCode == 400){
            this.loginFalse = true
          }
          if (statusCode == 406) {
            if(error.config.method == 'post'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.submit()
              }).catch((err)=>{
                console.log(err);
              })
            }
          }
        })
      }
      // let response = await ipcRenderer.invoke(eventNames.insertServerRequestFolders, { name: this.name ,parent_id:this.idx})
      // response && response.status === 200 ? alert('Success sended!') : alert("Something went wrong")
    },
    modalHide() {
      this.$emit("modalShow", false);
    },
  },
  async mounted() {
    if(sessionStorage.getItem('user_tools')){
      this.role = sessionStorage.getItem('user_tools')
    }
    this.loading = true
    
    await this.$axios.get('/folder/parents-list').then((res)=>{
      if(res?.data){
        let data = res?.data?.data
        this.folders = []
        data?.forEach((el)=>{this.folders.push({name:el?.name,classificator:el?._id})})
      }
    }).catch(async (error)=>{
      const statusCode = (error.response || {}).status || -1;
      if (statusCode == 406) {
        if(error.config.method == 'post'){
          await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
            localStorage.setItem('session',res?.data?.session)
            await this.$axios.get('/folder/parents-list').then((res)=>{
              if(res?.data){
                let data = res?.data?.data
                this.folders = []
                data?.forEach((el)=>{this.folders.push({name:el?.name,classificator:el?._id})})
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
    await this.$axios.get('/electricity/factories').then((res)=>{
      if(res?.data){
        let data = res?.data?.data
        this.electobjs = []
        data?.forEach((el)=>{this.electobjs.push({name:el?.name,classificator:el?._id})})
      }
    }).catch(async (error)=>{
      const statusCode = (error.response || {}).status || -1;
      if (statusCode == 406) {
        if(error.config.method == 'post'){
          await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
            localStorage.setItem('session',res?.data?.session)
            await this.$axios.get('/electricity/factories').then((res)=>{
              if(res?.data){
                let data = res?.data?.data
                this.electobjs = []
                data?.forEach((el)=>{this.electobjs.push({name:el?.name,classificator:el?._id})})
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
    await this.$axios.get('/calculation/factories').then((res)=>{
      if(res?.data){
        let data = res?.data?.data
        this.calcobjs = []
        data?.forEach((el)=>{this.calcobjs.push({name:el?.name,classificator:el?._id})})
      }
    }).catch(async (error)=>{
      const statusCode = (error.response || {}).status || -1;
      if (statusCode == 406) {
        if(error.config.method == 'post'){
          await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
            localStorage.setItem('session',res?.data?.session)
            await this.$axios.get('/calculation/factories').then((res)=>{
              if(res?.data){
                let data = res?.data?.data
                this.calcobjs = []
                data?.forEach((el)=>{this.calcobjs.push({name:el?.name,classificator:el?._id})})
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
    if(this.user){
      this.payload.name = this.user.name
      this.payload.login = this.user.login
      this.payload.open_factory = this.user.open_factory
      this.payload.open_folders = this.user.open_folders
      this.folders.forEach((el,index)=>{
        if(this.payload.open_folders?.includes(el.classificator)){
          this.folders[index].default = 'active'
        }
      })
      this.electobjs.forEach((el,index)=>{
        if(this.payload.open_factory.includes(el.classificator)){
          this.electobjs[index].default = 'active'
        }
      })
      this.calcobjs.forEach((el,index)=>{
        if(this.payload.open_factory.includes(el.classificator)){
          this.calcobjs[index].default = 'active'
        }
      })
      this.options.forEach((el,index)=>{
        if(this.user?.open_page.includes(el.classificator)){
          this.options[index].default = 'active'
        }
      })
    }
    this.loading = false
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
}</style>