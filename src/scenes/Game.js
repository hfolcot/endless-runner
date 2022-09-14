import Phaser from 'phaser';
import Runner from '../entities/Runner';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) { }

  preload() {
    this.load.spritesheet('char-running', 'assets/run/running.png', {
      frameWidth: 64,
      frameHeight: 93
    });
    this.load.spritesheet('char-idle', 'assets/standing/standing.png', {
      frameWidth: 64,
      frameHeight: 91
    });
    this.load.spritesheet('char-jumping', 'assets/jump/jumping.png', {
      frameWidth: 64,
      frameHeight: 89
    });
  }

  create(data) {
    this.createRunner();

  }

  createRunner() {
    this.runner = new Runner(this, 100, 100);
    this.anims.create({
      key: 'char-idle',
      frames: this.anims.generateFrameNumbers('char-idle', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'char-running',
      frames: this.anims.generateFrameNumbers('char-running', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'char-jumping',
      frames: this.anims.generateFrameNumbers('char-jumping', { start: 0, end: 1 }),
      frameRate: 1,
      repeat: 0
    });
  }

  update(time, delta) { }
}

export default Game;