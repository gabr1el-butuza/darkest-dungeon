let map;
let gameMechanics;

const updateCoordinates = () => {
  const adventurer = Adventurer.getInstance();
  const { row, column } = adventurer.position;
  gameMechanics.checkTileTriggers(row, column);
  const { strength, vitality, healingPoints } = adventurer.stats;
  $("#strength").html(strength);
  $("#vitality").html(`${healingPoints}/${vitality}`);
};

function createSprites(sprites) {
  sprites.forEach(spriteInfo => {
    const sprite = SpriteFactory.createSprite(spriteInfo);
    map.placeSprite(sprite);
  });
}

const initMap = () => {
  $.ajax({
    type: "GET",
    url: config.api.map,
    success(response) {
      map = new Map(response.size, response.map);
      initSprites();
    }
  });
};

function initSprites() {
  $.ajax({
    type: "GET",
    url: config.api.sprites,
    success(response) {
      createSprites(response);
      initDialogs();
    }
  });
}

function initDialogs() {
  $.ajax({
    async: false,
    type: "GET",
    url: config.api.dialogs,
    success(response) {
      dialogSequence = new DialogSequence(response);
      gameMechanics = new GameMechanics(map, dialogSequence);
      updateCoordinates();
    }
  });
}

initMap();

const writeToLog = message => {
  $("#gameLog")
    // .fadeOut()
    .append('\n' + message + '\n')
  // .fadeIn();
};

const moveAdventurer = (left, top) => {
  const adventurer = Adventurer.getInstance();
  const nextTile = map.getTile(
    adventurer.position.row + top,
    adventurer.position.column + left
  );

  if (!nextTile || nextTile.hasClass("tile-disabled") || nextTile.hasClass("column-double") || nextTile.hasClass("tile-face1") || nextTile.hasClass("tile-face2")) {
    writeToLog("Can't go there");
  } else if (!dialogSequence.isDialogInProgress()) {
    adventurer.move(left, top, updateCoordinates);
  } else {
    writeToLog("Press space bar to continue");
  }
};

$(document).keydown(event => {
  switch (event.which) {
    case 32:
      // space
      if (dialogSequence.isDialogInProgress()) {
        dialogSequence.showNext();
      }
      break;
    case 37:
      // left
      moveAdventurer(-1, 0);
      break;
    case 39:
      // right
      moveAdventurer(1, 0);
      break;
    case 38:
      // up
      moveAdventurer(0, -1);
      break;
    case 40:
      // down
      moveAdventurer(0, 1);
      break;
    default:
    // exit this handler for other keys
  }
  event.preventDefault(); // prevent the default action (scroll / move caret)
});
