import { reactive, readonly } from 'vue';

const checkReq = reactive({
  value: false,
});

const methods = {
  setReq(newval) {
    checkReq.value = newval;
  },
};

// Optionally, if you want to expose a read-only version of the state
const readonlyState = readonly(checkReq);
const checkRequest = {
  checkReq: readonlyState,
  ...methods,
}
export default checkRequest;