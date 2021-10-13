var imgsrc1 = 'data:,';    // empty picture for initialisation
var imgsrc2 = 'data:,';
var imgsrc3 = 'data:,';
var restoreimg = 'data:,';
var lnwidth = 1; 
var currentbg = "#ffffff";
var textinpmode = false;
var fontsize = '30';
HTMLCanvasElement.prototype.btrclick = function(type,type1) {
 ctx = this.getContext('2d');
 if (type == 'clear') {
  ctx.fillStyle = currentbg;
  ctx.fillRect(0, 0, this.width, this.height);
 } else if (type == 'color') {  
  if (type1 == 'erase') { ctx.strokeStyle = currentbg; }
  else { ctx.strokeStyle = type1; }
 } else if (type == 'bgcolor') {  
  currentbg = type1;
  ctx.fillStyle = type1;
  ctx.fillRect(0, 0, this.width, this.height);
  imgsrc2 = imgsrc1;                                         // limit the undos
  imgsrc3 = imgsrc1;                                         // does not work
 } else if (type == 'linewidth' ) {  
  lnwidth = type1;
  ctx.lineWidth  = lnwidth;
 } else if (type == 'textinp' ) {  textinpmode =true;
 } else if (type == 'save' ) {  restoreimg = this.toDataURL();
 } else if (type == 'fontinp' ) {  
  fontsize = type1;
  ctx.font = 'bold '+fontsize+'px sans-serif';
 } else {                                                    // restore
  var img = new Image();  
  img.addEventListener('load', function () { ctx.drawImage(img, 0, 0); }, false);
  if (type == 'restimg' ) { img.src =restoreimg; }
  else { 
   img.src = imgsrc1;  
   imgsrc1 = imgsrc2;
   imgsrc2 = imgsrc3;
  }
 }
}
function initDrawing() {
 var canvas = document.getElementById('maincanvas'),
     ctx = canvas.getContext('2d'),
     drawState = false;
     newstart = true;
 function start(event) {
  if(newstart) {ctx.fillStyle = currentbg;
                ctx.lineWidth  = lnwidth;
                ctx.font = 'bold '+fontsize+'px sans-serif';
                ctx.fillRect(0, 0, this.width, this.height);
                newstart = false;
  }
  imgsrc3 = imgsrc2;
  imgsrc2 = imgsrc1;
  imgsrc1 = canvas.toDataURL();
  if(textinpmode) {
    if (currentbg == ctx.strokeStyle) {  ctx.fillStyle = '#000000'; } // after erasing
    else { ctx.fillStyle = ctx.strokeStyle; }
    ctx.fillText(document.getElementById('text4').value,
       event.offsetX || event.layerX,event.offsetY  || event.layerY);
    textinpmode = false;
    ctx.fillStyle = currentbg;
  } else {
    ctx.beginPath();
    ctx.moveTo(event.offsetX || event.layerX, event.offsetY || event.layerY);
    drawState = true;
  }
 }
 function stop(event) {
  if(drawState) { ctx.closePath(); drawState = false; }
 }
 function update(event) {
  if(drawState) {
   ctx.lineTo(event.offsetX || event.layerX, event.offsetY || event.layerY);
   ctx.stroke();
  }
 }
 canvas.addEventListener("mousedown", start, false);
 addEventListener("mouseup", stop, false);
 canvas.addEventListener("mousemove", update, false);
}
window.onload = initDrawing;

