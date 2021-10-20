function setUpZoomSupport () {
    var svg = d3.select("svg"),
	inner = d3.select("svg g"),
	zoom = d3.zoom().on("zoom", function() {
	    inner.attr("transform", d3.event.transform);
	});
    svg.call(zoom);
}

function drawRelationGraph () {
  if (oldInputAreaValue !== inputArea.value) {
    inputArea.setAttribute("class", "");              // in order to distinguish from error

    var gValue = inputArea.value;
    var gSet = stringToSet(gValue,"toDot");           // convert into set of "a -> b"
    gValue = "digraph {" + Array.from(gSet).join('') + "}";
    oldInputAreaValue = gValue;
    try {
      grapharea = graphlibDot.read(gValue);           // Todo: need more checks?
    } catch (e) {
      inputArea.setAttribute("class", "error");
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
    d3.select("svg g").call(render, grapharea);          // Render the graph into svg g
  }
}

function drawVennDiagram() {

// not used

sets1 = [ {sets: ['A'], size: 12},{sets: ['B'], size: 12},{sets: ['C'], size: 12},
  {sets: ['A','B'], size: 2}, {sets: ['A','C'], size: 2}, {sets: ['B','C'], size: 2},
             {sets: ['A','B','C'], size: 2}];
sets1 = [ {sets :["U"], size :20},{sets :["U","a"], size :12},{sets :["a"], size :12}];

//console.log(sets);
//console.log(intersectionArray);

var chart = venn.VennDiagram();
d3.selectAll("g").remove();
d3.select("#venn").datum(sets).call(chart);

for(let elem of intersectionArray) {

   d3.selectAll(".venn-area[data-venn-sets="+elem+"]").attr("stroke-width", 3);
   d3.selectAll(".venn-area[data-venn-sets="+elem+"]").attr("stroke", "red");

}


}

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
	contextList = contextArray (objUnionAttList,objUnionAttList,context);
	matrixArea.innerHTML=displayTableHTML(objUnionAttList,objUnionAttList,contextList);
    } else {                                           // non-autorelation
	contextList = contextArray (objsList,attrsList,context);
	matrixArea.innerHTML = displayTableHTML(objsList,attrsList,contextList);
    }
}

function stringToSet (myString,myType) {
    const pairRE = /\[(.*?),(.*?)\]/g;
    const bracketRE = /[{}]/g;
    const bracket2RE = /[\[\]{}\s]/g;
    const separatorRE = /\]\s*,/g;

    var mySet = new Set();
    var mySet2 = new Set();
    var myString = myString.trim();
    myString = myString.replace(separatorRE, '] ?&&?');
    myString = myString.replace(bracketRE,'');
    if (myType == "toDot") {                             // convert into dot format
	myString = myString.replace(pairRE, '$1 -> $2;');
        mySet = new Set(myString.split('?&&?')); 
    } else {
        mySet = new Set(myString.split('?&&?'));
        for (let elem of mySet) {                        // turn string [..,..] into array
            elem = elem.replace(bracket2RE,'');
            mySet2.add(elem.split(','));
        }
        mySet = mySet2;
}
    return mySet;
}

function eqSet (setA, setB) {
    if (setA.size !== setB.size) return false;
    for (let a of setA) if (!setB.has(a)) return false;
    return true;
}

function union (setA, setB) {
    let _union = new Set(setA);
    for (let elem of setB) { _union.add(elem) }
    return _union;
}

function intersection (setA, setB) {
    let _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) { _intersection.add(elem) }
    }
    return _intersection;
}

function contextJSObject (myList1, myList2) {
    var _context = {};                        // create context as an object
    for (const elem of myList1) { _context[elem]= {};    }
    for (const elem of myList2) {             // fill in the 1s
        _context[elem[0]][elem[1]] = 1;
    }
    return _context;
}

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


function displayTableHTML(myObjs, myAttrs, myArray) {
    var _result = "<table>";
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
