/**
 * collision.ts
 * 
 * 衝突判定のヘルパー関数
 * - 衝突点の計算
 * - 法線ベクトルの取得
 * - 衝突情報の処理
 */

/**
 * 衝突点の座標を取得
 * @param manifold 衝突情報のマニフォールド
 * @param index 接触点のインデックス（デフォルト: 0）
 * @returns 衝突点の座標 [x, y, z]
 */
export function getContactPoint(
  manifold: { solverContactPoint: (index: number) => { x: number; y: number; z: number } },
  index = 0
): [number, number, number] {
  const point = manifold.solverContactPoint(index)
  return [point.x, point.y, point.z]
}

/**
 * 衝突相手が地形かどうかを判定
 * @param other 衝突相手のRigidBody情報
 * @returns 地形との衝突の場合true
 */
export function isTerrainCollision(other: { rigidBodyObject?: { name?: string } }): boolean {
  return other.rigidBodyObject?.name === 'terrain'
}
