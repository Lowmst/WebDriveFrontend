<script setup lang="ts">
import { MailOutlined, LockOutlined } from '@ant-design/icons-vue'
import {ref, useTemplateRef} from "vue"
import type {Rule} from "ant-design-vue/es/form";
import {type FormInstance, App} from 'ant-design-vue'
import axios from 'axios'
import {useRouter} from "vue-router";

const formRef = useTemplateRef<FormInstance>("form")
const { message, modal, notification } = App.useApp()
const router = useRouter()

const user = ref({
  email: "",
  password: "",
  confirmPassword: "",
})

const validatePass = async (_rule: Rule, value: string) => {
  if (user.value.confirmPassword != '') formRef.value?.validateFields('confirmPassword')
  return Promise.resolve()
}

const validateConfirmPass = async (_rule: Rule, value: string) => {
  if (value != user.value.password) return Promise.reject("两次输入不一致")
  return Promise.resolve()
}

const rules: Record<string, Rule[]> = {
  email: [
    { required: true, message: "请输入电子邮件地址", type: "email"},
  ],
  password: [
    { required: true, message: "请输入密码" },
    { validator: validatePass }
  ],
  confirmPassword: [
    { validator: validateConfirmPass },
  ]
}

function onSubmit() {
  formRef.value?.validate().then(() => {
    register(user.value.email, user.value.password)
  })
}

function register(email: string, password: string) {
  axios.post('http://localhost:5000/identity/register', {email:email, password:password})
      .then(() => {
        message.success('注册成功')
        router.push("/login")
      })
      .catch((error) => {message.error(error.response.data)})
}

</script>

<template>
  <div style="width: 328px">
    <h1>注册</h1>

    <a-form :rules="rules" :model="user" ref="form">
      <a-form-item name="email">
        <a-input size="large" placeholder="电子邮件地址" v-model:value="user.email" >
          <template #prefix>
            <MailOutlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="password">
        <a-input-password size="large" placeholder="密码" v-model:value="user.password">
          <template #prefix>
            <LockOutlined />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="confirmPassword">
        <a-input-password size="large" placeholder="确认密码" v-model:value="user.confirmPassword">
          <template #prefix>
            <LockOutlined />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" size="large" block @click="onSubmit">注册</a-button>
      </a-form-item>
    </a-form>
    <router-link to="/login">使用已有账户登录</router-link>
  </div>
</template>

<style scoped>

</style>