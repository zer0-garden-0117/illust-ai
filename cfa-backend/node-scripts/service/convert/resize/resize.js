const sharp = require('sharp');
const { pipeline } = require('stream');

// 標準入力からストリームで処理
pipeline(
    process.stdin,
    sharp()
        .toFormat('png', {
            quality: 80,
        }),
    process.stdout,
    (err) => {
        if (err) {
            console.error(`Conversion failed: ${err.message}`);
            process.exit(1);
        }
    }
);