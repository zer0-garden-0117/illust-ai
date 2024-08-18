const sharp = require('sharp');
const fs = require('fs');

const inputPath = process.argv[2];
const outputPath = process.argv[3];

sharp(inputPath)
  .toFormat('avif', { quality: 60 })
  .toFile(outputPath, (err, info) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('AVIF変換成功:', info);
  });