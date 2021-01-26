const gridCount = 51;   // has to be odd number
const center_coord = Math.ceil(51/2);
let snake = [
    // {x:center_coord + 1, y:center_coord},
    // {x:center_coord, y:center_coord},
    {x:center_coord -1, y:center_coord}
];
let snake_dir = 'ArrowRight';

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

    drawSnake();

    document.addEventListener('keydown', event => {
        if (snake_dir === 'ArrowRight' || snake_dir === 'KeyD' || snake_dir === 'ArrowLeft' || snake_dir === 'KeyA' || snake_dir === 'ArrowUp' || snake_dir === 'KeyW' || snake_dir === 'ArrowUp' || snake_dir === 'KeyW') {snake_dir = event.code;}
    });

    setInterval(moveSnake, 1000);
    
});

function drawSnake() {
    snake.forEach(section => {
        // console.log(`X: ${section.x} Y: ${section.y}`);
        gameCanvas.querySelector(`#X${section.x}Y${section.y}`).className = 'black_cell';
    })
}

function moveSnake() {
    if (snake_dir === 'ArrowRight' || snake_dir === 'KeyD') {
        snake.forEach(section => {
            section.x += 1;
        })
    }
    else if (snake_dir === 'ArrowLeft' || snake_dir === 'KeyA') {
        snake.forEach(section => {
            section.x -= 1;
        })
    }
    else if (snake_dir === 'ArrowUp' || snake_dir === 'KeyW') {
        snake.forEach(section => {
            section.y -= 1;
        })
    }
    else if (snake_dir === 'ArrowDown' || snake_dir === 'KeyS') {
        snake.forEach(section => {
            section.y += 1;
        })
    }
    drawSnake();
}

// snake.js:24 KeyboardEvent {isTrusted: true, key: "ArrowRight", code: "ArrowRight", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "ArrowLeft", code: "ArrowLeft", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "ArrowUp", code: "ArrowUp", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "ArrowDown", code: "ArrowDown", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "a", code: "KeyA", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "d", code: "KeyD", location: 0, ctrlKey: false, …}
// snake.js:24 KeyboardEvent {isTrusted: true, key: "w", code: "KeyW", location: 0, ctrlKey: false, …}
