import { useConfigStore } from '@/stores/state';
import dateUtils from "@/utils/dateUtils"
import axios from "axios";
import { computed } from 'vue';

export function getStore() {
  const store = useConfigStore();
  return computed(() => store.$state.configObject);
}


export async function* timeEntryGenerator(headers:object, from:string) {
    try {
      const get = async (url, params) => (await axios.get(url, { headers, params })).data
      let res = await get('https://api.harvestapp.com/v2/time_entries', { from })
      do for (let timeEntry of res.time_entries) yield timeEntry
      while (res.links.next && (res = await get(res.links.next,null)))
    } catch (error) {
      console.log(`\x1b[31mAn error occured when attempting to get data from Harvest\x1b[0m`)
    }
  }


export function getReferenceDate() {
    const isodateToDate = (isodate: string) => new Date(isodate.split("-"));
    const config = getStore().value;
    if (config.referenceDate) {
        return isodateToDate(config.referenceDate);
    }
    throw new Error("Reference date is not proper");
}

export function getReferanceBalance() {
  const config = getStore().value;
    if (config.referenceBalance != null) {
        return config.referenceBalance;
    }
    throw new Error("Referance balance error");
}

export async function getWorkHours() {
  const config = getStore().value;
  let from = dateUtils.offsetISODate(
    config.referenceDate,
    { days: dateUtils.ISOToMs(config.referenceDate) < dateUtils.getTodayDate().getTime() }
  );

  // Example of project and client objects from Harvest
  // "project": {
  //   "id": 12345678,
  //   "name": "Absence",
  //   "code": "Absence"
  // }
  // "task": {
  //     "id": 12345678,
  //     "name": "Leave - Paid"
  // }

  const zeroIfShouldIgnore = timeEntry => {
    for (const { project: projectName, task: taskName } of config.entriesToIgnore) {
      if (
        timeEntry.project.name === projectName &&
        timeEntry.task.name === taskName
      ) {
        return 0
      }
    }
    return 1
  }

  let hours = 0
  for await (let timeEntry of timeEntryGenerator(config.headers, from))
    hours += zeroIfShouldIgnore(timeEntry) * timeEntry.hours
  return hours
}


export async function run() {
  const config = getStore().value;
  const workedHours = await getWorkHours();
  const workHoursPerDay = config.expectedWorkHoursPerDay;
  const referenceDate = await getReferenceDate();
  const referenceBalance = config.referenceBalance;
  const from = referenceDate; 
  const to = dateUtils.getTodayDate();
  const balance = dateUtils.calcFlexBalance(workedHours,from,referenceBalance,{ to, workHoursPerDay });
  console.log("referenceDate", referenceDate);
  console.log("referenceBalance",referenceBalance);
  console.log("currDate",to);
  console.log("balance", balance);
  return balance;
}