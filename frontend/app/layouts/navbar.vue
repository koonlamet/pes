<template>
  <div>
    <v-app-bar color="primary" density="compact" elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>ระบบประมวลผล</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" >
        <v-divider></v-divider>
        <v-list-item v-for="m in menu" :key="m.to" :to="m.to" :title="m.text"></v-list-item>

    </v-navigation-drawer>
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </div>
</template>

<script setup>
import { ref } from 'vue'


const drawer = ref(false)
const user = useCookie('user')

const menus = {
  admin:[
    {to:'/admin',text:'หน้าหลัก'},
    {to:'/admin/users',text:'จัดการผู้ใช้'}
  ],
  evaluator:[
    {to:'/evaluator',text:'evaluator'}
  ],
  evaluatee:[
    {to:'/evaluatee',text:'evaluatee'}
  ],
}
const menu = computed (() => menus[user?.value.role] || [])
</script>
