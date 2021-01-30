var gridCount = 51;   // has to be odd number 21-87

var score = 0;
var food = [];
var starting_snake = [];
var snake = [];

let snake_dir = 'right';

// time in ms. the higher, the slower
var snake_speed = 200;
var snake_interval = null;

// generate snake
function snakeCoord () {
    const center_coord = Math.ceil(gridCount/2);
    starting_snake = [
        {x:center_coord - 4, y:center_coord},
        {x:center_coord - 3, y:center_coord},
        {x:center_coord - 2, y:center_coord},
        {x:center_coord - 1, y:center_coord},
        {x:center_coord, y:center_coord},
        {x:center_coord + 1, y:center_coord},
        {x:center_coord + 2, y:center_coord},
        {x:center_coord + 3, y:center_coord},
        {x:center_coord + 4, y:center_coord},
    ];

    snake = [...starting_snake];
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // check local storage for slider
    if (typeof(Storage) !== "undefined") {
        const localSpeedSliderPosition = localStorage.getItem('localSpeedSliderPosition');

        if (localSpeedSliderPosition) {
            document.querySelector('#speed-slider').value = localSpeedSliderPosition;
        } else {
            localStorage.setItem('localSpeedSliderPosition', document.querySelector('#speed-slider').value);
        }
        set_snake_speed();

        const localMapSliderPosition = localStorage.getItem('localMapSliderPosition');

        if (localMapSliderPosition) {
            document.querySelector('#map-slider').value = localMapSliderPosition;
        } else {
            localStorage.setItem('localMapSliderPosition', document.querySelector('#map-slider').value);
        }
        set_gridCount();
    }
    
    // set button action
    buttonAction();

    //  create game area
    createTableCanvas();

    // set snake speed from slider
    updateSpeed();

    // draw initial snake
    setMapSize();
    snakeCoord ();
    drawSnake();
    spawnFood();

    // event listener for controlling snake movement
    document.addEventListener('keydown', event => {
        const action_keys = ['ArrowRight', 'KeyD', 'ArrowLeft', 'KeyA', 'ArrowUp', 'KeyW', 'ArrowDown', 'KeyS'];

        if (action_keys.includes(event.code)) {
            const new_dir = convertKeyCode(event.code)
            if (snake_dir !== new_dir && !oppositeMove(snake_dir, new_dir)) {
                snake_dir = new_dir;
                moveSnake();
                resetSnakeMovement();
                document.querySelector('#lose').style = "color: white;"; // remove lose message
                disableMapSlider();
            }
        }
    });  
});

// add event listener to button
function buttonAction() {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            if (button.dataset.name === 'play') {resetSnakeMovement();}
            else if (button.dataset.name === 'pause') {clearInterval(snake_interval);}
            // reset button
            else {
                clearCanvas()
                snake = [...starting_snake];
                drawSnake();
                spawnFood();
                clearInterval(snake_interval);
                document.querySelector('#lose').style = "color: white;"
                snake_dir = 'right';
                disableMapSlider(false);            }
        });
    });
}

// make all cell white
function clearCanvas() {
    for (i = 0; i < gridCount; i++) {
        for (j = 0; j< gridCount; j++) {
            gameCanvas.querySelector(`#X${j}Y${i}`).className = 'white_cell';
        }
    }
}

// handling speed slider
function updateSpeed() {
    document.querySelector('#speed-slider').addEventListener('input', function() {
        set_snake_speed();

        // if snake is moving then update the movement speed
        if (snake_interval) {resetSnakeMovement();}

        // update local storage for slider
        if (typeof(Storage) !== "undefined") {
            if (localStorage.getItem('localSpeedSliderPosition')) {
                localStorage.setItem('localSpeedSliderPosition', document.querySelector('#speed-slider').value);
            }
        }
    });
}

// handling map size slider
function setMapSize() {
    document.querySelector('#map-slider').addEventListener('input', function() {
        set_gridCount();
        
        createTableCanvas();
        snakeCoord();
        drawSnake();
        spawnFood();

        // update local storage for slider
        if (typeof(Storage) !== "undefined") {
            if (localStorage.getItem('localMapSliderPosition')) {
                localStorage.setItem('localMapSliderPosition', document.querySelector('#map-slider').value);
            }
        }
    });
}

function set_gridCount() {
    let size = parseInt((0.6667*document.querySelector('#map-slider').value) + 20.3333);
    if (size % 2 === 0) {
        size += 1;
    }
    gridCount = size;
}

function disableMapSlider(state = true) {
    document.querySelector('#map-slider').disabled = state;
}

function createTableCanvas() {
    // get div where table should be
    const gameCanvas = document.querySelector('#gameCanvas');
    gameCanvas.innerHTML = '';

    // create table
    for (i = 0; i < gridCount; i++) {
        tableRow = document.createElement('tr');
        gameCanvas.append(tableRow);
        for (j = 0; j< gridCount; j++) {
            tableData = document.createElement('td'); tableData.id = `X${j}Y${i}`
            tableRow.append(tableData);
        }
    }
}

function set_snake_speed() {snake_speed = (-112.9*Math.log(Math.ceil(document.querySelector('#speed-slider').value))) + 519.89;}

// spawn food
function spawnFood() {
    while (true) {
        // generate random coordinates
        const x_coord = Math.ceil(Math.random() * (gridCount - 1));
        const y_coord = Math.ceil(Math.random() * (gridCount - 1));
        const coord = {x: x_coord,y: y_coord}

        // if food is not at body, then spawn it
        if(!checkForBodyHit(coord)) {
            // update food array
            if (food.length > 0) {food.shift();}
            food.push(coord);

            // color cell
            gameCanvas.querySelector(`#X${x_coord}Y${y_coord}`).className = 'green_cell';
            break;
        }
    }
}

//reset interval of snake movement making the snake move
function resetSnakeMovement() {
    if (snake_interval !== null) {
        clearInterval(snake_interval);
        snake_interval = setInterval(moveSnake, snake_speed);
    }
    else {
        snake_interval = setInterval(moveSnake, snake_speed);
    }
}

// convert key code to left right up down
function convertKeyCode(keyCode) {
    if (keyCode === 'ArrowRight' || keyCode === 'KeyD') {return 'right';}
    else if (keyCode === 'ArrowLeft' || keyCode === 'KeyA') {return 'left';}
    else if (keyCode === 'ArrowUp' || keyCode === 'KeyW') {return 'up'}
    else if (keyCode === 'ArrowDown' || keyCode === 'KeyS') {return 'down';}
    else {
        const msg = 'Wrong keyCode inserted to function';
        console.log(msg);
        throw msg;
    }
}

// check for opposite move
function oppositeMove(m1, m2) {
    if (m1 === 'left' && m2 === 'right') {return true;}
    else if (m1 === 'right' && m2 === 'left') {return true;}
    else if (m1 === 'up' && m2 === 'down') {return true;}
    else if (m1 === 'down' && m2 === 'up') {return true;}
    else {return false;}
}

function drawSnake() {
    snake.forEach(section => {
        // console.log(`X: ${section.x} Y: ${section.y}`);
        gameCanvas.querySelector(`#X${section.x}Y${section.y}`).className = 'black_cell';
    })
}

// check if new head is out of bound or hits its own body
function checkForHit(new_head) {
    // console.log(checkForBodyHit(new_head))
    if (new_head.x >= gridCount || new_head.x < 0 || new_head.y >= gridCount || new_head.y < 0 || checkForBodyHit(new_head)) {
        clearInterval(snake_interval);
        snake_interval = null;  // this is set to null so that changing the slider won't move the snake after snake is dead
        document.querySelector('#lose').style = "color: red;"
        addScore(true); // reset score to 0
        alert('Ouch! You can continue moving or click reset.');
        return true;
    }
    return false;
}

//check if new head hit its own body
function checkForBodyHit(new_head) {
    for (i = 0; i < snake.length; i++) {
        if (snake[i].x === new_head.x && snake[i].y === new_head.y) {return true;}
    }
    return false;
}

function moveSnake() {
    const old_head = snake[snake.length - 1];
    let new_head = {...old_head};
    // console.log(`new head: ${JSON.stringify(new_head)}`)

    // calculate coord for new head
    if (snake_dir === 'right') {
        new_head.x += 1;
    }
    else if (snake_dir === 'left') {
        new_head.x -= 1;
    }
    else if (snake_dir === 'up') {
        new_head.y -= 1;
    }
    else if (snake_dir === 'down') {
        new_head.y += 1;
    }

    // if we don't hit wall or ourselves then create new head and delete tail
    if (!checkForHit(new_head)) {
        // check for eating food
        if (new_head.x === food[0].x && new_head.y === food[0].y) {
            addScore();
            spawnFood();
        }
        else {
            // make tail of snake white
            gameCanvas.querySelector(`#X${snake[0].x}Y${snake[0].y}`).className = 'white_cell';
            // console.log(`snake initial: ${JSON.stringify(snake)}`)

            // remove tail from array
            snake.shift();
            // console.log(`snake remove tail: ${JSON.stringify(snake)}`)
        }
        // add new head to snake array and make it black
        snake.push(new_head);
        gameCanvas.querySelector(`#X${new_head.x}Y${new_head.y}`).className = 'black_cell';
        // console.log(`snake after: ${JSON.stringify(snake)}`)
    }
}

function addScore(reset = false) {
    if (reset) {
        score = 0;
    }
    else {
        score += Math.ceil(document.querySelector('#speed-slider').value);
    }    
    document.querySelector('#score').innerHTML = score;
}

// speed slider curve
// x	y
// 1	500
// 10	300
// 20	200
// 30	130
// 40	100
// 50	70
// 60	40
// 70	30
// 80	20
// 90	15
// 100	10


// snake.js:24 KeyboardEvent {isTrusted: true, key: "ArrowRight", code: "ArrowRight", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "ArrowLeft", code: "ArrowLeft", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "ArrowUp", code: "ArrowUp", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "ArrowDown", code: "ArrowDown", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "a", code: "KeyA", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "d", code: "KeyD", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "w", code: "KeyW", location: 0, ctrlKey: false, …}
