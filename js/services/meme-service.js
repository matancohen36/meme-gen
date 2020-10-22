'use strict'
const STORAGE_KEY = 'imgsDB';
var gImgs;
var gMemes = [];
var gMeme = {
    id: makeId(),
    selectedImgId: null,
    selectedLineIdx: null,
    lines: [
        {
            txt: 'enter text',
            size: 48,
            align: 'left',
            color: 'red',
            stroke: 'white',
            x: 50,
            y: 50
        }
    ]
}
var gCanvas;
var gCtx;
var gLineIdx = 0;
var gIsForDownload = false;


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

function openGallery(display = 'gallery') {
    if (!display === 'memes') {
        toggleElement(elImgsContainer, 'hide');
        toggleElement(elEditorContainer, 'hide');
        renderImgs();
    }
        toggleElement(elImgsContainer, 'hide');
        toggleElement(elEditorContainer, 'hide');
        renderSavedMemes();
}

function mangeFontSize(diff) {
    gMeme.lines[gLineIdx].size += diff

}

function drawText(text, x = 50, y = 50, line = gLineIdx) {
    console.log()
    gCtx.fillStyle = `${line.color}`
    gCtx.lineWidth = '2'
    gCtx.font = `${line.size}px Impact`;
    gCtx.textAlign = line.align
    gCtx.strokeStyle = line.stroke;
    gCtx.stroke();
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
    gCtx.save();
    if(!gIsForDownload){
    renderFocus();
    gCtx.restore();
    }
}

function drawLines() {
    const lines = getLines();
    lines.forEach(line => drawText(line.txt, line.x, line.y, line));
}


function txtChange(input) {
    const txt = input.value;
    if (!txt) return;
    if(!gMeme.lines[gLineIdx]) return
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
        gCtx.beginPath();
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawLines();
        gCtx.beginPath();
    }
}


function renderFocus() {
    if(gIsForDownload) return;
    const { x, y, size } = gMeme.lines[gLineIdx]
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.beginPath();
    gCtx.rect(x - 20, y + 10, x + 390, y - (y + size + 5))
    gCtx.restore();

}


function managePosition(diff) {
    gMeme.lines[gLineIdx].y += diff
}

function manageLines() {
    gLineIdx++;
    if (gMeme.lines.length <= gLineIdx) gLineIdx = 0;
}

function addLine() {
    gMeme.lines.push({
        txt: 'enter text',
        size: 48,
        align: 'left',
        color: 'red',
        stroke: 'white',
        x: 50,
        y: 50
    }
    )
    gLineIdx++;

}

function delLine() {
    if (gMeme.lines.length === 0) return;
    gMeme.lines.splice(gLineIdx, 1);
    if (gMeme.lines.length === 0) return gLineIdx === 0;
    gLineIdx--;
}


function setTxtColor(color) {
    gMeme.lines[gLineIdx].color = color;
}

function setStrokeColor(color) {
    gMeme.lines[gLineIdx].stroke = color;
}

function renderInput(){
    document.querySelector('.inputs .add-txt').value = gMeme.lines[gLineIdx].txt;
}


function manageAligns(align) {
    gMeme.lines[gLineIdx].align = align
}



function downloadMeme(elLink) {
    renderCanvas();
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

function shareMeme(){
    var imgContent = gCanvas.toDataURL('image/jpeg');
    imgContent = encodeURIComponent(imgContent)
    document.querySelector('.share-container').innerHTML = `
    <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${imgContentl}&t=${imgContent}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
       Share   
    </a>`
}


function saveMeme() {
    gMemes.push(gMeme)
    saveToStorage(STORAGE_KEY, gMemes)
}


