import dateUtils from "./dateUtils";
import { useConfigStore } from "@/stores/state";

const store = useConfigStore();
const config = store.$state.configObject;

export async function* timeEntryGenerator(headers:object, from:string) {
    try {
      const get = async (url, params) => (await axios.get(url, { headers, params })).data
      let res = await get('https://api.harvestapp.com/v2/time_entries', { from })
      do for (let timeEntry of res.time_entries) yield timeEntry
      while (res.links.next && (res = await get(res.links.next)))
    } catch (error) {
      console.log(`\x1b[31mAn error occured when attempting to get data from Harvest\x1b[0m`)
    }
  }


export function getReferenceDate() {
    const isodateToDate = (isodate: string) => new Date(isodate.split("-"));
    if (config.referenceDate) {
        return isodateToDate(config.referenceDate);
    }
    throw new Error("Reference date is not proper");
}

export function getReferanceBalance() {
    if (config.referenceBalance != null) {
        return config.referenceBalance;
    }
    throw new Error("Referance balance error");
}

export async function getWorkHours() {
    const config = getConfig()
  let from = dateUtils.offsetISODate(
    config.referenceDate,
    { days: dateUtils.ISOToMs(config.referenceDate) < dateUtils.getTodayDate().getTime() }
  )

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