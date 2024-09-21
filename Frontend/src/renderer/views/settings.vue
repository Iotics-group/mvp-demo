<template>
  <div class="wrapper">
    <div class="header">
      <h3>{{$locale['side_settings'][$i18n.locale.value]}}</h3>
      <div class="breadcrumbs">
        <p>{{ tab == 3 ? $locale['activation'][$i18n.locale.value] : $locale['users'][$i18n.locale.value] }}</p>
      </div>
    </div>
    <div class="settings">
      <div class="settings-head mt-30">
        <div class="gradient tabs">
          <button @click="changeTab(1)" :class="{active: tab == 1}" class="tab">{{$locale['users'][$i18n.locale.value]}}</button>
          <!-- <button @click="tab = 2" :class="{active: tab == 2}" class="tab">Считываемые параметры</button> -->
          <button @click="changeTab(3)" :class="{active: tab == 3}" class="tab">{{$locale['activation'][$i18n.locale.value]}}</button>
        </div>
        <div class="add-settings" v-if="role == 'admin'">
        </div>
      </div>
      <div class="settings-staff mt-30">
        <div v-if="tab==1" class="table gradient scroll">
          <div class="thead">
            <div class="tr">{{$locale['FIO'][$i18n.locale.value]}}</div>
            <div class="tr">{{$locale['roleUser'][$i18n.locale.value]}}</div>
            <div class="tr">{{$locale['lastActive'][$i18n.locale.value]}}</div>
          </div>
          <div class="tbody" v-for="(el,index) in data" :key="index">
            <div class="td"><span>{{el?.name}}</span></div>
            <div class="td">{{el.role == 'admin' ? $locale['role_admin'][$i18n.locale.value] : $locale['role_user'][$i18n.locale.value]}}</div>
            <div class="td">
              <p>{{dateFilter(el.last_active)}}</p>
            </div>
          </div>
          <div class="tbody" v-for="(el,index) in data2" :key="index">
            <div class="td"><span>{{el?.name}}</span></div>
            <div class="td">{{el.role == 'admin' ? $locale['role_admin'][$i18n.locale.value] : $locale['role_user'][$i18n.locale.value]}}</div>
            <div class="td">
              <p>{{dateFilter(el.last_active)}}</p>
            </div>
          </div>
        </div>
        <!-- <div v-if="tab==2" class="time-zone">
          <div class="table4 bg-white scroll">
            <h5>Заполненные временные зоны</h5>
            <div class="thead">
              <div class="tr">Название тарификации</div>
              <div class="tr">Стоимость КВат</div>
              <div class="tr">Начало временной зоны</div>
              <div class="tr">Конец временной зоны</div>
            </div>
            <div class="tbody" v-for="(el,index) in 20" :key="index">
              <div class="td"><span>Egamberdiyev Akobir Abdurashid o‘g‘li</span></div>
              <div class="td">1 000 500,00 сум</div>
              <div class="td">00:00</div>
              <div class="td">
                <p>14:37</p>
                <div class="set-action">
                  <button @click="openModal2 = true">
                    <Icons icon="pen" />
                  </button>
                  <button @click="remove2(index)">
                    <Icons icon="delete" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="table2 gradient scroll">
            <h5>Не заполненные временные зоны</h5>
            <div class="thead">
              <div class="tr">Начало временной зоны</div>
              <div class="tr">Конец временной зоны</div>
            </div>
            <div class="tbody" v-for="(el,index) in 20" :key="index">
              <div class="td">00:00</div>
              <div class="td">
                <p> 23:00 </p>
                <div class="set-action">
                  <button @click="openModal2 = true">
                    <Icons icon="pen" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <div v-if="tab==3" class="license">
          <div class="model-voltage-gis">
            <h1>{{$locale['informationproduct'][$i18n.locale.value]}}</h1>
            <div class="model-voltage-ginfo">
              <div class="model-voltage-text">
                <p>{{$locale['versionApp'][$i18n.locale.value]}}:</p><span> {{packageVS.version}} </span>
              </div>
              <div class="model-voltage-text">
                <p>{{$locale['typeApp'][$i18n.locale.value]}}:</p><span> {{packageVS.productVersion}} to OMS </span>
              </div>
              <div class="model-voltage-text">
                <p>{{$locale['statusActivation'][$i18n.locale.value]}}: </p><span v-if="!license" class="noactive">{{$locale['noactive'][$i18n.locale.value]}}</span><span v-else>{{$locale['active'][$i18n.locale.value]}}</span>
              </div>
            </div>
          </div>
          <div class="model-voltage-gis mt-30">
            <h1>{{$locale['license'][$i18n.locale.value]}}</h1>
            <div v-if="!license" class="model-voltage-ginfo">
              <div class="model-voltage-text">
                <p>{{$locale['noInformation'][$i18n.locale.value]}}</p>
              </div>
            </div>
            <div v-else class="model-voltage-ginfo">
              <div class="model-voltage-text">
                <p>{{$locale['dateActivation'][$i18n.locale.value]}}:</p><span> {{dateFilter($license?.license?.value?.activation_date)}} </span>
              </div>
              <div class="model-voltage-text">
                <p>{{$locale['dateDeactivation'][$i18n.locale.value]}}:</p><span> {{dateFilter($license?.license?.value?.deactivation_date)}} </span>
              </div>
              <div class="model-voltage-text">
                <p>{{$locale['dateExpired'][$i18n.locale.value]}}:</p><span> {{dateFilter($license?.license?.value?.expiration_date)}} </span>
              </div>
              <div class="model-voltage-text">
                <p>{{$locale['limitMeter'][$i18n.locale.value]}}:</p><span> {{$license?.license?.value?.meter_limit}} </span>
              </div>
            </div>
          </div>
          <div class="license-btn" v-if="(!license||(dateFilter($license?.license?.value?.deactivation_date) < 10))">
            <button class="gradient-btn" @click="successLicenseOnline = true">{{$locale['onlineActivation'][$i18n.locale.value]}}</button>
            <button @click="successLicense = true">{{$locale['offlineActivation'][$i18n.locale.value]}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <transition name="notify" :duration="10000">
    <notify :main="$locale['successfully'][$i18n.locale.value]" :text="$locale['requestCompletedSuccessfully'][$i18n.locale.value]" @close="success=false" typeModal="success" v-if="success"/>
  </transition>
  <transition name="notify" :duration="10000">
    <notify :main="$locale['error'][$i18n.locale.value]" :text="wrongM || $locale['somethingWrong'][$i18n.locale.value]" @close="wrong=false" :typeModal="error" v-if="wrong"/>
  </transition>
</template>
<script>
import packageV from "../../../package.json";  
import Icons from '../components/icons.vue'
export default {
  components: { 
    Icons,
  },
  name: 'settings-page',
  data(){
    return {
      tab: 1,
      id: null,
      idx: null,
      idx2: null,
      data: null,
      data2: null,
      user: null,
      hide: false,
      success: false,
      wrong: false,
      wrongM: '',
      openModal: false,
      openModal2: false,
      openRemove: false,
      openRemove2: false,
      successLicense: false,
      successLicenseOnline: false,
      status: false,
      role: 'super',
      packageVS: null,
    }
  },
  methods:{
    setstatus(e){
      if(e.status < 300){
        this.success = true
        let _t = this
        setTimeout(()=>{
          _t.success = false
        },5000)
      }else{
        this.wrong = true
        let errorM = {ru:"Лицензия недействительна",en:"License invalid"}
        this.wrongM = errorM?.[this.$i18n.locale.value]
        let _t = this
        setTimeout(()=>{
          _t.wrong = false
        },5000)
      }
    },

    dateCount(e){
      if(e){
        let date = new Date(e).getTime()
        let newdate = new Date().getTime()
        let counter = ((date - newdate)/86400000).toFixed(0)
        return  counter
      }else{
        return "-"
      }
    },
    changeTab(e){
      this.tab = e
      if(this.tab != 3){
        this.$router.push({path:'/settings',query:{activation:'inactive'}})
      }
    },
    dateFilter(e){
      if(e){
        let date = new Date(e)
        let newdate = ('0'+date.getDate()).slice(-2)+'.'+('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
        let newtime = ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)
        return  newdate+'  '+newtime
      }else{
        return "-"
      }
    },
    async modalShow(){
      this.openModal = false
      await this.$axios.get('/admin/list?status=active').then((res) => {
        this.data = res?.data?.data
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.$axios.get('/admin/list?status=active').then((res) => {
                this.data = res?.data?.data
              }).catch((err)=>{
                console.log(err);
              })
            }).catch((err)=>{
              console.log(err);
            })
          }
        }
      })
      await this.$axios.get('/admin/list?status=inactive').then((res) => {
        this.data2 = res?.data?.data
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.$axios.get('/admin/list?status=inactive').then((res) => {
                this.data2 = res?.data?.data
              }).catch((err)=>{
                console.log(err);
              })
            }).catch((err)=>{
              console.log(err);
            })
          }
        }
      })
    },
    async modalShow2(e){
      this.idx = null
      this.openRemove = false
      if(e?.status){
        if(e.status == 'active'){
          this.success = true
					let _t = this
					setTimeout(()=>{
						_t.success = false
					},5000)
        }else{
          this.wrong = true
					let _t = this
					setTimeout(()=>{
						_t.wrong = false
					},5000)
        }
      }
      await this.$axios.get('/admin/list?status=active').then((res) => {
        this.data = res?.data?.data
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.$axios.get('/admin/list?status=active').then((res) => {
                this.data = res?.data?.data
              }).catch((err)=>{
                console.log(err);
              })
            }).catch((err)=>{
              console.log(err);
            })
          }
        }
      })
      await this.$axios.get('/admin/list?status=inactive').then((res) => {
        this.data2 = res?.data?.data
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.$axios.get('/admin/list?status=inactive').then((res) => {
                this.data2 = res?.data?.data
              }).catch((err)=>{
                console.log(err);
              })
            }).catch((err)=>{
              console.log(err);
            })
          }
        }
      })
    },
    async modalShow3(){
      this.successLicense = false
    },
    // modalShow3(){
    //   this.openModal2 = false
    // },
    modalShow4(){
      this.successLicenseOnline = false
    },
    
  },
  computed:{
    license(){
      return (this.$license?.license?.value ? Object.keys(this.$license?.license?.value)?.length : 0)
    }
  },
  async mounted(){
    if(this.$route?.query?.activation == 'active'){
      this.tab = 3
    }
    let info = sessionStorage.getItem('user_info') && JSON.parse(sessionStorage.getItem('user_info'))
    this.packageVS = packageV
    this.id = info?.id
    if(sessionStorage.getItem('user_tools')){
      this.role = sessionStorage.getItem('user_tools')
    }
    await this.$axios.get('/admin/list?status=active').then((res) => {
      this.data = res?.data?.data
    }).catch(async (error)=>{
      const statusCode = (error.response || {}).status || -1;
      if (statusCode == 406) {
        if(error.config.method == 'get'){
          await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
            localStorage.setItem('session',res?.data?.session)
            await this.$axios.get('/admin/list?status=active').then((res) => {
              this.data = res?.data?.data
            }).catch((err)=>{
              console.log(err);
            }) 
          })
        }
      }
    })
    await this.$axios.get('/admin/list?status=inactive').then((res) => {
      this.data2 = res?.data?.data
    }).catch(async (error)=>{
      const statusCode = (error.response || {}).status || -1;
      if (statusCode == 406) {
        if(error.config.method == 'get'){
          await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
            localStorage.setItem('session',res?.data?.session)
            await this.$axios.get('/admin/list?status=inactive').then((res) => {
              this.data2 = res?.data?.data
            }).catch((err)=>{
              console.log(err);
            })
          })
        }
      }
    })
    
  }
}
</script>