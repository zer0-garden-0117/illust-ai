const sharp = require('sharp');
const fs = require('fs').promises;

let chunks = [];

// コマンドライン引数から watermask.png のパスを取得
const watermaskPath = process.argv[2];

if (!watermaskPath) {
  console.error("Error: Watermask path is required as the first argument.");
  process.exit(1);
}


// 標準入力から画像データを受け取る
process.stdin.on('data', chunk => {
  chunks.push(chunk);
});

process.stdin.on('end', async () => {
  try {
    const inputBuffer = Buffer.concat(chunks);

    // 標準入力から受け取った画像をバッファで処理
    const inputSharp = sharp(inputBuffer);
    const inputMetadata = await inputSharp.metadata(); // 縦横サイズを取得

    // input.pngをAVIFに変換（サイズはそのまま、バッファに保持）
    const inputAvifBuffer = await inputSharp
      .toFormat('avif', { quality: 60 })
      .toBuffer();

    // watermask.pngを読み込み、input.pngのサイズにリサイズしてAVIFに変換（バッファに保持）
//    const watermaskBuffer = await fs.readFile('../common/watermask.png');
    const watermaskBuffer = await fs.readFile(watermaskPath);
    const watermaskSharp = sharp(watermaskBuffer);
    const watermaskAvifBuffer = await watermaskSharp
      .resize(inputMetadata.width, inputMetadata.height) // input.pngのサイズにリサイズ
      .toFormat('avif', { quality: 60 })
      .toBuffer();

    // input.avifのバッファとwatermask.avifのバッファを合成
    const compositeImageBuffer = await sharp(inputAvifBuffer)
      .composite([{ input: watermaskAvifBuffer, blend: 'overlay' }]) // 合成
      .toFormat('avif', { quality: 60 })
      .toBuffer();

    // 標準出力に合成された画像を出力
    process.stdout.write(compositeImageBuffer);

  } catch (err) {
    console.error("Error during process:", err.message);
    process.exit(1);
  }
});