class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
    this.direction = "left";
  }

  draw() {
    const frameWidth = this.image.width / this.framesMax;

    c.save();

    if (this.direction === "left") {
      c.scale(-1, 1);
      c.drawImage(
        this.image,
        this.framesCurrent * frameWidth,
        0,
        frameWidth,
        this.image.height,
        -(this.position.x + frameWidth * this.scale - this.offset.x),
        this.position.y - this.offset.y,
        frameWidth * this.scale,
        this.image.height * this.scale
      );
    } else {
      c.drawImage(
        this.image,
        this.framesCurrent * frameWidth,
        0,
        frameWidth,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        frameWidth * this.scale,
        this.image.height * this.scale
      );
    }

    c.restore();
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;
    this.jumpCount = 0;
    this.grounded = true;
    for (const sprite in this.sprites) {
      if (Object.hasOwnProperty.call(this.sprites, sprite)) {
        this.sprites[sprite].image = new Image();
        this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
      }
    }
  }

  update() {
    this.draw();
    if (!this.dead) this.animateFrames();

    if (this.position.y + this.height >= canvas.height - 96) {
      this.grounded = true;
      this.jumpCount = 0;
    } else {
      this.grounded = false;
    }
    if (this.direction === "right") {
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    } else {
      this.attackBox.position.x =
        this.position.x +
        this.width -
        this.attackBox.width -
        this.attackBox.offset.x;
    }
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }

  Pattack() {
    this.switchSprite("attack1");
    if (this.direction === "right") {
      this.attackBox.offset.x = 170;
    } else {
      this.attackBox.offset.x = -170;
    }
    this.isAttacking = true;
  }
  Pattack2() {
    this.switchSprite("attack2");
    if (this.direction === "right") {
      this.attackBox.offset.x = 170;
    } else {
      this.attackBox.offset.x = -170;
    }
    this.isAttacking = true;
  }
  Eattack() {
    this.switchSprite("attack1");
    if (this.direction === "left") {
      this.attackBox.offset.x = 170;
    } else {
      this.attackBox.offset.x = -170;
    }
    this.isAttacking = true;
  }
  Eattack2() {
    this.switchSprite("attack2");
    if (this.direction === "left") {
      this.attackBox.offset.x = 150;
    } else {
      this.attackBox.offset.x = -150;
    }
    this.isAttacking = true;
  }
  takeHit() {
    this.health -= 5;

    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) {
        this.dead = true;
      }
      return;
    }

    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    ) {
      return;
    }
    if (
      this.image === this.sprites.attack2.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    ) {
      return;
    }

    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    ) {
      return;
    }

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack2":
        if (this.image !== this.sprites.attack2.image) {
          this.image = this.sprites.attack2.image;
          this.framesMax = this.sprites.attack2.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
