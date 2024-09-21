<template>
    <div>
      <svg class="dashboard-chart" :height="height" :width="maxWidth||width" v-if="chartOptionsData.options.length>0 && nosvg" :viewBox="'0 0 ' + width + ' ' + height" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
        <text v-for="(el,idx) in chartOptionsData.dataLeft" :key="'text'+idx" x="0" :y="idx*((height-60)/(chartOptions.dataLeft.length-1))+(chartOptions.dataLeft.length-idx)*2+24" class="medium text-black">{{el>1 ? el?.toFixed(0) : el?.toFixed(3)}}</text>
        <line stroke-dasharray="5,5" y1="28" x1="70" y2="28" :x2="width" :style="'stroke:'+chartOptions.lineColor+';stroke-width:'+1" />
        <line stroke-dasharray="5,5" v-for="(el,idx) in chartOptions.dataLeft.slice(0,(chartOptions.dataLeft.length-2))" :key="idx" :y1="(idx+1)*((height-60)/(chartOptions.dataLeft.length-1))+24" x1="70" :y2="(idx+1)*((height-60)/(chartOptions.dataLeft.length-1))+24" :x2="width" :style="'stroke:'+chartOptions.lineColor+';stroke-width:'+1" />
        <line stroke-dasharray="5,5" :y1="height-34" x1="70" :y2="height-34" :x2="width" :style="'stroke:'+chartOptions.lineColor+';stroke-width:'+1" />
        <path v-for="(chart,chartIdx) in chartOptionsData.options" :key="'chart'+chartIdx" class="path" :class="{active_path:(active_path==(chartIdx+1)||active_path==0)}" fill="none" :stroke="chart.strokeColor" :stroke-width="chart.strokeWidth" :d="chartDArr[chartIdx]" />
        <text v-for="(el,idx) in chartOptionsData.options[0]?.labels" :key="'labels'+idx" :y="height-4" :x="(width/(chartOptionsData.options[0]?.data?.length)) * idx+70" class="medium text-black">{{dateFilter(el)}}</text>
        <g v-if="hoverObj.index != null && (Number(hoverObj.sp)/width <= 0.8)">
          <line stroke-dasharray="5,5" y1="28" :x1="(hoverObj.sp*0.97)-5" :y2="height-40" :x2="(hoverObj.sp*0.97)-5" style="stroke:black;stroke-width:1" />
          <rect rx="10" :x="(hoverObj.sp*0.97)+15" :y="height/5" width="190" :height="50+chartOptionsData.options.length*30" fill="url(#Gradient1)"/>
          <rect rx="5" :x="(hoverObj.sp*0.97)+35" :y="height/5+12" width="120" :height="24" fill="white" opacity="0.1"/>
          <text fill="white" :x="(hoverObj.sp*0.97)+40" :y="height/5+30">{{dateFilter2(filteredArr[0]?.labels?.[(hoverObj.index)])}}</text>
          <line :y1="height/5+40" :x1="(hoverObj.sp*0.97)+35" :y2="height/5+40" :x2="(hoverObj.sp*0.97)+155" style="stroke:white;stroke-width:1" />
          <text fill="white" v-for="el,index in filteredArr" :key="index" :x="(hoverObj.sp*0.97)+35" :y="height/5+30*(index+2)+5">{{filteredArr[index].label}}   <tspan>{{filteredArr[index]?.data[(hoverObj.index)]?.toFixed(2)}}</tspan></text>
        </g>
        <g v-else-if="(Number(hoverObj.sp)/width > 0.8)">
          <line stroke-dasharray="5,5" y1="28" :x1="(hoverObj.sp*0.97)-5" :y2="height-40" :x2="(hoverObj.sp*0.97)-5" style="stroke:black;stroke-width:1" />
          <rect rx="10" :x="(hoverObj.sp*0.97)-215" :y="height/5" width="190" :height="50+chartOptionsData.options.length*30" fill="url(#Gradient1)"/>
          <rect rx="5" :x="(hoverObj.sp*0.97)-195" :y="height/5+12" width="120" :height="24" fill="white" opacity="0.1"/>
          <text fill="white" :x="(hoverObj.sp*0.97)-185" :y="height/5+30">{{dateFilter2(filteredArr[0]?.labels?.[(hoverObj.index)])}}</text>
          <line :y1="height/5+40" :x1="(hoverObj.sp*0.97)-195" :y2="height/5+40" :x2="(hoverObj.sp)-95" style="stroke:white;stroke-width:1" />
          <text fill="white" v-for="el,index in filteredArr" :key="index" :x="(hoverObj.sp*0.97)-195" :y="height/5+30*(index+2)+5">{{filteredArr[index].label}}   <tspan>{{filteredArr[index].data[(hoverObj.index)]?.toFixed(2)}}</tspan></text>
        </g>
        <rect @mouseleave="hoverText(null,null,null)" @mouseenter="hoverText(el,index,(width/(chartOptionsData.options[0]?.data?.length) * index + 90))" v-for="(el,index) in chartOptionsData.options[0]?.data" :key="index" :x="(width/(chartOptionsData.options[0]?.data?.length)) * index+40" y="0" :width="width/(chartOptionsData.options[0]?.data?.length)" :height="height" fill="transparent"/>
      </svg>
    </div>
  </template>
  <script>
  export default {
    props:{
        chartOptions:{
            type: Object,
            default: () => {},
        },
        height:{
            type: [Number,String],
            default: () => 0,
        },
        maxHeight:{
            type: [Number,String],
            default: () => 0,
        },
        maxWidth:{
            type: [Number,String],
            default: () => null,
        },
    },
    watch: {
      chartOptions: {
        handler() {
          this.chartOptionsData = this.chartOptions
          this.mountFunc()
        },
        deep: true
      },
      height() {
        this.mountFunc()
      },
    },
    data() {
      return {
        chartOptionsData: this.chartOptions,
        width: window.innerWidth,
        newArr: [],
        chartArr: [],
        chartDArr: [],
        points: [],
        hoverObj: {
          el: null,
          index: null,
          sp: null,
        },
        chartDFArr: [],
        active_path: 0,
        active_click_path: 0,
        s: 1,
        nosvg: true,
        fill: '',
        months: [
          { label: {uz:"Yanvar",en:"January",ru:"Январь"}, shortLabel: {uz:"Yan",en:"Jan",ru:"Янв"} },
          { label: {uz:"Fevral",en:"February",ru:"Февраль"}, shortLabel: {uz:"Fev",en:"Feb",ru:"Фев"} },
          { label: {uz:"Mart",en:"March",ru:"Март"}, shortLabel: {uz:"Mar",en:"Mar",ru:"Мар"} },
          { label: {uz:"Aprel",en:"April",ru:"Апрель"}, shortLabel: {uz:"Apr",en:"Apr",ru:"Апр"} },
          { label: {uz:"May",en:"May",ru:"Май"}, shortLabel: {uz:"May",en:"May",ru:"Май"} },
          { label: {uz:"Iyun",en:"June",ru:"Июнь"}, shortLabel: {uz:"Iyun",en:"June",ru:"Июнь"} },
          { label: {uz:"Iyul",en:"July",ru:"Июль"}, shortLabel: {uz:"Iyul",en:"July",ru:"Июль"} },
          { label: {uz:"Avgust",en:"August",ru:"Август"}, shortLabel: {uz:"Avg",en:"Aug",ru:"Авг"} },
          { label: {uz:"Sentabr",en:"September",ru:"Сентябрь"}, shortLabel: {uz:"Sen",en:"Sept",ru:"Сен"} },
          { label: {uz:"Oktabr",en:"October",ru:"Октябрь"}, shortLabel: {uz:"Okt",en:"Oct",ru:"Окт"} },
          { label: {uz:"Noyabr",en:"November",ru:"Ноябрь"}, shortLabel: {uz:"Noy",en:"Nov",ru:"Ноя"} },
          { label: {uz:"Dekabr",en:"December",ru:"Декабрь"}, shortLabel: {uz:"Dek",en:"Dec",ru:"Дек"} },
        ],
      };
    },
    computed:{
      startText(){
        return parseInt((this.width-50)/(this.chartOptionsData.options[0]?.labels?.length-0.6));
      },
      filteredArr(){
        return this.chartOptionsData.options.filter((el)=>el.data.length>0)
      },
    },
    methods:{
      dateFilter(e){
        if(e){
          let date1 = Number(e.split('/')[0]) - 1
          let newdate = this.months[date1]?.shortLabel?.[this.$i18n.locale.value]
          return newdate
        }else{
          return "-"
        }
      },
      dateFilter2(e){
        if(e){
          let date1 = Number(e.split('/')[0]) - 1
          let date2 = e.split('/')[1]
          let newdate = this.months[date1]?.shortLabel?.[this.$i18n.locale.value]
          return  newdate+'  '+date2
        }else{
          return "-"
        }
      },
      hoverText(el,index,sp){
        this.hoverObj = {el:el,index:index,sp:sp}
      },
      chartD(){
        const height = this.height-60
        this.newArr?.forEach((item,elemIdx)=>{
          let arr = item
          if(item.length){
            item?.forEach((el,indx)=>{
              this.newArr[elemIdx][indx] = (this.newArr[elemIdx][indx]+this.chartArr[elemIdx][indx])
              let res = '';
              let x = parseInt((this.width-90)/(arr.length-1));
              let next = 0
                arr?.forEach((el,index)=>{
                  if(((index+1)!=arr.length)&&index!=0){
                      let y = (height - el)
                      arr.length <= (index + 1) ? next = (el) : next = (arr[index+1]);
                      this.points[elemIdx][index]=(this.points[elemIdx][index] = {x:(x*(index+1)-x+50).toFixed(1),y:(y+24).toFixed(1)})
                      res += 'L ' + (x*(index+1)-x+90).toFixed(1) + ',' + (y+24).toFixed(1) + ' C ' + ((index+2)*x-1.5*x+90).toFixed(1) + ',' + (y+24).toFixed(1) + ' ' + ((index+2)*x-1.5*x+90).toFixed(1) + ',' + (height - next+24).toFixed(1) + ' ' + (x*(index+3)-2*x+90).toFixed(1) + ',' + (height - next+24).toFixed(1) + ' '
                    }
                });
                this.points[elemIdx][0]=(this.points[elemIdx][0] = {x:50,y:(height-arr[0]+24).toFixed(1)})
                this.points[elemIdx][(this.points[elemIdx].length-1)] = (this.points[elemIdx][this.points[elemIdx].length-1] = {x:(x*(this.points[elemIdx].length-1)+50).toFixed(1),y:(height - arr[this.points[elemIdx].length-1]+24).toFixed(1)})
                res = 'M 65' + ',' + (height-arr[0]+24).toFixed(1) + ' C '+ (0.5*x + 50)+ ','+(height-arr[0]+24).toFixed(1) + ' ' + (x/2 + 50) + ',' + (height-arr[1]+24).toFixed(1) + ' ' + (x+50) + ','+(height-arr[1]+24).toFixed(1) + ' ' + res
                this.fill = ' L ' + (x*(arr.length-1)+50).toFixed(1) + ',' + (height+24).toFixed(1) + ' L 50' + ',' + (height+24).toFixed(1)
                this.chartDArr[elemIdx] = (this.chartDArr[elemIdx] = res) 
              })
          }else{
            this.chartDArr[elemIdx] = (this.chartDArr[elemIdx] = '') 
          }
        })
      },
      mountFunc(){
        let w = document.getElementsByClassName('expense-energy-yearly');
        this.width = (w[0]?.offsetWidth-48);
        const height = this.height-75;
        let idx = (height/this.maxHeight);
        this.newArr = []
        this.chartArr = []
        this.points = []
        this.chartOptions?.options?.forEach((el,index)=>{
          this.newArr[index] = []
          this.chartArr[index] = []
          this.points[index] = []
        })
        this.chartOptions?.options?.forEach((el,indx)=>{
          el?.data?.forEach((el2,index)=>{
            this.newArr[indx][index] = 0
            this.chartArr[indx][index] = 0
            this.points[indx][index] = {x:0,y:0}
          })
        })
        this.chartD()
        
        this.chartOptions?.options?.forEach((el,indx)=>{
          let x = parseInt((this.width-50)/(el.data.length-1));
          el?.data?.forEach((el2,index)=>{this.newArr[indx][index] = Number(0),this.chartArr[indx][index] = (Number(el2))*(Number(idx)),this.points[indx][index] = {x:(Number(indx))*(Number(x)),y:(Number(el2))*(Number(idx))}})
        })
        this.chartD()
      }
    },
    mounted() {
      let a = this.chartOptions.dataLeft.filter((el)=> el!=0 )
      if(!a.length) this.nosvg = false
      this.mountFunc()
      
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