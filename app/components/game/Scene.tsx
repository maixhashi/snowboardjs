'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { CAMERA_CONFIG, RENDERING_CONFIG } from '@/app/lib/constants/gameConfig'
import Physics from './Physics'
import Terrain from './Terrain'
import Player from './Player'

/**
 * Scene.tsx
 * 
 * メイン3Dシーンの統合と管理を行うコンポーネント
 * - Canvasの初期化
 * - 基本的なライティング設定
 * - 環境設定
 * - 子コンポーネント（Physics、Terrain、Camera）の配置
 */

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{
          position: CAMERA_CONFIG.initialPosition,
          fov: CAMERA_CONFIG.fov,
          near: CAMERA_CONFIG.near,
          far: CAMERA_CONFIG.far,
        }}
        shadows={RENDERING_CONFIG.shadows}
        gl={{ antialias: RENDERING_CONFIG.antialias }}
      >
        {/* ライティング設定 */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={RENDERING_CONFIG.shadowMapSize}
          shadow-mapSize-height={RENDERING_CONFIG.shadowMapSize}
        />

        {/* 環境設定 */}
        <Environment preset="sunset" background={false} />

        {/* 背景色を設定 */}
        <color args={['#87CEEB']} attach="background" />

        {/* カメラコントロール */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={100}
        />

        {/* 物理エンジンと地形 */}
        <Suspense fallback={null}>
          <Physics>
            <Terrain />
            <Player />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  )
}

