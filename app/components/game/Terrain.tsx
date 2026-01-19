'use client'

import { useMemo } from 'react'
import { RigidBody } from '@react-three/rapier'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import { TERRAIN_CONFIG, PHYSICS_CONFIG } from '@/app/lib/constants/gameConfig'

/**
 * Terrain.tsx
 * 
 * 地形の生成とコリジョン設定を行うコンポーネント
 * - 側面から傾斜のある三角柱地形の生成
 * - 物理コリジョンの設定（Static RigidBody、trimesh）
 * - 基本的なマテリアル（雪の色）
 */
export default function Terrain() {
  const { size, snowColor, slope } = TERRAIN_CONFIG

  // 三角柱ジオメトリの生成
  const geometry = useMemo(() => {
    const width = size.width
    const depth = slope.depth
    const slopeAngleRad = (slope.angle * Math.PI) / 180
    const topHeight = depth * Math.tan(slopeAngleRad)

    // 頂点の定義
    // 底面の4頂点（Y=0）
    const bottomVertices = [
      [-width / 2, 0, -depth / 2], // 左下（手前）
      [width / 2, 0, -depth / 2],  // 右下（手前）
      [width / 2, 0, depth / 2],   // 右上（奥）
      [-width / 2, 0, depth / 2],  // 左上（奥）
    ]

    // 上面の3頂点（三角形）- Z軸負方向に傾斜（手前が高い）
    const topVertices = [
      [-width / 2, topHeight, -depth / 2], // 左上（手前・高い）
      [width / 2, topHeight, -depth / 2],  // 右上（手前・高い）
      [0, 0, depth / 2],                   // 中央（奥・低い）
    ]

    // 全頂点を結合（7頂点）
    const vertices: number[] = []
    bottomVertices.forEach((v) => vertices.push(...v))
    topVertices.forEach((v) => vertices.push(...v))

    // インデックスの定義（面の構成）
    const indices: number[] = []

    // 底面（長方形、2つの三角形）
    indices.push(0, 1, 2) // 三角形1
    indices.push(0, 2, 3) // 三角形2

    // 上面（三角形）
    indices.push(4, 5, 6) // 上面の三角形

    // 側面1: 左側（手前から奥へ）
    indices.push(0, 4, 3) // 左下-左上(上)-左上(下)
    indices.push(4, 6, 3) // 左上(上)-中央(上)-左上(下)

    // 側面2: 右側（手前から奥へ）
    indices.push(1, 2, 5) // 右下-右上(下)-右上(上)
    indices.push(2, 6, 5) // 右上(下)-中央(上)-右上(上)

    // 側面3: 手前側（左から右へ）
    indices.push(0, 1, 4) // 左下-右下-左上(上)
    indices.push(1, 5, 4) // 右下-右上(上)-左上(上)

    // 側面4: 奥側（左から右へ）
    indices.push(3, 6, 2) // 左上(下)-中央(上)-右上(下)

    // BufferGeometryの作成
    const geom = new BufferGeometry()
    geom.setAttribute('position', new Float32BufferAttribute(vertices, 3))
    geom.setIndex(indices)
    geom.computeVertexNormals()

    return geom
  }, [size.width, slope.depth, slope.angle])

  return (
    <RigidBody
      type="fixed"
      colliders="trimesh"
      friction={PHYSICS_CONFIG.friction}
      restitution={PHYSICS_CONFIG.restitution}
      name="terrain"
    >
      <mesh
        geometry={geometry}
        position={[0, 0, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color={snowColor}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </RigidBody>
  )
}

