const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 提供静态文件
app.use(express.static('src'));      // 提供 src 文件夹中的静态文件 (JS, CSS)
app.use(express.static('source'));   // 提供 source 文件夹中的视频和字幕文件
app.use(express.static(__dirname));  // 提供项目根目录中的静态文件 (index.html)

// 获取视频文件列表的API
app.get('/api/videos', (req, res) => {
    const videoDirectory = path.join(__dirname, 'source');
    fs.readdir(videoDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const videoFiles = files.filter(file => file.endsWith('.mp4'));
        res.json(videoFiles);
    });
});

// 获取字幕文件列表的API
app.get('/api/subtitles', (req, res) => {
    const subtitleDirectory = path.join(__dirname, 'source');
    fs.readdir(subtitleDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const subtitleFiles = files.filter(file => file.endsWith('.srt'));
        res.json(subtitleFiles);
    });
});

// 新增路由：提供视频文件的路由，并确保正确的 MIME 类型
app.get('/video/:filename', (req, res) => {
    const videoPath = path.join(__dirname, 'source', req.params.filename);

    // 检查文件是否存在
    if (fs.existsSync(videoPath)) {
        // 设置正确的 MIME 类型
        res.setHeader('Content-Type', 'video/mp4');
        res.sendFile(videoPath);
    } else {
        res.status(404).send('Video not found');
    }
});

// 新增路由：提供字幕文件的路由
app.get('/subtitle/:filename', (req, res) => {
    const subtitlePath = path.join(__dirname, 'source', req.params.filename);

    // 检查文件是否存在
    if (fs.existsSync(subtitlePath)) {
        res.setHeader('Content-Type', 'application/x-subrip');  // 设置 SRT 的 MIME 类型
        res.sendFile(subtitlePath);
    } else {
        res.status(404).send('Subtitle not found');
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
