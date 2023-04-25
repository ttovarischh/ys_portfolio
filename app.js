const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;
const iEngine = Engine.create();
const iRunner = Runner.create();
const iRender = Render.create({
  element: document.body,
  engine: iEngine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: "transparent",
  },
});
function addCircles() {
  const promises = [];
  for (let i = 0; i < 36; i++) {
    const img = new Image();
    img.src = `images/bottles/bottle${i}.png`;
    const promise = new Promise((resolve) => {
      img.onload = () => {
        resolve({
          img,
          circle: Bodies.rectangle(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight,
            img.width * 0.15,
            img.height * 0.15,
            {
              render: {
                sprite: {
                  texture: img.src,
                  xScale: 0.15,
                  yScale: 0.15,
                },
              },
            }
          ),
        });
      };
    });
    promises.push(promise);
  }
  Promise.all(promises).then((values) => {
    const circles = values.map((value) => value.circle);
    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + 27,
      window.innerWidth,
      60,
      {
        isStatic: true,
        label: "Ground",
        render: {
          fillStyle: "#E8E8E8",
        },
      }
    );
    const leftWall = Bodies.rectangle(
      -12,
      window.innerHeight / 2,
      30,
      window.innerHeight,
      {
        isStatic: true,
        label: "LeftWall",
        render: {
          fillStyle: "#E8E8E8",
        },
      }
    );
    const rightWall = Bodies.rectangle(
      window.innerWidth + 15,
      window.innerHeight / 2,
      30,
      window.innerHeight,
      {
        isStatic: true,
        label: "RightWall",
        render: {
          fillStyle: "#E8E8E8",
        },
      }
    );
    Composite.add(iEngine.world, [...circles, ground, leftWall, rightWall]);
  });
}
addCircles();
Render.run(iRender);
Runner.run(iRunner, iEngine);
iRender.canvas.addEventListener("mousemove", (event) => {
  const mousePosition = {
    x: event.offsetX,
    y: event.offsetY,
  };
  const queryResult = Matter.Query.point(iEngine.world.bodies, mousePosition);
  if (queryResult.length > 0) {
    const body = queryResult[0];
    if (body) {
      const forceMagnitude = 0.01;
      const force = {
        x: (mousePosition.x - body.position.x) * forceMagnitude,
        y: (mousePosition.y - body.position.y) * forceMagnitude,
      };
      Matter.Body.applyForce(body, body.position, force);
    }
  }
});

window.addEventListener("resize", () => {
  iRender.canvas.width = window.innerWidth;
  iRender.canvas.height = window.innerHeight;

  const ground = iEngine.world.bodies.find((body) => body.label === "Ground");
  const leftWall = iEngine.world.bodies.find(
    (body) => body.label === "LeftWall"
  );
  const rightWall = iEngine.world.bodies.find(
    (body) => body.label === "RightWall"
  );

  console.log(ground)

  // Update the position and dimensions of the ground body
  Matter.Body.setPosition(ground, {
    x: window.innerWidth / 2,
    y: window.innerHeight + 27,
  });
  Matter.Body.setInertia(ground, Infinity);
  Matter.Body.setVertices(ground, [
    { x: -window.innerWidth / 2, y: -60 },
    { x: window.innerWidth / 2, y: -60 },
    { x: window.innerWidth / 2, y: 60 },
    { x: -window.innerWidth / 2, y: 60 },
  ]);

  // Update the position and dimensions of the left wall body
  Matter.Body.setPosition(leftWall, { x: -12, y: window.innerHeight / 2 });
  Matter.Body.setInertia(leftWall, Infinity);
  Matter.Body.setVertices(leftWall, [
    { x: 0, y: -window.innerHeight / 2 },
    { x: 30, y: -window.innerHeight / 2 },
    { x: 30, y: window.innerHeight / 2 },
    { x: 0, y: window.innerHeight / 2 },
  ]);

  // Update the position and dimensions of the right wall body
  Matter.Body.setPosition(rightWall, {
    x: window.innerWidth + 15,
    y: window.innerHeight / 2,
  });
  Matter.Body.setInertia(rightWall, Infinity);
  Matter.Body.setVertices(rightWall, [
    { x: -30, y: -window.innerHeight / 2 },
    { x: 0, y: -window.innerHeight / 2 },
    { x: 0, y: window.innerHeight / 2 },
    { x: -30, y: window.innerHeight / 2 },
  ]);
});
