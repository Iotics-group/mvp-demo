<template>
  <div class="wrapper">
    <div class="header">
      <h3>{{$locale['graph-panel-obj'][$i18n.locale.value]}}</h3>
      <div class="breadcrumbs">
        <p>{{$locale['graph-panel-obj'][$i18n.locale.value]}}</p>
        <img src="../assets/svg/arrR.svg" alt="">
        <p>{{$locale['graph'][$i18n.locale.value]}}</p>
      </div>
    </div>
    <div class="e-model g-panel table-diagram" @click="opener">
      <div class="model-dv w-33">
        <div :class="{openBlock: openBlock2==true }" class="model-block" @click.stop="unFocus">
          <h5 class="recmenu">
            <p class="line-1">{{$locale['elect_model'][$i18n.locale.value]}}</p>
            <span @click.stop="openBlock2 = true">-</span>
          </h5>
          <div class="wrapblock">
            <div class="beforeB" :style="div ? ('height:'+(div)+'px') : ''">
              <div class="beforeFLB" :style="'top:'+(64*(index)+21) + 'px;'" v-for="el,index in beforeFLBValue" :key="index"></div>
            </div>
            <div id="emodel1" class="model-div">
              <ul class="tree-menu">
                <TreeParentFirst :beforeFLBValue="beforeFLBValue" :first="data[0]" @click.stop="getH" accessEmits="getId,activeParam" @getId="getEmit($event)" @activeParam="activeParam($event)" v-for="(item,index) in data" :key="index" class="tree-item" :model="item"></TreeParentFirst>
              </ul>
            </div>
          </div>
        </div>
        <div :class="{openBlock: openBlock2==false }" class="model-block" @click.stop="unFocus">
          <h5 class="recmenu">
            <p class="line-1">{{$locale['calc_model'][$i18n.locale.value]}}</p>
            <span @click.stop="openBlock2 = false">-</span>
          </h5>
          <div class="wrapblock">
            <div class="beforeB" :style="div2 ? ('height:'+(div2)+'px') : ''">
              <div class="beforeFLB" :style="'top:'+(64*(index)+21) + 'px;'" v-for="el,index in beforeFLBValue2" :key="index"></div>
            </div>
            <div id="emodel2" class="model-div">
              <ul class="tree-menu">  
                <TreeParentFirstReport :beforeFLBValue="beforeFLBValue2" @click.stop="getH2" accessEmits="getId" :icon="false" @getId="getEmitForReport($event)" v-for="(item,index) in data2" :key="index" class="tree-item" :model="item"></TreeParentFirstReport>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="model-dv w-67">
        <div :class="{openBlock: openBlock==true }" class="model-block">
          <div class="content-wrapper">
            <div class="area-chart height1">
              <h3 class="bg-gradient-text">
                <p>{{$locale['archiveDataObj'][$i18n.locale.value]}}</p>
                <span @click.stop="openBlock = true">-</span>
              </h3>
              <div class="calendar-blocks">
                <div class="calendar-block">
                  <label :title="$locale['dataDisplay'][$i18n.locale.value]" for="">{{$locale['dataDisplay'][$i18n.locale.value]}}</label>
                  <p class="calendar-input" @click.stop="opener('a_openDAte')"><span class="line-1">{{setedArr.length == chartOption2.options.length ? $locale['all'][$i18n.locale.value] : (chartOption2.options[setedArr[0]]?.label||$locale['all'][$i18n.locale.value])}}</span> <span v-if="(setedArr.length > 1)&&(setedArr.length != chartOption2.options.length)">+{{Number(setedArr.length)-1}}</span> <icons icon="arrDown"/></p>
                  <div v-if="a_openDAte" class="select-options">
                    <div v-for="el,index in chartOption2.options" @click.stop="setArr(index)" :key="index" class="select-option">
                      <span :class="(setedArr.includes(index))?'checked':'notCheck'"><span v-if="(setedArr.includes(index))">&#10003;</span></span>
                      {{el.label}}
                    </div>
                  </div>
                </div>
                <div @click.stop class="calendar-block">
                  <label for="">{{$locale['startDate'][$i18n.locale.value]}}</label>
                  <p class="calendar-input" @click="opener('a_openDAte2')">{{inpFilter.date1 || $locale['ddmmyyyy'][$i18n.locale.value]}} <icons icon="calendar"/></p>
                  <datepicker :changedDate="filter.date1" @date="setdate($event,'date1')" v-if="a_openDAte2"/>
                </div>
                <div @click.stop class="calendar-block">
                  <label for="">{{$locale['finishDate'][$i18n.locale.value]}}</label>
                  <p class="calendar-input" @click="opener('a_openDAte3')">{{inpFilter.date2 || $locale['ddmmyyyy'][$i18n.locale.value]}} <icons icon="calendar"/></p>
                  <datepicker :changedDate="filter.date2" @date="setdate($event,'date2')" v-if="a_openDAte3"/>
                </div>
              </div>
              <chart @gpaginate="gpaginate" @drawable="getIndex($event)" v-if="!loading && times" :height="height" :chartOptions="chartOption" :times="times"/>
              <p v-else-if="loading" class="pre-loader">{{$locale['dataUploading'][$i18n.locale.value]}}</p>
            </div>
          </div>
        </div>
        <div :class="{openBlock: openBlock==false }" class="model-block">
          <div class="content-wrapper">
            <div class="area-chart area-chart2 height2">
              <h3 class="bg-gradient-text">
                <p>{{$locale['currentDataObj'][$i18n.locale.value]}}</p>
                <span @click.stop="openBlock = false">-</span>
              </h3>
              <div class="calendar-blocks">
                <div class="calendar-block">
                  <label :title="$locale['dataDisplay'][$i18n.locale.value]" for="">{{$locale['dataDisplay'][$i18n.locale.value]}}</label>
                  <p class="calendar-input" @click.stop="opener('c_openDAte')"><span class="line-1">{{setedArr2.length == chartCurrently2.length ? $locale['all'][$i18n.locale.value] : (chartCurrently2[setedArr2[0]]?.label||$locale['all'][$i18n.locale.value])}}</span> <span v-if="(setedArr2.length > 1)&&(setedArr2.length != chartCurrently.length)">+{{Number(setedArr2.length)-1}}</span> <icons icon="arrDown"/></p>
                  <div v-if="c_openDAte" class="select-options">
                    <div v-for="el,index in chartCurrently2" @click.stop="setArr2(index)" :key="index" class="select-option"><span :class="(setedArr2.includes(index))?'checked':'notCheck'"><span v-if="(setedArr2.includes(index))">&#10003;</span></span>{{el.label}}</div>
                  </div>
                </div>
                <div @click.stop class="calendar-block">
                  <label for="">{{$locale['startDate'][$i18n.locale.value]}}</label>
                  <p class="calendar-input" @click="opener('c_openDAte2')">{{inpFilter2.date1 || $locale['ddmmyyyy'][$i18n.locale.value]}} <icons icon="calendar"/></p>
                  <datepicker :changedDate="filter2.date1" @date="setdate2($event,'date1')" v-if="c_openDAte2"/>
                </div>
                <div @click.stop class="calendar-block">
                  <label for="">{{$locale['finishDate'][$i18n.locale.value]}}</label>
                  <p class="calendar-input" @click="opener('c_openDAte3')">{{inpFilter2.date2 || $locale['ddmmyyyy'][$i18n.locale.value]}} <icons icon="calendar"/></p>
                  <datepicker :changedDate="filter2.date2" @date="setdate2($event,'date2')" v-if="c_openDAte3"/>
                </div>
              </div>
              <chartCurrent @gpaginate="gpaginateCurrent" v-if="!loading && times2" :height="height" :chartCurrently="chartCurrently" :times="times2"/>
              <p v-else-if="loading && !times2" class="pre-loader">{{$locale['dataUploading'][$i18n.locale.value]}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import chart from '../components/charts/chart-line.vue'
import chartCurrent from '../components/charts/chart-lineCurrent.vue'
import TreeParentFirstReport from '../components/menu/TreeParentFirstReport.vue';
import TreeParentFirst from '../components/menu/TreeParentFirst.vue';
import icons from '../components/icons.vue'
import datepicker from '../components/datepicker/datepicker.vue'
export default {
  data() {
    return {
      div: null,
      div2: null,
      open: false,
      a_openDAte: false,
      a_openDAte2: false,
      a_openDAte3: false,
      c_openDAte: false,
      c_openDAte2: false,
      c_openDAte3: false,
      c_openDAte4: false,
      c_openDAte5: false,
      loading: false,
      openBlock: true,
      openBlock2: true,
      saveMe: false,
      timeout: null,
      timeout2: null,
      dataArr: [],
      dataArr2: [],
      height: 276,
      chartOption:{
        lineColor:'#000000',
        dataLeft: [200000, 100000, 0, -100000, -200000],
        options: []
      },
      chartCurrently: [],
      chartCurrently2: [],
      chartOption2:{
        lineColor:'#000000',
        dataLeft: [200000, 100000, 0, -100000, -200000],
        options: []
      },
      arrow: `
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.95998 4.47501L6.69998 7.73501C6.31498 8.12001 5.68498 8.12001 5.29998 7.73501L2.03998 4.47501" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
      data: [],
      id: null,
      filter: {
        date1: null,
        date2: null,
      },
      filter2: {
        date1: null,
        date2: null,
      },
      inpFilter: {
        date1: null,
        date2: null,
      },
      inpFilter2: {
        date1: null,
        date2: null,
      },
      data2: [],
      chart: [],
      times: [],
      times2: [],
      setedArr: [],
      setedArr2: [],
      beforeFLBValue: 100,
      isReportObject: false,
      beforeFLBValue2: 100,
      removable: [],
      oldfilter_date1:null,
      oldfilter_date2:null,
    };
  },
  components:{
    chart,
    TreeParentFirst,
    TreeParentFirstReport,
    chartCurrent,
    icons,
    datepicker
  },
  methods: {
    getH(){
      if(this.oldfilter_date1){
        this.filter.date2 = this.oldfilter_date1
      }
      if(this.oldfilter_date2){
        this.filter2.date2 = this.oldfilter_date2
      }
      const t = this
      setTimeout(() => {
        t.div = document.getElementById('emodel1')?.clientHeight
      }, 1000);
    },
    getH2(){
      if(this.oldfilter_date1){
        this.filter.date2 = this.oldfilter_date1
      }
      if(this.oldfilter_date2){
        this.filter2.date2 = this.oldfilter_date2
      }
      const t = this
      setTimeout(() => {
        t.div2 = document.getElementById('emodel2')?.clientHeight
      }, 1000);
    },
    async getIndex(e){
      await this.setArr(e)
    },
    beforeFLB(){
      let len = document.getElementsByClassName('fbl')?.length || 100
      this.beforeFLBValue = len
    },
    beforeFLB2(){
      let len = document.getElementsByClassName('fbl2')?.length || 100
      this.beforeFLBValue2 = len
    },
    unFocus() {
      let els = document.getElementsByClassName('div');
      for(let i=0;i<els.length;i++){
        els[i].classList.remove('isFocus')
      }
    },
    setdate(e,type){
      let date = new Date(e?.unformat)
      let date1 = date && date?.toISOString()
      this.filter[type] = date1
      this.oldfilter_date1 = this.filter.date2
      this.inpFilter[type] = e?.format
      if(this.filter.date1 && this.filter.date2) {
        if((new Date(this.filter.date1)) - (new Date(this.filter.date2)) > 0){
          this.filter.date1 = this.filter.date2
          this.inpFilter[type] = (new Date(this.filter.date2)).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
      }
      this.opener()
      this.times = null
      this.times2 = null
      this.getId(this.id)
    },
    setdate2(e,type){
      let date = new Date(e?.unformat)
      let date1 = date && date?.toISOString()
      this.filter2[type] = date1
      this.oldfilter_date2 = this.filter2.date2
      this.inpFilter2[type] = e?.format
      if(this.filter2.date1 && this.filter2.date2) {
        if((new Date(this.filter2.date1)) - (new Date(this.filter2.date2)) > 0){
          this.filter2.date1 = this.filter2.date2
          this.inpFilter2[type] = (new Date(this.filter2.date2)).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
      }
      this.opener()
      this.times = null
      this.times2 = null
      this.getId(this.id)
    },
    gpaginate(){
      clearTimeout(this.timeout)
      const _t = this
      let finishDate = (new Date(Number(Object.keys(this.times)[Object.keys(this.times).length-1]))).toISOString()
      if(finishDate == _t.filter.date2) {return}
      this.timeout = setTimeout(() => {
        _t.filter.date2 = finishDate
        _t.getId(this.id)
      }, 1000);
    },
    gpaginateCurrent(){
      clearTimeout(this.timeout2)
      const _t = this
      let finishDate2 = (new Date(Number(Object.keys(this.times2)[Object.keys(this.times2).length-1]))).toISOString()
      if(finishDate2 == _t.filter2.date2) {return}
      this.timeout2 = setTimeout(() => {
        _t.filter2.date2 = finishDate2
        _t.getId(this.id)
      }, 1000);
    },
    async getEmit(e){
      this.id = e
      this.isReportObject = false
      this.times = null
      this.times2 = null
      if(this.oldfilter_date1){
        this.filter.date2 = this.oldfilter_date1
      }
      if(this.oldfilter_date2){
        this.filter2.date2 = this.oldfilter_date2
      }
      await this.getId(e)
      this.getH()
      this.getH2()
    },
    async getEmitForReport(e){
      this.id = e
      this.isReportObject = true
      this.times = null
      this.times2 = null
      if(this.oldfilter_date1){
        this.filter.date2 = this.oldfilter_date1
      }
      if(this.oldfilter_date2){
        this.filter2.date2 = this.oldfilter_date2
      }
      await this.getId(e)
      this.getH()
      this.getH2()
    },
    activeParam(e){
      this.active = e
    },
    async setArr(idx){
      if(!this.setedArr.includes(idx)){          //checking weather array contain the id
        this.setedArr.push(idx);               //adding to array because value doesnt exists
      }else{
        this.setedArr.splice(this.setedArr.indexOf(idx), 1);  //deleting
      }
      await this.getId(this.id)
    },
    async setArr2(idx){
      if(!this.setedArr2.includes(idx)){          //checking weather array contain the id
        this.setedArr2.push(idx);               //adding to array because value doesnt exists
      }else{
        this.setedArr2.splice(this.setedArr2.indexOf(idx), 1);  //deleting
      }
      await this.getId(this.id)
    },
    opener(e){
      const fl = ['a_openDAte','a_openDAte2','a_openDAte3','c_openDAte','c_openDAte2','c_openDAte3','c_openDAte4','c_openDAte5']
      this[e] = !this[e]
      fl?.forEach((j)=>{if (j!=e) {
        this[j] = false
      }})
    },
    async getId(e){
    if (e) {
      this.id = e
      this.loading = true
      let requestName = this.isReportObject === true ? ('/graph/calculation-archive/'+e):('/graph/data-archive/'+e)
      let requestName2 = this.isReportObject === true ? ('/graph/calculation-current/'+e):('/graph/data-current/'+e)
      this.chartOption = []
      let filter = {...this.filter}
      filter.date2 = (new Date(new Date(filter.date2).getFullYear(),(new Date(filter.date2).getMonth()),(new Date(filter.date2).getDate()+1))).toISOString()
      let filter2 = {...this.filter2}
      filter2.date2 = (new Date(new Date(filter2.date2).getFullYear(),(new Date(filter2.date2).getMonth()),(new Date(filter2.date2).getDate()+1))).toISOString()
      await this.$axios.get(requestName, {params: {...filter}}).then((res) => {
        if(res?.data){
          this.times = {...this.times,...res?.data?.data}
          let chartAP = []
          let chartAM = []
          let chartRP = []
          let chartRM = []
          let times = []
          res?.data && Object.keys(this.times).map((k,index)=>{
            times[index] = k
            chartAP[index] = ((this.times)[k]['energyarchive_A+']?.value || 0)
            chartRP[index] = ((this.times)[k]['energyarchive_R+']?.value || 0)
            chartAM[index] = ((this.times)[k]['energyarchive_A-']?.value || 0)
            chartRM[index] = ((this.times)[k]['energyarchive_R-']?.value || 0)
          })
          let chartOption_options=[
            {data:chartAP, times: times, label:this.$locale['param_ap'][this.$i18n.locale.value],strokeColor: '#008A00',strokeWidth: 2, active: false},
            {data:chartRP, times: times, label:this.$locale['param_rp'][this.$i18n.locale.value],strokeColor: '#AD00FF',strokeWidth: 2, active: false},
            {data:chartAM, times: times, label:this.$locale['param_am'][this.$i18n.locale.value],strokeColor: '#0057FF',strokeWidth: 2, active: false},
            {data:chartRM, times: times, label:this.$locale['param_rm'][this.$i18n.locale.value],strokeColor: '#987704',strokeWidth: 2, active: false}]
          this.chartOption2.options=[
            {data:chartAP, times: times, label:this.$locale['param_ap'][this.$i18n.locale.value],strokeColor: '#008A00',strokeWidth: 2},
            {data:chartRP, times: times, label:this.$locale['param_rp'][this.$i18n.locale.value],strokeColor: '#AD00FF',strokeWidth: 2},
            {data:chartAM, times: times, label:this.$locale['param_am'][this.$i18n.locale.value],strokeColor: '#0057FF',strokeWidth: 2},
            {data:chartRM, times: times, label:this.$locale['param_rm'][this.$i18n.locale.value],strokeColor: '#987704',strokeWidth: 2}
          ]
          if(this.setedArr.length){
            this.chartOption.options = []
            this.setedArr && this.setedArr.forEach((el) => {
              if((Math.max(...chartOption_options[el].data))!=null){
                this.chartOption.options.push(chartOption_options[el])
              }
            })
          }else{
            let newOptions = []
            chartOption_options.forEach((el)=>{
              if((Math.max(...el.data))!=null){
                newOptions.push(el)
              }
            })
            this.chartOption.options = (newOptions)
          }
        }
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.getId(e)
            }).catch((err)=>{
              console.log(err);
            })
          }
        }
      })

      await this.$axios.get(requestName2, {params: {...filter2}}).then((res) => {
        this.chartCurrently = []
        this.chartCurrently2 = []
        if(res?.data){
          this.times2 = {...this.times2,...res?.data?.data}
          let voltage_A = []
          let voltage_B = []
          let voltage_C = []
          let voltage_AB = []
          let voltage_BC = []
          let voltage_AC = []
          let current_A = []
          let current_B = []
          let current_C = []
          let activepower_A = []
          let activepower_B = []
          let activepower_C = []
          let activepower_total = []
          let reactivepower_A = []
          let reactivepower_B = []
          let reactivepower_C = []
          let reactivepower_total = []
          let fullpower_A = []
          let fullpower_B = []
          let fullpower_C = []
          let fullpower_total = []
          let coefactivepower_A = []
          let coefactivepower_B = []
          let coefactivepower_C = []
          let coefactivepower_total = []
          let coefreactivepower_A = []
          let coefreactivepower_B = []
          let coefreactivepower_C = []
          let coefreactivepower_total = []
          let sinusfreactivepower_A = []
          let sinusfreactivepower_B = []
          let sinusfreactivepower_C = []
          let sinusfreactivepower_total = []
          let frequency = []
          let times = []
          res?.data && Object.keys(this.times2).map((k,index)=>{
            times[index] = k
            if((this.times2)[k] && ((this.times2)[k]["current_coef-active-power_A"]?.value == undefined) && (((this.times2)[k]["current_angle_UI_A"]?.value != undefined))){
              (this.times2)[k]["current_coef-active-power_A"] = 
              {
                value:  (Math.cos((this.times2)[k]["current_angle_UI_A"]?.value * Math.PI / 180))
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_coef-active-power_B"]?.value == undefined) && (((this.times2)[k]["current_angle_UI_B"]?.value != undefined))){
              (this.times2)[k]["current_coef-active-power_B"] = 
              {
                value:  (Math.cos((this.times2)[k]["current_angle_UI_B"]?.value * Math.PI / 180))
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_coef-active-power_C"]?.value == undefined) && (((this.times2)[k]["current_angle_UI_C"]?.value != undefined))){
              (this.times2)[k]["current_coef-active-power_C"] = 
              {
                value:  (Math.cos((this.times2)[k]["current_angle_UI_C"]?.value * Math.PI / 180))
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_coef-active-power_total"]?.value == undefined) && (((this.times2)[k]["current_coef-active-power_A"]?.value != undefined) || ((this.times2)[k]["current_coef-active-power_B"]?.value != undefined) || ((this.times2)[k]["current_coef-active-power_C"]?.value != undefined))){
              (this.times2)[k] = {
                ...(this.times2)[k],
                ["current_coef-active-power_total"]:{
                  value: ((((this.times2)[k]["current_coef-active-power_A"]?.value || 0) + ((this.times2)[k]["current_coef-active-power_B"]?.value || 0) + ((this.times2)[k]["current_coef-active-power_C"]?.value || 0))/3)
                }
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_sinusf-reactive-power_A"]?.value == undefined) && (((this.times2)[k]["current_angle_UI_A"]?.value != undefined))){
              (this.times2)[k]["current_sinusf-reactive-power_A"] = 
              {
                value:  (Math.sin((this.times2)[k]["current_angle_UI_A"]?.value * Math.PI / 180))
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_sinusf-reactive-power_B"]?.value == undefined) && (((this.times2)[k]["current_angle_UI_B"]?.value != undefined))){
              (this.times2)[k]["current_sinusf-reactive-power_B"] = 
              {
                value:  (Math.sin((this.times2)[k]["current_angle_UI_B"]?.value * Math.PI / 180))
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_sinusf-reactive-power_C"]?.value == undefined) && (((this.times2)[k]["current_angle_UI_C"]?.value != undefined))){
              (this.times2)[k]["current_sinusf-reactive-power_C"] = 
              {
                value:  (Math.sin((this.times2)[k]["current_angle_UI_C"]?.value * Math.PI / 180))
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_sinusf-reactive-power_total"]?.value == undefined) && (((this.times2)[k]["current_sinusf-reactive-power_A"]?.value != undefined) || ((this.times2)[k]["current_sinusf-reactive-power_B"]?.value != undefined) || ((this.times2)[k]["current_sinusf-reactive-power_C"]?.value != undefined))){
              (this.times2)[k] = {
                ...(this.times2)[k],
                ["current_sinusf-reactive-power_total"]:{
                  value: ((((this.times2)[k]["current_sinusf-reactive-power_A"]?.value || 0) + ((this.times2)[k]["current_sinusf-reactive-power_B"]?.value || 0) + ((this.times2)[k]["current_sinusf-reactive-power_C"]?.value || 0))/3)
                }
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_full-power_A"]?.value == undefined) && (((this.times2)[k]["current_voltage_A"]?.value != undefined) && ((this.times2)[k]["current_current_A"]?.value != undefined))){
              (this.times2)[k]["current_full-power_A"] = 
              {
                value:  (((this.times2)[k]["current_voltage_A"]?.value) * ((this.times2)[k]["current_current_A"]?.value)) / 1000
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_full-power_B"]?.value == undefined) && (((this.times2)[k]["current_voltage_B"]?.value != undefined) && ((this.times2)[k]["current_current_B"]?.value != undefined))){
              (this.times2)[k]["current_full-power_B"] = 
              {
                value:  (((this.times2)[k]["current_voltage_B"]?.value) * ((this.times2)[k]["current_current_B"]?.value)) / 1000
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_full-power_C"]?.value == undefined) && (((this.times2)[k]["current_voltage_C"]?.value != undefined) && ((this.times2)[k]["current_current_C"]?.value != undefined))){
              (this.times2)[k]["current_full-power_C"] = 
              {
                value:  (((this.times2)[k]["current_voltage_C"]?.value) * ((this.times2)[k]["current_current_C"]?.value)) / 1000
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_full-power_total"]?.value == undefined) && ((((this.times2)[k]["current_full-power_A"]?.value) != undefined) || (((this.times2)[k]["current_full-power_B"]?.value) != undefined) || (((this.times2)[k]["current_full-power_C"]?.value) != undefined))){
              (this.times2)[k] = {
                ...(this.times2)[k],
                ["current_full-power_total"]:{
                  value: (((this.times2)[k]["current_full-power_A"]?.value || 0) + ((this.times2)[k]["current_full-power_B"]?.value || 0) + ((this.times2)[k]["current_full-power_C"]?.value || 0))
                }
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_active-power_A"]?.value == undefined) && (((this.times2)[k]["current_voltage_A"]?.value != undefined) && ((this.times2)[k]["current_current_A"]?.value != undefined) && ((this.times2)[k]["current_coef-active-power_A"]?.value != undefined))){
              (this.times2)[k]["current_active-power_A"] = 
              {
                value:  (((this.times2)[k]["current_voltage_A"]?.value) * ((this.times2)[k]["current_current_A"]?.value) * ((this.times2)[k]["current_coef-active-power_A"]?.value)) / 1000
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_active-power_B"]?.value == undefined) && (((this.times2)[k]["current_voltage_B"]?.value != undefined) && ((this.times2)[k]["current_current_B"]?.value != undefined) && ((this.times2)[k]["current_coef-active-power_B"]?.value != undefined))){
              (this.times2)[k]["current_active-power_B"] = 
              {
                value:  (((this.times2)[k]["current_voltage_B"]?.value) * ((this.times2)[k]["current_current_B"]?.value) * ((this.times2)[k]["current_coef-active-power_B"]?.value)) / 1000
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_active-power_C"]?.value == undefined) && (((this.times2)[k]["current_voltage_C"]?.value) && ((this.times2)[k]["current_current_C"]?.value != undefined) && ((this.times2)[k]["current_coef-active-power_C"]?.value != undefined))){
              (this.times2)[k]["current_active-power_C"] = 
              {
                value:  (((this.times2)[k]["current_voltage_C"]?.value) * ((this.times2)[k]["current_current_C"]?.value) * ((this.times2)[k]["current_coef-active-power_C"]?.value)) / 1000
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_active-power_total"]?.value == undefined) && ((((this.times2)[k]["current_active-power_A"]?.value) != undefined) || (((this.times2)[k]["current_active-power_B"]?.value) != undefined) || (((this.times2)[k]["current_active-power_C"]?.value) != undefined))){
              (this.times2)[k] = {
                ...(this.times2)[k],
                ["current_active-power_total"]:
                {
                  value: (((this.times2)[k]["current_active-power_A"]?.value || 0) + ((this.times2)[k]["current_active-power_B"]?.value || 0) + ((this.times2)[k]["current_active-power_C"]?.value || 0))
                }
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_reactive-power_A"]?.value == undefined) && (((this.times2)[k]["current_voltage_A"]?.value != undefined) && ((this.times2)[k]["current_current_A"]?.value != undefined) && ((this.times2)[k]["current_coef-active-power_A"]?.value != undefined))){
              (this.times2)[k]["current_reactive-power_A"] = {value: (((this.times2)[k]["current_voltage_A"]?.value) * ((this.times2)[k]["current_current_A"]?.value) * ((this.times2)[k]["current_sinusf-reactive-power_A"]?.value))/1000}
            }
            if((this.times2)[k] && ((this.times2)[k]["current_reactive-power_B"]?.value == undefined) && (((this.times2)[k]["current_voltage_B"]?.value != undefined) && ((this.times2)[k]["current_current_B"]?.value != undefined) && ((this.times2)[k]["current_coef-active-power_B"]?.value != undefined))){
              (this.times2)[k]["current_reactive-power_B"] = {value: (((this.times2)[k]["current_voltage_B"]?.value) * ((this.times2)[k]["current_current_B"]?.value) * ((this.times2)[k]["current_sinusf-reactive-power_B"]?.value))/1000}
            }
            if((this.times2)[k] && ((this.times2)[k]["current_reactive-power_C"]?.value == undefined) && (((this.times2)[k]["current_voltage_C"]?.value != undefined) && ((this.times2)[k]["current_current_C"]?.value != undefined) && ((this.times2)[k]["current_coef-active-power_C"]?.value != undefined))){
              (this.times2)[k]["current_reactive-power_C"] = {value: (((this.times2)[k]["current_voltage_C"]?.value) * ((this.times2)[k]["current_current_C"]?.value) * ((this.times2)[k]["current_sinusf-reactive-power_C"]?.value))/1000}
            }
            if((this.times2)[k] && ((this.times2)[k]["current_reactive-power_total"]?.value == undefined) && ((((this.times2)[k]["current_reactive-power_A"]?.value) != undefined) || (((this.times2)[k]["current_reactive-power_B"]?.value) != undefined) || (((this.times2)[k]["current_reactive-power_C"]?.value) != undefined))){
              (this.times2)[k] = {
                ...(this.times2)[k],
                ["current_reactive-power_total"]:{
                  value: (((this.times2)[k]["current_reactive-power_A"]?.value || 0) + ((this.times2)[k]["current_reactive-power_B"]?.value || 0) + ((this.times2)[k]["current_reactive-power_C"]?.value || 0))
                }
              }
            }
            if(((this.times2)[k]?.["current_angle_UI_A"]?.value != undefined)){
              if((this.times2)[k] && ((this.times2)[k]["current_coef-reactive-power_A"]?.value == undefined)){
                  (this.times2)[k] = {
                    ...(this.times2)[k],
                    ["current_coef-reactive-power_A"]:{
                      value:  (Math.tan((this.times2)[k]?.["current_angle_UI_A"]?.value * Math.PI / 180))
                    }
                }
              }
            }else{
              if((this.times2)[k] && ((this.times2)[k]["current_coef-reactive-power_A"]?.value == undefined) && ((this.times2)[k]["current_coef-active-power_A"]?.value != undefined)){
                if(((this.times2)[k]["current_coef-active-power_A"]?.value) != 0) {
                if((1 / ((this.times2)[k]["current_coef-active-power_A"]?.value)**2) >= 1) {
                  (this.times2)[k] = {
                    ...(this.times2)[k],
                    ["current_coef-reactive-power_A"]:{
                      value: Math.sqrt((1 / (((this.times2)[k]["current_coef-active-power_A"]?.value)**2)) - 1)
                    }
                    }
                  }
                }
              }
            }
            
            if(((this.times2)[k]?.["current_angle_UI_B"]?.value != undefined)){
              if((this.times2)[k] && ((this.times2)[k]["current_coef-reactive-power_B"]?.value == undefined)){
                  (this.times2)[k] = {
                    ...(this.times2)[k],
                    ["current_coef-reactive-power_B"]:{
                      value:  (Math.tan((this.times2)[k]["current_angle_UI_B"]?.value * Math.PI / 180))
                    }
                  
                }
              }
            }else{
              if((this.times2)[k] && ((this.times2)[k]["current_coef-reactive-power_B"]?.value == undefined) && ((this.times2)[k]["current_coef-active-power_B"]?.value != undefined)){
                if(((this.times2)[k]["current_coef-active-power_B"]?.value) != 0) {
                if((1 / ((this.times2)[k]["current_coef-active-power_B"]?.value)**2) >= 1) {
                  (this.times2)[k] = {
                    ...(this.times2)[k],
                    ["current_coef-reactive-power_B"]:{
                      value: Math.sqrt((1 / (((this.times2)[k]["current_coef-active-power_B"]?.value)**2)) - 1)
                    }
                  
                    }
                  }
                }
              }
            }
            
            if(((this.times2)[k]?.["current_angle_UI_C"]?.value != undefined)){
              if((this.times2)[k] && ((this.times2)[k]["current_coef-reactive-power_C"]?.value == undefined)){
                  (this.times2)[k] = {
                    ...(this.times2)[k],
                    ["current_coef-reactive-power_C"]:{
                      value:  (Math.tan((this.times2)[k]["current_angle_UI_C"]?.value * Math.PI / 180))
                    }
                  
                }
              }
            }else{
              if((this.times2)[k] && ((this.times2)[k]["current_coef-reactive-power_C"]?.value == undefined) && ((this.times2)[k]["current_coef-active-power_C"]?.value != undefined)){
                if(((this.times2)[k]["current_coef-active-power_C"]?.value) != 0) {
                if((1 / ((this.times2)[k]["current_coef-active-power_C"]?.value)**2) >= 1) {
                  (this.times2)[k] = {
                    ...(this.times2)[k],
                    ["current_coef-reactive-power_C"]:{
                      value: Math.sqrt((1 / (((this.times2)[k]["current_coef-active-power_C"]?.value)**2)) - 1)
                    }
                    }
                  }
                }
              }
            }
            if((this.times2)[k] && ((this.times2)[k]["current_coef-reactive-power_total"]?.value == undefined) && ((((this.times2)[k]["current_coef-reactive-power_A"]?.value) != undefined) || (((this.times2)[k]["current_coef-reactive-power_B"]?.value) != undefined) || (((this.times2)[k]["current_coef-reactive-power_C"]?.value) != undefined))){
              (this.times2)[k] = {
                ...(this.times2)[k],
                ["current_coef-reactive-power_total"]:{
                  value: (((this.times2)[k]["current_coef-reactive-power_A"]?.value || 0) + ((this.times2)[k]["current_coef-reactive-power_B"]?.value || 0) + ((this.times2)[k]["current_coef-reactive-power_C"]?.value || 0))/3
                }
              }
            }
            voltage_A[index] = ((this.times2)[k]['current_voltage_A']?.value || (index!=0 ? voltage_A[index - 1] : 0))
            voltage_B[index] = ((this.times2)[k]['current_voltage_B']?.value || (index!=0 ? voltage_B[index - 1] : 0))
            voltage_C[index] = ((this.times2)[k]['current_voltage_C']?.value || (index!=0 ? voltage_C[index - 1] : 0))
            voltage_AB[index] = ((this.times2)[k]['current_voltage_line_A']?.value || Number(((Math.sqrt(3))*(this.times2)[k]['current_voltage_A']?.value)?.toFixed(2)) || (index!=0 ? voltage_AB[index - 1] : 0))
            voltage_BC[index] = ((this.times2)[k]['current_voltage_line_B']?.value || Number(((Math.sqrt(3))*(this.times2)[k]['current_voltage_B']?.value)?.toFixed(2)) || (index!=0 ? voltage_BC[index - 1] : 0))
            voltage_AC[index] = ((this.times2)[k]['current_voltage_line_C']?.value || Number(((Math.sqrt(3))*(this.times2)[k]['current_voltage_C']?.value)?.toFixed(2)) || (index!=0 ? voltage_AC[index - 1] : 0))
            current_A[index] = ((this.times2)[k]['current_current_A']?.value || (index!=0 ? current_A[index - 1] : 0))
            current_B[index] = ((this.times2)[k]['current_current_B']?.value || (index!=0 ? current_B[index - 1] : 0))
            current_C[index] = ((this.times2)[k]['current_current_C']?.value || (index!=0 ? current_C[index - 1] : 0))
            activepower_A[index] = ((this.times2)[k]['current_active-power_A']?.value || (index!=0 ? activepower_A[index - 1] : 0))
            activepower_B[index] = ((this.times2)[k]['current_active-power_B']?.value || (index!=0 ? activepower_B[index - 1] : 0))
            activepower_C[index] = ((this.times2)[k]['current_active-power_C']?.value || (index!=0 ? activepower_C[index - 1] : 0))
            activepower_total[index] = ((this.times2)[k]['current_active-power_total']?.value || (index!=0 ? activepower_total[index - 1] : 0))
            reactivepower_A[index] = ((this.times2)[k]['current_reactive-power_A']?.value || (index!=0 ? reactivepower_A[index - 1] : 0))
            reactivepower_B[index] = ((this.times2)[k]['current_reactive-power_B']?.value || (index!=0 ? reactivepower_B[index - 1] : 0))
            reactivepower_C[index] = ((this.times2)[k]['current_reactive-power_C']?.value || (index!=0 ? reactivepower_C[index - 1] : 0))
            reactivepower_total[index] = ((this.times2)[k]['current_reactive-power_total']?.value || (index!=0 ? reactivepower_total[index - 1] : 0))
            fullpower_A[index] = ((this.times2)[k]['current_full-power_A']?.value || (index!=0 ? fullpower_A[index - 1] : 0))
            fullpower_B[index] = ((this.times2)[k]['current_full-power_B']?.value || (index!=0 ? fullpower_B[index - 1] : 0))
            fullpower_C[index] = ((this.times2)[k]['current_full-power_C']?.value || (index!=0 ? fullpower_C[index - 1] : 0))
            fullpower_total[index] = ((this.times2)[k]['current_full-power_total']?.value || (index!=0 ? fullpower_total[index - 1] : 0))
            coefactivepower_A[index] = ((this.times2)[k]['current_coef-active-power_A']?.value || (index!=0 ? coefactivepower_A[index - 1] : 0))
            coefactivepower_B[index] = ((this.times2)[k]['current_coef-active-power_B']?.value || (index!=0 ? coefactivepower_B[index - 1] : 0))
            coefactivepower_C[index] = ((this.times2)[k]['current_coef-active-power_C']?.value || (index!=0 ? coefactivepower_C[index - 1] : 0))
            coefactivepower_total[index] = ((this.times2)[k]['current_coef-active-power_total']?.value || (index!=0 ? coefactivepower_total[index - 1] : 0))
            coefreactivepower_A[index] = ((this.times2)[k]['current_coef-reactive-power_A']?.value || (index!=0 ? coefreactivepower_A[index - 1] : 0))
            coefreactivepower_B[index] = ((this.times2)[k]['current_coef-reactive-power_B']?.value || (index!=0 ? coefreactivepower_B[index - 1] : 0))
            coefreactivepower_C[index] = ((this.times2)[k]['current_coef-reactive-power_C']?.value || (index!=0 ? coefreactivepower_C[index - 1] : 0))
            coefreactivepower_total[index] = ((this.times2)[k]['current_coef-reactive-power_total']?.value || (index!=0 ? coefreactivepower_total[index - 1] : 0))
            sinusfreactivepower_A[index] = ((this.times2)[k]['current_sinusf-reactive-power_A']?.value || (index!=0 ? sinusfreactivepower_A[index - 1] : 0))
            sinusfreactivepower_B[index] = ((this.times2)[k]['current_sinusf-reactive-power_B']?.value || (index!=0 ? sinusfreactivepower_B[index - 1] : 0))
            sinusfreactivepower_C[index] = ((this.times2)[k]['current_sinusf-reactive-power_C']?.value || (index!=0 ? sinusfreactivepower_C[index - 1] : 0))
            sinusfreactivepower_total[index] = ((this.times2)[k]['current_sinusf-reactive-power_total']?.value || (index!=0 ? sinusfreactivepower_total[index - 1] : 0))
            frequency[index] = ((this.times2)[k]['current_frequency']?.value || (index!=0 ? frequency[index - 1] : 0))
          })
          let chartOption_options = {
            label: this.$locale['voltage'][this.$i18n.locale.value],
            options: [
              {data:voltage_A,times: times,label:this.$locale['voltage'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' A',strokeColor: '#987704',strokeWidth: 2},
              {data:voltage_B,times: times,label:this.$locale['voltage'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' B',strokeColor: '#AD00FF',strokeWidth: 2},
              {data:voltage_C,times: times,label:this.$locale['voltage'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' C',strokeColor: '#008A00',strokeWidth: 2},
              {data:voltage_AB,times: times,label:this.$locale['voltage'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' AB',strokeColor: '#0057FF',strokeWidth: 2},
              {data:voltage_BC,times: times,label:this.$locale['voltage'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' BC',strokeColor: '#b942f5',strokeWidth: 2},
              {data:voltage_AC,times: times,label:this.$locale['voltage'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' AC',strokeColor: '#459c13',strokeWidth: 2}
            ]
          };
          let chartOption_options2 = {
            label: this.$locale['current'][this.$i18n.locale.value],
            options: [
              {data:current_A,times: times,label:this.$locale['current'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' A',strokeColor: '#987704',strokeWidth: 2},
              {data:current_B,times: times,label:this.$locale['current'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' B',strokeColor: '#AD00FF',strokeWidth: 2},
              {data:current_C,times: times,label:this.$locale['current'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' C',strokeColor: '#008A00',strokeWidth: 2}
            ]
          }
            let chartOption_options3={
            label: this.$locale['activePower'][this.$i18n.locale.value],
            options: [
              {data:activepower_A,times: times,label:this.$locale['activePower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' А',strokeColor: '#987704',strokeWidth: 2},
              {data:activepower_B,times: times,label:this.$locale['activePower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' B',strokeColor: '#AD00FF',strokeWidth: 2},
              {data:activepower_C,times: times,label:this.$locale['activePower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' C',strokeColor: '#AD00FF',strokeWidth: 2},
              {data:activepower_total,times: times,label:this.$locale['activePower'][this.$i18n.locale.value],label2:this.$locale['general'][this.$i18n.locale.value],strokeColor: '#008A00',strokeWidth: 2}
            ]
          }
          let chartOption_options4={
            label: this.$locale['reactivePower'][this.$i18n.locale.value],
            options: [
              {data:reactivepower_A,times: times,label:this.$locale['reactivePower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' A',strokeColor: '#987704',strokeWidth: 2},
              {data:reactivepower_B,times: times,label:this.$locale['reactivePower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' B',strokeColor: '#AD00FF',strokeWidth: 2},
              {data:reactivepower_C,times: times,label:this.$locale['reactivePower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' C',strokeColor: '#AD00FF',strokeWidth: 2},
              {data:reactivepower_total,times: times,label:this.$locale['reactivePower'][this.$i18n.locale.value],label2:this.$locale['general'][this.$i18n.locale.value],strokeColor: '#008A00',strokeWidth: 2}
            ]
          }
          let chartOption_options5={
            label: this.$locale['fullPower'][this.$i18n.locale.value],
            options: [
              {data:fullpower_A,times: times,label:this.$locale['fullPower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' А',strokeColor: '#987704',strokeWidth: 2},
              {data:fullpower_B,times: times,label:this.$locale['fullPower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' B',strokeColor: '#AD00FF',strokeWidth: 2},
              {data:fullpower_C,times: times,label:this.$locale['fullPower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' C',strokeColor: '#AD00FF',strokeWidth: 2},
              {data:fullpower_total,times: times,label:this.$locale['fullPower'][this.$i18n.locale.value],label2:this.$locale['general'][this.$i18n.locale.value],strokeColor: '#008A00',strokeWidth: 2}
            ]
          }
          let chartOption_options6={
            label: this.$locale['coefActivePower'][this.$i18n.locale.value],
            options: [
              {data:coefactivepower_A,times: times,label:this.$locale['coefActivePower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' А',strokeColor: '#987704',strokeWidth: 2},
              {data:coefactivepower_B,times: times,label:this.$locale['coefActivePower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' B',strokeColor: '#AD00FF',strokeWidth: 2},
              {data:coefactivepower_C,times: times,label:this.$locale['coefActivePower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' C',strokeColor: '#AD00FF',strokeWidth: 2},
              {data:coefactivepower_total,times: times,label:this.$locale['coefActivePower'][this.$i18n.locale.value],label2:this.$locale['general'][this.$i18n.locale.value],strokeColor: '#008A00',strokeWidth: 2}
            ]
          }
          let chartOption_options7={
            label: this.$locale['coefReactivePower'][this.$i18n.locale.value],
            options: [
              {data:sinusfreactivepower_A,times: times,label:this.$locale['coefReactivePower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' А',strokeColor: '#987704',strokeWidth: 2},
              {data:sinusfreactivepower_B,times: times,label:this.$locale['coefReactivePower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' B',strokeColor: '#AD00FF',strokeWidth: 2},
              {data:sinusfreactivepower_C,times: times,label:this.$locale['coefReactivePower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' C',strokeColor: '#AD00FF',strokeWidth: 2},
              {data:sinusfreactivepower_total,times: times,label:this.$locale['coefReactivePower'][this.$i18n.locale.value],label2:this.$locale['general'][this.$i18n.locale.value],strokeColor: '#008A00',strokeWidth: 2}
            ]
            }
            let chartOption_options8={
              label: this.$locale['coefFullPower'][this.$i18n.locale.value],
              options: [
                {data:coefreactivepower_A,times: times,label:this.$locale['coefFullPower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' А',strokeColor: '#987704',strokeWidth: 2},
                {data:coefreactivepower_B,times: times,label:this.$locale['coefFullPower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' B',strokeColor: '#AD00FF',strokeWidth: 2},
                {data:coefreactivepower_C,times: times,label:this.$locale['coefFullPower'][this.$i18n.locale.value],label2:this.$locale['phase'][this.$i18n.locale.value]+' C',strokeColor: '#AD00FF',strokeWidth: 2},
                {data:coefreactivepower_total,times: times,label:this.$locale['coefFullPower'][this.$i18n.locale.value],label2:this.$locale['general'][this.$i18n.locale.value],strokeColor: '#008A00',strokeWidth: 2}
              ]
            }
            let chartOption_options9 = {
            label: this.$locale['frequency'][this.$i18n.locale.value],
            options: [
              {data:frequency,times: times,label:this.$locale['frequency'][this.$i18n.locale.value],label2:'F',strokeColor: '#987704',strokeWidth: 2}
            ]
          }
          let chartoption = [
            chartOption_options,
            chartOption_options2,
            chartOption_options3,
            chartOption_options4,
            chartOption_options5,
            chartOption_options6,
            chartOption_options7,
            chartOption_options8,
            chartOption_options9,
          ]
          this.chartCurrently2 = chartoption
          if(this.setedArr2.length){
            this.chartCurrently = []
            let newOptions = []
            this.setedArr2 && this.setedArr2.forEach((el) => {
              chartoption?.[el]?.options.forEach((el1)=>{
                if((Math.max(...el1.data))!=null){
                  newOptions.push(chartoption[el])
                }
              })
              newOptions = newOptions.filter((el,index) => {
                return newOptions.indexOf(el) == index;
              });
              this.chartCurrently = newOptions
            })
          }else{
            this.chartCurrently = []
            let newOptions = []
            chartoption.forEach((el)=>{
              el.options.forEach((el1)=>{
                if((Math.max(...el1.data))!=null){
                  newOptions.push(el)
                }
              })
            })
            newOptions = newOptions.filter((el,index) => {
              return newOptions.indexOf(el) == index;
            });
            this.chartCurrently = newOptions
          }
        }
      }).catch(async (error)=>{
        const statusCode = (error.response || {}).status || -1;
        if (statusCode == 406) {
          if(error.config.method == 'get'){
            await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
              localStorage.setItem('session',res?.data?.session)
              await this.getId(e)
            }).catch((err)=>{
              console.log(err);
            })
          }
        }
      })
      this.beforeFLB()
      this.beforeFLB2()
      this.loading = false
    }
    },
  },
  async mounted() {
    
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
    this.filter2 = {...this.filter}
    this.oldfilter_date1 = this.filter.date2
    this.oldfilter_date2 = this.filter2.date2
    let defDate1 = new Date(this.filter?.date1)
    let defDate2 = new Date(this.filter?.date2)
    
    this.inpFilter2.date1 = (new Date(defDate1.getFullYear(),(defDate1.getMonth()),1)).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }); 
    this.inpFilter2.date2 = (new Date(defDate2.getFullYear(),((defDate2).getMonth()+1),0)).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
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
    let h = document.getElementsByClassName('height1')
    let h2 = document.getElementsByClassName('height2')
    if(h?.[0]?.offsetHeight > h2?.[0]?.offsetHeight){
      this.height = h ? (h[0]?.offsetHeight-152) : ''
    }else if(h2?.[0]?.offsetHeight>h?.[0]?.offsetHeight){
      this.height = h2 ? (h2[0]?.offsetHeight-152) : ''
    }
    this.getH()
    this.getH2()
    addEventListener("resize", () => {
      if(h?.[0]?.offsetHeight > h2?.[0]?.offsetHeight){
        this.height = h ? (h[0]?.offsetHeight-152) : ''
      }else if(h2?.[0]?.offsetHeight>h?.[0]?.offsetHeight){
        this.height = h2 ? (h2[0]?.offsetHeight-152) : ''
      }
    });
  },
};
</script>
<style>
</style>
