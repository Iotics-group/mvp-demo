<template>
  <div class="wrapper">
    <div class="header">
      <h3>{{$locale['journal'][$i18n.locale.value]}}</h3>
      <div class="breadcrumbs">
        <p>{{$locale['journal'][$i18n.locale.value]}}</p>
      </div>
      <button @click="print">{{$locale['exportPdf'][$i18n.locale.value]}} <Icons size="custom" width="20" height="20" icon="print"/> </button>
    </div>
    <div class="e-model g-panel table-diagram" @click="opener">
      <div class="model-dv w-33">
        <div :class="{openBlock: openBlock==true }" class="model-block mh-100" @click.stop="unFocus">
          <h5 class="recmenu">
            <p class="line-1">{{$locale['server_req'][$i18n.locale.value]}}</p>
          </h5>
          <div class="wrapblock">
            <div class="beforeB" :style="div ? ('height:'+(div)+'px') : ''">
              <div class="beforeFLB" :style="'top:'+(64*(index)+21) + 'px;'" v-for="el,index in beforeFLBValue" :key="index"></div>
            </div>
            <div id="emodel1" class="model-div">
              <ul class="tree-menu">
                <TreeParentFirst :beforeFLBValue="beforeFLBValue" accessEmits="getId,activeParam,model" :trsn="true" :first="data[0]" @click.stop="getH" @activeParam="activeParam($event)" @getId="getEmit($event,true)" v-for="(item,index) in data" :key="index" class="tree-item" :model="item"></TreeParentFirst>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="model-dv w-67">
        <div class="model-block h-100">
          <div class="calendar-blocks" v-if="id">
            <div class="calendar-block">
              <label for="">{{$locale['typeEvent'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDate1')">{{((selectedOption?.length == selectedOptionLength) || (selectedOption?.length == 0)) ? $locale['all'][$i18n.locale.value] : ''}} <span class="line-1" v-if="((((selectedOption?.length) != selectedOptionLength) && (selectedOption?.length != 0)))">{{(selectedOption[0][$i18n.locale.value])}}</span> <span v-if="((((selectedOption?.length) != selectedOptionLength) && (selectedOption?.length > 1)))">+{{selectedOption?.length - 1}}</span> <icons icon="arrDown"/></p>
              <div v-if="openDate1" class="select-options scrollbar">
                <div v-for="el,index in options" @click="setArr(index,el)" :key="index" class="select-option">
                  <span :class="(el?.default)?'checked':'notCheck'"><span v-if="(el?.default)">&#10003;</span></span>
                  {{el.label?.[$i18n.locale.value]}}
                </div>
              </div>
            </div>
            <!-- <div class="calendar-block">
              <Select :options="options2" @getSelected="getChannel($event)" label="Категория события" id="channeltype"/>
            </div> -->
            <div class="calendar-block">
              <label for="">{{$locale['startLog'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte')">
                {{ inpFilter.date1 || $locale['ddmmyyyy'][$i18n.locale.value] }}
                <icons color="white" icon="calendar" />
              </p>
              <datepicker
                @date="setdate($event, 'date1')"
                @click.stop
                :changedDate="filter?.date1"
                v-if="openDAte"
              />
            </div>
            <div class="calendar-block">
              <label for="">{{$locale['finishLog'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte2')">
                {{ inpFilter.date2 || $locale['ddmmyyyy'][$i18n.locale.value] }}
                <icons color="white" icon="calendar" />
              </p>
              <datepicker
                @date="setdate($event, 'date2')"
                @click.stop
                :changedDate="filter?.date2"
                v-if="openDAte2"
              />
            </div>
          </div>
          <div class="new-apl-g1 scroll" @scroll="paginator($event)" v-if="id">
            <div class="journal-table">
              <table cellspacing="0">
                <thead>
                  <tr>
                    <th>{{$locale['dateTimeEvent'][$i18n.locale.value]}}</th>
                    <th>{{$locale['typeEvent'][$i18n.locale.value]}}</th>
                    <th>{{$locale['categoryEvent'][$i18n.locale.value]}}</th>
                    <th>{{$locale['definitionEvent'][$i18n.locale.value]}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="el,index in event" :key="index">
                    <td>{{dateFilter2(el?.date)}}</td>
                    <td>{{journal?.[el.event]?.label?.[$i18n.locale.value] || '-'}}</td>
                    <td :class="journal?.[el.event]?.type">{{journal?.[el.event]?.type_label?.[$i18n.locale.value] || '-'}}</td>
                    <td><span class="line-2">{{journal?.[el.event]?.text?.[$i18n.locale.value] || '-'}}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="no-meter" v-else-if="(active?.type != 'meter')">
              <div>{{$locale['onlyTypeMeter'][$i18n.locale.value]}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div style="display: none">
    <div v-if="loadpdf" ref="page-to-print">
      <pdfReport :name="active?.name" :data="filter" :fetchdata="eventReport"/>
    </div>
  </div>
  <transition name="notify" :duration="10000">
    <notify :main="$locale['warning'][$i18n.locale.value]" :text="$locale['noDataSelectedDate'][$i18n.locale.value]" @close="warning=false" typeModal="warning" v-if="warning"/>
  </transition>
</template>
<script>
import { ipcRenderer } from "electron";
import eventNames from '@/universal/eventNames.js';
import TreeParentFirst from "../components/menu/TreeParentFiles.vue";
// import Select from '../components/select.vue'
import pdfReport from "../components/pdf/event.vue";
import datepicker from "../components/datepicker/datepicker.vue";
import Icons from "../components/icons.vue";
import journalJSON from "../../../journal.json";  

export default {
  name: "report-name",
  data() {
    return {
      warning: false,
      setedArr: [],
      setedArr2: [],
      eventReport: [],
      active: null,
      journal: null,
      div: null,
      div2: null,
      open: false,
      loading: false,
      fetchData: {},
      repdata1: null,
      repdata2: null,
      repdata3: null,
      total: {},
      total2: {},
      filter: {
        date1: null,
        date2: null,
      },
      inpFilter: {
        date1: null,
        date2: null,
      },
      openDAte: null,
      openDate1: null,
      openDAte2: null,
      data: [],
      id: null,
      event: null,
      events: [],
      eventFormat: [],
      data2: [],
      openBlock: true,
      beforeFLBValue: 100,
      isReportObject: false,
      beforeFLBValue2: 100,
      loadpdf: false,
      loadpdf2: false,
      loadpdf3: false,
      factoryName: '',
      options: {},
      eventList:{},
      options2List: [
        {
          name: this.$locale['warning'][this.$i18n.locale.value],
          classificator: 'warning'
        },
        {
          name: this.$locale['success'][this.$i18n.locale.value],
          classificator: 'success'
        },
        {
          name: this.$locale['criticalError'][this.$i18n.locale.value],
          classificator: 'error'
        }
      ],
      options2: [],
      eventTypesList:{
        warning: ['0001','0003'],
        success: ['0002','0004','0006','0008','0010','0012','0014','0016'],
        error: ['0005','0007','0009','0011','0013','0015'],
      },
      eventTypes:{}
    };
  },
  computed:{
    selectedOptionLength(){
      return Object.keys(this.options)?.length
    },
    selectedOption(){
      let newOption = []
      this.eventFormat?.forEach(element => {
        newOption.push(this.options[element]?.label)
      });
      return newOption
    }
  },
  components: {
    TreeParentFirst,
    datepicker,
    Icons,
    pdfReport,
    // Select
  },
  methods: {
    paginator(e){
      if((e.target.offsetHeight + e.target.scrollTop) >= e.target.scrollHeight){
        clearTimeout(this.timeout)
        this.timeout = setTimeout(async () => {
          let filter = {...this.filter}
          filter.date2 = (new Date(new Date(filter.date2).getFullYear(),(new Date(filter.date2).getMonth()),(new Date(filter.date2).getDate()+1))).toISOString()
          let params = {...filter}
          params.date2 = this.event[this.event?.length - 1]?.date
        await ipcRenderer.invoke(eventNames.getEventList,{id:this.active?.meter,params:{...params,filter:JSON.stringify(this.eventFormat)},token: sessionStorage.getItem("token")}).then((res) => {
            if(res?.data?.length)
            this.event = [...this.event,...res?.data]
            this.event = this.event.filter((c, index) => {
              return this.event.indexOf(c) === index;
            });
          }).catch(async (error)=>{
            console.log(error);
          })
        }, 1000);
      }
    },
    dateFilter2(e){
      let date = new Date((e))
      let newdate = ('0'+date.getDate()).slice(-2)+'.'+('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
      let newtime = ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+':'+('0'+date.getSeconds()).slice(-2)
      return  newdate+' - '+newtime
    },
    getChannel(e){
      this.eventFormat = this.eventTypes[e]
      if(this.active?.meter){
        this.getEventList()
      }
    },
    getH(){
      const t = this
      setTimeout(() => {
        t.div = document.getElementById('emodel1')?.clientHeight
      }, 1000);
    },
    getH2(){
      const t = this
      setTimeout(() => {
        t.div2 = document.getElementById('emodel2')?.clientHeight
      }, 1000);
    },
    async getModel(e){
      this.factoryName = e?.name
    },
    beforeFLB(){
      let len = document.getElementsByClassName('fbl')?.length || 100
      this.beforeFLBValue = len
    },
    beforeFLB2() {
      let len = document.getElementsByClassName("fbl2")?.length || 100;
      this.beforeFLBValue2 = len;
    },
    unFocus() {
      let els = document.getElementsByClassName("div");
      for (let i = 0; i < els.length; i++) {
        els[i].classList.remove("isFocus");
      }
    },
    setArr(idx){
      this.options[idx].default = !this.options[idx].default
      if(this.options[idx].default){
        this.eventFormat.push(idx)
      }else{
        this.eventFormat = this.eventFormat?.filter((el)=> el != idx)
      }
      this.eventFilter()
      this.getEventList()
    },
    setdate(e, type) {
      let date = new Date(e?.unformat);
      let date1 = date && date?.toISOString();
      this.filter[type] = date1;
      this.inpFilter[type] = e?.format;
      if(this.filter.date1 && this.filter.date2) {
        if((new Date(this.filter.date1)) - (new Date(this.filter.date2)) > 0){
          this.filter.date1 = this.filter.date2
          this.inpFilter.date1 = (new Date(this.filter.date2)).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
      }
      if(this.active?.meter){
        this.eventFilter()
        this.getEventList()
      }
      this.opener();
    },
    async getEmit(e){
      this.id = e
      this.isReportObject = false
      this.eventFormat = []
      this.getId(e)
    },
    async getEmitForReport(e){
      this.id = e
      this.isReportObject = true
      this.getId(e)
    },
    eventFilter(){
      let eventTypes = {...this.eventTypesList}
      Object.keys(eventTypes).map((el)=>{
      eventTypes[el] = eventTypes[el]?.filter((e)=> this.eventFormat?.includes(e))
        if(!eventTypes[el]?.length){
          delete eventTypes[el]
        }
      })
      this.eventTypes = eventTypes
      this.options2 = this.options2List?.filter(element => eventTypes?.[element.classificator]?.length);
    },
    async activeParam(e) {
      this.active = e;
      this.event = null
      this.events = []
      this.eventFormat = []
      if(e?.meter_detail?.meter_type){
        
      await ipcRenderer.invoke(eventNames.getEventTypes,{type:e?.meter_detail?.meter_type,token: sessionStorage.getItem("token")}).then((res) => {
          this.events = res?.data
          // this.events?.forEach(element => {
          //   this.eventFormat.push(this.eventList[element])
          // });
        }).catch(async (error)=>{
          console.log(error);
        })
        
        this.options = {...this.journal}
        Object.keys(this.options).map((el)=>{
          this.options[el].default = false
          if(!this.events?.includes(this.options[el]?.key)){
            delete this.options[el]
          }
        })
        if(this.active?.meter){
          this.eventFilter()
          this.getEventList()
        }
      }else{
        this.id = null
      }
    },
    opener(e) {
      const fl = ['openDAte','openDate1','openDAte2']
      this[e] = !this[e];
      fl?.forEach((j) => {
        if (j != e) {
          this[j] = false;
        }
      });
    },
    
    async report(){
      this.loading = false
      if(this.id) {
        let filter = {...this.filter}
        filter.date2 = (new Date(new Date(filter.date2).getFullYear(),(new Date(filter.date2).getMonth()),(new Date(filter.date2).getDate()+1))).toISOString()
        await ipcRenderer.invoke(eventNames.getEventReport,{id:this.id,query:{...filter,filter:JSON.stringify(this.eventFormat)},token: sessionStorage.getItem("token")}).then((res) => {
          if(res?.data){
            this.eventReport = res?.data
          }
        }).catch(async (error)=>{
          console.log(error);
        })
        this.loading = true
      }
    },
    async print() {
      if(!this.filter.date1 && !this.filter.date2) return
      await this.report()
      this.loadpdf = true
      setTimeout(()=>{
        const pageToPrint = this.$refs["page-to-print"]
        if(pageToPrint){
          let serializer = new XMLSerializer();
          var serializedObject = serializer.serializeToString(pageToPrint);
          let data = ` от ${this.dateFilter(this.filter.date1)} до ${this.dateFilter(this.filter.date2)}`
          
          ipcRenderer.invoke(eventNames.printPDFFile, {
            content: serializedObject,
            fileName: (this.$locale['journal'][this.$i18n.locale.value] + ' ' + data + ` (${(new Date()).getTime()})`),
            landscape: false,
          }).catch((err)=>{
            console.log(err);
          });
        }
      }, 150);
    },
    dateFilter(e){
      if(e){
        let date = new Date(e)
        let newdate = ('0'+date.getDate()).slice(-2)+'.'+('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
        return  newdate
      }else{
        return "-"
      }
    },
    async getEventList(){
      if(this.active?.meter){
        let filter = {...this.filter}
        filter.date2 = (new Date(new Date(filter.date2).getFullYear(),(new Date(filter.date2).getMonth()),(new Date(filter.date2).getDate()+1))).toISOString()
        await ipcRenderer.invoke(eventNames.getEventList,{id:this.active?.meter,query:{...filter,filter:JSON.stringify(this.eventFormat)},token: sessionStorage.getItem("token")}).then((res) => {
          this.event = JSON.parse(res?.data)
        }).catch(async (error)=>{
          console.log(error);
        })
      }
    },
    async getId(e){
      this.id = e
      this.beforeFLB();
      this.beforeFLB2();
      this.getH()
      this.getH2()
    },
    toISOLocal(d) {
      const z = n => ('0' + n).slice(-2);
      let off = d.getTimezoneOffset();
      const sign = off < 0 ? '+' : '-';
      off = Math.abs(off);
      return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, -1) + sign + z(off / 60 | 0) + ':' + z(off % 60);
    }
  },
  async mounted() {
    this.journal = journalJSON
    
    ipcRenderer.invoke(eventNames.getServerRequestFolders,{token: sessionStorage.getItem("token")}).then((res) => {
      this.data = JSON.parse(res.result)
    }).catch((err)=>{
      console.log(err);
    })
    this.inpFilter.date1 = (new Date(new Date().getFullYear(),((new Date()).getMonth()),1)).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    this.filter.date1 = (new Date(new Date().getFullYear(),((new Date()).getMonth()),1)).toISOString()
    this.inpFilter.date2 = (new Date(new Date().getFullYear(),((new Date()).getMonth()+1),0)).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    this.filter.date2 = (new Date(new Date().getFullYear(),((new Date()).getMonth()+1),0)).toISOString()
    this.beforeFLB()
    this.beforeFLB2()
    
    this.getH()
    this.getH2()
  },
};
</script>
