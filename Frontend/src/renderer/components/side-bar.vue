<template>
    <div class="sidebar" :class="{active:activeSide}" @mouseenter="activeSidebar()" @mouseleave="passiveSidebar()">
      <div class="sidebar-wrapper">
        <div class="sidebar-logo">
          <img src="../assets/svg/logo2.svg" alt="">
          <div class="sidelogo">
            <div class="sidelogo-p">Iotics by Alpha Electronics</div>
            <div class="sidelogo-span">{{$locale['version'][$i18n.locale.value]}} № {{packageVS?.version}}</div>
          </div>
        </div>
        <div class="sidebar-route">
          <div v-for="el,index in sideMenus" :key="index">
            <button :class="{active: ($route.fullPath == ('/'+el?.url))}" v-if="!el?.subMenu?.length && (open_page.includes(el.classificator)||role=='admin')" @click="$router.push('/'+el?.url)"> 
              <Icons :icon="el.icons"/>
             {{ el?.name?.[$i18n.locale.value] }}
            </button>
            <div v-else-if="el?.subMenu?.length" class="accordion-routes">
              <div :class="{accordion:accordion==el.url}" class="item">
                <button class="accordion-btn" @click="subOpen(el.url,index)"><span><Icons :icon="el.icons" size="middle"/></span> {{ el?.name?.[$i18n.locale.value] }} <Icons class="arrDown" icon="arrDown" size="middle"/></button>
                <div class="subMenu">
                  <button @focus="focus(index)" v-show="(open_page.includes(item.classificator)||(role=='admin'))" :disabled="item.disabled" :class="{active: ($route.fullPath == ('/'+item?.url))}" @click="$router.push({path:('/'+item?.url),query:{catalog:item.query}})" v-for="item,idx in el.subMenu" :key="idx"><span></span>{{item?.name?.[$i18n.locale.value]}}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="side_avatar">
        <div class="side_user">
          <div class="side_user_name">
            <Icons class="side_human" icon="user"/>
            <p class="line-1">{{name}}</p>
            <div @click="logout" :title="$locale['logoutSystem'][$i18n.locale.value]" class="side_logout ml-auto">
              <Icons size="custom" width="20" height="20" icon="logOut" color="white"/>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
// import Modal from "@/components/popup/profile.vue";   
import packageV from "../../../package.json";  
import sidebar from "../assets/sidebar.json";  
export default {
  data(){
    return{
      name: 'Пользователь',
      tabindex: null,
      subM: false,
      open_page: [],
      packageVS: null,
      activeSide: false,
      accordion: null,
      role: null,
      sideMenu:[]
    }
  },
  computed: {
    sideMenus(){
      let newMenu = [...this.sideMenu]
      if(this.role == 'super'){
        return newMenu.filter((el)=>((el?.subMenu?.length && el?.classificators?.some(r=> this.open_page?.includes(r))) || this.open_page.includes(el?.classificator)))
      }else{
        return newMenu
      }
    }
    // Modal,
  },
  methods:{
    focus(e){
      if((this.tabindex != e)&&((e==1)||(e==3))){
        this.subOpen(this.sideMenus[e]?.url)
      }
      this.tabindex = e
    },
    subOpen(e,index){
      if(this.accordion == e){
        this.accordion = null
      }else{
        this.accordion = e
      }
      this.tabindex = index
    },
    activeSidebar(){
      this.activeSide = true
    },
    passiveSidebar(){
      this.activeSide = false
    },
    logout(){
      localStorage.removeItem("session");
      this.$emit('logout')
      this.$router.push('/login')
    },
  },
  mounted(){
    let info = sessionStorage.getItem('user_info') && JSON.parse(sessionStorage.getItem('user_info'))
    this.name = info?.name || 'Пользователь'
    this.packageVS = packageV
    if(sessionStorage.getItem('open_page')){
      this.open_page = JSON.parse(sessionStorage.getItem('open_page'))
    }
    if(sessionStorage.getItem('user_tools')){
      this.role = sessionStorage.getItem('user_tools')
    }
    this.sideMenu = sidebar
  }
}
</script>