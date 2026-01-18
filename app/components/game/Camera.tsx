'use client'

import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type * as THREE from 'three'
import { CAMERA_CONFIG } from '@/app/lib/constants/gameConfig'

/**
 * Camera.tsx
 * 
 * カメラの制御と設定を行うコンポーネント
 * - Bullet-proof Architectureパターンに従う
 * - サードパーソン視点の基本設定
 * - 将来的なプレイヤー追従機能の準備
 */

export interface CameraRef {
  getPosition: () => [number, number, number]
  setPosition: (position: [number, number, number]) => void
  lookAt: (target: [number, number, number]) => void
}

const Camera = forwardRef<CameraRef>((props, ref) => {
  const { camera } = useThree()
  const cameraRef = useRef<THREE.Camera>(camera)

  // 親からアクセス可能にする
  useImperativeHandle(ref, () => ({
    getPosition: () => {
      const currentCamera = cameraRef.current
      if (!currentCamera) {
        return [0, 0, 0]
      }
      const pos = currentCamera.position
      return [pos.x, pos.y, pos.z]
    },
    setPosition: (position: [number, number, number]) => {
      const currentCamera = cameraRef.current
      if (!currentCamera) {
        return
      }
      currentCamera.position.set(...position)
    },
    lookAt: (target: [number, number, number]) => {
      const currentCamera = cameraRef.current
      if (!currentCamera) {
        return
      }
      currentCamera.lookAt(...target)
    },
  }), [])

  // React Three Fiberでは、カメラはCanvasのcamera propで設定されるため
  // このコンポーネントは制御のみを行う（nullを返す）
  return null
})

Camera.displayName = 'Camera'

export default Camera

