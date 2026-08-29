const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

// ให้บริการไฟล์ Static (เช่น ไฟล์ HTML, CSS, รูปภาพ ในโฟลเดอร์เดียวกัน)
app.use(express.static(path.join(__dirname)));

const usersDatabase = [];

// หน้าแรกสุด ให้แสดงไฟล์ index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint สำหรับรับบันทึกข้อมูล
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      email: email,
      password: hashedPassword,
      createdAt: new Date()
    };

    usersDatabase.push(newUser);
    console.log('บันทึกสำเร็จ:', newUser);

    res.status(200).json({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดทางเซิร์ฟเวอร์' });
  }
});

// Endpoint สำหรับเรียกดูรายการข้อมูลทั้งหมดที่บันทึกไว้
app.get('/api/users', (req, res) => {
  res.status(200).json(usersDatabase);
});

// ใช้พอร์ตจาก Render (process.env.PORT) และสำรองไว้ที่ 5000 กรณีรันในเครื่อง
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
