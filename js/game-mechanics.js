class GameMechanics {
  constructor(map, dialogSequence) {
    this.map = map;
    this.dialogSequence = dialogSequence;
  }

  checkTileTriggers(row, column) {
    const sprite = this.map.getSprite(row, column);
    const adventurer = Adventurer.getInstance();

    if (this.dialogSequence.exists(row, column)) {
      this.dialogSequence.start(row, column);
    }

    if (sprite) {
      if (sprite.type === constants.spriteTypes.HEALTH_POTION) {
        this.consumeItem(adventurer, sprite);
      } else if (sprite.type === constants.spriteTypes.CHEST_CLOSED) {
        this.openChest(adventurer, sprite);
      } else if (this.isAttackable(sprite)) {
        this.attack(adventurer, sprite);
      }
      if (sprite.encounterMessage) {
        writeToLog(sprite.encounterMessage);
      }
    }
  }

  consumeItem(adventurer, sprite) {
    adventurer.consume(sprite);
    map.removeSprite(sprite);
  }

  openChest(adventurer, sprite) {
    adventurer.consume(sprite);
    adventurer.changeStandByAnimation("adventurer-sword");
    sprite.type = "chest-open";
    sprite.element.removeClass("chest-closed").addClass("chest-open");
  }

  isAttackable(sprite) {
    if (
      sprite.type === constants.spriteTypes.BAT ||
      sprite.type === constants.spriteTypes.VILAIN ||
      sprite.type === constants.spriteTypes.GOBLIN
    ) {
      return true;
    }

    return false;
  }

  attack(attacker, defender) {
    let log = "";
    const attackerName = attacker.getId().toUpperCase();
    const defenderName = defender.getId().toUpperCase();

    do {
      defender.stats.healingPoints -= attacker.stats.strength;
      log += `${defenderName} took ${attacker.stats.strength} damage;`;

      if (defender.stats.healingPoints <= 0) {
        let damage = Math.floor(defender.stats.strength / 2);
        defender.stats.healingPoints = 0;
        attacker.stats.healingPoints -= damage;
        log += `${defenderName} died; ${attackerName} took ${damage} damage;`;
        if (attacker.stats.healingPoints <= 0) {
          attacker.stats.healingPoints = 0;
          log += `${attackerName} died;`;
        }

        break;
      } else if (attacker.stats.healingPoints <= 0) {
        let damage = Math.floor(attacker.stats.strength / 2);
        attacker.stats.healingPoints = 0;
        defender.stats.healingPoints -= damage;
        log += `${attackerName} died; ${defenderName} took ${damage} damage;`;
        if (defender.stats.healingPoints <= 0) {
          defender.stats.healingPoints = 0;
          log += `${defenderName} died;`;
        }
        break;
      }
      attacker.stats.healingPoints -= defender.stats.strength;
      log += `${attackerName} took ${defender.stats.strength} damage;`;
    } while (
      attacker.stats.healingPoints > 0 &&
      defender.stats.healingPoints > 0
    );
    attacker.updateHp();
    defender.updateHp();
    writeToLog(log);

    if (attacker.isDead()) {
      alert(log);
      window.location.reload();
    }

    if (defender.isDead()) {
      map.removeSprite(defender);
      if (defender.type == "vilain") {
        writeToLog("YOU WON THE GAME!!! ^_^");
      }
    }
  }
}
