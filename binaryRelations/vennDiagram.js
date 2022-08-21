const circleRad = 100;
const offsetFactor = 1.2;
const offset = offsetFactor * circleRad;
const startpnt = 150;
//const colrs =["#87cefa", "#f5f75c", "#f04f41", "#90ee90", "#c265b4", "#fcad23", 
//              "#d18956", "#eeffFF", "#777777"];

const colrs = ["#b3dff2", "#faf7a7", "#fab9a7", "#d7ebd5", "#d7cce5", "#f7dd94",
                "#e7dca5", "#eeCCCC", "#464646"];

function drawCircle(radius,xcenter,ycenter,g) {
        return circle = g.append("circle").attr("r", radius).attr("stroke","black")
                  .attr('transform', "translate(" + xcenter + "," + ycenter + ")");
}

function computePoints (x_cent,y_cent,radius,offst) {
   // drawing of the Venn diagram follows Calder M. Myers
   // medium.com/@cmmyers/how-i-made-an-interactive-venn-diagram-with-d3-fa723c55a148
   const triHeight = Math.sqrt(radius ** 2  -  (offst / 2) ** 2)
   const xPoints = []                          //outer intersection of Circles 1 and 2
   const yPoints = []
   xPoints[0] = x_cent[2]
   yPoints[0] = y_cent[0] - triHeight
   xPoints[3] = x_cent[2]                      //inner intersection of Circles 1 and 2
   yPoints[3] = y_cent[0] + triHeight
   
   //treat "triHeight" as the hypoteneuse of a 30.60.90 triangle.
   //shift from the midpoint of a leg of the triangle to the point of intersection
   const xDelta = triHeight * Math.sqrt(3) / 2
   const yDelta = triHeight / 2
   
   const xMidpointC1C3 = (x_cent[0] + x_cent[2]) / 2
   const xMidpointC2C3 = (x_cent[1] + x_cent[2]) / 2
   const yMidpointBoth = (y_cent[0] + y_cent[2]) / 2
   
   xPoints[1] = xMidpointC1C3 - xDelta         //find rest of the points of intersection
   yPoints[1] = yMidpointBoth + yDelta
   xPoints[2] = xMidpointC2C3 + xDelta
   yPoints[2] = yMidpointBoth + yDelta
   xPoints[4] = xMidpointC1C3 + xDelta
   yPoints[4] = yMidpointBoth - yDelta
   xPoints[5] = xMidpointC2C3 - xDelta
   yPoints[5] = yMidpointBoth - yDelta
   return [xPoints,yPoints]
}

const makeShapes = ([x1, x2, x3, y1, y2, y3], v1, v2, v3) => {
  path = `M ${x1} ${y1}
             A ${circleRad} ${circleRad} 0 0 ${v1} ${x2} ${y2}
             A ${circleRad} ${circleRad} 0 0 ${v2} ${x3} ${y3}
             A ${circleRad} ${circleRad} 0 ${v3} 1 ${x1} ${y1}`
  return path
}

function drawPath(ids,points,type,color,g){
   let v1 = 0;
   let v2 = 0;
   let v3 = 0;
   if (type == "two") { v1 = 1; } 
   else if (type == "one") { v3 = 1; } 
   else { v1 = 1; v2 = 1; }
   const ptCycle = points.map(i => xPoints[i]).concat(   // find coord for each point
     points.map(i => yPoints[i])
   )
   const shape = makeShapes(ptCycle,v1,v2,v3)

   g.append("path").attr("d", shape).attr("class", "segment").attr("fill", color)
//       .attr("opacity", 0.4)
       .attr("id",ids).attr("opacity", 1)
}

function colouring (numbr,g) {                            // not used
   const zones = [];
   if (numbr == 2) {
      zones[0] = [0, 5, 3];                 // a
      zones[1] = [3, 4, 0];                 // b
      zones[2] = [0, 3, 3];                 // ab
      drawPath("zn0", zones[0], "one", colrs[0],g);
      drawPath("zn1", zones[1], "one", colrs[1],g)
      drawPath("zn3", zones[2], "two", colrs[3],g);
   } else {
      zones[0] = [0, 5, 1];                 // a
      zones[1] = [2, 4, 0];                 // b
      zones[2] = [1, 3, 2];                 // c
      zones[3] = [0, 4, 5];                 // ab
      zones[4] = [1, 5, 3];                 // ac
      zones[5] = [2, 3, 4];                 // bc
      zones[6] = [4, 3, 5];                 // abc
      drawPath("zn0", zones[0], "one", colrs[0],g);
      drawPath("zn1", zones[1], "one", colrs[1],g);
      drawPath("zn2", zones[2], "one", colrs[2],g);
      drawPath("zn3", zones[3], "two", colrs[3],g);
      drawPath("zn4", zones[4], "two", colrs[4],g);
      drawPath("zn5", zones[5], "two", colrs[5],g);
      drawPath("zn6", zones[6], "three", colrs[6],g);
   }
}

function shading (numbr,g) {
   d3.select("#backgr").attr("fill",colrs[8]);
   const zones = [];
   if (numbr == 2) {
      zones[0] = [0, 5, 3];                 // a
      zones[1] = [3, 4, 0];                 // b
      zones[2] = [0, 3, 3];                 // ab
      drawPath("zn0", zones[0], "one", colrs[8],g);
      drawPath("zn1", zones[1], "one", colrs[8],g)
      drawPath("zn3", zones[2], "two", colrs[8],g);
   } else {
      zones[0] = [0, 5, 1];                 // a
      zones[1] = [2, 4, 0];                 // b
      zones[2] = [1, 3, 2];                 // c
      zones[3] = [0, 4, 5];                 // ab
      zones[4] = [1, 5, 3];                 // ac
      zones[5] = [2, 3, 4];                 // bc
      zones[6] = [4, 3, 5];                 // abc
      drawPath("zn0", zones[0], "one", colrs[8],g);
      drawPath("zn1", zones[1], "one", colrs[8],g);
      drawPath("zn2", zones[2], "one", colrs[8],g);
      drawPath("zn3", zones[3], "two", colrs[8],g);
      drawPath("zn4", zones[4], "two", colrs[8],g);
      drawPath("zn5", zones[5], "two", colrs[8],g);
      drawPath("zn6", zones[6], "three", colrs[8],g);
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

function showLabels ([textA, textB, textC], numbr,g) {
   g.append("text").text(textA).attr("x", xPoints[0]-130).attr("y", yPoints[0]-20);
   g.append("text").text(textB).attr("x", xPoints[0]+130).attr("y", yPoints[0]-20);
   if (numbr == 3) {
      g.append("text").text(textC).attr("x", xPoints[3]).attr("y", yPoints[3]+150);
   }
}

function vennDir (textArray, shadedZones, numbr,g) {
                                                // x-y coordinates of the 3 circles
   const xCenter = [startpnt, startpnt + offset, startpnt + offset / 2];
   const yCenter = [startpnt, startpnt, startpnt + Math.sqrt(3) * offset / 2];
   
   drawCircle(circleRad,xCenter[0],yCenter[0],g);
   drawCircle(circleRad,xCenter[1],yCenter[1],g);
   if (numbr == 3) { drawCircle(circleRad,xCenter[2],yCenter[2],g); }
   
   const _array = computePoints(xCenter,yCenter,circleRad,offset)
   xPoints = _array[0]
   yPoints = _array[1]
   
//   colouring(numbr,g);
     shading(numbr,g);   
//   mouseOvers(g);

//   for (let i = 0; i < xPoints.length; i++) {       // for debugging: show xyPoints
//      g.append("text").text(i).attr("x", xPoints[i]).attr("y", yPoints[i])
//   }
   showLabels(textArray, numbr,g);
   for (let i = 0; i < shadedZones.length; i++) {    // figure out which zones are shaded
     if (shadedZones[i] == "U") { 
        d3.select("#backgr").attr("fill",colrs[7]);        
     } else if (shadedZones[i] == textArray[0]) {
        d3.select("#zn0").attr("fill",colrs[0]);
     } else if (shadedZones[i] == textArray[1]) {
        d3.select("#zn1").attr("fill",colrs[1]);
     } else if (shadedZones[i] == textArray[2]) {
        d3.select("#zn2").attr("fill",colrs[2]);
     } else if (shadedZones[i] == textArray[0] + "_"+ textArray[1]) {
        d3.select("#zn3").attr("fill",colrs[3]);
     } else if (shadedZones[i] == textArray[0] + "_"+ textArray[2]) {
        d3.select("#zn4").attr("fill",colrs[4]);
     } else if (shadedZones[i] == textArray[1] + "_"+ textArray[2]) {
        d3.select("#zn5").attr("fill",colrs[5]);
     } else if (shadedZones[i] == textArray[0] + "_"+ textArray[1] +"_"+ textArray[2]) {
        d3.select("#zn6").attr("fill",colrs[6]);
     }
   }
}
      
   
