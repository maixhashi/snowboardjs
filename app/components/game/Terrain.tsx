'use client'

import { RigidBody } from '@react-three/rapier'
import { TERRAIN_CONFIG, PHYSICS_CONFIG } from '@/app/lib/constants/gameConfig'

/**
 * Terrain.tsx
 * 
 * 地形の生成とコリジョン設定を行うコンポーネント
 * - シンプルな平面地形の生成
 * - 物理コリジョンの設定（Static RigidBody）
 * - 基本的なマテリアル（雪の色）
 */
export default function Terrain() {
  const { size, snowColor } = TERRAIN_CONFIG

  return (
    <RigidBody
      type="fixed"
      colliders="cuboid"
      friction={PHYSICS_CONFIG.friction}
      restitution={PHYSICS_CONFIG.restitution}
      name="terrain"
    >
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[size.width, size.height]} />
        <meshStandardMaterial
          color={snowColor}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </RigidBody>
  )
}

