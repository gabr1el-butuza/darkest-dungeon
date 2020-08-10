class Map {
  constructor(size, content) {
    this.size = size;
    this.content = content;
    this.tiles = [];
    this.sprites = [];
    this.buildMap();
  }

  buildMap() {
    this.content.forEach((row, rowIndex) => {
      const rowElement = $("<div></div>");
      rowElement.addClass("map-row");
      this.tiles[rowIndex] = [];

      row.forEach((tile, columnIndex) => {
        const tileElement = $("<div></div>");
        tileElement.addClass("tile");
        tileElement.addClass(tile);
        rowElement.append(tileElement);
        this.tiles[rowIndex][columnIndex] = tileElement;
      });

      $(".map-content").append(rowElement);
    });
  }

  changeFog(row, column) {
    this.tiles.forEach((tileRow, tileRowIndex) => {
      tileRow.forEach((tile, tileColumnIndex) => {
        const distance =
          Math.abs(tileRowIndex - row) + Math.abs(tileColumnIndex - column);
        const opacity = 1 - distance * 0.3;
        tile.css({
          opacity
        });
      });
    });
  }

  placeAdventurer(adventurer) {
    $("body").append(adventurer.element);
    const { top, left } = this.tiles[adventurer.position.row][adventurer.position.column][0].getBoundingClientRect();
    adventurer.element.css({
      // left: config.leftOffset + config.tileSize * adventurer.position.column,
      // top: config.topOffset + config.tileSize * adventurer.position.row
      left: left,
      top: top
    });
    map.changeFog(adventurer.position.row, adventurer.position.column);
  }

  placeSprite(sprite) {
    const { row, column } = sprite.position;
    if (sprite instanceof Adventurer) {
      this.placeAdventurer(sprite);
    } else {
      this.tiles[row][column].append(sprite.element);
    }
    this.sprites[sprite.getId()] = sprite;
  }

  removeSprite(sprite) {
    console.log(this.sprites);
    delete this.sprites[sprite.element.attr("id")];
    sprite.element.remove();
  }

  getTile(row, column) {
    return this.tiles[row] ? this.tiles[row][column] : false;
  }

  getSprite(row, column) {
    const tile = this.getTile(row, column);
    const spriteElement = $(tile.find(".sprite")[0]);
    return map.sprites[spriteElement.attr("id")];
  }
}
