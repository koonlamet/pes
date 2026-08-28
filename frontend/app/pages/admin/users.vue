<template>
    <div>
        <div class="d-flex align-center justify-space-between">
            <h2>#จัดการผู้ใช้งาน</h2>
            <v-btn color="primary" @click="addDialog= !addDialog">+ เพิ่ม</v-btn>
        </div>
        <v-tabs v-model="tab" class="mb-4">
            <v-tab value="admin" @click="roleUser('admin')">งานบุคลากร</v-tab>
            <v-tab value="evaluator" @click="roleUser('evaluator')">กรรมการ</v-tab>
            <v-tab value="evaluatee" @click="roleUser('evaluatee')">ผู้รับการประเมิน</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="admin">
                <v-data-table :items="userRole" :headers="header"></v-data-table>
            </v-tabs-window-item>
            <v-tabs-window-item value="evaluator">
                <v-data-table :items="userRole" :headers="header"></v-data-table>
            </v-tabs-window-item>
            <v-tabs-window-item value="evaluatee" >
                <v-data-table :items="userRole" :headers="header"></v-data-table>
            </v-tabs-window-item>
        </v-tabs-window >

        <v-dialog v-model="addDialog" max-width="480px" width="100%">
            <v-form @submit.prevent="addUser">
            <v-card title="เพิ่มผู้ใช้งาน">
                <v-card-text>
                <v-row dense>
                    <v-col cols="12">
                        <v-text-field v-model=createUser.fname label="Fullname"  type="text" hide-details="auto"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select v-model="createUser.role" :items="item"  label="บทบาท"></v-select>
                    </v-col>
                    <v-divider></v-divider>
                    <v-col cols="12">
                        <v-text-field v-model=createUser.username label="Username"  type="text" hide-details="auto"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model=createUser.password label="Password"  type="password"></v-text-field>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" @click="addDialog= !addDialog">ยกเลิก</v-btn>
                    <v-btn color="green" type="submit">บันทึก</v-btn>
                </v-card-actions>
                </v-card-text>
            </v-card>
            </v-form>
        </v-dialog>
    </div>
</template>
<script setup>
definePageMeta({
    layout:"navbar"
})
import axios from 'axios';
const addDialog = ref(false)
const tab = ref('admin');
const createUser = ref({});
const user = ref([]) , userRole = ref([])
const item = [
    {title:'งานบุคลการ (HR)',value:'admin'},
    {title:'กรรมการ (Evaluator)',value:'evaluator'},
    {title:'ผู้รับการประเมิน (Evaluatee)',value:'evaluatee'}
]

const header = [
    {title:'ชื่อผู้ใช้',key :'fname'},
    {title:'สถานะ',key :'username'},
    {title:'ชื่อ-สกุล',key :'status'},
    {title:'#',key :'action'},
]

const addUser = async ()=>{

    try {
        const res = await axios.post(`http://localhost:3001/api/users`,{...createUser.value});
        addDialog.value = false;
    } catch (error) {
        console.log(error)
    }
}

const loadUser = async () =>{
    try {
        const res = await axios.get(`http://localhost:3001/api/users`);
        user.value = res.data.data;
        roleUser('admin');
    } catch (error) {
        console.log(error)
    }
}

const roleUser = (r)=>{
    const role = r;
    userRole.value = user.value.filter(item => item.role === role)
    console.log(userRole.value)
    
}

onMounted(()=>{
    loadUser();
})
</script>
