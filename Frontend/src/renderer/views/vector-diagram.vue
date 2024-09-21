<template>
  <div class="wrapper">
    <div class="header">
      <h3>{{$locale['vector-diagram-obj'][$i18n.locale.value]}} </h3>
      <div class="breadcrumbs">
        <p>{{$locale['graph-panel-obj'][$i18n.locale.value]}}</p>
        <img src="../assets/svg/arrR.svg" alt="">
        <p>{{$locale['vector-diagram'][$i18n.locale.value]}}</p>
      </div>
      <button @click="print">{{$locale['exportPdf'][$i18n.locale.value]}} <Icons size="custom" width="20" height="20" icon="print"/> </button>
    </div>
    <div class="e-model table-diagram v-diagram empanel" @click="opener">
      <div class="model-dv w-33">
        <div :class="{openBlock: openBlock==true }" class="model-block mh-100" @click.stop="unFocus">
          <h5 class="recmenu">
            <p class="line-1">{{$locale['elect_model'][$i18n.locale.value]}}</p>
          </h5>
          <div class="wrapblock">
            <div class="beforeB" :style="div ? ('height:'+(div)+'px') : ''">
              <div class="beforeFLB" :style="'top:'+(64*(index)+21) + 'px;'" v-for="el,index in beforeFLBValue" :key="index"></div>
            </div>
            <div id="emodel1" class="model-div">
              <ul class="tree-menu">
                <TreeParentFirst :beforeFLBValue="beforeFLBValue" :first="data[0]" @click.stop="getH" accessEmits="getId,activeParam,activeLocation" @activeParam="activeParam($event)" @activeLocation="activeLocation($event)" @getId="getEmit($event,true)" v-for="(item,index) in data" :key="index" class="tree-item" :model="item"></TreeParentFirst>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="model-dv w-67">
        <div class="content-wrapper">
            <div id="vector-date" class="vector-date scrollbar" @scroll="paginator($event)">
              <h3>{{$locale['dateTime'][$i18n.locale.value]}}</h3>
              <p v-for="(el,key,index) in fetchData" @click="activerVector(el,index,key)" :key="index" :class="{activeVector:index==activeI}" :tabindex="'tab-'+index">{{(dateFilter(key))}}</p>
              <p v-if="fetchData==null">{{$locale['dataUploading'][$i18n.locale.value]}}</p>
            </div>
            <div class="pre-vector-block">
              <chart v-if="loading && (active?.type == 'meter')" :activeDateData="activeDateData" @gradus="gradus($event)" :allData="fetchData"/>
              <div v-else-if="loading && (active?.type != 'meter')">{{$locale['onlyTypeMeter'][$i18n.locale.value]}}.</div>
              <div v-else class="pre-vector-block">{{$locale['dataUploading'][$i18n.locale.value]}}</div>
            </div>
            <div class="vector-date vector-start">
              <div class="calendar-block">
                <label>{{$locale['date'][$i18n.locale.value]}}</label>
                <div class="p" @click.stop="opener('openDAte')">{{date}}<icons icon="calendar"/></div>
                <datepicker :changedDate="params.paramDate" @date="setdate($event)" @click.stop v-if="openDAte"/>
              </div>
              <div v-if="(active?.type == 'meter')" class="vector-kt">
                <label @click.stop="changeFilter" for="saveMe">
                  <span :class="params.coefficient?'checked':'notCheck'"><span v-if="params.coefficient">&#10003;</span></span>
                  <span>{{$locale['withCoef'][$i18n.locale.value]}}</span>
                </label>
              </div>
              <div v-if="loading && (active?.type == 'meter')" class="vector-wt">
                <div class="calendar-blocks">
                  <div class="calendar-block">
                    <p class="calendar-input mt-0" @click.stop="opener('openDAte1')"><span class="line-1">{{activeFilterView?.label||'Пусто'}}</span> <icons icon="arrDown"/></p>
                    <div v-if="openDAte1 && filterView?.length" class="select-options">
                      <div v-for="el,index in filterView" @click="setFilter(index)" :class="{active:(activeFilterView?.label ==  filterView[index]?.label)}" :key="index" class="select-option">
                        {{el.label}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="vector-wt-info">
                  <h5>{{$locale['indication'][$i18n.locale.value]}}</h5>
                  <div class="d-f jc-sb"><span>{{$locale['tarif'][$i18n.locale.value]}} №1</span><span>{{ listValues && listValues?.[`current_energytotal_${activeFilterView.key}_tarif1`]?(listValues[`current_energytotal_${activeFilterView.key}_tarif1`]?.value)?.toFixed(3):'-' }}</span></div>
                  <div class="d-f jc-sb"><span>{{$locale['tarif'][$i18n.locale.value]}} №2</span><span>{{ listValues && listValues?.[`current_energytotal_${activeFilterView.key}_tarif2`]?(listValues[`current_energytotal_${activeFilterView.key}_tarif2`]?.value)?.toFixed(3):'-' }}</span></div>
                  <div class="d-f jc-sb"><span>{{$locale['tarif'][$i18n.locale.value]}} №3</span><span>{{ listValues && listValues?.[`current_energytotal_${activeFilterView.key}_tarif3`]?(listValues[`current_energytotal_${activeFilterView.key}_tarif3`]?.value)?.toFixed(3):'-' }}</span></div>
                  <div class="d-f jc-sb"><span>{{$locale['tarif'][$i18n.locale.value]}} №4</span><span>{{ listValues && listValues?.[`current_energytotal_${activeFilterView.key}_tarif4`]?(listValues[`current_energytotal_${activeFilterView.key}_tarif4`]?.value)?.toFixed(3):'-' }}</span></div>
                  <div class="d-f jc-sb"><h5>{{$locale['general'][$i18n.locale.value]}}</h5><h5>{{ listValues && listValues?.[`current_energytotal_${activeFilterView.key}`]?(listValues[`current_energytotal_${activeFilterView.key}`]?.value)?.toFixed(3):'-' }}</h5></div>
                </div>
              </div>
            </div>
        </div>
        <div class="model-block gradient p-30">
          <div class="table-vector">
            <div class="vector-labels">
              <div class="vector-label th">{{$locale['phase'][$i18n.locale.value]}}</div>
              <div class="vector-label">{{$locale['voltage'][$i18n.locale.value]}} (U)</div>
              <div class="vector-label">{{$locale['current'][$i18n.locale.value]}} (I)</div>
              <div class="vector-label">{{$locale['activePower'][$i18n.locale.value]}} (P)</div>
              <div class="vector-label">{{$locale['reactivePower'][$i18n.locale.value]}} (Q)</div>
              <div class="vector-label">{{$locale['fullPower'][$i18n.locale.value]}} (S)</div>
              <div class="vector-label">{{$locale['coefActivePower'][$i18n.locale.value]}} (cos(f))</div>
              <div class="vector-label">{{$locale['coefReactivePower'][$i18n.locale.value]}} (sin(f))</div>
              <div class="vector-label">{{$locale['coefFullPower'][$i18n.locale.value]}} (tg(f))</div>
              <div class="vector-label">{{$locale['frequency'][$i18n.locale.value]}} (F)</div>
              <div class="vector-label">{{$locale['angleCoefActivePower'][$i18n.locale.value]}}</div>
              <div class="vector-label">{{$locale['angleCorUU'][$i18n.locale.value]}}</div>
            </div>
            <div  v-if="loading" class="vector-data">
              <div class="vector-thead">
                <div class="th">A</div>
                <div class="th">B</div>
                <div class="th">C</div>
                <div class="th">AB</div>
                <div class="th">BC</div>
                <div class="th">AC</div>
                <div class="th">{{$locale['general'][$i18n.locale.value]}}</div>
              </div>
              <div class="vector-tbody">
                <div class="td">{{ listValues && listValues?.current_voltage_A?numFixed(listValues.current_voltage_A?.value):'-' }}</div>
                <div class="td">{{ listValues && listValues?.current_voltage_B?numFixed(listValues.current_voltage_B?.value):'-' }}</div>
                <div class="td">{{ listValues && listValues?.current_voltage_C?numFixed(listValues.current_voltage_C?.value):'-' }}</div>
                <div class="td">{{ (listValues && numFixed(listValues?.current_voltage_line_A?.value))||numFixed(listValues && (listValues?.current_voltage_A?.value && ((listValues?.current_voltage_A?.value)*Math.sqrt(3))))||'-' }}</div>
                <div class="td">{{ (listValues && numFixed(listValues?.current_voltage_line_B?.value))||numFixed(listValues && (listValues?.current_voltage_B?.value && (listValues?.current_voltage_B?.value)*Math.sqrt(3)))||'-' }}</div>
                <div class="td">{{ (listValues && numFixed(listValues?.current_voltage_line_C?.value))||numFixed(listValues && (listValues?.current_voltage_C?.value && (listValues?.current_voltage_C?.value)*Math.sqrt(3)))||'-' }}</div>
                <div class="td green">-</div>
              </div>
              <div class="vector-tbody">
                <div class="td">{{ listValues && listValues?.current_current_A?numFixed(listValues?.current_current_A.value):'-' }}</div>
                <div class="td">{{ listValues && listValues?.current_current_B?numFixed(listValues?.current_current_B.value):'-' }}</div>
                <div class="td">{{ listValues && listValues?.current_current_C?numFixed(listValues?.current_current_C.value):'-' }}</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td green">-</div>
              </div>
              <div class="vector-tbody">
                <div class="td">{{ listValues && numFixed(listValues["current_active-power_A"]?.value) ||  '-' }}</div>
                <div class="td">{{ listValues && numFixed(listValues["current_active-power_B"]?.value) ||  '-' }}</div>
                <div class="td">{{ listValues && numFixed(listValues["current_active-power_C"]?.value) ||  '-' }}</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td green">{{ listValues && numFixed(listValues['current_active-power_total']?.value) || '-' }}</div>
              </div>
              <div class="vector-tbody">
                <div class="td">{{ listValues && numFixed(listValues['current_reactive-power_A']?.value) || '-' }}</div>
                <div class="td">{{ listValues && numFixed(listValues['current_reactive-power_B']?.value) || '-' }}</div>
                <div class="td">{{ listValues && numFixed(listValues['current_reactive-power_C']?.value) || '-' }}</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">{{ listValues && numFixed(listValues['current_reactive-power_total']?.value) || '-' }}</div>
              </div>
              <div class="vector-tbody">
                <div class="td">{{ listValues && numFixed(listValues['current_full-power_A']?.value) || '-' }}</div>
                <div class="td">{{ listValues && numFixed(listValues['current_full-power_B']?.value) || '-' }}</div>
                <div class="td">{{ listValues && numFixed(listValues['current_full-power_C']?.value) || '-' }}</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">{{ listValues && numFixed(listValues['current_full-power_total']?.value) || '-' }}</div>
              </div>
              <div class="vector-tbody">
                <div class="td">{{ listValues && numFixed(listValues['current_coef-active-power_A']?.value) || '-' }}</div>
                <div class="td">{{ listValues && numFixed(listValues['current_coef-active-power_B']?.value) || '-' }}</div>
                <div class="td">{{ listValues && numFixed(listValues['current_coef-active-power_C']?.value) || '-' }}</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">{{ listValues && numFixed(listValues['current_coef-active-power_total']?.value) || '-' }}</div>
              </div>
              <div class="vector-tbody">
                <div class="td">{{ listValues && numFixed(listValues['current_sinusf-reactive-power_A']?.value) || '-' }}</div>
                <div class="td">{{ listValues && numFixed(listValues['current_sinusf-reactive-power_B']?.value) || '-' }}</div>
                <div class="td">{{ listValues && numFixed(listValues['current_sinusf-reactive-power_C']?.value) || '-' }}</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">{{ listValues && numFixed(listValues['current_sinusf-reactive-power_total']?.value) || '-' }}</div>
              </div>
              <div class="vector-tbody">
                <div class="td">{{ listValues && numFixed(listValues['current_coef-reactive-power_A']?.value) || '-' }}</div>
                <div class="td">{{ listValues && numFixed(listValues['current_coef-reactive-power_B']?.value) || '-' }}</div>
                <div class="td">{{ listValues && numFixed(listValues['current_coef-reactive-power_C']?.value) || '-' }}</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">{{ listValues && numFixed(listValues['current_coef-reactive-power_total']?.value) || '-' }}</div>
              </div>
              <div class="vector-tbody">
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td green">{{ listValues?.current_frequency?.value?.toFixed(2) || '-' }}</div>
              </div>
              <div class="vector-tbody">
                <div class="td">{{ checker(activeDateData) ? ((angle['A']) || '-') : '-' }}</div>
                <div class="td">{{ checker(activeDateData) ? ((angle['B']) || '-') : '-' }}</div>
                <div class="td">{{ checker(activeDateData) ? ((angle['C']) || '-') : '-' }}</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td">-</div>
                <div class="td green">-</div>
              </div>
              <div class="vector-tbody">
                <div class="td">{{ listValues ? 0 : '-' }}</div>
                <div class="td">{{ listValues && (listValues['current_angle_phase_AB']?.value?.toFixed(1) || 120) || '-' }}</div>
                <div class="td">{{ listValues && (Number(listValues['current_angle_phase_AB']?.value || 120)+Number(listValues['current_angle_phase_BC']?.value || 120))?.toFixed(1) || '-' }}</div>
                <div class="td">{{ listValues ? (listValues['current_angle_phase_AB']?.value?.toFixed(1) || 120) : '-' }}</div>
                <div class="td">{{ listValues && (listValues['current_angle_phase_BC']?.value?.toFixed(1) || 120) || '-' }}</div>
                <div class="td">{{ listValues && (listValues['current_angle_phase_CA']?.value?.toFixed(1) || 120) || '-' }}</div>
                <div class="td">-</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="false">
      <div ref="vector">
        <vector v-if="loading" :pdfdate="pdfdate" :menu="location" :angle="angle" :activeDateData="activeDateData" :fetchData="fetchData" :active="active" :listValues="listValues"/>
      </div>
    </div>
  </div>
  </template>
  <script>
  import { ipcRenderer } from 'electron';
  import vector from "../components/pdf/vector.vue";
  import TreeParentFirst from '../components/menu/TreeParentFirst.vue';
  // import TreeParentFirstReport from '../components/menu/TreeParentFirstReport.vue';
  import chart from '../components/charts/chart-diagram.vue';
  import datepicker from '../components/datepicker/datepicker.vue';
  import icons from '../components/icons.vue';
  export default {
    data() {
      return {
        open: false,
        div: null,
        div2: null,
        pdfdate: null,
        openDAte: false,
        openDAte1: false,
        loading: true,
        activeFilterView: {label:this.$locale['display'][this.$i18n.locale.value]+' A+',key:'A+'},
        filterView: [
          {label:this.$locale['display'][this.$i18n.locale.value]+' A+',key:'A+'},
          {label:this.$locale['display'][this.$i18n.locale.value]+' A-',key:'A-'},
          {label:this.$locale['display'][this.$i18n.locale.value]+' R+',key:'R+'},
          {label:this.$locale['display'][this.$i18n.locale.value]+' R-',key:'R-'},
        ],
        limit: 150,
        openBlock: true,
        date: this.$locale['ddmmyyyy'][this.$i18n.locale.value],
        activeI: null,
        params:{
          id: null,
          paramDate: null,
          coefficient: null,
        },
        listValues:null,
        active: null,
        arrow: `
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.95998 4.47501L6.69998 7.73501C6.31498 8.12001 5.68498 8.12001 5.29998 7.73501L2.03998 4.47501" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `,
        data: [],
        location: [],
        finish: null,
        activeDateData: null,
        data2: [],
        fetchData: null,
        allArr: [],
        chartOption: [],
        allArr2: [],
        timeout: null,
        beforeFLBValue: 100,
        beforeFLBValue2: 100,
        angle:{}
      };
    },
    components:{
      chart,
      icons,
      vector,
      TreeParentFirst,
      datepicker,
      // TreeParentFirstReport
    },
    computed:{
    },
    methods: {
      numFixed(e){
        if(e!=undefined){
          let num = Number(e)
          if(num < 1){
            return num.toFixed(3)
          }else{
            return num.toFixed(2)
          }
        }
      },
      getH(){
        const t = this
        setTimeout(() => {
          t.div = document.getElementById('emodel1')?.clientHeight
        }, 1000);
      },
      setFilter(idx){
        this.activeFilterView = this.filterView[idx]
      },
      async print() {
        let date = this.dateFilter2(this.pdfdate)
        setTimeout(()=>{
          const pageToPrint = this.$refs['vector']
          let serializer = new XMLSerializer();
          var serializedObject = serializer.serializeToString(pageToPrint);
          
          ipcRenderer.invoke('printPdf', {
            content: serializedObject,
            fileName: (this.$locale['vector-diagram-obj'][this.$i18n.locale.value]+' (' + date + ` - ${(new Date()).getTime()}` + ')'),
            landscape: true,
          }).catch((err)=>{
          console.log(err);
        });
        }, 100);
      },
      checker(e){
        if(e){
          return Object.keys(e)?.length
        }else{
          return false
        }
      },
      textFilter(d){
        if(d){
          let e = d.toString()
          let text = e && e.split('')
          let sum = ''
          for (let index = 0; index < 5; index++) {
            sum += text[index]
          }
          return sum
        }
      },
      unFocus() {
        let els = document.getElementsByClassName('div');
        for(let i=0;i<els.length;i++){
          els[i].classList.remove('isFocus')
        }
      },
      gradus(e){
        this.angle[e?.phase] = e?.gradus
      },
      paginator(e){
        if((((e.target.scrollTop*100).toFixed(0))/e.target.scrollHeight)>70){
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.getEmit(this.params.id,false)
          }, 1000);
        }
      },
      async setdate(e){
        if(e){
          this.date = e?.format
          let date = new Date(e?.unformat)
          let date1 = date && date?.toISOString()
          this.params.paramDate = date1
          let params = {...this.params}
          delete params.id
          await this.$axios.get(('/vector/data/'+this.params.id),{params:{...params}}).then((res) => {
            this.fetchData = res?.data?.data
            this.finish = res?.data?.finish
          }).catch(async (error)=>{
            const statusCode = (error.response || {}).status || -1;
            if (statusCode == 406) {
              if(error.config.method == 'get'){
                await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                  localStorage.setItem('session',res?.data?.session)
                  this.setdate(e)
                }).catch((err)=>{
                  console.log(err);
                })
              }
            }
          })
          this.opener()
        }
      },
      async changeFilter(){
        this.params.coefficient = !this.params.coefficient
        this.loading = false
        let params = {...this.params}
        delete params.id
        await this.$axios.get(('/vector/data/'+this.params.id),{params:{...params}}).then((res) => {
          this.fetchData = res?.data?.data
          this.finish = res?.data?.finish
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                this.changeFilter()
              }).catch((err)=>{
                console.log(err);
              })
            }
          }
        })
        if (this.activeI) {
          this.activerVector(this.fetchData[Object.keys(this.fetchData)[this.activeI]],this.activeI,this.pdfdate)
        }else{
          this.activerVector(this.fetchData[Object.keys(this.fetchData)[0]],0,this.pdfdate)
        }
        this.loading = true
      },
      dateFilter(e){
        let date = new Date(Number(e))
        let newdate = ('0'+date.getDate()).slice(-2)+'.'+('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
        let newtime = ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+':'+('0'+date.getSeconds()).slice(-2)+':'+('0'+date.getMilliseconds()).slice(-3)
        return  newdate+' - '+newtime
      },
      dateFilter2(e){
        let date = new Date(Number(e))
        let newdate = ('0'+date.getDate()).slice(-2)+'.'+('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
        let newtime = ('0'+date.getHours()).slice(-2)+'.'+('0'+date.getMinutes()).slice(-2)+'.'+('0'+date.getSeconds()).slice(-2)+'.'+('0'+date.getMilliseconds()).slice(-3)
        return  newdate+' - '+newtime
      },
      activeParam(e){
        this.active = e
      },
      activeLocation(e){
        this.location = e
      },
      activerVector(e,index,date){
        this.listValues = e
        this.pdfdate = date
        if(this.fetchData && Object.keys(this.fetchData)[index]){
          this.activeDate = Object.keys(this.fetchData)[index]
        }
        if(this.listValues && (this.listValues["current_coef-active-power_A"]?.value == undefined) && ((this.listValues["current_angle_UI_A"]?.value != undefined))){
          this.listValues["current_coef-active-power_A"] = 
          {
            value:  (Math.cos(this.listValues["current_angle_UI_A"]?.value * Math.PI / 180))
          }
        }
        if(this.listValues && (this.listValues["current_coef-active-power_B"]?.value == undefined) && ((this.listValues["current_angle_UI_B"]?.value != undefined))){
          this.listValues["current_coef-active-power_B"] = 
          {
            value:  (Math.cos(this.listValues["current_angle_UI_B"]?.value * Math.PI / 180))
          }
        }
        if(this.listValues && (this.listValues["current_coef-active-power_C"]?.value == undefined) && ((this.listValues["current_angle_UI_C"]?.value != undefined))){
          this.listValues["current_coef-active-power_C"] = 
          {
            value:  (Math.cos(this.listValues["current_angle_UI_C"]?.value * Math.PI / 180))
          }
        }
        if(this.listValues && (this.listValues["current_coef-active-power_total"]?.value == undefined) && ((this.listValues["current_coef-active-power_A"]?.value != undefined) || (this.listValues["current_coef-active-power_B"]?.value != undefined) || (this.listValues["current_coef-active-power_C"]?.value != undefined))){
          this.listValues = {
            ...this.listValues,
            ["current_coef-active-power_total"]:{
              value: (((this.listValues["current_coef-active-power_A"]?.value || 0) + (this.listValues["current_coef-active-power_B"]?.value || 0) + (this.listValues["current_coef-active-power_C"]?.value || 0))/3)
            }
          }
        }
        if(this.listValues && (this.listValues["current_sinusf-reactive-power_A"]?.value == undefined) && ((this.listValues["current_angle_UI_A"]?.value != undefined))){
          this.listValues["current_sinusf-reactive-power_A"] = 
          {
            value:  (Math.sin(this.listValues["current_angle_UI_A"]?.value * Math.PI / 180))
          }
        }
        if(this.listValues && (this.listValues["current_sinusf-reactive-power_B"]?.value == undefined) && ((this.listValues["current_angle_UI_B"]?.value != undefined))){
          this.listValues["current_sinusf-reactive-power_B"] = 
          {
            value:  (Math.sin(this.listValues["current_angle_UI_B"]?.value * Math.PI / 180))
          }
        }
        if(this.listValues && (this.listValues["current_sinusf-reactive-power_C"]?.value == undefined) && ((this.listValues["current_angle_UI_C"]?.value != undefined))){
          this.listValues["current_sinusf-reactive-power_C"] = 
          {
            value:  (Math.sin(this.listValues["current_angle_UI_C"]?.value * Math.PI / 180))
          }
        }
        if(this.listValues && (this.listValues["current_sinusf-reactive-power_total"]?.value == undefined) && ((this.listValues["current_sinusf-reactive-power_A"]?.value != undefined) || (this.listValues["current_sinusf-reactive-power_B"]?.value != undefined) || (this.listValues["current_sinusf-reactive-power_C"]?.value != undefined))){
          this.listValues = {
            ...this.listValues,
            ["current_sinusf-reactive-power_total"]:{
              value: (((this.listValues["current_sinusf-reactive-power_A"]?.value || 0) + (this.listValues["current_sinusf-reactive-power_B"]?.value || 0) + (this.listValues["current_sinusf-reactive-power_C"]?.value || 0))/3)
            }
          }
        }
        if(this.listValues && (this.listValues["current_full-power_A"]?.value == undefined) && ((this.listValues["current_voltage_A"]?.value != undefined) && (this.listValues["current_current_A"]?.value != undefined))){
          this.listValues["current_full-power_A"] = 
          {
            value:  ((this.listValues["current_voltage_A"]?.value) * (this.listValues["current_current_A"]?.value)) / 1000
          }
        }
        if(this.listValues && (this.listValues["current_full-power_B"]?.value == undefined) && ((this.listValues["current_voltage_B"]?.value != undefined) && (this.listValues["current_current_B"]?.value != undefined))){
          this.listValues["current_full-power_B"] = 
          {
            value:  ((this.listValues["current_voltage_B"]?.value) * (this.listValues["current_current_B"]?.value)) / 1000
          }
        }
        if(this.listValues && (this.listValues["current_full-power_C"]?.value == undefined) && ((this.listValues["current_voltage_C"]?.value) && (this.listValues["current_current_C"]?.value != undefined))){
          this.listValues["current_full-power_C"] = 
          {
            value:  ((this.listValues["current_voltage_C"]?.value) * (this.listValues["current_current_C"]?.value)) / 1000
          }
        }
        if(this.listValues && (this.listValues["current_full-power_total"]?.value == undefined) && (((this.listValues["current_full-power_A"]?.value) != undefined) || ((this.listValues["current_full-power_B"]?.value) != undefined) || ((this.listValues["current_full-power_C"]?.value) != undefined))){
          this.listValues = {
            ...this.listValues,
            ["current_full-power_total"]:{
              value: ((this.listValues["current_full-power_A"]?.value || 0) + (this.listValues["current_full-power_B"]?.value || 0) + (this.listValues["current_full-power_C"]?.value || 0))
            }
          }
        }
        if(this.listValues && (this.listValues["current_active-power_A"]?.value == undefined) && ((this.listValues["current_voltage_A"]?.value != undefined) && (this.listValues["current_current_A"]?.value != undefined) && (this.listValues["current_coef-active-power_A"]?.value != undefined))){
          this.listValues["current_active-power_A"] = 
          {
            value:  ((this.listValues["current_voltage_A"]?.value) * (this.listValues["current_current_A"]?.value) * (this.listValues["current_coef-active-power_A"]?.value)) / 1000
          }
        }
        if(this.listValues && (this.listValues["current_active-power_B"]?.value == undefined) && ((this.listValues["current_voltage_B"]?.value != undefined) && (this.listValues["current_current_B"]?.value != undefined) && (this.listValues["current_coef-active-power_B"]?.value != undefined))){
          this.listValues["current_active-power_B"] = 
          {
            value:  ((this.listValues["current_voltage_B"]?.value) * (this.listValues["current_current_B"]?.value) * (this.listValues["current_coef-active-power_B"]?.value)) / 1000
          }
        }
        if(this.listValues && (this.listValues["current_active-power_C"]?.value == undefined) && ((this.listValues["current_voltage_C"]?.value != undefined) && (this.listValues["current_current_C"]?.value != undefined) && (this.listValues["current_coef-active-power_C"]?.value != undefined))){
          this.listValues["current_active-power_C"] = 
          {
            value:  ((this.listValues["current_voltage_C"]?.value) * (this.listValues["current_current_C"]?.value) * (this.listValues["current_coef-active-power_C"]?.value)) / 1000
          }
        }
        if(this.listValues && (this.listValues["current_active-power_total"]?.value == undefined) && (((this.listValues["current_active-power_A"]?.value) != undefined) || ((this.listValues["current_active-power_B"]?.value) != undefined) || ((this.listValues["current_active-power_C"]?.value) != undefined))){
          this.listValues = {
            ...this.listValues,
            ["current_active-power_total"]:
            {
              value: ((this.listValues["current_active-power_A"]?.value || 0) + (this.listValues["current_active-power_B"]?.value || 0) + (this.listValues["current_active-power_C"]?.value || 0))
            }
          }
        }
        if(this.listValues && (this.listValues["current_reactive-power_A"]?.value == undefined) && ((this.listValues["current_voltage_A"]?.value != undefined) && (this.listValues["current_current_A"]?.value != undefined) && (this.listValues["current_coef-active-power_A"]?.value != undefined))){
          this.listValues["current_reactive-power_A"] = {value: ((this.listValues["current_voltage_A"]?.value) * (this.listValues["current_current_A"]?.value) * (this.listValues["current_sinusf-reactive-power_A"]?.value))/1000}
        }
        if(this.listValues && (this.listValues["current_reactive-power_B"]?.value == undefined) && ((this.listValues["current_voltage_B"]?.value != undefined) && (this.listValues["current_current_B"]?.value != undefined) && (this.listValues["current_coef-active-power_B"]?.value != undefined))){
          this.listValues["current_reactive-power_B"] = {value: ((this.listValues["current_voltage_B"]?.value) * (this.listValues["current_current_B"]?.value) * (this.listValues["current_sinusf-reactive-power_B"]?.value))/1000}
        }
        if(this.listValues && (this.listValues["current_reactive-power_C"]?.value == undefined) && ((this.listValues["current_voltage_C"]?.value != undefined) && (this.listValues["current_current_C"]?.value != undefined) && (this.listValues["current_coef-active-power_C"]?.value != undefined))){
          this.listValues["current_reactive-power_C"] = {value: ((this.listValues["current_voltage_C"]?.value) * (this.listValues["current_current_C"]?.value) * (this.listValues["current_sinusf-reactive-power_C"]?.value))/1000}
        }
        if(this.listValues && (this.listValues["current_reactive-power_total"]?.value == undefined) && (((this.listValues["current_reactive-power_A"]?.value) != undefined) || ((this.listValues["current_reactive-power_B"]?.value) != undefined) || ((this.listValues["current_reactive-power_C"]?.value) != undefined))){
          this.listValues = {
            ...this.listValues,
            ["current_reactive-power_total"]:{
              value: ((this.listValues["current_reactive-power_A"]?.value || 0) + (this.listValues["current_reactive-power_B"]?.value || 0) + (this.listValues["current_reactive-power_C"]?.value || 0))
            }
          }
        }
        if((this.listValues?.["current_angle_UI_A"]?.value != undefined)){
          if(this.listValues && (this.listValues["current_coef-reactive-power_A"]?.value == undefined)){
              this.listValues = {
                ...this.listValues,
                ["current_coef-reactive-power_A"]:{
                  value:  (Math.tan(this.listValues?.["current_angle_UI_A"]?.value * Math.PI / 180))
                }
            }
          }
        }else{
          if(this.listValues && (this.listValues["current_coef-reactive-power_A"]?.value == undefined) && (this.listValues["current_coef-active-power_A"]?.value != undefined)){
            if((this.listValues["current_coef-active-power_A"]?.value) != 0) {
            if((1 / (this.listValues["current_coef-active-power_A"]?.value)**2) >= 1) {
              this.listValues = {
                ...this.listValues,
                ["current_coef-reactive-power_A"]:{
                  value: Math.sqrt((1 / ((this.listValues["current_coef-active-power_A"]?.value)**2)) - 1)
                }
                }
              }
            }
          }
        }
        
        if((this.listValues?.["current_angle_UI_B"]?.value != undefined)){
          if(this.listValues && (this.listValues["current_coef-reactive-power_B"]?.value == undefined)){
              this.listValues = {
                ...this.listValues,
                ["current_coef-reactive-power_B"]:{
                  value:  (Math.tan(this.listValues["current_angle_UI_B"]?.value * Math.PI / 180))
                }
              
            }
          }
        }else{
          if(this.listValues && (this.listValues["current_coef-reactive-power_B"]?.value == undefined) && (this.listValues["current_coef-active-power_B"]?.value != undefined)){
            if((this.listValues["current_coef-active-power_B"]?.value) != 0) {
            if((1 / (this.listValues["current_coef-active-power_B"]?.value)**2) >= 1) {
              this.listValues = {
                ...this.listValues,
                ["current_coef-reactive-power_B"]:{
                  value: Math.sqrt((1 / ((this.listValues["current_coef-active-power_B"]?.value)**2)) - 1)
                }
              
                }
              }
            }
          }
        }
        
        if((this.listValues?.["current_angle_UI_C"]?.value != undefined)){
          if(this.listValues && (this.listValues["current_coef-reactive-power_C"]?.value == undefined)){
              this.listValues = {
                ...this.listValues,
                ["current_coef-reactive-power_C"]:{
                  value:  (Math.tan(this.listValues["current_angle_UI_C"]?.value * Math.PI / 180))
                }
              
            }
          }
        }else{
          if(this.listValues && (this.listValues["current_coef-reactive-power_C"]?.value == undefined) && (this.listValues["current_coef-active-power_C"]?.value != undefined)){
            if((this.listValues["current_coef-active-power_C"]?.value) != 0) {
            if((1 / (this.listValues["current_coef-active-power_C"]?.value)**2) >= 1) {
              this.listValues = {
                ...this.listValues,
                ["current_coef-reactive-power_C"]:{
                  value: Math.sqrt((1 / ((this.listValues["current_coef-active-power_C"]?.value)**2)) - 1)
                }
                }
              }
            }
          }
        }
        if(this.listValues && (this.listValues["current_coef-reactive-power_total"]?.value == undefined) && (((this.listValues["current_coef-reactive-power_A"]?.value) != undefined) || ((this.listValues["current_coef-reactive-power_B"]?.value) != undefined) || ((this.listValues["current_coef-reactive-power_C"]?.value) != undefined))){
          this.listValues = {
            ...this.listValues,
            ["current_coef-reactive-power_total"]:{
              value: ((this.listValues["current_coef-reactive-power_A"]?.value || 0) + (this.listValues["current_coef-reactive-power_B"]?.value || 0) + (this.listValues["current_coef-reactive-power_C"]?.value || 0))/3
            }
          }
        }
        this.activeDateData = e
        this.activeI = index
      },
      async getEmit(e,bln){
        this.params.id = e
        this.activerVector(null,null,null)
        if(bln){
          this.fetchData = null
          this.finish = null
        }
        let params = {...this.params}
        delete params.id
        if(this.finish){
          params.finish = this.finish
        }
        await this.$axios.get(('/vector/data/'+this.params.id),{params:{...params,limit:this.limit}}).then((res) => {
          if(bln){
            this.fetchData = res?.data?.data
          }else{
            this.fetchData = {...this.fetchData,...res?.data?.data}
          }
          this.finish = res?.data?.finish
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                this.getEmit(e,bln)
              }).catch((err)=>{
                console.log(err);
              })
            }
          }
        })
        this.beforeFLB()
        this.beforeFLB2()
        this.getH()
      },
      opener(e){
        const fl = ['openDAte','openDAte1']
        this[e] = !this[e]
        fl.forEach((j)=>{if (j!=e) {
          this[j] = false
        }})
      },
      beforeFLB(){
        let len = document.getElementsByClassName('fbl')?.length || 100
        this.beforeFLBValue = len
      },
      beforeFLB2(){
        let len = document.getElementsByClassName('fbl2')?.length || 100
        this.beforeFLBValue2 = len
      },
    },
    async mounted() {
      this.beforeFLB()
      this.beforeFLB2()
      this.date = (new Date()).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      this.params.paramDate = (new Date(new Date().getFullYear(),((new Date()).getMonth()),((new Date()).getDate()),0,0,0)).toISOString()
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
            })
          }
        }
      })
      this.getH()
    },
  };
  </script>
  <style>
  </style>
  