import axios from 'axios';
// import {useRoute, useRouter} from "vue-router";
import {message} from "ant-design-vue";

import router from "@/router";
// const route = useRoute()

interface Token {
    access_token: string;
    refresh_token: string;
}

const service = axios.create({
    baseURL: 'http://localhost:5000',
})

service.interceptors.request.use(config => {
    // debugger
    const access_token = localStorage.getItem('access_token')
    const refresh_token = localStorage.getItem('refresh_token')
    if (!refresh_token) {
        localStorage.setItem('route', router.currentRoute.value.path)
        message.error("未登录")
        router.push('/login')
        return Promise.reject()
    }

    config.headers.setAuthorization("Bearer " + access_token)
    return config;
})

service.interceptors.response.use(response => response,
        error => {
        const refresh_token = localStorage.getItem('refresh_token')
        if (error.response.status == 401) {
            return axios.post<Token>('http://localhost:5000/identity/refresh', {token: refresh_token})
                .then(response => {
                    localStorage.setItem('access_token', response.data.access_token)
                    localStorage.setItem('refresh_token', response.data.refresh_token)
                    return service(error.config)
                })
                .catch(() => {
                    localStorage.setItem('route', router.currentRoute.value.path)
                    message.error("未登录")
                    router.push('/login')
                    return Promise.reject()
                })
        }
        else{
            return Promise.reject(error)
        }

})

export default service