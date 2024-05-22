const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const runSound = new Audio(
  "./Sound/Y2meta.app - Sound Effect - Suara Langkah Orang Lari_Jogging (no copy right) (320 kbps).mp3"
);
const attackSound = new Audio(
  "./Sound/Y2meta.app - Sound Effect Bunyi Pedang (320 kbps).mp3"
);
function PlaySound(sound) {
  sound.currentTime = 0;
  sound.play();
}
let isPlayerRunningSoundPlaying = false;
let isEnemyRunningSoundPlaying = false;


function playSoundForDuration(sound, duration) {
  sound.currentTime = 0;
  sound.play();
  setTimeout(() => {
    sound.pause();
    sound.currentTime = 0;
  }, duration);
}

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    attack2: {
      imageSrc: "./img/samuraiMack/Attack2.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 170,
      y: 50,
    },
    width: 160,
    height: 50,
  },
  maxJumps: 2,
  jumpsLeft: 2,
});

const enemy = new Fighter({
  position: {
    x: 900,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    attack2: {
      imageSrc: "./img/kenji/Attack2.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
  maxJumps: 2, // Maximum number of jumps
  jumpsLeft: 2, // Number of jumps remaining
});

console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -2;
    player.switchSprite("run");
    player.direction = "left";
    if (!isPlayerRunningSoundPlaying) {
      playSoundForDuration(runSound, 2000);
      isPlayerRunningSoundPlaying = true;
    }
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 2;
    player.switchSprite("run");
    player.direction = "right";
    if (!isPlayerRunningSoundPlaying) {
      playSoundForDuration(runSound, 2000);
      isPlayerRunningSoundPlaying = true;
    }
  } else {
    player.switchSprite("idle");
    if (isPlayerRunningSoundPlaying) {
      runSound.pause();
      runSound.currentTime = 0;
      isPlayerRunningSoundPlaying = false;
    }
  }
  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // Ensure player does not go out of canvas boundaries
  player.position.x = Math.max(
    0,
    Math.min(player.position.x + player.velocity.x, canvas.width - player.width)
  );
  player.position.y = Math.max(
    0,
    Math.min(
      player.position.y + player.velocity.y,
      canvas.height - player.height
    )
  );

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -2;
    enemy.switchSprite("run");
    enemy.direction = "right";
    if (!isEnemyRunningSoundPlaying) {
      playSoundForDuration(runSound, 2000);
      isEnemyRunningSoundPlaying = true;
    }
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 2;
    enemy.switchSprite("run");
    enemy.direction = "left";
    if (!isEnemyRunningSoundPlaying) {
      playSoundForDuration(runSound, 2000);
      isEnemyRunningSoundPlaying = true;
    }
  } else {
    enemy.switchSprite("idle");
    if (isEnemyRunningSoundPlaying) {
      runSound.pause();
      runSound.currentTime = 0;
      isEnemyRunningSoundPlaying = false;
    }
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }
  // Ensure enemy does not go out of canvas boundaries
  enemy.position.x = Math.max(
    0,
    Math.min(enemy.position.x + enemy.velocity.x, canvas.width - enemy.width)
  );
  enemy.position.y = Math.max(
    0,
    Math.min(enemy.position.y + enemy.velocity.y, canvas.height - enemy.height)
  );
  // detect for collision & enemy gets hit

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 2
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 4) {
    enemy.isAttacking = false;
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        playSoundForDuration(runSound, 2000);
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        playSoundForDuration(runSound, 2000);
        break;
      case "w":
        if (player.jumpCount < 3 && player.grounded) {
          // Check if grounded
          player.velocity.y = -12;
          player.jumpCount++;
        }
        break;
      case " ":
        player.Pattack();
        PlaySound(attackSound);
        break;
      case "c":
        player.Pattack2();
        PlaySound(attackSound);
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        playSoundForDuration(runSound, 2000);
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        playSoundForDuration(runSound, 2000);
        break;
      case "ArrowUp":
        if (enemy.jumpCount < 3 && enemy.grounded) {
          // Check if grounded
          enemy.velocity.y = -12;
          enemy.jumpCount++;
        }

        break;
      case "'":
        enemy.Eattack();
        PlaySound(attackSound);
        break;
      case "/":
        enemy.Eattack2();
        PlaySound(attackSound);
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  // enemy keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
