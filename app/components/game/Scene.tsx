'use client'

import { Suspense, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { useFixedJoint, RapierRigidBody } from '@react-three/rapier'
import { CAMERA_CONFIG, RENDERING_CONFIG } from '@/app/lib/constants/gameConfig'
import Physics from './Physics'
import Terrain from './Terrain'
import Snowboard, { SnowboardRef } from './Snowboard'
import Player, { PlayerRef } from './Player'

/**
 * Scene.tsx
 * 
 * メイン3Dシーンの統合と管理を行うコンポーネント
 * - Canvasの初期化
 * - 基本的なライティング設定
 * - 環境設定
 * - 子コンポーネント（Physics、Terrain、Camera）の配置
 */

function PlayerWithSnowboard() {
  const playerRef = useRef<PlayerRef>(null)
  const snowboardRef = useRef<SnowboardRef>(null)
  const playerRigidBodyRef = useRef<RapierRigidBody | null>(null)
  const snowboardRigidBodyRef = useRef<RapierRigidBody | null>(null)

  // PlayerのRigidBodyが準備できたときのコールバック
  const handlePlayerRigidBodyReady = useCallback((rigidBody: RapierRigidBody) => {
    playerRigidBodyRef.current = rigidBody
  }, [])

  // SnowboardのRigidBodyが準備できたときのコールバック
  const handleSnowboardRigidBodyReady = useCallback((rigidBody: RapierRigidBody) => {
    snowboardRigidBodyRef.current = rigidBody
  }, [])

  // Playerの足の位置（胴体の下端）とSnowboardの上端を接続
  // Playerの足の位置: [0, -PLAYER_SIZE.body.height / 2, 0] (Playerのローカル座標)
  // Snowboardの上端: [0, SNOWBOARD_SIZE.height / 2, 0] (Snowboardのローカル座標)
  useFixedJoint(
    playerRigidBodyRef,
    snowboardRigidBodyRef,
    [
      // Playerのローカル座標での接続点（足の位置）
      [0, -1.4 / 2, 0], // PLAYER_SIZE.body.height / 2
      [0, 0, 0, 1], // 回転（クォータニオン）
      // Snowboardのローカル座標での接続点（上端）
      [0, 0.02 / 2, 0], // SNOWBOARD_SIZE.height / 2
      [0, 0, 0, 1], // 回転（クォータニオン）
    ]
  )

  return (
    <>
      <Snowboard ref={snowboardRef} onRigidBodyReady={handleSnowboardRigidBodyReady} />
      <Player ref={playerRef} onRigidBodyReady={handlePlayerRigidBodyReady} />
    </>
  )
}

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
            <PlayerWithSnowboard />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  )
}

