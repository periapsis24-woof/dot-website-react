const GAME_CONFIG = {
  INITIAL_PROGRESS: 0,
  TEASE_ZONE_MAX: 59,
  EDGE_ZONE_MIN: 60,
  EDGE_ZONE_MAX: 94,
  CUM_ZONE_MIN: 95,
  INCREMENT: 2, // all zones
  DECREMENT: 10,
  DECREMENT_MODE: 'halve', // 'halve' or 'subtract'
  TEASE_DECAY_INTERVAL: 500, // ms
  EDGE_DECAY_INTERVAL: 200, // ms
  DECREMENT_INTERVAL: 10, // base tick for halving
  TIMER_INTERVAL: 10, // ms
};

export default GAME_CONFIG;