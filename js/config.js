const config = {
  tileSize: 64,
  //leftOffset: 26,
  // topOffset: 116,
  api: {
    map: "/api/scenario/map.json",
    dialogs: "/api/scenario/dialogs.json",
    sprites: "/api/scenario/sprites.json"
  }
};

const constants = {
  spriteTypes: {
    HERO: "hero",
    VILAIN: "vilain",
    BAT: "bat",
    GOBLIN: "goblin",
    HEALTH_POTION: "health-potion",
    CHEST_CLOSED: "chest-closed",
    CHEST_OPEN: "chest-open"
  }
};
