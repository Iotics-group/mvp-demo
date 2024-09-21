<template>
  <div class="wrapper">
    <div class="header">
      <h3>{{$locale['reportObj'][$i18n.locale.value]}}</h3>
      <div class="breadcrumbs">
        <p>{{$locale['reportObj'][$i18n.locale.value]}}</p>
      </div>
    </div>
    <div class="e-model g-panel table-diagram" @click="opener">
      <div class="model-dv w-33">
        <div
          :class="{openBlock: openBlock == true }"
          class="model-block"
          @click.stop="unFocus"
        >
          <h5 class="recmenu">
            <p class="line-1">{{$locale['elect_model'][$i18n.locale.value]}}</p>
            <span @click.stop="openBlock = true">-</span>
          </h5>
          <div class="wrapblock">
            <div class="beforeB" :style="div ? ('height:'+(div)+'px') : ''">
              <div
                class="beforeFLB"
                :style="'top:' + (64 * index + 21) + 'px;'"
                v-for="(el, index) in beforeFLBValue"
                :key="index"
              ></div>
            </div>
            <div id="emodel1" class="model-div">
              <ul class="tree-menu">
                <TreeParentFirst :beforeFLBValue="beforeFLBValue" :first="data[0]" @click.stop="getH" accessEmits="getId,activeParam,activeLocation" @getId="getEmit($event)" @activeLocation="activeLocation($event)" @activeParam="activeParam($event)" v-for="(item,index) in data" :key="index" class="tree-item" :model="item"></TreeParentFirst>
              </ul>
            </div>
          </div>
        </div>
        <div
          :class="{ openBlock: openBlock == false }"
          class="model-block"
          @click.stop="unFocus"
        >
          <h5 class="recmenu">
            <p class="line-1">{{$locale['calc_model'][$i18n.locale.value]}}</p>
            <span @click.stop="openBlock = false">-</span>
          </h5>
          <div class="wrapblock">
            <div class="beforeB" :style="div2 ? ('height:'+(div2)+'px') : ''">
              <div
                class="beforeFLB"
                :style="'top:' + (64 * index + 21) + 'px;'"
                v-for="(el, index) in beforeFLBValue2"
                :key="index"
              ></div>
            </div>
            <div id="emodel2" class="model-div">
              <ul class="tree-menu">  
                <TreeParentFirstReport
                  :beforeFLBValue="beforeFLBValue2"
                  :first="data2[0]"
                  @click.stop="getH2"
                  :icon="false"
                  @getId="getEmitForReport($event)"
                  v-for="(item, index) in data2"
                  :key="index"
                  @activeLocation="activeLocation($event)"
                  accessEmits="activeLocation,getId"
                  class="tree-item"
                  :model="item"
                ></TreeParentFirstReport>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="model-dv w-67">
        <div class="model-block h-100 gradient">
          <div class="calendar-blocks" v-if="id">
            <div class="calendar-block">
              <label for="">{{$locale['startDate'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte')">
                {{ inpFilter.startDate || $locale['ddmmyyyy'][$i18n.locale.value] }}
                <icons color="white" icon="calendar" />
              </p>
              <datepicker
                @date="setdate($event, 'startDate')"
                @click.stop
                :changedDate="filter?.startDate"
                v-if="openDAte"
              />
            </div>
            <div class="calendar-block">
              <label for="">{{$locale['finishDate'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte2')">
                {{ inpFilter.finishDate || $locale['ddmmyyyy'][$i18n.locale.value] }}
                <icons color="white" icon="calendar" />
              </p>
              <datepicker
                @date="setdate($event, 'finishDate')"
                @click.stop
                :changedDate="filter?.finishDate"
                v-if="openDAte2"
              />
            </div>
          </div>
          <div class="new-apl-g1 scroll" v-if="id">
            <div class="report-file" v-for="(el, index) in files" :key="index">
              <div class="report-file-title">
                <p>{{ el?.name?.[$i18n.locale.value] }}</p>
                <!-- <span>04.35.0541</span> -->
              </div>
              <Icons
                @click="print(index,el)"
                class="download"
                size="custom"
                width="48"
                v-if="(!load || (load?.index != index) || (load?.loading == false))"
                height="48"
                icon="download"
              />
              <div class="merr-timer" v-if="((load?.loading == true)&&(load?.index == index))">
                <img src="../assets/svg/reload.svg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div style="display: none">
    <div v-if="loadpdf" ref="page-to-print">
      <pdf1 :data="fetchData" :fetchdata="repdata1" :total="total"/>
    </div>
    <div v-if="loadpdf3" ref="page-to-print3">
      <pdf2 :factoryName="factoryName" :data="fetchData" :fetchdata="repdata3"/>
    </div>
  </div>
  <transition name="notify" :duration="10000">
    <notify :main="$locale['warning'][$i18n.locale.value]" :text="$locale['noDataSelectedDate'][$i18n.locale.value]" @close="warning=false" typeModal="warning" v-if="warning"/>
  </transition>
</template>
<script>
import { ipcRenderer } from "electron";
import TreeParentFirst from "../components/menu/TreeParentFirst.vue";
import pdf1 from "../components/pdf/report1.vue";
import pdf2 from "../components/pdf/report2.vue";
import TreeParentFirstReport from "../components/menu/TreeParentFirstReport.vue";
import datepicker from "../components/datepicker/datepicker.vue";
import Icons from "../components/icons.vue";

export default {
  name: "report-name",
  data() {
    return {
      warning: false,
      div: null,
      div2: null,
      open: false,
      loading: false,
      limit: 150,
      fetchData: {},
      repdata1: null,
      repdata2: null,
      repdata3: null,
      total: {},
      total2: {},
      filter: {
        startDate: null,
        finishDate: null,
      },
      inpFilter: {
        startDate: null,
        finishDate: null,
      },
      openDAte: null,
      openDAte2: null,
      files: [
        {
          name: {ru:"Расход (А+, R+) энергии по дням и по временным зонам",en:"Energy consumption (A+, R+) by day and by time zone."},
          com: 'page-to-print',
          landscape: false,
          openkey: 'loadpdf',
          isReportObject: false,
        },
        {
          name: {ru:"Расход (A+, A-, R+, R-) энергии по стандартам РУз «Четырёх тарифный режим»",en:"Energy consumption (A+, A-, R+, R-) according to the standards of the Republic of Uzbekistan «Four tariff regime»."},
          com: 'page-to-print3',
          landscape: true,
          openkey: 'loadpdf3',
          isReportObject: false,
        },
      ],
      arrow: `
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.95998 4.47501L6.69998 7.73501C6.31498 8.12001 5.68498 8.12001 5.29998 7.73501L2.03998 4.47501" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
      data: [],
      id: null,
      load: null,
      data2: [],
      reportList: [],
      location: [],
      openBlock: true,
      beforeFLBValue: 100,
      beforeFLBValue2: 100,
      loadpdf: false,
      loadpdf3: false,
      factoryName: '',
    };
  },
  components: {
    TreeParentFirst,
    TreeParentFirstReport,
    datepicker,
    Icons,
    pdf1,
    pdf2,
  },
  methods: {
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
    async activeLocation(e){
      if(e?.length){
        this.factoryName = e[e?.length-1]
      }
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
    setdate(e, type) {
      let date = new Date(e?.unformat);
      let date1 = date && date?.toISOString();
      this.filter[type] = date1;
      this.inpFilter[type] = e?.format;
      if(this.filter.startDate && this.filter.finishDate) {
        if((new Date(this.filter.startDate)) - (new Date(this.filter.finishDate)) > 0){
          this.filter.startDate = this.filter.finishDate
          this.inpFilter[type] = (new Date(this.filter.finishDate)).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
      }
      this.getId(this.id);
      this.opener();
    },
    async getEmit(e){
      this.id = e
      this.getId(e)
    },
    async getEmitForReport(e){
      this.id = e
      this.getId(e)
    },
    activeParam(e) {
      this.active = e;
    },
    opener(e) {
      const fl = ["openDAte", "openDAte2"];
      this[e] = !this[e];
      fl?.forEach((j) => {
        if (j != e) {
          this[j] = false;
        }
      });
    },
    async reportARplus(){
      this.loading = false
      let fetchData = {...this.fetchData}
      if(this.id&&fetchData.startDate&&fetchData.finishDate) {
        let data = {
          date1: fetchData.startDate,
          date2: fetchData.finishDate,
          step: true
        }
        let reqname = this.isReportObject ? (`/calculation/report/${this.id}`) : (`/electricity/report/${this.id}`)
        await this.$axios.get((reqname),{params:{...data}}).then((res) => {
          if(res?.data?.data){
            this.total = {
              first_tariff:0,
              second_tariff:0,
              third_tariff:0,
              fourth_tariff:0,
              general_aplus:0,
              general_rplus:0,
            }
            this.repdata1 = res?.data?.data
            Object.keys(this.repdata1?.data).map((el)=>{
              this.total.first_tariff += this.repdata1?.data[el]?.first_tariff
              this.total.second_tariff += this.repdata1?.data[el]?.second_tariff
              this.total.third_tariff += this.repdata1?.data[el]?.third_tariff
              this.total.fourth_tariff += this.repdata1?.data[el]?.fourth_tariff
              this.total.general_aplus += this.repdata1?.data[el]?.general_aplus
              this.total.general_rplus += this.repdata1?.data[el]?.general_rplus
            })
          }
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                let reqname = this.isReportObject ? (`/calculation/report/${this.id}`) : (`/electricity/report/${this.id}`)
                await this.$axios.get((reqname),{params:{...data}}).then((res) => {
                  if(res?.data?.data){
                    this.total = {
                      first_tariff:0,
                      second_tariff:0,
                      third_tariff:0,
                      fourth_tariff:0,
                      general_aplus:0,
                      general_rplus:0,
                    }
                    this.repdata1 = res?.data?.data
                    Object.keys(this.repdata1?.data).map((el)=>{
                      this.total.first_tariff += this.repdata1?.data[el]?.first_tariff
                      this.total.second_tariff += this.repdata1?.data[el]?.second_tariff
                      this.total.third_tariff += this.repdata1?.data[el]?.third_tariff
                      this.total.fourth_tariff += this.repdata1?.data[el]?.fourth_tariff
                      this.total.general_aplus += this.repdata1?.data[el]?.general_aplus
                      this.total.general_rplus += this.repdata1?.data[el]?.general_rplus
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
        this.loading = true
      }
    },
    async reportBilling(){
      let fetchData = {...this.fetchData}
      if(this.id&&fetchData?.startDate&&fetchData?.finishDate) {
        let data = {
          date1: fetchData.startDate,
          date2: fetchData.finishDate,
        }
        await this.$axios.get(('billing/'+this.id),{params:{...data}}).then((res) => {
          if(!res?.data?.data?.message){
            this.repdata3 = res?.data?.data
          }else{
            this.warning = true
            let _t = this;
            setTimeout(() => {
              _t.warning = false;
            }, 5000);
          }
        }).catch(async (error)=>{
          if(error.response.data.status == 404){
            this.warning = true
            let _t = this;
            setTimeout(() => {
              _t.warning = false;
            }, 5000);
          }
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.$axios.get(('billing/'+this.id),{params:{...data}}).then((res) => {
                  if(!res?.data?.data?.message){
                    this.repdata3 = res?.data?.data
                  }
                }).catch((err)=>{
                  console.log(err);
                })
              }).catch((err)=>{
                console.log(err);
              })
            }
          }else{
            console.log(error);
          }
        })
      }
    },
    async reportqwe(){
      this.loading = false
      let fetchData = {...this.fetchData}
      if(this.id&&fetchData?.startDate&&fetchData?.finishDate) {
        let data = {
          date1: fetchData.startDate,
          date2: fetchData.finishDate,
        }
        let reqname = this.isReportObject ? (`/calculation/report-fourth/${this.id}`) : (`/electricity/report-fourth/${this.id}`)
        await this.$axios.get((reqname),{params:{...data}}).then((res) => {
          if(res?.data?.data){
            this.reportList = res?.data?.data
            this.location = res?.data?.location
          }
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                await this.reportqwe()
              }).catch((err)=>{
                console.log(err);
              })
            }
          }
        })
        this.loading = true
      }
    },
    async print(index,el) {
      if(!this.filter.startDate && !this.filter.finishDate) return
      this.load = {index:index,loading:true}
      this.fetchData = {}
      this.fetchData = {
        ...this.filter,
        id: this.id
      }
      if(el.openkey == 'loadpdf'){
        await this.reportARplus()
      }else if(el.openkey == 'loadpdf3'){
        await this.reportBilling()
      }else{
        await this.reportBilling()
      }
      this[el?.openkey] = true
      setTimeout(()=>{
        const pageToPrint = this.$refs[el?.com]
        if(pageToPrint){
          let serializer = new XMLSerializer();
          var serializedObject = serializer.serializeToString(pageToPrint);
          let data = ` от ${this.dateFilter(this.filter.startDate)} до ${this.dateFilter(this.filter.finishDate)}`
          ipcRenderer.invoke('printPdf', {
            content: serializedObject,
            fileName: (this.files[index].name?.[this.$i18n.locale.value] + data + ` (${(new Date()).getTime()})`),
            landscape: this.files[index].landscape,
          }).catch((err)=>{
            console.log(err);
          });
        }
      }, 150);
      this.load = {index:index,loading:false}
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
    await this.$axios.get('/electricity/list').then((res) => {
      this.data = res?.data?.data
    }).catch(async (error)=>{
      const statusCode = (error.response || {}).status || -1;
      if (statusCode == 406) {
        if(error.config.method == 'get'){
          await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
            localStorage.setItem('session',res?.data?.session)
            await this.$axios.get('/electricity/list').then((res) => {
              this.data = res?.data?.data
            }).catch((err)=>{
              console.log(err);
            })
          }).catch((err)=>{
            console.log(err);
          })
        }
      }
    })
    await this.$axios.get('/calculation/list').then((res) => {
      this.data2 = res?.data?.data
    }).catch(async (error)=>{
      const statusCode = (error.response || {}).status || -1;
      if (statusCode == 406) {
        if(error.config.method == 'get'){
          await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
            localStorage.setItem('session',res?.data?.session)
            await this.$axios.get('/calculation/list').then((res) => {
              this.data2 = res?.data?.data
            }).catch((err)=>{
              console.log(err);
            })
          }).catch((err)=>{
            console.log(err);
          })
        }
      }
    })
    this.inpFilter.startDate = (new Date(new Date().getFullYear(),((new Date()).getMonth()),1)).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    this.filter.startDate = (new Date(new Date().getFullYear(),((new Date()).getMonth()),1)).toISOString()
    this.inpFilter.finishDate = (new Date(new Date().getFullYear(),((new Date()).getMonth()+1),0)).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    this.filter.finishDate = (new Date(new Date().getFullYear(),((new Date()).getMonth()+1),0)).toISOString()
    this.beforeFLB()
    this.beforeFLB2()
    
    this.getH()
    this.getH2()
  },
};
</script>
