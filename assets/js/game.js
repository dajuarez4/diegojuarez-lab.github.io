document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const balls = [];
  const NUM_BALLS = 6;
  const colors = ["#e63946", "#457b9d", "#2a9d8f", "#f4a261", "#e9c46a", "#8d99ae"];

  for (let i = 0; i < NUM_BALLS; i++) {
    const radius = 25;
    const x = Math.random() * (canvas.width - 2 * radius) + radius;
    const y = Math.random() * (canvas.height - 2 * radius) + radius;
    balls.push({ x, y, radius, color: colors[i % colors.length] });
  }

  function drawBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const b of balls) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.closePath();
    }
  }

  drawBalls();
  let draggingBall = null, offsetX = 0, offsetY = 0;

  function getMousePos(evt) {
    const r = canvas.getBoundingClientRect();
    return { x: evt.clientX - r.left, y: evt.clientY - r.top };
  }

  canvas.addEventListener("mousedown", (e) => {
    const m = getMousePos(e);
    for (let i = balls.length - 1; i >= 0; i--) {
      const b = balls[i];
      const d = Math.hypot(m.x - b.x, m.y - b.y);
      if (d <= b.radius) {
        draggingBall = b;
        offsetX = m.x - b.x;
        offsetY = m.y - b.y;
        balls.splice(i, 1);
        balls.push(b);
        break;
      }
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!draggingBall) return;
    const m = getMousePos(e);
    draggingBall.x = m.x - offsetX;
    draggingBall.y = m.y - offsetY;
    const r = draggingBall.radius;
    draggingBall.x = Math.max(r, Math.min(canvas.width - r, draggingBall.x));
    draggingBall.y = Math.max(r, Math.min(canvas.height - r, draggingBall.y));
    drawBalls();
  });

  window.addEventListener("mouseup", () => (draggingBall = null));
});
