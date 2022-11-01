// These day constants can be any value as long as they can be used as object keys
const MONDAY = 'monday'
const TUESDAY = 'tuesday'
const WEDNESDAY = 'wednesday'
const THURSDAY = 'thursday'
const FRIDAY = 'friday'
const SATURDAY = 'saturday'
const SUNDAY = 'sunday'

/**
 * Maps the day constants to Date.prototype.getDate() values
 */
const DAY_TO_NUM = {
  [MONDAY]: 1,
  [TUESDAY]: 2,
  [WEDNESDAY]: 3,
  [THURSDAY]: 4,
  [FRIDAY]: 5,
  [SATURDAY]: 6,
  [SUNDAY]: 0
}

/**
 * Maps the Date.prototype.getDate() values to the day constants
 */
const NUM_TO_DAY = {
  1: MONDAY,
  2: TUESDAY,
  3: WEDNESDAY,
  4: THURSDAY,
  5: FRIDAY,
  6: SATURDAY,
  0: SUNDAY
}

const UNIQUE_DAYS = [
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY
]

const DEFAULT_WORKDAYS = [
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY
]

/**
 * Based on Python's dateutil easter implementation
 * @param {number} year
 * @returns date of easter sunday at given year
 */
function calcEasterSunday(year: any) {
  if (typeof year !== 'number')
    throw new Error('Year must specified as a number')

  const y = year
  const g = y % 19
  const c = Math.floor(y / 100)
  const h = (c - Math.floor(c / 4) - Math.floor((8 * c + 13) / 25) + 19 * g + 15) % 30
  const i = h - Math.floor(h / 28) * (1 - Math.floor(h / 28) * Math.floor(29 / (h + 1)) * Math.floor((21 - g) / 11))
  const j = (y + Math.floor(y / 4) + i + 2 - c + Math.floor(c / 4)) % 7
  const p = i - j
  const d = 1 + (p + 27 + Math.floor((p + 6) / 40)) % 31
  const m = 3 + Math.floor((p + 26) / 30)
  return new Date(y, m - 1, d)
}

/**
 * Offset given date
 * @param {Date} date
 * @param offsets
 * @returns new date with offsets
 */
function offsetDate(
  date: Date,
  { years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = {}
) {
  return new Date(
    date.getFullYear() + years,
    date.getMonth() + months,
    date.getDate() + days,
    date.getHours() + hours,
    date.getMinutes() + minutes,
    date.getSeconds() + seconds,
    date.getMilliseconds() + milliseconds
  );
}

/**
 * @param {string} isodate, date formatted as YYYY-MM-DD
 * @param offsets 
 * @returns string with format YYYY-MM-DD
 */
function offsetISODate(
  isodate: string,
  { years = 0, months = 0, days = 0 } = {}
) {
  return offsetDate(new Date(isodate.split('T')[0]), { years, months, days }).toISOString().split('T')[0]
}

/**
 * Returns easter days respective to given year
 * @param {number} year must be greater or equal to 1970
 * @returns
 */
function calcEasterDates(year: any) {
  const easterSunday = calcEasterSunday(year)
  return {
    palmSunday: offsetDate(easterSunday, { days: -7 }),
    maundyThursday: offsetDate(easterSunday, { days: -3 }),
    goodFriday: offsetDate(easterSunday, { days: -2 }),
    easterSunday,
    easterMonday: offsetDate(easterSunday, { days: 1 }),
    ascensionDay: offsetDate(easterSunday, { days: 39 }),
    whitsun: offsetDate(easterSunday, { days: 49 }),
    whitMonday: offsetDate(easterSunday, { days: 50 })
  }
}

/**
 * @param {number} year
 * @returns
 */
function getNorwegianHolidays(year: number) {
  const easterDates = calcEasterDates(year)
  const fixedHolidays = {
    newYear: new Date(year, 0, 1),
    workersDay: new Date(year, 4, 1),
    independenceDay: new Date(year, 4, 17),
    christmasEve: new Date(year, 11, 24), // Not necessarily for all workplaces
    christmasDay: new Date(year, 11, 25), // Forste juledag
    boxingDay: new Date(year, 11, 26), // Andre jule dag
    newYearsEve: new Date(year, 11, 31), // Not necessarily for all workplaces
  }
  return { ...easterDates, ...fixedHolidays }
}

/**
 * @param {Date} date
 * @returns
 */
function inWeekend(date: { getDay: () => number }) {
  return !(date.getDay() % 6)
}




/**
 * Inclusive 'from' and 'to' dates
 * @param {Date} date
 * @param {Date} from
 * @param {Date} to
 * @returns
 */
function isBetween(date: { getTime: () => number }, from: any, to: { getTime: () => number }) {
  return (from.getTime() <= date.getTime()) && (date.getTime() <= to.getTime())
}

/**
 * Calculate number of days between and including 'from' and 'to' dates.
 * @param {Date} from
 * @param {Date} to
 * @returns total number of days, and the count of each distinct days
 */
function countDays(from: { getTime: () => number; getDay: () => any }, to: Date) {
  const days = 1 + Math.round((to.getTime() - from.getTime()) / 86400000)
  const fromDay = from.getDay()
  return {
    days,
    [MONDAY]: Math.floor((days + (fromDay + 5) % 7) / 7),
    [TUESDAY]: Math.floor((days + (fromDay + 4) % 7) / 7),
    [WEDNESDAY]: Math.floor((days + (fromDay + 3) % 7) / 7),
    [THURSDAY]: Math.floor((days + (fromDay + 2) % 7) / 7),
    [FRIDAY]: Math.floor((days + (fromDay + 1) % 7) / 7),
    [SATURDAY]: Math.floor((days + fromDay) / 7),
    [SUNDAY]: Math.floor((days + (fromDay + 6) % 7) / 7)
  }
}

/**
 * Loop based version of countDays. Used for validation in tests.
 * @param {Date} from
 * @param {Date} to
 * @returns
 */
function slowCountDays(from: any, to: { getTime: () => number }) {
  const counts = {
    days: 0,
    [MONDAY]: 0,
    [TUESDAY]: 0,
    [WEDNESDAY]: 0,
    [THURSDAY]: 0,
    [FRIDAY]: 0,
    [SATURDAY]: 0,
    [SUNDAY]: 0
  }

  let curr = offsetDate(from) // do a copy
  while (curr.getTime() <= to.getTime()) {
    counts[NUM_TO_DAY[curr.getDay()]] += 1
    curr = offsetDate(curr, { days: 1 })
    counts.days++
  }
  return counts
}


/**
 * Generator returning norwegian holidays between 'from' and 'to' dates
 * @param {Date} from
 * @param {Date} to
 * @returns {Generator<Date, void, void>}
 */
function* norwegianHolidaysGenerator(from: { getFullYear: () => any }, to: Date) {
  const fromYear = from.getFullYear()
  for (let i of Array(to.getFullYear() - fromYear + 1).keys())
    for (let date of (<any>Object).values(getNorwegianHolidays(i + fromYear)))
      if (isBetween(date, from, to))
        yield date
      else
        continue
}

/**
 * E.g. given monday to friday, return ['saturday', 'sunday']
 * @param {Array<Date>} days
 * @returns
 */
function getComplementWeekdays(days: Iterable<unknown> | null | undefined) {
  let daysSet = new Set(days)
  return UNIQUE_DAYS.filter(day => !daysSet.has(day))
}

/**
 * @param {Iterable<Date>} holidays
 * @param {Array<string>} workdays
 * @returns
 */
function countHolidaysInWorkdays(holidays: Generator<any, void, unknown>, workdays: any[]) {
  const workdaySet = new Set(workdays.map((day: string | number) => DAY_TO_NUM[day]))
  let holidaysInWorkdays = 0
  for (let holiday of holidays)
  if (workdaySet.has(holiday.getDay())){
    holidaysInWorkdays++
  }
  return holidaysInWorkdays
}

/**
 * Get today's date object with zeroed out hours, minutes, seconds and milliseconds
 * @returns
 */
function getTodayDate() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

/**
 * Get today's date iso string (YYYY-MM-DD)
 * @returns
 */
function getTodayISO() {
  const date = new Date()
  date.setHours(0, -date.getTimezoneOffset(), 0, 0)
  return date.toISOString().split('T')[0]
}

/**
 * @param {string} isodate MMMM-YY-DD
 * @returns
 */
function ISOToMs(isodate: { split: (arg0: string) => { split: (arg0: string) => string | number | Date }[] }) {
  return new Date(isodate.split('T')[0].split('-')).getTime()
}

/**
 * @param {number} actualHours
 * @param {Date} referenceDate
 * @param {number} referenceBalance
 * @param {{
 *  to: Date,
 *  workdays: Array<string>,
 *  holidays: Iterable<Date>,
 *  workHoursPerDay: number
 * }} optionals
 * @returns flex balance
 */
function calcFlexBalance(
  actualHours: number,
  referenceDate: any,
  referenceBalance: number,
  {
    to = getTodayDate(),
    workdays = DEFAULT_WORKDAYS,
    holidays = norwegianHolidaysGenerator(referenceDate, to),
    workHoursPerDay = 7.5
  } = {}
) {
  const { days: dayCount, ...weekdaysCounts } = countDays(referenceDate, to)
  const holidaysInWorkdays = countHolidaysInWorkdays(holidays, workdays)
  const offdaysCount = getComplementWeekdays(workdays).reduce((acc, day) => acc + weekdaysCounts[day], 0)
  const expectedHours = (dayCount - holidaysInWorkdays - offdaysCount) * workHoursPerDay
  return actualHours - expectedHours + referenceBalance
}

export default {
  calcEasterDates,
  calcEasterSunday,
  calcFlexBalance,
  countDays,
  countHolidaysInWorkdays,
  DAY_TO_NUM,
  DEFAULT_WORKDAYS,
  FRIDAY,
  getComplementWeekdays,
  getNorwegianHolidays,
  getTodayDate,
  getTodayISO,
  inWeekend,
  isBetween,
  ISOToMs,
  MONDAY,
  norwegianHolidaysGenerator,
  NUM_TO_DAY,
  offsetDate,
  offsetISODate,
  SATURDAY,
  slowCountDays,
  SUNDAY,
  THURSDAY,
  TUESDAY,
  UNIQUE_DAYS,
  WEDNESDAY
}