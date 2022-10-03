import Phaser from 'phaser';
import Runner from '../entities/Runner';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    this.obstacleItems = [{
      name: 'blue-boulder',
      width: 32,
      height: 33
    }, {
      name: 'red-boulder',
      width: 64,
      height: 65
    }, {
      name: 'grey-boulder',
      width: 64,
      height: 65
    }, {
      name: 'poop',
      width: 50,
      height: 41
    }];
    this.obstacleSpeed = -200;
    this.gameOver = false;
    this.difficulty = 0;
    this.score = 0;
    this.backgroundSpeed = 1;
    this.fontOptions = {
      fontSize: `${this.fontSize}px`, 
      fill: '#1D1D1D',
      fontFamily: 'sans-serif'
  }
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
    this.load.image('sky', 'assets/environment/sky.png');
    this.load.image('trees', 'assets/environment/trees.png');
    this.load.image('ground', 'assets/environment/ground.png');
    this.load.image('poop', 'assets/environment/poop.png');
    this.load.image('grey-boulder', 'assets/environment/grey_small.png');
    this.load.image('blue-boulder', 'assets/environment/blue_small.png');
    this.load.image('red-boulder', 'assets/environment/red_small.png');
  }

  create(data) {
    this.createRunner();
    this.createAnimations();
    this.createBackground();
    this.createGround();
    this.createObstacles();
    this.createScore();
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
      this.ground.create(x, this.game.config.height, 'ground')
        .setDepth(0)
        .setOrigin(0, 0.5);
    }
    this.physics.add.collider(this.runner, this.ground);

  }

  createBackground() {
    this.skyBackground = this.add.tileSprite(0, 0, this.width, this.height, 'sky').setOrigin(0).setDepth(-2);
    this.treesBackground = this.add.tileSprite(0, 0, this.width, this.height, 'trees').setOrigin(0).setDepth(-1);
  }

  createObstacles() {
    this.obstacles = this.physics.add.group();
    let x = this.game.config.width;
    for (let i = 0; i < 5; i++) {
      this.addNewObstacle(x);
      x += Phaser.Math.Between(600, 1000);
    }

    this.obstacles.setVelocityX(this.obstacleSpeed);
    this.physics.add.collider(this.obstacles, this.runner, this.endGame.bind(this));
  }

  createScore() {
    this.score = 0;
    this.scoreText = this.add.text(10, 10, `SCORE: ${this.score}`, this.fontOptions);
  }

  update(time, delta) {
    this.updateObstacles();
    this.updateBackground();
    if (this.score % 10 == 0) {
      if (this.difficultyJustSet) return;
      this.difficultyJustSet = true;
      this.backgroundSpeed += 0.1;
    }
  }

  addNewObstacle(x) {
    const image = this.obstacleItems[Phaser.Math.Between(0, 3)];
    this.obstacles.create(x, this.game.config.height - 40, image.name)
      .setImmovable(true)
      .setVelocityX(this.obstacleSpeed - (this.difficulty))
      .setSize(image.width, image.height);
  }

  updateObstacles() {
    this.obstacles.getChildren().forEach(obstacle => {
      if (obstacle.getBounds().right < 0) {
        obstacle.destroy();
        this.addNewObstacle(this.getLastObstacleX() + Phaser.Math.Between(600, 1000));
        this.difficulty++;
        this.updateScore();
      }
    })
  }

  updateScore() {
    this.score++;
    this.scoreText.setText(`SCORE: ${this.score}`);
    if (this.score % 10 !== 0 && this.difficultyJustSet) {
      this.difficultyJustSet = false;
    }
  }


  getLastObstacleX() {
    let endX = 0;
    this.obstacles.getChildren().forEach(obstacle => {
      endX = Math.max(obstacle.x, endX);
    })
    return endX;
  }

  updateBackground() {
    if (!this.gameOver) {

      this.skyBackground.tilePositionX += 2 * this.backgroundSpeed;
      this.treesBackground.tilePositionX += 3 * this.backgroundSpeed;
    }
  }

  endGame() {
    this.gameOver = true;
    this.runner.die();
    this.obstacles.setVelocityX(0);
  }

}

export default Game;