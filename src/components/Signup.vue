<template>
    <LvInput :bottom-bar="true" placeholder="auth token" help-text="the long authentication token"
        label="Insert Auth Token" placeholder-color="#0000006B" v-model="authTokenRef" :value="authTokenRef"
        @update:modelValue="updateAuthTokenVal()" />

    <LvInput :bottom-bar="true" placeholder="account ID" help-text="Your Account ID" label="Insert Account ID"
        placeholder-color="#0000006B" v-model="accountIdRef" :value="accountIdRef"
        @update:modelValue="updateAccountIdVal()" />
</template>



<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import LvInput from 'lightvue/input';
import { useConfigStore } from '@/stores/state';

export default defineComponent({
    name: "Signup",
    components: { LvInput },
    setup() {
        const store = useConfigStore();
        const authTokenRef = ref("");
        const accountIdRef = ref("");

        function updateAccountIdVal() {
            store.setAccountId(accountIdRef.value);
        }
        function updateAuthTokenVal() {
            store.setAuthToken(authTokenRef.value);
        }


        const authTokenValComputed = computed(() => store.configObject.authToken);
        return {
            authTokenRef,
            accountIdRef,
            updateAuthTokenVal,
            updateAccountIdVal,
            authTokenValComputed
        }
    }
})
</script>

