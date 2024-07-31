<template>
  <div @scroll="paginator($event)" class="svg-block">
    <svg @mousemove="mover($event)" :height="height" :width="width+18" v-if="chartCurrently.length>0 && loading" :viewBox="'0 0 ' + width + ' ' + height" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
      <template v-for="(el,index) in chartCurrently" :key="index">
        <polyline v-for="(chart,chartIdx) in el?.options" :key="'chart'+chartIdx" class="path" :class="{active_path:(active_path==(chartIdx+1)||active_path==0)}" fill="none" :stroke="chart.strokeColor" :stroke-width="chart.strokeWidth" shape-rendering="auto" :points="getPoints(chart.data, index)" />
      </template>

      <template v-for="(el,index) in chartDArr" :key="'a'+index">
        <template v-for="(el1,index1) in el" :key="'b'+index1">
          <template v-for="(item,idx) in el1" :key="'c'+idx">
            <circle v-if="hoverObj" shape-rendering="geometricPrecision" :cx="item[hoverObj]?.x" :cy="item[hoverObj]?.y" r="8" stroke-width="2" :stroke="chartCurrently?.[index]?.options?.[index1].strokeColor" class="circle_r" fill="white"/>
          </template>
        </template>
      </template>
        
      <g v-if="(hoverObj != null)&&(hoverRow != null)">
        <rect id="svg-g" rx="10" :x="((hoverObj*8)/width < 0.5) ? ((hoverObj*8)+20) : (hoverObj*8)- sgw - 20" :y="height/3-25" :width="chartCurrently[hoverRow]?.options?.length*88 + 186" :height="50+(2)*30 + 20" fill="url(#Gradient1)"/>
        <rect rx="5" :x="((hoverObj*8)/width < 0.5) ? ((hoverObj*8)+46) : (hoverObj*8)- sgw + 6" width="135" height="30" :y="190" fill="#1B3748"/>
        <text fill="white" :x="((hoverObj*8)/width < 0.5) ? ((hoverObj*8)+56) : (hoverObj*8)- sgw + 16" :y="210"><tspan>
          {{ time(chartCurrently[hoverRow]?.options[0]?.times?.[hoverObj]) }}
         </tspan>
        </text>
        <line  :x1="((hoverObj*8)/width < 0.5) ? ((hoverObj*8)+46) : (hoverObj*8) - sgw + 6" :y1="230"  :x2="((hoverObj*8)/width < 0.5) ? ((hoverObj*8)+chartCurrently[hoverRow]?.options?.length*88 + 176) : (hoverObj*8) - sgw + chartCurrently[hoverRow]?.options?.length*88 + 126" :y2="230" stroke="white" stroke-width="2"/>
        <template v-for="(el1,index1) in chartCurrently[hoverRow]?.options" :key="'tb'+index1">
          <foreignObject v-if="index1 == 0" :x="(hoverObj*8/width < 0.5) ? (hoverObj*8+46) : (hoverObj*8 - sgw + 6)" :y="height/3+38" width="140" height="200">
              <p>{{el1?.label}}</p>
          </foreignObject>
          <text class="white" fill="white" :x="(hoverObj*8/width < 0.5) ? (hoverObj*8+108+(index1+1)*88) : (hoverObj*8- sgw + 70 +(index1+1)*88)" :y="height/3 + 5">
            {{el1?.label2}}   
          </text>
          <text fill="white" :x="(hoverObj*8/width < 0.5) ? (hoverObj*8+108+(index1+1)*88) : (hoverObj*8- sgw + 70 +(index1+1)*88)" :y="height/3+55">
            {{el1?.data?.[hoverObj]?.toFixed(2)}}   
          </text>
        </template>
      </g>
      <rect v-for="el,idx in chartDArr?.[0]?.[0]?.[0]" :key="idx" @mouseenter="hoverText(idx)" @mouseleave="hoverText(null)"  :x="8 * idx" y="0" width="8" :height="height" fill="transparent"/>
    </svg>
    <div class="svg-timer" :style="'width:'+width+'px'">
      <span :style="'width:'+(11*8)+'px;min-width:'+(11*8)+'px'" v-for="el,index in timeArray" :key="index">{{('0'+new Date(Number(el)).getHours()).slice(-2)}}:{{('0'+new Date(Number(el)).getMinutes()).slice(-2)}}:{{('0'+new Date(Number(el)).getSeconds()).slice(-2)}}</span>
    </div> 
  </div>
</template>
<script>
export default {
  props:{
      chartCurrently:{
          type: Array,
          default: () => [],
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
      chartOptionsData: this.chartCurrently,
      width: window.innerWidth,
      chartDArr: [],
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
      hoverRow: null,
      hoverObj: null,
      active_path: 0,
      fill: '',
      loading: false,
      interval: null,
      sgw: 0,
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
    },
  },
  methods:{
    paginator(e){
      if(this.chartCurrently[0]?.options[0]?.data?.length){
        if((e.target.offsetWidth + e.target.scrollLeft) >= e.target.scrollWidth){
          this.$emit('gpaginate')
        }
      }
    },
    textBreak(e){
      const textElement = e
      const maxWidth = 3; // specify the maximum width for each line
      
      const words = textElement.split(' ');
      let line = '';

      if (words.length < maxWidth) {
        line = words.join(' ');
      } else {
        line = words[0] + ' ' + words[1] + '\n' + words[2]
      }
      return line
    },
    mover(e){
      let row = this.chartCurrently?.length
      this.hoverRow = (Math.ceil((e.layerY)*(row)/this.height))-1;
    },
    async mountFunc(){
      let w = document.getElementsByClassName('area-chart2');
      if(this.timeArray.length > 4){
        let width = (this.chartCurrently?.[0]?.options?.[0]?.data?.length*8)
        if(width < w[0]?.offsetWidth) {
          this.width = w[0]?.offsetWidth - 18
        }else{
          this.width = width
        }
      }else{
        this.width = (w[0]?.offsetWidth-18);
      }
      await this.chartCurrently?.forEach((item,idx)=>{
        this.chartDArr[idx] = []
        item?.options?.forEach((forData,index)=>{
          this.chartDArr[idx][index] = []
          var data = forData.data
          const height = this.height
          var length = this.chartCurrently?.length
          const max = Math.max(...data)
          const min = Math.min(...data)
          let coef = 1
          const chartHeight = (height - (length + 1) * 10) / length
          
          if(max - min != 0) {
            coef = chartHeight / Number(max - min)
          }
          else coef = 1
          let arr = [];
          data.forEach((point, elemIdx) => {
            let y = 0
            if(max - min != 0) {
              y = ((max * coef) - Number(point * coef) + chartHeight * idx) + 10*(idx+1)
            }
            else if(Number(point) == 0) {
              y = (Number(point) + chartHeight * idx) + chartHeight / 2 + 10*(idx+1)
            }
            else if(Number(point) > 0) {
              y = (Number(point) + chartHeight * idx) + 10*(idx+1)
            }
            else if(Number(point) < 0) {
              y = (Number(point) + chartHeight * idx) + chartHeight + 10*(idx+1)
            }
            arr.push({x:((8 * elemIdx).toFixed(4)),y:((y).toFixed(4))})
          })
          this.chartDArr[idx][index].push(arr)
          arr = []
        })
      })
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
    time(time) {
      let date = new Date(Number(time))
      let newdate = ('0'+date.getDate()).slice(-2)+' '+ this.months[Number(date.getMonth())]?.[this.$i18n.locale.value]
      let newtime = ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+':'+('0'+date.getSeconds()).slice(-2)
      return newdate+' '+newtime
    },
    hoverText(index){
      let g = document.getElementById('svg-g')
      if(g?.getBoundingClientRect()?.width){
        this.sgw = g?.getBoundingClientRect()?.width
      }
      if(index >= 0) this.hoverObj = index
    },

    getPoints(data, idx){
      const height = this.height
      var length = this.chartCurrently?.length
      const max = Math.max(...data)
      const min = Math.min(...data)
      let coef = 1
      let res = ''
      const chartHeight = (height - (length + 1) * 10) / length
      
      if(max - min != 0) {
        coef = chartHeight / Number(max - min)
      }
      else coef = 1
      let arr = [];
      data.forEach((point, elemIdx) => {
        let y = 0
        if(max - min != 0) {
          y = ((max * coef) - Number(point * coef) + chartHeight * idx) + 10*(idx+1)
        }
        else if(Number(point) == 0) {
          y = (Number(point) + chartHeight * idx) + chartHeight / 2 + 10*(idx+1)
        }
        else if(Number(point) > 0) {
          y = (Number(point) + chartHeight * idx) + 10*(idx+1)
        }
        else if(Number(point) < 0) {
          y = (Number(point) + chartHeight * idx) + chartHeight + 10*(idx+1)
        }
        arr.push({x:((8 * elemIdx).toFixed(4)),y:((y).toFixed(4))})
        res += (8 * elemIdx).toFixed(4) + ',' + (y).toFixed(4) + ' '
      })
      arr = []
      return res
    },

  },

  watch: {
    async chartCurrently() {
      this.chartOptionsData = this.chartCurrently
      await this.mountFunc()
    },
    async height(){
      this.loading = false
      this.width = (this.chartCurrently?.[0]?.options?.[0]?.data?.length*8)
      await this.mountFunc()
      this.loading = true
    }
  },

  async mounted() {
    this.loading = false
    await this.mountFunc()
    this.loading = true
    // addEventListener("resize", () => {this.width = (w[0].offsetWidth-48)});
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