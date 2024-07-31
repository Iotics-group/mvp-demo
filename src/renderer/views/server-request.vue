<template>
  <div class="wrapper">
    <div class="header">
      <h3>{{$locale['server_req'][$i18n.locale.value]}}</h3>
      <div class="breadcrumbs">
        <p>{{$locale['server_req'][$i18n.locale.value]}}</p>
      </div>
    </div>
    <div id="server" class="server">
      <div class="e-model empanel">
        <div class="model-block" @click="unFocus">
          <div v-if="model" class="server-header">
            <div class="server-header-info">
              <p>{{$locale['dateTimeLastRequest'][$i18n.locale.value]}}</p>
              <span>{{dateFilter(res_date.last)}}</span>
            </div>
            <div class="server-header-info">
              <p>{{$locale['dateTimeLastArchiveReq'][$i18n.locale.value]}}</p>
              <span>{{dateFilter(res_date.archive)}}</span>
            </div>
            <div class="server-header-info">
              <p>{{$locale['dateTimeLastCurrentReq'][$i18n.locale.value]}}</p>
              <span>{{dateFilter(res_date.current)}}</span>
            </div>
          </div>
          <div v-else class="server-header">
            <div class="server-header-info">
              <p>{{$locale['meterCount'][$i18n.locale.value]}}</p>
              <span>{{((activeFolder?.meters != undefined) && (activeFolder?.meters != null)) ? activeFolder?.meters : '-'}}</span>
            </div>
            <div class="server-header-info">
              <p>{{$locale['requestableMeter'][$i18n.locale.value]}}</p>
              <span>{{((activeFolder?.succeed != undefined) && (activeFolder?.succeed != null)) ? activeFolder?.succeed : '-'}}</span>
            </div>
            <div class="server-header-info">
              <p>{{$locale['unrequestableMeter'][$i18n.locale.value]}}</p>
              <span>{{((activeFolder?.failed != undefined) && (activeFolder?.failed != null)) ? activeFolder?.failed : '-'}}</span>
            </div>
          </div>
          <div class="wrl">
            <div class="apx-tex">
              <p>{{$locale['arch'][$i18n.locale.value]}}.</p>
              <p>{{$locale['cur'][$i18n.locale.value]}}.</p>
              <p>{{$locale['el'][$i18n.locale.value]}}.</p>
            </div>
            <div class="wrapblock tree-emodel mt-30">
              <div class="beforeB" :style="div ? ('height:'+(div)+'px') : ''">
                <div class="beforeFLB" :style="'top:'+(64*(index)+21) + 'px;'" v-for="el,index in beforeFLBValue" :key="index"></div>
              </div>
              <div id="emodel1" class="model-div">
                <ul class="tree-menu">
                  <TreeParentFiles :beforeFLBValue="beforeFLBValue" accessEmits="getId,activeParam,model" @click.stop="getH" @activeParam="activeParam($event)" @getId="getId($event)" @model="getModel($event)" v-for="(item,index) in data" :key="index" class="tree-item" :arrSuccSend="arrSuccSend" :model="item"></TreeParentFiles>
                </ul>
              </div>
            </div>
          </div>
          <div class="model-btn">
            <button v-if="(user_tools == 'admin')" @click="newObj">{{$locale['newObject'][$i18n.locale.value]}}</button>
          </div>
        </div>
        <div class="model-block gradient">
          <div class="model-div h-100">
            <div class="model-voltage-gis">
              <h1>{{$locale['generalInformation'][$i18n.locale.value]}}</h1>
            </div>
            <div v-show="model" class="tabs mt-30">
              <button @click="tab = 1" :class="{active: tab == 1}" class="tab">{{$locale['generalData'][$i18n.locale.value]}}</button>
              <button @click="tab = 2" :class="{active: tab == 2}" class="tab">{{$locale['readingParam'][$i18n.locale.value]}}</button>
              <button @click="tab = 3" :class="{active: tab == 3}" class="tab">{{$locale['dataPeriodReq'][$i18n.locale.value]}}</button>
            </div>
            <div class="server-req-files">
              <div class="all-info-files scroll" v-show="tab==1">
                <!-- <div class="all-info-file" v-for="el,index in files" :key="index">
                  <p class="label">{{el?.title}}</p>
                  <span> {{ el?.text }} </span>
                </div> -->
                <div v-if="model?.name" class="all-info-file">
                  <p class="label">{{$locale['nameOfTheProperty'][$i18n.locale.value]}}</p>
                  <span> {{ model?.name }} </span>
                </div>
                <div v-if="model?.meter_type" class="all-info-file">
                  <p class="label">{{$locale['meterType'][$i18n.locale.value]}}</p>
                  <span> {{ options[model?.meter_type] }} </span>
                </div>
                <div v-if="model?.connection_address" class="all-info-file">
                  <p class="label">{{$locale['connectionAddress'][$i18n.locale.value]}}</p>
                  <span> {{ model?.connection_address }} </span>
                </div>
                <div v-if="model?.number_meter" class="all-info-file">
                  <p class="label">{{$locale['factoryNumberMeter'][$i18n.locale.value]}}</p>
                  <span> {{ model?.number_meter }} </span>
                </div>
                <div v-if="model?.connection_channel" class="all-info-file">
                  <p class="label">{{$locale['channelConnection'][$i18n.locale.value]}}</p>
                  <span> {{ connection_channel?.[model?.connection_channel] || '-' }} </span>
                </div>
                <div v-if="model?.connection_channel == 3" class="all-info-file">
                  <p class="label">{{$locale['typeModem'][$i18n.locale.value]}}</p>
                  <span> Ethernet </span>
                </div>
                <div v-if="model?.connection_channel == 4" class="all-info-file">
                  <p class="label">{{$locale['typeModem'][$i18n.locale.value]}}</p>
                  <span> GPRS </span>
                </div>
                <div v-if="model?.password" class="all-info-file">
                  <p class="label">{{$locale['passwordMeter'][$i18n.locale.value]}}</p>
                  <span> {{ model?.password }} </span>
                </div>
                <div v-if="model?.ip_address && (model?.connection_channel != 4)" class="all-info-file">
                  <p class="label">{{$locale['ipAddress'][$i18n.locale.value]}}</p>
                  <span> {{ model?.ip_address }} </span>
                </div>
                <div v-if="model?.baud_rate && (model?.connection_channel == 2)" class="all-info-file">
                  <p class="label">{{$locale['baudrate'][$i18n.locale.value]}}</p>
                  <span> {{ model?.baud_rate }} </span>
                </div>
                <div v-if="model?.parity && (model?.connection_channel == 2)" class="all-info-file">
                  <p class="label">{{$locale['parity'][$i18n.locale.value]}}</p>
                  <span> {{ model?.parity }} </span>
                </div>
                <div v-if="model?.stop_bit && (model?.connection_channel == 2)" class="all-info-file">
                  <p class="label">{{$locale['stop_bit'][$i18n.locale.value]}}</p>
                  <span> {{ model?.stop_bit }} </span>
                </div>
                <div v-if="model?.data_bit && (model?.connection_channel == 2)" class="all-info-file">
                  <p class="label">{{$locale['data_bit'][$i18n.locale.value]}}</p>
                  <span> {{ model?.data_bit }} </span>
                </div>
                <div v-if="model?.modem_command && (model?.connection_channel == 2)" class="all-info-file">
                  <p class="label">{{$locale['modem_command'][$i18n.locale.value]}}</p>
                  <span> {{ model?.modem_command }} </span>
                </div>
                <div v-if="model?.modem_phone && (model?.connection_channel == 2)" class="all-info-file">
                  <p class="label">{{$locale['numberSimCard'][$i18n.locale.value]}}</p>
                  <span> {{ model?.modem_phone }} </span>
                </div>
                <div v-if="model?.ip_address && (model?.connection_channel == 4)" class="all-info-file">
                  <p class="label">{{$locale['numberSimCard'][$i18n.locale.value]}}</p>
                  <span> {{ model?.ip_address }} </span>
                </div>
                <div v-if="model?.port" class="all-info-file">
                  <p class="label">{{$locale['port'][$i18n.locale.value]}}</p>
                  <span> {{ model?.port }} </span>
                </div>
                <div v-if="model?.waiting_time" class="all-info-file">
                  <p class="label">{{$locale['waiting_time'][$i18n.locale.value]}}</p>
                  <span> {{ model?.waiting_time }} </span>
                </div>
                <div v-if="model?.interval_time" class="all-info-file">
                  <p class="label">{{$locale['interval_time'][$i18n.locale.value]}}</p>
                  <span> {{ model?.interval_time }} </span>
                </div>
                <!-- <div v-if="model?.status" class="all-info-file">
                  <p class="label">Статус</p>
                  <span> {{ model?.status == 'active' ? 'Актив' : 'Неактив' }} </span>
                </div> -->
                <div v-if="model?.pause_time" class="all-info-file">
                  <p class="label">{{$locale['pause_time'][$i18n.locale.value]}}</p>
                  <span> {{ model?.pause_time }} </span>
                </div>
                <div v-if="model?.package_size" class="all-info-file">
                  <p class="label">{{$locale['package_size'][$i18n.locale.value]}}</p>
                  <span> {{ model?.package_size }} </span>
                </div>
                <div v-if="model?.time_difference" class="all-info-file">
                  <p class="label">{{$locale['time_difference'][$i18n.locale.value]}}</p>
                  <span> {{ model?.time_difference }} </span>
                </div>
              </div>
              <div class="all-info-files scroll" v-show="tab==2">
                <div class="all-info-params">
                  <div v-if="(model?.params?.filter((word) => word.parameter_type == 'energy'))?.length" class="all-info-param-block">
                    <p>{{$locale['energy'][$i18n.locale.value]}}</p>
                    <div class="all-info-param">
                      <span v-for="el,index in model?.params?.filter((word) => word.parameter_type == 'energy')" :key="index">{{el?.param_name?.[$i18n.locale.value] || el?.param_name}}</span>
                    </div>
                  </div>
                  <div v-if="(model?.params?.filter((word) => word.parameter_type == 'electrical_network'))?.length" class="all-info-param-block">
                    <p>{{$locale['electroParameter'][$i18n.locale.value]}}</p>
                    <div class="all-info-param">
                      <span v-for="el,index in model?.params?.filter((word) => word.parameter_type == 'electrical_network')" :key="index">{{el?.param_name?.[$i18n.locale.value] || el?.param_name}}</span>
                    </div>
                  </div>
                  <!-- <div v-if="(model?.params.filter((word) => word.parameter_type == 'journal'))?.length" class="all-info-param-block">
                    <p>Журнал событий</p>
                    <div class="all-info-param">
                      <span v-for="el,index in model?.params.filter((word) => word.parameter_type == 'journal')" :key="index">{{el?.param_name}}</span>
                    </div>
                  </div> -->
                </div>
              </div>
              <div class="all-info-files scroll" v-show="tab==3">
                <div class="all-info-file" v-if="model">
                  <div class="d-f gap-24">
                    <div v-if="model?.period_type == 'monthly'" class="timerMon">
                      <p class="label">{{$locale['allowedPeriodRequests'][$i18n.locale.value]}} </p>
                      <timerMon :editable="false" :model="model?.days_of_month"/>
                    </div>
                    <div v-else class="timerWeek">
                      <p class="label">{{$locale['allowedPeriodRequests'][$i18n.locale.value]}}</p>
                      <timerWeek :editable="false" :model="model?.days_of_week"/>
                    </div>
                    <div class="d-f f-col gap-10 w-100">
                      <div v-if="model?.period_type" class="all-info-file">
                        <p class="label">{{$locale['periodType'][$i18n.locale.value]}}</p>
                        <span> {{ model?.period_type == 'monthly' ? $locale['monthly'][$i18n.locale.value] : $locale['weekly'][$i18n.locale.value] }} </span>
                      </div>
                      <div v-if="model?.data_polling_length" class="all-info-file">
                        <p class="label">{{$locale['dataPolling'][$i18n.locale.value]}}</p>
                        <span> {{ model?.data_polling_length }} </span>
                      </div>
                      <!-- <div v-if="model?.data_refresh_length" class="all-info-file">
                        <p class="label">Частота обновления данных</p>
                        <span> {{ model?.data_refresh_length }} </span>
                      </div> -->
                    </div>
                  </div>
                </div>
                <div class="all-info-file" v-if="model">
                  <p class="label">{{$locale['allowedPeriodRequests'][$i18n.locale.value]}}</p>
                  <timer v-if="allArrMin.length && settimer" :editable="false" :model="allArrMin"/>
                </div>
              </div>
            </div>
          </div>
          <div class="model-btn" v-if="this.active?.meter">
            <button v-if="canHandleReq" @click="openHandleRequest">{{$locale['handleReq'][$i18n.locale.value]}}</button>
            <button v-if="(user_tools == 'admin')" class="bg-tr" @click="editCounter">{{$locale['edit'][$i18n.locale.value]}}</button>
          </div>
        </div>
      </div>
    </div>
    <transition name="modal" :duration="600">
      <modalHandleRequest :active="active" @modalShow="modalShow('handleRequest')" v-if="handleRequest"/>
    </transition>
    <transition name="modal" :duration="600">
      <modalFile :active="active" :idx="idx" @modalShow="modalShow('fileShow')" v-if="fileShow"/>
    </transition>
    <transition name="modal" :duration="600">
      <modalRemove :idx="idx" :data="{objType:objType,active:this.active,activeFolder:this.activeFolder}" @modalShow="modalShow('remove')" v-if="remove"/>
    </transition>
    <transition name="modal" :duration="600">
      <modalCounter :active="model" :idx="idx" @modalShow="modalShow('counterShow')" @response="setstatus($event)" v-if="counterShow"/>
    </transition>
    
    <transition name="notify" :duration="10000">
      <notify :main="$locale['successfully'][$i18n.locale.value]" :text="$locale['meterAddedSuccessfully'][$i18n.locale.value]" @close="success=false" typeModal="success" v-if="success"/>
    </transition>
    <transition name="notify" :duration="10000">
      <notify :main="$locale['error'][$i18n.locale.value]" :text="wrongM" @close="wrong=false" typeModal="error" v-if="wrong"/>
    </transition>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron';
import TreeParentFiles from '../components/menu/TreeParentFiles.vue';
import modalFile from '../components/modals/modalFile.vue';
import modalHandleRequest from '../components/modals/modalHandleRequest.vue';
import timer from '../components/timer.vue';
import timerMon from '../components/timerMonthly.vue';
import timerWeek from '../components/timerWeekly.vue';
import modalRemove from '../components/modals/modalRemove.vue';
import modalCounter from '../components/modals/modalCounter.vue';
import eventNames from '@/universal/eventNames.js';
// import { SerialPort } from 'serialport'
export default {
  name: 'server-req',
  data() {
    return {
      user_tools: 'super',
      open: false,
      handleRequest: false,
      canHandleReq: false,
      success: false,
      div: null,
      wrongM: this.$locale['somethingWrong'][this.$i18n.locale.value],
      wrong: false,
      settimer: false,
      arrow: `
        <svg class="svg" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.95998 4.47501L6.69998 7.73501C6.31498 8.12001 5.68498 8.12001 5.29998 7.73501L2.03998 4.47501" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
      toggle: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 12.5L11.5 14L15.5 10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="0.5" y="0.5" width="23" height="23" rx="4.5" stroke="white"/></svg>',
      data: [],
      data2: [],
      arrSuccSend: new Map(),
      active: null,
      tab: 1,
      openDate: null,
      openDateV: null,
      activeFolder: null,
      res_date: {
        archive: null,
        current: null,
        last: null,
      },
      beforeFLBValue: 0,
      size: 0,
      allArrMin: [],
      id: null,
      timeout: false,
      interval: null,
      idx: null,
      model: null,
      fileShow: false,
      // uspdShow: false,
      options: null,
      counterShow: false,
      connection_channel: ["COM - RS485/RS232",this.$locale['tcpClient'][this.$i18n.locale.value],"Modem",this.$locale['tcpServer'][this.$i18n.locale.value]],
      objType: null,
      remove: false
    };
  },
  components:{
    TreeParentFiles,
    modalFile,
    timer,
    timerMon,
    timerWeek,
    modalRemove,
    modalHandleRequest,
    modalCounter
  },
  watch:{
    tab(){
      if(this.tab == 3){
        const t = this
        setTimeout(() => {
          t.settimer = true
        }, 100);
      }
    }
  },
  methods: {
    openHandleRequest(){
      this.handleRequest = !this.handleRequest
    },
    editCounter(){
      if(this.active?.meter){
        this.idx = this.active?.meter
        this.counterShow = !this.counterShow
      }
    },
    newObj(){
      this.idx = null
      this.active = null
      this.fileShow = !this.fileShow
    },
    getH(){
      const t = this
      setTimeout(() => {
        t.div = document.getElementById('emodel1')?.clientHeight
      }, 1000);
    },
    getModel(e){
      this.model = e
      this.allArrMin = []
      this.model?.hours_of_day?.forEach((res)=>{
        res?.minutes?.forEach((res2)=>{
          this.allArrMin.push((('0'+res?.hour).slice(-2) + ':' + ('0'+res2).slice(-2)))
        })
      })
    },
    setstatus(e){
      if(e.status < 300){
        this.success = true
        let _t = this
        setTimeout(()=>{
          _t.success = false
        },5000)
      }else{
        this.wrong = true
        this.wrongM = e.message
        let _t = this
        setTimeout(()=>{
          _t.wrong = false
        },5000)
      }
    },
    async modalShow(e){
      this[e] = false
      this.getH()
      this.beforeFLB()
      await ipcRenderer.invoke(eventNames.getServerRequestFolders,{token: sessionStorage.getItem("token")}).then((res) => {
        if(res) this.data = JSON.parse(res.result)
      }).catch((err)=>{
        console.log(err);
      })
    },
    beforeFLB(){
      let len = document.getElementsByClassName('lb')?.length || 100
      this.beforeFLBValue = len+1
    },
    async getId(e){
      this.beforeFLB()
      this.id = e
      this.res_date.archive = null
      this.res_date.current = null
      this.res_date.last = null
      await ipcRenderer.invoke(eventNames.getLastSuccessfullJournal,{meter_id: e}).then((res) => {
        if(res?.result){
          let res_date = JSON.parse(res?.result)
          this.res_date.archive = res_date?.lastInsertedArchiveDocument?.[0]?.createdAt
          this.res_date.current = res_date?.lastInsertedCurrentDocument?.[0]?.createdAt
          if(!this.res_date.archive){
            this.res_date.last = this.res_date.current
          }
          else if(!this.res_date.current){
            this.res_date.last = this.res_date.archive
          }
          else{
            let date = new Date(this.res_date.archive) - new Date(this.res_date.current)
            if(date>0){
              this.res_date.last = res_date?.lastInsertedArchiveDocument?.[0]?.createdAt
            } else{
              this.res_date.last = res_date?.lastInsertedCurrentDocument?.[0]?.createdAt
            }
          }
        }
      }).catch((err)=>{
        console.log(err);
      })
      this.getH()
    },
    dateFilter(e){
      if(e){
        let date = new Date(e)
        let newdate = ('0'+date.getDate()).slice(-2)+'.'+('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
        let newtime = ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+':'+('0'+date.getSeconds()).slice(-2)
        return  newdate+' - '+newtime
      }else{
        return "-"
      }
    },
    checkHandReq(){
      const date = new Date()
      if (this.active?.meter_detail?.period_type == 'monthly') {
        if (!this.active?.meter_detail?.days_of_month?.length){
          this.canHandleReq = true
        }
        if (this.active?.meter_detail?.days_of_month.includes(date.getDate())) {
          const hour = this.active?.meter_detail?.hours_of_day.find(e => e.hour == date.getHours())
          if (!hour || !hour.minutes.includes(date.getMinutes())) {
            this.canHandleReq = true
          }else{
            this.canHandleReq = false
          }
        }
      } else {
        if (this.active?.meter_detail?.days_of_week.includes(date.getDay())) {
          if (!this.active?.meter_detail?.days_of_week?.length){
            this.canHandleReq = true
          }
          const hour = this.active?.meter_detail?.hours_of_day.find(e => e.hour == date.getHours())
          if (!hour || !hour.minutes.includes(date.getMinutes())) {
            this.canHandleReq = true
          }else{
            this.canHandleReq = false
          }
        }
      }
    },
    async activeParam(e){
      this.beforeFLB()
      this.active = e
      this.activeFolder = null
      if(e?.folder_type == 'folder'){
        await ipcRenderer.invoke(eventNames.getFolderStatus, {id:e._id}).then((res) => {
          if(res?.data){
            this.activeFolder = JSON.parse(res?.data)
            this.activeFolder?.result?.forEach(element => {
              if(element){
                this.arrSuccSend.set((element.meter), {date:'failed',billing:'failed',current:((element?.request_type == 'current' ? element.status : '') || element.current || 'failed'),archive:((element?.request_type == 'archive' ? element.status : '') || element.archive || 'failed'),event:((element?.request_type == 'event' ? element.status : '') || element.event || 'failed'),last:element.status});
              }
            });
          }
         }).catch(async (error)=>{
          console.log(error);
        })
      }
      this.getH()
    },
    unFocus() {
      let els = document.getElementsByClassName('div');
      for(let i=0;i<els.length;i++){
        els[i].classList.remove('isFocus')
      }
    },
    opener(e){
      if(this.openDate == e){
        this.openDate = null
      }else{
        this.openDate = e
      }
    },
  },
  async mounted() {
    this.user_tools = sessionStorage.getItem('user_tools')
    // console.log(SerialPort.list());
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.checkHandReq()
    }, 1000);
    this.beforeFLB()
    ipcRenderer.invoke(eventNames.getServerRequestFolders,{token: sessionStorage.getItem("token")}).then((res) => {
      this.data = JSON.parse(res.result)
    }).catch((err)=>{
      console.log(err);
    })
    await ipcRenderer.invoke(eventNames.metersList,{token: sessionStorage.getItem("token")}).then((res)=>{
      if(res?.data){
        this.options = res?.data
      }
    }).catch((error)=>{
      console.log(error);
    })
    ipcRenderer.on(eventNames.send_message, (event, eventData) => {
      this.arrSuccSend.set((eventData.id), {date:(eventData.where=='date'?eventData.status:(this.arrSuccSend.get(eventData.id)?.date||'failed')),billing:(eventData.where=='billing'?eventData.status:(this.arrSuccSend.get(eventData.id)?.billing||'failed')),current:((eventData.where=='current' && eventData.status!='sent')?eventData.status:(this.arrSuccSend.get(eventData.id)?.current)),archive:((eventData.where=='archive' && eventData.status!='sent')?eventData.status:(this.arrSuccSend.get(eventData.id)?.archive)),event:((eventData.where=='event' && eventData.status!='sent')?eventData.status:(this.arrSuccSend.get(eventData.id)?.event)),last:eventData.status});
    });
    ipcRenderer.on('context-menu-add-file', () => {
      this.active = null
      this.fileShow = !this.fileShow
    })
    ipcRenderer.on('context-menu-remove', () => {
      this.remove = !this.remove
    })
    ipcRenderer.on('context-menu-rename-file', () => {
      this.fileShow = !this.fileShow
    })
    ipcRenderer.on('context-menu-edit-counter', () => {
      this.editCounter()
    })
    // ipcRenderer.on('context-menu-add-uspd', () => {
    //   this.uspdShow = !this.uspdShow
    // })
    ipcRenderer.on('context-menu-add-counter', () => {
      this.model = null
      this.counterShow = !this.counterShow
    })
    document.getElementById('server')?.addEventListener('contextmenu', (e) => {
      if((sessionStorage.getItem('user_tools') == 'admin') && e.target.id) {
        this.objType = e.target.getAttribute('name')
        this.idx = e.target.id
        e.preventDefault()
        if(this.objType == 'meter'){
          ipcRenderer.send('show-context-menu2',this.objType,this.$i18n.locale.value)
        }else{
          ipcRenderer.send('show-context-menu',this.objType,this.$i18n.locale.value)
        }
        // if(this.objType != 'meter'){
        //   ipcRenderer.send('show-context-menu',this.objType,this.$i18n.locale.value)
        // }
      }
    })
    this.getH()
  },
};
</script>
<style>
</style>