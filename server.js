const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(cors());

// เชื่อมต่อ MongoDB
mongoose.connect("mongodb+srv://Yeentai1234:taiphak1234@cluster0.slar0cb.mongodb.net/myDatabase?appName=Cluster0");

// เปิดใช้งานให้ Express อ่านไฟล์หน้าบ้านจากโฟลเดอร์ dist
app.use(express.static(path.join(__dirname, 'dist')));

// แก้ไขเครื่องหมาย wildcard สำหรับ Express 5 เป็น '/*'
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
