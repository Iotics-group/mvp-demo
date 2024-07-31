<template>
    <div class="notify" :class="typeModal">
        <h4 v-if="typeModal != 'error'"> {{ main }} </h4>
        <h4 v-else> {{ main + ' ' + (code? ('№'+code) : '')}}</h4>
        <p> {{ text }} </p>
        <icons color="white" @click="$emit('close')" icon="closeFilled"/>
    </div>
</template>
<script>
import icons from '../icons.vue'
import locale from '@/renderer/locale/index.json'
import i18n from '@/renderer/plugins/i18.js';
export default {
    name: 'notify-modal',
    components: {
        icons
    },
    props:{
        typeModal: String,
        main: {
            type: String,
            default: () => locale['error'][i18n.locale.value],
        },
        code: {
            type: [String,Number],
            default: () => '126',
        },
        text: {
            type: String,
            default: () => locale['errorLogin'][i18n.locale.value],
        }
    },
}
</script>