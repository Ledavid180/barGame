var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');//stores 2d rendering of context- the actual tool we can use to paint on the canvas
// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();
//above lines creates a red square on the canvas: all of the instructions are between the beginPath() and closePath() methods
//define a rectangle using rect(): first 2 values specify the coordinates of the top left corner of the rectangle and the second two specify the width and height. 
//rectangle is painted 20 px from left, 40px from top, 50px wide and 50 px high.
//fillStyle property stores a color that will be used by the fill() method to paint the square

// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI*2, false);
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
// ctx.stroke();
// ctx.closePath();

//with canvas, you draw a shape and then redraw the shape in a slightly different position in the next frame. In order for this to constantly update for each frame, we need to define a drawing function that will loop with a dif set of variable values each time to change sprite positions. setInterval() or requestAnimationFrame() are two timing functions to run it over and over.
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let score = 0;
const winMessage = document.getElementById('winMessage');
//we will hold our bricks in a 2-dimensional array. It will contain the brick columns(c), which in turn will each contain an object containing the x and y position to paint each brick on the screen.
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//pressed buttons can be defined and initialized with boolean variables 
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

//allowing the user to control the paddle:
//-2 variables for storing info on whether the left or right control button is pressed
//-2 event listeners for keyup and keydown events. run some code to handle the paddle movement when the buttons are pressed.
//-2 functions handling (the keyup and keydown events) the code that will be run when buttons are pressed.
//-ability to move paddle left and right



function keyDownHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e){
    const relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

//create a collision detection function that will loop through all the bricks and compare every single brick's position with the ball's coordinates as each frame is drawn. For bettwe readability we define b variable for storing the brick object in every loop of the collision detection: 
function collsionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            //calculations
            //if the center of the ball is inside the coordinates of one of our bricks, we'll change direction of ball. for the center of the ball to be inside the brick, all four statements need to be true: 
            //x position of the ball is greater than the x position of the brick
            //x position of the ball is greater than the y position of the brick.
            //y position of the ball is greater than the y position of the brick.
            //y position of the ball is less than the y position of the brick plus its height.
            if(b.status === 1){
                if(
                    x > b.x && 
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score === brickRowCount * brickColumnCount){
                        alert('You Win!!');
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

function drawScore(){
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgb(118, 129, 142)';
    ctx.fillText(`Score: ${score}`, 8, 20);//first param is for the text itself, and last 2 are the coordinates where the text will be placed on the canvas
}
function drawBall() {
    //drawing code
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(204, 126, 133)';
    ctx.fill();
    ctx.closePath();
}
//we created variables x and y to give the ball a more dynamic start point. now we need to make the ball move. in order to do so, we must add a small value to x and y after every frame has been drawn. so we create dx and dy and give them a value of 2. the last thing to do is update x and y with our dx and dy on every frame.

//with the way this is currently written, the ball creates a line, leaving the canvas. and that is because we haven't removed the previous circle before drawing a new one. there is a clear method for that called clearRect()


//to detect the collision we will check whether the ball is touching (colliding with) the wall and if so, we will change the direction of its movement accordingly. to make calculations easier, lets define a variable called ballRadius that will hold the radius of the drawn circle and be used for calculations.

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "rgb(163, 109, 144)";
    ctx.fill();
    ctx.closePath();
}

//create a function to loop through all the bricks in the array and draw them on the screen
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = 'rgb(163, 109, 144)';
                ctx.fill();
                ctx.closePath();

            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collsionDetection();
    //lines below are checking for collision
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    //we need to add some kind of collision detection between ball and paddle so it can bounce off. The easiest thing to do is check whether the center of the ball is between the left and right edges of the paddle. 
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            alert('Game Over');
            document.location.reload();
            clearInterval(interval);//needed for chrome to end game

        }
    }
    //lines below check if the left or right cursor keys are pressed when each frame is rendered.
    if (rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if (leftPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    x += dx;
    y += dy;
}

const interval = setInterval(draw, 10);
//the draw function will be executed within setInterval every 10 milliseconds



