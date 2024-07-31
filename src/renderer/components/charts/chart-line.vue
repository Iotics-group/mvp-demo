<template>
  <div @scroll="paginator($event)" class="svg-block">
    <svg :height="height" :width="width+18" v-if="chartOptions?.options?.length>0 && !loading" :viewBox="'0 0 ' + width + ' ' + height" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <filter x="-0.1" y="-0.1" width="1.2" height="1.2" id="solid">
          <feFlood flood-color="rgba(255, 255, 255, 0.24)"/>
          <feComposite in="SourceGraphic" operator="over" />
        </filter>
      </defs>
      <linearGradient id="Gradient1">
        <stop offset="0%" stop-color="#012F46" />
        <stop offset="47%" stop-color="#010D1D"/>
        <stop offset="141%" stop-color="#01354C" />
      </linearGradient>
      <polyline v-for="(chart,chartIdx) in chartOptions?.options" :key="'chart'+chartIdx" class="path" :class="{active_path:(active_path==(chartIdx+1)||active_path==0)}" fill="none" :stroke="chart.strokeColor" :stroke-width="chart.strokeWidth" shape-rendering="geometricPrecision" :points="getPoints(chart?.data, chartIdx)" />
      <template v-for="(el,index) in points2" :key="index">
        <circle shape-rendering="geometricPrecision" v-if="hoverObj.index != null" :cx="chartDArr[index][hoverObj.index]?.x" :cy="chartDArr[index][hoverObj.index]?.y" r="8" stroke-width="2" :stroke="hoverObj.el != null ? chartOptions?.options[index].strokeColor : 'transparent'" class="circle_r" fill="white"/>
        <rect @mouseenter="hoverText(chart,chartIdx,chartOptions?.options[index].data[chartIdx])" @mouseleave="hoverText(null,null,null)" v-for="(chart,chartIdx) in el" :key="chartIdx" :x="8.65 * chartIdx" y="0" width="8.65" :height="height" fill="transparent"/>
      </template>
      <g v-if="hoverObj.index != null">
        <rect rx="10" :x="(Number(hoverObj.chart?.x)/width < ((chartOptions?.options[0]?.times?.length <= 150) ? 0.5 : 0.8)) ? (Number(hoverObj.chart?.x)+16) : Number(hoverObj.chart?.x)-340" :y="height/3-25" width="340" :height="70+chartOptions?.options?.length*30" fill="url(#Gradient1)"/>
        <rect rx="5" :x="(Number(hoverObj.chart?.x)/width < ((chartOptions?.options[0]?.times?.length <= 150) ? 0.5 : 0.8)) ? Number(hoverObj.chart?.x)+46 : Number(hoverObj.chart?.x)-320" width="120" height="30" :y="190" fill="#1B3748"/>
        <text fill="white" :x="(Number(hoverObj.chart?.x)/width < ((chartOptions?.options[0]?.times?.length <= 150) ? 0.5 : 0.8)) ? Number(hoverObj.chart?.x)+56 : Number(hoverObj.chart?.x)-310" :y="210">
          <tspan>
            {{ time(chartOptions?.options[0]?.times?.[(hoverObj.index)]) }}
          </tspan>
        </text>
        <line  :x1="(Number(hoverObj.chart?.x)/width < ((chartOptions?.options[0]?.times?.length <= 150) ? 0.5 : 0.8)) ? Number(hoverObj.chart?.x)+46 : Number(hoverObj.chart?.x)-320" :y1="230"  :x2="(Number(hoverObj.chart?.x)/width < ((chartOptions?.options[0]?.times?.length <= 150) ? 0.5 : 0.8)) ? Number(hoverObj.chart?.x)+320 : Number(hoverObj.chart?.x) - 40" :y2="230" stroke="white" stroke-width="2"/>
        <text fill="white" :x="(Number(hoverObj.chart?.x)/width < ((chartOptions?.options[0]?.times?.length <= 150) ? 0.5 : 0.8)) ? Number(hoverObj.chart?.x)+46 : Number(hoverObj.chart?.x)-320" :y="height/3+30*(indx+1)+25" v-for="el,indx in chartOptions?.options" :key="indx">{{el.label}} :   
         <tspan>
          {{ 
           textFilter((el.data[(hoverObj.index)])?.toFixed(3)) 
          }}
         </tspan>
        </text>
      </g>
    </svg>
    <div class="svg-timer" v-if="(width)" :style="'margin-left:10px;width:'+(width)+'px'">
      <!-- <span v-for="el,index in timeArray" :key="index">{{new Date(el).getHours()}}:{{new Date(el).getMinutes()}}:{{new Date(el).getSeconds()}}</span> -->
      <span :style="'width:'+(11*8.65)+'px;min-width:'+(11*8.65)+'px'" v-for="el,index in timeArray" :key="index">{{ time(el) }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    chartOptions:{
      type: Object,
      default: () => {},
    },
    times: {
      type: Object,
    },
    height:{
      type: [Number,String],
      default: () => 0,
    },
  },
  data() {
    return {
      chartOptionsData: this.chartOptions,
      width: 0,
      chartDArr: [],
      points: [],
      points2: [],
      
      months: [
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
      ],
      hoverObj: {
        chart: null,
        index: null,
        el: null,
      },
      active_path: 0,
      active_click_path: 0,
      s: 1,
      fill: '',
      loading: true,
      interval: null
    };
  },
  computed:{
    timeArray(){
      let newArr = []
      let sorterTimes = []
      if(this.times !== null && this.times !== undefined) {
        newArr = Object.keys(this.times)

        for(let i = 5; i < newArr.length; i += 11) {
          sorterTimes.push(newArr[i])
        }
      }
      return sorterTimes
    }
  },
  methods:{
    paginator(e){
      if(this.chartOptions?.options[0]?.data?.length){
        if((e.target.offsetWidth + e.target.scrollLeft) >= e.target.scrollWidth){
          this.$emit('gpaginate')
        }
      }
    },
    textFilter(e){
      if(e){
        let text = e.split('')
        let sum = ''
        if(Number(e)<999){
          for (let index = 0; index < 5; index++) {
            sum += text[index]
          }
        }else{
          sum = Number(e)?.toFixed(1)
        }
        return sum
      }
    },
    hoverText(chart,index,el){
      this.hoverObj = {chart: chart,index:index,el:el}
    },

    getPoints(data, index){
      const height = this.height
      var length = this.chartOptions.options.length
      const max = Math.max(...data)
      const min = Math.min(...data)
      let coef = 1
      let res = ''
      if(length){
      const chartHeight = (height - (length + 1) * 10) / length
      
      if(max - min != 0) {
        coef = chartHeight / Number(max - min)
      }
      else coef = 1
      let arr = [];
      data.forEach((point, elemIdx) => {
        let y = 0
        if(max - min != 0) {
          y = ((max * coef) - Number(point * coef) + chartHeight * index) + 10*(index+1)
        }
        else if(Number(point) == 0) {
          y = (Number(point) + chartHeight * index) + chartHeight / 2 + 10*(index+1)
        }
        else if(Number(point) > 0) {
          y = (Number(point) + chartHeight * index) + 10*(index+1)
        }
        else if(Number(point) < 0) {
          y = (Number(point) + chartHeight * index) + chartHeight + 10*(index+1)
        }
        arr.push({x:((8.65 * elemIdx).toFixed(4)),y:((y).toFixed(4))})
        res += (8.65 * elemIdx).toFixed(4) + ',' + (y).toFixed(4) + ' '
      })
      this.chartDArr.push(arr)
      arr = []
      return res
    }
    },

    time(time) {
      let date = new Date(Number(time))
      let newdate = ('0'+date.getDate()).slice(-2)+' '+ this.months[Number(date.getMonth())]?.[this.$i18n.locale.value]
      let newtime = ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)
      return newdate+' '+newtime
    }
  },

  watch: {
    chartOptions: {
      immediate: true,
      handler(page) {
        this.chartOptionsData = page
      }
    },
    height(){
      this.width = (this.chartOptions?.options?.[0]?.data?.length*8.65)
      const height = this.height
      this.loading = true
      var length = this.chartOptions?.options?.length
        this.points = []
        this.points2 = []
    if(length){
      for(let i=0;i<this.chartOptions?.options?.length;i++){
        this.points.push([])
      }
      setTimeout(() => {
        this.chartOptions?.options.forEach((el,indx)=>{
          el?.data?.forEach((el2,index)=>{this.points[indx][index] = {x:(8.65 * index).toFixed(2),y:((height/2)*((2*indx+1)/length)-el2*2)}})
        })
        this.points2 = [...this.points]
        this.chartOptions?.options.forEach((chart,chartIdx)=>{this.getPoints(chart.data, chartIdx)})
      }, 1000);
    }
      this.loading = false
    }
  },
 mounted() {
    this.loading = true
    setTimeout(() => {
      let w = document.getElementsByClassName('area-chart')
      if(this.chartOptions?.options?.[0]?.data?.length > 4){
        this.width = (this.chartOptions?.options?.[0]?.data?.length*8.65)
      }
      if(this.width < w[0]?.offsetWidth) {
        this.width = w[0]?.offsetWidth - 18
      }
      const height = this.height
      var length = this.chartOptions?.options?.length
      this.points = []
    if(length){
      this.chartOptions?.options.forEach(()=>{ this.points.push([]) })
        this.chartOptions && this.chartOptions.options && this.chartOptions.options.forEach((el,indx)=>{
          el?.data?.forEach((el2,index)=>{this.points[indx][index] = {x:(8.65 * index).toFixed(2),y:((height/2)*((2*indx+1)/length)-el2*2)}})
        })
      this.points2 = [...this.points]
    }
      this.loading = false
    }, 1000);
  }
}
</script>
<style scoped>
.circle_r{
  cursor: pointer;
}
.medium {
  font-weight: 500;
  line-height: 17px;
  letter-spacing: 0.5px;
}
.small {
  font-weight: 500;
  font-size: 15px;
  line-height: 15px;
  letter-spacing: 0.5px;
}
.text-black {
  fill: black;
}
</style>