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

function onSelectMemeImg(imgId) {
    selectMemeImg(imgId);

}



function onOpenGallery() {
    openGallery();
}

function onMangeFontSize(diff) {
    mangeFontSize(diff)
    const y = gMeme.lines[gLineIdx].y
    const x = gMeme.lines[gLineIdx].x
    renderCanvas(0, x, y)
}

function onManagePosition(diff) {
    managePosition(diff)
}

function onManageLines(diff) {
    if (gMeme.lines.length === 1) return
    manageLines(diff)
}


function onTxtChange(elInput) {
    txtChange(elInput)
    renderCanvas()
}



function onAddLine() {
    addLine();
    renderCanvas()
}
