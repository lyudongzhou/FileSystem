<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card>
      <v-card-title class="text-h6">用户注册</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <v-text-field v-model="form.username" label="用户名" :rules="[
            v => !!v || '请输入用户名',
            v => /^[a-zA-Z0-9_]{1,20}$/.test(v) || '用户名需为1-20位字母、数字或下划线'
          ]" required></v-text-field>
          <v-text-field v-model="form.password" :type="showPassword ? 'text' : 'password'" label="密码"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" :rules="[
              v => !!v || '请输入密码',
              v => v.length >= 8 || '密码长度需至少8位'
            ]" required></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="closeDialog">取消</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="submit">注册</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { register } from "@/api";

// 定义表单数据的接口
interface RegisterForm {
  username: string
  password: string
}

// 响应式状态
const dialog = ref<boolean>(false)
const valid = ref<boolean>(false)
const showPassword = ref<boolean>(false)
const form = ref<RegisterForm>({
  username: '',
  password: ''
})

// 表单引用
const formRef = ref<InstanceType<typeof VForm> | null>(null)

// 打开对话框
const openDialog = (): void => {
  dialog.value = true
  formRef.value?.reset()
}

// 关闭对话框
const closeDialog = (): void => {
  dialog.value = false
  formRef.value?.reset()
}

// 提交表单
const submit = async (): Promise<void> => {
  const { valid: isValid } = await formRef.value!.validate()
  if (isValid) {
    // 这里添加注册的逻辑，例如调用 API
    const info = await register(form.value.username, form.value.password)
    console.log(info)
    closeDialog()
  }
}

// 暴露方法给父组件
defineExpose({ openDialog })
</script>
