'use client';

import React, { memo, useState, useEffect } from 'react';
import { Modal, Image, LoadingOverlay } from '@mantine/core';

export type WorkModalProps = {
  opened: boolean;
  onClose: () => void;
  imageUrl?: string | null;
  maxViewportPercent?: number;
};

export const WorkModal = memo(function WorkModal({
  opened,
  onClose,
  imageUrl,
  maxViewportPercent = 90,
}: WorkModalProps): JSX.Element {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (opened) setLoaded(false);
  }, [imageUrl, opened]);

  const maxW = `${maxViewportPercent}vw`;
  const maxH = `${maxViewportPercent}vh`;

  return (
    <>
    { opened && (
      <LoadingOverlay
        visible={!loaded}
        loaderProps={{ children: 'Loading...' }}
      />
    )}
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="auto"
      withCloseButton={false}
      styles={{
        content: {
          padding: 0,
          maxWidth: maxW,
          maxHeight: maxH,
        },
        body: {
          padding: 0,
          display: 'grid',
          placeItems: 'center',
        },
      }}
      overlayProps={{ opacity: 0.55, blur: 2 }}
      withinPortal
    >
      <Image
        src={imageUrl || ''}
        fit="contain"
        style={{
          maxWidth: maxW,
          maxHeight: maxH,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: loaded ? 'block' : 'none',
        }}
        onLoad={() => setLoaded(true)}
        fallbackSrc=""
      />
    </Modal>
    </>
  );
});

export default WorkModal;