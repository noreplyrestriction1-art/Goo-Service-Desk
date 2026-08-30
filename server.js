const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Google Support - Register & Users</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f9f9f9; color: #333; }
        .container { max-width: 500px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: auto; }
        h1 { font-size: 20px; color: #1a73e8; }
        input { width: 100%; padding: 8px; margin: 8px 0; box-sizing: border-box; }
        button { background: #1a73e8; color: white; border: none; padding: 10px; width: 100%; border-radius: 4px; cursor: pointer; }
        ul { padding-left: 20px; margin-top: 20px; }
        li { margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>เพิ่มข้อมูลผู้ใช้</h1>
        <form id="regForm">
          <input type="text" id="name" placeholder="ชื่อ-นามสกุล" required>
          <input type="email" id="email" placeholder="อีเมล" required>
          <button type="submit">บันทึกข้อมูล</button>
        </form>

        <h1>รายชื่อผู้ใช้ทั้งหมด</h1>
        <ul id="userList">กำลังโหลด...</ul>
      </div>

      <script>
        async function loadUsers() {
          try {
            const res = await fetch('/api/users');
            const data = await res.json();
            const list = document.getElementById('userList');
            if (data.length === 0) {
              list.innerHTML = '<li>ยังไม่มีข้อมูลผู้ใช้ในระบบ</li>';
              return;
            }
            list.innerHTML = data.map(user => 
              '<li><strong>' + user.name + '</strong> (' + user.email + ') <br><small style="color:#666;">' + new Date(user.createdAt).toLocaleString() + '</small></li>'
            ).join('');
          } catch (err) {
            document.getElementById('userList').innerHTML = '<li>เกิดข้อผิดพลาดในการโหลดข้อมูล</li>';
          }
        }

        document.getElementById('regForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;

          const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
          });

          if (res.ok) {
            alert('บันทึกสำเร็จ!');
            document.getElementById('regForm').reset();
            loadUsers();
          } else {
            alert('เกิดข้อผิดพลาด');
          }
        });

        loadUsers();
      </script>
    </body>
    </html>
  `);
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
