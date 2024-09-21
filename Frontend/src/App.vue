<script>
import sideBar from './renderer/components/side-bar.vue'
import NavBar from './renderer/components/nav-bar.vue'
import error from './renderer/components/error.vue'
import Login from './renderer/views/login.vue'
// import { io } from 'socket.io-client'

export default {
  components: {
    sideBar,
    error,
    NavBar,
    Login
  },
  data(){
    return{
      // socket: io((localStorage.getItem('BASE_URL') || process.env.VUE_APP_BASE_URL || "http://192.168.1.10:1000/")),
      eventData: [],
      sum: 1,
      session: false,
      checkport: false,
      interval: false,
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler(page) {
        if(page?.name == "login"){
          this.session = false
          // this.socket.close()
          this.eventData = []
        }
      }
    },
    session(){
      let _t = this
      if(!this.session){
        clearInterval(this.interval)
      }else{
        _t.checkPortActive()
        this.interval = setInterval(() => {
          if(!_t.checkport){
            _t.checkPortActive()
          }
        }, 30000);
      }
    }
  },
  methods: {
    login() {
      this.session = true
      this.checkNotif()
      // this.socket = io((localStorage.getItem('BASE_URL') || process.env.VUE_APP_BASE_URL || "http://192.168.1.10:1000/")),
      // this.socket.on('event', (message) => {
      //   localStorage.setItem('lastId',message?._id)
      //   this.eventData.push(message)
      // });
    },
    logout(){
      this.session = false
      this.eventData = []
      // this.socket.close()
    },
    checkPortEmit(){
      this.checkPortActive()
    },
    async checkPortActive(){
      if(this.session) {
        await this.$axios.get('/license/data').then((res) => {
          this.checkport = true
          this.$license.setLic(res?.data?.data)
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.checkPortActive()
              })
            }
          }
        })
      }
    },
    close(e){
      const t = this
      t.eventData = t.eventData.filter((el)=> el._id !== e )
    },
    async checkNotif(){
      if(this.session) {
        let params = {}
        if(localStorage.getItem('lastId')){
          params.id = localStorage.getItem('lastId')
        }
        await this.$axios.get('/event/last',{params:params}).then((res) => {
          this.eventData = res?.data?.data
          if(this.eventData?.length){
            localStorage.setItem('lastId',this.eventData[0]?._id)
          }
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.checkNotif()
              })
            }
          }
        })
      }
    }
    
  },
  mounted() {
    this.eventData = []
  }
}

</script>

<template>
  <div class="app">
    <NavBar/>
    <div v-if="session && ($route.meta.auth == true)" class="main-layout">
      <sideBar @logout="logout()"/>
      <div class="page">
        <router-view/>
      </div>
      <error @checkPortEmit="checkPortEmit" v-if="checkport"/>
    </div>
    <div v-else class="additional-layout">
      <Login @login="login()"/>
    </div>
    <transition name="notify" :duration="10000">
      <div class="multi-error">
        <notify2 v-for="(e,index) in eventData" :key="index" :data="e" :topindex="index" @close="close($event)"/>
      </div>
    </transition>
    <div class="small-screen">
      {{$locale['smaller1920'][$i18n.locale.value]}}
    </div>
  </div>
</template>