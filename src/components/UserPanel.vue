<script setup lang="ts">
import service from "@/utils/request.ts";
import {ref, useTemplateRef} from "vue";
import {LockOutlined, UploadOutlined} from '@ant-design/icons-vue'
import {App, type FormInstance} from "ant-design-vue";
import type {Rule} from "ant-design-vue/es/form";
import {useRouter} from "vue-router";

const {message, modal, notification} = App.useApp()
const router = useRouter()

const profileAvatar = ref('')
const profileName = ref('')
const profileEmail = ref('')
const inputRef = useTemplateRef('input')
init()

function init() {
  getProfileName()
      .then(()=>{
        getProfileAvatar()
        getProfileEmail()
      })
}


function getProfileName() {
  return service.get('/profile/name')
      .then(res => profileName.value = res.data)
}



function getProfileEmail() {
  service.get('/profile/email')
      .then(res => profileEmail.value = res.data)
}




function uploadTrigger() {
  inputRef.value?.click()
}
function upload() {
  if (inputRef.value == null || inputRef.value.files == null) return
  if (inputRef.value.files.length == 0) return

  const file = inputRef.value.files[0]

  const form = new FormData()
  form.append('file', file)

  service.post('/profile/avatar', form)
      .then(getProfileAvatar)
}

function getProfileAvatar() {
  service.get('/profile/avatar', {responseType: 'blob'})
      .then((response) => {
        profileAvatar.value = URL.createObjectURL(response.data)
      })
}

const nameModel = ref(false)
const emailModel = ref(false)
const passwordModel = ref(false)
const changeNameValue = ref('')
const changeEmailValue = ref({email: ''})
const changePasswordValue = ref({
  oldPassword: '',
  newPassword: '',
})

function changeName() {
  service.post('/profile/name', {name: changeNameValue.value})
      .then(()=>{
        nameModel.value = false
        getProfileName()
      })
}

function changeEmail() {
  emailFormRef.value?.validate()
      .then(() => {
        service.post('/identity/change/email', changeEmailValue.value)
            .then(()=>{
              emailModel.value = false
              getProfileEmail()
            })
            .catch(error=>message.error(error.response.data))
      })

}

function changePassword() {
  passwordFormRef.value?.validate()
      .then(() => {
        service.post('/identity/change/password', changePasswordValue.value)
            .then(()=>{
              router.push('/login')
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token')
              localStorage.removeItem('route')
            })
            .catch(error=>message.error(error.response.data))
      })

}



const emailFormRef = useTemplateRef<FormInstance>("emailForm")
const passwordFormRef = useTemplateRef<FormInstance>("passwordForm")

const emailRule: Record<string, Rule[]> = {
  email: [
    {required: true, message: "请输入电子邮件地址", type: "email"},
  ]
}
const passwordRule: Record<string, Rule[]> = {
  oldPassword: [
    {required: true, message: "请输入旧密码"},
  ],
  newPassword : [
    {required: true, message: "请输入新密码"},
  ]
}

</script>

<template>
  <a-flex justify="center">
    <a-space class="container" size="large"
             style="display: flex; flex-direction: column; align-items: center;">

      <a-avatar :size="100" :src="profileAvatar"/>

      <a-button @click="uploadTrigger">
        <upload-outlined/>
        上传头像
      </a-button>
      <input type="file" v-show="false" ref="input" @change="upload"/>


      <a-descriptions bordered :column="1" style="width: 720px;">
        <a-descriptions-item label="昵称">
          <a-flex justify="space-between" align="center">
            {{ profileName }}
            <a-button @click="nameModel=true">修改昵称</a-button>
          </a-flex>
        </a-descriptions-item>
        <a-descriptions-item label="电子邮件地址">
          <a-flex justify="space-between" align="center">
            {{ profileEmail }}
            <a-button @click="emailModel=true">修改电子邮件地址</a-button>
          </a-flex>
        </a-descriptions-item>
      </a-descriptions>
      <a-button @click="passwordModel=true">
        <LockOutlined/>
        修改密码
      </a-button>



      <a-modal v-model:open="nameModel" title="修改昵称">
        <template #footer>
          <a-button @click="changeName" type="primary">完成</a-button>
        </template>

            <a-input v-model:value="changeNameValue"/>

      </a-modal>

      <a-modal v-model:open="emailModel" title="修改电子邮件地址">
        <template #footer>
          <a-button @click="changeEmail" type="primary">完成</a-button>
        </template>
        <a-form ref="emailForm" :rules="emailRule" :model="changeEmailValue">
          <a-form-item name="email">
            <a-input v-model:value="changeEmailValue.email"/>
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal v-model:open="passwordModel" title="修改密码">
        <template #footer>
          <a-button key="back" @click="changePassword" type="primary">完成</a-button>
        </template>

        <a-space direction="vertical" style="width: 100%">
          <a-form :model="changePasswordValue" :rules="passwordRule" ref="passwordForm">
            <a-form-item name="oldPassword">
              <a-input-password v-model:value="changePasswordValue.oldPassword" placeholder="旧密码"/>
            </a-form-item>
            <a-form-item name="newPassword">
              <a-input-password v-model:value="changePasswordValue.newPassword" placeholder="新密码"/>
            </a-form-item>
          </a-form>

        </a-space>

      </a-modal>

    </a-space>
  </a-flex>


</template>

<style scoped>

</style>