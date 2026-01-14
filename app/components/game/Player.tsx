'use client'

import { forwardRef, useRef, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier'
import type * as THREE from 'three'
import { PLAYER_CONFIG, PHYSICS_CONFIG } from '@/app/lib/constants/gameConfig'

/**
 * Player.tsx
 * 
 * プレイヤー（スノーボーダー）の3D表現と物理演算を行うコンポーネント
 * - Bullet-proof Architectureパターンに従う
 * - 頭と胴で幅が異なるbox geometry
 * - Dynamic RigidBody（物理ボディ、compound collider）
 */

export interface PlayerRef {
  getPosition: () => [number, number, number]
  getVelocity: () => [number, number, number]
  applyForce: (force: [number, number, number]) => void
  reset: () => void
  getRigidBody: () => RapierRigidBody | null
}

interface PlayerProps {
  headColor?: string
  bodyColor?: string
  initialPosition?: [number, number, number]
  onRigidBodyReady?: (rigidBody: RapierRigidBody) => void
}

// プレイヤーのサイズ設定
const PLAYER_SIZE = {
  // 頭部分（幅が狭い）
  head: {
    width: 0.25,   // 幅（X軸）
    height: 0.3,   // 高さ（Y軸）
    depth: 0.25,   // 奥行き（Z軸）
  },
  // 胴部分（幅が広い）
  body: {
    width: 0.4,    // 幅（X軸）
    height: 1.4,   // 高さ（Y軸）
    depth: 0.3,    // 奥行き（Z軸）
  },
} as const

// 頭と胴の位置関係（胴の上に頭が配置される）
const HEAD_OFFSET_Y = PLAYER_SIZE.body.height / 2 + PLAYER_SIZE.head.height / 2

const Player = forwardRef<PlayerRef, PlayerProps>(
  ({ headColor = '#ffdbac', bodyColor = '#ffdbac', initialPosition, onRigidBodyReady }, ref) => {
    const groupRef = useRef<THREE.Group>(null)
    const rigidBodyRef = useRef<RapierRigidBody>(null)
    const hasNotifiedRef = useRef(false)

    // 初期位置の計算
    const defaultPosition: [number, number, number] = initialPosition
      ? initialPosition
      : PLAYER_CONFIG.initialPosition

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
          mass={PLAYER_CONFIG.mass}
          colliders={false}
          friction={PHYSICS_CONFIG.friction}
          restitution={PHYSICS_CONFIG.restitution}
        >
          {/* 胴部分（幅が広い） */}
          <mesh
            position={[0, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[PLAYER_SIZE.body.width, PLAYER_SIZE.body.height, PLAYER_SIZE.body.depth]} />
            <meshStandardMaterial color={bodyColor} roughness={0.7} metalness={0.1} />
          </mesh>
          <CuboidCollider
            args={[PLAYER_SIZE.body.width / 2, PLAYER_SIZE.body.height / 2, PLAYER_SIZE.body.depth / 2]}
            position={[0, 0, 0]}
          />

          {/* 頭部分（幅が狭い） */}
          <mesh
            position={[0, HEAD_OFFSET_Y, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[PLAYER_SIZE.head.width, PLAYER_SIZE.head.height, PLAYER_SIZE.head.depth]} />
            <meshStandardMaterial color={headColor} roughness={0.8} metalness={0.1} />
          </mesh>
          <CuboidCollider
            args={[PLAYER_SIZE.head.width / 2, PLAYER_SIZE.head.height / 2, PLAYER_SIZE.head.depth / 2]}
            position={[0, HEAD_OFFSET_Y, 0]}
          />
        </RigidBody>
      </group>
    )
  }
)

Player.displayName = 'Player'

export default Player

