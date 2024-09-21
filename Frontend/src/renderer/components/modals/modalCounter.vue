<template>
  <div class="modal">
    <div class="modal-main right">
      <!-- <div class="modal-header">
        <i @click="modalShow" class="icon-close" style="cursor: pointer;">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.7549 22.2459L22.2449 13.7559" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22.2449 22.2459L13.7549 13.7559" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.5 33H22.5C30 33 33 30 33 22.5V13.5C33 6 30 3 22.5 3H13.5C6 3 3 6 3 13.5V22.5C3 30 6 33 13.5 33Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </i>
      </div> -->
      <div class="modal-body">
        <div class="personal_info" v-if="!loading">
          <p class="modal-title">{{$locale['addMeter'][$i18n.locale.value]}}</p> 
          <div class="gradient tabs">
            <button style="cursor: default;" :class="{active: tab == 1}" class="tab">{{$locale['generalData'][$i18n.locale.value]}}</button>
            <button style="cursor: default;" :class="{active: tab == 2}" class="tab">{{$locale['readingParam'][$i18n.locale.value]}}</button>
            <button style="cursor: default;" :class="{active: tab == 3}" class="tab">{{$locale['dataPeriodReq'][$i18n.locale.value]}}</button>
          </div>
          <div class="personal_info" v-show="tab ==1">
            <div class="new-apl-g2">
              <div class="new-apl-file">
                <label for="">{{$locale['nameMeter'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.name" type="text" :placeholder="$locale['enterNameMeter'][$i18n.locale.value]">
              </div>
              <div class="new-apl-file">
                <Select :label="$locale['meterType'][$i18n.locale.value]" :placeholder="$locale['enterMeterType'][$i18n.locale.value]" @getSelected="getMeter($event)" :options="options" id="uspd"/>
              </div>
              <div class="new-apl-file">
                <label for="">{{$locale['factoryNumberMeter'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.number_meter" type="text" :placeholder="$locale['enterFactoryNumber'][$i18n.locale.value]">
              </div>
              <div class="new-apl-file">
                <label for="">{{$locale['connectionAddress'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.connection_address" type="text" :placeholder="$locale['enterConnectionAddress'][$i18n.locale.value]">
              </div>
              <div v-if="!payload_meter?.meter_type || (payload_meter?.meter_type && (payload_meter.meter_type != 'ION_6200')&&(payload_meter.meter_type != 'Sepam_80')&&(payload_meter.meter_type != 'Sepam_40'))" class="new-apl-file">
                <label for="">{{$locale['passwordMeter'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.password" type="text" :placeholder="$locale['enterPasswordMeter'][$i18n.locale.value]">
              </div>
              <div class="new-apl-file">
                <Select :options="options2" @getSelected="getChannel($event)" :placeholder="$locale['selectChannelConnection'][$i18n.locale.value]" :label="$locale['channelConnection'][$i18n.locale.value]" id="tcp"/>
              </div>
              <div v-if="connection_channel == '3'" class="new-apl-file">
                <Select :options="modem_bit" @getSelected="getmodem_bit($event)" :placeholder="$locale['selectTypeModem'][$i18n.locale.value]" :label="$locale['typeModem'][$i18n.locale.value]" id="modem_bit"/>
              </div>
              <div v-if="payload_meter.connection_channel == '1'" class="new-apl-file">
                <label for="">{{$locale['ipAddress'][$i18n.locale.value]}}</label>
                <input :class="{required: ipError}" @input="formatPort" v-model="ip_address" type="text" :placeholder="$locale['enterIpAddress'][$i18n.locale.value]">
              </div>
              <div v-if="((connection_channel=='3') && (type_modem == 'ethernet'))" class="new-apl-file">
                <label for="">{{$locale['ipAddress'][$i18n.locale.value]}}</label>
                <input :class="{required: ipError}" @input="formatPort" v-model="ip_address" type="text" :placeholder="$locale['enterIpAddress'][$i18n.locale.value]">
              </div>
              <div v-if="(payload_meter.connection_channel == '0')||(payload_meter.connection_channel == '2')" class="new-apl-file">
                <Select :options="comlist" @click="getrelist" @getSelected="getComport($event)" :placeholder="$locale['selectComPort'][$i18n.locale.value]" :label="$locale['comPort'][$i18n.locale.value]" id="comlist"/>
              </div>
              <div v-if="((connection_channel=='3') && (type_modem == 'gprs'))" class="new-apl-file">
                <label for="">{{$locale['numberSimCard'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.ip_address" type="text" :placeholder="$locale['enterNumberSimCard'][$i18n.locale.value] + '+998000000000)'">
              </div>
              <div v-if="(payload_meter.connection_channel == '1')||(connection_channel == '3')" class="new-apl-file">
                <label for="">{{$locale['port'][$i18n.locale.value]}}</label>
                <input :class="{required:portError}" v-model="payload_meter.port" type="number" :placeholder="$locale['enterPort'][$i18n.locale.value]">
              </div>
              <div v-if="(payload_meter.connection_channel == '0')||(payload_meter.connection_channel == '2')" class="new-apl-file">
                <Select :bottom="true" :options="baudrates" @getSelected="getBaudrate($event)" :placeholder="$locale['selectBaudrate'][$i18n.locale.value]" :label="$locale['baudrate'][$i18n.locale.value]" id="baudrate"/>
              </div>
              <div v-if="(payload_meter.connection_channel == '0')||(payload_meter.connection_channel == '2')" class="new-apl-file">
                <Select :bottom="true" :options="parity" @getSelected="getparity($event)" :placeholder="$locale['selectParity'][$i18n.locale.value]" :label="$locale['parity'][$i18n.locale.value]" id="parity"/>
              </div>
              <div v-if="(payload_meter.connection_channel == '0')||(payload_meter.connection_channel == '2')" class="new-apl-file">
                <Select :options="stop_bit" @getSelected="getstop_bit($event)" :placeholder="$locale['selectStop_bit'][$i18n.locale.value]" :label="$locale['stop_bit'][$i18n.locale.value]" id="stop_bit"/>
              </div>
              <div v-if="(payload_meter.connection_channel == '0')||(payload_meter.connection_channel == '2')" class="new-apl-file">
                <Select :options="data_bit" @getSelected="getdata_bit($event)" :placeholder="$locale['selectData_bit'][$i18n.locale.value]" :label="$locale['data_bit'][$i18n.locale.value]" id="data_bit"/>
              </div>
              <div v-if="payload_meter.connection_channel == '2'" class="new-apl-file">
                <label for="">{{$locale['modem_command'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.modem_command" type="text" :placeholder="$locale['enterModem_command'][$i18n.locale.value]">
              </div>
              <div v-if="payload_meter.connection_channel == '2'" class="new-apl-file">
                <label for="">{{$locale['numberSimCard'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.modem_phone" type="text" :placeholder="$locale['enterNumberSimCard'][$i18n.locale.value] + 'ATD+998000000000)'">
              </div>
              <div class="new-apl-file">
                <label for="">{{$locale['waiting_time'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.waiting_time" type="number" :placeholder="$locale['enterWaiting_time'][$i18n.locale.value]">
              </div>
              <div class="new-apl-file">
                <label for="">{{$locale['interval_time'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.interval_time" type="number" :placeholder="$locale['enterInterval_time'][$i18n.locale.value]">
              </div>
              <div class="new-apl-file">
                <label for="">{{$locale['pause_time'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.pause_time" type="number" :placeholder="$locale['enterPause_time'][$i18n.locale.value]">
              </div>
              <div class="new-apl-file">
                <label for="">{{$locale['package_size'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.package_size" type="number" :placeholder="$locale['enterPackage_size'][$i18n.locale.value]">
              </div>
              <div class="new-apl-file">
                <label for="">{{$locale['time_difference'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.time_difference" type="number" :placeholder="$locale['enterTime_difference'][$i18n.locale.value]">
              </div>
            </div>
            <span v-if="error" class="required">{{$locale['fillInput'][$i18n.locale.value]}}</span>
            <span v-if="portError" class="required">{{$locale['portAlreadyUsed'][$i18n.locale.value]}}</span>
            <span v-if="ipError" class="required">{{$locale['errorIPadress'][$i18n.locale.value]}}</span>
          </div>
          <div class="uspd-params" v-show="tab==2">
            <div class="g3-uspd h-100" v-if="payload.indicators">
              <div class="uspd-meter-block gradient">
                <p>{{$locale['energy'][$i18n.locale.value]}}</p>
                <button class="checkbtn" @click="checkbtnCheck('energy')"><span :class="energy ?'checked':'notCheck'"><span v-if="energy">&#10003;</span></span> {{$locale['all'][$i18n.locale.value]}}</button>
                <div class="uspd-param-block ml-24">
                  <div class="uspd-param" v-for="el,index in payload.indicators.filter((word) => word.parameter_type == 'energy')" :key="index">
                    <button class="checkbtn energy" :class="el.status == 'active'?'checkedBtn':'notCheckBtn'" @click="(el.status == 'active' ? el.status = 'inactive' : el.status = 'active'),saveParam(el,'energy')">
                      <span :class="el.status == 'active'?'checked':'notCheck'"><span v-if="el.status == 'active'">&#10003;</span></span>
                      <span>{{el?.param_name?.[$i18n.locale.value] || el?.param_name}}</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="uspd-meter-block gradient scroll">
                <p>{{$locale['electroParameter'][$i18n.locale.value]}}</p>
                <button class="checkbtn" @click="checkbtnCheck('electrical_network')"><span :class="electrical_network ?'checked':'notCheck'"><span v-if="electrical_network">&#10003;</span></span> {{$locale['all'][$i18n.locale.value]}}</button>
                <div class="uspd-param-block ml-24">
                  <div class="uspd-param" v-for="el,index in payload.indicators.filter((word) => word.parameter_type == 'electrical_network')" :key="index">
                    <button class="checkbtn electrical_network" :class="el.status == 'active'?'checkedBtn':'notCheckBtn'" @click="(el.status == 'active' ? el.status = 'inactive' : el.status = 'active'),saveParam(el,'electrical_network')">
                      <span :class="el.status == 'active'?'checked':'notCheck'"><span v-if="el.status == 'active'">&#10003;</span></span>
                      <span>{{el?.param_name?.[$i18n.locale.value] || el?.param_name}}</span>
                    </button>
                  </div>
                </div>
              </div>
              <!-- <div class="uspd-meter-block gradient scroll">
                <p>{{$locale['journal'][$i18n.locale.value]}}</p>
                <button class="checkbtn" @click="checkbtnCheck('journal')"><span :class="journal ?'checked':'notCheck'"><span v-if="journal">&#10003;</span></span> {{$locale['all'][$i18n.locale.value]}}</button>
                <div class="uspd-param-block ml-24">
                  <div class="uspd-param" v-for="el,index in payload.indicators.filter((word) => word.parameter_type == 'journal')" :key="index">
                    <button class="checkbtn journal" :class="el.status == 'active'?'checkedBtn':'notCheckBtn'" @click="(el.status == 'active' ? el.status = 'inactive' : el.status = 'active'),saveParam(el,'journal')">
                      <span :class="el.status == 'active'?'checked':'notCheck'"><span v-if="el.status == 'active'">&#10003;</span></span>
                      <span>{{el?.param_name}}</span>
                    </button>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
          <div v-show="tab==3">
            <div class="new-apl-g2">
              <Select :options="options3" @getSelected="getPeriod($event,'period_type')" :label="$locale['periodType'][$i18n.locale.value]" id="uspd1"/>
              
              <div class="new-apl-file">
                <label for="">{{$locale['dataPolling'][$i18n.locale.value]}}</label>
                <input v-model="payload_meter.data_polling_length" type="text" :placeholder="$locale['enterDataPolling'][$i18n.locale.value]">
              </div>
              
              <!-- <div class="new-apl-file">
                <Select :options="options4" @getSelected="getPeriod($event,'data_refresh_length')" label="Частота обновления данных" placeholder="Выберите частоту обновления данных" id="uspd4"/>
              </div> -->
            </div>
            <div class="uspd-ser-req mt-30">
              <div class="uspd-time-block">
                <div class="d-f f-col gap-24">
                  <div class="d-f gap-24">
                    <div class="uspd-ser-mtimer">
                      <p>{{$locale['schedule'][$i18n.locale.value]}}</p>
                      <TimerWeekly :model="active?.days_of_week" :select="select_all_com" @time="setWeek($event)" v-if="payload_meter.period_type == 'weekly'"/>
                      <TimerMonthly :model="active?.days_of_month" :select="select_all_com" @time="setMonth($event)" v-else/>
                    </div>
                  </div>
                  <button @click="selectAll" class="wh-button">{{$locale['selectAll'][$i18n.locale.value]}}</button>
                </div>
                <div class="d-f f-col gap-24">
                  <button @click="selectAllTime(true)" class="wh-button">{{$locale['allowPermanent'][$i18n.locale.value]}}</button>
                  <button @click="selectAllTime(false)" class="red-button">{{$locale['banCompletely'][$i18n.locale.value]}}</button>
                </div>
              </div>
              <div class="uspd-ser-timer">
                <Timer :model="allArrMin" :sat="sat" @time="settime($event)"/>
              </div>
            </div>
          </div>
          <div class="lvl-block-btns">
            <button @click="modalHide" class="red-filled-btn">{{$locale['cancel'][$i18n.locale.value]}}</button>
            <div class="lvl-block-btn">
              <button v-if="tab>1" @click="prevLev" class="blue-btn">{{$locale['prevStep'][$i18n.locale.value]}}</button>
              <button v-if="tab!=3" @click="nextLev" class="blue-filled-btn">{{$locale['nextStep'][$i18n.locale.value]}}</button>
              <button v-if="tab==3" @click="submit" class="blue-filled-btn">{{$locale['add'][$i18n.locale.value]}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>
<script>
import Select from '../select.vue'
import Timer from '../timer.vue'
import TimerMonthly from '../timerMonthly.vue'
import TimerWeekly from '../timerWeekly.vue'
export default {
  data() {
    return {
      sat: null,
      ip_address: null,
      payload_meter: {
        name: null,
        number_meter: null,
        hours_of_day: [],
        ip_address: null,
        parameters:[]
      },
      tab: 1,
      portError: false,
      loading: false,
      energy: false,
      electrical_network: false,
      connection_channel: null,
      type_modem: null,
      modem_phone: null,
      journal: false,
      select_all: false,
      error: false,
      ipError: false,
      payload: {},
      resdata: null,
      indicators:[],
      options: [],
      modem_bit: [
          {
              "classificator": "ethernet",
              "name": "Ethernet",
          },
          {
              "classificator": "gprs",
              "name": "GPRS",
          },
      ],
      options2: [
          {
              "classificator": "0",
              "name": "COM - RS485/RS232",
          },
          {
              "classificator": "1",
              "name": this.$locale['tcpClient'][this.$i18n.locale.value],
          },
          {
              "classificator": "2",
              "name": "Modem",
          },
          {
              "classificator": "3",
              "name": this.$locale['tcpServer'][this.$i18n.locale.value],
          },
      ],
      options3: [
          {
              "classificator": "monthly",
              default: "active",
              "name": this.$locale['monthly'][this.$i18n.locale.value],
          },
          {
              "classificator": "weekly",
              "name": this.$locale['weekly'][this.$i18n.locale.value],
          },
      ],
      options4: [
          {
            "classificator": '5',
            "name": "5 секунд",
          },
          {
            "classificator": '10',
            "name": "10 секунд",
          },
          {
            "classificator": '20',
            "name": "20 секунд",
          },
          {
            "classificator": '30',
            "name": "30 секунд",
          },
          {
            "classificator": '60',
            "name": "1 минута",
          },
          {
            "classificator": '120',
            "name": "2 минута",
          },
          {
            "classificator": '180',
            "name": "3 минута",
          },
          {
            "classificator": '300',
            "name": "5 минута",
          },
          {
            "classificator": '600',
            "name": "10 минута",
          },
          {
            "classificator": '1800',
            "name": "30 минута",
          },
          {
            "classificator": '3600',
            "name": "1 час",
          },
      ],
      comlist: [],
      baudrates:[
        {name:'300',classificator:300},
        {name:'600',classificator:600},
        {name:'1200',classificator:1200},
        {name:'2400',classificator:2400},
        {name:'4800',classificator:4800},
        {name:'9600',classificator:9600},
        {name:'14400',classificator:14400},
        {name:'19200',classificator:19200},
        {name:'38400',classificator:38400},
        {name:'57600',classificator:57600},
        {name:'115200',classificator:115200},
      ],
      parity:[
        {name:this.$locale['parityEven'][this.$i18n.locale.value],classificator:'even'},
        {name:this.$locale['parityNone'][this.$i18n.locale.value],classificator:'none'},
        {name:this.$locale['parityMark'][this.$i18n.locale.value],classificator:'mark'},
        {name:this.$locale['parityOdd'][this.$i18n.locale.value],classificator:'odd'},
        {name:this.$locale['paritySpace'][this.$i18n.locale.value],classificator:'space'},
      ],
      stop_bit:[
        {name:'1',classificator:1},
        {name:'2',classificator:2},
        {name:'3',classificator:3},
      ],
      data_bit:[
        {name:'6',classificator:6},
        {name:'7',classificator:7},
        {name:'8',classificator:8},
      ],
      allArrMin: []
    }
  },
  components: {
    // Icons,
    TimerMonthly,
    TimerWeekly,
    Select,
    Timer
  },
  props:{
    idx: String,
    active: Object
  },
  computed:{
    select_all_com(){
      return this.select_all
    }
  },
  methods: {
    getrelist(){
      this.comlist = []
      if(!this.comlist.length){
        this.$axios.get('/meter/port-list').then((res)=>{
          res?.data?.data?.forEach((el)=>{
            if(el.path != 'COM1'){
              this.comlist.push({name:el.friendlyName,classificator:el.path})
            }
          })
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.$axios.get('/meter/port-list').then((res)=>{
                  res?.data?.data?.forEach((el)=>{
                    this.comlist.push({name:el.friendlyName,classificator:el.path})
                  })
                }).catch((err)=>{
                  console.log(err);
                })
              }).catch((err)=>{
                console.log(err);
              })
            }
          }
        })
      }
    },
    formatPort(e) {
      var ipv4Pattern = /^(?!.*\.{4,})(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      var trueType = /^[0-9.]+$/
      if((this.ip_address?.split('')?.length <= 15)&&trueType.test(this.ip_address)){
        let na = this.ip_address.split('')
        if((e?.data != null)&&(na?.length < 15)) {
          if((na?.length == 3)&&(!(na.includes('.')))){
            this.ip_address = this.ip_address+'.'
          }
          if((na?.length > 4)&&((na?.length - this.ip_address.lastIndexOf("."))==4)&&(((this.ip_address.match(/\./g) || []).length)<3)){
            this.ip_address = this.ip_address+'.'
          }
          this.ip_address = this.ip_address?.replace(/\.{2,}/g, '.')
          var dotCount = (this.ip_address.match(/\./g) || []).length;
          if (dotCount > 3) {
            if (this.ip_address.slice(-1) === '.') {
              this.ip_address = this.ip_address.slice(0, -1);
            }
          }
        }
        if (ipv4Pattern.test(this.ip_address)) {
          this.payload_meter.ip_address = this.ip_address
          this.ipError = false
        }else{
          if ((this.payload_meter.connection_channel == '1')||(this.payload_meter.connection_channel == '3')) {
            this.payload_meter.ip_address = null
            this.ipError = true
          }else{
            this.ipError = false
          }
        }
      }else{
        this.ip_address = this.ip_address?.slice(0, -1)
      }
    },
    checkbtnCheck(classNm){
      let w = document.getElementsByClassName(classNm);
      for(let i=0;i<w.length;i++){
        if(!w[i].classList?.contains('checkedBtn')){
          this[classNm] = true
          w[i].click()
        }
      }
      
      // if(classNm){
      //   this[classNm] = !this.payload.indicators.filter((word) => word.parameter_type == classNm).some(value => { return value.status == 'inactive' })
      // }
    },
    selectAllTime(e){
      this.sat = e
      // this.select_all = e
    },
    getparity(e){
      this.payload_meter.parity = e
    },
    getdata_bit(e){
      this.payload_meter.data_bit = e
    },
    getmodem_bit(e){
      this.type_modem = e
      if(e=='gprs'){
        this.payload_meter.connection_channel = '4'
      }else if(e=='ethernet'){
        this.payload_meter.connection_channel = '3'
      }
      if(!this.active?.ip_address){
        this.payload_meter.ip_address = null
        this.ip_address = null
      }
    },
    getstop_bit(e){
      this.payload_meter.stop_bit = e
    },
    getComport(e){
      this.payload_meter.comport = e
    },
    getBaudrate(e){
      this.payload_meter.baud_rate = e
    },
    getPeriod(e,type){
      this.payload_meter[type] = e
    },
    async getMeter(e){
      await this.$axios.get("/meter/params/"+e).then((res)=>{
        this.payload_meter.meter_type = e
        this.resdata = res?.data?.data
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.getMeter(e)
            }).catch((err)=>{
              console.log(err);
            })
          }
        }
      })
      
      this.payload.indicators = []
      this.payload.indicators = this.resdata?.indicators_block
      this.indicators = this.resdata?.indicators
      
      if(this.active){
        await this.payload.indicators?.forEach((element,index) => {
          this.active?.params?.forEach(element2 => {
            element2.status = 'active'
              if(element.channel_full_id == element2.channel_full_id){
                this.payload.indicators[index].status = element2?.status
              }
            });
          this.saveParam(element,element?.parameter_type)
        });
      }
    },
    saveParam(e,classNm){
      this.payload_meter.parameters = []
      this.indicators.forEach((el,index)=>{
        var lastIndex = el?.channel_full_id?.lastIndexOf('.')
        if(e?.channel_full_id == el.channel_full_id?.substring(0, lastIndex)){
          this.indicators[index].status = e?.status
        }
      })
      if(classNm){
        this[classNm] = !this.payload.indicators.filter((word) => word.parameter_type == classNm).some(value => { return value.status == 'inactive' })
      }
      this.payload_meter.parameters = this.indicators
    },
    getChannel(e){
      if(e != 3){
        this.payload_meter.connection_channel = e
      }
      this.connection_channel = e
      this.formatPort()
    },
    selectAll(){
      this.select_all = !this.select_all
    },
    setMonth(e){
      this.payload_meter.days_of_month = e
    },
    setWeek(e){
      this.payload_meter.days_of_week = e
    },
    settime(e){
      this.payload_meter.hours_of_day = e
    },
    prevLev(){
      this.tab--
    },
    nextLev(){
      if(this.payload_meter?.meter_type && (this.payload_meter.meter_type == 'ION_6200')||(this.payload_meter.meter_type == 'Sepam_80')||(this.payload_meter.meter_type == 'Sepam_40')){
        this.payload_meter.password = '00000000'
      }
      if(this.tab==1){
        if( this.payload_meter.name && 
        this.payload_meter.meter_type && 
        this.payload_meter.number_meter && 
        this.payload_meter.password && 
        this.payload_meter.connection_address && 
        this.payload_meter.connection_channel) {
          if(this.payload_meter.connection_channel == '1' && 
            this.payload_meter.ip_address && 
            this.payload_meter.port){
            this.tab++
          }else if(((this.payload_meter.connection_channel == '3')||(this.payload_meter.connection_channel == '4')) && 
            this.payload_meter.ip_address && 
            this.payload_meter.port){
              this.portError = false
              this.$axios.get('/port/'+this.payload_meter.port).then(()=>{
                this.portError = true
              }).catch(async (error)=>{
                const statusCode = (error.response || {}).status || -1;
                if (statusCode == 406) {
                  if(error.config.method == 'get'){
                    await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                      localStorage.setItem('session',res?.data?.session)
                      await this.$axios.get('/port/'+this.payload_meter.port).then(()=>{
                        this.portError = true
                      }).catch((err)=>{
                        const status = (err.response || {}).status || -1;
                        if(status == 404){
                          this.tab++
                        }
                      })
                    }).catch((err)=>{
                      console.log(err);
                    })
                  }
                }else if(statusCode == 404){
                  this.tab++
                }
              })
          }else if(this.payload_meter.connection_channel == '0' && 
            this.payload_meter.comport && 
            this.payload_meter.baud_rate && 
            this.payload_meter.stop_bit && 
            this.payload_meter.password && 
            this.payload_meter.data_bit && 
            this.payload_meter.parity){
            this.tab++
          }else if(this.payload_meter.connection_channel == '2' && 
            this.payload_meter.comport && 
            this.payload_meter.baud_rate && 
            this.payload_meter.stop_bit && 
            this.payload_meter.data_bit && 
            this.payload_meter.password && 
            this.payload_meter.modem_command && 
            this.payload_meter.modem_phone && 
            this.payload_meter.parity){
            this.tab++
          }else{
            this.error = true
          }
        }else{
          this.error = true
        }
      }else{
        this.tab++
      }
    },
    async submit(){
      for (let key in this.payload_meter) {
        if ((this.payload_meter[key] === '')||(this.payload_meter[key] === null)) {
          delete this.payload_meter[key];
        }
      }
      delete this.payload_meter?.status
      delete this.payload_meter?.parameterIds
      delete this.payload_meter?.__v
      delete this.payload_meter?.protokol
      delete this.payload_meter?.params
      
      if(this.payload_meter.period_type == 'monthly'){
        delete this.payload_meter.days_of_week
      }else{
        delete this.payload_meter.days_of_month
      }
      this.payload_meter.id = this.idx
      this.payload_meter.parameters = this.indicators
      const data = JSON.stringify({...this.payload_meter,meter_form:"meter"})
      let requestName = '/meter/create';
      if(this.payload_meter._id){
        requestName = '/meter/update/'+this.payload_meter._id;
      }
      if((this.payload_meter.connection_channel == '0')||(this.payload_meter.connection_channel == '2')){
        delete this.payload_meter.ip_address
        delete this.payload_meter.port
        requestName = '/meter/create-com';
        if(this.payload_meter._id){
          requestName = '/meter/update-com/'+this.payload_meter._id;
        }
      }
      if(this.payload_meter.connection_channel == '1'){
        delete this.payload_meter.comport
        delete this.payload_meter.baud_rate
        delete this.payload_meter.stop_bit
        delete this.payload_meter.data_bit
        delete this.payload_meter.parity
      }
      await this.$axios[this.payload_meter._id ? 'patch' : 'post'](requestName, JSON.parse(data)).then((res) => {
        if(res){
          this.modalHide()
          this.$emit('response',res)
        }
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if((error.config.method == 'post')||(error.config.method == 'patch')){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              const data = JSON.stringify({...this.payload_meter,meter_form:"meter"})
              await this.$axios[this.payload_meter._id ? 'patch' : 'post'](requestName, JSON.parse(data)).then((res) => {
                if(res) {
                  this.modalHide()
                  this.$emit('response',res)
                }
              }).catch((err)=>{
                this.$emit('response',err)
              })
            }).catch((err)=>{
              this.$emit('response',err)
            })
          }else{
            this.$emit('response',error)
          }
        }
      })
    },
    modalHide() {
      this.$emit("modalShow", false);
    },
  },
  async mounted(){
    this.loading = true
    this.comlist = []
    await this.$axios.get('/meter/port-list').then((res)=>{
      res?.data?.data?.forEach((el)=>{
        if(el.path != 'COM1'){
          this.comlist.push({name:el.friendlyName,classificator:el.path})
        }
      })
    }).catch(async (error)=>{
      const statusCode = (error.response || {}).status || -1;
      if (statusCode == 406) {
        if(error.config.method == 'get'){
          await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
            localStorage.setItem('session',res?.data?.session)
            await this.$axios.get('/meter/port-list').then((res)=>{
              res?.data?.data?.forEach((el)=>{
                this.comlist.push({name:el.friendlyName,classificator:el.path})
              })
            }).catch((err)=>{
              console.log(err);
            })
          }).catch((err)=>{
            console.log(err);
          })
        }
      }
    })
    await this.$axios.get('/meter/meter-list').then((res)=>{
      if(res?.data?.data){
        this.options = []
        Object.keys(res?.data?.data).map(el=>{
          if(el == this.active?.meter_type){
            this.options.push({name:res?.data?.data[el],classificator:el,default: 'active'})
          }else{
            this.options.push({name:res?.data?.data[el],classificator:el})
          }
        })
      }
    }).catch(async (error)=>{
      const statusCode = (error.response || {}).status || -1;
      if (statusCode == 406) {
        if(error.config.method == 'get'){
          await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
            localStorage.setItem('session',res?.data?.session)
            await this.$axios.get('/meter/meter-list').then((res)=>{
              if(res?.data?.data){
                this.options = []
                Object.keys(res?.data?.data).map(el=>{
                  if(el == this.active?.meter_type){
                    this.options.push({name:res?.data?.data[el],classificator:el,default: 'active'})
                  }else{
                    this.options.push({name:res?.data?.data[el],classificator:el})
                  }
                })
              }
            }).catch((err)=>{
              console.log(err);
            })
          }).catch((err)=>{
            console.log(err);
          })
        }
      }
    })
    if(this.active){
      this.payload_meter = this.active
      this.baudrates?.forEach((element,index) => {
        if(element?.classificator == this.active?.baud_rate)
        this.baudrates[index].default = 'active'
      });
      this.data_bit?.forEach((element,index) => {
        if(element?.classificator == this.active?.data_bit)
        this.data_bit[index].default = 'active'
      });
      this.stop_bit?.forEach((element,index) => {
        if(element?.classificator == this.active?.stop_bit)
        this.stop_bit[index].default = 'active'
      });
      this.parity?.forEach((element,index) => {
        if(element?.classificator == this.active?.parity)
        this.parity[index].default = 'active'
      });
      this.comlist?.forEach((element,index) => {
        if(element?.classificator == this.active?.comport)
        this.comlist[index].default = 'active'
      });
      this.ip_address = this.active?.ip_address
      this.allArrMin = []
      this.active?.hours_of_day?.forEach((res)=>{
        res?.minutes?.forEach((res2)=>{
          this.allArrMin.push((('0'+res?.hour).slice(-2) + ':' + ('0'+res2).slice(-2)))
        })
      })
    }
    this.options2?.forEach((el)=>{
      if(el.classificator == this.active?.connection_channel){
        el.default = 'active'
      }
    })
    if(this.active?.period_type == 'weekly'){
      delete this.options3[0].default
      this.options3[1].default = 'active'
    }
    if(this.active?.connection_channel == '4'){
      this.options2[3].default = 'active'
      this.modem_bit[1].default = 'active'
    }else if(this.active?.connection_channel == '3'){
      this.modem_bit[0].default = 'active'
    }
    this.loading = false
  }
};
</script>
<style scoped>
.personal_info{
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 100%;
}
.modal {
  z-index: 10000;
  position: fixed;
  background: #010D1D80;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
}
.modal-main {
  width: calc(100% - 120px);
  height: calc(100% - 40px);
  border-radius: 0 0 0 100px;
  background: white;
  padding: 12px 20px;
  position: relative;
}
.modal-title {
  font-weight: 400;
  font-size: 24px;
  line-height: 150%;
  text-align: center;
  min-height: 48px;
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
  gap: 20px;
  justify-content: space-between;
}
</style>