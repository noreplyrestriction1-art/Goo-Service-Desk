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
        li { margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>สมัครสมาชิก</h1>
        <form id="regForm">
          <input type="text" id="username" placeholder="ชื่อผู้ใช้" required>
          <input type="password" id="password" placeholder="รหัสผ่าน" required>
          <button type="submit">บันทึกข้อมูล</button>
        </form>

        <h1>รายชื่อผู้ใช้ทั้งหมด</h1>
        <ul id="userList">กำลังโหลด...</ul>
      </div>

      <script>
        function loadUsers() {
          fetch('/api/users')
            .then(res => res.json())
            .then(data => {
              const list = document.getElementById('userList');
              if (data.length === 0) {
                list.innerHTML = '<li>ยังไม่มีข้อมูลผู้ใช้ในระบบ</li>';
                return;
              }
              list.innerHTML = data.map(user => 
                \`<li><strong>\${user.username}</strong> <small style="color:#666;">(\${new Date(user.createdAt).toLocaleString()})</small></li>\`
              ).join('');
            });
        }

        document.getElementById('regForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
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
