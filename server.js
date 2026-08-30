const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// เชื่อมต่อ MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// สร้าง Schema และ Model สำหรับเก็บข้อมูลผู้ใช้
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// API สำหรับสมัครสมาชิก
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
});

// API สำหรับดูรายชื่อผู้ใช้ทั้งหมด
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
});

// ตั้งค่าให้ Express เสิร์ฟไฟล์หน้าบ้านจากโฟลเดอร์ build ของ Vite (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// แก้ไขเส้นทาง catch-all เป็น '/*' เพื่อรองรับ Express เวอร์ชั่นล่าสุด
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
