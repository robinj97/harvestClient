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
        "referenceDate": "2022-01-01",
        "referenceBalance": 0,
        "expectedWorkHoursPerDay": 7.5,
        "entriesToIgnore": [
            {
                "project": "Absence",
                "task": "Time off"
            }
        ]
    }));
    let balance = ref(0);
    const setAuthToken = (newVal:string) => configObject.value.headers['Authorization'] = newVal;
    const setAccountId = (newVal:string) => configObject.value.headers['Harvest-Account-ID'] = newVal;
    const setReferenceDate = (newVal:string) => configObject.value.referenceDate = newVal;
    const setReferenceBalance = (newVal:number) => configObject.value.referenceBalance = newVal;
    const setBalance = (newVal:any) => balance.value = newVal;
    return {configObject,setAuthToken,setAccountId,setReferenceDate,balance,setBalance,setReferenceBalance}
})

export function getConfigJSON() {
    const configStore = useConfigStore();
    const configObject = configStore.$state.configObject;
    return JSON.stringify(configObject,null,4);

}

