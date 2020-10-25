'use strict'
const STORAGE_KEY = 'imgsDB';
var gImgs;
var gMemes = [];
var gMeme = {
    id: makeId(),
    selectedImgId: null,
    selectedLineIdx: null,
    url: null,
    lines: [
        {
            txt: 'enter text',
            size: 56,
            font: "Impact",
            align: 'left',
            color: 'blue',
            stroke: 'white',
            x: 50,
            y: 50
        }
    ]
}
var gCanvas;
var gCtx;
var gCurrLineIdx = 0;
var gIsForDownload = false;
var gIsDragging = false;
var gAddlineCount = 0;

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
    const elImgsContainer = document.querySelector('.grid-container');
    const elEditorContainer = document.querySelector('.meme-editor-container');
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
    gMeme.lines[gCurrLineIdx].size += diff

}

function fontChange(font) {
    gMeme.lines[gCurrLineIdx].font = font;
}



function drawText(line) {
    const { x, y, txt, color, align, stroke, font, size } = line
    gCtx.fillStyle = `${color}`
    gCtx.lineWidth = '1'
    gCtx.font = `${size}px ${font}`;
    gCtx.textAlign = align
    gCtx.strokeStyle = stroke;
    gCtx.stroke();

    gCtx.fillText(txt, x, y)
    gCtx.strokeText(txt, x, y)
    gCtx.save();
    if (!gIsForDownload) {
        renderFocus();
        gCtx.restore();
    }
}

function drawLines() {
    const lines = getLines();
    lines.forEach(line => drawText(line));
}


function txtChange(input) {
    const txt = input.value;
    if (!gMeme.lines[gCurrLineIdx]) return
    gMeme.lines[gCurrLineIdx].txt = txt
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
    }
}


function renderFocus() {
    if (gIsForDownload) return;
    if (gMeme.lines.length === 0) return;
    const { x, y, size, txt } = gMeme.lines[gCurrLineIdx]
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.beginPath();
    let measureText = gCtx.measureText(txt);
    gCtx.rect(x - 2 - measureText.actualBoundingBoxLeft, y - size, measureText.width + 4, size + 10);
    gCtx.closePath();

}


function managePosition(diff) {
    if (gMeme.lines.length === 0) return;
    gMeme.lines[gCurrLineIdx].y += diff
}

function manageLines() {
    gCurrLineIdx++;
    if (gMeme.lines.length <= gCurrLineIdx) gCurrLineIdx = 0;
}

function addLine() {
    const newLine = {
        txt: 'enter text',
        size: 56,
        align: 'left',
        color: 'blue',
        stroke: 'white',
        x: 50,
        y: 0
    }
    newLine.y = (gAddlineCount === 1) ? 475 : 250;
    gMeme.lines.push(newLine)
    if (gMeme.lines.length === 1) return gCurrLineIdx = 0;
    gCurrLineIdx++;
}

function delLine() {
    if (gMeme.lines.length === 0) return;
    gMeme.lines.splice(gCurrLineIdx, 1);
    if (gCurrLineIdx > 0) gCurrLineIdx--;
}


function setTxtColor(color) {
    gMeme.lines[gCurrLineIdx].color = color;
}

function setStrokeColor(color) {
    gMeme.lines[gCurrLineIdx].stroke = color;
}

function renderInput() {
    document.querySelector('.text-input .add-txt').value = gMeme.lines[gCurrLineIdx].txt;
}


function manageAligns(align) {
    gMeme.lines[gCurrLineIdx].align = align
    var x;
    switch (align) {
        case 'right':
            x = 450;
            break;
        case 'center':
            x = 275;
            break;
        case 'left':
            x = 30;
            break;
    }
    gMeme.lines[gCurrLineIdx].x = x
}


function downloadMeme(elLink) {
    renderCanvas();
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

function shareMeme(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    imgContent = encodeURIComponent(imgContent)
    elLink.href = `https://www.facebook.com/sharer/sharer.php?u=${imgContent}&t=${imgContent}`
    // document.querySelector('.end prod .share').innerHTML = `
    // <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${imgContentl}&t=${imgContent}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${imgContent}&t=${imgContent}'); return false;">
    //    Share   
    // </a>`
}


function saveMeme() {
    gMeme.url = gCanvas.toDataURL('image/jpeg')
    gMemes.push(gMeme)
    saveToStorage(STORAGE_KEY, gMemes)
}


function drag(ev) {
    if (!gIsDragging) return;
    if (ev.touches) {
        const { clientY, clientX } = ev.touches[0];
        var rect = document.querySelector('#my-canvas').getBoundingClientRect();
        gMeme.lines[gCurrLineIdx].x = clientX - rect.left;
        gMeme.lines[gCurrLineIdx].y = clientY - rect.top;
        renderCanvas();
    } else {
        const { offsetX, offsetY } = ev;
        gMeme.lines[gCurrLineIdx].x = offsetX
        gMeme.lines[gCurrLineIdx].y = offsetY
        renderCanvas();
    }

}


function startDrag(ev) {
    if (gIsDragging) return;
    if (gMeme.lines.length === 0) return;
    var rect = document.querySelector('#my-canvas').getBoundingClientRect();
    const touchX = (ev.touches) ? ev.clientX - rect.left : ev.offsetX;
    const touchY = (ev.touches) ? ev.clientY - rect.top : ev.offsetY;
    const lineIdx = gMeme.lines.findIndex(line => {
        const txtWidth = gCtx.measureText(line.txt).width
        const txtHeight = line.size;
        return (touchX > line.x && touchX < line.x + txtWidth) && (touchY < line.y && touchY > line.y - txtHeight);
    })
    gCurrLineIdx = lineIdx;
    if (gCurrLineIdx === -1 && gMeme.lines.length > 1) gCurrLineIdx *= -1;
    if (gCurrLineIdx === -1 && gMeme.lines.length === 1) gCurrLineIdx = 0;
    renderCanvas();
    gIsDragging = true;
}
