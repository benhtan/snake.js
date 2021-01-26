document.addEventListener('DOMContentLoaded', function() {
    // get div where table should be
    const gameCanvas = document.querySelector('#gameCanvas');

    // create table
    const gridCount = 51;   // has to be odd number

    for (i = 0; i < gridCount; i++) {
        tableRow = document.createElement('tr');
        gameCanvas.append(tableRow);
        for (j = 0; j< gridCount; j++) {
            tableData = document.createElement('td'); tableData.id = `X${i}Y${j}`
            tableRow.append(tableData);
        }
    }

    // find center cell
    const center_coord = Math.ceil(51/2);
    gameCanvas.querySelector(`#X${center_coord}Y${center_coord}`).className = 'black_cell';


});