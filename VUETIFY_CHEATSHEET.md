# 🎨 Vuetify 3 Cheat Sheet & รวม Component ที่ใช้บ่อย

คู่มือรวม Component และ Utility Classes ของ **Vuetify 3** สำหรับพัฒนาโปรเจกต์ Nuxt / Vue พร้อมตัวอย่างโค้ดที่สามารถ Copy ไปใช้งานได้ทันที

---

## 📑 สารบัญ
1. [Layout & Grid System](#1-layout--grid-system)
2. [Card & Button](#2-card--button)
3. [Form & Inputs](#3-form--inputs)
4. [Table & List](#4-table--list)
5. [Dialog, Alert & Feedback](#5-dialog-alert--feedback)
6. [Utility Classes (ระยะห่าง, Flex, ตัวอักษร)](#6-utility-classes-ที่ใช้บ่อย)
7. [ตัวอย่าง Template หน้า CRUD แบบสมบูรณ์](#7-ตัวอย่าง-template-หน้า-crud-พร้อมใช้งาน)

---

## 1. Layout & Grid System

### 🔹 `<v-container>`, `<v-row>`, `<v-col>`
ระบบ 12 Grid สำหรับจัดเลย์เอาต์ตามขนาดหน้าจอ (`cols`, `sm`, `md`, `lg`):

```vue
<template>
  <v-container>
    <v-row>
      <!-- หน้าจอมือถือเต็ม 12 ช่อง / หน้าจอคอมแบ่งครึ่ง 6 ช่อง -->
      <v-col cols="12" md="6">
        <div>คอลัมน์ซ้าย</div>
      </v-col>
      
      <v-col cols="12" md="6">
        <div>คอลัมน์ขวา</div>
      </v-col>
    </v-row>
  </v-container>
</template>
```

---

## 2. Card & Button

### 🔹 `<v-card>` (การ์ดแสดงเนื้อหา)
```vue
<v-card elevation="3" rounded="lg" class="pa-4">
  <v-card-item>
    <v-card-title class="text-h6 font-weight-bold">ชื่อสินค้า</v-card-title>
    <v-card-subtitle>หมวดหมู่สินค้า</v-card-subtitle>
  </v-card-item>

  <v-card-text>
    เนื้อหาหรือรายละเอียดสินค้า...
  </v-card-text>

  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn color="primary" variant="elevated" prepend-icon="mdi-cart">สั่งซื้อ</v-btn>
  </v-card-actions>
</v-card>
```

### 🔹 `<v-btn>` (ปุ่มกด)
```vue
<!-- ปุ่มแบบต่างๆ -->
<v-btn color="primary" variant="elevated">ปุ่มทึบ (Elevated)</v-btn>
<v-btn color="secondary" variant="outlined">ปุ่มเส้นขอบ (Outlined)</v-btn>
<v-btn color="error" variant="text">ปุ่มข้อความ (Text)</v-btn>

<!-- ปุ่มพร้อมไอคอน -->
<v-btn color="success" prepend-icon="mdi-plus">เพิ่มข้อมูล</v-btn>
<v-btn color="error" icon="mdi-delete" size="small"></v-btn>
```

---

## 3. Form & Inputs

### 🔹 Input Form พื้นฐาน (Text, Select, Switch, Textarea)
```vue
<v-form @submit.prevent="handleSubmit">
  <!-- ช่องกรอกข้อความทั่วไป -->
  <v-text-field
    v-model="form.name"
    label="ชื่อ-นามสกุล"
    variant="outlined"
    density="compact"
    prepend-inner-icon="mdi-account"
    :rules="[v => !!v || 'กรุณากรอกชื่อ']"
  />

  <!-- ช่องกรอกรหัสผ่าน -->
  <v-text-field
    v-model="form.password"
    label="รหัสผ่าน"
    type="password"
    variant="outlined"
    density="compact"
    prepend-inner-icon="mdi-lock"
  />

  <!-- Dropdown เลือกตัวเลือก -->
  <v-select
    v-model="form.role"
    label="สิทธิ์การใช้งาน"
    :items="['Admin', 'User', 'Editor']"
    variant="outlined"
    density="compact"
  />

  <!-- ช่องกรอกข้อความยาวหลายบรรทัด -->
  <v-textarea
    v-model="form.detail"
    label="รายละเอียดเพิ่มเติม"
    variant="outlined"
    rows="3"
  />

  <!-- สวิตช์ และ Checkbox -->
  <v-switch v-model="form.isActive" color="success" label="เปิดใช้งานสถานะ"></v-switch>
  <v-checkbox v-model="form.acceptTerms" label="ยอมรับเงื่อนไข"></v-checkbox>

  <v-btn type="submit" color="primary" block class="mt-3">บันทึกข้อมูล</v-btn>
</v-form>
```

---

## 4. Table & List

### 🔹 `<v-table>` (ตาราง HTML แบบ Simple)
```vue
<v-table hover density="comfortable">
  <thead>
    <tr>
      <th class="text-left">#</th>
      <th class="text-left">ชื่อสินค้า</th>
      <th class="text-left">ราคา</th>
      <th class="text-center">จัดการ</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in items" :key="item.id">
      <td>{{ index + 1 }}</td>
      <td>{{ item.item_name }}</td>
      <td>{{ item.item_price.toLocaleString() }} บาท</td>
      <td class="text-center">
        <v-btn icon="mdi-pencil" size="x-small" color="primary" class="mr-2"></v-btn>
        <v-btn icon="mdi-delete" size="x-small" color="error"></v-btn>
      </td>
    </tr>
  </tbody>
</v-table>
```

### 🔹 `<v-chip>` (ป้ายสถานะ / Badge)
```vue
<v-chip color="success" size="small" label>ใช้งานอยู่</v-chip>
<v-chip color="error" size="small" label>ปิดใช้งาน</v-chip>
<v-chip color="warning" size="small" label>รอดำเนินการ</v-chip>
```

---

## 5. Dialog, Alert & Feedback

### 🔹 `<v-dialog>` (Modal Popup ยืนยัน/กรอกฟอร์ม)
```vue
<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">ยืนยันการลบข้อมูล?</v-card-title>
      <v-card-text>คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้ ข้อมูลจะไม่สามารถกู้คืนได้</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialog = false">ยกเลิก</v-btn>
        <v-btn color="error" variant="elevated" @click="handleDelete">ยืนยันลบ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
const dialog = ref(false)
const handleDelete = () => {
  // Logic การลบ
  dialog.value = false
}
</script>
```

### 🔹 `<v-snackbar>` (Toast แจ้งเตือนสั้นๆ แล้วหายไป)
```vue
<template>
  <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000" location="top right">
    {{ snackText }}
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue'
const snackbar = ref(false)
const snackText = ref('')
const snackColor = ref('success')

// ฟังก์ชันเรียกแสดงแจ้งเตือน
const showToast = (text, color = 'success') => {
  snackText.value = text
  snackColor.value = color
  snackbar.value = true
}
</script>
```

### 🔹 `<v-alert>` (กล่องข้อความแจ้งเตือน)
```vue
<v-alert type="success" title="สำเร็จ" text="บันทึกข้อมูลเรียบร้อยแล้ว" variant="tonal" class="mb-4" />
<v-alert type="error" title="เกิดข้อผิดพลาด" text="ไม่สามารถเชื่อมต่อฐานข้อมูลได้" variant="tonal" class="mb-4" />
```

---

## 6. Utility Classes ที่ใช้บ่อย

### 📐 Spacing (Padding & Margin)
* **Padding:** `pa-4` (รอบด้าน), `px-4` (ซ้าย-ขวา), `py-2` (บน-ล่าง), `pt-2`, `pb-2`, `pl-2`, `pr-2` (สเกล `0` ถึง `16`)
* **Margin:** `ma-4` (รอบด้าน), `mx-auto` (กึ่งกลาง), `my-3`, `mt-4`, `mb-2`, `mr-2`, `ml-2`
* **Gap (ช่องว่าง Flex):** `ga-2`, `ga-4`

### 🔀 Flexbox & Alignment
* **Display:** `d-flex`, `d-block`, `d-none`
* **แกน X (Justify):** `justify-center`, `justify-space-between`, `justify-end`, `justify-start`
* **แกน Y (Align):** `align-center`, `align-start`, `align-end`

### 🔤 Typography & Text
* **ขนาดหัวข้อ:** `text-h4`, `text-h5`, `text-h6`, `text-body-1`, `text-caption`
* **น้ำหนักตัวอักษร:** `font-weight-bold`, `font-weight-medium`, `font-weight-light`
* **การจัดตำแหน่ง:** `text-center`, `text-left`, `text-right`
* **สีข้อความ:** `text-primary`, `text-error`, `text-grey`, `text-white`

---

## 7. ตัวอย่าง Template หน้า CRUD พร้อมใช้งาน

```vue
<template>
  <v-container class="py-6">
    <!-- Header -->
    <v-row class="mb-4" align="center" justify="space-between">
      <v-col cols="auto">
        <h1 class="text-h5 font-weight-bold">📦 รายการสินค้า</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
          เพิ่มสินค้าใหม่
        </v-btn>
      </v-col>
    </v-row>

    <!-- Data Table Card -->
    <v-card elevation="2" rounded="lg">
      <v-table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อสินค้า</th>
            <th>ราคา</th>
            <th>จำนวน</th>
            <th class="text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in products" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.item_name }}</td>
            <td>{{ item.item_price }} บาท</td>
            <td>
              <v-chip :color="item.item_qty > 0 ? 'success' : 'error'" size="small" label>
                {{ item.item_qty > 0 ? `${item.item_qty} ชิ้น` : 'สินค้าหมด' }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" class="mr-1"></v-btn>
              <v-btn icon="mdi-delete" size="small" variant="text" color="error"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Dialog Form Modal -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card rounded="lg">
        <v-card-title class="pa-4 bg-primary text-white">เพิ่มสินค้าใหม่</v-card-title>
        <v-card-text class="pt-4">
          <v-text-field label="ชื่อสินค้า" variant="outlined" density="compact" class="mb-2" />
          <v-text-field label="ราคา" type="number" variant="outlined" density="compact" class="mb-2" />
          <v-text-field label="จำนวน" type="number" variant="outlined" density="compact" />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">ยกเลิก</v-btn>
          <v-btn color="primary" variant="elevated" @click="dialog = false">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)
const products = ref([
  { id: 1, item_name: 'รองเท้า NIKE', item_price: 2000, item_qty: 10 },
  { id: 2, item_name: 'หมวก PUMA', item_price: 900, item_qty: 0 },
])
</script>
