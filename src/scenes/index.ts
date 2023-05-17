import { Scene, GameObjects } from 'phaser';
import {Player} from "../classes/player"

export class LoadingScene extends Scene {
  private king!: GameObjects.Sprite;
  private demon!: GameObjects.Sprite;
  private player!: Player;

  private i: number = 0;
  constructor() {
    super('loading-scene');
  }

  preload(): void {
      this.load.baseURL = 'assets/';
      
    // PLAYER LOADING
    this.load.image('king', 'sprites/king.png');
    this.load.atlas('a-king', 'spritesheets/a-king.png', 'spritesheets/a-king_atlas.json');
    this.load.image('belphegor', 'sprites/belphegor.png');
  }

  create(): void {
    //this.scene.start('level-1-scene');
    //this.scene.start('ui-scene')
    this.king = this.add.sprite(100, 100, 'king');
    this.demon = this.add.sprite(150, 100, 'belphegor');
    this.player = new Player(this, 100, 100);
  }

  update(): void {
    //console.log(`${this.i++} - count`)
    this.player.update();
  }
}