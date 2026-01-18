'use client'

import { forwardRef, useRef, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, RapierRigidBody } from '@react-three/rapier'
import type * as THREE from 'three'
import { PLAYER_CONFIG } from '@/app/lib/constants/gameConfig'

/**
 * Snowboard.tsx
 * 
 * スノーボードの3D表現と物理演算を行うコンポーネント
 * - Bullet-proof Architectureパターンに従う
 * - 地形に接触する板状のスノーボード
 * - Dynamic RigidBody（物理ボディ）
 */

export interface SnowboardRef {
  getPosition: () => [number, number, number]
  getVelocity: () => [number, number, number]
  applyForce: (force: [number, number, number]) => void
  reset: () => void
  getRigidBody: () => RapierRigidBody | null
}

interface SnowboardProps {
  color?: string
  initialPosition?: [number, number, number]
  onRigidBodyReady?: (rigidBody: RapierRigidBody) => void
}

// スノーボードのサイズ設定（板状：幅広、高さ低い）
const SNOWBOARD_SIZE = {
  width: 0.5,  // 幅（X軸）
  height: 0.02, // 高さ（Y軸、板状なので低い）
  depth: 1.0,   // 奥行き（Z軸、スノーボードの長さ）
} as const

// スノーボードの質量（プレイヤーより軽い）
const SNOWBOARD_MASS = 5

const Snowboard = forwardRef<SnowboardRef, SnowboardProps>(
  ({ color = '#87ceeb', initialPosition, onRigidBodyReady }, ref) => {
    const groupRef = useRef<THREE.Group>(null)
    const rigidBodyRef = useRef<RapierRigidBody>(null)
    const hasNotifiedRef = useRef(false)

    // 初期位置の計算（プレイヤーの足の位置に合わせる）
    // Playerの胴体の下端 = baseY - PLAYER_SIZE.body.height / 2
    // Snowboardの上端 = snowboardCenter + SNOWBOARD_SIZE.height / 2
    // これらを一致させる
    const defaultPosition: [number, number, number] = (() => {
      const baseY = initialPosition
        ? initialPosition[1]
        : PLAYER_CONFIG.initialPosition[1]
      // Playerの胴体の下端（足の位置）
      const playerBottom = baseY - 1.4 / 2 // PLAYER_SIZE.body.height / 2
      // Snowboardの中心を、上端がplayerBottomに接するように配置
      const snowboardCenter = playerBottom - SNOWBOARD_SIZE.height / 2
      return initialPosition
        ? [initialPosition[0], snowboardCenter, initialPosition[2]]
        : [0, snowboardCenter, 0]
    })()

    // 親からアクセス可能にする
    useImperativeHandle(ref, () => ({
      getPosition: () => {
        if (!groupRef.current) {
          return defaultPosition
        }
        const pos = groupRef.current.position
        return [pos.x, pos.y, pos.z]
      },
      getVelocity: () => {
        if (!rigidBodyRef.current) {
          return [0, 0, 0]
        }
        const velocity = rigidBodyRef.current.linvel()
        return [velocity.x, velocity.y, velocity.z]
      },
      applyForce: (force: [number, number, number]) => {
        if (!rigidBodyRef.current) {
          return
        }
        rigidBodyRef.current.addForce({ x: force[0], y: force[1], z: force[2] }, true)
      },
      reset: () => {
        if (!groupRef.current || !rigidBodyRef.current) {
          return
        }
        groupRef.current.position.set(...defaultPosition)
        groupRef.current.rotation.set(0, 0, 0)
        rigidBodyRef.current.setTranslation({ x: defaultPosition[0], y: defaultPosition[1], z: defaultPosition[2] }, true)
        rigidBodyRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true)
        rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
        rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
      },
      getRigidBody: () => {
        return rigidBodyRef.current
      },
    }), [defaultPosition])

    // フレームごとの更新（Reactの再レンダリングとは独立）
    useFrame(() => {
      // RigidBodyが準備できたときに一度だけコールバックを呼び出す
      if (rigidBodyRef.current && onRigidBodyReady && !hasNotifiedRef.current) {
        onRigidBodyReady(rigidBodyRef.current)
        hasNotifiedRef.current = true
      }

      if (!groupRef.current || !rigidBodyRef.current) {
        return
      }

      // 物理エンジンの位置・回転を3Dオブジェクトに同期
      const translation = rigidBodyRef.current.translation()
      const rotation = rigidBodyRef.current.rotation()

      groupRef.current.position.set(translation.x, translation.y, translation.z)
      groupRef.current.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
    })

    return (
      <group ref={groupRef} position={defaultPosition}>
        <RigidBody
          ref={rigidBodyRef}
          type="dynamic"
          mass={SNOWBOARD_MASS}
          colliders="cuboid"
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[SNOWBOARD_SIZE.width, SNOWBOARD_SIZE.height, SNOWBOARD_SIZE.depth]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
          </mesh>
        </RigidBody>
      </group>
    )
  }
)

Snowboard.displayName = 'Snowboard'

export default Snowboard

