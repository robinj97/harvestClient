<template>
    <LvInput :bottom-bar="true" placeholder="auth token" label="Insert Auth Token" placeholder-color="#0000006B"
        v-model="authTokenRef" :value="authTokenRef" @update:modelValue="updateAuthTokenVal()" />

    <LvInput :bottom-bar="true" placeholder="account ID" label="Insert Account ID" placeholder-color="#0000006B"
        v-model="accountIdRef" :value="accountIdRef" @update:modelValue="updateAccountIdVal()" />

    Starting workDate
    <input type="date" id="refrenceDate" v-model="refrenceDateRef" @change="updateReferenceDate" />
    <LvButton :push="true" :raised="true" :rounded="true" label="Submit" type="button" size="lg" />
</template>



<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import LvInput from 'lightvue/input';
import LvButton from 'lightvue/button';
import { useConfigStore } from '@/stores/state';

export default defineComponent({
    name: "Signup",
    components: { LvInput, LvButton },
    setup() {
        const store = useConfigStore();
        const authTokenRef = ref("");
        const accountIdRef = ref("");
        const refrenceDateRef = ref(store.$state.configObject.referenceDate);
        function updateAccountIdVal() {
            store.setAccountId(accountIdRef.value);
        }
        function updateAuthTokenVal() {
            store.setAuthToken(authTokenRef.value);
        }
        function updateReferenceDate() {
            store.setReferenceDate(refrenceDateRef.value);
        }


        const authTokenValComputed = computed(() => store.configObject?.headers?.Authorization);
        const accountIdComputed = computed(() => store.configObject.headers['Harvest-Account-ID']);
        return {
            authTokenRef,
            accountIdRef,
            refrenceDateRef,
            updateAuthTokenVal,
            updateAccountIdVal,
            updateReferenceDate,
            authTokenValComputed,
            accountIdComputed
        }
    }
})
</script>

