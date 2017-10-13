var boardsize = 32;
var fps = 10;
var gameboard = [];
var ctx;
var CANVAS;
var cellsize;
var update;
var cursorX;
var cursorY;
var mousedown;
var selectMap = [];
var colorMap = [];

function mod(n) {
    return ((n % boardsize) + boardsize) % boardsize;
}
//init
window.onload = function() {
    CANVAS = document.getElementById("cv");
    ctx = CANVAS.getContext("2d");
    cellsize = Math.floor(CANVAS.clientHeight / boardsize);
    update = false;
    CANVAS.height = CANVAS.clientHeight;
    CANVAS.width = CANVAS.clientHeight;
    populateColorMap();

    document.addEventListener("mousedown", function() {
        mousedown = 1;
        selectMap = JSON.parse(JSON.stringify(gameboard))
        var i = Math.floor(cursorX / cellsize);
        var j = Math.floor(cursorY / cellsize);
        if (gameboard[i][j] == selectMap[i][j]) gameboard[i][j] = !gameboard[i][j];

    });
    document.addEventListener("mouseup", function() {
        selectMap = gameboard.slice();
        mousedown = 0;
    });

    document.onmousemove = function(e) {
        cursorX = e.pageX - CANVAS.getBoundingClientRect().left;
        cursorY = e.pageY - CANVAS.getBoundingClientRect().top;
        if (!mousedown) return;
        var i = Math.floor(cursorX / cellsize);
        var j = Math.floor(cursorY / cellsize);
        if (gameboard[i][j] == selectMap[i][j]) gameboard[i][j] = !gameboard[i][j];

    }

    function clearBoard() {
        var emptyrow = new Array(boardsize).fill(0);
        for(var i=0; i < boardsize; i++) gameboard.push(emptyrow.slice())
    }
    clearBoard();
    document.onkeyup = function(e) {
        e = e || event;
        if (e.keyCode == 32) update = !update;
        if (e.keyCode > 48 && e.keyCode < 58) fps = (e.keyCode - 48) * 3;
        if (e.keyCode == 67) clearBoard();
    }

    setTimeout(renderloop, 1000 / fps);
}

function updateBoard() {
    var newBoard = [];
    if (!update) return;
    for (var i = 0; i < boardsize; i++) {
        var temp = [];
        for (var j = 0; j < boardsize; j++) {
            var n = 0;
            //console.log(gameboard[(i + 1) ][(j + 1) ]);
            n += gameboard[mod(i + 1)][j];
            n += gameboard[i][mod(j + 1)];
            n += gameboard[mod(i + 1)][mod(j + 1)];
            //console.log(mod(i - 1));
            n += gameboard[mod(i - 1)][j];
            n += gameboard[i][mod(j - 1)];
            n += gameboard[mod(i - 1)][mod(j - 1)];
            n += gameboard[mod(i + 1)][mod(j - 1)];
            n += gameboard[mod(i - 1)][mod(j + 1)];
            if (n == 3 || (n == 2 && gameboard[i][j])) temp.push(1);
            else temp.push(0);
        }
        newBoard.push(temp);
        //console.log(newBoard)
    }
    gameboard = newBoard.slice();
}

function drawBoard() {
    ctx.clearRect(0, 0, CANVAS.clientHeight, CANVAS.clientHeight);
    for (var i = 0; i < boardsize; i++) {
        for (var j = 0; j < boardsize; j++) {
            ctx.fillStyle = "#EEEEEE";
            ctx.fillRect(i * cellsize, j * cellsize, cellsize, cellsize);
            if (gameboard[i][j]) {
                ctx.fillStyle = colorMap[i][j];
                ctx.fillRect(i * cellsize, j * cellsize, cellsize, cellsize);
            }
            ctx.strokeStyle = "#FFFFFF";
            ctx.strokeRect(i * cellsize, j * cellsize, cellsize, cellsize);
        }
    }
}

function populateColorMap() {
    for (var i = 0; i < boardsize; i++) {
        var row = [];
        for (var j = 0; j < boardsize; j++) {
            row.push(gradient(i, j));
        }
        colorMap.push(row);
    }
}

function gradient(i, j) {
    //define gradient colors
    c1 = [184, 99, 249];
    c2 = [246, 114, 86];

    del = [c1[0] - c2[0], c1[1] - c2[1], c1[2] - c2[2]];
    factor = (i + j) / (2 * (boardsize - 1));
    outc = [Math.floor(c1[0] - del[0] * factor), Math.floor(c1[1] - del[1] * factor), Math.floor(c1[2] - del[2] * factor)];
    //console.log(outc);
    return rgbToHex(outc);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(c) {
    return "#" + componentToHex(c[0]) + componentToHex(c[1]) + componentToHex(c[2]);
}

function renderloop() {
    updateBoard();
    drawBoard();
    setTimeout(renderloop, 1000 / fps);
}