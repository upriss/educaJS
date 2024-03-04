// Todo 4th set

const lgth = 120;            // length of grid element
const dist = 5;              // dislocation
const mm = 15;               // margin
const mm2 = lgth+mm;
const mm3 = 2*lgth+mm;
const mm4 = 3*lgth+mm;
const mmd = 15 + dist;
const mmd2 = lgth+mm + dist;
const mmd3 = 2*lgth+mm + dist;
const mmd4 = 3*lgth+mm + dist;

const cells = ["0 "+mm,  lgth+" "+mm,  2*lgth+" "+mmd,  3*lgth+" "+mmd,
	       "0 "+mm2, lgth+" "+mm2, 2*lgth+" "+mmd2, 3*lgth+" "+mmd2,
	       "0 "+mm3, lgth+" "+mm3, 2*lgth+" "+mmd3, 3*lgth+" "+mmd3,
	       "0 "+mm4, lgth+" "+mm4, 2*lgth+" "+mmd4, 3*lgth+" "+mmd4];
//const colrs =["#87cefa", "#f5f75c", "#f04f41", "#90ee90", "#c265b4", "#fcad23", 
//              "#d18956", "#eeffFF", "#777777"];

const colrs = ["#b3dff2", "#faf7a7", "#fab9a7", "#d7ebd5", "#d7cce5", "#f7dd94",
                "#e7dca5", "#eeCCCC", "#000000"]; // "#464646"];

//const colrs = ["#eeeeaa", "#eeeeaa", "#eeeeaa", "#eeeeaa", "#eeeeaa", "#eeeeaa", 
//                "#eeeeaa", "#eeeeaa", "#464646"];

function drawCurve(xcrd,ycrd,width,height,g,color) {
//    shape = "M "+xcrd+" "+ycrd+" v "+height+" h "+width+" v -"+height+" z";
//    g.append("path").attr("d", shape).attr("stroke",color).attr("opacity", 1)
//    .attr("fill","none").attr("stroke-width","5")
    g.append("rect").attr("x",xcrd).attr("y",ycrd).attr("rx",5)
      .attr("width",width).attr("height",height).attr("stroke",color).attr("opacity", 1)
      .attr("fill","none").attr("stroke-width","7");
}

function drawPath(ids,cell,type,color,width,height,g){
    shape = "M " + cell + " v "+height+" h "+width+" v -"+height+" z";
    g.append("path").attr("d", shape).attr("class", "segment").attr("fill", color)
       .attr("id",ids).attr("opacity", 1);
}

function shading (numbr,g) {
   d3.select("#backgr").attr("fill",colrs[8]);
   const zones = [];
   if (numbr == 1) {
      drawPath("zna", cells[1], "one", colrs[8],lgth,lgth,g);
   } else if (numbr == 2) {
      drawPath("zna", cells[1], "one", colrs[8],lgth,2*lgth,g);
      drawPath("znb", cells[3], "one", colrs[8],lgth,2*lgth,g);
      drawPath("znab", cells[2], "two", colrs[8],lgth,2*lgth,g);
   } else {
      drawPath("zna", cells[1], "one", colrs[8],lgth,lgth,g);
      drawPath("znb", cells[3], "one", colrs[8],lgth,lgth,g);
      drawPath("znc", cells[4], "one", colrs[8],lgth,lgth,g);
      drawPath("znab", cells[2], "two", colrs[8],lgth,lgth,g);
      drawPath("znac", cells[5], "two", colrs[8],lgth,lgth,g);
      drawPath("znbc", cells[7], "two", colrs[8],lgth,lgth,g);
      drawPath("znabc", cells[6], "three", colrs[8],lgth,lgth,g);
   }
}

function mouseOvers (g) {                                  // not used
   g.selectAll("path.segment")
       .on("mouseover", function () {
   //        d3.select(this).transition().attr("opacity", 0.8).duration(500)
           d3.select(this).attr("fill",d3.color(d3.select(this).style('fill')).darker(1));
       })
       .on("mouseout", function () {
   //        d3.select(this).transition().attr("opacity", 0.4).duration(500)
           d3.select(this).attr("fill",d3.color(d3.select(this).style('fill')).darker(-1));
       })
}

function showLabels (text, numbr,g,xPoint,yPoint,color) {
   g.append("text").text(text).attr("x", xPoint).attr("y", yPoint-5)
	.attr("stroke",color).attr("fill",color);
}

////////////////////////////////////////////////////////////////////////////////
//  textArray: labels of sets, selectedZones: a_b_c, etc, numbr: 1,2 or 3
////////////////////////////////////////////////////////////////////////////////
function vennDir (textArray, selectedZones, numbr,g) {
                                                
// x/y coordinates of upper left corner of rectangles, (0,0) is upper left corner
   const xCorner = [0,120,240,360];
   const yCorner = [15,135,255,375];

     shading(numbr,g);                        // all are shaded, each has an id "zn.."
//   mouseOvers(g);

   for (let i = 0; i < selectedZones.length; i++) {    // which zones are selected
     if (selectedZones[i] == "U") { 
        d3.select("#backgr").attr("fill",colrs[7]);        
     } else if (selectedZones[i] == textArray[0]) {
        d3.select("#zna").attr("fill",colrs[0]);
     } else if (selectedZones[i] == textArray[1]) {
        d3.select("#znb").attr("fill",colrs[1]);
     } else if (selectedZones[i] == textArray[2]) {
        d3.select("#znc").attr("fill",colrs[2]);
     } else if (selectedZones[i] == textArray[0] + "_"+ textArray[1]) {
        d3.select("#znab").attr("fill",colrs[3]);
     } else if (selectedZones[i] == textArray[0] + "_"+ textArray[2]) {
        d3.select("#znac").attr("fill",colrs[4]);
     } else if (selectedZones[i] == textArray[1] + "_"+ textArray[2]) {
        d3.select("#znbc").attr("fill",colrs[5]);
     } else if (selectedZones[i] == textArray[0] + "_"+ textArray[1] +"_"+ textArray[2]) {
        d3.select("#znabc").attr("fill",colrs[6]);
     }
   }

    if (numbr == 1) {
	drawCurve(xCorner[1],yCorner[0],lgth,lgth,g,colrs[0])
	showLabels(textArray[0],numbr,g,xCorner[1],yCorner[0],colrs[0]);
    } else if (numbr == 2) {
	drawCurve(xCorner[1],yCorner[0],2*lgth,2*lgth,g,colrs[0])
	drawCurve(xCorner[2],yCorner[0]+dist,2*lgth,2*lgth,g,colrs[1])
	showLabels(textArray[0],numbr,g,xCorner[1],yCorner[0],colrs[0]);
	showLabels(textArray[1],numbr,g,xCorner[2]+2*lgth-20,yCorner[0],colrs[1]);
    } else if (numbr == 3) {
	drawCurve(xCorner[1],yCorner[0],2*lgth,2*lgth,g,colrs[0])
	drawCurve(xCorner[2],yCorner[0]+dist,2*lgth,2*lgth,g,colrs[1])
	drawCurve(xCorner[0],yCorner[1],4*lgth,lgth,g,colrs[2])
	showLabels(textArray[0],numbr,g,xCorner[1],yCorner[0],colrs[0]);
	showLabels(textArray[1],numbr,g,xCorner[2]+2*lgth-20,yCorner[0],colrs[1]);
	showLabels(textArray[2],numbr,g,xCorner[0],yCorner[1],colrs[2]);
    } else if (numbr == 4) {
	drawCurve(xCorner[1],yCorner[0],2*lgth,3*lgth,g,colrs[0])
	drawCurve(xCorner[2],yCorner[0]+dist,2*lgth,3*lgth,g,colrs[1])
	drawCurve(xCorner[0],yCorner[1],4*lgth,2*lgth,g,colrs[2])
	drawCurve(xCorner[0]+dist,yCorner[2],4*lgth,2*lgth,g)
    }

}
      
   
