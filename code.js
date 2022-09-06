Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}
class Pointer {
    constructor(id, x, y, value) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.value = value;
    };
}
/**
 * @matrix Pointer[]
 */
let matrix = [];
let n = 3;
let air = 'x';
let cir = 'o';
let value = air;
let gameOver = false;
let waiting = false;

/**
 * Tạo ma trận
 * @param {number} n kích thước ma trận
 */
function createMatrix(n) {
    for (let x = 1; x <= n; x++) {
        for (let y = 1; y <= n; y++) {
            matrix.push(new Pointer(matrix.length + 1, x, y, null))
        }
    }
}

/**
 * nhận sự kiện click của người chơi sau mỗi lượt sẽ kểm tra có ai thắng, hoặc hết ô để  chơi chưa, nếu chưa thì random ô tiếp theo (máy chơi)
 * @param {number} id định danh của ô được chọn
 * 
 */
function turnPlay(id) {
    if (gameOver || waiting) return;
    const node = document.getElementById(id);
    if (!node || node.innerHTML !== '') return;
    for (let index = 0; index < matrix.length; index++) {
        const element = matrix[index];
        if (element.id === id) {
            matrix[index].value = value;
            node.innerHTML = value;
            if (value === cir) {
                value = air;
            } else {
                value = cir;
            }
            break;
        }
    }
    checkWin();
    checkOver();
    if (value === cir) {
        autoPlay();
    }
}

/**
 * random 1 ô trong những ô chưa được lựa chọn và gán giá trị (lượt của máy)
 */
async function autoPlay() {
    waiting = true;
    const alive = matrix.filter(item => item.value === null);
    const itemRandom = alive.random();
    await new Promise(r => setTimeout(r, 2000));
    waiting = false;
    turnPlay(itemRandom.id);
}

/**
 * tạo ra giao diện sân chơi từ ma trận
 */
function generateHtmlMatrix() {
    let str = '';
    matrix.forEach(p => {
        str += `<div id=${p.id} onclick="turnPlay(${p.id})" class="grid-item"></div>`;
    })
    document.getElementById('container').innerHTML = str;
}

/**
 * Kiểm tra đã hết ô để chơi chưa
 */
function checkOver() {
    if (matrix.every(item => item.value !== null)) {
        alert('Game over');
        gameOver = true;
    }
}

/**
 * Kiểm tra trò chơi kết thúc
 */
function checkWin() {
    let boxesDone = [];
    /*
        kiểm tra các hàng 
     */
    function checkRows() {
        for (let x = 1; x <= n; x++) {
            const boxesInRow = matrix.filter(item => item.x === x);
            if (boxesInRow.every(i => i.value !== null && i.value === boxesInRow[0].value)) {
                alert('row ' + x + ' has win');
                boxesDone = boxesInRow;
            }
        }
    }
    /*
       kiểm tra các cột 
    */
    function checkColumns() {
        for (let y = 1; y <= n; y++) {
            const boxesInColumn = matrix.filter(item => item.y === y);
            if (boxesInColumn.every(i => i.value !== null && i.value === boxesInColumn[0].value)) {
                alert('column ' + y + ' has win');
                boxesDone = boxesInColumn;
            }
        }
    }
    /*
        kiểm tra đường chéo xuống
     */
    function checkDiagonDown() {
        const boxDiagon = [];
        for (let i = 1; i <= n; i++) {
            boxDiagon.push(matrix.find(item => item.y === i && item.x === i));
        }
        if (boxDiagon.every(i => i.value !== null && i.value === boxDiagon[0].value)) {
            alert('diagon down has win');
            boxesDone = boxDiagon;
        }
    }
    /*
       kiểm tra đường chéo lên
    */
    function checkDiagonUp() {
        const contract = n + 1;
        const boxDiagon = [];
        for (let i = 1; i <= n; i++) {
            const x = i;
            const y = contract - i;
            boxDiagon.push(matrix.find(i => i.x == x && i.y === y));
        }
        if (boxDiagon.every(i => i.value !== null && i.value === boxDiagon[0].value)) {
            alert('diagon up has win');
            boxesDone = boxDiagon;
        }
    }
    checkRows();
    checkColumns();
    checkDiagonDown();
    checkDiagonUp();
    if (boxesDone.length === n) {
        drawDone(boxesDone);
    }
}
/**
 * tô màu cho các ô đã chiến thắng
 * @param {Array<Pointer>} boxes 
 */
function drawDone(boxes) {
    boxes.forEach(box => {
        document.getElementById(box.id).style.backgroundColor = 'antiquewhite';
    })
    gameOver = true;
}
/**
 * reset game
 */
function reset() {
    matrix = [];
    n = 3;
    air = 'x';
    cir = 'o';
    value = air;
    gameOver = false;
    waiting = false;
    start();
}
function start() {
    createMatrix(n);
    console.log(matrix);
    generateHtmlMatrix();
}

start();