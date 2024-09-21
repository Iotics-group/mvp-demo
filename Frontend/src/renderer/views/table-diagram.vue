<template>
  <div class="wrapper">
    <div class="header">
      <h3>{{$locale['table-diagram'][$i18n.locale.value]}}</h3>
      <div class="breadcrumbs">
        <p>{{$locale['graph-panel-obj'][$i18n.locale.value]}}</p>
        <img src="../assets/svg/arrR.svg" alt="">
        <p>{{$locale['table-diagram'][$i18n.locale.value]}}</p>
      </div>
      <button @click="print" v-if="activeFilterView?.type && (activeFilterView?.type != 'current')">{{$locale['exportPdf'][$i18n.locale.value]}} <Icons size="custom" width="20" height="20" icon="print"/> </button>
    </div>
    <div class="e-model table-diagram empanel" @click="opener">
      <div class="model-dv w-33">
        <div :class="{openBlock: openBlock==true }" class="model-block" @click.stop="unFocus">
          <h5 class="recmenu" v-if="loading">
            <p class="line-1">{{$locale['elect_model'][$i18n.locale.value]}}</p>
            <span @click.stop="openBlock = true">-</span>
          </h5>
          <div class="wrapblock" v-if="loading">
            <div class="beforeB" :style="div ? ('height:'+(div)+'px') : ''">
              <div class="beforeFLB" :style="'top:'+(64*(index)+21) + 'px;'" v-for="el,index in beforeFLBValue" :key="index"></div>
            </div>
            <div id="emodel1" class="model-div">
              <ul class="tree-menu">
                <TreeParentFirst :beforeFLBValue="beforeFLBValue" @click.stop="getH" @getModel="getModel($event)" accessEmits="getfilter,getModel,getId" @getfilter="getfilter($event)" @getId="getEmit($event)" v-for="(item,index) in data" :first="data[0]" :key="index" class="tree-item" :model="item"></TreeParentFirst>
              </ul>
            </div>
          </div>
        </div>
        <div :class="{openBlock: openBlock==false }" class="model-block" @click.stop="unFocus">
          <h5 class="recmenu" v-if="loading">
            <p class="line-1">{{$locale['calc_model'][$i18n.locale.value]}}</p>
            <span @click.stop="openBlock = false">-</span>
          </h5>
          <div class="wrapblock" v-if="loading">
            <div class="beforeB" :style="div2 ? ('height:'+(div2)+'px') : ''">
              <div class="beforeFLB" :style="'top:'+(64*(index)+21) + 'px;'" v-for="el,index in beforeFLBValue2" :key="index"></div>
            </div>
            <div id="emodel2" class="model-div">
              <ul class="tree-menu">  
                <TreeParentFirstReport :beforeFLBValue="beforeFLBValue2" @click.stop="getH2" @getModel="getModel($event)" accessEmits="getId,getModel,getfilter" @getfilter="getfilter($event)" :icon="false" @getId="getEmitForReport($event)" v-for="(item,index) in data2" :key="index" class="tree-item" :model="item"></TreeParentFirstReport>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="model-block gradient ngradient w-67">
        <div v-if="loading" class="table-line">
          <div class="calendar-blocks" v-if="activeFilterView?.type == 'archive'">
            <div class="calendar-block">
              <label :title="$locale['dataType'][$i18n.locale.value]" for="">{{$locale['dataType'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte')"><span class="line-1">{{activeFilterView?.label||'Пусто'}}</span> <icons icon="arrDown"/></p>
              <div v-if="openDAte && filterView?.length" class="select-options">
                <div v-for="el,index in filterView" @click="setFilter(index)" :class="{active:(activeFilterView?.label ==  filterView[index]?.label)}" :key="index" class="select-option">
                  {{el?.label}}
                </div>
              </div>
            </div>
            <div class="calendar-block">
              <label for="">{{$locale['options'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte1')"><span class="line-1">{{setedArr.length == chartOption2?.fulldata?.length ? $locale['all'][$i18n.locale.value] : (chartOption2?.fulldata?.[setedArr[0]]?.param_name||$locale['all'][$i18n.locale.value])}}</span> <span v-if="(setedArr.length > 1)&&(setedArr.length != chartOption2?.fulldata?.length)">+{{Number(setedArr.length)-1}}</span> <icons icon="arrDown"/></p>
              <div v-if="openDAte1" class="select-options scrollbar">
                <div v-for="el,index in chartOption2.fulldata" @click="setArr(index,el)" :key="index" class="select-option">
                  <span :class="(setedArr.includes(index))?'checked':'notCheck'"><span v-if="(setedArr.includes(index))">&#10003;</span></span>
                  {{el.param_name}}
                </div>
              </div>
            </div>
            <div class="calendar-block">
              <label for="">{{$locale['startDate'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte2')">{{inpFilter.date1 || $locale['ddmmyyyy'][$i18n.locale.value]}} <icons color="white" icon="calendar"/></p>
              <datepicker :changedDate="filter.date1" @date="setdate($event,'date1')"  @click.stop v-if="openDAte2"/>
            </div>
            <div class="calendar-block">
              <label for="">{{$locale['finishDate'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte3')">{{inpFilter.date2 || $locale['ddmmyyyy'][$i18n.locale.value]}} <icons color="white" icon="calendar"/></p>
              <datepicker :changedDate="filter.date2" @date="setdate($event,'date2')"  @click.stop v-if="openDAte3"/>
            </div>
          </div>
          <div class="calendar-blocks" v-else-if="activeFilterView?.type == 'billing'">
            <div class="calendar-block">
              <label for="">{{$locale['dataType'][$i18n.locale.value]}} </label>
              <p class="calendar-input" @click.stop="opener('openDAte')"><span class="line-1">{{activeFilterView?.label||'Пусто'}}</span> <icons icon="arrDown"/></p>
              <div v-if="openDAte && filterView?.length" class="select-options">
                <div v-for="el,index in filterView" @click="setFilter(index)" :class="{active:(activeFilterView?.label ==  filterView[index]?.label)}" :key="index" class="select-option">
                  {{el?.label}}
                </div>
              </div>
            </div>
            <div class="calendar-block">
              <label for="">{{$locale['options'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte1')"><span class="line-1">{{setedArr3.length == billing?.params?.length ? $locale['all'][$i18n.locale.value] : (billing?.params?.[setedArr3[0]]?.name||$locale['all'][$i18n.locale.value])}} </span><span v-if="(setedArr3.length > 1)&&(setedArr3.length != billing?.params?.length)">+{{Number(setedArr3.length)-1}}</span> <icons icon="arrDown"/></p>
              <div v-if="openDAte1" class="select-options scrollbar">
                <div v-for="el,index in billing?.params" @click="setArr3(index,el)" :key="index" class="select-option">
                  <span :class="(setedArr3.includes(index))?'checked':'notCheck'"><span v-if="(setedArr3.includes(index))">&#10003;</span></span>
                  {{el.name}}
                </div>
              </div>
            </div>
            <div class="calendar-block">
              <label for="">{{$locale['startDate'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte2')">{{inpFilter.date1 || $locale['ddmmyyyy'][$i18n.locale.value]}} <icons color="white" icon="calendar"/></p>
              <datepicker :changedDate="filter.date1" @date="setdate($event,'date1')"  @click.stop v-if="openDAte2"/>
            </div>
            <div class="calendar-block">
              <label for="">{{$locale['finishDate'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte3')">{{inpFilter.date2 || $locale['ddmmyyyy'][$i18n.locale.value]}} <icons color="white" icon="calendar"/></p>
              <datepicker :changedDate="filter.date2" @date="setdate($event,'date2')"  @click.stop v-if="openDAte3"/>
            </div>
          </div>
          <div class="calendar-blocks" v-else-if="activeFilterView?.type == 'current'">
            <div class="calendar-block">
              <label for="">{{$locale['dataType'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte')"><span class="line-1">{{activeFilterView?.label||'Пусто'}}</span> <icons icon="arrDown"/></p>
              <div v-if="openDAte && filterView?.length" class="select-options">
                <div v-for="el,index in filterView" @click="setFilter(index)" :class="{active:(activeFilterView?.label ==  filterView[index]?.label)}" :key="index" class="select-option">
                  {{el?.label}}
                </div>
              </div>
            </div>
            <div class="calendar-block">
              <label for="">{{$locale['options'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click.stop="opener('openDAte1')">{{setedArr2.length == currentTable?.length ? $locale['all'][$i18n.locale.value] : (currentTable?.[setedArr2[0]]?.name||$locale['all'][$i18n.locale.value])}} <span v-if="(setedArr2.length > 1)&&(setedArr2.length != currentTable?.length)">+{{Number(setedArr2.length)-1}}</span> <icons icon="arrDown"/></p>
              <div v-if="openDAte1" class="select-options scrollbar">
                <div v-for="el,index in currentTable" @click="setArr2(index,el)" :key="index" class="select-option">
                  <span :class="(setedArr2.includes(index))?'checked':'notCheck'"><span v-if="(setedArr2.includes(index))">&#10003;</span></span>
                  {{el.name}}
                </div>
              </div>
            </div>
            <!-- <div class="calendar-block" v-show="(activeFilterView?.type == 'current')">
              <label for="">{{$locale['options'][$i18n.locale.value]}}</label>
              <p @click.stop="opener('openDAte1')">{{setedArr.length == chartOption2?.fulldata?.length ? $locale['all'][$i18n.locale.value] : (chartOption2?.fulldata?.[setedArr[0]]?.param_name||$locale['all'][$i18n.locale.value])}} <span v-if="(setedArr.length > 1)&&(setedArr.length != chartOption2?.fulldata?.length)">+{{Number(setedArr.length)-1}}</span> <icons icon="arrDown"/></p>
              <div v-if="openDAte1" class="select-options scrollbar">
                <div v-for="el,index in chartOption3.fulldata" @click="setArr2(index,el)" :key="index" class="select-option">
                  <span :class="(setedArr.includes(index))?'checked':'notCheck'"><span v-if="(setedArr.includes(index))">&#10003;</span></span>
                  {{el.param_name}}
                </div>
              </div>
            </div> -->
            
            <div @click.stop class="calendar-block">
              <label for="">{{$locale['startDate'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click="opener('openDAte2')">{{inpFilter2.date1 || $locale['ddmmyyyy'][$i18n.locale.value]}} <icons icon="calendar"/></p>
              <datepicker :changedDate="filter2.date1" @date="setdate2($event,'date1')" v-if="openDAte2"/>
            </div>
            <div @click.stop class="calendar-block">
              <label for="">{{$locale['finishDate'][$i18n.locale.value]}}</label>
              <p class="calendar-input" @click="opener('openDAte3')">{{inpFilter2.date2 || $locale['ddmmyyyy'][$i18n.locale.value]}} <icons icon="calendar"/></p>
              <datepicker :changedDate="filter2.date2" @date="setdate2($event,'date2')" v-if="openDAte3"/>
            </div>
          </div>
          <div class="table-blocks hor-scrollbar">
            <div class="table-block table-rate hor-scrollbar" ref="tableRateSc" @scroll="paginator($event)">
              <div v-show="(activeFilterView?.type == 'archive') && fetcher(fetchData)" class="tbody fixed-date w-144">
                <div class="td-block m-0"></div>
                <div class="tr grey" v-if="fetcher(fetchData) && (dataArr?.length)">
                  <div class="th">{{$locale['dateTime'][$i18n.locale.value]}}</div>
                </div>
                <div v-show="(dataArr?.length)" class="tr " v-for="el,key,idx in fetchData" :key="idx">
                  <div class="th">{{(dateFilter(key))}}</div>
                </div>
              </div>
              <div v-show="(activeFilterView?.type == 'archive')&&(!setedArr.length || setedArr.includes(idx)) && fetcher(fetchData)" v-for="el,idx in dataArr" :key="idx" class="tbody" :class="activeFilterView?.type == 'archive' ? 'mw-250' : ''">
                <div class="td-block">
                  <button :style="'background:'+(el?.colors || 'purple')" @click="scroller(idx)">{{el?.param_name}}</button>
                </div>
                <div>
                  <div class="tr grey">
                    <div class="th green">{{$locale['general'][$i18n.locale.value]}}</div>
                  </div>
                  <div v-for="item,index in el?.options" :key="index" class="tr">
                    <div class="th green">{{numFixed(item?.['total']?.value)||'-'}}</div>
                  </div>
                </div>
              </div>
              <div v-show="(activeFilterView?.type == 'current') && fetcher(fetchData)" class="tbody fixed-date w-144">
                <div class="td-block m-0"></div>
                <div class="tr grey" v-if="fetcher(fetchData) && (currentTable?.length)">
                  <div class="th">{{$locale['dateTime'][$i18n.locale.value]}}</div>
                </div>
                <div v-show="(currentTable?.length)" class="tr " v-for="el,key,idx in fetchData" :key="idx">
                  <div class="th">{{(dateFilter(key))}}</div>
                </div>
              </div>
              <div v-show="(activeFilterView?.type == 'current')&&(!setedArr2.length || setedArr2.includes(idx)) && fetcher(fetchData)" v-for="el,idx in currentTable" :key="idx" class="tbody">
                <div class="td-block">
                  <button :style="'background:'+(el?.colors || 'purple')" @click="scroller(idx)">{{el?.name}}</button>
                </div>
                <div>
                  <div class="tr grey">
                    <div v-for="el1,index in el?.values" :key="index" class="th" :class="{green:(el1?.type=='total')}" v-show="activeFilterView?.type == 'current'">{{el1?.name}}</div>
                  </div>
                  <div>
                    <div class="tr" v-for="item,index in el?.values?.[0].values" :key="index">
                      <div v-for="item,index2 in el?.values" :key="index2" :class="{green:(item?.type=='total')}" class="th">{{item?.values?.[index]}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="(activeFilterView?.type == 'billing') && fetcher(billing?.dates)" class="tbody fixed-date w-144">
                <div class="td-block m-0"></div>
                <div class="tr grey" v-if="fetcher(billing?.dates) && (billing?.params?.length)">
                  <div class="th">{{$locale['dateTime'][$i18n.locale.value]}}</div>
                </div>
                <div v-show="(billing?.params?.length)" class="tr" v-for="el,idx in billing?.dates" :key="idx">
                  <div class="th">{{(dateFilter2(el?.date))}}</div>
                </div>
              </div>
              <div v-show="(activeFilterView?.type == 'billing')&&(!setedArr3.length || setedArr3.includes(idx)) && fetcher(billing?.dates)" class="tbody" v-for="el,idx in billing?.params" :key="idx">
                <div v-if="fetcher(billing?.dates)" class="td-block">
                  <button :style="'background:'+(el?.colors || 'purple')" @click="scroller(idx)">{{el?.name}}</button>
                </div>
                <div v-if="fetcher(billing?.dates)">
                  <div class="tr grey">
                    <div class="th">{{$locale['tarif'][$i18n.locale.value]}} №1</div>
                    <div class="th">{{$locale['tarif'][$i18n.locale.value]}} №2</div>
                    <div class="th">{{$locale['tarif'][$i18n.locale.value]}} №3</div>
                    <div class="th">{{$locale['tarif'][$i18n.locale.value]}} №4</div>
                    <div class="th green">{{$locale['general'][$i18n.locale.value]}}</div>
                  </div>
                  <div v-for="item,index in billing?.dates" :key="index">
                    <div class="tr">
                      <div class="th">{{numFixed(item?.['tarif1_'+el?.key]) || '-'}}</div>
                      <div class="th">{{numFixed(item?.['tarif2_'+el?.key]) || '-'}}</div>
                      <div class="th">{{numFixed(item?.['tarif3_'+el?.key]) || '-'}}</div>
                      <div class="th">{{numFixed(item?.['tarif4_'+el?.key]) || '-'}}</div>
                      <div class="th green">{{numFixed(item?.['summa_'+el?.key]) || '-'}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="merr-timer" v-if="pending">
            <img src="../assets/svg/reload.svg" alt="">
          </div>
        </div>
      </div>
    </div>
    <div v-show="false">
      <div ref="tableRate">
        <tablePdf v-if="menu?.length" :menu="menu" :inpFilter="inpFilter" :activeFilterView="activeFilterView" :billing="billing" :dataArr="dataArr" :setedArr="setedArr" :setedArr3="setedArr3" :archive="archive"/>
      </div>
    </div>
    <transition name="notify" :duration="10000">
      <notify :main="$locale['warning'][$i18n.locale.value]" :text="$locale['dontSelect'][$i18n.locale.value]" @close="warning = false" typeModal="warning" v-if="warning" />
    </transition>
  </div>
  </template>
  <script>
  import { ipcRenderer } from 'electron';
  import TreeParentFirstReport from '../components/menu/TreeParentFirstReport.vue';
  import TreeParentFirst from '../components/menu/TreeParentFirst.vue';
  import tablePdf from "../components/pdf/tablePdf.vue";
  import icons from '../components/icons.vue';
  import datepicker from '../components/datepicker/datepicker.vue'
  export default {
    data() {
      return {
        open: false,
        page: 1,
        copenDAte: false,
        copenDAte2: false,
        warning: false,
        div: null,
        div2: null,
        copenDAte3: false,
        copenDAte4: false,
        copenDAte5: false,
        openDAte: false,
        openDAte1: false,
        openDAte2: false,
        openDAte3: false,
        openBlock: true,
        saveMe: false,
        loading: false,
        scrolled: null,
        dataArr: [],
        menu: [],
        dataArr2: [],
        arrow: `
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.95998 4.47501L6.69998 7.73501C6.31498 8.12001 5.68498 8.12001 5.29998 7.73501L2.03998 4.47501" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `,
        filter: {
          date1: null,
          date2: null,
        },
        inpFilter: {
          date1: null,
          date2: null,
        },
        filter2: {
          date1: null,
          date2: null,
        },
        inpFilter2: {
          year: (new Date()).getFullYear(),
          month: ((new Date()).getMonth()),
          stdate: 1,
          endate: new Date(parseInt((new Date()).getFullYear()), parseInt(((new Date()).getMonth())) + 1, 0).getDate(),
        },
        chartOption: [],
        chartOption2: [],
        archive: null,
        data: [],
        currentTable: [],
        colors: [
          '#987704','#008A00','#0057FF','#AD00FF', '#7851A9', '#03fcfc', '#0356fc', '#db188d', '#946c22', '#107b9e', '#4728ad', '#b51b49', '#800080', '#7851A9', '#fc3d03', '#03fcfc', 
          '#0356fc', '#db188d', '#946c22', '#107b9e', '#4728ad', '#b51b49', '#800080', '#7851A9', 
          '#fc3d03', '#03fcfc', '#0356fc', '#db188d', '#946c22', '#107b9e', '#4728ad'],
        data2: [],
        setedArr: [],
        setedArr2: [],
        setedArr3: [],
        fetchData: null,
        activeFilterView: null,
        id: null,
        beforeFLBValue: 100,
        beforeFLBValue2: 100,
        isReportObject: false,
        pending: false,
        fp: null,
        params: {},
        filterView: [],
        billing: null,
        bf: null,
        oldfilter_date1:null,
        oldfilter_date2:null,
      };
    },
    components:{
      TreeParentFirst,
      icons,
      TreeParentFirstReport,
      datepicker,
      tablePdf
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
      async getModel(e){
        this.billing =  {
          label: 'Авточтения',
          type: 'billing',
          params:[
            {name: this.$locale['param_ap'][this.$i18n.locale.value], colors: '#987704', key: 'A1'},
            {name: this.$locale['param_am'][this.$i18n.locale.value], colors: '#008A00', key: 'A0'},
            {name: this.$locale['param_rp'][this.$i18n.locale.value], colors: '#0057FF', key: 'R1'},
            {name: this.$locale['param_rm'][this.$i18n.locale.value], colors: '#AD00FF', key: 'R0'},
          ],
          dates: null
        }
        if((e?.type == 'meter') && e?.meter_id){
          this.bf = e
          await this.$axios.get(('/billing/table/'+e.meter_id),{params:{...this.filter}}).then((res) => {
            if(res?.data?.data){
              this.billing =  {
                label: this.$locale['billing'][this.$i18n.locale.value],
                type: 'billing',
                params:[
                  {name:this.$locale['param_ap'][this.$i18n.locale.value], colors: '#987704', key: 'A1'},
                  {name:this.$locale['param_am'][this.$i18n.locale.value], colors: '#008A00', key: 'A0'},
                  {name:this.$locale['param_rp'][this.$i18n.locale.value], colors: '#0057FF', key: 'R1'},
                  {name:this.$locale['param_rm'][this.$i18n.locale.value], colors: '#AD00FF', key: 'R0'},
                ],
                dates: res?.data?.data
              }
              if(!this.filterView.some(item => item.type == 'billing')){
                this.filterView = [...this.filterView,this.billing]
              }
            }
          }).catch(async (error)=>{
            const statusCode = (error.response || {}).status || -1;
            if (statusCode == 406) {
              if(error.config.method == 'get'){
                await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                  localStorage.setItem('session',res?.data?.session)
                  this.getModel(e)
                }).catch((err)=>{
                  console.log(err);
                })
              }
            }
          })
        }
      },
      async print() {
        
        if(this?.id){
          let f = []
          this.activeFilterView && this.activeFilterView?.data && this.activeFilterView?.data?.forEach((k)=>{f.push(k)})
          let params = {}
          let filter = {...this.filter}
          filter.date2 = (new Date(new Date(filter.date2).getFullYear(),(new Date(filter.date2).getMonth()),(new Date(filter.date2).getDate()+1))).toISOString()
          let filter2 = {...this.filter2}
          filter2.date2 = (new Date(new Date(filter2.date2).getFullYear(),(new Date(filter2.date2).getMonth()),(new Date(filter2.date2).getDate()+1))).toISOString()
          if(this.activeFilterView?.type == 'archive'){
            params = {
              ...filter,
              selectedParameters:JSON.stringify(f)
            }
          }else{
            params = {
              ...filter2,
              selectedParameters:JSON.stringify(f)
            }
          }
          let requestName = this.isReportObject === true ? ('/graph/data-calculation-list/'+this?.id):('/graph/data-list/'+this?.id);
          await this.$axios.get((requestName),{params:{...params}}).then((res) => {
            if(res?.data){
              this.menu = res?.data?.location
              this.archive = res?.data?.data
            }
          }).catch(async (error)=>{
            const statusCode = (error.response || {}).status || -1;
            if (statusCode == 406) {
              if(error.config.method == 'get'){
                await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                  localStorage.setItem('session',res?.data?.session)
                  this.print()
                }).catch((err)=>{
                  console.log(err);
                })
              }
            }
          })
          var landscape = false
          var typeReport = this.$locale['billing'][this.$i18n.locale.value]
          if((this.activeFilterView?.type == 'archive')){
            typeReport = this.$locale['archiveData'][this.$i18n.locale.value]
            landscape = false
          }else{
            landscape = true
          }
          if((this.activeFilterView?.type == 'billing')&&((!this.setedArr3.length)||(this.setedArr3.length>2))){
            this.warning = true;
            let _t = this;
            setTimeout(() => {
              _t.warning = false;
            }, 5000);
            return
          }
          setTimeout(()=>{
            const pageToPrint = this.$refs['tableRate']
            let serializer = new XMLSerializer();
            var serializedObject = serializer.serializeToString(pageToPrint);
            
            ipcRenderer.invoke('printPdf', {
              content: serializedObject,
              fileName: (this.$locale['table-diagram'][this.$i18n.locale.value] + ` (${typeReport} - ${(new Date()).getTime()})`),
              landscape: landscape,
            }).catch((err)=>{
            console.log(err);
          });
          }, 200);
        }
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
      setArr(idx){
        if(!this.setedArr.includes(idx)){
          this.setedArr.push(idx)
        }else{
          this.setedArr.splice(this.setedArr.indexOf(idx), 1)
        }
        this.dataArr = []
        this.fetchData = null
        this.getId(this.id)
      },
      setArr2(idx){
        if(!this.setedArr2.includes(idx)){
          this.setedArr2.push(idx)
        }else{
          this.setedArr2.splice(this.setedArr2.indexOf(idx), 1)
        }
        this.fetchData = null
        this.getId(this.id)
      },
      setArr3(idx){
        if(!this.setedArr3.includes(idx)){
          this.setedArr3.push(idx)
        }else{
          this.setedArr3.splice(this.setedArr3.indexOf(idx), 1)
        }
        this.billing = null
        this.getModel(this.bf)
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
      setFilter(idx){
        if(this.id){
          this.activeFilterView = this.filterView[idx]
          this.chartOption2 = this.filterView[idx]
          this.setedArr = []
          this.dataArr = []
          this.fetchData = null
          this.getId(this.id)
        }
      },
      async getEmit(e){
        this.id = e
        this.isReportObject = false
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
      scroller(e){
        if(this.scrolled < e) {
          let step = 0
          let interval = setInterval(()=>{
            this.$refs.tableRateSc.scrollLeft += 30
            step += 30
            if(step >= 600){
              clearInterval(interval)
            }
          },20)
        }else{
          let step = 600
          let interval = setInterval(()=>{
            this.$refs.tableRateSc.scrollLeft -= 30
            step -= 30
            if(step <= 0){
              clearInterval(interval)
            }
          },20)
        }
        this.scrolled = e
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
        this.getId(this.id)
        this.getModel(this.bf)
        this.opener()
      },
      async getId(e){
        this.pending = true
        if(!this.activeFilterView){
          this.activeFilterView = this.filterView?.[0]
          this.chartOption2 = this.filterView?.[0]
        }
        if((this.activeFilterView?.type == 'archive')){
          this.activeFilterView = this.filterView?.[0]
          this.chartOption2 = this.filterView?.[0]
        }else if((this.activeFilterView?.type == 'current')){
          this.activeFilterView = this.filterView?.[1]
        }
        let f = []
        this.activeFilterView && this.activeFilterView?.data && this.activeFilterView?.data?.forEach((k)=>{f.push(k)})
        let params = {}
        let filter = {...this.filter}
        filter.date2 = (new Date(new Date(filter.date2).getFullYear(),(new Date(filter.date2).getMonth()),(new Date(filter.date2).getDate()+1))).toISOString()
        let filter2 = {...this.filter2}
        filter2.date2 = (new Date(new Date(filter2.date2).getFullYear(),(new Date(filter2.date2).getMonth()),(new Date(filter2.date2).getDate()+1))).toISOString()
        if(this.activeFilterView?.type == 'archive'){
          params = {
            ...filter,
            selectedParameters:JSON.stringify(f)
          }
        }else{
          params = {
            ...filter2,
            selectedParameters:JSON.stringify(f)
          }
        }
        this.id = e
        if(this.id && (this.activeFilterView?.type != 'billing')){
        let requestName = this.isReportObject === true ? ('/graph/data-calculation/'+this.id):('/graph/data/'+this.id)
        this.fetchData = null
        await this.$axios.get(requestName,{params:{type: this.activeFilterView?.type, ...params,limit:150}}).then((res) => {
          this.fetchData = res?.data?.data
          if(this.activeFilterView?.type == 'archive'){
            if(Object.keys(this.fetchData).length){
              this.dataArr = [{options:[]},{options:[]},{options:[]},{options:[]}]
              Object.keys(this.fetchData).map((k)=>{
                this.dataArr[0].options.push(this.fetchData[k]['energyarchive_A+'])
                this.dataArr[1].options.push(this.fetchData[k]['energyarchive_A-'])
                this.dataArr[2].options.push(this.fetchData[k]['energyarchive_R+'])
                this.dataArr[3].options.push(this.fetchData[k]['energyarchive_R-'])
                this.dataArr[0].colors = (this.colors[0])
                this.dataArr[1].colors = (this.colors[1])
                this.dataArr[2].colors = (this.colors[2])
                this.dataArr[3].colors = (this.colors[3])
                this.dataArr[0].param_name = this.$locale['consumption'][this.$i18n.locale.value] + ' A+'
                this.dataArr[1].param_name = this.$locale['consumption'][this.$i18n.locale.value] + ' A-'
                this.dataArr[2].param_name = this.$locale['consumption'][this.$i18n.locale.value] + ' R+'
                this.dataArr[3].param_name = this.$locale['consumption'][this.$i18n.locale.value] + ' R-'
              })
            }
          }else if(this.activeFilterView?.type == 'current'){
            this.currentTable = [
              {
                name: this.$locale['voltage'][this.$i18n.locale.value],
                colors: '#987704',
                values: [
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' A',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' B',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' C',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' AB',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' BC',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' AC',
                    values: []
                  },
                ]
              },
              {
                name: this.$locale['current'][this.$i18n.locale.value],
                colors: '#008A00',
                values: [
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' A',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' B',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' C',
                    values: []
                  },
                ]
              },
              {
                name: this.$locale['activePower'][this.$i18n.locale.value],
                colors: '#0057FF',
                values: [
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' A',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' B',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' C',
                    values: []
                  },
                  {
                    name: this.$locale['general'][this.$i18n.locale.value],
                    values: []
                  },
                ]
              },
              {
                name: this.$locale['reactivePower'][this.$i18n.locale.value],
                colors: '#946c22',
                values: [
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' A',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' B',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' C',
                    values: []
                  },
                  {
                    name: this.$locale['general'][this.$i18n.locale.value],
                    values: []
                  },
                ]
              },
              {
                name: this.$locale['fullPower'][this.$i18n.locale.value],
                colors: '#AD00FF',
                values: [
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' A',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' B',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' C',
                    values: []
                  },
                  {
                    name: this.$locale['general'][this.$i18n.locale.value],
                    values: []
                  },
                ]
              },
              {
                name: this.$locale['coefActivePower'][this.$i18n.locale.value],
                colors: '#7851A9',
                values: [
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' A',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' B',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' C',
                    values: []
                  },
                  {
                    name: this.$locale['general'][this.$i18n.locale.value],
                    values: []
                  },
                ]
              },
              {
                name: this.$locale['coefReactivePower'][this.$i18n.locale.value],
                colors: '#800080',
                values: [
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' A',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' B',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' C',
                    values: []
                  },
                  {
                    name: this.$locale['general'][this.$i18n.locale.value],
                    values: []
                  },
                ]
              },
              {
                name: this.$locale['coefFullPower'][this.$i18n.locale.value],
                colors: '#4728ad',
                values: [
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' A',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' B',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' C',
                    values: []
                  },
                  {
                    name: this.$locale['general'][this.$i18n.locale.value],
                    values: []
                  },
                ]
              },
              {
                name: this.$locale['frequency'][this.$i18n.locale.value],
                colors: '#0356fc',
                values: [
                  {
                    name: this.$locale['general'][this.$i18n.locale.value],
                    values: []
                  },
                ]
              },
              {
                name: this.$locale['anglePhase'][this.$i18n.locale.value],
                colors: '#db188d',
                values: [
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' AB',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' BC',
                    values: []
                  },
                  {
                    name: this.$locale['phase'][this.$i18n.locale.value]+' AC',
                    values: []
                  },
                ]
              }
            ]
            let data = res?.data?.data
            this.fetchData && Object.keys(data).map((k)=>{
            if((data)[k] && ((data)[k]["current_coef-active-power_A"]?.total?.value == undefined) && (((data)[k]["current_angle_UI_A"]?.total?.value != undefined))){
              (data)[k]["current_coef-active-power_A"] = 
              {
                total:{value:  (Math.cos((data)[k]["current_angle_UI_A"]?.total?.value * Math.PI / 180))}
              }
            }
            if((data)[k] && ((data)[k]["current_coef-active-power_B"]?.total?.value == undefined) && (((data)[k]["current_angle_UI_B"]?.total?.value != undefined))){
              (data)[k]["current_coef-active-power_B"] = 
              {
                total:{value:  (Math.cos((data)[k]["current_angle_UI_B"]?.total?.value * Math.PI / 180))}
              }
            }
            if((data)[k] && ((data)[k]["current_coef-active-power_C"]?.total?.value == undefined) && (((data)[k]["current_angle_UI_C"]?.total?.value != undefined))){
              (data)[k]["current_coef-active-power_C"] = 
              {
                total:{value:  (Math.cos((data)[k]["current_angle_UI_C"]?.total?.value * Math.PI / 180))}
              }
            }
            if((data)[k] && ((data)[k]["current_coef-active-power_total"]?.total?.value == undefined) && (((data)[k]["current_coef-active-power_A"]?.total?.value != undefined) || ((data)[k]["current_coef-active-power_B"]?.total?.value != undefined) || ((data)[k]["current_coef-active-power_C"]?.total?.value != undefined))){
              (data)[k] = {
                ...(data)[k],
                ["current_coef-active-power_total"]:{
                  total:{value: ((((data)[k]["current_coef-active-power_A"]?.total?.value || 0) + ((data)[k]["current_coef-active-power_B"]?.total?.value || 0) + ((data)[k]["current_coef-active-power_C"]?.total?.value || 0))/3)}
                }
              }
            }
            if((data)[k] && ((data)[k]["current_sinusf-reactive-power_A"]?.total?.value == undefined) && (((data)[k]["current_angle_UI_A"]?.total?.value != undefined))){
              (data)[k]["current_sinusf-reactive-power_A"] = 
              {
                total:{value:  (Math.sin((data)[k]["current_angle_UI_A"]?.total?.value * Math.PI / 180))}
              }
            }
            if((data)[k] && ((data)[k]["current_sinusf-reactive-power_B"]?.total?.value == undefined) && (((data)[k]["current_angle_UI_B"]?.total?.value != undefined))){
              (data)[k]["current_sinusf-reactive-power_B"] = 
              {
                total:{value:  (Math.sin((data)[k]["current_angle_UI_B"]?.total?.value * Math.PI / 180))}
              }
            }
            if((data)[k] && ((data)[k]["current_sinusf-reactive-power_C"]?.total?.value == undefined) && (((data)[k]["current_angle_UI_C"]?.total?.value != undefined))){
              (data)[k]["current_sinusf-reactive-power_C"] = 
              {
                total:{value:  (Math.sin((data)[k]["current_angle_UI_C"]?.total?.value * Math.PI / 180))}
              }
            }
            if((data)[k] && ((data)[k]["current_sinusf-reactive-power_total"]?.total?.value == undefined) && (((data)[k]["current_sinusf-reactive-power_A"]?.total?.value != undefined) || ((data)[k]["current_sinusf-reactive-power_B"]?.total?.value != undefined) || ((data)[k]["current_sinusf-reactive-power_C"]?.total?.value != undefined))){
              (data)[k] = {
                ...(data)[k],
                ["current_sinusf-reactive-power_total"]:{
                  total:{value: ((((data)[k]["current_sinusf-reactive-power_A"]?.total?.value || 0) + ((data)[k]["current_sinusf-reactive-power_B"]?.total?.value || 0) + ((data)[k]["current_sinusf-reactive-power_C"]?.total?.value || 0))/3)}
                }
              }
            }
            if((data)[k] && ((data)[k]["current_full-power_A"]?.total?.value == undefined) && (((data)[k]["current_voltage_A"]?.total?.value != undefined) && ((data)[k]["current_current_A"]?.total?.value != undefined))){
              (data)[k]["current_full-power_A"] = 
              {
                total:{value:  (((data)[k]["current_voltage_A"]?.total?.value) * ((data)[k]["current_current_A"]?.total?.value)) / 1000}
              }
            }
            if((data)[k] && ((data)[k]["current_full-power_B"]?.total?.value == undefined) && (((data)[k]["current_voltage_B"]?.total?.value != undefined) && ((data)[k]["current_current_B"]?.total?.value != undefined))){
              (data)[k]["current_full-power_B"] = 
              {
                total:{value:  (((data)[k]["current_voltage_B"]?.total?.value) * ((data)[k]["current_current_B"]?.total?.value)) / 1000}
              }
            }
            if((data)[k] && ((data)[k]["current_full-power_C"]?.total?.value == undefined) && (((data)[k]["current_voltage_C"]?.total?.value != undefined) && ((data)[k]["current_current_C"]?.total?.value != undefined))){
              (data)[k]["current_full-power_C"] = 
              {
                total:{value:  (((data)[k]["current_voltage_C"]?.total?.value) * ((data)[k]["current_current_C"]?.total?.value)) / 1000}
              }
            }
            if((data)[k] && ((data)[k]["current_full-power_total"]?.total?.value == undefined) && ((((data)[k]["current_full-power_A"]?.total?.value) != undefined) || (((data)[k]["current_full-power_B"]?.total?.value) != undefined) || (((data)[k]["current_full-power_C"]?.total?.value) != undefined))){
              (data)[k] = {
                ...(data)[k],
                ["current_full-power_total"]:{
                  total:{value: (((data)[k]["current_full-power_A"]?.total?.value || 0) + ((data)[k]["current_full-power_B"]?.total?.value || 0) + ((data)[k]["current_full-power_C"]?.total?.value || 0))}
                }
              }
            }
            if((data)[k] && ((data)[k]["current_active-power_A"]?.total?.value == undefined) && (((data)[k]["current_voltage_A"]?.total?.value != undefined) && ((data)[k]["current_current_A"]?.total?.value != undefined) && ((data)[k]["current_coef-active-power_A"]?.total?.value != undefined))){
              (data)[k]["current_active-power_A"] = 
              {
                total:{value:  (((data)[k]["current_voltage_A"]?.total?.value) * ((data)[k]["current_current_A"]?.total?.value) * ((data)[k]["current_coef-active-power_A"]?.total?.value))/1000}
              }
            }
            if((data)[k] && ((data)[k]["current_active-power_B"]?.total?.value == undefined) && (((data)[k]["current_voltage_B"]?.total?.value != undefined) && ((data)[k]["current_current_B"]?.total?.value != undefined) && ((data)[k]["current_coef-active-power_B"]?.total?.value != undefined))){
              (data)[k]["current_active-power_B"] = 
              {
                total:{value:  (((data)[k]["current_voltage_B"]?.total?.value) * ((data)[k]["current_current_B"]?.total?.value) * ((data)[k]["current_coef-active-power_B"]?.total?.value))/1000}
              }
            }
            if((data)[k] && ((data)[k]["current_active-power_C"]?.total?.value == undefined) && (((data)[k]["current_voltage_C"]?.total?.value != undefined) && ((data)[k]["current_current_C"]?.total?.value != undefined) && ((data)[k]["current_coef-active-power_C"]?.total?.value != undefined))){
              (data)[k]["current_active-power_C"] = 
              {
                total:{value:  (((data)[k]["current_voltage_C"]?.total?.value) * ((data)[k]["current_current_C"]?.total?.value) * ((data)[k]["current_coef-active-power_C"]?.total?.value))/1000}
              }
            }
            if((data)[k] && ((data)[k]["current_active-power_total"]?.total?.value == undefined) && ((((data)[k]["current_active-power_A"]?.total?.value) != undefined) || (((data)[k]["current_active-power_B"]?.total?.value) != undefined) || (((data)[k]["current_active-power_C"]?.total?.value) != undefined))){
              (data)[k] = {
                ...(data)[k],
                ["current_active-power_total"]:
                {
                  total:{value: (((data)[k]["current_active-power_A"]?.total?.value || 0) + ((data)[k]["current_active-power_B"]?.total?.value || 0) + ((data)[k]["current_active-power_C"]?.total?.value || 0))}
                }
              }
            }
            if((data)[k] && ((data)[k]["current_reactive-power_A"]?.total?.value == undefined) && (((data)[k]["current_voltage_A"]?.total?.value != undefined) && ((data)[k]["current_current_A"]?.total?.value != undefined) && ((data)[k]["current_coef-active-power_A"]?.total?.value != undefined))){
              (data)[k]["current_reactive-power_A"] = {total:{value: (((data)[k]["current_voltage_A"]?.total?.value) * ((data)[k]["current_current_A"]?.total?.value) * ((data)[k]["current_sinusf-reactive-power_A"]?.total?.value)) / 1000}}
            }
            if((data)[k] && ((data)[k]["current_reactive-power_B"]?.total?.value == undefined) && (((data)[k]["current_voltage_B"]?.total?.value != undefined) && ((data)[k]["current_current_B"]?.total?.value != undefined) && ((data)[k]["current_coef-active-power_B"]?.total?.value != undefined))){
              (data)[k]["current_reactive-power_B"] = {total:{value: (((data)[k]["current_voltage_B"]?.total?.value) * ((data)[k]["current_current_B"]?.total?.value) * ((data)[k]["current_sinusf-reactive-power_B"]?.total?.value)) / 1000}}
            }
            if((data)[k] && ((data)[k]["current_reactive-power_C"]?.total?.value == undefined) && (((data)[k]["current_voltage_C"]?.total?.value != undefined) && ((data)[k]["current_current_C"]?.total?.value != undefined) && ((data)[k]["current_coef-active-power_C"]?.total?.value != undefined))){
              (data)[k]["current_reactive-power_C"] = {total:{value: (((data)[k]["current_voltage_C"]?.total?.value) * ((data)[k]["current_current_C"]?.total?.value) * ((data)[k]["current_sinusf-reactive-power_C"]?.total?.value)) / 1000}}
            }
            if((data)[k] && ((data)[k]["current_reactive-power_total"]?.total?.value == undefined) && ((((data)[k]["current_reactive-power_A"]?.total?.value) != undefined) || (((data)[k]["current_reactive-power_B"]?.total?.value) != undefined) || (((data)[k]["current_reactive-power_C"]?.total?.value) != undefined))){
              (data)[k] = {
                ...(data)[k],
                ["current_reactive-power_total"]:{
                  total:{value: (((data)[k]["current_reactive-power_A"]?.total?.value || 0) + ((data)[k]["current_reactive-power_B"]?.total?.value || 0) + ((data)[k]["current_reactive-power_C"]?.total?.value || 0))}
                }
              }
            }
            if(((data)[k]?.["current_angle_UI_A"]?.total?.value != undefined)){
              if((data)[k] && ((data)[k]["current_coef-reactive-power_A"]?.total?.value == undefined)){
                  (data)[k] = {
                    ...(data)[k],
                    ["current_coef-reactive-power_A"]:{
                      total:{value:  (Math.tan((data)[k]?.["current_angle_UI_A"]?.total?.value * Math.PI / 180))}
                    }
                }
              }
            }else{
              if((data)[k] && ((data)[k]["current_coef-reactive-power_A"]?.total?.value == undefined) && ((data)[k]["current_coef-active-power_A"]?.total?.value != undefined)){
                if(((data)[k]["current_coef-active-power_A"]?.total?.value) != 0) {
                if((1 / ((data)[k]["current_coef-active-power_A"]?.total?.value)**2) >= 1) {
                  (data)[k] = {
                    ...(data)[k],
                    ["current_coef-reactive-power_A"]:{
                      total:{value: Math.sqrt((1 / (((data)[k]["current_coef-active-power_A"]?.total?.value)**2)) - 1)}
                    }
                    }
                  }
                }
              }
            }
            
            if(((data)[k]?.["current_angle_UI_B"]?.total?.value != undefined)){
              if((data)[k] && ((data)[k]["current_coef-reactive-power_B"]?.total?.value == undefined)){
                  (data)[k] = {
                    ...(data)[k],
                    ["current_coef-reactive-power_B"]:{
                      total:{value:  (Math.tan((data)[k]["current_angle_UI_B"]?.total?.value * Math.PI / 180))}
                    }
                  
                }
              }
            }else{
              if((data)[k] && ((data)[k]["current_coef-reactive-power_B"]?.total?.value == undefined) && ((data)[k]["current_coef-active-power_B"]?.total?.value != undefined)){
                if(((data)[k]["current_coef-active-power_B"]?.total?.value) != 0) {
                if((1 / ((data)[k]["current_coef-active-power_B"]?.total?.value)**2) >= 1) {
                  (data)[k] = {
                    ...(data)[k],
                    ["current_coef-reactive-power_B"]:{
                      total:{value: Math.sqrt((1 / (((data)[k]["current_coef-active-power_B"]?.total?.value)**2)) - 1)}
                    }
                  
                    }
                  }
                }
              }
            }
            
            if(((data)[k]?.["current_angle_UI_C"]?.total?.value != undefined)){
              if((data)[k] && ((data)[k]["current_coef-reactive-power_C"]?.total?.value == undefined)){
                  (data)[k] = {
                    ...(data)[k],
                    ["current_coef-reactive-power_C"]:{
                      total:{value:  (Math.tan((data)[k]["current_angle_UI_C"]?.total?.value * Math.PI / 180))}
                    }
                  
                }
              }
            }else{
              if((data)[k] && ((data)[k]["current_coef-reactive-power_C"]?.total?.value == undefined) && ((data)[k]["current_coef-active-power_C"]?.total?.value != undefined)){
                if(((data)[k]["current_coef-active-power_C"]?.total?.value) != 0) {
                if((1 / ((data)[k]["current_coef-active-power_C"]?.total?.value)**2) >= 1) {
                  (data)[k] = {
                    ...(data)[k],
                    ["current_coef-reactive-power_C"]:{
                      total:{value: Math.sqrt((1 / (((data)[k]["current_coef-active-power_C"]?.total?.value)**2)) - 1)}
                    }
                    }
                  }
                }
              }
            }
            if((data)[k] && ((data)[k]["current_coef-reactive-power_total"]?.total?.value == undefined) && ((((data)[k]["current_coef-reactive-power_A"]?.total?.value) != undefined) || (((data)[k]["current_coef-reactive-power_B"]?.total?.value) != undefined) || (((data)[k]["current_coef-reactive-power_C"]?.total?.value) != undefined))){
              (data)[k] = {
                ...(data)[k],
                ["current_coef-reactive-power_total"]:{
                  total:{value: (((data)[k]["current_coef-reactive-power_A"]?.total?.value || 0) + ((data)[k]["current_coef-reactive-power_B"]?.total?.value || 0) + ((data)[k]["current_coef-reactive-power_C"]?.total?.value || 0))/3}
                }
              }
            }
              this.currentTable[0].values?.[0]?.values.push(((data)[k]['current_voltage_A']?.total?.value?.toFixed(2) || '-'))
              this.currentTable[0].values?.[1]?.values.push(((data)[k]['current_voltage_B']?.total?.value?.toFixed(2) || '-'))
              this.currentTable[0].values?.[2]?.values.push(((data)[k]['current_voltage_C']?.total?.value?.toFixed(2) || '-'))
              if((data)[k]['current_voltage_line_A']){
                this.currentTable[0].values?.[3]?.values.push(((data)[k]['current_voltage_line_A']?.total?.value?.toFixed(2) || '-'))
              }else if((data)[k]['current_voltage_A']?.total?.value != undefined){
                this.currentTable[0].values?.[3]?.values.push((((Math.sqrt(3))*(data)[k]['current_voltage_A']?.total?.value)?.toFixed(2) || '-'))
              }else{
                this.currentTable[0].values?.[3]?.values.push(('-'))
              }
              if((data)[k]['current_voltage_line_B']){
                this.currentTable[0].values?.[4]?.values.push(((data)[k]['current_voltage_line_B']?.total?.value?.toFixed(2) || '-'))
              }else if((data)[k]['current_voltage_B']?.total?.value != undefined){
                this.currentTable[0].values?.[4]?.values.push((((Math.sqrt(3))*(data)[k]['current_voltage_B']?.total?.value)?.toFixed(2) || '-'))
              }else{
                this.currentTable[0].values?.[4]?.values.push(('-'))
              }
              if((data)[k]['current_voltage_line_C']){
                this.currentTable[0].values?.[5]?.values.push(((data)[k]['current_voltage_line_C']?.total?.value?.toFixed(2) || '-'))
              }else if((data)[k]['current_voltage_C']?.total?.value != undefined){
                this.currentTable[0].values?.[5]?.values.push((((Math.sqrt(3))*(data)[k]['current_voltage_C']?.total?.value)?.toFixed(2) || '-'))
              }else{
                this.currentTable[0].values?.[5]?.values.push(('-'))
              }
              this.currentTable[1].values?.[0]?.values.push((this.numFixed((data)[k]['current_current_A']?.total?.value) || '-'))
              this.currentTable[1].values?.[1]?.values.push((this.numFixed((data)[k]['current_current_B']?.total?.value) || '-'))
              this.currentTable[1].values?.[2]?.values.push((this.numFixed((data)[k]['current_current_C']?.total?.value) || '-'))
              this.currentTable[2].values?.[0]?.values.push((this.numFixed((data)[k]['current_active-power_A']?.total?.value) || '-'))
              this.currentTable[2].values?.[1]?.values.push((this.numFixed((data)[k]['current_active-power_B']?.total?.value) || '-'))
              this.currentTable[2].values?.[2]?.values.push((this.numFixed((data)[k]['current_active-power_C']?.total?.value) || '-'))
              this.currentTable[2].values?.[3]?.values.push((this.numFixed((data)[k]['current_active-power_total']?.total?.value) || '-'))
              this.currentTable[3].values?.[0]?.values.push((this.numFixed((data)[k]['current_reactive-power_A']?.total?.value) || '-'))
              this.currentTable[3].values?.[1]?.values.push((this.numFixed((data)[k]['current_reactive-power_B']?.total?.value) || '-'))
              this.currentTable[3].values?.[2]?.values.push((this.numFixed((data)[k]['current_reactive-power_C']?.total?.value) || '-'))
              this.currentTable[3].values?.[3]?.values.push((this.numFixed((data)[k]['current_reactive-power_total']?.total?.value) || '-'))
              this.currentTable[4].values?.[0]?.values.push((this.numFixed((data)[k]['current_full-power_A']?.total?.value) || '-'))
              this.currentTable[4].values?.[1]?.values.push((this.numFixed((data)[k]['current_full-power_B']?.total?.value) || '-'))
              this.currentTable[4].values?.[2]?.values.push((this.numFixed((data)[k]['current_full-power_C']?.total?.value) || '-'))
              this.currentTable[4].values?.[3]?.values.push((this.numFixed((data)[k]['current_full-power_total']?.total?.value) || '-'))
              this.currentTable[5].values?.[0]?.values.push((this.numFixed((data)[k]['current_coef-active-power_A']?.total?.value) || '-'))
              this.currentTable[5].values?.[1]?.values.push((this.numFixed((data)[k]['current_coef-active-power_B']?.total?.value) || '-'))
              this.currentTable[5].values?.[2]?.values.push((this.numFixed((data)[k]['current_coef-active-power_C']?.total?.value) || '-'))
              this.currentTable[5].values?.[3]?.values.push((this.numFixed((data)[k]['current_coef-active-power_total']?.total?.value) || '-'))
              this.currentTable[6].values?.[0]?.values.push((this.numFixed((data)[k]['current_sinusf-reactive-power_A']?.total?.value) || '-'))
              this.currentTable[6].values?.[1]?.values.push((this.numFixed((data)[k]['current_sinusf-reactive-power_B']?.total?.value) || '-'))
              this.currentTable[6].values?.[2]?.values.push((this.numFixed((data)[k]['current_sinusf-reactive-power_C']?.total?.value) || '-'))
              this.currentTable[6].values?.[3]?.values.push((this.numFixed((data)[k]['current_sinusf-reactive-power_total']?.total?.value) || '-'))
              this.currentTable[7].values?.[0]?.values.push((this.numFixed((data)[k]['current_coef-reactive-power_A']?.total?.value) || '-'))
              this.currentTable[7].values?.[1]?.values.push((this.numFixed((data)[k]['current_coef-reactive-power_B']?.total?.value) || '-'))
              this.currentTable[7].values?.[2]?.values.push((this.numFixed((data)[k]['current_coef-reactive-power_C']?.total?.value) || '-'))
              this.currentTable[7].values?.[3]?.values.push((this.numFixed((data)[k]['current_coef-reactive-power_total']?.total?.value) || '-'))
              this.currentTable[8].values?.[0]?.values.push(((data)[k]['current_frequency']?.total?.value?.toFixed(2) || '-'))
              this.currentTable[9].values?.[0]?.values.push(((data)[k]['current_angle_phase_AB']?.total?.value?.toFixed(2) || '120'))
              this.currentTable[9].values?.[1]?.values.push(((data)[k]['current_angle_phase_BC']?.total?.value?.toFixed(2) || '120'))
              this.currentTable[9].values?.[2]?.values.push(((data)[k]['current_angle_phase_CA']?.total?.value?.toFixed(2) || '120'))
            })
          }
        }).catch(async (error)=>{
            const statusCode = (error.response || {}).status || -1;
            if (statusCode == 406) {
              if(error.config.method == 'get'){
                await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                  localStorage.setItem('session',res?.data?.session)
                  this.getId(e)
                }).catch((err)=>{
                  console.log(err);
                })
              }
            }
          })
      }
        this.pending = false
        this.beforeFLB()
        this.beforeFLB2()
      },
      getfilter(e){
        if(this.billing){
          this.filterView = [...e,this.billing]
        }else{
          this.filterView = e
        }
      },
      dateFilter(e){
        let date = new Date(Number(e))
        let newdate = ('0'+date.getDate()).slice(-2)+'.'+('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
        let newtime = ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+':'+('0'+date.getSeconds()).slice(-2)+':'+('0'+date.getMilliseconds()).slice(-3)
        return  newdate+' - '+newtime
      },
      dateFilter2(e){
        let date = new Date(e)
        let newdate = ('0'+date.getDate()).slice(-2)+'.'+('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
        let newtime = ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+':'+('0'+date.getSeconds()).slice(-2)+':'+('0'+date.getMilliseconds()).slice(-3)
        return  newdate+' - '+newtime
      },
      async tableBuilder(date1){
        if(this.activeFilterView?.type != 'billing'){
        let requestName = this.isReportObject === true ? ('/graph/data-calculation/'+this.id):('/graph/data/'+this.id)
        let f = []
        this.activeFilterView && this.activeFilterView.data && this.activeFilterView?.data?.forEach((k)=>{f.push(k)})
        let params = {}
        if(this.activeFilterView?.type == 'archive'){
          params = {
            date1: this.filter.date1,
            date2: date1,
            selectedParameters:JSON.stringify(f)
          }
        }else{                       
          params = {
            date1: this.filter2.date1,
            date2: date1,
            selectedParameters:JSON.stringify(f)
          }
        }
        this.pending = true
        await this.$axios.get(requestName,{params:{type: this.activeFilterView?.type, ...params,limit:150}}).then((res) => {
          let fetchData = res?.data?.data
          if(this.activeFilterView?.type == 'archive'){
            if(Object.keys(fetchData).length){
              Object.keys(fetchData).map((k)=>{
                if(!this.fetchData[k]){
                  this.dataArr[0].options.push(fetchData[k]['energyarchive_A+'])
                  this.dataArr[1].options.push(fetchData[k]['energyarchive_A-'])
                  this.dataArr[2].options.push(fetchData[k]['energyarchive_R+'])
                  this.dataArr[3].options.push(fetchData[k]['energyarchive_R-'])
                  this.dataArr[0].colors = (this.colors[0])
                  this.dataArr[1].colors = (this.colors[1])
                  this.dataArr[2].colors = (this.colors[2])
                  this.dataArr[3].colors = (this.colors[3])
                  this.dataArr[0].param_name = this.$locale['consumption'][this.$i18n.locale.value]+' A+'
                  this.dataArr[1].param_name = this.$locale['consumption'][this.$i18n.locale.value]+' A-'
                  this.dataArr[2].param_name = this.$locale['consumption'][this.$i18n.locale.value]+' R+'
                  this.dataArr[3].param_name = this.$locale['consumption'][this.$i18n.locale.value]+' R-'
                }
              })
            }
          }else if(this.activeFilterView?.type == 'current'){
            let data = res?.data?.data
            fetchData && Object.keys(data).map((k)=>{
              if(!this.fetchData[k]){
                if((data)[k] && ((data)[k]["current_coef-active-power_A"]?.total?.value == undefined) && (((data)[k]["current_angle_UI_A"]?.total?.value != undefined))){
                  (data)[k]["current_coef-active-power_A"] = 
                  {
                    total:{value:  (Math.cos((data)[k]["current_angle_UI_A"]?.total?.value * Math.PI / 180))}
                  }
                }
                if((data)[k] && ((data)[k]["current_coef-active-power_B"]?.total?.value == undefined) && (((data)[k]["current_angle_UI_B"]?.total?.value != undefined))){
                  (data)[k]["current_coef-active-power_B"] = 
                  {
                    total:{value:  (Math.cos((data)[k]["current_angle_UI_B"]?.total?.value * Math.PI / 180))}
                  }
                }
                if((data)[k] && ((data)[k]["current_coef-active-power_C"]?.total?.value == undefined) && (((data)[k]["current_angle_UI_C"]?.total?.value != undefined))){
                  (data)[k]["current_coef-active-power_C"] = 
                  {
                    total:{value:  (Math.cos((data)[k]["current_angle_UI_C"]?.total?.value * Math.PI / 180))}
                  }
                }
                if((data)[k] && ((data)[k]["current_coef-active-power_total"]?.total?.value == undefined) && (((data)[k]["current_coef-active-power_A"]?.total?.value != undefined) || ((data)[k]["current_coef-active-power_B"]?.total?.value != undefined) || ((data)[k]["current_coef-active-power_C"]?.total?.value != undefined))){
                  (data)[k] = {
                    ...(data)[k],
                    ["current_coef-active-power_total"]:{
                      total:{value: ((((data)[k]["current_coef-active-power_A"]?.total?.value || 0) + ((data)[k]["current_coef-active-power_B"]?.total?.value || 0) + ((data)[k]["current_coef-active-power_C"]?.total?.value || 0))/3)}
                    }
                  }
                }
                if((data)[k] && ((data)[k]["current_sinusf-reactive-power_A"]?.total?.value == undefined) && (((data)[k]["current_angle_UI_A"]?.total?.value != undefined))){
                  (data)[k]["current_sinusf-reactive-power_A"] = 
                  {
                    total:{value:  (Math.sin((data)[k]["current_angle_UI_A"]?.total?.value * Math.PI / 180))}
                  }
                }
                if((data)[k] && ((data)[k]["current_sinusf-reactive-power_B"]?.total?.value == undefined) && (((data)[k]["current_angle_UI_B"]?.total?.value != undefined))){
                  (data)[k]["current_sinusf-reactive-power_B"] = 
                  {
                    total:{value:  (Math.sin((data)[k]["current_angle_UI_B"]?.total?.value * Math.PI / 180))}
                  }
                }
                if((data)[k] && ((data)[k]["current_sinusf-reactive-power_C"]?.total?.value == undefined) && (((data)[k]["current_angle_UI_C"]?.total?.value != undefined))){
                  (data)[k]["current_sinusf-reactive-power_C"] = 
                  {
                    total:{value:  (Math.sin((data)[k]["current_angle_UI_C"]?.total?.value * Math.PI / 180))}
                  }
                }
                if((data)[k] && ((data)[k]["current_sinusf-reactive-power_total"]?.total?.value == undefined) && (((data)[k]["current_sinusf-reactive-power_A"]?.total?.value != undefined) || ((data)[k]["current_sinusf-reactive-power_B"]?.total?.value != undefined) || ((data)[k]["current_sinusf-reactive-power_C"]?.total?.value != undefined))){
                  (data)[k] = {
                    ...(data)[k],
                    ["current_sinusf-reactive-power_total"]:{
                      total:{value: ((((data)[k]["current_sinusf-reactive-power_A"]?.total?.value || 0) + ((data)[k]["current_sinusf-reactive-power_B"]?.total?.value || 0) + ((data)[k]["current_sinusf-reactive-power_C"]?.total?.value || 0))/3)}
                    }
                  }
                }
                if((data)[k] && ((data)[k]["current_full-power_A"]?.total?.value == undefined) && (((data)[k]["current_voltage_A"]?.total?.value != undefined) && ((data)[k]["current_current_A"]?.total?.value != undefined))){
                  (data)[k]["current_full-power_A"] = 
                  {
                    total:{value:  (((data)[k]["current_voltage_A"]?.total?.value) * ((data)[k]["current_current_A"]?.total?.value))/1000}
                  }
                }
                if((data)[k] && ((data)[k]["current_full-power_B"]?.total?.value == undefined) && (((data)[k]["current_voltage_B"]?.total?.value != undefined) && ((data)[k]["current_current_B"]?.total?.value != undefined))){
                  (data)[k]["current_full-power_B"] = 
                  {
                    total:{value:  (((data)[k]["current_voltage_B"]?.total?.value) * ((data)[k]["current_current_B"]?.total?.value))/1000}
                  }
                }
                if((data)[k] && ((data)[k]["current_full-power_C"]?.total?.value == undefined) && (((data)[k]["current_voltage_C"]?.total?.value != undefined) && ((data)[k]["current_current_C"]?.total?.value != undefined))){
                  (data)[k]["current_full-power_C"] = 
                  {
                    total:{value:  (((data)[k]["current_voltage_C"]?.total?.value) * ((data)[k]["current_current_C"]?.total?.value))/1000}
                  }
                }
                if((data)[k] && ((data)[k]["current_full-power_total"]?.total?.value == undefined) && ((((data)[k]["current_full-power_A"]?.total?.value) != undefined) || (((data)[k]["current_full-power_B"]?.total?.value) != undefined) || (((data)[k]["current_full-power_C"]?.total?.value) != undefined))){
                  (data)[k] = {
                    ...(data)[k],
                    ["current_full-power_total"]:{
                      total:{value: (((data)[k]["current_full-power_A"]?.total?.value || 0) + ((data)[k]["current_full-power_B"]?.total?.value || 0) + ((data)[k]["current_full-power_C"]?.total?.value || 0))}
                    }
                  }
                }
                if((data)[k] && ((data)[k]["current_active-power_A"]?.total?.value == undefined) && (((data)[k]["current_voltage_A"]?.total?.value != undefined) && ((data)[k]["current_current_A"]?.total?.value != undefined) && ((data)[k]["current_coef-active-power_A"]?.total?.value != undefined))){
                  (data)[k]["current_active-power_A"] = 
                  {
                    total:{value:  (((data)[k]["current_voltage_A"]?.total?.value) * ((data)[k]["current_current_A"]?.total?.value) * ((data)[k]["current_coef-active-power_A"]?.total?.value))/1000}
                  }
                }
                if((data)[k] && ((data)[k]["current_active-power_B"]?.total?.value == undefined) && (((data)[k]["current_voltage_B"]?.total?.value != undefined) && ((data)[k]["current_current_B"]?.total?.value != undefined) && ((data)[k]["current_coef-active-power_B"]?.total?.value != undefined))){
                  (data)[k]["current_active-power_B"] = 
                  {
                    total:{value:  (((data)[k]["current_voltage_B"]?.total?.value) * ((data)[k]["current_current_B"]?.total?.value) * ((data)[k]["current_coef-active-power_B"]?.total?.value))/1000}
                  }
                }
                if((data)[k] && ((data)[k]["current_active-power_C"]?.total?.value == undefined) && (((data)[k]["current_voltage_C"]?.total?.value != undefined) && ((data)[k]["current_current_C"]?.total?.value != undefined) && ((data)[k]["current_coef-active-power_C"]?.total?.value != undefined))){
                  (data)[k]["current_active-power_C"] = 
                  {
                    total:{value:  (((data)[k]["current_voltage_C"]?.total?.value) * ((data)[k]["current_current_C"]?.total?.value) * ((data)[k]["current_coef-active-power_C"]?.total?.value))/1000}
                  }
                }
                if((data)[k] && ((data)[k]["current_active-power_total"]?.total?.value == undefined) && ((((data)[k]["current_active-power_A"]?.total?.value) != undefined) || (((data)[k]["current_active-power_B"]?.total?.value) != undefined) || (((data)[k]["current_active-power_C"]?.total?.value) != undefined))){
                  (data)[k] = {
                    ...(data)[k],
                    ["current_active-power_total"]:
                    {
                      total:{value: (((data)[k]["current_active-power_A"]?.total?.value || 0) + ((data)[k]["current_active-power_B"]?.total?.value || 0) + ((data)[k]["current_active-power_C"]?.total?.value || 0))}
                    }
                  }
                }
                if((data)[k] && ((data)[k]["current_reactive-power_A"]?.total?.value == undefined) && (((data)[k]["current_voltage_A"]?.total?.value != undefined) && ((data)[k]["current_current_A"]?.total?.value != undefined) && ((data)[k]["current_coef-active-power_A"]?.total?.value != undefined))){
                  (data)[k]["current_reactive-power_A"] = {total:{value: (((data)[k]["current_voltage_A"]?.total?.value) * ((data)[k]["current_current_A"]?.total?.value) * ((data)[k]["current_sinusf-reactive-power_A"]?.total?.value))/1000}}
                }
                if((data)[k] && ((data)[k]["current_reactive-power_B"]?.total?.value == undefined) && (((data)[k]["current_voltage_B"]?.total?.value != undefined) && ((data)[k]["current_current_B"]?.total?.value != undefined) && ((data)[k]["current_coef-active-power_B"]?.total?.value != undefined))){
                  (data)[k]["current_reactive-power_B"] = {total:{value: (((data)[k]["current_voltage_B"]?.total?.value) * ((data)[k]["current_current_B"]?.total?.value) * ((data)[k]["current_sinusf-reactive-power_B"]?.total?.value))/1000}}
                }
                if((data)[k] && ((data)[k]["current_reactive-power_C"]?.total?.value == undefined) && (((data)[k]["current_voltage_C"]?.total?.value != undefined) && ((data)[k]["current_current_C"]?.total?.value != undefined) && ((data)[k]["current_coef-active-power_C"]?.total?.value != undefined))){
                  (data)[k]["current_reactive-power_C"] = {total:{value: (((data)[k]["current_voltage_C"]?.total?.value) * ((data)[k]["current_current_C"]?.total?.value) * ((data)[k]["current_sinusf-reactive-power_C"]?.total?.value))/1000}}
                }
                if((data)[k] && ((data)[k]["current_reactive-power_total"]?.total?.value == undefined) && ((((data)[k]["current_reactive-power_A"]?.total?.value) != undefined) || (((data)[k]["current_reactive-power_B"]?.total?.value) != undefined) || (((data)[k]["current_reactive-power_C"]?.total?.value) != undefined))){
                  (data)[k] = {
                    ...(data)[k],
                    ["current_reactive-power_total"]:{
                      total:{value: (((data)[k]["current_reactive-power_A"]?.total?.value || 0) + ((data)[k]["current_reactive-power_B"]?.total?.value || 0) + ((data)[k]["current_reactive-power_C"]?.total?.value || 0))}
                    }
                  }
                }
                if(((data)[k]?.["current_angle_UI_A"]?.total?.value) != undefined){
                  if((data)[k] && ((data)[k]["current_coef-reactive-power_A"]?.total?.value == undefined)){
                      (data)[k] = {
                        ...(data)[k],
                        ["current_coef-reactive-power_A"]:{
                          total:{value:  (Math.tan((data)[k]?.["current_angle_UI_A"]?.total?.value * Math.PI / 180))}
                        }
                    }
                  }
                }else{
                  if((data)[k] && ((data)[k]["current_coef-reactive-power_A"]?.total?.value == undefined) && ((data)[k]["current_coef-active-power_A"]?.total?.value != undefined)){
                    if(((data)[k]["current_coef-active-power_A"]?.total?.value) != 0) {
                    if((1 / ((data)[k]["current_coef-active-power_A"]?.total?.value)**2) >= 1) {
                      (data)[k] = {
                        ...(data)[k],
                        ["current_coef-reactive-power_A"]:{
                          total:{value: Math.sqrt((1 / (((data)[k]["current_coef-active-power_A"]?.total?.value)**2)) - 1)}
                        }
                        }
                      }
                    }
                  }
                }
                
                if(((data)[k]?.["current_angle_UI_B"]?.total?.value) != undefined){
                  if((data)[k] && ((data)[k]["current_coef-reactive-power_B"]?.total?.value == undefined)){
                      (data)[k] = {
                        ...(data)[k],
                        ["current_coef-reactive-power_B"]:{
                          total:{value:  (Math.tan((data)[k]["current_angle_UI_B"]?.total?.value * Math.PI / 180))}
                        }
                      
                    }
                  }
                }else{
                  if((data)[k] && ((data)[k]["current_coef-reactive-power_B"]?.total?.value == undefined) && ((data)[k]["current_coef-active-power_B"]?.total?.value != undefined)){
                    if(((data)[k]["current_coef-active-power_B"]?.total?.value) != 0) {
                    if((1 / ((data)[k]["current_coef-active-power_B"]?.total?.value)**2) >= 1) {
                      (data)[k] = {
                        ...(data)[k],
                        ["current_coef-reactive-power_B"]:{
                          total:{value: Math.sqrt((1 / (((data)[k]["current_coef-active-power_B"]?.total?.value)**2)) - 1)}
                        }
                      
                        }
                      }
                    }
                  }
                }
                
                if(((data)[k]?.["current_angle_UI_C"]?.total?.value != undefined)){
                  if((data)[k] && ((data)[k]["current_coef-reactive-power_C"]?.total?.value == undefined)){
                      (data)[k] = {
                        ...(data)[k],
                        ["current_coef-reactive-power_C"]:{
                          total:{value:  (Math.tan((data)[k]["current_angle_UI_C"]?.total?.value * Math.PI / 180))}
                        }
                      
                    }
                  }
                }else{
                  if((data)[k] && ((data)[k]["current_coef-reactive-power_C"]?.total?.value == undefined) && ((data)[k]["current_coef-active-power_C"]?.total?.value != undefined)){
                    if(((data)[k]["current_coef-active-power_C"]?.total?.value) != 0) {
                    if((1 / ((data)[k]["current_coef-active-power_C"]?.total?.value)**2) >= 1) {
                      (data)[k] = {
                        ...(data)[k],
                        ["current_coef-reactive-power_C"]:{
                          total:{value: Math.sqrt((1 / (((data)[k]["current_coef-active-power_C"]?.total?.value)**2)) - 1)}
                        }
                        }
                      }
                    }
                  }
                }
                if((data)[k] && ((data)[k]["current_coef-reactive-power_total"]?.total?.value == undefined) && ((((data)[k]["current_coef-reactive-power_A"]?.total?.value) != undefined) || (((data)[k]["current_coef-reactive-power_B"]?.total?.value) != undefined) || (((data)[k]["current_coef-reactive-power_C"]?.total?.value) != undefined))){
                  (data)[k] = {
                    ...(data)[k],
                    ["current_coef-reactive-power_total"]:{
                      total:{value: (((data)[k]["current_coef-reactive-power_A"]?.total?.value || 0) + ((data)[k]["current_coef-reactive-power_B"]?.total?.value || 0) + ((data)[k]["current_coef-reactive-power_C"]?.total?.value || 0))/3}
                    }
                  }
                }
                this.currentTable[0].values?.[0]?.values.push(((data)[k]['current_voltage_A']?.total?.value?.toFixed(2) || '-'))
                this.currentTable[0].values?.[1]?.values.push(((data)[k]['current_voltage_B']?.total?.value?.toFixed(2) || '-'))
                this.currentTable[0].values?.[2]?.values.push(((data)[k]['current_voltage_C']?.total?.value?.toFixed(2) || '-'))
                if((data)[k]['current_voltage_line_A']){
                  this.currentTable[0].values?.[3]?.values.push(((data)[k]['current_voltage_line_A']?.total?.value?.toFixed(2) || '-'))
                }else{
                  this.currentTable[0].values?.[3]?.values.push((((Math.sqrt(3))*(data)[k]['current_voltage_A']?.total?.value)?.toFixed(2) || '-'))
                }
                if((data)[k]['current_voltage_line_B']){
                  this.currentTable[0].values?.[4]?.values.push(((data)[k]['current_voltage_line_B']?.total?.value?.toFixed(2) || '-'))
                }else{
                  this.currentTable[0].values?.[4]?.values.push((((Math.sqrt(3))*(data)[k]['current_voltage_B']?.total?.value)?.toFixed(2) || '-'))
                }
                if((data)[k]['current_voltage_line_C']){
                  this.currentTable[0].values?.[5]?.values.push(((data)[k]['current_voltage_line_C']?.total?.value?.toFixed(2) || '-'))
                }else{
                  this.currentTable[0].values?.[5]?.values.push((((Math.sqrt(3))*(data)[k]['current_voltage_C']?.total?.value)?.toFixed(2) || '-'))
                }
                this.currentTable[1].values?.[0]?.values.push((this.numFixed((data)[k]['current_current_A']?.total?.value) || '-'))
                this.currentTable[1].values?.[1]?.values.push((this.numFixed((data)[k]['current_current_B']?.total?.value) || '-'))
                this.currentTable[1].values?.[2]?.values.push((this.numFixed((data)[k]['current_current_C']?.total?.value) || '-'))
                this.currentTable[2].values?.[0]?.values.push((this.numFixed((data)[k]['current_active-power_A']?.total?.value) || '-'))
                this.currentTable[2].values?.[1]?.values.push((this.numFixed((data)[k]['current_active-power_B']?.total?.value) || '-'))
                this.currentTable[2].values?.[2]?.values.push((this.numFixed((data)[k]['current_active-power_C']?.total?.value) || '-'))
                this.currentTable[2].values?.[3]?.values.push((this.numFixed((data)[k]['current_active-power_total']?.total?.value) || '-'))
                this.currentTable[3].values?.[0]?.values.push((this.numFixed((data)[k]['current_reactive-power_A']?.total?.value) || '-'))
                this.currentTable[3].values?.[1]?.values.push((this.numFixed((data)[k]['current_reactive-power_B']?.total?.value) || '-'))
                this.currentTable[3].values?.[2]?.values.push((this.numFixed((data)[k]['current_reactive-power_C']?.total?.value) || '-'))
                this.currentTable[3].values?.[3]?.values.push((this.numFixed((data)[k]['current_reactive-power_total']?.total?.value) || '-'))
                this.currentTable[4].values?.[0]?.values.push((this.numFixed((data)[k]['current_full-power_A']?.total?.value) || '-'))
                this.currentTable[4].values?.[1]?.values.push((this.numFixed((data)[k]['current_full-power_B']?.total?.value) || '-'))
                this.currentTable[4].values?.[2]?.values.push((this.numFixed((data)[k]['current_full-power_C']?.total?.value) || '-'))
                this.currentTable[4].values?.[3]?.values.push((this.numFixed((data)[k]['current_full-power_total']?.total?.value) || '-'))
                this.currentTable[5].values?.[0]?.values.push((this.numFixed((data)[k]['current_coef-active-power_A']?.total?.value) || '-'))
                this.currentTable[5].values?.[1]?.values.push((this.numFixed((data)[k]['current_coef-active-power_B']?.total?.value) || '-'))
                this.currentTable[5].values?.[2]?.values.push((this.numFixed((data)[k]['current_coef-active-power_C']?.total?.value) || '-'))
                this.currentTable[5].values?.[3]?.values.push((this.numFixed((data)[k]['current_coef-active-power_total']?.total?.value) || '-'))
                this.currentTable[6].values?.[0]?.values.push((this.numFixed((data)[k]['current_sinusf-reactive-power_A']?.total?.value) || '-'))
                this.currentTable[6].values?.[1]?.values.push((this.numFixed((data)[k]['current_sinusf-reactive-power_B']?.total?.value) || '-'))
                this.currentTable[6].values?.[2]?.values.push((this.numFixed((data)[k]['current_sinusf-reactive-power_C']?.total?.value) || '-'))
                this.currentTable[6].values?.[3]?.values.push((this.numFixed((data)[k]['current_sinusf-reactive-power_total']?.total?.value) || '-'))
                this.currentTable[7].values?.[0]?.values.push((this.numFixed((data)[k]['current_coef-reactive-power_A']?.total?.value) || '-'))
                this.currentTable[7].values?.[1]?.values.push((this.numFixed((data)[k]['current_coef-reactive-power_B']?.total?.value) || '-'))
                this.currentTable[7].values?.[2]?.values.push((this.numFixed((data)[k]['current_coef-reactive-power_C']?.total?.value) || '-'))
                this.currentTable[7].values?.[3]?.values.push((this.numFixed((data)[k]['current_coef-reactive-power_total']?.total?.value) || '-'))
                this.currentTable[8].values?.[0]?.values.push(((data)[k]['current_frequency']?.total?.value?.toFixed(2) || '-'))
                this.currentTable[9].values?.[0]?.values.push(((data)[k]['current_angle_phase_AB']?.total?.value?.toFixed(2) || '-'))
                this.currentTable[9].values?.[1]?.values.push(((data)[k]['current_angle_phase_AB']?.total?.value?.toFixed(2) || '-'))
                this.currentTable[9].values?.[2]?.values.push(((data)[k]['current_angle_phase_AB']?.total?.value?.toFixed(2) || '-'))
              }
            })
          }
          this.fetchData = {...this.fetchData,...fetchData}
        }).catch(async (error)=>{
          const statusCode = (error.response || {}).status || -1;
          if (statusCode == 406) {
            if(error.config.method == 'get'){
              await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                localStorage.setItem('session',res?.data?.session)
                this.tableBuilder(date1)
              }).catch((err)=>{
                console.log(err);
              })
            }
          }
        })
        this.pending = false
        }else{
          this.pending = true
          if((this.bf.type == 'meter') && this.bf.meter_id){
            let filter = this.filter
            filter.date2 = date1
            await this.$axios.get(('/billing/table/'+this.bf.meter_id),{params:{...filter}}).then((res) => {
              if(res?.data?.data){
                let result = res?.data?.data?.slice(1)
                this.billing.dates = [...this.billing.dates,...result]
                if(!this.filterView.some(item => item.type == 'billing')){
                  this.filterView = [...this.filterView,this.billing]
                }
              }
            }).catch(async (error)=>{
            const statusCode = (error.response || {}).status || -1;
            if (statusCode == 406) {
              if(error.config.method == 'get'){
                await this.$axios.post('refresh_token','',{headers:{refresh:localStorage.getItem('refresh')}}).then(async (res)=>{
                  localStorage.setItem('session',res?.data?.session)
                  this.tableBuilder(date1)
                }).catch((err)=>{
                  console.log(err);
                })
              }
            }
          })
          }
          this.pending = false
        }
      },
      paginator(e){
        if((((e.target.scrollTop*100)?.toFixed(0))/e.target.scrollHeight)>70){
          clearTimeout(this.timeout)
          const _t = this
          let date1 = null;
          if(this.activeFilterView?.type == 'billing'){
            date1 = (new Date((this.billing?.dates[this.billing?.dates?.length-1])?.date)).toISOString()
          }else{
            date1 = (new Date(Number(Object.keys(this.fetchData)[Object.keys(this.fetchData).length-1]))).toISOString()
          }
          this.timeout = setTimeout(() => {
            _t.tableBuilder(date1)
          }, 1000);
        }
      },
      opener(e){
        const fl = ['openDAte','openDAte1','openDAte2','openDAte3','copenDAte','copenDAte2','copenDAte3','copenDAte4','copenDAte5']
        this[e] = !this[e]
        fl?.forEach((j)=>{if (j!=e) {
          this[j] = false
        }})
      },
      fetcher(e){
        let fetch = e
        if(e) {
         return Object.keys(fetch).length
        }else{
          return false
        }
      },
    },
    async mounted() {
      this.loading = false
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
      this.loading = true
    },
  };
  </script>
  <style>
  </style>
  
  