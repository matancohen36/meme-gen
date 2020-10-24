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

function drawText(text, x = 50, y = 50, line = gCurrLineIdx) {
    gCtx.fillStyle = `${line.color}`
    gCtx.lineWidth = '1'
    gCtx.font = `${line.size}px ${line.font}`;
    gCtx.textAlign = line.align
    gCtx.strokeStyle = line.stroke;
    gCtx.stroke();
    if (line.align === 'right') {
        x += 375;
    }
    if (line.align === 'center') {
        x += 190;
    }
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
    gCtx.save();
    if (!gIsForDownload) {
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
        gCtx.beginPath();
    }
}


function renderFocus() {
    if (gIsForDownload) return;
    if (gMeme.lines.length === 0) return;
    const { x, y, size } = gMeme.lines[gCurrLineIdx]
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.beginPath();
    gCtx.rect(x - 20, y + 10, x + 390, y - (y + size + 5))
    gCtx.restore();

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
    if (gAddlineCount === 1) {
        gMeme.lines.push({
            txt: 'enter text',
            size: 56,
            align: 'left',
            color: 'blue',
            stroke: 'white',
            x: 50,
            y: 475
        }
        )
    } else {
        gMeme.lines.push({
            txt: 'enter text',
            size: 56,
            align: 'left',
            color: 'blue',
            stroke: 'white',
            x: 50,
            y: 250
        }
        )
    }
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
    document.querySelector('.text-input .add-txt').value =gMeme.lines[gCurrLineIdx].txt;
}


function manageAligns(align) {
    gMeme.lines[gCurrLineIdx].align = align
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