import { PlayerKey } from '../types/players';

// Get new player, opposite
export const getNewPlayer = (currentPlayer: PlayerKey): PlayerKey => currentPlayer === 'p1' ? 'p2' : 'p1';