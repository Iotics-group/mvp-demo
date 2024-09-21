<template>
  <div class="calendarWrapper">
    <div class="datePickerTop">
      <button v-if="chooseYear" class="prev_date prev_one_date" @click="goprevYear">
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2819 1.9984C13.6731 1.62466 13.6731 0.99999 13.2819 0.626252C12.9151 0.275873 12.3377 0.275874 11.971 0.626253L7 5.37544L2.02904 0.626252C1.6623 0.275873 1.08485 0.275873 0.718109 0.626252C0.32692 0.999989 0.32692 1.62466 0.718109 1.9984L7 8.00003L13.2819 1.9984Z" fill="white"/>
        </svg>
      </button>
      <p @click="(chooseYear = true), (chooseMonth = false)" class="chosenYear">
        {{ today.getFullYear() }}
      </p>
      <p v-if="!chooseYear" class="chosenMonth" @click="chooseMonth = true">
        {{ months[today.getMonth()].label?.[$i18n.locale.value] }}
      </p>
      <button v-if="!chooseYear" class="prev_one_date" @click="goprevMonth">
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2819 1.9984C13.6731 1.62466 13.6731 0.99999 13.2819 0.626252C12.9151 0.275873 12.3377 0.275874 11.971 0.626253L7 5.37544L2.02904 0.626252C1.6623 0.275873 1.08485 0.275873 0.718109 0.626252C0.32692 0.999989 0.32692 1.62466 0.718109 1.9984L7 8.00003L13.2819 1.9984Z" fill="white"/>
        </svg>
      </button>
      <button v-if="!chooseYear" class="next_one_date" @click="gonextMonth">
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2819 1.9984C13.6731 1.62466 13.6731 0.99999 13.2819 0.626252C12.9151 0.275873 12.3377 0.275874 11.971 0.626253L7 5.37544L2.02904 0.626252C1.6623 0.275873 1.08485 0.275873 0.718109 0.626252C0.32692 0.999989 0.32692 1.62466 0.718109 1.9984L7 8.00003L13.2819 1.9984Z" fill="white"/>
        </svg>
      </button>
      <button v-if="chooseYear" class="next_date next_one_date" @click="gonextYear">
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2819 1.9984C13.6731 1.62466 13.6731 0.99999 13.2819 0.626252C12.9151 0.275873 12.3377 0.275874 11.971 0.626253L7 5.37544L2.02904 0.626252C1.6623 0.275873 1.08485 0.275873 0.718109 0.626252C0.32692 0.999989 0.32692 1.62466 0.718109 1.9984L7 8.00003L13.2819 1.9984Z" fill="white"/>
        </svg>
      </button>
    </div>
    <hr />
    <div v-if="!chooseYear && !chooseMonth">
      <table class="weekDaysRow mt-6">
        <th>{{week.monday[$i18n.locale.value]}}</th>
        <th>{{week.tuesday[$i18n.locale.value]}}</th>
        <th>{{week.wednesday[$i18n.locale.value]}}</th>
        <th>{{week.thursday[$i18n.locale.value]}}</th>
        <th>{{week.friday[$i18n.locale.value]}}</th>
        <th>{{week.saturday[$i18n.locale.value]}}</th>
        <th class="weekend">{{week.sunday[$i18n.locale.value]}}</th>
      </table>

      <table class="monthDays">
        <tr :class="activeDayChecker(day) ? 'activeDay' : '' || currentDayChecker(day) ? 'currentDay' : '' || currentMonthChecker(day) ? '' : 'notCurrentMonth'"
          v-for="(day, idx) in currentMonthBlock" :key="idx" @click="changeDate(day)">
          {{
            day.getDate()
          }}
        </tr>
      </table>
    </div>
    <div v-else-if="chooseMonth" class="monthYears">
      <table>
        <tr :class="activeMonthChecker(idx) ? 'activeMonth' : ''" v-for="(month, idx) in months" :key="idx" @click="changeMonthValue(idx)">
          {{
            month?.shortLabel?.[$i18n.locale.value]
          }}
        </tr>
      </table>
    </div>
    <div v-else class="monthYears">
      <table>
        <tr :class="activeYearChecker(year) ? 'activeYear' : ''" v-for="(year, idx) in years" :key="idx" @click="changeYearValue(year)">
          {{
            year
          }}
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "datePickerComponent",

  data() {
    return {
      newMonth: 0,
      newDate: 0,
      newYear: 0,
      chooseYear: false,
      chooseMonth: false,
      changeYearList: 0,
      years: [],
      previousMonth: [],
      currentMonth: [],
      nextMonth: [],
      prevMonthBlock: [],
      currentMonthBlock: [],
      nextMonthBlock: [],
      curDay: "",
      week: {
        monday: {
          uz: "Du",
          ru: "Пн",
          en: "Mon",
        },
        tuesday: {
          uz: "Se",
          ru: "Вт",
          en: "Tue",
        },
        wednesday: {
          uz: "Chor",
          ru: "Ср",
          en: "Wed",
        },
        thursday: {
          uz: "Pay",
          ru: "Чт",
          en: "Th",
        },
        friday: {
          uz: "Ju",
          ru: "Пт",
          en: "Fri",
        },
        saturday: {
          uz: "Sha",
          ru: "Сб",
          en: "Sat",
        },
        sunday: {
          uz: "Yak",
          ru: "Bс",
          en: "Sun",
        },
      },
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

  computed: {
    today() {
      let currDate = new Date(this.newYear, this.newMonth, this.newDate);
      return currDate;
    },
  },
  props:{
    changedDate: {
      type: String,
      default: () => null,
    },
  },
  methods: {
    currentDaySetter() {
      this.curDay = this.today;
    },
    getYears() {
      let date = new Date();
      let currDate = new Date(
        date.getFullYear() - this.changeYearList,
        date.getMonth(),
        date.getDate()
      );
      for (
        let i = currDate.getFullYear();
        i < currDate.getFullYear() + 9;
        i++
      ) {
        this.years.push(i);
      }
    },
    changeDate(e) {
      this.newDate = e.getDate();
      this.newMonth = e.getMonth();
      this.newYear = e.getFullYear();
      this.currentDaySetter();

      const result = this.today.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      let date = {
        format: result,
        unformat: new Date(this.newYear,this.newMonth,(this.newDate)),
      }
      this.$emit("date", date);
    },
    changeYearValue(e) {
      this.chooseMonth = !this.chooseMonth;
      this.newYear = e;
      this.getPreviousMonth();
      this.getCurrentMonth();
      this.getNextMonth();
      this.createMonthBlock();
      this.currentDaySetter();
    },
    changeMonthValue(e) {
      this.chooseMonth = false;
      this.chooseYear = false;
      this.newMonth = e;
      this.getPreviousMonth();
      this.getCurrentMonth();
      this.getNextMonth();
      this.createMonthBlock();
      this.currentDaySetter();
    },
    currentDayChecker(day) {
      const date = new Date();
      if (
        day.getDate() === date.getDate() &&
        day.getMonth() === date.getMonth() &&
        day.getFullYear() === date.getFullYear()
      ) {
        return true;
      } else return false;
    },
    activeDayChecker(day) {
      if(this.changedDate){
        let changedDate = new Date(this.changedDate)
          if (
            day.getDate() === changedDate.getDate() &&
            day.getMonth() === changedDate.getMonth() &&
            day.getFullYear() === changedDate.getFullYear()
            ) {
          return true;
        } else return false;
      }else{
          if (
            day.getDate() === this.curDay.getDate() &&
            day.getMonth() === this.curDay.getMonth() &&
            day.getFullYear() === this.curDay.getFullYear()
            ) {
          return true;
        } else return false;
      }
    },
    activeMonthChecker(day) {
      if(this.changedDate){
        let changedDate = new Date(this.changedDate)
        if (day === changedDate.getMonth()) {
          return true;
        } else return false;
      }else{
          if (day === this.curDay.getMonth()) {
          return true;
        } else return false;
      }
    },
    activeYearChecker(year) {
      if(this.changedDate){
        let changedDate = new Date(this.changedDate)
          if (
            year === changedDate.getFullYear()
            ) {
          return true;
        } else return false;
      }else{
          if (
            year === this.curDay.getFullYear()
            ) {
          return true;
        } else return false;
      }
    },

    currentMonthChecker(day) {
      if (day.getMonth() === this.today.getMonth()) {
        return true;
      } else return false;
    },

    getPreviousMonth() {
      let year = null;
      let month = null;
      if(this.today.getMonth() != 0){
        year = this.today.getFullYear();
        month = this.today.getMonth() - 1;
      }else{
        year = this.today.getFullYear() - 1;
        month = 11;
      }
      this.previousMonth = [];
      const date = new Date(year, month, 1);

      while (date.getMonth() === month) {
        this.previousMonth.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
    },

    getCurrentMonth() {
      let year = this.today.getFullYear();
      let month = this.today.getMonth();

      this.currentMonth = [];

      const date = new Date(year, month, 1);

      while (date.getMonth() === month) {
        this.currentMonth.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
    },
    getCurrDatehNum() {
      let newDate = new Date();
      if(this.changedDate){
        newDate = new Date(this.changedDate);
      }
      this.newMonth = newDate.getMonth();
      this.newYear = newDate.getFullYear();
      this.newDate = newDate.getDate();
    },

    getNextMonth() {
      let year = null;
      let month = null;
      if(this.today.getMonth() != 11){
        year = this.today.getFullYear();
        month = this.today.getMonth() + 1;
      }else{
        year = this.today.getFullYear()+1;
        month = 0;
      }
      this.nextMonth = [];
      const date = new Date(year, month, 1);
      while (date.getMonth() === month) {
        this.nextMonth.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
    },

    createMonthBlock() {
      const weekDay = this.currentMonth[0]?.getDay();
      if ((weekDay > 1 && weekDay <= 6)||((weekDay == 0))) {
        if(weekDay == 0){
          this.currentMonthBlock = this.previousMonth.slice(-6);
        }else{
          this.currentMonthBlock = this.previousMonth.slice(-(weekDay - 1));
        }
        this.currentMonthBlock = this.currentMonthBlock.concat( this.currentMonth );
        if(weekDay != 0){
          for (let i = 0; i < (42 - (weekDay - 1 + this.currentMonth.length)); i++) {
            if (this.nextMonth.length)
              this.currentMonthBlock.push(this.nextMonth[i]);
          }
        }else{
          for (let i = 0; i < (42 - (this.currentMonth.length + 6)); i++) {
            if (this.nextMonth.length)
              this.currentMonthBlock.push(this.nextMonth[i]);
          }
        }
      } else if (weekDay === 1) {
        this.currentMonthBlock = this.previousMonth.slice(-7);
        this.currentMonthBlock = this.currentMonthBlock.concat(
          this.currentMonth
        );

        for (let i = 0; i < 42 - (this.currentMonth.length + 7); i++) {
          if (this.nextMonth.length)
            this.currentMonthBlock.push(this.nextMonth[i]);
        }
      }
    },
    goprevMonth() {
      this.newMonth--;
      if (this.newMonth < 0) (this.newMonth = 11), this.newYear--;
      let today = (new Date(this.newYear,this.curDay.getMonth(),0)).getDate()
      if(this.newDate != this.today.getDate()){
        this.newDate = today
      }
      this.getPreviousMonth();
      this.getCurrentMonth();
      this.getNextMonth();
      this.createMonthBlock();
    },
    goprevYear() {
      if (!this.chooseYear || this.chooseMonth) {
        this.newYear--;
        this.getPreviousMonth();
        this.getCurrentMonth();
        this.getNextMonth();
        this.createMonthBlock();
        this.currentDaySetter();
      } else {
        this.changeYearList = this.changeYearList + 9;
        this.years = [];
        this.getYears();
      }
    },
    gonextMonth() {
      this.newMonth++;
      if (this.newMonth > 11) (this.newMonth = 0), this.newYear++;
      this.getPreviousMonth();
      this.getCurrentMonth();
      this.getNextMonth();
      this.createMonthBlock();
      let today = (new Date(this.newYear,this.curDay.getMonth(),0)).getDate()
      if(this.newDate != this.today.getDate()){
        this.newDate = today
      }
    },
    gonextYear() {
      if (!this.chooseYear || this.chooseMonth) {
        this.newYear++;
        this.getPreviousMonth();
        this.getCurrentMonth();
        this.getNextMonth();
        this.createMonthBlock();
        this.currentDaySetter();
      } else {
        this.changeYearList = this.changeYearList - 9;
        this.years = [];
        this.getYears();
      }
    },
  },

  mounted() {
    this.getCurrDatehNum();
    this.getPreviousMonth();
    this.getCurrentMonth();
    this.getNextMonth();
    this.createMonthBlock();
    this.currentDaySetter();
    this.getYears();
  },
};
</script>
<style scoped>
.calendarWrapper {
  flex-direction: column;
  display: flex;
  width: 335px;
  height: auto;
  border-radius: 30px;
  border: 1px solid #dde0e7;
  background:linear-gradient(215deg, #012F46 0%, #010D1D 47.19%, #01354C 141.84%);
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}
.calendarWrapper .datePickerTop {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 38px;
}
.calendarWrapper .datePickerTop p {
  display: flex;
  align-items: center;
  width: 120px;
  justify-content: center;
  font-size: 1.14rem;
  line-height: 30px;
  margin: 10px;
  text-align: center;
  color: #a4abbd;
  cursor: pointer;
}
.calendarWrapper .datePickerTop p:hover {
  color: #295B74;
}
.calendarWrapper .weekDaysRow {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 36px;
  gap: 6px;
}
.calendarWrapper .weekDaysRow th {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 0.75rem;
  line-height: 20px;
  text-align: center;
  color: #a4abbd;
}
.calendarWrapper .weekDaysRow th.weekend {
  color: #ff6d90;
}
.calendarWrapper .monthYears table {
  display: grid;
  -moz-column-gap: 36px;
  margin-top: 6px;
  grid-row: 0.3333333333;
  grid-template-columns: repeat(3, 33%);
  grid-template-rows: 3;
}
.calendarWrapper .monthYears table tr {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 64px;
  line-height: 32px;
  border-radius: 10px;
  margin: 0 auto;
  padding: 20px 3px;
  cursor: pointer;
  font-size: 1.14rem;
  line-height: 20px;
  text-align: center;
  color: #a4abbd;
}
.calendarWrapper .monthYears table tr:hover {
  color: #295B74;
}
.calendarWrapper .monthDays {
  display: grid;
  row-gap: 6px;
  column-gap: 6px;
  margin-top: 6px;
  grid-row: 0.1428571429;
  grid-template-columns: repeat(7, 36px);
  grid-template-rows: 6;
}
.calendarWrapper .monthDays tr {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
}
.calendarWrapper .monthDays tr:hover {
  color: #295B74;
}
.calendarWrapper .monthDays tr.currentDay {
  border: 1px solid #295B74;
  color: #fff;
}
.activeMonth,
.activeYear{
  background: rgba(255, 255, 255, 0.1) !important;
}
.calendarWrapper .monthDays tr.currentDay.activeDay {
  background-color: #295B74 !important;
}
.calendarWrapper .monthDays tr.currentDay:hover {
  color: #fff;
  cursor: default;
}
.calendarWrapper .monthDays tr.activeDay {
  background-color: #295B74;
  color: #fff;
}
.calendarWrapper .monthDays tr.notCurrentMonth {
  color: #a4abbd;
}
.prev_one_date {
  width: 24px;
  height: 24px;
  padding: 0;
  transform: rotate(180deg);
  background: transparent;
  border: 0;
  cursor: pointer;
}
.prev_date {
  width: 24px;
  height: 24px;
}
.next_date {
  width: 24px;
  height: 24px;
}
.next_one_date {
  min-width: 24px;
  background: transparent;
  padding: 0;
  border: 0;
  cursor: pointer;
  height: 24px;
  border-radius: 50%;
}
@media (max-width: 899px) {
  .calendarWrapper {
    width: 305px;
    padding: 20px 10px;
  }
}
</style>