class DialogSequence {
  constructor(dialogs) {
    this.currentDialog = null;
    this.messages = [];
    dialogs.forEach(dialog => {
      const { row, column } = dialog.trigger;
      if (!this.messages[row]) {
        this.messages[row] = [];
      }
      this.messages[row][column] = dialog.messages;
    });
  }

  exists(row, column) {
    return this.messages[row] && this.messages[row][column];
  }

  start(row, column) {
    this.currentDialog = { row, column };
    this.showNext();
  }

  showNext() {
    const { row, column } = this.currentDialog;
    const messages = this.messages[row][column];

    if (messages.length === 0) {
      this.hideBubble();
      this.currentDialog = null;
      delete this.messages[row][column];
      return false;
    }

    const currentMessage = messages[0];
    let sprite;
    if (currentMessage.speaker === constants.spriteTypes.HERO) {
      sprite = Adventurer.getInstance();
    } else {
      sprite = Vilain.getInstance();
    }
    const speaker = $('#' + this.messages[row][column][0].speaker);
    this.showBubble(
      speaker,
      currentMessage.message
    );
    messages.shift();
  }

  showBubble(element, message) {
    const { top, left } = element[0].getBoundingClientRect();
    $(".speech-bubble")
      .css({
        top: top - 16,
        left: left + 64
      })
      .html(message)
      .fadeIn();
  }

  hideBubble() {
    $(".speech-bubble").fadeOut();
  }

  isDialogInProgress() {
    return this.currentDialog !== null;
  }
}
