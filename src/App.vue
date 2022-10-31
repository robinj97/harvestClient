<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView /> -->
  <SignupVue />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import SignupVue from './components/Signup.vue';
</script>
