<template>
    <div v-if="license && dateFilter($license?.license?.value?.deactivation_date) < 10" class="middleware-error">
        <div class="merr-info">
            <p>{{$locale['activationDeadline'][$i18n.locale.value]}} {{dateFilter($license?.license?.value?.deactivation_date)}} {{dates[$i18n.locale.value]}}.</p>
        </div>
        <div v-if="role=='admin' || open_page?.includes('9')" class="merr-reload">
            <p @click="checkPortEmit">{{$locale['goActivation'][$i18n.locale.value]}}</p>
        </div>
    </div>
    <div v-else-if="!license" class="middleware-error">
        <div class="merr-info">
            <p>{{$locale['noLicense'][$i18n.locale.value]}}</p>
        </div>
        <div v-if="role=='admin' || open_page?.includes('9')" class="merr-reload">
            <p @click="checkPortEmit">{{$locale['goActivation'][$i18n.locale.value]}}</p>
        </div>
        <!-- <div class="merr-reload">
            <p @click="checkPortEmit">Перейти к активации</p>
        </div> -->
    </div>
</template>
<script>
export default {
    name: 'middleware-error',
    data(){
        return {
            open_page: [],
            role: 'super',
            timer: 30,
            dates:{ru: "дней", en: "days"},
            interval: null,
        }
    },
    computed:{
        license(){
            return (this.$license?.license?.value ? Object.keys(this.$license?.license?.value)?.length : 0)
        }
    },
    methods:{
        dateFilter(e){
            if(e){
                let date = new Date(e).getTime()
                let newdate = new Date().getTime()
                let counter = ((date - newdate)/86400000).toFixed(0)
                return  counter
            }else{
                return "-"
            }
        },
        checkPortEmit(){
            this.$router.push({path:'/settings',query:{activation:'active'}})
        },
        checkPort(){
            let _t = this
            this.interval = setInterval(()=>{
                _t.timer--
                if (_t.timer==0) {
                    _t.timer = 30
                    _t.$emit('checkPortEmit')
                    // clearTimeout(_t.interval)
                }
            },1000)
        }
    },
    mounted(){
        if(sessionStorage.getItem('open_page')){
            this.open_page = JSON.parse(sessionStorage.getItem('open_page'))
        }
        if(sessionStorage.getItem('user_tools')){
            this.role = sessionStorage.getItem('user_tools')
        }
        this.checkPort()
    }
}
</script>