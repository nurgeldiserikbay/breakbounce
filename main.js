const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

class GameOpt {
  constructor() {
    this.ball = null
    this.pointerStart = null
    this.lastPointerTime = 0
  }

  preload() {
    this.load.image('ball', './assets/football.png')
  }
  
  create() {
    this.ball = this.physics.add.sprite(WIDTH / 2, HEIGHT / 2, 'ball')
    this.ball.setScale(0.15, 0.15)
    this.ball.setInteractive()
    this.ball.setCollideWorldBounds(true)

    this.input.on('pointerdown', this.handleSwipeStart.bind(this))
    this.input.on('pointermove', this.handleSwipeMove.bind(this))
    this.input.on('pointerup', this.handleSwipeEnd.bind(this))

    window.addEventListener('devicemotion', this.handleDeviceOrientation.bind(this), true)
  }
  
  update() {}

  handleSwipeStart(pointer) {
    this.pointerStart = {
      x: pointer.position.x,
      y: pointer.position.y
    }

    this.lastPointerTime = this.time.now
  }

  handleSwipeMove(pointer) {
    if (this.pointerStart) {
      const currentTime = this.time.now
      const deltaTime = currentTime - this.lastPointerTime

      const swipeDistanceX = pointer.position.x - this.pointerStart.x
      const swipeDistanceY = pointer.position.y - this.pointerStart.y

      const forceMultiplier = 500

      const angle = Math.atan2(swipeDistanceY, swipeDistanceX)

      const swipeSpeed = Math.sqrt(swipeDistanceX ** 2 + swipeDistanceY ** 2) / deltaTime
  
      const velocityX = Math.cos(angle) * swipeSpeed * forceMultiplier
      const velocityY = Math.sin(angle) * swipeSpeed * forceMultiplier

      this.ball.setVelocity(velocityX, velocityY)

      const bounceFactorX = 0.5
      const bounceFactorY = 0.5

      this.ball.setBounce(bounceFactorX, bounceFactorY)
    }
  }

  handleSwipeEnd() {
    // this.ball.setVelocity(0, 0)
    
    this.pointerStart = null
  }

  handleDeviceOrientation(event) {
    const accelerationX = event.acceleration.x
    const accelerationY = event.acceleration.y
    const accelerationZ = event.acceleration.Z

    console.log(accelerationX, accelerationY, accelerationZ)

    // const accelerationMultiplierX = 0.1
    // const accelerationMultiplierY = 0.1

    // const velocityX = accelerationX * accelerationMultiplierX
    // const velocityY = accelerationY * accelerationMultiplierY

    // this.ball.setVelocity(velocityX, velocityY)
  }
}

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WIDTH,
    height: HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: GameOpt
}
console.log('window.DeviceMotionEvent', window.DeviceMotionEvent)
const game = new Phaser.Game(config)
