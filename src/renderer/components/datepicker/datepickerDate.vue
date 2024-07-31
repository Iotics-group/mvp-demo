<template>
  <div class="calendarWrapper">
    <div>
      <table class="monthDays">
        <tr
          :class="
            activeDayChecker(day)
              ? 'activeDay'
              : '' || currentDayChecker(day)
              ? 'currentDay'
              : '' || currentMonthChecker(day)
              ? ''
              : 'notCurrentMonth'
          "
          v-for="(day, idx) in currentMonthBlock"
          :key="idx"
          @click="changeDate(day)"
        >
          {{
            day.getDate()
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
    datekey:{
      type: String,
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
    };
  },

  computed: {
    today() {
      let currDate = new Date((this.activeDate?.year || this.newYear), ((this.activeDate?.month) || this.newMonth), (this.datekey ? this.activeDate?.[this.datekey] : this.newDate));
      return currDate;
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

      const result = e?.toLocaleDateString("en-GB", {
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
      this.currentDaySetter();
      this.getPreviousMonth();
      this.getCurrentMonth();
      this.getNextMonth();
      this.createMonthBlock();
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

    getPreviousMonth() {
      let year = this.today.getFullYear();
      let month = this.today.getMonth() - 1;

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
      this.newMonth = newDate.getMonth();
      this.newYear = newDate.getFullYear();
      this.newDate = newDate.getDate();
    },

    getNextMonth() {
      let year = this.today.getFullYear();
      let month = this.today.getMonth() + 1;
      this.nextMonth = [];
      const date = new Date(year, month, 1);

      while (date.getMonth() === month) {
        this.nextMonth.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
    },

    createMonthBlock() {
      const weekDay = this.currentMonth[0]?.getDay();
      if (weekDay >= 1 && weekDay <= 6) {
        this.currentMonthBlock = this.currentMonthBlock.concat(
          this.currentMonth
        );

       
      } else if (weekDay === 0) {
        this.currentMonthBlock = this.currentMonthBlock.concat(
          this.currentMonth
        );

      }
    },
    goprevMonth() {
      this.newMonth--;
      if (this.newMonth < 0) (this.newMonth = 11), this.newYear--;
      this.getPreviousMonth();
      this.getCurrentMonth();
      this.getNextMonth();
      this.createMonthBlock();
      this.currentDaySetter();
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
  border: 1px solid #295B74;
  color: #fff;
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