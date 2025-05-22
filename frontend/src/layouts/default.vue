<template>
  <v-app>
    <v-app-bar v-if="!isLogin" app color="primary" dark>
      <v-toolbar-title>产品原型管理系统</v-toolbar-title>
      <v-spacer />
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" text>
            <v-icon left>mdi-account</v-icon>
            {{ username }}
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="changePassword">
            <v-list-item-title>修改密码</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>退出登录</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <changpassword ref="changePasswordDialog"></changpassword>
    <v-main>
      <router-view />
      <v-snackbar-queue v-model="messages.queue" />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/stores/app";
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";
import changpassword from "@/components/changpassword.vue";
const changePasswordDialog = ref<InstanceType<typeof changpassword>>();
const messages = useAppStore();
const router = useRouter();
const username = computed(() => messages.user || "未登录");
const route = useRoute();
const isLogin = computed(() => route.path === "/login");
function logout() {
  messages.logout(); // 你需要在 store 里实现这个方法
  router.push("/login");
}
function changePassword() {
  changePasswordDialog?.value?.openDialog()
}
</script>
