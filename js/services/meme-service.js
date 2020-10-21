'use strict'
const STORAGE_KEY = 'imgsDB';
var gImgs;
var gMemes = {
    selectedImgId: null,
    selectedLineIdx: null,
    lines: [
        {
            txt: 'I never eat Falafel',
            size: 20,
            align: 'left',
            color: 'red'
        }
    ]
}
var gCanvas;
var gCtx;


function init() {
    _createImgs();
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId);
}



function getImgsForDisplay() {
    return gImgs;
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
    gMemes.selectedImgId = imgId
}


function initCanvas() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d')
}

function openGallery() {
    toggleElement(elImgsContainer, 'hide');
    toggleElement(elEditorContainer, 'hide');
}

function drawText(text, x, y) {
    gCtx.fillStyle = `${gMemes.lines[0].color}`
    gCtx.lineWidth = '2'
    gCtx.font = '48px Ariel'
    gCtx.textAlign = 'start'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}


function txtChange(input){
const txt = input.value;
if (!txt) return;
gMemes.lines[0].txt = txt
drawText(txt, 50, 50)
}


function drawImg(imgUrl) {
    const img = new Image();
    img.src = `${imgUrl}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) 
    }
}




