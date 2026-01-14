/**
 * ゲーム設定定数
 * 
 * 物理演算、ゲームプレイ、レンダリングに関する設定値を定義します。
 */

/**
 * 物理演算設定
 */
export const PHYSICS_CONFIG = {
  // 重力加速度 (m/s²)
  // 地球の重力: 9.81、月の重力: 1.62
  // ゲームでは少し軽めに設定
  gravity: 9.8,
  
  // 最大速度制限 (m/s)
  maxVelocity: 50,
  
  // 最小速度 (m/s)
  minVelocity: 0.1,
  
  // 摩擦係数
  friction: 0.8,
  
  // 反発係数（バウンス）
  restitution: 0.3,
} as const;

/**
 * プレイヤー設定
 */
export const PLAYER_CONFIG = {
  // プレイヤーの質量 (kg)
  mass: 70,
  
  // プレイヤーのサイズ (m)
  size: {
    width: 0.3,
    height: 1.7,
    depth: 0.3,
  },
  
  // 初期位置
  initialPosition: [0, 5, 0] as [number, number, number],
  
  // ジャンプ力
  jumpForce: 5,
  
  // 移動速度
  moveSpeed: 10,
} as const;

/**
 * カメラ設定
 */
export const CAMERA_CONFIG = {
  // 視野角 (度)
  fov: 75,
  
  // ニアクリップ平面
  near: 0.1,
  
  // ファークリップ平面
  far: 1000,
  
  // カメラの初期位置
  initialPosition: [0, 10, 20] as [number, number, number],
  
  // カメラの注視点
  lookAt: [0, 0, 0] as [number, number, number],
} as const;

/**
 * レンダリング設定
 */
export const RENDERING_CONFIG = {
  // アンチエイリアシング
  antialias: true,
  
  // シャドウマップの有効化
  shadows: true,
  
  // シャドウマップのサイズ
  shadowMapSize: 2048,
  
  // トーンマッピング
  toneMapping: 'ACESFilmic' as const,
  
  // トーンマッピングの露出
  toneMappingExposure: 1.0,
} as const;

/**
 * ゲームプレイ設定
 */
export const GAMEPLAY_CONFIG = {
  // スコア設定
  score: {
    // 距離によるスコア倍率
    distanceMultiplier: 0.1,
    // トリックによるスコア
    trickBonus: 100,
  },
  
  // タイマー設定（秒）
  timeLimit: 300, // 5分
  
  // チェックポイント間隔（メートル）
  checkpointInterval: 100,
} as const;

/**
 * 地形設定
 */
export const TERRAIN_CONFIG = {
  // 地形のサイズ
  size: {
    width: 1000,
    height: 1000,
  },
  
  // 地形のセグメント数（解像度）
  segments: {
    width: 100,
    height: 100,
  },
  
  // 雪の色
  snowColor: '#ffffff',
  
  // 地形の高さの変動範囲
  heightVariation: 50,
} as const;

