<template>
    <div id="svgDash">
      <svg class="dashboard-chart" :height="height" :name="width" :width="maxWidth||width" v-if="chartOptionsData.options.length>0 && chartOptions.dataLeft.length && nosvg" :viewBox="'0 0 ' + width + ' ' + height" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
        <text v-for="(el,idx) in chartOptionsData.dataLeft" :key="'text'+idx" x="0" :y="idx*((height-60)/(chartOptions.dataLeft.length-1))+(chartOptions.dataLeft.length-idx)*2+24" class="medium text-black" style="font-size: 14px;">{{el>1 ? el?.toFixed(0) : el?.toFixed(3)}}</text>
        <line v-if="chartOptions.dataLeft.length" stroke-dasharray="5,5" y1="28" x1="40" y2="28" :x2="width" :style="'stroke:'+chartOptions.lineColor+';stroke-width:'+1" />
        <line stroke-dasharray="5,5" v-for="(el,idx) in chartOptions.dataLeft.slice(0,(chartOptions.dataLeft.length-2))" :key="idx" :y1="(idx+1)*((height-60)/(chartOptions.dataLeft.length-1))+24" x1="40" :y2="(idx+1)*((height-60)/(chartOptions.dataLeft.length-1))+24" :x2="width" :style="'stroke:'+chartOptions.lineColor+';stroke-width:'+1" />
        <line v-if="chartOptions.dataLeft.length" stroke-dasharray="5,5" :y1="height-34" x1="40" :y2="height-34" :x2="width" :style="'stroke:'+chartOptions.lineColor+';stroke-width:'+1" />
        <path v-for="(chart,chartIdx) in chartOptionsData.options" :key="'chart'+chartIdx" class="path" :class="{active_path:(active_path==(chartIdx+1)||active_path==0)}" fill="none" :stroke="chart.strokeColor" :stroke-width="chart.strokeWidth" :d="chartDArr[chartIdx]" />
        <text v-for="(el,idx) in chartOptionsData.options[0]?.labels" :key="'labels'+idx" :y="height-4" :x="(idx)*startText + 5" class="medium text-black">{{dateFilter(el)}}</text>
        <g v-if="hoverObj.index != null && (Number(hoverObj.sp)/width <= 0.5)">
          <line stroke-dasharray="5,5" y1="28" :x1="(hoverObj.sp)-45" :y2="height-40" :x2="(hoverObj.sp)-45" style="stroke:black;stroke-width:1" />
          <rect rx="10" :x="(hoverObj.sp)-40" :y="height/5" width="190" :height="20+(filteredArr.length+1)*30" fill="url(#Gradient1)"/>
          <rect rx="5" :x="(hoverObj.sp)-15" :y="height/5+12" width="150" :height="24" fill="white" opacity="0.1"/>
          <text fill="white" :x="(hoverObj.sp)-10" :y="height/5+30">{{dateFilter2(filteredArr[0]?.labels?.[(hoverObj.index)])}}</text>
          <line :y1="height/5+40" :x1="(hoverObj.sp)-15" :y2="height/5+40" :x2="(hoverObj.sp)+130" style="stroke:white;stroke-width:1" />
          <text fill="white" v-for="el,index in filteredArr" :key="index" :x="(hoverObj.sp)-15" :y="height/5+30*(index+2)+5">{{filteredArr[index].label}}   <tspan>{{filteredArr[index]?.data[(hoverObj.index)]?.toFixed(2)}}</tspan></text>
        </g>
        <g v-else-if="(Number(hoverObj.sp)/width > 0.5)">
          <line stroke-dasharray="5,5" y1="28" :x1="(hoverObj.sp)-55" :y2="height-40" :x2="(hoverObj.sp)-55" style="stroke:black;stroke-width:1" />
          <rect rx="10" :x="(hoverObj.sp)-270" :y="height/5" width="190" :height="20+(filteredArr.length+1)*30" fill="url(#Gradient1)"/>
          <rect rx="5" :x="(hoverObj.sp)-250" :y="height/5+12" width="150" :height="24" fill="white" opacity="0.1"/>
          <text fill="white" :x="(hoverObj.sp)-245" :y="height/5+30">{{dateFilter2(filteredArr[0]?.labels?.[(hoverObj.index)])}}</text>
          <line :y1="height/5+40" :x1="(hoverObj.sp)-250" :y2="height/5+40" :x2="(hoverObj.sp)-105" style="stroke:white;stroke-width:1" />
          <text fill="white" v-for="el,index in filteredArr" :key="index" :x="(hoverObj.sp)-250" :y="height/5+30*(index+2)+5">{{filteredArr[index].label}}   <tspan>{{filteredArr[index].data[(hoverObj.index)]?.toFixed(2)}}</tspan></text>
        </g>
        <rect @mouseleave="hoverText(null,null,null)" @mouseenter="hoverText(el,index,(width/(chartOptionsData.options[0]?.data?.length) * index + 90))" v-for="(el,index) in chartOptionsData.options[0]?.data" :key="index" :x="(width/(chartOptionsData.options[0]?.data?.length)) * index" y="0" :width="width/(chartOptionsData.options[0]?.data?.length)" :height="height" fill="transparent"/>
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
        width: (document.getElementById('svgDash')?.clientWidth||550),
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
        fill: '',
        nosvg: true
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
          let date = new Date(e)
          let newdate = ('0'+date.getDate()).slice(-2)+'.'+('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
          return  newdate
        }else{
          return "-"
        }
      },
      dateFilter2(e){
        if(e){
          let date = new Date(e)
          let newdate = ('0'+date.getDate()).slice(-2)+'.'+('0'+(date.getMonth()+1)).slice(-2)+'.'+date.getFullYear()
          let newtime = ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+':'+('0'+date.getSeconds()).slice(-2)
          return  newdate+' - '+newtime
        }else{
          return "-"
        }
      },
      hoverText(el,index,sp){
        this.hoverObj = {el:el,index:index,sp:sp}
      },
      chartD(){
        const height = this.height-60
        this.newArr.forEach((item,elemIdx)=>{
          let arr = item
          item.forEach((el,indx)=>{
            this.newArr[elemIdx][indx] = (this.newArr[elemIdx][indx]+this.chartArr[elemIdx][indx])
            let res = '';
            let last = '';
            let x = parseInt((this.width-90)/(arr.length-1));
            let next = 0
              arr.forEach((el,index)=>{
                if(((index+1)!=arr.length)&&index!=0){
                    let y = (height - el)
                    arr.length <= (index + 1) ? next = (el) : next = (arr[index+1]);
                    this.points[elemIdx][index]=(this.points[elemIdx][index] = {x:(x*(index+1)-x+50).toFixed(1),y:(y+24).toFixed(1)})
                    res += 'L ' + (x*(index+1)-x+40).toFixed(1) + ',' + (y+24).toFixed(1) + ' C ' + ((index+2)*x-1.5*x+40).toFixed(1) + ',' + (y+24).toFixed(1) + ' ' + ((index+2)*x-1.5*x+40).toFixed(1) + ',' + (height - next+24).toFixed(1) + ' ' + (x*(index+3)-2*x+40).toFixed(1) + ',' + (height - next+24).toFixed(1) + ' '
                    last = 'L ' + (x*(index+3)+40).toFixed(1) + ',' + (height - next+24).toFixed(1)
                  }
              });
              this.points[elemIdx][0]=(this.points[elemIdx][0] = {x:50,y:(height-arr[0]+24).toFixed(1)})
              this.points[elemIdx][(this.points[elemIdx].length-1)] = (this.points[elemIdx][this.points[elemIdx].length-1] = {x:(x*(this.points[elemIdx].length-1)+50).toFixed(1),y:(height - arr[this.points[elemIdx].length-1]+24).toFixed(1)})
              res = 'M 40' + ',' + (height-arr[0]+24).toFixed(1) + ' C '+ (0.5*x + 50)+ ','+(height-arr[0]+24).toFixed(1) + ' ' + (x/2 + 50) + ',' + (height-arr[1]+24).toFixed(1) + ' ' + (x+50) + ','+(height-arr[1]+24).toFixed(1) + ' ' + res + last
              this.fill = ' L ' + (x*(arr.length-1)+50).toFixed(1) + ',' + (height+24).toFixed(1) + ' L 50' + ',' + (height+24).toFixed(1)
              this.chartDArr[elemIdx] = (this.chartDArr[elemIdx] = res) 
            })
          })
      },
      mountFunc(){
        if(this.chartOptions?.options?.[0]?.labels?.length > 4){
          this.width = 90*this.chartOptions?.options?.[0]?.labels?.length
        }else{
          this.width = (document.getElementById('svgDash')?.clientWidth)
        }
        const height = this.height-75
        let idx = (height/this.maxHeight);
        this.newArr = []
        this.chartArr = []
        this.points = []
        this.chartOptions?.options.forEach(()=>{
          this.newArr.push([])
          this.chartArr.push([])
          this.points.push([])
        })
    
        this.chartOptions?.options.forEach((el,indx)=>{
          el.data.forEach((el2,index)=>{
            this.newArr[indx][index] = 0
            this.chartArr[indx][index] = 0
            this.points[indx][index] = {x:0,y:0}
          })
        })
        this.chartD()
        
        this.chartOptions?.options.forEach((el,indx)=>{
          let x = parseInt((this.width-50)/(el.data.length-1));
          el.data.forEach((el2,index)=>{this.newArr[indx][index] = 0,this.chartArr[indx][index] = el2*idx,this.points[indx][index] = {x:indx*x,y:el2*idx}})
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