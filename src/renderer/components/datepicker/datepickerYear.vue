<template>
  <div class="calendarWrapper">
    <div class="datePickerTop">
      <button class="prev_date prev_one_date" @click="goprevYear">
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2819 1.9984C13.6731 1.62466 13.6731 0.99999 13.2819 0.626252C12.9151 0.275873 12.3377 0.275874 11.971 0.626253L7 5.37544L2.02904 0.626252C1.6623 0.275873 1.08485 0.275873 0.718109 0.626252C0.32692 0.999989 0.32692 1.62466 0.718109 1.9984L7 8.00003L13.2819 1.9984Z" fill="white"/>
      </svg>
      </button>
      <p
        @click="chooseYear = true"
        class="chosenYear"
      >
        {{ today.getFullYear() }}
      </p>
      <button class="next_date next_one_date" @click="gonextYear">
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2819 1.9984C13.6731 1.62466 13.6731 0.99999 13.2819 0.626252C12.9151 0.275873 12.3377 0.275874 11.971 0.626253L7 5.37544L2.02904 0.626252C1.6623 0.275873 1.08485 0.275873 0.718109 0.626252C0.32692 0.999989 0.32692 1.62466 0.718109 1.9984L7 8.00003L13.2819 1.9984Z" fill="white"/>
      </svg>
      </button>
    </div>

    
    <div class="monthYears">
      <table>
        <tr
          :class="
            currentDayChecker(year)
              ? 'currentDay'
              : ''"
          v-for="(year, idx) in years"
          :key="idx"
          @click="changeYearValue(year)"
        >
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
      newMonth: null,
      newDate: null,
      newYear: null,
      chooseYear: false,
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
  props: {
    activeDate: Object,
  },
  computed: {
    today() {
      if(this.newYear){
        let currDate = new Date((this.activeDate?.year || this.newYear), (this.newMonth||1), (this.newDate||1));
        return currDate;
      }else{
        return new Date()
      }
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
        i < currDate.getFullYear() + 16;
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
        unformat: e,
      }
      this.$emit("date", date);
    },
    changeYearValue(e) {
      this.newYear = e;
      this.getCurrentMonth();
      this.getNextMonth();
      this.createMonthBlock();
      this.currentDaySetter();
      this.$emit("date", {val:e,format:e});
    },
    currentDayChecker(day) {
      const date = new Date();
      if (
        day === date.getFullYear()
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
    goprevYear() {
      this.changeYearList = this.changeYearList + 16;
      this.years = [];
      this.getYears();
    },
    gonextYear() {
      this.changeYearList = this.changeYearList - 16;
      this.years = [];
      this.getYears();
    },
  },

  mounted() {
    this.newYear = (this.activeDate || new Date()).getFullYear()
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
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: 4;
}
.calendarWrapper .monthYears table tr {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 74px;
  height: 56px;
  line-height: 32px;
  border-radius: 10px;
  margin: 0;
  padding: 12px 3px;
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
.calendarWrapper tr:hover {
  color: #295B74;
}
.calendarWrapper tr.currentDay {
  background-color: #295B74;
  color: #fff;
}
.calendarWrapper tr.currentDay:hover {
  color: #fff !important;
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