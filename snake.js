const gridCount = 51;   // has to be odd number
const center_coord = Math.ceil(51/2);
let snake = [
    {x:center_coord - 1, y:center_coord},
    {x:center_coord, y:center_coord},
    {x:center_coord + 1, y:center_coord}
];
let snake_dir = 'right';

// time in ms. the higher, the slower
const snake_speed = 1000;

document.addEventListener('DOMContentLoaded', function() {
    // get div where table should be
    const gameCanvas = document.querySelector('#gameCanvas');

    // create table
    for (i = 0; i < gridCount; i++) {
        tableRow = document.createElement('tr');
        gameCanvas.append(tableRow);
        for (j = 0; j< gridCount; j++) {
            tableData = document.createElement('td'); tableData.id = `X${j}Y${i}`
            tableRow.append(tableData);
        }
    }

    // draw initial snake
    drawSnake();

    document.addEventListener('keydown', event => {
        const action_keys = ['ArrowRight', 'KeyD', 'ArrowLeft', 'KeyA', 'ArrowUp', 'KeyW', 'ArrowDown', 'KeyS'];

        if (action_keys.includes(event.code)) {
            const new_dir = convertKeyCode(event.code)
            if (snake_dir != new_dir && !oppositeMove(snake_dir, new_dir)) {
                snake_dir = new_dir;
                moveSnake();
                // console.log(snake_dir);
            }
        } 
    });

    setInterval(moveSnake, snake_speed);
    
});

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

function moveSnake() {
    // make tail of snake white
    gameCanvas.querySelector(`#X${snake[0].x}Y${snake[0].y}`).className = 'white_cell';
    // console.log(`snake initial: ${JSON.stringify(snake)}`)

    // remove tail from array
    snake.shift();
    // console.log(`snake remove tail: ${JSON.stringify(snake)}`)

    let old_head = snake[snake.length - 1];
    let new_head = {x: old_head.x, y:old_head.y};
    // console.log(`new head: ${JSON.stringify(new_head)}`)

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

    // add new head to snake array
    snake.push(new_head);
    gameCanvas.querySelector(`#X${new_head.x}Y${new_head.y}`).className = 'black_cell';
    // console.log(`snake after: ${JSON.stringify(snake)}`)
}

// snake.js:24 KeyboardEvent {isTrusted: true, key: "ArrowRight", code: "ArrowRight", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "ArrowLeft", code: "ArrowLeft", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "ArrowUp", code: "ArrowUp", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "ArrowDown", code: "ArrowDown", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "a", code: "KeyA", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "d", code: "KeyD", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "w", code: "KeyW", location: 0, ctrlKey: false, …}
