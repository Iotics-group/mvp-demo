<template>
  <div class="chart-diagram">
    <svg width="100%" height="100%" viewBox="0 0 410 410" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="205" cy="205" rx="180" ry="180" fill="white"/>
      <ellipse cx="205" cy="205" rx="150" ry="150" fill="none" stroke="#C7CACE" stroke-width="0.5"/>
      <ellipse cx="205" cy="205" rx="120" ry="120" fill="none" stroke="#C7CACE" stroke-width="0.5"/>
      <ellipse cx="205" cy="205" rx="90" ry="90" fill="none" stroke="#C7CACE" stroke-width="0.5"/>
      <ellipse cx="205" cy="205" rx="60" ry="60" fill="none" stroke="#C7CACE" stroke-width="0.5"/>
      <ellipse cx="205" cy="205" rx="30" ry="30" fill="none" stroke="#C7CACE" stroke-width="0.5"/>
      <g>
        <line x1="205" y1="25" x2="205" y2="385" stroke="#C7CACE" stroke-width="0.5"/>
        <line x1="77.72" y1="77.72" x2="332.28" y2="332.28" stroke="#C7CACE" stroke-width="0.5"/>
        <line x1="25" y1="205" x2="385" y2="205" stroke="#C7CACE" stroke-width="0.5"/>
        <line x1="332.28" y1="77.72" x2="77.72" y2="332.28" stroke="#C7CACE" stroke-width="0.5"/>
      </g>
      <line v-if="checker(activeDateData)" x1="205" y1="205" :x2="pToCVoltage(205,0).x" :y2="pToCVoltage(205,0).y" stroke="#FFD600" stroke-width="2" marker-end="url(#yellow-triangle)"/>
      <line v-if="checker(activeDateData)" x1="205" y1="205" :x2="pToCCurrent(205,(angleOfCurrent('A') == null ? 0 : angleOfCurrent('A'))).x" :y2="pToCCurrent(205,(angleOfCurrent('A') == null ? 0 : angleOfCurrent('A'))).y" stroke="#FFD600" stroke-width="2" stroke-dasharray="4, 2" marker-end="url(#yellow-triangle)"/>

      <line v-if="checker(activeDateData)" x1="205" y1="205" :x2="pToCVoltage(205,((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))).x" :y2="pToCVoltage(205,((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))).y" stroke="#00DA30" stroke-width="2" marker-end="url(#green-triangle)"/>
      <line v-if="checker(activeDateData)" x1="205" y1="205" :x2="pToCCurrent(205,(((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+(angleOfCurrent('B') == null ? 0 : angleOfCurrent('B')))).x" :y2="pToCCurrent(205,(((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+(angleOfCurrent('B') == null ? 0 : angleOfCurrent('B')))).y" stroke="#00DA30" stroke-width="2" stroke-dasharray="4, 2" marker-end="url(#green-triangle)"/>

      <line v-if="checker(activeDateData)" x1="205" y1="205" :x2="pToCVoltage(205,(((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+((activeDateData?.current_angle_phase_BC == undefined) ? 120 : (activeDateData?.current_angle_phase_BC?.value)))).x" :y2="pToCVoltage(205,(((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+((activeDateData?.current_angle_phase_BC == undefined) ? 120 : (activeDateData?.current_angle_phase_BC?.value)))).y" stroke="#EF1254" stroke-width="2" marker-end="url(#red-triangle)"/>
      <line v-if="checker(activeDateData)" x1="205" y1="205" :x2="pToCCurrent(205,((((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+((activeDateData?.current_angle_phase_BC == undefined) ? 120 : (activeDateData?.current_angle_phase_BC?.value)))+(angleOfCurrent('C') == null ? 0 : angleOfCurrent('C')))).x" :y2="pToCCurrent(205,((((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+((activeDateData?.current_angle_phase_BC == undefined) ? 120 : (activeDateData?.current_angle_phase_BC?.value)))+(angleOfCurrent('C') == null ? 0 : angleOfCurrent('C')))).y" stroke="#EF1254" stroke-width="2" stroke-dasharray="4, 2" marker-end="url(#red-triangle)"/>

      <text x="202" y="20" font-size="13" fill="#FFFFFF">
        0
      </text>
      <text x="334" y="74" font-size="13" fill="#FFFFFF">
        45
      </text>
      <text x="390" y="210" font-size="13" fill="#FFFFFF">
        90
      </text>
      <text x="338" y="344" font-size="13" fill="#FFFFFF">
        135
      </text>
      <text x="195" y="405" font-size="13" fill="#FFFFFF">
        180
      </text>
      <text x="50" y="344" font-size="13" fill="#FFFFFF">
        225
      </text>
      <text x="0" y="210" font-size="13" fill="#FFFFFF">
        270
      </text>
      <text x="54" y="74" font-size="13" fill="#FFFFFF">
        315
      </text>

      <g v-if="checker(activeDateData)">
        <rect :x="pToCVoltageBadge(205,0).x" :y="pToCVoltageBadge(205,0).y" transform="translate(-12 -12)" width="24" height="24" rx="12" fill="white" style="filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));"/>
        <text :x="pToCVoltageBadge(205,(0)).x" :y="pToCVoltageBadge(205,(0)).y" transform="translate(-10 5)" font-size="15" font-weight="700" style="font-weight:700" fill="#022134">
            U<tspan>a</tspan>
        </text>
        <title>Ua</title>
      </g>
      <g v-if="checker(activeDateData)">
        <rect :x="pToCCurrentBadge(205,(angleOfCurrent('A') == null ? 0 : angleOfCurrent('A'))).x" :y="pToCCurrentBadge(205,(angleOfCurrent('A') == null ? 0 : angleOfCurrent('A'))).y" transform="translate(-12 -12)" width="24" height="24" rx="12" fill="white" style="filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));"/>
        <text :x="pToCCurrentBadge(205,(angleOfCurrent('A') == null ? 0 : angleOfCurrent('A'))).x" :y="pToCCurrentBadge(205,(angleOfCurrent('A') == null ? 0 : angleOfCurrent('A'))).y" transform="translate(-6 5)" font-size="15" font-weight="700" style="font-weight:700" fill="#022134">
            I<tspan>a</tspan>
        </text>
        <title>Ia</title>
      </g>
      <g v-if="checker(activeDateData)">
        <rect :x="pToCVoltageBadge(205,((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))).x" :y="pToCVoltageBadge(205,((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))).y" transform="translate(-12 -12)" width="24" height="24" rx="12" fill="white" style="filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));"/>
        <text :x="pToCVoltageBadge(205,((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))).x" :y="pToCVoltageBadge(205,((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))).y" transform="translate(-9 5)" font-size="15" font-weight="700" style="font-weight:700" fill="#022134">
            U<tspan>b</tspan>
        </text>
        <title>Ub</title>
      </g>
      <g v-if="checker(activeDateData)">
      <rect :x="pToCCurrentBadge(205,(((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value)) + (angleOfCurrent('B') == null ? 0 : angleOfCurrent('B')))).x" :y="pToCCurrentBadge(205,(((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+(angleOfCurrent('B') == null ? 0 : angleOfCurrent('B')))).y" transform="translate(-12 -12)" width="24" height="24" rx="12" fill="white" style="filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));"/>
        <text :x="pToCCurrentBadge(205,(((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+(angleOfCurrent('B') == null ? 0 : angleOfCurrent('B')))).x" :y="pToCCurrentBadge(205,(((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+(angleOfCurrent('B') == null ? 0 : angleOfCurrent('B')))).y" transform="translate(-5 5)" font-size="15" font-weight="700" style="font-weight:700" fill="#022134">
            I<tspan>b</tspan>
        </text>
        <title>Ib</title>
      </g>
      <g v-if="checker(activeDateData)">
        <rect :x="pToCVoltageBadge(205,(((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+((activeDateData?.current_angle_phase_BC == undefined) ? 120 : (activeDateData?.current_angle_phase_BC?.value)))).x" :y="pToCVoltageBadge(205,(((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+((activeDateData?.current_angle_phase_BC == undefined) ? 120 : (activeDateData?.current_angle_phase_BC?.value)))).y" transform="translate(-12 -12)" width="24" height="24" rx="12" fill="white" style="filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));"/>
        <text :x="pToCVoltageBadge(205,(((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+((activeDateData?.current_angle_phase_BC == undefined) ? 120 : (activeDateData?.current_angle_phase_BC?.value)))).x" :y="pToCVoltageBadge(205,(((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+((activeDateData?.current_angle_phase_BC == undefined) ? 120 : (activeDateData?.current_angle_phase_BC?.value)))).y" transform="translate(-9 5)" font-size="15" font-weight="700" style="font-weight:700" fill="#022134">
            U<tspan>c</tspan>
        </text>
        <title>Uc</title>
      </g>
      <g v-if="checker(activeDateData)">
        <rect :x="pToCCurrentBadge(205,((((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+((activeDateData?.current_angle_phase_BC == undefined) ? 120 : (activeDateData?.current_angle_phase_BC?.value)))+(angleOfCurrent('C') == null ? 0 : angleOfCurrent('C')))).x" :y="pToCCurrentBadge(205,((((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+((activeDateData?.current_angle_phase_BC == undefined) ? 120 : (activeDateData?.current_angle_phase_BC?.value)))+(angleOfCurrent('C') == null ? 0 : angleOfCurrent('C')))).y" transform="translate(-12 -12)" width="24" height="24" rx="12" fill="white" style="filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));"/>
        <text :x="pToCCurrentBadge(205,((((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+((activeDateData?.current_angle_phase_BC == undefined) ? 120 : (activeDateData?.current_angle_phase_BC?.value)))+(angleOfCurrent('C') == null ? 0 : angleOfCurrent('C')))).x" :y="pToCCurrentBadge(205,((((activeDateData?.current_angle_phase_AB == undefined) ? 120 : (activeDateData?.current_angle_phase_AB?.value))+((activeDateData?.current_angle_phase_BC == undefined) ? 120 : (activeDateData?.current_angle_phase_BC?.value)))+(angleOfCurrent('C') == null ? 0 : angleOfCurrent('C')))).y" transform="translate(-5 5)" font-size="15" font-weight="700" style="font-weight:700 !important" fill="#022134">
            I<tspan>c</tspan>
        </text>
        <title>Ic</title>
      </g>

      <defs>
        <marker
          id="green-triangle"
          viewBox="0 0 20 20"
          refX="10"
          refY="10"
          markerUnits="strokeWidth"
          markerWidth="10"
          markerHeight="10"
          orient="auto">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.1894 10L6.89648 14.2929C6.50596 14.6834 6.50596 15.3166 6.89648 15.7071C7.28701 16.0976 7.92017 16.0976 8.3107 15.7071L12.9571 11.0607C13.5429 10.4749 13.5429 9.52513 12.9571 8.93934L8.3107 4.29289C7.92017 3.90237 7.28701 3.90237 6.89648 4.29289C6.50596 4.68342 6.50596 5.31658 6.89648 5.70711L11.1894 10 z"
            fill="#00DA30"
          />
        </marker>

        <marker
          id="red-triangle"
          viewBox="0 0 20 20"
          refX="10"
          refY="10"
          markerUnits="strokeWidth"
          markerWidth="10"
          markerHeight="10"
          orient="auto">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.1894 10L6.89648 14.2929C6.50596 14.6834 6.50596 15.3166 6.89648 15.7071C7.28701 16.0976 7.92017 16.0976 8.3107 15.7071L12.9571 11.0607C13.5429 10.4749 13.5429 9.52513 12.9571 8.93934L8.3107 4.29289C7.92017 3.90237 7.28701 3.90237 6.89648 4.29289C6.50596 4.68342 6.50596 5.31658 6.89648 5.70711L11.1894 10 z"
            fill="#EF1254"
          />
        </marker>

        <marker
          id="yellow-triangle"
          viewBox="0 0 20 20"
          refX="10"
          refY="10"
          markerUnits="strokeWidth"
          markerWidth="10"
          markerHeight="10"
          orient="auto">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.1894 10L6.89648 14.2929C6.50596 14.6834 6.50596 15.3166 6.89648 15.7071C7.28701 16.0976 7.92017 16.0976 8.3107 15.7071L12.9571 11.0607C13.5429 10.4749 13.5429 9.52513 12.9571 8.93934L8.3107 4.29289C7.92017 3.90237 7.28701 3.90237 6.89648 4.29289C6.50596 4.68342 6.50596 5.31658 6.89648 5.70711L11.1894 10 z"
            fill="#FFD600"
          />
        </marker>
      </defs>
    </svg>

  </div>
</template>

<script>
export default {
  data() {
    return {
      chosenDate: '',
      chosenDateData: {},
      dataToDraw: {}
    }
  },

  props: {
    activeDateData: {
      type: Object,
      default: null,
    },
    allData: {
      type: Object,
      default: null
    }
  },

  methods: {
    checker(e){
      if(e){
        return Object.keys(e)?.length
      }else{
        return false
      }
    },
    pToCCurrent(radius, angleInDegrees) {
      var radians = (angleInDegrees - 90) * Math.PI / 180;
      return {
        x: (radius + ((radius - 88) * Math.cos(radians))),
        y: (radius + ((radius - 88) * Math.sin(radians)))
      }
    },

    pToCVoltage(radius, angleInDegrees) {
      var radians = (angleInDegrees - 90) * Math.PI / 180;
      return {
        x: (radius + ((radius - 32) * Math.cos(radians))),
        y: (radius + ((radius - 32) * Math.sin(radians)))
      }
    },

    pToCCurrentBadge(radius, angleInDegrees) {
      var radians = (angleInDegrees - 90) * Math.PI / 180;
      return {
        x: (radius + ((radius - 112) * Math.cos(radians))),
        y: (radius + ((radius - 112) * Math.sin(radians)))
      }
    },

    pToCVoltageBadge(radius, angleInDegrees) {
      var radians = (angleInDegrees - 90) * Math.PI / 180;
      return {
        x: (radius + ((radius - 56) * Math.cos(radians))),
        y: (radius + ((radius - 56) * Math.sin(radians)))
      }
    },

    voltagePluggedChecker(phase) {
      if(this.chosenDateData != null && this.chosenDateData['current_voltage_'+phase] != null && this.chosenDateData['current_voltage_'+phase] != undefined && this.chosenDateData['current_coef-active-power_'+phase] != null && this.chosenDateData['current_coef-active-power_'+phase] != undefined) {
        return this.chosenDateData['current_coef-active-power_'+phase].value
      }
      else {
        return 0
      } 
    },

    signOfP(phase) {
      if(this.chosenDateData != null && this.chosenDateData['current_voltage_'+phase] != null && this.chosenDateData['current_voltage_'+phase] != undefined && this.chosenDateData['current_current_'+phase] != null && this.chosenDateData['current_current_'+phase] != undefined && this.chosenDateData['current_coef-active-power_'+phase] != null && this.chosenDateData['current_coef-active-power_'+phase] != undefined) {
        return Math.sign(this.chosenDateData['current_voltage_'+phase].value * this.chosenDateData['current_current_'+phase].value * this.chosenDateData['current_coef-active-power_'+phase].value)
      }
    },

    signOfQ(phase) {
      if(this.chosenDateData['current_voltage_'+phase] != null && this.chosenDateData['current_voltage_'+phase] != undefined && this.chosenDateData['current_coef-active-power_'+phase] != null && this.chosenDateData['current_coef-active-power_'+phase] != undefined && this.chosenDateData['current_current_'+phase] != null && this.chosenDateData['current_current_'+phase] != undefined) {
        return Math.sign(this.chosenDateData['current_voltage_'+phase].value * this.chosenDateData['current_current_'+phase].value * Math.sqrt(1 - (this.chosenDateData['current_coef-active-power_'+phase].value * this.chosenDateData['current_coef-active-power_'+phase].value)))
      }
    },

    phaseDegree(phase) {
      if(phase == 'A') {
        return 0
      }
      else if(phase == 'B') {
        return 120
      }
      else return 240
    },

    angleOfCurrent(phase) {
      let cat = 0;
      let angle;
      if(this.chosenDateData['current_angle_UI_'+phase]?.value != undefined){
        this.$emit('gradus',{phase:phase,gradus:(this.chosenDateData['current_angle_UI_'+phase]?.value?.toFixed(2)?.toString())})
        return Number(this.chosenDateData['current_angle_UI_'+phase]?.value?.toFixed(2))
      }else{
        if(this.chosenDateData != null && this.chosenDateData['current_coef-active-power_'+phase] != undefined && this.chosenDateData['current_coef-active-power_'+phase] != null) {
          cat = this.chosenDateData['current_coef-active-power_'+phase].value
          if(this.signOfP(phase) > 0 && this.signOfQ(phase) > 0) {
            angle = (Math.acos(cat)* 180 / Math.PI)
          }
          else if(this.signOfP(phase) < 0 && this.signOfQ(phase) > 0) {
            angle = (Math.acos(cat)* 180 / Math.PI)
          }
          else if(this.signOfP(phase) < 0 && this.signOfQ(phase) < 0) {
            angle = Math.abs(360 - (Math.acos(cat)* 180 / Math.PI))
          }
          else if(this.signOfP(phase) > 0 && this.signOfQ(phase) < 0) {
            angle = Math.abs(360 - (Math.acos(cat)* 180 / Math.PI))
          }
          if((this.chosenDateData != null)&&(angle)) {
            this.$emit('gradus',{phase:phase,gradus:(angle?.toFixed(2)?.toString())})
            return Number(angle.toFixed(2))
          }
          else {
            return null
          }
        }
        else {
          return null
        }
      }
    },

    getDate(date) {
      if(date){
        return Object.keys(this.dataToDraw).filter(key => this.dataToDraw[key] === date);
      }
    },

    chooseDate(date) {
      if(date){
        this.chosenDate = this.getDate(date)[0]
        this.chosenDateData = this.dataToDraw[this.chosenDate]
        this.angleOfCurrent('C')
      }else{
        this.chosenDate= ''
        this.chosenDateData = {}
      }
    }
  },

  mounted() {
    if(this.allData){
      this.dataToDraw = this.allData
      this.chosenDate = Object.keys(this.dataToDraw)[0]
      this.chosenDateData = this.dataToDraw[Object.keys(this.dataToDraw)[0]]
    }
  },

  watch: {
    activeDateData() {
      this.chooseDate(this.activeDateData)
    },

    allData() {
      this.dataToDraw = this.allData
    }
  }
};
</script>