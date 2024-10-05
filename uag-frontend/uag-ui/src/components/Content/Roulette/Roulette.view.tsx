import React, { useState } from 'react';
import { Box, Button, Flex, Group, RingProgress, Space, Text } from '@mantine/core';
import { memo } from 'react';
import { IoMdPlay } from "react-icons/io";

type RouletteViewProps = {
  onOpen: () => void;
};

export const RouletteView = memo(function RouletteViewComponent({
  onOpen
}: RouletteViewProps): JSX.Element {
  const [rotation, setRotation] = useState(0); // ルーレットの回転角度
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(''); // 結果を表示するための状態
  const [stoppedAngle, setStoppedAngle] = useState<number | null>(null); // ルーレットが止まった角度

  const segments = [
    { value: 50, color: 'gray' }, // 当たりセグメント (0-180度に位置)
    { value: 50, color: 'var(--mantine-color-orange-3)' }, // ハズレセグメント (180-360度に位置)
  ];

  const spinRoulette = () => {
    setIsSpinning(true);
    setStoppedAngle(null); // スピン中は表示をリセット
    const randomSpin = Math.floor(Math.random() * 360) + 720; // 720度以上のランダムな回転
    setRotation(randomSpin); // 新しい回転角度を設定

    setTimeout(() => {
      setIsSpinning(false);
      const finalAngle = randomSpin % 360; // 0-360度の範囲に正規化
      setStoppedAngle(finalAngle); // 止まった角度を保存
      determineResult(finalAngle); // 結果を計算
    }, 3000); // 3秒後に停止
  };

  const determineResult = (finalAngle: number) => {
    // ルーレットの角度によって結果を決定する (0〜180度が当たり)
    if (finalAngle <= 180) {
      setResult(`当たり！`);
      // setResult(`当たり！ (角度: ${finalAngle.toFixed(2)}°)`);
    } else {
      setResult(`はずれ`);
      // setResult(`ハズレ (角度: ${finalAngle.toFixed(2)}°)`);
    }
  };

  return (
    <>
      <Space h="xl" />
      <div style={{ textAlign: 'center', position: 'relative', width: '200px', margin: '0 auto' }}>
        {/* ルーレット */}
        <RingProgress
          sections={segments}
          size={200}
          thickness={15}
          style={{
            transform: `rotate(${rotation}deg)`, // ルーレットの回転
            transition: isSpinning ? 'transform 3s ease-out' : 'none', // 回転のスムーズなエフェクト
          }}
        />
        {/* 常に真上を指す針 */}
        <div
          style={{
            position: 'absolute',
            top: "-10px",
            left: '50%',
            transform: 'translateX(-50%)', // 針を中央に配置
            width: '0',
            height: '0',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '20px solid var(--mantine-color-orange-3)', // 針を赤色に設定
          }}
        />
        <Button
          onClick={spinRoulette}
          mt="md"
          disabled={isSpinning}
          style={{ marginTop: '20px' }}
          leftSection={<IoMdPlay />}
          size='xs'
        >
          {isSpinning ? '抽選中...' : 'スタート'}
        </Button>
        <Box mt="md">
          <p style={{ fontWeight: 'bold', fontSize: '24px', color: result.includes('当たり') ? 'var(--mantine-color-orange-3)' : 'gray' }}>
            {result}
          </p>
        </Box>
      </div>
    </>
  );
});