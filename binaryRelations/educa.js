//////////////////////////////////////////////////////////////////////
//// for zoom in an svg g tag
//////////////////////////////////////////////////////////////////////
function setUpZoomSupport () {                        
    var svg = d3.select("svg"),
	zoom = d3.zoom().on("zoom", function() {
	    d3.select("svg g").attr("transform", d3.event.transform);
	});
    svg.call(zoom);
}

//////////////////////////////////////////////////////////////////////
//// set in inputArea -> graph in <svg> <g> (via dot format)
//////////////////////////////////////////////////////////////////////
function drawRelationGraph (taskType,inA1,oldIn,outA1,outA2) {
  var gValue = "";

  if (oldIn !== inA1.value) {
    if (taskType == "binRel") {
       inA1.setAttribute("class", "codeLineInput");      // in order to distngsh from error
       gValue = inA1.value;
       var gSet = stringToSet(gValue,"toDot");           // convert into set of "a -> b"
       gValue = "digraph {" + Array.from(gSet).join('') + "}";
       oldIn = gValue;
    } else if (taskType == "combin") {                          // for combinatorics
       var fm1 = inA1[0];
       var fm2 = inA1[1];
       var fmBck = inA1[2];
       var fmSeq = inA1[3];
       if (fm1.value > fm2.value) {
          gValue = "digraph { \"Fehler: Die erste Zahl muss kleiner sein!\"}"; 
          outA1.innerHTML = "Fehler: Die erste Zahl muss kleiner sein!";
       } else if (parseInt(fm1.value) + parseInt(fm2.value) > 10) {
          gValue = "digraph { \"W&auml;hlen Sie bittere kleinere Zahlenwerte.\"}"; 
          outA1.innerHTML = "W&auml;hlen Sie bittere kleinere Zahlenwerte.";
       } else {
          var tempArray = [];                               // create data structure
          tempArray = combinArray(fm1.value,fm2.value,fmBck.checked,fmSeq.checked);
          outA1.innerHTML =                                 // display count and content
              displayComArray(tempArray,fm1.value,fmSeq.checked,outA2);
          var tempString = "";                              // convert array to dot
          var tempString2 = "";
          for (let val of tempArray[fm1.value-1]) {   // process first level
                tempString += "node" + "1" + val.substring(1,2)
                           +" [label=\"" + val.substring(1,2) + "\"];";
          }
          for (let val of tempArray[fm1.value-1]) {   // process array of last level
             for(let i = 2; i < Array.from(val).length; i++) {   // create edges
                tempString2 = "node"+ (i-1).toString() + val.substring(1,i)
                              + "->node" + i.toString() + val.substring(1,i+1) + ";";
//                let reg = new RegExp(tempString2);          // avoid duplicate edges
//                if (tempString.search(reg) < 0) {           // not needed with strict
		tempString += tempString2;
//                }
                tempString2 = "node"+ i.toString() + val.substring(1,i+1) +  // node labels
                          " [label=\"" + val.substring(i,i+1).toString() + "\"];";
                tempString += tempString2;                  // ToDo: avoid duplicates
             }
          }
          gValue = "strict digraph {rankdir=LR;" + tempString + "}";
       }
    }
    try {
      grapharea = graphlibDot.read(gValue);           // Todo: need more checks?
    } catch (e) {
      if (typeof inA1.value != 'undefined') { 
         inA1.setAttribute("class", "codeLineInput error");
      }
      throw e;
    }
    if (!grapharea.graph().hasOwnProperty("marginx") &&  // Set margins, if not present
        !grapharea.graph().hasOwnProperty("marginy")) {
      grapharea.graph().marginx = 20;
      grapharea.graph().marginy = 20;
    }
    grapharea.graph().transition = function(selection) {
      return selection.transition().duration(500);
    };
    d3.select("svg g").call(dagreD3.render(), grapharea); // Render the graph into svg g
  }
}

//////////////////////////////////////////////////////////////////////
//// set in inputArea.value -> binary matrix in matrixArea (via context)
//////////////////////////////////////////////////////////////////////
function showMatrix (gValue,relType) {
    var _result ="";
    var gArray = Array.from(stringToSet(gValue,""));   //  ToDo: do Quotes always work?
    var objs = new Set();
    var attrs = new Set();
    for (const val of gArray) {                        // objects and attributes as sets
	objs.add(val[0]);
	attrs.add(val[1]);
    }
    var objsList = Array.from(objs);                   // objects and attributes as array
    var attrsList = Array.from(attrs);
    objsList.sort();
    attrsList.sort();

    var objUnionAtt = union(objs,attrs);               // union of objects and attributes
    var objUnionAttList = Array.from(objUnionAtt);
    objUnionAttList.sort();

    var context = contextJSObject(objsList,gArray);    // context as JSObject
    var contextList = [];                              // context as array
    if (relType == 'auto') {                           // autorelation
	contextList = contextArray(objUnionAttList,objUnionAttList,context);
	_result = displayTableHTML(objUnionAttList,objUnionAttList,contextList);
    } else {                                           // non-autorelation
	contextList = contextArray(objsList,attrsList,context);
	_result = displayTableHTML(objsList,attrsList,contextList);
    }
    return _result;
}

//////////////////////////////////////////////////////////////////////
//// set in setArray -> graph in <svg> <g> within <div id="venn">  
//////////////////////////////////////////////////////////////////////
function drawVennDiagram(setArr,intersArr) {

// example of the structure
//    sets1 = [ {sets: ['A'], size: 12},{sets: ['B'], size: 12},{sets: ['C'], size: 12},
//	      {sets: ['A','B'], size: 2}, {sets: ['A','C'], size: 2}, 
//	      {sets: ['B','C'], size: 2}, {sets: ['A','B','C'], size: 2}];

    d3.selectAll("g").remove();
    d3.select("#venn").datum(setArr).call(venn.VennDiagram());

    for(let elem of intersArr) {
	d3.selectAll(".venn-area[data-venn-sets="+elem+"]").attr("stroke-width", 3);
	d3.selectAll(".venn-area[data-venn-sets="+elem+"]").attr("stroke", "red");
    }
}

//////////////////////////////////////////////////////////////////////
//// form parameters -> array of possible combinations 
//////////////////////////////////////////////////////////////////////

function combinArray(size1,size2,kind1,kind2) {
    var _tempArray = [];
    for (let i = 0; i < size1; i++) {
        _tempArray[i] = [];
        for (let j = 0; j < size2; j++) {
            if (i == 0) { _tempArray[i].push("a"+j.toString()); }
            if (i > 0) {
               for (let k = 0; k < size2; k++) {
                   for (let val of _tempArray[i-1]) {
		       if (val.slice(-1) == j ) {
                           if (kind1 == true && kind2 == true) { // replacm and seqnce
 			     _tempArray[i].push(val+k.toString()); 
			   } else if (kind1 == false && kind2 == false) {
			     if (j < k) {_tempArray[i].push(val+k.toString());}
                           } else if (kind1 == false && kind2 == true) { // no repl.
 			     if (!val.includes(k)) {_tempArray[i].push(val+k.toString());}
                           } else if (kind1 == true && kind2 == false) {
			     if (j <= k) {_tempArray[i].push(val+k.toString());}
                           }
		       }
		   }

               }
            }
        } 
    }
    return _tempArray;
}

//////////////////////////////////////////////////////////////////////
//// array and form parameters -> produce string for count
//////////////////////////////////////////////////////////////////////

function displayComArray (myArray,size,bool,outA2) {
    var _tempString = "";
    var _tempStr2 = "";
    for (let i = 0; i < size; i++) {                             // calculate the count
       if (i == 0) { 
          _tempString += myArray[i].length.toString() + "*";
       } else {
          _tempString += myArray[i].length/myArray[i-1].length.toString() + "*";
       }
    }
    _tempString = " = " + _tempString.slice(0,-1);
    if (bool == false) { 
	_tempString = ""; 
        outA2.innerHTML ="Pascal-Dreieck:<br><img src='pascal.jpg'>";
    } else { outA2.innerHTML =""; }
    _tempString = "<h3>" + myArray[size-1].length + _tempString + "</h3>";
//    for (let val of myArray[formFirst.value-1]) {   // process array of last level
    for (let val of myArray[size-1]) {   // process array of last level
	_tempStr2 = val.substring(1);
        _tempStr2 = Array.from(_tempStr2).join(', ');
        if (bool == true) { _tempString += "["+_tempStr2+"] "; }
        else { _tempString += "{"+_tempStr2+"} "; }
    }
    return _tempString;
}

//////////////////////////////////////////////////////////////////////
//// convert setlx to boolean notation (eg inNew -> in)
//////////////////////////////////////////////////////////////////////

function setlxToBool (inString) { 
    var _formul = inString.value.replace(/ /g,'');
    _formul = _formul.replace(/!/g,'~');
    _formul = _formul.replace(/&&/g,'&');
    _formul = _formul.replace(/\|\|/g,'v');
    _formul = _formul.replace(/<==>/g,'<>');
    _formul = _formul.replace(/=>/g,'>');
    return _formul;
}

//////////////////////////////////////////////////////////////////////
//// conversion, for a set of a binary relation
//////////////////////////////////////////////////////////////////////
function stringToSet (myString,myType) {
    var _Set = new Set();
    var _Set2 = new Set();
    myString = myString.trim();
    myString = myString.replace(/\]\s*,/g, '] ?&&?');    // separate the elements
    myString = myString.replace(/[{}]/g,'');             // delete brackets {}
    if (myType == "toDot") {                             // convert into dot format
	myString = myString.replace(/\[(.*?),(.*?)\]/g, '$1 -> $2;');
        _Set = new Set(myString.split('?&&?')); 
    } else {
        _Set = new Set(myString.split('?&&?'));
        for (let elem of _Set) {                         // turn string [..,..] into array
            elem = elem.replace(/[\[\]{}\s]/g,'');
            _Set2.add(elem.split(','));
        }
        _Set = _Set2;
}
    return _Set;
}

//////////////////////////////////////////////////////////////////////
//// set operation
//////////////////////////////////////////////////////////////////////
function eqSet (setA, setB) {
    if (setA.size !== setB.size) return false;
    for (let a of setA) if (!setB.has(a)) return false;
    return true;
}

//////////////////////////////////////////////////////////////////////
//// set operation
//////////////////////////////////////////////////////////////////////
function union (setA, setB) {
    let _union = new Set(setA);
    for (let elem of setB) { _union.add(elem) }
    return _union;
}

//////////////////////////////////////////////////////////////////////
//// set operation
//////////////////////////////////////////////////////////////////////
function intersection (setA, setB) {
    let _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) { _intersection.add(elem) }
    }
    return _intersection;
}

//////////////////////////////////////////////////////////////////////
//// create context as an object
//////////////////////////////////////////////////////////////////////
function contextJSObject (myList1, myList2) {
    var _context = {};
    for (const elem of myList1) { _context[elem]= {};    }
    for (const elem of myList2) {             // fill in the 1s
        _context[elem[0]][elem[1]] = 1;
    }
    return _context;
}

//////////////////////////////////////////////////////////////////////
//// create context as an array
//////////////////////////////////////////////////////////////////////
function contextArray (myObjs, myAttrs, myContext) {
    var _ctxtList = [];                 
    for (let i = 0; i < myObjs.length; i++) {
	_ctxtList[i] = [];
	for (let j = 0; j < myAttrs.length; j++) {
            if (typeof myContext[myObjs[i]] !== 'undefined' &&
                myContext[myObjs[i]][myAttrs[j]] == 1) {
		_ctxtList[i][j] = '1';
	    } else {
		_ctxtList[i][j] = '0';
	    }
	}
    }
    return _ctxtList;
}

//////////////////////////////////////////////////////////////////////
//// returns HTML formatting of a context with lists of objs, attrs and context
//////////////////////////////////////////////////////////////////////
function displayTableHTML(myObjs, myAttrs, myArray) {
    var _result = "<table class='matrix'>";
    _result += "<tr><th class='row column'></th>";
    for(var j=0; j<myAttrs.length; j++){
        _result += "<th class='column'>" + myAttrs[j] + "</th>";
    }
    _result += "</tr>";
    for(var i=0; i<myArray.length; i++) {
        _result += "<tr>";
        _result += "<th class='row'>" + myObjs[i] + "</th>";
        for(var j=0; j<myArray[i].length; j++){
            _result += "<td>" + myArray[i][j] + "</td>";
        }
        _result += "</tr>";
    }
    _result += "</table>";
    return _result;
}
