import { Actor } from './actor';
import { EVENTS_NAME } from '../consts';
export class Player extends Actor {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private keySpace: Phaser.Input.Keyboard.Key;
    //private leftStick: Phaser.Math.Vector2;
    private gp!: typeof Phaser.Input.Gamepad;
    private SPEED = 110;

    private attackButtonPressed = false;
    private lastPressTime = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'king');

        // KEYS
        this.keyW = this.scene.input.keyboard!.addKey('W');
        this.keyA = this.scene.input.keyboard!.addKey('A');
        this.keyS = this.scene.input.keyboard!.addKey('S');
        this.keyD = this.scene.input.keyboard!.addKey('D');
        this.keySpace = this.scene.input.keyboard!.addKey(32);

        // PHYSICS
        this.getBody().setSize(30, 30);
        this.getBody().setOffset(8, 0);

        this.initAnimations();

        this.keySpace.on('down', (event: KeyboardEvent) => {
            this.anims.play('attack', true);
            this.scene.game.events.emit(EVENTS_NAME.attack);
        })

    }
  

    handleButtonPress(): void {
        // The L2 Button is a continuous trigger so we set a flag 
        // to set some rate limiting
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.lastPressTime;
        const COOLDOWN_PERIOD = 50;

        if (this.attackButtonPressed && elapsedTime < COOLDOWN_PERIOD) {
            this.handleButtonRelease();
        } else {
            //console.log('Button pressed')
             this.anims.play('attack', true);
        }

        this.attackButtonPressed = true;
        this.lastPressTime = currentTime;
    }

    handleButtonRelease(): void {
        this.attackButtonPressed = false;
    }

    update(): void {
        const [gp] = navigator.getGamepads();

        this.getBody().setVelocity(0);
        if (this.keyW.isDown) {
            this.body!.velocity.y = -110;
            !this.anims.isPlaying && this.anims.play('run', true)
        }
        if (this.keyA.isDown) {
            this.body!.velocity.x = -110;
            this.checkFlip();
            this.getBody().setOffset(48, 15);
            !this.anims.isPlaying && this.anims.play('run', true)
        }
        if (this.keyS.isDown) {
            this.body!.velocity.y = 110;
            !this.anims.isPlaying && this.anims.play('run', true);
        }
        if (this.keyD.isDown) {
            this.body!.velocity.x = 100;
            this.checkFlip();
            this.getBody().setOffset(15, 15);
            !this.anims.isPlaying && this.anims.play('run', true);
        }
        // The X-axis
        if (gp && (gp.axes[0] > 0.1 || gp.axes[0] < -0.1)) {
            this.body!.velocity.x = this.SPEED * gp?.axes[0]
            this.checkFlip();
            this.getBody().setOffset(48, 15);
            !this.anims.isPlaying && this.anims.play('run', true);
        }
        // The Y-axis
        if (gp && (gp.axes[1] > 0.1 || gp.axes[1] < -0.1)) {
          this.body!.velocity.y = this.SPEED * gp.axes[1];
          this.checkFlip();
          this.getBody().setOffset(15, 15);
          !this.anims.isPlaying && this.anims.play('run', true);
        }
        // L2 Button
        if (gp && (gp.buttons[6].pressed)) {
            this.handleButtonPress();
        }

    }

    private initAnimations(): void {
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNames('a-king', {
                prefix: 'run-',
                end: 7
            }),
            frameRate: 24
        })
        this.scene.anims.create({
            key: 'attack',
            frames: this.scene.anims.generateFrameNames('a-king', {
                prefix: 'attack-',
                end: 2,
            }),
            frameRate: 24
        })
    }

}