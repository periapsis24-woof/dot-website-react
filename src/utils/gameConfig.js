const GAME_CONFIG = {
    INITIAL_PROGRESS: 0, // starting value <3
    THRESHOLD: 75, // where the 'edge zone' begins!!
    INITIAL_SUBBY_SAVES: 3, // lil 'get outta jail free cards!!!' :P
    INCREMENT_LOW: 5, // how much a click progresses the bar when < 50
    INCREMENT_HIGH: 10, // how much a click progresses the bar when >= 50, outside edge zone
    INCREMENT_EDGE_ZONE: 4, // in edge zone, initial amt per click
    INCREMENT_EDGE_MIN: 1, // in edge zone, after decay
    INCREMENT_TOO_FAST: 5, // in edge zone, when you clcik too fast, this amt get added to the bar
    EDGE_ZONE_INCREMENT_STEP: 2, // increment increase per edge zone click -> each click makes it harder to NOT reach 100 and ruin <3
    EDGE_ZONE_DECAY_TIME: 10000, // time in ms to decay increment
    DECREMENT_OUTSIDE: 3, // how fast the bar decreases outside edge zone
    DECREMENT_EDGE_ZONE: 2, // how fast the bar decrease inside the edge zone
    MIN_DECREMENT: 0.5, // min value for decrement
    DECREMENT_INTERVAL: 500, // how fast the bar decays in ms
    TIMER_INTERVAL: 10, // how often the timer checks if youve clicked before incrementing, in ms
    TOO_FAST_THRESHOLD: 300, // how fast in the edge zone you can click in ms before triggering the extra prog penalty ^.^
    SUBBY_SAVE_PROGRESS: 75, // reset to this when saved
    RED_ZONE_THRESHOLD: 90, // for "Too Fast!" display
  };
  
  export default GAME_CONFIG;