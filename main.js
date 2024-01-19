const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const MOVE_MIN_VAL = 0.5
const FREQ = 100
const MM_IN_INCH = 25.4
const MM_IN_METR = 1000

class GameOpt {
  constructor() {
    this.pixelsOnMm = 3
    this.pixelsOnMetr = 3000

    this.ball = null

    this.obj = {
      frictionFactor: 1,
      friction: 0.2,
      bounceFactor: 0.5,
      weigth: 2,
      dragFactor: 0.98,
    }

    this.accelerationGravity = {
      freq: 0,
      x: 0,
      y: 0,
      z: 0,
    }

    this.pointerStart = null
    this.lastPointerTime = 0
    this.forceMultiplier = 500
    this.forceMultiplierDevice = 500
    this.collisionSound = null

    this.orientation = {
      freq: 0,
      alpha: 0,
      beta: 0,
      gamma: 0,
    }

    this.setPixelsCount()
    this.gravityController()
  }

  // handleOrientation(event) {
  //   if (event.timeStamp - this.orientation.freq > FREQ) {
  //     this.orientation = {
  //       freq: event.timeStamp,
  //       alpha: event.alpha,
  //       beta: event.beta,
  //       gamma: event.gamma,
  //     }
  //   }
  // }

  preload() {
    this.load.image('ball', './assets/football.png')
    this.load.audio('collision', './assets/collide.mp3')
  }

  create() {
    this.ball = this.matter.add.sprite(WIDTH / 2, HEIGHT / 2, 'ball')
    this.ball.setScale(0.15, 0.15)
    this.ball.setCircle()
    this.ball.setBounce(this.obj.bounceFactor)
    this.ball.setFriction(this.obj.friction)
    this.ball.setInteractive()
    this.ball.setCollideWorldBounds(true)

    // window.addEventListener('devicemotion', this.handleDeviceAcceleration.bind(this))
    window.addEventListener('click', () => {
      console.log('accelerationGravity', this.accelerationGravity)
    })

    this.collisionSound = this.sound.add('collision')

    // this.input.on('pointerdown', this.handleSwipeStart.bind(this))
    // this.input.on('pointermove', this.handleSwipeMove.bind(this))
    // this.input.on('pointerup', this.handleSwipeEnd.bind(this))

    // window.addEventListener('deviceorientation', this.handleOrientation.bind(this))
  }

  update() {
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

  // handleSwipeStart(pointer) {
  //   this.pointerStart = {
  //     x: pointer.position.x,
  //     y: pointer.position.y2
  //   }

  //   this.lastPointerTime = this.time.now
  // }

  // handleSwipeMove(pointer) {
  //   if (this.pointerStart) {
  //     const currentTime = this.time.now
  //     const deltaTime = currentTime - this.lastPointerTime

  //     const swipeDistanceX = pointer.position.x - this.pointerStart.x
  //     const swipeDistanceY = pointer.position.y - this.pointerStart.y

  //     const angle = Math.atan2(swipeDistanceY, swipeDistanceX)

  //     const swipeSpeed = Math.sqrt(swipeDistanceX ** 2 + swipeDistanceY ** 2) / deltaTime

  //     const velocityX = Math.cos(angle) * swipeSpeed * this.forceMultiplier
  //     const velocityY = Math.sin(angle) * swipeSpeed * this.forceMultiplier

  //     this.ball.setVelocity(velocityX, velocityY)
  //   }
  // }

  // handleSwipeEnd() {
  //   this.pointerStart = null
  // }

  handleDeviceAcceleration(event) {
    if (event.timeStamp - this.accelerationGravity.freq > FREQ) {
      this.accelerationGravity = {
        freq: event.timeStamp,
        x: event.acceleration.x,
        y: event.acceleration.y,
        z: event.acceleration.z,
      }

      if (Math.abs(this.accelerationGravity.x) > 0.3) {
        const xVel = -1 * this.accelerationGravity.x / this.obj.weigth * this.pixelsOnMetr * (this.obj.frictionFactor || 1)
        this.ball.setVelocityX(xVel)
      }

      if (Math.abs(this.accelerationGravity.y) > 0.3) {
        const yVel = -1 * this.accelerationGravity.y / this.obj.weigth * this.pixelsOnMetr * (this.obj.frictionFactor || 1)
        this.ball.setVelocityY(yVel)
      }
    }
  }

  createBorderWalls() {
    const { width, height } = this.sys.game.canvas

    const borderThickness = 1

    this.matter.add.rectangle(width / 2, 0, width, borderThickness, { isStatic: true })
    this.matter.add.rectangle(width / 2, height, width, borderThickness, { isStatic: true })
    this.matter.add.rectangle(0, height / 2, borderThickness, height, { isStatic: true })
    this.matter.add.rectangle(width, height / 2, borderThickness, height, { isStatic: true })
  }

  gravityController() {
    const gravitySensor = new GravitySensor({ frequency: 30 })

    gravitySensor.addEventListener('reading', () => {
      const x = Math.round(gravitySensor.x * this.pixelsOnMetr * (this.obj.frictionFactor || 1)) / 1000
      const y = Math.round(gravitySensor.y * this.pixelsOnMetr * (this.obj.frictionFactor || 1)) / 1000

      this.matter.world.gravity.setTo(-1 * x, y)
    })

    gravitySensor.start()
  }

  setPixelsCount() {
    const screenSizeElem = document.querySelector('.screen-size')

    if (screenSizeElem) {
      this.pixelsOnMm = Math.round(screenSizeElem.getBoundingClientRect().width / MM_IN_INCH * 10) / 10
      this.pixelsOnMetr = this.pixelsOnMm * MM_IN_METR
    }
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
    default: 'matter',
    matter: {
      gravity: { y: 0.2 },
      enableSleeping: true,
    }
  },
  scene: GameOpt
}

const game = new Phaser.Game(config)
