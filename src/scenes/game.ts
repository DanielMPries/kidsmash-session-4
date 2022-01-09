import { Hero } from "./prefabs/hero";
import { TimerComponent } from "./prefabs/timer-component";

export class GameScene extends Phaser.Scene {
  private gameTimer : TimerComponent | undefined;
  private hero : Hero;

  constructor() {
    super("game-scene");
  }

  preload() {
    this.load.image('tiles', './assets/game/propPack.png');
    this.load.spritesheet('food', './assets/game/food.png', {
      frameWidth:24,
      frameHeight: 24,
      spacing:0,
      margin:0
    });

    // load the json tilemap
    this.load.tilemapTiledJSON('tilemap', './assets/game/level.json');

    Hero.preload(this);
  }

  create() {
    this.hero = new Hero(this, 200, 60);

    const scaleFactor = 2;
    this.cameras.main.fadeIn();

    this.hero.create();

    // create the tilemap
    const map = this.make.tilemap({ key: 'tilemap' });
    this.cameras.main.setBounds(0, 0, map.widthInPixels * scaleFactor, map.heightInPixels * scaleFactor);
    this.physics.world.setBounds(0, 0, map.widthInPixels * scaleFactor, map.heightInPixels * scaleFactor);
    this.cameras.main.startFollow(this.hero);

    let stageBg = this.add.graphics();
    stageBg.fillGradientStyle(0xDD517F, 0xDD517F, 0xE68E36, 0xE68E36);
    stageBg.fillRect(0,0, map.widthInPixels * scaleFactor, this.sys.canvas.height);

    const tileset = map.addTilesetImage('propPack', 'tiles');
    let bg = map.createLayer('Background', tileset, 0, 0).setScale(scaleFactor);

    let bgOverlay = this.add.graphics();
    bgOverlay.fillStyle(0x333, 0.5);
    bgOverlay.setBlendMode(Phaser.BlendModes.DARKEN);
    bgOverlay.fillRect(0,0, map.widthInPixels * 2, this.sys.canvas.height);

    let ground = map.createLayer('Platform', tileset, 0, 0).setScale(2);
    map.setCollisionByExclusion([-1], true);
  
    // create the game timer
    this.gameTimer = new TimerComponent(this, this.sys.canvas.width / 2, 20, 99, () => {
      this.scene.start('credits');
    });

    this.physics.add.collider(this.hero, ground);

    this.gameTimer.start();
  }

  update(time: number, delta: number): void {
      this.hero.update();
  }
}
