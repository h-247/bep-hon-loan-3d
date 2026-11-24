'use client';

import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  width: number;
  height: number;
}

export const CameraController: React.FC<CameraControllerProps> = ({ width, height }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    const centerX = width / 2;
    const centerZ = height / 2;

    // Overcooked elevated angled camera perspective
    camera.position.set(centerX, 15, centerZ + 12);
    camera.lookAt(centerX, 0.4, centerZ);

    // Compute orthographic zoom to frame kitchen width & height
    const isPortrait = size.height > size.width;
    const padding = 1.35;
    const kitchenSize = Math.max(width, height * (isPortrait ? 1.4 : 0.95));

    if ('zoom' in camera) {
      const orthoCam = camera as THREE.OrthographicCamera;
      const aspect = size.width / size.height;
      const targetZoom = isPortrait
        ? size.width / (kitchenSize * 45 * padding)
        : size.height / (kitchenSize * 40 * padding);

      orthoCam.zoom = Math.max(22, Math.min(65, targetZoom * 50));
      orthoCam.updateProjectionMatrix();
    }
  }, [camera, size, width, height]);

  return null;
};
