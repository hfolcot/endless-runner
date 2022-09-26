import Phaser from 'phaser';
import Runner from '../entities/Runner';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    this.obstacleImages = ['blue-boulder', 'red-boulder', 'grey-boulder', 'poop'];
    this.obstacleSpeed = -300;
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
    this.load.spritesheet('char-dead', 'assets/dizzy/dead.png', {
      frameWidth: 64,
      frameHeight: 97
    });
    this.load.image('ground', 'assets/environment/ground.png');
    this.load.image('poop', 'assets/environment/poop.png');
    this.load.image('grey-boulder', 'assets/environment/grey_small.png');
    this.load.image('blue-boulder', 'assets/environment/blue_small.png');
    this.load.image('red-boulder', 'assets/environment/red_small.png');
  }

  create(data) {
    this.createRunner();
    this.createAnimations();
    this.createGround();
    this.createObstacles();
  }

  createRunner() {
    this.runner = new Runner(this, 100, this.game.config.height * 0.75);

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
    this.anims.create({
      key: 'char-dead',
      frames: this.anims.generateFrameNumbers('char-dead', { start: 0, end: 1 }),
      frameRate: 3,
      repeat: -1
    });
  }

  createGround() {
    this.ground = this.physics.add.staticGroup();
    for (let i = 0; i < 15; i++) {
      let x = i * 64;
      this.ground.create(x, this.game.config.height, 'ground');
    }
    this.physics.add.collider(this.runner, this.ground);

  }

  createObstacles() {
    this.obstacles = this.physics.add.group();
    let x = this.game.config.width;
    for (let i = 0; i < 5; i++) {
      this.addNewObstacle(x);
      x += Phaser.Math.Between(600, 1000);
    }

    this.obstacles.setVelocityX(-400);
    this.physics.add.collider(this.obstacles, this.runner, this.endGame.bind(this));
  }


  update(time, delta) {
    this.updateObstacles();
  }

  addNewObstacle(x) {
    const image = this.obstacleImages[Phaser.Math.Between(0, 3)];
    this.obstacles.create(x, this.game.config.height - 40, image).setImmovable(true).setVelocityX(this.obstacleSpeed);
  }

  updateObstacles() {
    this.obstacles.getChildren().forEach(obstacle => {
      if (obstacle.getBounds().right < 0) {
        obstacle.destroy();
        this.addNewObstacle(this.getLastObstacleX() + Phaser.Math.Between(600, 1000));
      }
    })
  }

  getLastObstacleX() {
    let endX = 0;
    this.obstacles.getChildren().forEach(obstacle => {
      endX = Math.max(obstacle.x, endX);
    })
    return endX;
  }

  endGame() {
    this.runner.die();
    this.obstacles.setVelocityX(0);
  }

}

export default Game;