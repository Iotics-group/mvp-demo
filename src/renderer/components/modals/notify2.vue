<template>
    <div class="notify" :style="'top:'+((topindex)*180 + 30)+'px;'" :class="journal?.[data?.event]?.type">
        <h4> {{ journal?.[data?.event]?.type_label?.[$i18n.locale.value] }} </h4>
        <div class="notify-block">
            <div class="notify-item"><p> {{$locale['typeEvent'][$i18n.locale.value]}}: </p><span><p> {{ journal?.[data?.event]?.label?.[$i18n.locale.value] }} </p></span></div>
            <div class="notify-item"><p> {{$locale['time'][$i18n.locale.value]}}: </p><span><p> {{ dateFilter2(data?.date) }} </p></span></div>
            <div class="notify-item"><p> {{$locale['meter'][$i18n.locale.value]}}: </p><span><p> {{ data?.meter_name }} </p></span></div>
        </div>
        <icons color="white" @click="$emit('close',data?._id)" icon="closeFilled"/>
    </div>
</template>
<script>
import journalJSON from "../../../../journal.json";  
import icons from '../icons.vue'
import locale from '@/renderer/locale/index.json'
import i18n from '@/renderer/plugins/i18.js';
export default {
    name: 'notify2-modal',
    data() {
        return {
            journal: null,
        }
    },
    methods:{
        dateFilter2(e){
            let date = new Date((e))
            let newdate = ('0'+date.getDate()).slice(-2)+'.'+('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
            let newtime = ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+':'+('0'+date.getSeconds()).slice(-2)
            return  newdate+' - '+newtime
        },
    },
    components: {
        icons
    },
    props:{
        typeModal: String,
        topindex: {
            type: Number,
            default: () => 0,
        },
        data: {
            type: Object,
            default: () => {},
        },
        main: {
            type: String,
            default: () => locale['error'][i18n.locale.value],
        },
        code: {
            type: [Number,String],
            default: () => '126',
        },
        text: {
            type: String,
            default: () => locale['errorLogin'][i18n.locale.value],
        }
    },
    mounted(){
     this.journal = journalJSON
    }
}
</script>