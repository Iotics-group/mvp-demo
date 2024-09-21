<template>
  <div ref="login" class="login">
    <div class="login-left">
      <div class="login-left-block">
        <div class="login-left-logo">
          <p>{{ $locale['welcome'][$i18n.locale.value] }}</p>
          <img src="../assets/svg/logo.svg" alt="" />
        </div>
        <div class="login-left-text">
          <p>{{ $locale['navigatorParameters'][$i18n.locale.value] }}</p>
          <div class="login-left-bottom">
            <div class="login-quality">{{ $locale['accounting'][$i18n.locale.value] }},
              {{ $locale['quality'][$i18n.locale.value] }}, {{ $locale['monitoring'][$i18n.locale.value] }}</div>
            <span>
              <b>IoTics</b> — {{ $locale['loginDef'][$i18n.locale.value] }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="login-main">
      <img class="login-bg" src="../assets/Vector.png" alt="" />
      <img class="login-bg bg_2" src="../assets/Vector2.png" alt="" />
      <img class="login-bg bg_3" src="../assets/Vector3.png" alt="" />
      <div class="animation_box"></div>
      <div class="columnbox">
        <div class="login-block__title">
          <h4>{{ $locale['loginSystem'][$i18n.locale.value] }}</h4>
        </div>
        <div class="login-block">
          <div class="login-block__form">
            <div class="login-block__form-flex">
              <div v-if="false">
                <Select maxHeight="300px" :label="$locale['module'][$i18n.locale.value]"
                  :placeholder="$locale['selectModule'][$i18n.locale.value]" @getSelected="getMeter($event)"
                  :options="options" id="modul" />
              </div>
              <div class="form-group">
                <label for="">{{ $locale['login'][$i18n.locale.value] }}</label>
                <input class="effect-2" :placeholder="$locale['enterLogin'][$i18n.locale.value]" @keydown.enter="submit"
                  v-model.trim="username" type="text">
                <span class="span">
                  <Icons icon="human" size="middle" color="#A9A9A9" />
                </span>
                <span class="focus-border"></span>
              </div>
              <div class="form-group">
                <label for="">{{ $locale['password'][$i18n.locale.value] }}</label>
                <input class="effect-2" @keydown.enter="submit" v-model.trim="password"
                  :placeholder="$locale['enterPassword'][$i18n.locale.value]"
                  :type="password_show ? 'password' : 'text'">
                <button @click="password_show = !password_show">
                  <Icons color="#A9A9A9" :icon="password_show ? 'hideEye' : 'showEye'" size="middle" />
                </button>
                <span class="focus-border"></span>
              </div>
            </div>
            <div class="form-btns">
              <button @click="$refs.checkbox.click()">
                <span :class="saveMe ? 'checked' : 'notCheck'"><span v-if="saveMe">&#10003;</span></span>
                <input ref="checkbox" v-show="false" v-model="saveMe" id="saveMe" type="checkbox" />
                <span>{{ $locale['remember'][$i18n.locale.value] }}</span>
              </button>
              <button :disabled="error" @click="submit" class="btn btn-primary">
                {{ $locale['enter'][$i18n.locale.value] }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="notify" :duration="10000">
      <notify @close="error = false" typeModal="error" code="120" v-if="error" />
    </transition>
    <transition name="notify" :duration="10000">
      <notify :text="$locale['userNotFound'][$i18n.locale.value]" @close="error2 = false" typeModal="error" code="121"
        v-if="error2" />
    </transition>
    <transition name="notify" :duration="10000">
      <notify :text="error3m" @close="error3 = false" typeModal="error" :code="(ercode || 122)" v-if="error3" />
    </transition>
    <transition name="modal" :duration="1000">
      <modalBase @modalShow="modalShow" v-if="modalBase" />
    </transition>
  </div>
</template>

<script>
import sidebar from "../assets/sidebar.json";
import Select from "../components/select.vue";
import modalBase from "../components/modals/modalBase.vue";
export default {
  name: 'App',
  data() {
    return {
      password_show: true,
      username: null,
      password: null,
      error3m: this.$locale['somethingWrong'][this.$i18n.locale.value],
      ercode: 122,
      module: 'electricity_meter',
      options: [
        {
          name: this.$locale['electricity_meter'][this.$i18n.locale.value],
          default: 'active',
          classificator: 'electricity_meter',
        },
        {
          name: this.$locale['gas_meter'][this.$i18n.locale.value],
          classificator: 'gas_meter',
        },
        {
          name: this.$locale['water_meter'][this.$i18n.locale.value],
          classificator: 'water_meter',
        },
      ],
      open: false,
      error: false,
      error2: false,
      error3: false,
      saveMe: false,
      openModal: false,
      modalBase: false,
    };
  },
  components: {
    modalBase,
    Select
  },
  methods: {
    getMeter(e) {
      this.module = e
    },
    createBigHash(secret) {
      const alifbo = `оЧjэ$GheRY?0pЖяДт=BaN8ёЯф) ЁgVLyь!]9mГ+IwrзXу[KТЫ@УБЛЪl5ыйf1EЕчЬ:,ОЩФЮQ-k|юHпР7кВAдрDЦХ&ИUxШшъА(ЗvJcжб%вгouЙ^сZi3}nWМPb_C64КztTиSмлO{щdце*н.MЭС/s2FНПхаq`;

      const randomStep = Math.floor(Math.random() * alifbo.length) + 1
      const random = randomStep && randomStep != alifbo.length ? randomStep : 1


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
      for (let i = 0; i < hash.length - findDivison; i++) {
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

    modalShow() {
      this.modalBase = false;
    },
    async loginFunc(data) {
      await this.$axios.post("/login", data).then(async (res) => {
        if (res.status < 300) {
          if (this.saveMe) {
            let data2 = { ...data }
            delete data2.key
            localStorage.setItem("login", JSON.stringify(data2));
          } else {
            localStorage.removeItem("login");
          }
          if (res?.data?.data) {
            localStorage.setItem("refresh", res?.data?.data?.refresh_token);
            localStorage.setItem("session", res?.data?.data?.session);
            // eslint-disable-next-line
            await this.$axios.get("/single").then((res2) => {
              if (res2?.data?.data) {
                sessionStorage.setItem("user_tools", res2?.data?.data.role);
                sessionStorage.setItem("user_info", JSON.stringify({ name: res2?.data?.data.name, id: res2?.data?.data?._id }));
                sessionStorage.setItem("open_folders", JSON.stringify(res2?.data?.data?.open_folders || []))
                sessionStorage.setItem("open_factory", JSON.stringify(res2?.data?.data?.open_factory || []))
                sessionStorage.setItem(
                  "open_page",
                  JSON.stringify(res2?.data?.data?.open_page || [])
                );
                this.$emit("login");
                if (res2?.data?.data.role != "admin") {
                  let pages = res2?.data?.data?.open_page;
                  let newarray = [];
                  sidebar.forEach((res1) => {
                    if (res1.subMenu?.length) {
                      res1.subMenu.forEach((res2) => {
                        newarray.push(res2);
                      });
                    } else {
                      newarray.push(res1);
                    }
                  });
                  let page = newarray.find((w) => {
                    return pages.indexOf(w.classificator) > -1;
                  });
                  this.$router.push({ path: "/" + page?.url });
                } else {
                  this.$router.push({ path: "/server-req" });
                }
              }
            }).catch((err) => {
              console.log(err);
            });
          }
          this.username = null
          this.password = null
        } else if (res.status >= 400) {
          this.error = true;
          let _t = this;
          setTimeout(() => {
            _t.error = false;
          }, 5000);
          console.log(res.error);
        }
      }).catch((err) => {
        if (err?.response?.status == 401) {
          this.error2 = true;
          let _t = this;
          setTimeout(() => {
            _t.error2 = false;
          }, 5000);
        } else if (err?.response?.status == 502) {
          this.ercode = 140
          this.error3m = this.$locale['noConnection'][this.$i18n.locale.value];
          this.error3 = true;
          let _t = this;
          setTimeout(() => {
            _t.error3 = false;
          }, 5000);
        } else {
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
      // if (
      //   this.username == "electron_base_url" &&
      //   this.password == "change_base_url"
      // ) {
      //   this.modalBase = true;
      //   this.username = null
      //   this.password = null
      // } else {
      if (this.module != 'electricity_meter') {
        this.ercode = 130
        this.error3m = this.$locale['moduleError'][this.$i18n.locale.value];
        this.error3 = true;
        let _t = this;
        setTimeout(() => {
          _t.error3 = false;
        }, 5000);
      } else {
        await this.$axios.post("/handshake", { hash: this.createBigHash(this.makeid(Math.floor(Math.random() * 1000))) }).then((res) => {
          if (res.data.status == 200) {
            this.loginFunc({ key: this.verifyHash(res?.data?.hash), username: this.username, password: this.password })
          }
        }).catch((err) => {
          if (err?.request?.status < 1) {
            this.ercode = 140
            this.error3m = this.$locale['noConnection'][this.$i18n.locale.value];
          } else {
            this.ercode = 126
            this.error3m = err.message;
          }
          this.error3 = true;
          let _t = this;
          setTimeout(() => {
            _t.error3 = false;
          }, 5000);
        });
      }
      // }
    },
  },
  mounted() {
    const e = localStorage.getItem('login');
    const a = JSON.parse(e);
    if (a) {
      this.saveMe = true;
      this.username = a.username;
      this.password = a.password;
    }
  },
};
</script>