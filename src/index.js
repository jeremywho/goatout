import * as PIXI from "pixi.js";
import { Sound } from "@pixi/sound";

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application({
  backgroundColor: 0x1099bb,
  antialias: true
});

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

const goat = PIXI.Sprite.from("src/scream.jpg");
goat.anchor.set(0.5);
goat.position.set(app.renderer.width / 2, app.renderer.height / 2);
goat.visible = false;
app.stage.addChild(goat);

const sound = Sound.from({
  url: "src/scream.mp3",
  preload: true
});

const t = new PIXI.Text("HI THERE!");
t.anchor.set(0.5, 0.5);
t.position.set(app.renderer.width / 2, 20);
app.stage.addChild(t);

const slope = new PIXI.Text("HI THERE!");
slope.anchor.set(0.5, 0.5);
slope.position.set(app.renderer.width / 2, 60);
app.stage.addChild(slope);

const circleSize = 20;

const circle = new PIXI.Graphics();
circle.beginFill(0x1f1ff);
circle.drawCircle(circleSize, circleSize, circleSize);
circle.endFill();
app.stage.addChild(circle);

const paddle = new PIXI.Graphics();
paddle.beginFill(0xffffff);
paddle.drawRect(10, 10, 200, 30);
paddle.endFill();
paddle.y = app.renderer.height - paddle.height - 50;
app.stage.addChild(paddle);

let mouseX = 0;
let mouseY = 0;

onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

let circleXSpeed = -10;
let circleYSpeed = -10;

let started = false;

const reset = () => {
  started = false;
  circle.x = paddle.x + paddle.width / 2;
};

onmouseup = (e) => {
  started = true;
  goat.visible = false;
};

const boxesIntersect = (a, b) => {
  var ab = a.getBounds();
  var bb = b.getBounds();
  return (
    ab.x + ab.width > bb.x &&
    ab.x < bb.x + bb.width &&
    ab.y + ab.height > bb.y &&
    ab.y < bb.y + bb.height
  );
};

app.ticker.add((delta) => {
  paddle.x = mouseX - paddle.width / 2;
  // slope.text = `${(mouseY-circle.y)/(mouseX-circle.x)}`;
  // circle.x += (mouseX - circle.x)/100 *  circleXSpeed * delta;
  // circle.y += (mouseY - circle.y)/100 *  circleYSpeed * delta;

  if (started) {
    circle.x += circleXSpeed * delta;
    circle.y += circleYSpeed * delta;
  } else {
    circle.x = paddle.x + paddle.width / 2;
    circle.y = paddle.y - circle.height + 10;
  }

  if (
    circle.getBounds().bottom >= app.renderer.height ||
    circle.getBounds().top <= 0
  ) {
    circleYSpeed = circleYSpeed * -1;
  }

  if (
    circle.getBounds().right >= app.renderer.width ||
    circle.getBounds().left <= 0
  ) {
    circleXSpeed = circleXSpeed * -1;
  }

  if (boxesIntersect(circle, paddle)) {
    circleYSpeed = circleYSpeed * -1;
  }

  if (started && circle.getBounds().bottom >= paddle.getBounds().top + 20) {
    goat.visible = true;
    const instance = sound.play();
    instance.on("end", function () {
      goat.visible = false;
    });
    reset();
  }

  // if (
  //   circle.x >= paddle.getBounds().left &&
  //   circle.x <= paddle.getBounds().right &&
  //   circle.getBounds().bottom >= paddle.getBounds().top
  // ) {
  //   circleYSpeed = circleYSpeed * -1;
  // }
  // Rotate mr rabbit clockwise
  // bunny.rotation += 0.1 * delta;
  t.text = `${mouseX}, ${mouseY}`;
});
