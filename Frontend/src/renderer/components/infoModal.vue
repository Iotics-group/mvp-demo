<template>
    <div class="infomodal" :class="{active:activeSide}">
      <div class="infomodal-block">
        <div class="infomodal-wrapper">
          <div class="close" @click="close">
            <Icons size="custom" width="20" height="20" color="red" icon="closeFilled"/>
          </div>
          <div class="infoheads">
            <div class="infohead">
              <span>{{$locale['nameMeter'][$i18n.locale.value]}}</span>
              <p>{{info?.name}}</p>
            </div>
            <div class="infohead">
              <span>{{$locale['meterType'][$i18n.locale.value]}}</span>
              <p>{{info?.typeName}}</p>
            </div>
            <div class="infohead">
              <span>{{$locale['factoryNumber'][$i18n.locale.value]}}</span>
              <p>{{info?.number_meter}}</p>
            </div>
            <div class="infohead">
              <span>{{$locale['connectionAddress'][$i18n.locale.value]}}</span>
              <p>{{info?.connection_address}}</p>
            </div>
          </div>
          <div class="info-time">
            <p>{{$locale['electroParameter'][$i18n.locale.value]}}</p>
            <span>{{$locale['dataAcquisitionTime'][$i18n.locale.value]}}:</span>
            <p>{{dateFilter(info?.lastJoin?.current)}}</p>
          </div>
          <table class="table1">
            <thead>
              <tr>
                <th></th>
                <th>A</th>
                <th>B</th>
                <th>C</th>
                <th>AB</th>
                <th>BC</th>
                <th>AC</th>
                <th class="green">{{$locale['general'][$i18n.locale.value]}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{$locale['voltage'][$i18n.locale.value]}} (U)</td>
                <td>{{info?.lastJoin?.parameters?.current_voltage_A?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.current_voltage_B?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.current_voltage_C?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.current_voltage_line_A?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.current_voltage_line_B?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.current_voltage_line_C?.value?.toFixed(2) || '-'}}</td>
                <td class="green">-</td>
              </tr>
              <tr>
                <td>{{$locale['current'][$i18n.locale.value]}} (I)</td>
                <td>{{info?.lastJoin?.parameters?.current_current_A?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.current_current_B?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.current_current_C?.value?.toFixed(2) || '-'}}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td class="green">-</td>
              </tr>
              <tr>
                <td>{{$locale['activePower'][$i18n.locale.value]}} (P)</td>
                <td>{{info?.lastJoin?.parameters?.["current_active-power_A"]?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_active-power_B"]?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_active-power_C"]?.value?.toFixed(2) || '-'}}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td class="green">{{info?.lastJoin?.parameters?.["current_active-power_total"]?.value?.toFixed(2) || '-'}}</td>
              </tr>
              <tr>
                <td>{{$locale['reactivePower'][$i18n.locale.value]}} (Q)</td>
                <td>{{info?.lastJoin?.parameters?.["current_reactive-power_A"]?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_reactive-power_B"]?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_reactive-power_C"]?.value?.toFixed(2) || '-'}}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td class="green">{{info?.lastJoin?.parameters?.["current_reactive-power_total"]?.value?.toFixed(2) || '-'}}</td>
              </tr>
              <tr>
                <td>{{$locale['fullPower'][$i18n.locale.value]}} (S)</td>
                <td>{{info?.lastJoin?.parameters?.["current_full-power_A"]?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_full-power_B"]?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_full-power_C"]?.value?.toFixed(2) || '-'}}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td class="green">{{info?.lastJoin?.parameters?.["current_full-power_total"]?.value?.toFixed(2) || '-'}}</td>
              </tr>
              <tr>
                <td>{{$locale['coefActivePower'][$i18n.locale.value]}} (cos(f))</td>
                <td>{{info?.lastJoin?.parameters?.["current_coef-active-power_A"]?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_coef-active-power_B"]?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_coef-active-power_C"]?.value?.toFixed(2) || '-'}}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td class="green">{{info?.lastJoin?.parameters?.["current_coef-active-power_total"]?.value?.toFixed(2) || '-'}}</td>
              </tr>
              <tr>
                <td>{{$locale['coefReactivePower'][$i18n.locale.value]}} (sin(f))</td>
                <td>{{info?.lastJoin?.parameters?.["current_sinusf-reactive-power_A"]?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_sinusf-reactive-power_B"]?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_sinusf-reactive-power_C"]?.value?.toFixed(2) || '-'}}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td class="green">{{info?.lastJoin?.parameters?.["current_sinusf-reactive-power_total"]?.value?.toFixed(2) || '-'}}</td>
              </tr>
              <tr>
                <td>{{$locale['coefFullPower'][$i18n.locale.value]}} (tg(f))</td>
                <td>{{info?.lastJoin?.parameters?.["current_coef-reactive-power_A"]?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_coef-reactive-power_B"]?.value?.toFixed(2) || '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_coef-reactive-power_C"]?.value?.toFixed(2) || '-'}}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td class="green">{{info?.lastJoin?.parameters?.["current_coef-reactive-power_total"]?.value?.toFixed(2) || '-'}}</td>
              </tr>
              <tr>
                <td>{{$locale['frequency'][$i18n.locale.value]}} (F)</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td class="green">{{info?.lastJoin?.parameters?.["current_frequency"]?.value?.toFixed(2) || '-'}}</td>
              </tr>
              <tr>
                <td>{{$locale['angleCoefActivePower'][$i18n.locale.value]}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_angle_UI_A"]?.value ? (Number(info?.lastJoin?.parameters?.["current_angle_UI_A"]?.value).toFixed(2)) : '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_angle_UI_B"]?.value ? (Number(info?.lastJoin?.parameters?.["current_angle_UI_B"]?.value).toFixed(2)) : '-'}}</td>
                <td>{{info?.lastJoin?.parameters?.["current_angle_UI_C"]?.value ? (Number(info?.lastJoin?.parameters?.["current_angle_UI_C"]?.value).toFixed(2)) : '-'}}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td class="green">-</td>
              </tr>
              <tr>
                <td>{{$locale['angleCorUU'][$i18n.locale.value]}}</td>
                <td>{{ info?.lastJoin?.parameters ? 0 : '-' }}</td>
                <td>{{ info?.lastJoin?.parameters && (info?.lastJoin?.parameters['current_angle_phase_AB']?.value?.toFixed(1) || 120) || '-' }}</td>
                <td>{{ info?.lastJoin?.parameters && (Number(info?.lastJoin?.parameters['current_angle_phase_AB']?.value || 120)+Number(info?.lastJoin?.parameters['current_angle_phase_BC']?.value || 120))?.toFixed(1) || '-' }}</td>
                <td>{{ info?.lastJoin?.parameters ? (info?.lastJoin?.parameters['current_angle_phase_AB']?.value?.toFixed(1) || 120) : '-' }}</td>
                <td>{{ info?.lastJoin?.parameters && (info?.lastJoin?.parameters['current_angle_phase_BC']?.value?.toFixed(1) || 120) || '-' }}</td>
                <td>{{ info?.lastJoin?.parameters && (info?.lastJoin?.parameters['current_angle_phase_CA']?.value?.toFixed(1) || 120) || '-' }}</td>
                <td class="green">-</td>
              </tr>
            </tbody>
          </table>
          <div class="info-indications">
            <div class="info-time">
              <p>{{$locale['indication'][$i18n.locale.value]}}</p>
              <span>{{$locale['dataAcquisitionTime'][$i18n.locale.value]}}:</span>
              <p>{{dateFilter(info?.lastJoin?.current)}}</p>
            </div>
            <table class="table2">
              <thead>
                <tr>
                  <th></th>
                  <th>{{$locale['tarif'][$i18n.locale.value]}} №1</th>
                  <th>{{$locale['tarif'][$i18n.locale.value]}} №2</th>
                  <th>{{$locale['tarif'][$i18n.locale.value]}} №3</th>
                  <th>{{$locale['tarif'][$i18n.locale.value]}} №4</th>
                  <th class="green">{{$locale['general'][$i18n.locale.value]}}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{$locale['activeEnergy'][$i18n.locale.value]}} (A+)</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_A+_tarif1']?.value?.toFixed(2) || '-'}}</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_A+_tarif2']?.value?.toFixed(2) || '-'}}</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_A+_tarif3']?.value?.toFixed(2) || '-'}}</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_A+_tarif4']?.value?.toFixed(2) || '-'}}</td>
                  <td class="green">{{info?.lastJoin?.parameters?.['current_energytotal_A+']?.value?.toFixed(2) || '-'}}</td>
                </tr>
                <tr>
                  <td>{{$locale['activeEnergy'][$i18n.locale.value]}} (A-)</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_A-_tarif1']?.value?.toFixed(2) || '-'}}</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_A-_tarif2']?.value?.toFixed(2) || '-'}}</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_A-_tarif3']?.value?.toFixed(2) || '-'}}</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_A-_tarif4']?.value?.toFixed(2) || '-'}}</td>
                  <td class="green">{{info?.lastJoin?.parameters?.['current_energytotal_A-']?.value?.toFixed(2) || '-'}}</td>
                </tr>
                <tr>
                  <td>{{$locale['reactiveEnergy'][$i18n.locale.value]}} (R+)</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_R+_tarif1']?.value?.toFixed(2) || '-'}}</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_R+_tarif2']?.value?.toFixed(2) || '-'}}</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_R+_tarif3']?.value?.toFixed(2) || '-'}}</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_R+_tarif4']?.value?.toFixed(2) || '-'}}</td>
                  <td class="green">{{info?.lastJoin?.parameters?.['current_energytotal_R+']?.value?.toFixed(2) || '-'}}</td>
                </tr>
                <tr>
                  <td>{{$locale['reactiveEnergy'][$i18n.locale.value]}} (R-)</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_R-_tarif1']?.value?.toFixed(2) || '-'}}</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_R-_tarif2']?.value?.toFixed(2) || '-'}}</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_R-_tarif3']?.value?.toFixed(2) || '-'}}</td>
                  <td>{{info?.lastJoin?.parameters?.['current_energytotal_R-_tarif4']?.value?.toFixed(2) || '-'}}</td>
                  <td class="green">{{info?.lastJoin?.parameters?.['current_energytotal_R-']?.value?.toFixed(2) || '-'}}</td>
                </tr>
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
// import { mapState } from 'pinia'
// import { useStore } from '@/store'
export default {
  data(){
    return{
      activeSide: false,
      interval: null,
      info: null,
    }
  },
  components: {
  },
  props: {
    data: String
  },
  methods:{
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
    close(){
      clearInterval(this.interval)
      this.$emit('close')
    },
    activeSidebar(){
      this.activeSide = !this.activeSide
    },
    async mountFunc(){
      await this.$axios('/mnemo-schema/single/'+this.data).then((res)=>{
        this.info = res?.data?.data
      }) 
      .catch(()=>{
        const t = this
        clearTimeout(this.interval)
        t.interval = setInterval(() => {
          t.mountFunc()
        }, 4000);
      })
    }
  },
  async mounted(){
      const t = this
      t.mountFunc()
      clearInterval(this.interval)
      t.interval = setInterval(() => {
        t.mountFunc()
      }, 4000);
  }
}
</script>