import { createRouter, createWebHistory } from 'vue-router'
import LoginPanel from "@/components/LoginPanel.vue";
import IdentityView from "@/views/IdentityView.vue";
import RegisterPanel from "@/components/RegisterPanel.vue";
import HomeView from "@/views/HomeView.vue";
import UserPanel from "@/components/UserPanel.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import TestView from "@/views/TestView.vue";

const routes = [
  {
    path: "/identity",
    component: IdentityView,
    children: [
      { path: "login", component: LoginPanel, alias: "/login" },
      { path: "register", component: RegisterPanel, alias: "/register" },
      { path: "user", component: UserPanel, alias: "/user" },
    ]
  },
  {
    path: "/",
    component: HomeView
  },
  {
    path: "/user",
    component: UserPanel
  },
  {
    path: '/test',
    component: TestView
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundView
  }
  // {
  //   path: '/login',
  //   component: IdentityView,
  //   children: [
  //     { path: '', component: LoginPanel },
  //   ]
  // },
  // {
  //   path: '/register',
  //   component: IdentityView,
  //   children: [
  //       { path: '', component: RegisterPanel },
  //   ]
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
