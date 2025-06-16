<script setup lang="ts">
import {ref, useTemplateRef} from "vue";
import {useRouter} from "vue-router";
import {App} from "ant-design-vue";
import service from "@/utils/request.ts";
import {LogoutOutlined, DownloadOutlined, UploadOutlined, DeleteOutlined} from '@ant-design/icons-vue'

const {message, modal, notification} = App.useApp()
const router = useRouter()

const profileAvatar = ref('')
const profileName = ref('')
const deleteModal = ref(false)
const fileList = ref<Storage[]>()
const inputRef = useTemplateRef("input")

init()

function init() {
  getProfileName().then(() => {
    getProfileAvatar()
    getFileList()
  })

}

function getProfileName() {
  return service.get('/profile/name')
      .then(res => profileName.value = res.data)
      .catch(error => Promise.reject(error))
}


function getProfileAvatar() {
  service.get('/profile/avatar', {responseType: 'blob'})
      .then((response) => {
        profileAvatar.value = URL.createObjectURL(response.data)
      })
      .catch(error => Promise.reject(error))
}

function logout() {
  service.get('/identity/logout')
      .then(() => {
        router.push('/login')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('route')
      })
}

const time = ref('')
const now = new Date()
if (now.getHours() >= 6 && now.getHours() <= 12) time.value = '上午'
else if (now.getHours() > 12 && now.getHours() <= 18) time.value = '下午'
else time.value = '晚上'

interface Storage {
  id: string,
  user: string,
  name: string,
  size: number
}

function getFileList() {
  service.get<Storage[]>('/storage/list')
      .then((response) => {
        fileList.value = response.data
      })
      .catch(error => Promise.reject(error))
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
  message.loading("上传中", 0)
  service.post('/storage', form)
      .then(getFileList)
      .finally(message.destroy)
}

function download(id: string, name: string) {
  service.get(`/storage/${id}`, {responseType: 'blob'})
      .then((response) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(response.data);
        link.download = name;
        link.click();
      })
}

function deleteFile(id: string) {
  message.loading("删除中", 0)
  deleteModal.value = false
  service.delete(`/storage/${id}`)
      .then(getFileList)
      .finally(message.destroy)
}
const deletingFile = ref<Storage>({
  id: "",
  user: "",
  name: "",
  size: 0
})
function showDeleteModal(file: Storage) {
  deleteModal.value = true
  deletingFile.value = file
}
</script>

<template>

  <a-layout class="layout">
    <a-layout-header class="header">
      <a-dropdown placement="bottom">
        <div class="avatar-panel" @click="router.push('/user')">
          <a-avatar size="large" :src="profileAvatar"/>
          <span style="width: 12px"/>
          {{ profileName }}
        </div>

        <template #overlay>
          <a-menu>
            <a-menu-item @click="logout">
              <template #icon>
                <logout-outlined/>
              </template>
              退出登录
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-layout-header>

    <a-layout-content class="content">
      <a-space direction="vertical" style="width: 720px;  margin: 64px">
        <div style="display: flex; justify-content: space-between">
          <h1>{{ time }}好，{{ profileName }}</h1>
          <a-tooltip>
            <template #title>
              大小限制（<1GB）
            </template>
            <a-button type="primary" @click="uploadTrigger">
              <template #icon>
                <upload-outlined/>
              </template>
              上传
            </a-button>
          </a-tooltip>
          <input type="file" v-show="false" ref="input" @change="upload"/>
        </div>
        <a-list bordered style="background-color: white">
          <a-list-item v-for="file in fileList">
            <a-list-item-meta>
              <template #title>
                <a-flex justify="space-between" align="center">
                  {{ file.name }}
                  <a-space>
                    <a-button @click="download(file.id, file.name)">
                      <template #icon>
                        <DownloadOutlined/>
                      </template>
                      下载
                    </a-button>

                  </a-space>

                </a-flex>
              </template>
              <template #description>
                <a-flex justify="space-between" align="center">
                  <div>{{ file.id }}</div>
                  <a-space>
                    <div>{{ (file.size / (1024 * 1024)).toFixed(2) }} MB</div>
                    <a-button danger type="link" @click="showDeleteModal(file)">
                      <template #icon>
                        <DeleteOutlined/>
                      </template>
                      删除
                    </a-button>
                    <a-modal v-model:open="deleteModal" title="确认删除">
                      <h2>{{ deletingFile.name }}</h2><br/>
                      <a-typography-text type="secondary">{{ deletingFile.id }}</a-typography-text>
                      <template #footer>
                        <a-button @click="deleteModal=false">取消</a-button>
                        <a-button danger type="primary" @click="deleteFile(deletingFile.id)">确认</a-button>
                      </template>
                    </a-modal>
                  </a-space>
                </a-flex>

              </template>
            </a-list-item-meta>
          </a-list-item>
        </a-list>

      </a-space>
    </a-layout-content>

  </a-layout>

</template>

<style scoped>

.header {
  position: fixed;
  z-index: 1;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
}

.content {
  background-attachment: fixed;
  background-image: url("../assets/identitybg.png");
  background-size: 100% 100%;

  position: fixed;
  height: 100vh;
  width: 100%;
  overflow-y: auto;

  padding-top: 64px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-panel {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 4px 15px;
  height: 48px;

  transition: all 0.2s cubic-bezier(0.65, 0.05, 0.36, 1);
  border-radius: 6px;

  cursor: pointer;
}

.avatar-panel:hover {
  background-color: #f0f0f0
}

</style>