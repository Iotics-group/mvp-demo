<template>
  <div class="wrapper">
    <div class="header">
      <h3>{{$locale['panelGraph'][$i18n.locale.value]}}</h3>
      <div class="breadcrumbs">
        <p>{{$locale['panelGraph'][$i18n.locale.value]}}</p>
      </div>
    </div>
    <div class="e-model table-diagram" @click="opener">
      <div class="model-dv w-33">
        <div :class="{openBlock: openBlock==true }" class="model-block" @click.stop="unFocus">
          <h5 class="recmenu">
            <p class="line-1">{{$locale['elect_model'][$i18n.locale.value]}}</p>
            <span @click.stop="openBlock = true">-</span>
          </h5>
          <div id="emodel1" class="wrapblock">
            <div class="beforeB" :style="div ? ('height:'+(div)+'px') : ''">
              <div class="beforeFLB" :style="'top:'+(64*(index)+21) + 'px;'" v-for="el,index in beforeFLBValue" :key="index"></div>
            </div>
            <ul class="tree-menu" :class="{pointerEventsNone:$checkReq?.checkReq?.value}">
              <TreeParentFirst :beforeFLBValue="beforeFLBValue" :first="data[0]" @click.stop="getH" accessEmits="getId" @getId="getEmit($event)" v-for="(item,index) in data" :key="index" class="tree-item" :model="item"></TreeParentFirst>
            </ul>
          </div>
        </div>
        <div :class="{openBlock: openBlock==false }" class="model-block" @click.stop="unFocus">
          <h5 class="recmenu">
            <p class="line-1">{{$locale['calc_model'][$i18n.locale.value]}}</p>
            <span @click.stop="openBlock = false">-</span>
          </h5>
          <div id="emodel2" class="wrapblock">
            <div class="beforeB" :style="div2 ? ('height:'+(div2)+'px') : ''">
              <div class="beforeFLB" :style="'top:'+(64*(index)+21) + 'px;'" v-for="el,index in beforeFLBValue2" :key="index"></div>
            </div>
            <div class="model-div">
              <ul class="tree-menu">  
                <TreeParentFirstReport :beforeFLBValue="beforeFLBValue2" :first="data2[0]" @click.stop="getH2" accessEmits="getId" :icon="false" @getId="getEmitForReport($event)" v-for="(item,index) in data2" :key="index" class="tree-item" :model="item"></TreeParentFirstReport>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="model-dv w-67">
        <div class="dashboard-data gradient">
          <div class="dashboard-data-blocks">
            <div class="dashboard-data-block">
              <p>{{$locale['activePower'][$i18n.locale.value]}}</p>
              <span>{{realtime?.AP?.toFixed(2) || '-'}}</span>
            </div>
            <div class="dashboard-data-block">
              <p>{{$locale['reactivePower'][$i18n.locale.value]}}</p>
              <span>{{realtime?.RP?.toFixed(2) || '-'}}</span>
            </div>
            <div class="dashboard-data-block">
              <p>{{$locale['fullPower'][$i18n.locale.value]}}</p>
              <span>{{realtime?.FP?.toFixed(2) || '-'}}</span>
            </div>
            <div class="dashboard-data-block">
              <p>{{$locale['coefActivePower'][$i18n.locale.value]}}</p>
              <span>{{realtime?.CP?.toFixed(2) || '-'}}</span>
            </div>
          </div>
          <div class="dashboard-update">
            <p>{{$locale['lastUpdateDate'][$i18n.locale.value]}}</p>
            <span>{{dateFilter(realtime?.date)}}</span>
          </div>
        </div>
        
        <div class="calendar-blocks white">
          <div class="calendar-block">
            <label :title="$locale['dataDisplay'][$i18n.locale.value]" for="">{{$locale['dataDisplay'][$i18n.locale.value]}}</label>
            <p class="calendar-input" @click.stop="opener('openDAte')">{{setedArr.length == chartOption3.options.length ? $locale['all'][$i18n.locale.value] : (chartOption3.options[setedArr[0]]?.label[$i18n.locale.value]||$locale['all'][$i18n.locale.value])}} <span v-if="(setedArr.length > 1)&&(setedArr.length != chartOption3.options.length)">+{{Number(setedArr.length)-1}}</span> <icons icon="arrDown"/></p>
            <div v-if="openDAte" class="select-options">
              <div v-show="el?.data?.length" v-for="el,index in chartOption3.options" @click="setArr(index,el)" :key="index" class="select-option">
                <span :class="(setedArr.includes(index))?'checked':'notCheck'"><span v-if="(setedArr.includes(index))">&#10003;</span></span>
                {{el.label}}
              </div>
            </div>
          </div>
          <div class="calendar-block">
            <label for="">{{$locale['year'][$i18n.locale.value]}}</label>
            <p class="calendar-input" @click.stop="opener('openDAte2')">{{inpFilter.year || 'гггг'}} <icons color="black" icon="calendar"/></p>
            <datepickerYear :changedDate="filter.year" :activedate="filter.year" @date="setDate($event,'year')"  @click.stop v-if="openDAte2"/>
          </div>
          <div class="calendar-block">
            <label for="">{{$locale['month'][$i18n.locale.value]}}</label>
            <p class="calendar-input" @click.stop="opener('openDAte3')">{{inpFilter.month || 'мм'}} <icons color="black" icon="calendar"/></p>
            <datepickerMonth :changedDate="filter.month" @date="setDate($event,'month')"  @click.stop v-if="openDAte3"/>
          </div>
        </div>
        <div class="expense-monthly">
          <div class="expense-energy-monthly gradient">
            <h3>{{$locale['energyConsumptionPerMonth'][$i18n.locale.value]}}</h3>
            <div class="expense-table">
              <div class="thead">
                <div v-if="fetchData?.dailyDocuments?.length" class="th transparent">{{$locale['date'][$i18n.locale.value]}}</div>
                <div v-if="fetchData?.dailyDocuments?.length && (!setedArr.length || setedArr.includes(0))" class="th yellow">A+</div>
                <div v-if="fetchData?.dailyDocuments?.length && (!setedArr.length || setedArr.includes(1))" class="th blue">R+</div>
                <div v-if="fetchData?.dailyDocuments?.length && (!setedArr.length || setedArr.includes(2))" class="th bgreen">A-</div>
                <div v-if="fetchData?.dailyDocuments?.length && (!setedArr.length || setedArr.includes(3))" class="th purple">R-</div>
              </div>
              <div class="expense-table-body scrollbar">
                <div class="tbody" v-for="el,idx in fetchData?.dailyDocuments" :key="idx">
                  <div class="td">{{dateFilter2(el?.date?.month+'/'+el?.date?.day+'/'+el?.date?.year) || '-'}}</div>
                  <div class="td" v-if="(!setedArr.length || setedArr.includes(0))">{{chartOption3.options?.[0]?.data[idx]?.toFixed(2) || '-'}}</div>
                  <div class="td" v-if="(!setedArr.length || setedArr.includes(1))">{{chartOption3.options?.[1]?.data[idx]?.toFixed(2) || '-'}}</div>
                  <div class="td" v-if="(!setedArr.length || setedArr.includes(2))">{{chartOption3.options?.[2]?.data[idx]?.toFixed(2) || '-'}}</div>
                  <div class="td" v-if="(!setedArr.length || setedArr.includes(3))">{{chartOption3.options?.[3]?.data[idx]?.toFixed(2) || '-'}}</div>
                </div>
              </div>
              <div class="tbody-total" v-if="fetchData?.dailyDocuments?.length">
                <div v-if="fetchData?.dailyDocuments" class="th">{{$locale['general'][$i18n.locale.value]}}</div>
                <div v-if="(!setedArr.length || setedArr.includes(0))" class="th green">{{chartOption3.options?.[0]?.total?.toFixed(2) || '-'}}</div>
                <div v-if="(!setedArr.length || setedArr.includes(1))" class="th green">{{chartOption3.options?.[1]?.total?.toFixed(2) || '-'}}</div>
                <div v-if="(!setedArr.length || setedArr.includes(2))" class="th green">{{chartOption3.options?.[2]?.total?.toFixed(2) || '-'}}</div>
                <div v-if="(!setedArr.length || setedArr.includes(3))" class="th green">{{chartOption3.options?.[3]?.total?.toFixed(2) || '-'}}</div>
              </div>
            </div>
          </div>
          <div class="expense-energy-monthly">
            <h3 class="bg-gradient-text">{{$locale['energyConsumptionPerMonth'][$i18n.locale.value]}}</h3>
            <div class="line-chart hor-scrollbar">
              <chart :maxHeight="maxItem" :height="height" :chartOptions="chartOption" v-if="!saveMe && chartOption.options.length>0"/>
            </div>
          </div>
        </div>
        <div class="expense-energy-yearly">
            <h3 class="bg-gradient-text">{{$locale['energyConsumptionPerYear'][$i18n.locale.value]}} {{filter.year}} {{$locale['energyConsumptionYear'][$i18n.locale.value]}}</h3>
            <div class="line-chart  hor-scrollbar">
              <chart2 maxWidth="100%" :maxHeight="maxItem2" :height="height" :chartOptions="chartOption2" v-if="!saveMe && chartOption2.options.length>0"/>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import icons from '../components/icons.vue';
import TreeParentFirst from '../components/menu/TreeParentFirst.vue';
import TreeParentFirstReport from '../components/menu/TreeParentFirstReport.vue';
import datepickerMonth from '../components/datepicker/datepickerMonth.vue';
import datepickerYear from '../components/datepicker/datepickerYear.vue';
import chart from '../components/charts/chart-dashboard.vue';
import chart2 from '../components/charts/chart-dashboard-yearly.vue';
export default {
  data() {
    return {
      open: false,
      div: null,
      div2: null,
      openDAte: false,
      openDAte2: false,
      openDAte3: false,
      saveMe: false,
      openBlock: true,
      arrow: `
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.95998 4.47501L6.69998 7.73501C6.31498 8.12001 5.68498 8.12001 5.29998 7.73501L2.03998 4.47501" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
      chartOption:{
        lineColor:'#000000',
        dataLeft: [],
        labels: [],
        options: []
      },
      chartOption2:{
        lineColor:'#000000',
        dataLeft: [20000, 15000, 10000, 5000, 0],
        labels: [],
        options: []
      },
      chartOption3:{
        lineColor:'#000000',
        dataLeft: [20000, 15000, 10000, 5000, 0],
        labels: [],
        options: []
      },
      filter: {
        year: (new Date()).getFullYear(),
        month: ((new Date()).getMonth()+1),
      },
      inpFilter: {
        year: (new Date()).getFullYear(),
        month: null,
      },
      data: [],
      allArr: [],
      setedArr: [],
      data2: [],
      id: null,
      realtime: null,
      maxItem: 0,
      maxItem2: 0,
      fetchData: null,
      isReportObject: false,
      interval:null,
      beforeFLBValue: 100,
      beforeFLBValue2: 100,
      height: 240,
    };
  },
  components:{
    icons,
    datepickerMonth,
    datepickerYear,
    TreeParentFirst,
    chart,
    TreeParentFirstReport,
    chart2
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
    beforeFLB(){
      let len = document.getElementsByClassName('fbl')?.length || 100
      this.beforeFLBValue = len
    },
    beforeFLB2(){
      let len = document.getElementsByClassName('fbl2')?.length || 100
      this.beforeFLBValue2 = len
    },
    setArr(idx){
      if(!this.setedArr.includes(idx)){
        this.setedArr.push(idx)
      }else{
        this.setedArr.splice(this.setedArr.indexOf(idx), 1)
      }
      this.opener()
      this.getEmit(this.id)
    },
    async getEmitForReport(e){
      this.id = e
      this.isReportObject = true
      this.getEmit(this.id)
    },
    setDate(e,type){
      this.filter[type] = e.val
      this.inpFilter[type] = e?.format
      this.getEmit(this.id)
      this.opener()
    },
    unFocus() {
      let els = document.getElementsByClassName('div');
      for(let i=0;i<els.length;i++){
        els[i].classList.remove('isFocus')
      }
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
    dateFilter2(e){
      if(e){
        let date = new Date(e)
        let newdate = ('0'+date.getDate()).slice(-2)+'.'+('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
        return  newdate
      }else{
        return "-"
      }
    },
    async getEmit(e){
      this.saveMe = true
      this.beforeFLB()
      this.beforeFLB2()
      this.id = e
      this.chartOption3.options = []
      this.chartOption.options = []
      this.chartOption2.options = []
      this.fetchData = null
      let requestName = this.isReportObject === true ? ('/dashboard/calculation/'+e):('/dashboard/data/'+e)
      await this.$axios.get(requestName,{params:{...this.filter}}).then((res) => {
        this.fetchData = res?.data?.data
        let chartAP = []
        let chartAM = []
        let chartRP = []
        let chartRM = []
        let labels = []
        let chartAP2 = []
        let chartAM2 = []
        let chartRP2 = []
        let chartRM2 = []
        let labels2 = []
        let total = [0,0,0,0]
        this.fetchData?.dailyDocuments?.forEach((res,index)=>{
          chartAP[index] = (res?.['energyarchive_A+'] || 0)
          total[0] += (chartAP[index] || 0)
          chartRP[index] = (res?.['energyarchive_R+'] || 0)
          total[1] += (chartRP[index] || 0)
          chartAM[index] = (res?.['energyarchive_A-'] || 0)
          total[2] += (chartAM[index] || 0)
          chartRM[index] = (res?.['energyarchive_R-'] || 0)
          total[3] += (chartRM[index] || 0)
          labels[index] = ((res?.date?.month+'/'+res?.date?.day+'/'+res?.date?.year) || '-')
        })
        if(chartAP.length||chartAM.length||chartRP.length||chartRM.length){
          let maxItem = Math.max((Math.max(...chartAP)||0),(Math.max(...chartAM)||0),(Math.max(...chartRP)||0),(Math.max(...chartRM)||0))
          this.maxItem = maxItem
          for(let i=4;i>=0;i--){
            this.chartOption.dataLeft[4-i] = (this.maxItem*i*1.1/4)
          }
        }
        this.fetchData?.monthlyDocuments?.forEach((res,index)=>{
          if(res.param == "energyarchive_A+"){
            chartAP2[index] = (res?.value || 0)
          }
          chartAP2[index] = (res?.['energyarchive_A+'] || 0)
          chartRP2[index] = (res?.['energyarchive_R+'] || 0)
          chartAM2[index] = (res?.['energyarchive_A-'] || 0)
          chartRM2[index] = (res?.['energyarchive_R-'] || 0)
          labels2[index] = ((res?.date?.month+'/'+res?.date?.year) || '-')
        })
        let maxItem2 = Math.max((chartAP2.length ? Math.max(...chartAP2) : 0),(chartAM2.length ? Math.max(...chartAM2) : 0),(chartRP2.length ? Math.max(...chartRP2) : 0),(chartRM2.length ? Math.max(...chartRM2) : 0))
        this.maxItem2 = maxItem2
        for(let i=4;i>=0;i--){
          this.chartOption2.dataLeft[4-i] = (this.maxItem2*i*1.1/4)
        }
        let chartOption_options=[
          {data:chartAP,labels:labels,label:'A+',total:total[0],strokeColor: '#987704',strokeWidth: 2, active: false},
          {data:chartRP,labels:labels,label:'R+',total:total[1],strokeColor: '#0057FF',strokeWidth: 2, active: false},
          {data:chartAM,labels:labels,label:'A-',total:total[2],strokeColor: '#008A00',strokeWidth: 2, active: false},
          {data:chartRM,labels:labels,label:'R-',total:total[3],strokeColor: '#AD00FF',strokeWidth: 2, active: false},
        ]
        let chartOption_options2=[
          {data:chartAP2,labels:labels2,label:'A+',strokeColor: '#987704',strokeWidth: 2, active: false},
          {data:chartRP2,labels:labels2,label:'R+',strokeColor: '#0057FF',strokeWidth: 2, active: false},
          {data:chartAM2,labels:labels2,label:'A-',strokeColor: '#008A00',strokeWidth: 2, active: false},
          {data:chartRM2,labels:labels2,label:'R-',strokeColor: '#AD00FF',strokeWidth: 2, active: false},
        ]
        if(this.setedArr.length){
          this.chartOption.options = []
          this.chartOption2.options = []
          this.setedArr && this.setedArr.forEach((el) => {
            this.chartOption.options.push(chartOption_options[el])
            this.chartOption2.options.push(chartOption_options2[el])
          })
        }else{
          this.chartOption.options = []
          this.chartOption2.options = []
          this.chartOption.options = (chartOption_options)
          this.chartOption2.options = (chartOption_options2)
        }
        this.chartOption3.options = (chartOption_options)
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.getEmit(e)
            }).catch((err)=>{
              console.log(err);
            })
          }
        }
      })
      this.$checkReq.setReq(false)
      this.getH()
      this.getH2()
      this.saveMe = false
      const _t = this
      let requestName2 = this.isReportObject === true ? ('/dashboard/report/real-time/'+this.id):('/dashboard/real-time/'+this.id)
      await this.$axios.get(requestName2).then((resrealtime)=>{
        clearInterval(this.interval)
        if(resrealtime?.data){
          this.realtime = resrealtime?.data?.data
          this.interval = setInterval(function() {
            _t.$axios.get(requestName2,{params:{..._t.filter}}).then((resrealtime)=>{
              if(resrealtime?.data){
                _t.realtime = resrealtime?.data?.data
              }
            }).catch(async (error)=>{
                const statusCode = (error.response || {}).status || -1;
                if (statusCode == 406) {
                  if(error.config.method == 'get'){
                    await _t.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                      localStorage.setItem('session',res?.data?.session)
                      await _t.$axios.get(requestName2,{params:{..._t.filter}}).then((resrealtime)=>{
                        if(resrealtime?.data){
                          _t.realtime = resrealtime?.data?.data
                        }
                      }).catch((err)=>{
                        console.log(err);
                      })
                    }).catch((err)=>{
                      console.log(err);
                    })
                  }
                }else{
                  clearInterval(this.interval)
                }
              })
          },30000)
        }
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await _t.$axios.get(requestName2).then((resrealtime)=>{
                if(resrealtime?.data){
                  _t.realtime = resrealtime?.data?.data
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
      this.isReportObject = false

    },
    opener(e){
      const fl = ['openDAte','openDAte2','openDAte3']
      this[e] = !this[e]
      fl.forEach((j)=>{if (j!=e) {
        this[j] = false
      }})
    }
  },
  async mounted() {
    let months = [
      {uz:"Yan",en:"Jan",ru:"Янв"},
      {uz:"Fev",en:"Feb",ru:"Фев"},
      {uz:"Mar",en:"Mar",ru:"Мар"},
      {uz:"Apr",en:"Apr",ru:"Апр"},
      {uz:"May",en:"May",ru:"Май"},
      {uz:"Iyun",en:"June",ru:"Июнь"},
      {uz:"Iyul",en:"July",ru:"Июль"},
      {uz:"Avg",en:"Aug",ru:"Авг"},
      {uz:"Sen",en:"Sept",ru:"Сен"},
      {uz:"Okt",en:"Oct",ru:"Окт"},
      {uz:"Noy",en:"Nov",ru:"Ноя"},
      {uz:"Dek",en:"Dec",ru:"Дек"},
    ];
    this.inpFilter.month = months[(new Date()).getMonth()]?.[this.$i18n.locale.value]
    this.beforeFLB()
    this.beforeFLB2()
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
    this.getH()
    this.getH2()
    let h = document.getElementsByClassName('line-chart')
    this.height = h ? (h[0]?.offsetHeight-16) : ''
    addEventListener("resize", () => {h ? this.height = (h?.[0]?.offsetHeight-16) : ''});
  },
};
</script>
<style>
</style>
  