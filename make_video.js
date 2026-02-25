const fs = require('fs');
const cp = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const inPath = 'C:/Users/Dudhat Parth/.gemini/antigravity/brain/1660646b-02e2-4abe-9d93-fdbb40126d20/agrosathi_demo_video_1771952149004.webp';
const outPath = 'C:/Users/Dudhat Parth/OneDrive/Desktop/AgroSaathi_Demo.mp4';

console.log("Checking input file:", fs.existsSync(inPath));
console.log("Running FFmpeg conversion...");

try {
    cp.execSync('"' + ffmpegPath + '" -i "' + inPath + '" -c:v libx264 -pix_fmt yuv420p "' + outPath + '"', { stdio: 'inherit' });
    console.log("Video saved successfully to Desktop!");
} catch (e) {
    console.error("FFmpeg error:", e.message);
}
