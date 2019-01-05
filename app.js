const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const user = {
    x : 0,
    y : canvas.height / 2 - 100 / 2,
    width : 10,
    height : 100,
    color : 'white',
    score : 0
}

const comp = {
    x : canvas.width - 10,
    y : canvas.height / 2 - 100 / 2,
    width : 10,
    height : 100,
    color : 'white',
    score : 0
}

const ball = {
    x : canvas.width / 2,
    y : canvas.height / 2,
    radius : 10, 
    speed : 5,
    velocityX : 5,
    velocityY : 5, 
    color : 'white'
}

const net = {
    x : canvas.width / 2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color : 'white'
}

const drawRect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

const drawNet = () => {
    for(let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

const drawCircle = (x, y, r, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

const drawText = (text, x, y, color) => {
    ctx.fillStyle = color;
    ctx.font = '2em arial';
    ctx.fillText(text, x, y);
}

const render = () => {
    drawRect(0, 0, canvas.width, canvas.height, 'black');
    drawNet();
    drawText(user.score, canvas.width / 4, canvas.height / 5, 'white');
    drawText(comp.score, 3 * canvas.width / 4, canvas.height / 5, 'white');
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(comp.x, comp.y, comp.width, comp.height, comp.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

const movePaddle = e => {
    let rect = canvas.getBoundingClientRect();
    user.y = e.clientY - rect.top - user.height / 2;
}
canvas.addEventListener('mousemove', movePaddle);

const collision = (b, p) => {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

const resetBall = () => {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
}

const update = () => {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    let compLevel = 0.5;
    comp.y += (ball.y - (comp.y + comp.height / 2)) * compLevel;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width / 2) ? user : comp;

    if(collision(ball, player)) {
        let collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = collidePoint * Math.PI / 4;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 2;
    }

    if (ball.x - ball.radius < 0) {
        comp.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
}
 
const game = () => {
    update();
    render();
}

const framePerSecond = 60;
setInterval(game, 1000 / framePerSecond);