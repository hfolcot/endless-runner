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
    this.load.image('ground', 'assets/environment/2.png');
  }

  create(data) {
    this.createRunner();
    this.createAnimations();
    this.createGround();
    
  }

  createRunner() {
    this.runner = new Runner(this, 100, this.game.config.height*0.75);

  }

  createAnimations() {
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
      frameRate: 1.5,
      repeat: 0
    });
  }

  createGround() {
    this.ground = this.physics.add.group();
    for(let i=0; i<15; i++){
      let x = i * 64;
      const groundSegment = this.ground.create(x, this.game.config.height, 'ground')
                .setImmovable(true)
                .setOrigin(0, 1);
    }
    this.ground.setVelocityX(-200);
    this.physics.add.collider(this.runner, this.ground);
    
  }

  update(time, delta) {
    this.updateGround();
   }

   updateGround() {
    this.ground.getChildren().forEach(segment => {
      if(segment.getBounds().right < 0){
        segment.x = 64*14;
      }
    })
   }

}

export default Game;