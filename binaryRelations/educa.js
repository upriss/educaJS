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
function drawRelationGraph () {
  if (oldInputAreaValue !== inputArea.value) {
    inputArea.setAttribute("class", "codeLineInput"); // in order to distinguish from error

    var gValue = inputArea.value;
    var gSet = stringToSet(gValue,"toDot");           // convert into set of "a -> b"
    gValue = "digraph {" + Array.from(gSet).join('') + "}";
    oldInputAreaValue = gValue;
    try {
      grapharea = graphlibDot.read(gValue);           // Todo: need more checks?
    } catch (e) {
      inputArea.setAttribute("class", "codeLineInput error");
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
//// set in inputArea -> binary matrix in matrixArea (via context)
//////////////////////////////////////////////////////////////////////
function showMatrix (relType) {
    var gValue = inputArea.value;
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
	matrixArea.innerHTML=displayTableHTML(objUnionAttList,objUnionAttList,contextList);
    } else {                                           // non-autorelation
	contextList = contextArray(objsList,attrsList,context);
	matrixArea.innerHTML = displayTableHTML(objsList,attrsList,contextList);
    }
}

//////////////////////////////////////////////////////////////////////
//// set in setArray -> graph in <svg> <g> within <div id="venn">  
//////////////////////////////////////////////////////////////////////
function drawVennDiagram() {

// example of the structure
//    sets1 = [ {sets: ['A'], size: 12},{sets: ['B'], size: 12},{sets: ['C'], size: 12},
//	      {sets: ['A','B'], size: 2}, {sets: ['A','C'], size: 2}, 
//	      {sets: ['B','C'], size: 2}, {sets: ['A','B','C'], size: 2}];

    d3.selectAll("g").remove();
    d3.select("#venn").datum(setArray).call(venn.VennDiagram());

    for(let elem of intersectionArray) {
	d3.selectAll(".venn-area[data-venn-sets="+elem+"]").attr("stroke-width", 3);
	d3.selectAll(".venn-area[data-venn-sets="+elem+"]").attr("stroke", "red");
    }
}

//////////////////////////////////////////////////////////////////////
//// setlx in inNew -> boolean notation in in
//////////////////////////////////////////////////////////////////////

function setlxToBool () { 
    var formul = document.getElementById('inNew').value.replace(/ /g,'');
    formul = formul.replace(/!/g,'~');
    formul = formul.replace(/&&/g,'&');
    formul = formul.replace(/\|\|/g,'v');
    formul = formul.replace(/<==>/g,'<>');
    formul = formul.replace(/=>/g,'>');
    document.getElementById('in').value = formul;
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
//// HTML display of a context with lists of objs, attrs and context
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
