# 📘 Knex.js Cheat Sheet สำหรับคนเขียน SQL / mysql2 เป็นแล้ว

คู่มือฉบับย่อสำหรับการเปลี่ยนผ่านจาก **Raw SQL / mysql2** มาเป็น **Knex.js (SQL Query Builder)** พร้อมตัวอย่างเทียบเคียงคำสั่งต่อคำสั่ง

---

## 🔌 1. การเชื่อมต่อฐานข้อมูล (Database Connection)

```javascript
// db.js
const knex = require('knex');

const db = knex({
  client: 'mysql2', // ใช้ mysql2 เป็น Driver
  connection: {
    host: process.env.DB_HOST || 'mysql_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db',
    port: Number(process.env.DB_PORT) || 3306,
  },
  pool: { min: 2, max: 10 }
});

module.exports = db;
```

---

## 🔍 2. SELECT (การดึงข้อมูล)

| คำสั่ง SQL | Knex.js |
| :--- | :--- |
| `SELECT * FROM user` | `await db('user')` |
| `SELECT id, fname FROM user` | `await db('user').select('id', 'fname')` |
| `SELECT * FROM user WHERE id = 1` | `await db('user').where({ id: 1 })` |
| `SELECT * FROM user WHERE id = 1 LIMIT 1` *(ได้ Object แถวเดียว)* | `await db('user').where({ id: 1 }).first()` |
| `SELECT * FROM user WHERE role = 'admin' AND status = 'active'` | `await db('user').where({ role: 'admin', status: 'active' })` |
| `SELECT * FROM user WHERE age >= 18` | `await db('user').where('age', '>=', 18)` |
| `SELECT * FROM user WHERE role IN ('admin', 'evaluator')` | `await db('user').whereIn('role', ['admin', 'evaluator'])` |
| `SELECT * FROM user WHERE fname LIKE '%สม%'` | `await db('user').whereLike('fname', '%สม%')` |
| `SELECT * FROM user WHERE deleted_at IS NULL` | `await db('user').whereNull('deleted_at')` |
| `SELECT * FROM user ORDER BY id DESC` | `await db('user').orderBy('id', 'desc')` |
| `SELECT * FROM user LIMIT 10 OFFSET 20` *(Pagination)* | `await db('user').limit(10).offset(20)` |

---

## ➕ 3. INSERT (การเพิ่มข้อมูล)

### 🔹 เพิ่ม 1 แถว:
* **SQL:** `INSERT INTO user (username, fname, role) VALUES ('john', 'John Doe', 'evaluator');`
* **Knex:**
```javascript
const [insertId] = await db('user').insert({
  username: 'john',
  fname: 'John Doe',
  role: 'evaluator'
});
console.log('ID ที่เพิ่งสร้าง:', insertId);
```

### 🔹 เพิ่มหลายแถวพร้อมกัน (Bulk Insert):
* **Knex:**
```javascript
await db('user').insert([
  { username: 'user1', fname: 'Name 1' },
  { username: 'user2', fname: 'Name 2' }
]);
```

---

## ✏️ 4. UPDATE (การแก้ไขข้อมูล)

* **SQL:** `UPDATE user SET fname = 'สมชาย', status = 'active' WHERE id = 5;`
* **Knex:**
```javascript
const affectedRows = await db('user')
  .where({ id: 5 })
  .update({
    fname: 'สมชาย',
    status: 'active'
  });
```

---

## 🗑️ 5. DELETE (การลบข้อมูล)

* **SQL:** `DELETE FROM user WHERE id = 5;`
* **Knex:**
```javascript
const affectedRows = await db('user')
  .where({ id: 5 })
  .del(); // หรือ .delete()
```

---

## 🔗 6. JOIN (การเชื่อมตาราง)

### 🔹 INNER JOIN:
* **SQL:**
```sql
SELECT a.id, p.name_th, u.fname 
FROM assignment a
JOIN peroid p ON a.peroid_id = p.id
JOIN user u ON a.evaluator_id = u.id
WHERE a.status = 'pending';
```
* **Knex:**
```javascript
const data = await db('assignment as a')
  .join('peroid as p', 'a.peroid_id', 'p.id')
  .join('user as u', 'a.evaluator_id', 'u.id')
  .where('a.status', 'pending')
  .select('a.id', 'p.name_th as period_name', 'u.fname as evaluator_name');
```

### 🔹 LEFT JOIN:
```javascript
const data = await db('user as u')
  .leftJoin('assignment as a', 'u.id', 'a.evaluator_id')
  .select('u.id', 'u.fname', 'a.id as assignment_id');
```

---

## 📊 7. AGGREGATE (COUNT, SUM, AVG, GROUP BY)

| ความต้องการ | คำสั่ง Knex.js |
| :--- | :--- |
| **นับจำนวนแถว** | `const [{ count }] = await db('user').count('id as count')` |
| **หาค่าเฉลี่ย** | `const [{ avgScore }] = await db('review').avg('score as avgScore')` |
| **หาผลรวม** | `const [{ totalWeight }] = await db('indicator').sum('weight as totalWeight')` |
| **GROUP BY + HAVING** | `await db('evidence').select('indicator_id').avg('self_score as avg_score').groupBy('indicator_id').having('avg_score', '>=', 3.0)` |

---

## ⚡ 8. Dynamic Filter / Search (จุดเด่นที่สุดของ Knex)

เวลาทำระบบค้นหาตาม Query Params ไม่ต้องต่อ String `WHERE 1=1 AND ...` เอง:

```javascript
// GET /api/users?search=สม&role=admin&status=active
app.get('/api/users', async (req, res) => {
  const { search, role, status } = req.query;

  const query = db('user');

  if (search) {
    query.where('fname', 'like', `%${search}%`);
  }
  if (role) {
    query.where({ role });
  }
  if (status) {
    query.where({ status });
  }

  const users = await query.orderBy('id', 'desc');
  res.json({ users });
});
```

---

## 🔒 9. Transaction (งานที่ต้อง Rollback เมื่อมีข้อผิดพลาด)

```javascript
await db.transaction(async (trx) => {
  // 1. เพิ่มตารางหลัก
  const [evidenceId] = await trx('evidence').insert({
    indicator_id: 1,
    evaluator_id: 2,
    evaluatee_id: 3,
    self_score: 4.0
  });

  // 2. เพิ่มตารางลูกโดยใช้ ID จากตารางแรก
  await trx('evidence_file').insert({
    evidence_id: evidenceId,
    file_name: 'report.pdf',
    path: '/uploads/report.pdf'
  });
  
  // หากเกิด error ในบล็อกนี้ Knex จะ rollback ให้ทั้งหมดอัตโนมัติ!
});
```

---

## 🛠️ 10. Raw SQL (เมื่อต้องการเขียน SQL ตรงๆ)

หากมีคำสั่งที่ซับซ้อนมากและต้องการเขียน SQL ดั้งเดิม สามารถใช้ `db.raw()` ได้ตลอดเวลา:

```javascript
// 1. รันคำสั่ง SQL ดั้งเดิมเพียวๆ
const [tables] = await db.raw('SHOW TABLES');

// 2. ผสม Raw SQL เข้าไปใน Query Builder
const users = await db('user')
  .select('id', 'fname')
  .select(db.raw('DATE_FORMAT(created_at, "%d/%m/%Y") as formatted_date'))
  .whereRaw('DATEDIFF(NOW(), created_at) <= ?', [30]);
```

---

## 🚀 11. คำสั่งเฉพาะทางที่ใช้บ่อยในงานจริง (Utility Methods)

| ความต้องการ | คำสั่ง Knex.js | คำสั่ง SQL เทียบเคียง |
| :--- | :--- | :--- |
| **เพิ่มค่าตัวเลข (+1)** | `await db('product').where({ id: 1 }).increment('stock', 1)` | `UPDATE product SET stock = stock + 1 WHERE id = 1` |
| **ลดค่าตัวเลข (-1)** | `await db('product').where({ id: 1 }).decrement('stock', 1)` | `UPDATE product SET stock = stock - 1 WHERE id = 1` |
| **เลือกค่าไม่ซ้ำ (DISTINCT)** | `await db('user').distinct('role')` | `SELECT DISTINCT role FROM user` |
| **ล้างตารางทั้งหมด (TRUNCATE)** | `await db('logs').truncate()` | `TRUNCATE TABLE logs` |
| **เช็คว่ามีข้อมูลหรือไม่ (EXISTS)**| `const exists = await db('user').where({ username }).first()` | `SELECT 1 FROM user WHERE username = ? LIMIT 1` |

---

## 🎯 12. เงื่อนไขขั้นสูง (Advanced WHERE & Subquery)

### 🔹 เงื่อนไข OR WHERE และ วงเล็บกลุ่มเงื่อนไข:
* **SQL:** `SELECT * FROM user WHERE status = 'active' AND (role = 'admin' OR role = 'evaluator');`
* **Knex:**
```javascript
const users = await db('user')
  .where('status', 'active')
  .andWhere(function() {
    this.where('role', 'admin').orWhere('role', 'evaluator');
  });
```

### 🔹 WHERE BETWEEN (ช่วงข้อมูล/วันที่):
* **SQL:** `SELECT * FROM peroid WHERE sdate BETWEEN '2026-01-01' AND '2026-12-31';`
* **Knex:**
```javascript
const periods = await db('peroid')
  .whereBetween('sdate', ['2026-01-01', '2026-12-31']);
```

### 🔹 Subquery (คิวรีย่อย):
* **SQL:** `SELECT * FROM user WHERE id IN (SELECT evaluatee_id FROM assignment);`
* **Knex:**
```javascript
const users = await db('user')
  .whereIn('id', function() {
    this.select('evaluatee_id').from('assignment');
  });
```

---

## 🐞 13. วิธี Debug ดูคำสั่ง SQL ที่ Knex สร้างขึ้นมา

ถ้าผลลัพธ์ไม่ตรง หรืออยากรู้ว่า Knex แปลงเป็น SQL หน้าตาแบบไหน:

```javascript
// วิธีที่ 1: แปลงเป็น SQL String ดูทันที (ยังไม่ยิงไปที่ Database)
const query = db('user').where({ role: 'admin' }).select('id', 'fname');
console.log(query.toSQL().sql);      // ได้ string: select `id`, `fname` from `user` where `role` = ?
console.log(query.toSQL().bindings); // ได้ค่าตัวแปร: ['admin']

// วิธีที่ 2: ดักจับและพิมพ์ทุก Query ที่ถูกรันบนเซิร์ฟเวอร์
db.on('query', (queryData) => {
  console.log('⚡ SQL EXECUTING:', queryData.sql);
  console.log('📦 BINDINGS:', queryData.bindings);
});
```

---

## 💡 14. สรุปตารางเทียบความรู้สึกในการเขียน

| งาน | mysql2 | Knex.js |
| :--- | :--- | :--- |
| **คืนค่ากลับมา** | `const [rows, fields] = await ...` | `const rows = await ...` (เป็น Array ใช้ง่ายทันที) |
| **ดึง 1 รายการ** | `rows[0]` | `.first()` |
| **เพิ่มข้อมูล** | ใส่เครื่องหมาย `?` ตามจำนวน field | ใส่ Object `{ field: value }` ได้เลย |
| **แก้ไขข้อมูล** | `UPDATE table SET a=?, b=? WHERE id=?` | `.where({ id }).update({ a, b })` |
| **ความปลอดภัย** | ต้องใส่ `[param1, param2]` ให้ครบ | ป้องกัน SQL Injection อัตโนมัติในตัว |
