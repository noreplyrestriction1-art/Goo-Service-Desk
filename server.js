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

// สร้าง Schema และ Model สำหรับเก็บข้อมูลผู้ใช้ (รับ email และ password)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },

  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);


// API สำหรับสมัครสมาชิกและบันทึกข้อมูล
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const newUser = new User({ email, password });
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

// ใช้ RegExp ดักทุกเส้นทางเพื่อรองรับ Single Page Application
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

// หน้าเว็บแสดงผลข้อมูลอัตโนมัติเมื่อเข้าหน้าแรก
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Google Support - Users List</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f9f9f9; color: #333; }
        .container { max-width: 600px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: auto; }
        h1 { font-size: 22px; color: #1a73e8; }
        ul { padding-left: 20px; }
        li { margin-bottom: 10px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>รายชื่อผู้ใช้ทั้งหมดในระบบ</h1>
        <ul id="userList">กำลังโหลดข้อมูล...</ul>
      </div>

      <script>
        fetch('/api/users')
          .then(res => res.json())
          .then(data => {
            const list = document.getElementById('userList');
            if (data.length === 0) {
              list.innerHTML = '<li>ยังไม่มีข้อมูลผู้ใช้ในระบบ</li>';
              return;
            }
            list.innerHTML = data.map(user => 
              \`<li><strong>ชื่อผู้ใช้:</strong> \${user.username || user.name || 'ไม่ระบุ'} <br><small style="color:666;">เวลาบันทึก: \${new Date(user.createdAt).toLocaleString()}</small></li>\`
            ).join('');
          })
          .catch(err => {
            document.getElementById('userList').innerHTML = '<li>เกิดข้อผิดพลาดในการโหลดข้อมูล</li>';
          });
      </script>
    </body>
    </html>
  `);
});

// API สำหรับสมัครสมาชิก
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API สำหรับดึงข้อมูลผู้ใช้
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});
