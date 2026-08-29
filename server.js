const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

// เสิร์ฟไฟล์จากโฟลเดอร์ dist ที่เพิ่ง build
app.use(express.static(path.join(__dirname, 'dist')));

const usersDatabase = [];

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), email, password: hashedPassword, createdAt: new Date() };
    usersDatabase.push(newUser);
    res.status(200).json({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดทางเซิร์ฟเวอร์' });
  }
});

app.get('/api/users', (req, res) => {
  res.status(200).json(usersDatabase);
});

// ส่งไฟล์ index.html กลับไปทุกเส้นทางเพื่อให้ React ทำงานต่อได้
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
