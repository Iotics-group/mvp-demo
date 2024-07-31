import { reactive, readonly } from 'vue';

const locale = reactive({
  value: (localStorage.getItem('lang')||'ru'),
});

const methods = {
  setLang(newUser) {
    locale.value = newUser;
  },
};

// Optionally, if you want to expose a read-only version of the state
const readonlyState = readonly(locale);
const i18n = {
    locale: readonlyState,
  ...methods,
}
export default i18n;