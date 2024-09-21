<template>
  <div class="modal" @click="modalHide">
    <div class="modal-main top" @click.stop>
      <div class="modal-body">
        <div class="personal_info">
          <p v-if="step == 1" class="modal-title">{{$locale['autentification'][$i18n.locale.value]}}</p>
          <p v-else class="modal-title">{{$locale['registerDevice'][$i18n.locale.value]}}</p>
          <div v-if="step == 1" class="new-apl-file">
            <label for="">{{$locale['login'][$i18n.locale.value]}}</label>
            <input v-model="username" type="text" :placeholder="$locale['personalCabinetLogin'][$i18n.locale.value]+' https://www.account.iotics.uz'">
          </div>
          <div v-if="step == 1" class="new-apl-file">
            <label for="">{{$locale['password'][$i18n.locale.value]}}</label>
            <input v-model="password" type="text" :placeholder="$locale['personalCabinetPassword'][$i18n.locale.value]+' https://www.account.iotics.uz'">
          </div>
          <div v-if="step == 2" class="new-apl-file">
            <label for="">{{$locale['oneTimeCode'][$i18n.locale.value]}}</label>
            <input v-model="code" type="text" :placeholder="$locale['enterOneTimeCode'][$i18n.locale.value]">
            <span class="required mt-12">00:{{ ntime }}</span>
            <span v-if="codeExpired" class="required mt-12">{{$locale['codeExpired'][$i18n.locale.value]}}</span>
          </div>
          <h3 v-if="step == 3">{{$locale['licenseSuccess'][$i18n.locale.value]}}</h3>
          <span v-if="errorLimit" class="required mt-12">{{$locale['meterLimitError1'][$i18n.locale.value]}} {{limit}} {{$locale['meterLimitError2'][$i18n.locale.value]}}</span>
          <div class="new-apl-block">
            <button v-if="step != 3" @click="modalHide" class="red-filled-btn">{{$locale['cancel'][$i18n.locale.value]}}</button>
            <button :disabled="load" v-if="(step == 1)&&(!errorLimit)" @click="submit" class="blue-filled-btn">{{$locale['add'][$i18n.locale.value]}}</button>
            <button :disabled="load" v-else-if="(step == 2)&&(!errorLimit)" @click="sendCode" class="blue-filled-btn">{{$locale['add'][$i18n.locale.value]}}</button>
            <button v-if="(step == 3)||(errorLimit)" @click="modalHide" class="blue-filled-btn">{{$locale['ok'][$i18n.locale.value]}}</button>
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
      license: null,
      parent_id: null,
      username: null,
      password: null,
      code: null,
      ntime: 59,
      token: null,
      timer: 58,
      step: 1,
      codeExpired: false,
      load: false,
      limit: 0,
      error: false,
      errorLimit: false,
      name: undefined,
    }
  },
  components: {
    // Icons
  },
  props: {
    idx: String
  },
  methods: {
    time() {
      let time = this.timer--
      this.ntime = ('0'+time).slice(-2)
    },
    async sendFile(){
      // var file = (new Blob([this.license]))
      // var fileURL = window.URL.createObjectURL(new Blob([file]))
      // var fileLink = document.createElement("a")
      // fileLink.href = fileURL
      // fileLink.setAttribute("download", `license.ilf`)
      // document.body.appendChild(fileLink)
      // fileLink.click()
      var file = new File([this.license], "license.ilf");
      let payload = new FormData()
      payload.append('license',file)
      this.load = true
      await this.$axios.post('/license/new-license', payload).then((res) => {
        if(res){
          this.step = 3
          this.load = false
        }
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if((error.config.method == 'post')||(error.config.method == 'patch')){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.sendFile()
            }).catch((err)=>{
              this.$emit('response',err)
            })
          }else{
            this.$emit('response',error)
          }
        }else if (statusCode == 400) {
          this.limit = Number(error.response?.data?.data?.baza_meters_length||0) - Number(error.response?.data?.data?.license_limit||0) 
          this.errorLimit = true
        }
      })
    },
    async sendCode(){
      let f = new FormData()
      f.append('login',this.username)
      f.append('password',this.password)
      if(this.step==2){
        f.append('code',this.code)
      }
      f.append('file',this.file)
      this.load = true
      await this.$axios.post((process.env.VUE_APP_BASE_CERTIFICATE || "http://192.168.1.10:1000/") + "license/online-generate",f,{headers:{token:this.token}}).then((res) => {
        if(res.status == 200){
          this.load = false
          this.license = (new Blob([res.data]))
          this.sendFile()
        }
      }).catch(async (err)=>{
        if(err.response.status == 406){
          if(err.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.sendCode()
            }).catch((err)=>{
              console.log(err);
            })
          }
        }else{
          this.codeExpired = true
        }
      })

    },
    createBigHash(secret) {
      const alifbo = `оЧjэ$GheRY?0pЖяДт=BaN8ёЯф) ЁgVLyь!]9mГ+IwrзXу[KТЫ@УБЛЪl5ыйf1EЕчЬ:,ОЩФЮQ-k|юHпР7кВAдрDЦХ&ИUxШшъА(ЗvJcжб%вгouЙ^сZi3}nWМPb_C64КztTиSмлO{щdце*н.MЭС/s2FНПхаq`;

      const randomIndex = Math.floor(Math.random() * alifbo.length) + 1
      const random = randomIndex ? randomIndex : 1
      const split = alifbo.split('')
      let hash1 = alifbo[random]

      for (const key of secret) {
          const secret2 = (split.findIndex((e) => e == key) + random) % alifbo.length
          hash1 += alifbo[secret2]
      }

      let divison = Math.floor(alifbo.length / hash1.length)
      let hash = ''
      for (let i = 0; i < alifbo.length; i++) {
          if (i % divison == 0) {
              hash += hash1[i / divison] || ''
          } else {
              hash += alifbo[i]
          }
      }
      
      hash += alifbo[divison]
      return hash
    },
    makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    },
    verifyHash(hash) {
        const alifbo = `оЧjэ$GheRY?0pЖяДт=BaN8ёЯф) ЁgVLyь!]9mГ+IwrзXу[KТЫ@УБЛЪl5ыйf1EЕчЬ:,ОЩФЮQ-k|юHпР7кВAдрDЦХ&ИUxШшъА(ЗvJcжб%вгouЙ^сZi3}nWМPb_C64КztTиSмлO{щdце*н.MЭС/s2FНПхаq`;
        const split = alifbo.split('')
        
        let findDivison = split.findIndex((e) => e == hash[hash.length - 1])
        let verifyHash = ''
        for (let i = 0; i < hash.length-findDivison; i++) {
            if (i % findDivison == 0) {
                verifyHash += hash[i]
            }
        }

        let findRandom = ''
        let verifySecret = ''
        for (const key of verifyHash) {
            if (!findRandom) {
                findRandom = split.findIndex((e) => e == key)
            } else {
                const findIndex = split.findIndex((e) => e == key)
                const plus = findIndex - findRandom
                const index = plus > alifbo.length ? plus - alifbo.length : plus < 0 ? plus + alifbo.length : plus
                verifySecret += alifbo[index]
            }
        }
        
        return verifySecret
    },
    download(){
      this.$axios({
          method: "GET",
          url: '/license/data-desktop',
          responseType: 'blob'
      }).then(response => {
          this.file = (new Blob([response.data]))
        }).catch(async (err)=>{
          if(err.response.status == 406){
            if(err.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.download()
              }).catch((err)=>{
                console.log(err);
              })
            }
          }
      })
    },
    async loginFunc(data){
      await this.$axios.post((process.env.VUE_APP_BASE_CERTIFICATE || "http://192.168.1.10:1000/") + "login", data).then(async (res) => {
        if (res.status < 300) {
          if (res?.data?.data) {
            this.token = res?.data?.data
            if(res?.data?.step){
              this.step++
            }else{
              this.sendCode()
            }
            const _t = this
            let timer = setInterval(() => {
              _t.time()
              if(this.ntime == 0){
                clearInterval(timer)
                _t.step = 1
                _t.timer = 59
                _t.code = null
                _t.codeExpired = false
              }
            }, 1000);
          }
        } else if (res.status >= 400) {
          this.error = true;
          let _t = this;
          setTimeout(() => {
            _t.error = false;
          }, 5000);
          console.log(res.error);
        }
      }).catch(async (err) => {
        if(err?.response?.status == 401){
          this.error2 = true;
          let _t = this;
          setTimeout(() => {
            _t.error2 = false;
          }, 5000);
        }else if(err?.response?.status == 502){
          this.ercode = 140
          this.error3m = this.$locale['noConnection'][this.$i18n.locale.value];
          this.error3 = true;
          let _t = this;
          setTimeout(() => {
            _t.error3 = false;
          }, 5000);
        }else if(err?.response?.status == 400){
          await this.$axios.post((process.env.VUE_APP_BASE_CERTIFICATE || "http://192.168.1.10:1000/") + "login", data).then(async (res) => {
            if (res.status < 300) {
              if (res?.data?.data) {
                this.token = res?.data?.data
                if(res?.data?.step){
                  this.step++
                }else{
                  this.sendCode()
                }
                const _t = this
                let timer = setInterval(() => {
                  _t.time()
                  if(this.ntime == 0){
                    clearInterval(timer)
                    _t.step = 1
                    _t.timer = 59
                    _t.code = null
                    _t.codeExpired = false
                  }
                }, 1000);
              }
            } else if (res.status >= 400) {
              this.error = true;
              let _t = this;
              setTimeout(() => {
                _t.error = false;
              }, 5000);
              console.log(res.error);
            }
          }).catch((err) => {
            if(err?.response?.status == 401){
              this.error2 = true;
              let _t = this;
              setTimeout(() => {
                _t.error2 = false;
              }, 5000);
            }else if(err?.response?.status == 502){
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
        }
        else{
          this.error3m = err.message;
          this.error3 = true;
          let _t = this;
          setTimeout(() => {
            _t.error3 = false;
          }, 5000);
        }
      });
    },
    async submit() {
      await this.$axios.post((process.env.VUE_APP_BASE_CERTIFICATE || "http://192.168.1.10:1000/") + "handshake", { hash:this.createBigHash(this.makeid(Math.floor(Math.random() * 1000)))}).then((res) => {
        if(res.data.status == 200){
          let f= new FormData()
          f.append('key',this.verifyHash(res?.data?.hash))
          f.append('login',this.username)
          f.append('password',this.password)
          f.append('file',this.file)
          this.loginFunc(f)
        }
      }).catch((err) => {
        if(err?.request?.status < 1){
          this.ercode = 140
          this.error3m = this.$locale['noConnection'][this.$i18n.locale.value];
        }else{
          this.ercode = 126
          this.error3m = err.message;
        }
        this.error3 = true;
        let _t = this;
        setTimeout(() => {
          _t.error3 = false;
        }, 5000);
      });
    },
    modalHide() {
      this.$emit("modalShow", false);
    },
  },
  async mounted() {
    await this.download()
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
  max-height: 450px;
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