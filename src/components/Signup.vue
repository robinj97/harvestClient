<template>
    <div v-if="noBalance()">
        <LvInput :bottom-bar="true" placeholder="auth token" label="Insert Auth Token" placeholder-color="#0000006B"
            v-model="authTokenRef" :value="authTokenRef" @update:modelValue="updateAuthTokenVal()" />

        <LvInput :bottom-bar="true" placeholder="account ID" label="Insert Account ID" placeholder-color="#0000006B"
            v-model="accountIdRef" :value="accountIdRef" @update:modelValue="updateAccountIdVal()" />

        Starting workDate
        <input type="date" id="refrenceDate" v-model="refrenceDateRef" @change="updateReferenceDate" />
        <LvButton :push="true" :raised="true" :rounded="true" label="Submit" type="button" size="lg"
            @click="getBalance()" />
    </div>

    <div v-if="balanceFromState > 0">
        {{ balanceFromState }}
    </div>

</template>



<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import LvInput from 'lightvue/input';
import LvButton from 'lightvue/button';
import LvBadge from 'lightvue/badge';
import { useConfigStore } from '@/stores/state';
import { run } from '@/utils/mainFunctions';

export default defineComponent({
    name: "Signup",
    components: { LvInput, LvButton, LvBadge },
    setup() {
        const store = useConfigStore();
        const authTokenRef = ref("");
        const accountIdRef = ref("");
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
        function getBalance() {
            run();
        }
        function noBalance() {
            return balanceFromState.value < 0;;
        }
        const authTokenValComputed = computed(() => store.configObject?.headers?.Authorization);
        const accountIdComputed = computed(() => store.configObject.headers['Harvest-Account-ID']);
        const balanceFromState = computed(() => store.balance);
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

        }
    }
})
</script>

