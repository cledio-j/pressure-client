import { defineStore } from 'pinia'
import { type Ref, computed, reactive, ref } from 'vue'

export const useDataStore = defineStore('data', () => {
  const data: Ref<Reading[]> = ref([])
  const totalPages: Ref<number> = ref(1)
  const totalAvailable: Ref<number> = ref(0)
  const latest = computed(() => {
    return [...data.value]
      .sort((a, b) => {
        return new Date(`${a.date}T${a.time}`) > new Date(`${b.date}T${b.time}`) ? -1 : 1
      })
      .slice(0, 10)
  })
  const params = ref({
    perPage: 50,
    currentPage: 1,
    currentDirection: 'desc',
    currentOrderBy: 'diastolic_bp',
    fromDate: new Date(),
    toDate: new Date(),
  })
  const dates = computed(() => {
    return [
      ...new Set(
        data.value
          .map((e) => {
            if (e.timestamp)
              return e.timestamp.substring(0, 10)
            else return false
          })
          .filter(Boolean) as Array<string>,
      ),
    ]
  })
  function updateReading(modifiedReading: Reading, index: number) {
    data.value[index] = modifiedReading
  }
  function deDupe() {
    // filter out duplicates, which might happen due to weird caching/sorting/fetch interactions
    const ids = data.value.map(reading => reading.id)
    data.value = data.value.filter(({ id }, index) => !ids.includes(id, index + 1))
  }
  function deleteReading(index: number) {
    data.value.splice(index, 1)
  }
  function addReading(newReading: Reading, index = 0) {
    // todo: this shouldn't just go to index 0 -- ideally respect sorting
    if (index === 0)
      data.value.unshift(newReading)

    else
      data.value.splice(index, 0, newReading)
  }
  function updateData(updated: Reading[], meta: MetaData) {
    updated.forEach(e => (e.timestamp = e.timestamp.slice(0, -3)))

    data.value = data.value.concat(updated)
    totalPages.value = meta.total_pages
    totalAvailable.value = meta.total
  }
  function replaceData(newData: Reading[], meta: MetaData) {
    newData.forEach(e => (e.timestamp = e.timestamp.slice(0, -3)))
    data.value = newData
    totalPages.value = meta.total_pages
    totalAvailable.value = meta.total
  }
  function updateParams(newParams: GetParams) {
    params.value.perPage = newParams.per_page
    params.value.fromDate = new Date(newParams.from_date)
    params.value.toDate = new Date(newParams.to_date)
    params.value.currentDirection = newParams.order
    params.value.currentOrderBy = newParams.sort_by
    params.value.currentPage = newParams.page
  }
  function findReadingByDateDayTime(date: string, dayTime: DayTimeStr) {
    const reading = data.value.find((e) => {
      return e.timestamp?.substring(0, 10) === date && dayTime === e.day_time
    })
    if (!reading)
      return [0, 0, 0]
    return [reading?.systolic_bp, reading?.diastolic_bp, reading?.heart_rate]
  }
  return {
    data,
    totalPages,
    totalAvailable,
    params,
    updateReading,
    updateData,
    replaceData,
    updateParams,
    findReadingByDateDayTime,
    addReading,
    deleteReading,
    deDupe,
    dates,
    latest,
  }
})

export const authStore = reactive({ authorized: false, token: '' })

export const errorStore = reactive({
  error: {} as ErrorObj,
  toggleActive() {
    this.error.active = !this.error.active
  },
  newError(err: ErrorObj) {
    this.error = err
  },
})
