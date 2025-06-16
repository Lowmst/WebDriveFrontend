<script setup lang="ts">
import {MailOutlined, LockOutlined} from '@ant-design/icons-vue'
import axios from 'axios'
import {ref, useTemplateRef} from "vue";
import type {Rule} from "ant-design-vue/es/form";
import {App, type FormInstance} from "ant-design-vue";
import {useRouter} from "vue-router";


const formRef = useTemplateRef<FormInstance>("form")
const {message, modal, notification} = App.useApp()
const router = useRouter()


interface Token {
  access_token: string
  refresh_token: string
}

const user = ref({
  email: '',
  password: ''
})

const rules: Record<string, Rule[]> = {
  email: [
    {required: true, message: "请输入电子邮件地址", type: "email"},
  ],
  password: [
    {required: true, message: "请输入密码"},
  ]
}

function onSubmit() {
  formRef.value?.validate().then(() => login())
}


function login() {
  axios.post<Token>('http://localhost:5000/identity/login', user.value)
      .then((response) => {
        // message.success(JSON.stringify(response.data))
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)
        router.push(localStorage.getItem('route') == null ? '/' : localStorage.getItem('route')!)
      })
      .catch((error) => message.error(error.response.data))
}
</script>

<template>

  <div style="width: 328px">
    <h1>登录</h1>
    <a-form :model="user" :rules="rules" ref="form">
      <a-form-item name="email">
        <a-input size="large" placeholder="电子邮件地址" v-model:value="user.email">
          <template #prefix>
            <MailOutlined/>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="password">
        <a-input-password size="large" placeholder="密码" v-model:value="user.password">
          <template #prefix>
            <LockOutlined/>
          </template>
        </a-input-password>
      </a-form-item>
<!--      <a-form-item style="text-align: right">-->
<!--        <a>忘记密码 ?</a>-->
<!--      </a-form-item>-->

      <a-form-item>
        <a-button type="primary" size="large" block @click="onSubmit">登录</a-button>
      </a-form-item>

    </a-form>
    <div style="text-align: right">
      <router-link to="/register">注册</router-link>
    </div>

  </div>
</template>

<style scoped>

</style>