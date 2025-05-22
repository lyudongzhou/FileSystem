<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card>
      <v-card-title class="text-h6">修改密码</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <v-text-field v-model="form.newPassword" :type="showNewPassword ? 'text' : 'password'" label="新密码"
            :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showNewPassword = !showNewPassword" :rules="[
              v => !!v || '请输入新密码',
              v => v.length >= 8 || '密码长度需至少8位'
            ]" required></v-text-field>
          <v-text-field v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" label="确认新密码"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showConfirmPassword = !showConfirmPassword" :rules="[
              v => !!v || '请确认新密码',
              v => v === form.newPassword || '两次输入的密码不一致'
            ]" required></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="closeDialog">取消</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="submit">提交</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { changePassword } from "@/api"
// 定义表单数据的接口
interface PasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// 响应式状态
const dialog = ref<boolean>(false)
const valid = ref<boolean>(false)
const showNewPassword = ref<boolean>(false)
const showConfirmPassword = ref<boolean>(false)
const form = ref<PasswordForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
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
    await changePassword({
      newPassword: form.value.newPassword
    })
    // 这里添加提交密码修改的逻辑，例如调用 API
    closeDialog()
  }
}

// 暴露方法给父组件
defineExpose({ openDialog })
</script>
