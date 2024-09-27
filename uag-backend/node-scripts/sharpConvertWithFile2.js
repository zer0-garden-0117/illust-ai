const sharp = require('sharp');
const fs = require('fs');

const inputPath = process.argv[2];
const outputPath = process.argv[3];

sharp(inputPath)
  .resize(400, 200) // 400x200にリサイズ
  .toFormat('avif', { quality: 60 }) // AVIF形式に変換
  .toFile(outputPath, (err, info) => {
    if (err) {
      console.error('エラー:', err);
      process.exit(1);
    }
    console.log('AVIF変換成功:', info);
  });