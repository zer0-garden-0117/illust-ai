const sharp = require('sharp');

let chunks = [];

// 標準入力から画像データを受け取る
process.stdin.on('data', chunk => {
  chunks.push(chunk);
});

process.stdin.on('end', () => {
  const inputBuffer = Buffer.concat(chunks);

  sharp(inputBuffer)
    .resize(400, 566)
    .toFormat('avif', { quality: 60 })
    .toBuffer()
    .then(avifBuffer => {
      process.stdout.write(avifBuffer);
    })
    .catch(err => {
      console.error("Error during conversion:", err.message);
      process.exit(1);
    });
});