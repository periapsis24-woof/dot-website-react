// gameConfig.js (adjusted for subtract mode as default for decay)
const GAME_CONFIG = {
  INITIAL_PROGRESS: 0,
  TEASE_ZONE_MAX: 59,
  EDGE_ZONE_MIN: 60,
  EDGE_ZONE_MAX: 94,
  CUM_ZONE_MIN: 95,
  INCREMENT: 2,
  DECREMENT: 1, // Adjusted for finer decay
  DECREMENT_MODE: 'subtract',
  TEASE_DECAY_INTERVAL: 500,
  EDGE_DECAY_INTERVAL: 200,
  TIMER_INTERVAL: 10,
};

export default GAME_CONFIG;