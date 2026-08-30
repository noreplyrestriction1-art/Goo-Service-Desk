const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// เสิร์ฟไฟล์ Static จากโฟลเดอร์ dist
app.use(express.static(path.join(__dirname, 'dist')));

// เส้นทางสำรองสำหรับ React Router / SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
