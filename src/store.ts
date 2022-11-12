import { reactive } from "vue";
import { sortReadings } from "./utils/tableFuncs";

export const authStore = reactive({ authorized: false, token: "" });

export const errorStore = reactive({
  error: {} as ErrorObj,
  toggleActive() {
    this.error.active = !this.error.active;
  },
  newError(err: ErrorObj) {
    this.error = err;
  },
});

export const dataStore = reactive({
  data: [] as Reading[],
  currentPage: 1,
  perPage: 100,
  totalPages: 1,
  currentDirection: "desc",
  currentOrderBy: "diastolic_bp",
  fromDate: new Date(),
  toDate: new Date(),
  total_pages: 1,
  total: 0,
  initialized: false,
  sortStore() {
    this.data = sortReadings(
      this.data,
      this.currentOrderBy as Sortable,
      this.currentDirection as "asc" | "desc"
    );
  },
  deDupe() {
    //filter out duplicates, which might happen due to weird caching/sorting/fetch interactions
    const ids = this.data.map((reading) => reading.id);
    this.data = this.data.filter(({ id }, index) => !ids.includes(id, index + 1));
  },
  updateReading(modifiedReading: Reading, index: number) {
    this.data[index] = modifiedReading;
  },
  deleteReading(index: number) {
    this.data.splice(index, 1);
  },
  addReading(newReading: Reading, index: number = 0) {
    //todo: this shouldn't just go to index 0 -- ideally respect sorting
    if (index == 0) {
      this.data.unshift(newReading);
    } else {
      this.data.splice(index, 0, newReading);
    }
  },
  addReadingAtIndex(newReading: Reading, index: number) {
    this.data.splice(index, 0, newReading);
  },
  updateData(data: Reading[], meta: MetaData) {
    data.forEach((e) => (e.timestamp = e.timestamp.slice(0, -3)));

    this.data = this.data.concat(data);
    this.totalPages = meta.total_pages;
    this.total = meta.total;
  },
  updateParams(params: GetParams) {
    this.perPage = params.per_page;
    this.fromDate = new Date(params.from_date);
    this.toDate = new Date(params.to_date);
    this.currentDirection = params.order;
    this.currentOrderBy = params.sort_by;
    this.currentPage = params.page;
  },
  findReadingByDateDayTime(date: string, dayTime: DayTimeStr) {
    let reading = this.data.find((e) => {
      return e.timestamp?.substring(0, 10) == date && dayTime == e.day_time;
    });
    if (!reading) return [0, 0, 0];
    return [reading?.systolic_bp, reading?.diastolic_bp, reading?.heart_rate];
  },
  getSys(dayTime: DayTimeStr) {
    const sysArrEvening: number[] = [];
    const diaArrEvening: number[] = [];
    const sysArrLunch: number[] = [];
    const diaArrLunch: number[] = [];
    const tempArr: number[] = [];
    const xArr: string[] = [];
    this.data.forEach((e) => {
      if (e.day_time == "evening" || e.day_time == "other") {
        xArr.push(e.timestamp);
        sysArrEvening.push(e.systolic_bp);
        diaArrEvening.push(e.diastolic_bp);
        tempArr.push(e.weather.temperature);
      } else if (false) {
        sysArrLunch.push(e.systolic_bp);
        diaArrLunch.push(e.diastolic_bp);
      }
    });
    console.log(xArr.length, sysArrEvening.length);
    return [
      {
        x: xArr,
        y: sysArrEvening,
        type: "scatter",
        line: { shape: "linear" },
        mode: "line",
        name: "Sys Abend",
      },
      {
        x: xArr,
        y: diaArrEvening,
        type: "scatter",
        line: { shape: "linear" },
        mode: "line",
        name: "Dia Abend",
      },
      //   {
      //     x: xArr,
      //     y: tempArr,
      //     type: "scatter",
      //     line: { shape: "linear" },
      //     mode: "line",
      //     name: "Temp",
      //   },
      //   {
      //     x: xArr,
      //     y: sysArrLunch,
      //     type: "scatter",
      //     line: { shape: "linear" },
      //     mode: "line",
      //     name: "Sys Mittag",
      //   },
      //   {
      //     x: xArr,
      //     y: diaArrLunch,
      //     type: "scatter",
      //     line: { shape: "linear" },
      //     mode: "line",
      //     name: "Dia Mittag",
      //   },
    ];
  },
});
