const sharp = require('sharp');

let chunks = [];

// 標準入力から画像データを受け取る
process.stdin.on('data', chunk => {
  chunks.push(chunk);
});

process.stdin.on('end', () => {
  const inputBuffer = Buffer.concat(chunks);

  sharp(inputBuffer)
    .withMetadata(false)
    .resize(1200, 630, { // OGP推奨サイズ
    fit: 'cover',
    position: 'center'
    })
    .toFormat('jpeg', { quality: 90 })
    .toBuffer()
    .then(avifBuffer => {
      process.stdout.write(avifBuffer);
    })
    .catch(err => {
      console.error("Error during conversion:", err.message);
      process.exit(1);
    });
});