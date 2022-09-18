import Phaser from "phaser";
import StateMachine from "javascript-state-machine";

class Runner extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'char-idle');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.gravity.y = 750;
        this.started = true;
        this.input = {};
        
        this.setupAnimations();
        this.setupMovement();
    }

    setupAnimations() {
        this.animState = new StateMachine({
            init: 'idle',
            transitions: [
                { name: 'idle', from: '*', to: 'idle' },
                { name: 'run', from: ['idle','jumping'], to: 'running' },
                { name: 'jump', from: ['idle', 'running'], to: 'jumping' }
            ],
            methods: {
                onEnterState: (lifecycle) => {
                    console.log(lifecycle)
                    this.anims.play(`char-${lifecycle.to}`);
                }
            }
        });
        this.animPredicates = {
            idle: () => {
                return !this.started;
            },
            run: () => {
                return this.body.onFloor() && this.started;
            },
            jump: () => {
                return this.body.velocity.y < 0;
            }

        };
    }

    setupMovement() {
        this.moveState = new StateMachine({
            init: 'standing',
            transitions: [
                { name: 'jump', from: 'standing', to: 'jumping'},
                { name: 'touchdown', from: 'jumping', to: 'standing' }
            ],
            methods: {
                onEnterState: (lifecycle) => {
                    console.log(lifecycle);
                },
                onJump: () => {
                    this.body.setVelocityY(-500);
                }
            }
        });

        this.movePredicates = {
            jump: () => {
                return this.input.didClick;
            },
            touchdown: () => {
                return this.body.onFloor();
            }
        };
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.input.didClick = this.scene.input.activePointer.leftButtonDown();

        for (const t of this.moveState.transitions()){
            if(t in this.movePredicates && this.movePredicates[t]()) {
                this.moveState[t]();
                break;
            }
        }
        for (const t of this.animState.transitions()) {
            if (t in this.animPredicates && this.animPredicates[t]()) {
                this.animState[t]();
                break;
            }
        }
    }
}

export default Runner;