<template>
  <div class="calendarWrapper">

    <div class="monthYears">
      <table>
        <tr
          v-for="(month, idx) in months"
          :key="idx"
          @click="changeMonthValue(idx)"
        >
          {{
            month?.shortLabel?.[$i18n.locale.value]
          }}
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "datePickerComponent",
  props:{
    activeDate:{
      type: Object,
      default: () => null,
    },
  },

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
      let currDate = new Date((this.activeDate?.year || this.newYear), ((this.activeDate?.month) || this.newMonth), this.newDate);
      return currDate;
    },
  },

  methods: {
    currentDaySetter() {
      this.curDay = this.today;
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
        unformat: e,
      }
      this.$emit("date", date);
    },
    changeMonthValue(e) {
      this.chooseMonth = false;
      this.chooseYear = false;
      this.newMonth = e;
      this.currentDaySetter();
      this.getCurrentMonth();
      this.createMonthBlock();
      this.$emit("date", {val:(e+1),format:this.months[e]?.shortLabel?.[this.$i18n.locale.value]});
      
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
      if (
        day.getDate() === this.curDay.getDate() &&
        day.getMonth() === this.curDay.getMonth() &&
        day.getFullYear() === this.curDay.getFullYear()
      ) {
        return true;
      } else return false;
    },

    currentMonthChecker(day) {
      if (day.getMonth() === this.today.getMonth()) {
        return true;
      } else return false;
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
      this.newMonth = newDate.getMonth();
      this.newYear = newDate.getFullYear();
      this.newDate = newDate.getDate();
    },


    createMonthBlock() {
      const weekDay = this.currentMonth[0]?.getDay();
      if (weekDay >= 1 && weekDay <= 6) {
        this.currentMonthBlock = this.previousMonth.slice(-(weekDay - 1));
        this.currentMonthBlock = this.currentMonthBlock.concat(
          this.currentMonth
        );

        for (
          let i = 0;
          i < 42 - (weekDay - 1 + this.currentMonth.length);
          i++
        ) {
          if (this.nextMonth.length)
            this.currentMonthBlock.push(this.nextMonth[i]);
        }
      } else if (weekDay === 0) {
        this.currentMonthBlock = this.previousMonth.slice(-6);
        this.currentMonthBlock = this.currentMonthBlock.concat(
          this.currentMonth
        );

        for (let i = 0; i < 42 - (this.currentMonth.length + 6); i++) {
          if (this.nextMonth.length)
            this.currentMonthBlock.push(this.nextMonth[i]);
        }
      }
    },
  },

  mounted() {
    this.getCurrDatehNum();
    this.getCurrentMonth();
    this.createMonthBlock();
    this.currentDaySetter();
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
  font-family: "Casper Bold";
  font-size: 1.14rem;
  line-height: 20px;
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
  font-family: "Casper Bold";
  font-size: 0.75rem;
  line-height: 20px;
  text-align: center;
  color: #a4abbd;
}
.calendarWrapper .weekDaysRow th.weekend {
  color: #eb194c;
}
.calendarWrapper .monthYears hr {
  margin-top: 30px;
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
  width: 64px;
  height: 64px;
  line-height: 32px;
  border-radius: 10px;
  margin: 0 auto;
  padding: 20px 3px;
  cursor: pointer;
  font-family: "Casper Bold";
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
  font-family: "Casper Bold";
  font-size: 0.75rem;
  line-height: 20px;
  text-align: center;
  color: #a4abbd;
}
.calendarWrapper .monthDays tr:hover {
  color: #295B74;
}
.calendarWrapper .monthDays tr.currentDay {
  background-color: #295B74;
  color: #fff;
}
.calendarWrapper .monthDays tr.currentDay:hover {
  color: #fff;
  cursor: default;
}
.calendarWrapper .monthDays tr.activeDay {
  border: 1px solid #295B74;
  color: #fff;
}
.calendarWrapper .monthDays tr.notCurrentMonth {
  color: #dde0e7;
}
.prev_one_date {
  width: 24px;
  height: 24px;
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