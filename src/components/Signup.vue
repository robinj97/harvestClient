<template>
    <div v-if="noBalance() && !isBalance">
        <LvInput :bottom-bar="true" placeholder="auth token" label="Insert Auth Token" placeholder-color="#0000006B"
            v-model="authTokenRef" :value="authTokenRef" @update:modelValue="updateAuthTokenVal()" />

        <LvInput :bottom-bar="true" placeholder="account ID" label="Insert Account ID" placeholder-color="#0000006B"
            v-model="accountIdRef" :value="accountIdRef" @update:modelValue="updateAccountIdVal()" />
        <LvInput :bottom-bar="true" placeholder="Balance at given date" label="Insert reference balance"
            placeholder-color="#0000006B" v-model="referenceBalance" :value="referenceBalance"
            @update:modelValue="updateReferenaceBalance()" />

        Reference date
        <input type="date" id="refrenceDate" v-model="refrenceDateRef" @change="updateReferenceDate" />
        
        <LvInput :bottom-bar="true" placeholder="Work hours per day" label="Insert work hours per day"
            placeholder-color="#0000006B" v-model="refWorkHoursPerDay" :value="refWorkHoursPerDay"
            @update:modelValue="updateWorkHoursPerDay()" />


        <LvButton :push="true" :raised="true" :rounded="true" label="Submit" type="button" size="lg"
            @click="getBalance()" />
    </div>
    <div v-if="noBalance() && !isBalance" class="accordian-wrapper" src="light-icons/dist/light-icon.css">
        <div class="nav-list__category-wrap">
            <div class="collapsible_catgory" @click="open1">
                <div class="nav-list__category-label">
                    How do I get these values from Harvest?
                    <i :class="isOpenA ? 'light-icon-chevron-up' : 'light-icon-chevron-down'"></i>
                </div>

            </div>
            <LvCollapsible :show="isOpenA">
                <div class="collapisible--answer">
                    <ol>
                        <li>Go to this link <a href="https://id.getharvest.com/developers">here</a> </li>
                        <li>Create a new Access Token with the name <strong>bounty</strong></li>
                        <li>Copy <strong>Your token</strong> and <strong>Account ID</strong></li>
                        <li>Paste into website and hit submit</li>
                    </ol>
                </div>
            </LvCollapsible>
        </div>
    </div>

    <div v-if="isBalance">
        Flex hours total: {{ balanceFromState }}
    </div>

</template>



<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import LvInput from 'lightvue/input';
import LvButton from 'lightvue/button';
import LvBadge from 'lightvue/badge';
import LvCollapsible from 'lightvue/collapsible';
import { useConfigStore } from '@/stores/state';
import { run } from '@/utils/mainFunctions';
import "light-icons/dist/light-icon.css";

export default defineComponent({
    name: "Signup",
    components: { LvInput, LvButton, LvBadge, LvCollapsible },
    setup() {
        const store = useConfigStore();
        const authTokenRef = ref("");
        const accountIdRef = ref("");
        const referenceBalance = ref("");
        const refWorkHoursPerDay = ref(store.$state.configObject.expectedWorkHoursPerDay);
        const isOpenA = ref(false);
        const refrenceDateRef = ref(store.$state.configObject.referenceDate);
        function updateAccountIdVal() {
            store.setAccountId(accountIdRef.value);
        }
        function updateAuthTokenVal() {
            const authString = "Bearer " + authTokenRef.value;
            store.setAuthToken(authString);
        }
        function updateReferenceDate() {
            store.setReferenceDate(refrenceDateRef.value);
        }
        function updateReferenaceBalance() {
            store.setReferenceBalance(parseFloat(referenceBalance.value.replace(",", ".")));
        }
        function updateWorkHoursPerDay() {
            store.setExpectedWorkHoursPerDay(refWorkHoursPerDay.value);
        }
        function getBalance() {
            run().then(retVal => {
                console.log("this was ret", retVal);
                store.balance = retVal;
            })
        }
        function noBalance() {
            return balanceFromState.value < 0;;
        }
        function open1() {
            isOpenA.value = !isOpenA.value;

        }
        const authTokenValComputed = computed(() => store.configObject?.headers?.Authorization);
        const accountIdComputed = computed(() => store.configObject.headers['Harvest-Account-ID']);
        const balanceFromState = computed(() => store.balance);
        const isBalance = computed(() => { return balanceFromState.value > 0 })
        onMounted(() => {
            run().then(retVal => {
                console.log("this was ret", retVal);
                store.balance = retVal;
            })
        })
        return {
            authTokenRef,
            accountIdRef,
            refrenceDateRef,
            updateAuthTokenVal,
            updateAccountIdVal,
            updateReferenceDate,
            getBalance,
            noBalance,
            authTokenValComputed,
            accountIdComputed,
            balanceFromState,
            isBalance,
            isOpenA,
            open1,
            referenceBalance,
            updateReferenaceBalance,
            refWorkHoursPerDay,
            updateWorkHoursPerDay

        }
    }
})
</script>
<style lang="scss">
.accordian-wrapper {
    width: 100%;
    align-content: space-around;
    padding-left: 50px;
}
</style>

