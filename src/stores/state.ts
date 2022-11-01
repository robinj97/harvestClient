import { defineStore } from 'pinia'
import {useLocalStorage} from "@vueuse/core"
import { ref } from 'vue'

export const useConfigStore = defineStore("config", () => {
    const configObject = ref(useLocalStorage("config",{
        "version": "2",
        "headers": {
            "Harvest-Account-ID": "12345678",
            "Authorization": "Bearer gucci.flipflops123123"
        },
        "referenceDate": "2022-01-14",
        "referenceBalance": 0,
        "expectedWorkHoursPerDay": 7.5,
        "entriesToIgnore": [
            {
                "project": "Absence",
                "task": "Time off"
            }
        ]
    }));
    const setAuthToken = (newVal:string) => configObject.value.headers['Authorization'] = newVal;
    const setAccountId = (newVal:string) => configObject.value.headers['Harvest-Account-ID'] = newVal;
    const setReferenceDate = (newVal:string) => configObject.value.referenceDate = newVal;
    return {configObject,setAuthToken,setAccountId,setReferenceDate}
})

export function getConfigJSON() {
    const configStore = useConfigStore();
    const configObject = configStore.$state.configObject;
    return JSON.stringify(configObject,null,4);

}

