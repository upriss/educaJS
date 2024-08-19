var dragElem = null;
var cols;
var pClassName = "piece";

function addEventLstners() {
    cols = document.querySelectorAll('.' + pClassName);
    for (var i = 0; i < cols.length; i++) {
        cols[i].addEventListener('dragstart', startDragHandler, false);
        cols[i].addEventListener('dragover', overDragHandler, false);
        cols[i].addEventListener('dragleave', leaveDragHandler, false);
        cols[i].addEventListener('drop', dropDragHandler, false);
    };
};

function pCheck(elemID) {
    let puzzleArray = [];
    var colms = document.querySelectorAll('#' + elemID + ' .' + pClassName);
    for (var i = 0; i < colms.length; i++) {
        puzzleArray.push(colms[i].children[0].getAttribute('class'));
    };
    let solution = "p0,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10";
    if (solution.includes(puzzleArray.join())) {
	const para = document.createElement("span");
	const node = document.createTextNode(" Richtig");
	para.appendChild(node);
	document.getElementById(elemID).appendChild(para);
    };
};
function startDragHandler(e) {
    dragElem = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('over');
    for (var i = 0; i < cols.length; i++) { cols[i].classList.add('start'); };
};
function overDragHandler(e) {
    e.preventDefault();
    this.classList.add('over');
    e.dataTransfer.dropEffect = 'move';
};

function dropDragHandler(e) {
    e.preventDefault();
    dragElem.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
    for (var i = 0; i < cols.length; i++) { cols[i].className = pClassName; };
    pCheck(this.parentElement.id);
};

function leaveDragHandler(e) {
    this.classList.remove('over');
};

