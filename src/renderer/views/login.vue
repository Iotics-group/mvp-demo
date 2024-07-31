<template>
   <div ref="login" class="login">
    <div class="login-left">
      <div class="login-left-block">
        <div class="login-left-logo">
          <p>{{$locale['welcome'][$i18n.locale.value]}}</p>
          <img src="../assets/svg/logo.svg" alt="" />
        </div>
        <div class="login-left-text">
          <p>{{$locale['navigatorParameters'][$i18n.locale.value]}}</p>
          <div class="login-left-bottom">
            <div class="login-quality">{{$locale['accounting'][$i18n.locale.value]}}, {{$locale['quality'][$i18n.locale.value]}}, {{$locale['monitoring'][$i18n.locale.value]}}</div>
            <span>
              <b>IoTics</b> — {{$locale['loginDef'][$i18n.locale.value]}}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="login-main">
      <img class="login-bg" src="../assets/login.png" alt="" />
      <div class="login-block">
        <div class="login-block__title">
          <span>{{$locale['loginSystem'][$i18n.locale.value]}}</span>
        </div>
        <div class="login-block__form">
          <div class="form-groups">
            <div v-if="false">
              <Select maxHeight="300px" :label="$locale['module'][$i18n.locale.value]" :placeholder="$locale['selectModule'][$i18n.locale.value]" @getSelected="getMeter($event)" :options="options" id="modul"/>
            </div>
            <div class="form-group">
              <label for="">{{$locale['login'][$i18n.locale.value]}}</label>
              <input class="effect-2" :placeholder="$locale['enterLogin'][$i18n.locale.value]" @keydown.enter="submit" v-model.trim="login" type="text">
              <span class="span"><Icons icon="human" size="middle" color="#A9A9A9"/></span>
              <span class="focus-border"></span>
            </div>
            <div class="form-group">
              <label for="">{{$locale['password'][$i18n.locale.value]}}</label>
              <input class="effect-2" @keydown.enter="submit" v-model.trim="password" :placeholder="$locale['enterPassword'][$i18n.locale.value]" :type="password_show ? 'password' : 'text'">
              <button @click="password_show = !password_show"><Icons color="#A9A9A9" :icon="password_show ? 'hideEye' : 'showEye'" size="middle"/></button>
              <span class="focus-border"></span>
            </div>
          </div>
          <div class="form-btns">
            <button @click="$refs.checkbox.click()">
              <span :class="saveMe?'checked':'notCheck'"><span v-if="saveMe">&#10003;</span></span>
              <input ref="checkbox" v-show="false" v-model="saveMe" id="saveMe" type="checkbox"/>
              <span>{{$locale['remember'][$i18n.locale.value]}}</span>
            </button>
            <button :disabled="error" @click="submit" class="btn btn-primary">
              {{$locale['enter'][$i18n.locale.value]}}
            </button>
          </div>
        </div>
      </div>
    </div>
    <transition name="notify" :duration="10000">
      <notify @close="error = false" typeModal="error" code="120" v-if="error" />
    </transition>
    <transition name="notify" :duration="10000">
      <notify :text="$locale['userNotFound'][$i18n.locale.value]" @close="error2 = false" typeModal="error" code="121" v-if="error2" />
    </transition>
    <transition name="notify" :duration="10000">
      <notify :text="error3m" @close="error3 = false" typeModal="error" :code="(ercode || 122)" v-if="error3" />
    </transition>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import sidebar from "../assets/sidebar.json";
import Select from "../components/select.vue";
export default {
  name: 'App',
  data() {
    return {
      password_show: true,
      login: null,
      password: null,
      error3m: this.$locale['somethingWrong'][this.$i18n.locale.value],
      ercode: 122,
      module: 'electricity_meter',
      options:[
        {
          name:this.$locale['electricity_meter'][this.$i18n.locale.value],
          default: 'active',
          classificator:'electricity_meter',
        },
        {
          name:this.$locale['gas_meter'][this.$i18n.locale.value],
          classificator:'gas_meter',
        },
        {
          name:this.$locale['water_meter'][this.$i18n.locale.value],
          classificator:'water_meter',
        },
      ],
      open: false,
      error: false,
      error2: false,
      error3: false,
      saveMe: false,
      openModal: false,
    };
  },
  components: {
    Select
  },
  methods: {
    getMeter(e){
      this.module = e
    },
    async submit(){
      const data = {
        login: this.login,
        password: this.password
      }
      await ipcRenderer.invoke('login:req', data).then((res) => {
          if(res.status < 300){
            if(res?.args?.ok?.name){
              sessionStorage.setItem("user_info", JSON.stringify({name:res?.args?.ok?.name,id:res?.args?.ok?._id}));
            }
            if(res?.args?.ok?.open_page){
              sessionStorage.setItem("open_page",JSON.stringify(res?.args?.ok?.open_page))
            }
            if(res?.args?.ok?.open_factory){
              sessionStorage.setItem("open_factory",JSON.stringify(res?.args?.ok?.open_factory))
            }
            if(res?.args?.token){
              sessionStorage.setItem("token",res?.args?.token)
              let role = JSON.parse(atob(res?.args?.token.split('.')[1]))
              sessionStorage.setItem("user_tools",role.role)
              if(role){
                this.$emit('login')
                if(role.role != 'admin'){
                  let pages = JSON.stringify(res?.args?.ok?.open_page)
                  let newarray = []
                  sidebar.forEach((res1)=>{
                    if(res1.subMenu?.length){
                    res1.subMenu.forEach((res2)=>{
                      newarray.push(res2)
                    })
                    }else{
                    newarray.push(res1)
                    }
                  })
                  let page = newarray.find((w)=> {
                    return pages.indexOf(w.classificator) > (-1)
                  })
                  this.$router.push({path: ('/'+page?.url)})
                }else{
                  this.$router.push({path: ('/server-req')})
                }
              }
            }
            if(this.saveMe){
              localStorage.setItem("login",JSON.stringify(data))
            }else{
              localStorage.removeItem("login")
            }
            
          }else if(res.status >= 400){
            this.error = true
            let _t = this
            setTimeout(()=>{
              _t.error = false
            },5000)
          }
        }).catch((err) => {
        if(err?.status == 401){
          this.error2 = true;
          let _t = this;
          setTimeout(() => {
            _t.error2 = false;
          }, 5000);
        }else if(err?.status == 502){
          this.ercode = 140
          this.error3m = this.$locale['noConnection'][this.$i18n.locale.value];
          this.error3 = true;
          let _t = this;
          setTimeout(() => {
            _t.error3 = false;
          }, 5000);
        }else{
          this.error3m = err.message;
          this.error3 = true;
          let _t = this;
          setTimeout(() => {
            _t.error3 = false;
          }, 5000);
        }
      });
      this.login = null
      this.password = null
    },
  },
  mounted() {
    const e = localStorage.getItem('login');
    const a = JSON.parse(e);
    if (a) {
      this.saveMe = true;
      this.login = a.login;
      this.password = a.password;
    }
  },
};
</script>