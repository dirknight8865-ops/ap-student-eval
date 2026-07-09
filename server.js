const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'students.json');

// 确保 data 目录存在
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 读取数据
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch(e) { console.error('Load error:', e.message); }
  return {};
}

// 保存数据
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// API: 获取所有学生数据
app.get('/api/data', (req, res) => {
  res.json(loadData());
});

// API: 保存所有学生数据
app.post('/api/data', (req, res) => {
  const data = req.body;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  saveData(data);
  res.json({ success: true, count: Object.keys(data).length });
});

// 首页重定向到 search
app.get('/', (req, res) => {
  res.redirect('/search.html');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   Admin: http://localhost:${PORT}/admin.html`);
  console.log(`   Search: http://localhost:${PORT}/search.html`);
});
