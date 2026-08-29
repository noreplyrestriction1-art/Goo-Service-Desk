const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

const usersDatabase = [];

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

// Endpoint ใหม่สำหรับเรียกดูรายการข้อมูลทั้งหมดที่บันทึกไว้
app.get('/api/users', (req, res) => {
  res.status(200).json(usersDatabase);
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on http://127.0.0.1:5000');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
// เพิ่มเส้นทางสำหรับหน้าแรก
app.get('/', (req, res) => {
  res.send('Welcome to Google Support API Server');
});

const path = require('path');

// ให้บริการไฟล์ Static จากโฟลเดอร์โปรเจกต์ (หรือโฟลเดอร์ src)
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
