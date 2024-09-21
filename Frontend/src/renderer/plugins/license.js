import { reactive, readonly } from 'vue';

const license = reactive({
  value: null,
});

const methods = {
  setLic(newUser) {
    license.value = newUser;
  },
};

const readonlyState = readonly(license);
const licenseD = {
  license: readonlyState,
  ...methods,
}
export default licenseD;