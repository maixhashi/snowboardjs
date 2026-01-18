import { create } from 'zustand';

/**
 * ゲーム状態の型定義
 */
export interface GameState {
  // ゲームの基本状態
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  
  // プレイヤー状態（将来の拡張用）
  playerPosition: [number, number, number];
  playerVelocity: [number, number, number];
  
  // アクション
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  updateScore: (points: number) => void;
  updatePlayerPosition: (position: [number, number, number]) => void;
  updatePlayerVelocity: (velocity: [number, number, number]) => void;
  reset: () => void;
}

/**
 * ゲーム状態の初期値
 */
const initialState = {
  isPlaying: false,
  isPaused: false,
  score: 0,
  playerPosition: [0, 0, 0] as [number, number, number],
  playerVelocity: [0, 0, 0] as [number, number, number],
};

/**
 * Zustandストア: ゲーム状態管理
 * 
 * ゲーム全体の状態を管理します。
 * 3D状態とUI状態を分離する設計原則に従い、
 * UI状態のみをこのストアで管理します。
 */
export const useGameStore = create<GameState>((set) => ({
  ...initialState,
  
  startGame: () => set({ isPlaying: true, isPaused: false }),
  
  pauseGame: () => set((state) => {
    if (state.isPlaying) {
      return { isPaused: true };
    }
    return state;
  }),
  
  resumeGame: () => set({ isPaused: false }),
  
  endGame: () => set({ isPlaying: false, isPaused: false }),
  
  updateScore: (points: number) => set((state) => ({
    score: state.score + points,
  })),
  
  updatePlayerPosition: (position: [number, number, number]) => set({
    playerPosition: position,
  }),
  
  updatePlayerVelocity: (velocity: [number, number, number]) => set({
    playerVelocity: velocity,
  }),
  
  reset: () => set(initialState),
}));

