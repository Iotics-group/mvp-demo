<template>
  <div>
    <div v-if="editable" class="wtime-w">
      <div class="wtime-m">
        <button :title="time.values?.[idx]?.label?.[$i18n.locale.value]" @mousedown="down(idx)" @mouseup="up(idx)" @mouseover="over(idx)" @click="clicked" v-for="item,idx in 7" :key="idx" :style="time.values?.[idx]?.active ? 'background: rgba(255, 255, 255, 0.25);':'background: transparent;'">{{ time.values?.[idx]?.label?.[$i18n.locale.value] }}</button>
      </div>
    </div>
    <div v-else class="wtime-w">
      <div class="wtime-m">
        <button :title="time.values?.[idx]?.label?.[$i18n.locale.value]" v-for="item,idx in 7" :key="idx" :style="time.values?.[idx]?.active ? 'background: rgba(0, 0, 0, 0.1);color:#000;cursor:default':'background: transparent;color:#000;cursor:default'">{{ time.values?.[idx]?.label?.[$i18n.locale.value] }}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'system-time2',
  data(){
    return {
      startId: null,
      maxSize: null,
      minSize: null,
      clearing: false,
      lastDate: 7,
      active: 0,
      selected: [],
      time: {
        values: [
          { name: '1', label: {ru:"Понедельник", en:"Monday"} },
          { name: '2', label: {ru:"Вторник",     en:"Tuesday"} },
          { name: '3', label: {ru:"Среда",       en:"Wednesday"} },
          { name: '4', label: {ru:"Четверг",     en:"Thursday"} },
          { name: '5', label: {ru:"Пятница",     en:"Friday"} },
          { name: '6', label: {ru:"Суббота",     en:"Saturday"} },
          { name: '7', label: {ru:"Воскресенье", en:"Sunday"} },
        ],
      },
      time2: [],
    }
  },
  props:{
    select: Boolean,
    editable: {
      type: Boolean,
      default: () => true,
    },
    model: {
      type: Array,
      default: () => [],
    }
  },
  watch: {
    select: {
      handler() {
        if(this.select){
          this.startId = 1
          for(let i=(this.startId-1);i<(this.lastDate);i++){
            this.time.values[i] && (this.time.values[i].active = true)
          }
          this.over(this.lastDate)
          this.up(this.lastDate)
        }else{
          this.startId = 1
          for(let i=(this.startId-1);i<(this.lastDate);i++){
            this.time.values[i] && (this.time.values[i].active = false)
          }
          this.over(this.lastDate)
          this.up(this.lastDate)
        }
      },
      deep: true
    },
    model: {
      handler() {
        this.checkActive()
      },
      deep: true
    },
  },
  methods:{
    checkActive(){
      this.time.values?.forEach((res,index)=>{
        this.time.values[index].active = false
      })
      this.time.values?.forEach((res,index)=>{
        this.model?.forEach((el)=>{
          if(el == res.name){
            this.time.values[index].active = true
            this.selected.push(res)
          }
        })
      })
    },
    down(idx){
      this.startId = (idx+1)
      if(this.startId && (this.time.values[this.startId-1].active == true)){
        this.clearing = true
      }
    },
    over(idx){
      if(this.startId && (!this.maxSize || (this.maxSize < idx))){
        this.maxSize = idx
      }
      if(this.startId && (!this.minSize || (this.minSize > idx))){
        this.minSize = idx
      }
      if(this.startId && !this.clearing){
        if(this.startId<=idx){
          for(let i=(this.startId-1);i<(this.maxSize+1);i++){
            this.time.values[i] && (this.time.values[i].active = false)
          }
          for(let i=(this.minSize);i<(this.startId);i++){
            this.time.values[i] && (this.time.values[i].active = false)
          }
          for(let i=(this.startId-1);i<(idx+1);i++){
            this.time.values[i] && (this.time.values[i].active = true)
          }
        }else{
          for(let i=(this.startId-1);i<(this.maxSize+1);i++){
            this.time.values[i] && (this.time.values[i].active = false)
          }
          for(let i=(this.minSize);i<(this.startId);i++){
            this.time.values[i] && (this.time.values[i].active = false)
          }
          for(let i=(idx);i<(this.startId);i++){
            this.time.values[i] && (this.time.values[i].active = true)
          }
        }
      }else if(this.startId && this.clearing){
        for(let i=(this.startId-1);i<(idx+1);i++){
          this.time.values[i] && (this.time.values[i].active = false)
        }
        
      }
    },
    up(idx){
      this.clearing = false
      if((this.startId-1) == idx){
        this.time.values[idx] && (this.time.values[idx].active = !this.time.values[idx].active)
      }
      let newArr = [...this.time.values]
      if(this.startId<=idx){
        this.selected.push(...newArr.slice((this.startId-1),(idx+1)))
      }else{
        this.selected.push(...newArr.slice((idx),(this.startId)))
      }
      let arrL = this.selected.length
      this.selected = this.selected?.filter((c, index) => {
        return this.selected.indexOf(c) === index;
      });
      if(arrL == this.selected.length){
        this.time?.values?.forEach((el)=>{
          this.selected?.forEach((el1)=>{
            if(el.name == el1.name){
              el.active = true
            }
          })
        })
      }
      this.selected = this.selected.filter((el) => el.active);
      let arr = []
      this.selected.forEach((k)=>{
        arr.push(Number(k.name))
      })
      this.$emit('time',arr)
      this.maxSize = null
      this.minSize = null
      this.startId = null
    }
  },
  mounted(){
    this.checkActive()
  }
}
</script>