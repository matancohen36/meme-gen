'use strict';

function onInit() {
    init()
    renderImgs();
}

function renderImgs() {
    const elImgsContainer = document.querySelector('.grid-container');
    const imgs = getImgsForDisplay();
    const strHtmls = imgs.map(img => {
        return `<div class="item" onclick="selectMemeImg('${img.id}')">
                    <img class="item-img" src="${img.url}"  />
                </div>
        `
    })
    elImgsContainer.innerHTML = strHtmls.join('');
}


// function renderSavedMemes() {
//     const elImgsContainer = document.querySelector('.grid-container');
//     const memes = getMemesForDisplay();
//     const strHtmls = memes.map(meme => {
//         return `<div class="item" onclick="selectMemeImg('${meme.id}')">
//                     <img class="item-img" src="${img.url}"  />
//                 </div>
//         `
//     })
//     elImgsContainer.innerHTML = strHtmls.join('');
// }

function onSelectMemeImg(imgId) {
    selectMemeImg(imgId);
}



function onOpenGallery(display) {
    openGallery(display);
}

function onMangeFontSize(diff) {
    mangeFontSize(diff)
    renderCanvas()
}

function onManagePosition(diff) {
    managePosition(diff)
    renderCanvas()
}

function onManageLines(diff) {
    if (gMeme.lines.length === 1) return
    manageLines(diff)
    renderInput();
    renderCanvas();
}

function onManageAligns(align) {
    manageAligns(align);
}

function onTxtChange(elInput) {
    txtChange(elInput)
    renderCanvas()
}

function onSetTxtColor(elInput) {
    setTxtColor(elInput.value);
    renderCanvas();
}

function onSetStrokeColor(elInput) {
    setStrokeColor(elInput.value);
    renderCanvas();
}
function onStartDrag() {
    gIsDragging = true;
}

function onEndDrag() {
    gIsDragging = false;
    gCtx.closePath();
}
function onAddLine() {
    addLine();
    renderCanvas()
}
function onDelLine() {
    delLine();
    renderCanvas()
}

function onDownloadMeme(elLink) {
    gIsForDownload = true;
    downloadMeme(elLink)
}

function onSaveMeme() {
    saveMeme(elLink)
}
function onShareMeme(elLink) {
    shareMeme(elLink)
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

