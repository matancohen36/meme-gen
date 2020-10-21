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




function onTxtChange(elInput) {
   txtChange(elInput)
   
}