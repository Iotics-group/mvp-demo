<script>
import sideBar from './renderer/components/side-bar.vue'
import NavBar from './renderer/components/nav-bar.vue'
import error from './renderer/components/error.vue'
import Login from './renderer/views/login.vue'
import { ipcRenderer } from 'electron';
import eventNames from '@/universal/eventNames.js';

export default {
  components: {
    sideBar,
    error,
    NavBar,
    Login
  },
  data(){
    return{
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
          sessionStorage.removeItem("token")
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
      ipcRenderer.on('event', (event,message) => {
        localStorage.setItem('lastId',message?._id)
        this.eventData.push(message)
      });
    },
    logout(){
      this.session = false
      this.eventData = []
    },
    checkPortEmit(){
      this.checkPortActive()
    },
    async checkPortActive(){
      if(this.session) {
        await ipcRenderer.invoke(eventNames.getlicenseData).then((res) => {
          this.checkport = true
          this.$license.setLic(res?.data)
        }).catch(async (error)=>{
          console.log(error);
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
        await ipcRenderer.invoke(eventNames.getEventLast,{...params}).then((res) => {
          this.eventData = JSON.parse(res?.data)
          if(this.eventData?.length){
            localStorage.setItem('lastId',this.eventData[0]?._id)
          }
        }).catch(async (error)=>{
          console.log(error);
        })
      }
    }
    
  },
  mounted() {
    if(sessionStorage.getItem("token")){
      this.session = true
    }else{
      this.session = false
      this.$router.push({ path: '/login' })
    }
    this.eventData = []
    
  },
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