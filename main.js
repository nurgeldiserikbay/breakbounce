const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const MOVE_MIN_VAL = 0.5
const FREQ = 100

class GameOpt {
  constructor() {
    this.ball = null
    this.pointerStart = null
    this.lastPointerTime = 0
    this.forceMultiplier = 500
    this.forceMultiplierDevice = 500
    this.collisionSound = null
    this.bounceFactor = 0.5

    this.gravityPixels = 300

    this.orientation = {
      freq: 0,
      alpha: 0,
      beta: 0,
      gamma: 0,
    }

    this.acceleration = {
      freq: 0,
      x: 0,
      y: 0,
      z: 0,
    }
  }

  getGravityValues() {
    return [
      this.gravityPixels ,
      this.gravityPixels,
    ]
  }

  preload() {
    this.load.image('ball', './assets/football.png')
    this.load.audio('collision', './assets/collide.mp3')
  }
  
  create() {
    this.ball = this.physics.add.sprite(WIDTH / 2, HEIGHT / 2, 'ball')
    this.ball.setScale(0.15, 0.15)
    this.ball.setInteractive()
    this.ball.setCollideWorldBounds(true)

    this.ball.setBounce(this.bounceFactor, this.bounceFactor)

    this.collisionSound = this.sound.add('collision')

    this.input.on('pointerdown', this.handleSwipeStart.bind(this))
    this.input.on('pointermove', this.handleSwipeMove.bind(this))
    this.input.on('pointerup', this.handleSwipeEnd.bind(this))

    window.addEventListener('deviceorientation', this.handleOrientation.bind(this))
    window.addEventListener('devicemotion', this.handleDeviceAcceleration.bind(this))
    window.addEventListener('click', () => {
      console.log('orientation', anglesToCoordinates(this.orientation))
      console.log('acceleration', this.acceleration)
    })
  }

  handleOrientation(event) {
    if (event.timeStamp - this.orientation.freq > FREQ) {
      this.orientation = {
        freq: event.timeStamp,
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      }
    }
  }

  handleDeviceAcceleration(event) {
    if (event.timeStamp - this.acceleration.freq > FREQ) {
      this.acceleration = {
        freq: event.timeStamp,
        x: event.acceleration.x,
        y: event.acceleration.y,
        z: event.acceleration.z,
      }
    }
  }
  
  update() {
    this.physics.world.gravity.setTo(...this.getGravityValues())

    if (this.ball.x - this.ball.displayWidth / 2 <= 0 || this.ball.x + this.ball.displayWidth / 2 >= config.width || this.ball.y - this.ball.displayHeight / 2 <= 0 || this.ball.y + this.ball.displayHeight / 2 >= config.height) {
      this.handleCollision(this.ball)
    }
  }

  handleCollision(obj1) {
    const force = Math.abs(obj1.body.velocity.x) + Math.abs(obj1.body.velocity.y)

    var volume = Phaser.Math.Clamp(force / 100, 0, 1)
    this.collisionSound.volume = volume
    this.collisionSound.play()
  }

  handleSwipeStart(pointer) {
    this.pointerStart = {
      x: pointer.position.x,
      y: pointer.position.y2
    }

    this.lastPointerTime = this.time.now
  }

  handleSwipeMove(pointer) {
    if (this.pointerStart) {
      const currentTime = this.time.now
      const deltaTime = currentTime - this.lastPointerTime

      const swipeDistanceX = pointer.position.x - this.pointerStart.x
      const swipeDistanceY = pointer.position.y - this.pointerStart.y

      const angle = Math.atan2(swipeDistanceY, swipeDistanceX)

      const swipeSpeed = Math.sqrt(swipeDistanceX ** 2 + swipeDistanceY ** 2) / deltaTime
  
      const velocityX = Math.cos(angle) * swipeSpeed * this.forceMultiplier
      const velocityY = Math.sin(angle) * swipeSpeed * this.forceMultiplier

      this.ball.setVelocity(velocityX, velocityY)
    }
  }

  handleSwipeEnd() {
    this.pointerStart = null
  }

  // handleDeviceAcceleration(event) {
  //   let accelerationX = 0
  //   let accelerationY = 0

  //   if (Math.abs(accelerationX) > MOVE_MIN_VAL) {
  //     // console.log(`x = ${accelerationX};`)
  //     accelerationX = -1 * this.forceMultiplierDevice * event.acceleration.x
  //     this.ball.setVelocityX(accelerationX)
  //   }
  //   if (Math.abs(accelerationY) > MOVE_MIN_VAL) {
  //     // console.log(`y = ${accelerationY};`)
  //     accelerationY = this.forceMultiplierDevice * event.acceleration.y
  //     this.ball.setVelocityY(accelerationY)
  //   }
  // }
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
      gravity: { y: 200 },
      debug: false
    }
  },
  scene: GameOpt
}

const game = new Phaser.Game(config)

function anglesToCoordinates({ alpha, beta, gamma }) {
  const alphaRad = alpha * (Math.PI / 180)
  const betaRad = beta * (Math.PI / 180)
  const gammaRad = gamma * (Math.PI / 180)

  const x = Math.cos(betaRad) * Math.cos(gammaRad)
  const y = Math.cos(alphaRad) * Math.sin(gammaRad) + Math.sin(alphaRad) * Math.sin(betaRad) * Math.cos(gammaRad)
  const z = Math.sin(alphaRad) * Math.sin(gammaRad) - Math.cos(alphaRad) * Math.sin(betaRad) * Math.cos(gammaRad)

  return [x, y, z]
}