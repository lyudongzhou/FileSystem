<template>
  <v-main>
    <router-view />
    <v-snackbar-queue v-model="messages.queue"></v-snackbar-queue>
  </v-main>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/stores/app";
const messages = useAppStore();
</script>
