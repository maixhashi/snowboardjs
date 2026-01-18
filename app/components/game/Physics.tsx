'use client'

import { ReactNode } from 'react'
import * as Rapier from '@react-three/rapier'
import { PHYSICS_CONFIG } from '@/app/lib/constants/gameConfig'

interface PhysicsProps {
  children: ReactNode
}

/**
 * Physics.tsx
 * 
 * 物理エンジンの初期化と設定を行うコンポーネント
 * - Rapierワールドの作成
 * - 重力設定
 * - 子コンポーネントをラップするラッパー
 */
export default function Physics({ children }: PhysicsProps) {
  return (
    <Rapier.Physics
      gravity={[0, -PHYSICS_CONFIG.gravity, 0]}
      timeStep="vary"
    >
      {children}
    </Rapier.Physics>
  )
}

