<template>
    <v-container class="d-flex align-center justify-center fill-height">
            <v-form @submit.prevent="login" class="w-100 d-flex justify-center">
                <v-card max-width="450px" width="100%" title="เข้าสู่ระบบ" class="pa-4 text-center">
                        <v-text-field v-model="user.username" type="text" label="Username"></v-text-field>
                        <v-text-field v-model="user.password" type="password" label="Password"></v-text-field>
                <v-btn color="primary" block  type="submit">เข้าสู่ระบบ</v-btn>
                <v-btn to="/register" variant="text" class="ma-2">สมัครสมาชิก</v-btn>
                </v-card>
            </v-form>
    </v-container>

</template>

<script setup>
import axios from 'axios';

const user = ref({});
const roleRoute = {
    admin:'/admin',
    evaluator:'/evaluator',
    evaluatee:'/evaluatee'
}
const login = async ()=>{
    try {
        const res = await axios.post('http://localhost:3001/api/login',{
            username:user.value.username,
            password:user.value.password
        })
        useCookie('token').value = res.data.token;
        useCookie('user').value = res.data.data;
        await navigateTo(roleRoute[res.data.data.role])
    } catch (error) {
        console.log(error)
    }
}




</script>

