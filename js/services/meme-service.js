'use strict'
const STORAGE_KEY = 'imgsDB';
var gImgs;
var gMeme = {
    selectedImgId: null,
    selectedLineIdx: null,
    lines: [
        {
            txt: 'enter text',
            size: 48,
            align: 'left',
            color: 'red',
            x: 50,
            y: 50
        }
    ]
}
var gCanvas;
var gCtx;
var gLineIdx = 0;


function init() {
    _createImgs();
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId);
}



function getImgsForDisplay() {
    return gImgs;
}

function getCurrMeme() {
    return gMeme;
}


function _createImgs() {
    let memeImgs = loadFromStorage(STORAGE_KEY);
    if (!memeImgs) {
        memeImgs = [];
        for (let i = 1; i <= 18; i++) {
            memeImgs.push(_createImg(i));
        }
    }
    gImgs = memeImgs;
    saveImgsToStorage();
}



function _createImg(id, keywords = []) {
    return {
        id,
        url: `./imgs/meme-imgs/${id}.jpg`,
        keywords
    }
}


function saveImgsToStorage() {
    saveToStorage(STORAGE_KEY, gImgs)
}


function selectMemeImg(imgId) {
    const elImgsContainer = document.querySelector('.grid-container');
    const elEditorContainer = document.querySelector('.meme-editor-container');
    toggleElement(elImgsContainer, 'hide');
    toggleElement(elEditorContainer, 'hide')
    const img = getImgById(+imgId);
    initCanvas()
    drawImg(img.url)
    setSelectedMemeImg(imgId)
}


function setSelectedMemeImg(imgId) {
    gMeme.selectedImgId = imgId
}


function initCanvas() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d')
}

function openGallery() {
    toggleElement(elImgsContainer, 'hide');
    toggleElement(elEditorContainer, 'hide');
}

function mangeFontSize(diff) {
    gMeme.lines[gLineIdx].size += diff
}

function drawText(text, x = 50, y = 50) {
    gCtx.fillStyle = `${gMeme.lines[gLineIdx].color}`
    gCtx.lineWidth = '2'
    gCtx.font = `${gMeme.lines[gLineIdx].size}px Impact`;
    gCtx.textAlign = 'start'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function txtChange(input) {
    const txt = input.value;
    if (!txt) return;
    gMeme.lines[gLineIdx].txt = txt
}

function draw() {

}

function getLines() {
    return gMeme.lines;
}


function drawImg(imgUrl) {
    const img = new Image();
    img.src = `${imgUrl}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }
}




function renderCanvas() {
    const meme = getCurrMeme();
    const img = new Image();
    img.src = `./imgs/meme-imgs/${meme.selectedImgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawLines();
    }
}

function drawLines() {
    const lines = getLines();
    lines.forEach(line => drawText(line.txt, line.x, line.y))
}


function managePosition(diff) {
    gMeme.lines[gLineIdx].y += diff
    renderCanvas()
}


function manageLines() {
    gLineIdx ++;
    if (gMeme.lines.length <= gLineIdx ) gLineIdx = 0;
}


function addLine() {
    gMeme.lines.push({
        txt: 'enter text',
        size: 48,
        align: 'left',
        color: 'red',
        x: 50,
        y: 50
    }
    )
}
