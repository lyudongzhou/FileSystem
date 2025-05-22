<template>
  <v-app>
    <!-- 背景容器 -->
    <v-main class="background">
      <v-container class="d-flex justify-center align-center" fluid style="min-height: 100vh">
        <!-- 登录卡片 -->
        <v-card class="pa-6" elevation="8" max-width="400" rounded="lg" width="100%">
          <v-card-title class="text-h5 font-weight-bold text-center">
            欢迎登录
          </v-card-title>
          <v-card-subtitle class="text-center mt-2">
            请填写您的用户名和密码
          </v-card-subtitle>

          <!-- 表单 -->
          <v-form class="mt-6" @submit.prevent="handleLogin">
            <!-- 邮箱输入框 -->
            <v-text-field v-model="form.username" class="mb-4" label="用户名" prepend-inner-icon="mdi-account" required
              variant="outlined" />

            <!-- 密码输入框 -->
            <v-text-field v-model="form.password" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              class="mb-4" label="密码" prepend-inner-icon="mdi-lock" required :type="showPassword ? 'text' : 'password'"
              variant="outlined" @click:append-inner="showPassword = !showPassword" />

            <!-- 登录按钮 -->
            <v-btn block color="primary" :disabled="isDisabled" :loading="loading" size="large" type="submit">
              登录
            </v-btn>
            <div class="text-center mt-4"></div>
            <v-btn block color="secondary" size="large" @click="handleRegistor">
              注册
            </v-btn>
          </v-form>
        </v-card>
      </v-container>
    </v-main>
    <registerDialog ref="refRegisterDialog"></registerDialog>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { login, register } from "@/api";
import { useAppStore } from "@/stores/app";
import router from "@/router"
import registerDialog from "@/components/register.vue";
const refRegisterDialog = ref<InstanceType<typeof registerDialog>>()
const store = useAppStore();
// 表单数据
const form = ref({
  username: "",
  password: "",
});
const showPassword = ref(false);
const loading = ref(false);

// 模拟登录
const handleLogin = async () => {
  loading.value = true;
  try {
    const data = await login(form.value.username, form.value.password);
    store.setUser(form.value.username, data.data.access_token);
    router.push('/');
  } catch (error) {
    store.addQueue({
      text: "用户名或密码错误！",
      color: 'error',
    });
  } finally {
    loading.value = false;
  }

  // 模拟 API 调用

  // 重定向到仪表盘（根据实际路由配置）
  // router.push('/dashboard');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars



};
const handleRegistor = async () => {
  refRegisterDialog.value?.openDialog()
  // await register(form.value.username, form.value.password);
}
const isDisabled = computed(() => !form.value.username || !form.value.password);
</script>

<style scoped>
/* 渐变背景 */
.background {
  background: linear-gradient(135deg, #42a5f5, red);
  transition: background 0.3s ease;
}

/* 暗黑模式背景 */
:deep(.v-application--is-dark) .background {
  background: linear-gradient(135deg, #424242, #212121);
}

/* 卡片动画 */
.v-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}
</style>
