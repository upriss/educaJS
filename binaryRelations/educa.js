const param = {taskType:"", 
               inputArea:"", 
               outputArea1:"",
               outputArea2:"",
	       oldInputAreaValue:"",
	       relType:""}; 

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
//// create link for data from input area, store in console.log
//////////////////////////////////////////////////////////////////////

function createURL() {
  var elems = [window.location.protocol, '//', window.location.host,
               window.location.pathname, '?'];
  const qparams = new URLSearchParams(window.location.search);
  var queryParams = [];
  if (qparams.get('lang')) { queryParams.push('lang=' + qparams.get('lang')); }  
  if (qparams.get('ttype')) { queryParams.push('ttype=' + qparams.get('ttype')); }  
  if (qparams.get('plusVenn')) { queryParams.push('plusVenn=' + qparams.get('plusVenn')); }
  if (qparams.get('rtype')) { queryParams.push('rtype=' + qparams.get('rtype')); }  
  queryParams.push('graph=' + encodeURIComponent(param.inputArea.value));
  elems.push(queryParams.join('&'));
  console.log(elems.join(''));
}

//////////////////////////////////////////////////////////////////////
//// start function, calls drawRelationGraph/VennDiagram and showMatrix
//////////////////////////////////////////////////////////////////////

function truth_venn (choice,inArea,oldIn,out1) {
   param.taskType = "bool";
   param.inputArea = inArea;
   param.oldInputAreaValue = oldIn;
   param.outputArea1 = out1;
   createURL();                                           // write current URL to console
   param.outputArea1.value = setlxToBool(param.inputArea);
   construct(); 
   if (choice == "yes") {
      param.taskType = "boolVenn";
      drawVennDiagram(setArray,intersectionArray);     // uses global variables
   }
}

function combin (taskType,inArea,oldIn,out1,out2) {
    param.taskType = taskType;
    param.inputArea = inArea;
    param.oldInputAreaValue = oldIn;
    param.outputArea1 = out1;
    param.outputArea2 = out2;
    createURL();                                           // write current URL to console
    drawRelationGraph();
}

function binRel (taskType,inArea,oldIn,outArea,relType) {
    param.taskType = taskType;
    param.inputArea = inArea;
    param.oldInputAreaValue = oldIn;
    param.outputArea = outArea;
    param.relType = relType; 
    createURL();                                           // write current URL to console
    if (param.taskType == "binRel") {
        param.outputArea.innerHTML = showMatrix()[0];
        drawRelationGraph(); 
    } else if (taskType == "lattice") {                       // uses fcalibs
        var _array = showMatrix();
        param.outputArea.innerHTML = _array[0];
        var oList = _array[1];
        var aList = _array[2];
        var ctxtList = _array[3];
        _array = ganter(ctxtList,oList.length,aList.length); 
        var intList = _array[0]
        var extList = _array[1]
        _array = createRel(intList);
        var subsuper = _array[1];
        var ret_string = gammaMu(extList,intList,ctxtList,oList,aList);
        drawRelationGraph("digraph {" + ret_string + Array.from(subsuper).join('') + "}"); 
    }
}

//////////////////////////////////////////////////////////////////////
//// set in inputArea -> graph in <svg> <g> (via dot format)
//////////////////////////////////////////////////////////////////////
//function drawRelationGraph (taskType,inA1,oldIn,outA1,outA2,data) {
function drawRelationGraph (data) {
  var taskType = param.taskType;
  var inA1 = param.inputArea;
  var oldIn = param.oldInputAreaValue;
  var gValue = "";
  if (oldIn !== inA1.value) {
    if (taskType == "binRel") {
       inA1.setAttribute("class", "codeLineInput");      // in order to distngsh from error
       gValue = inA1.value;
       var gSet = stringToSet(gValue,"toDot");           // convert into set of "a -> b"
       gValue = "digraph {" + Array.from(gSet).join('') + "}";
       oldIn = gValue;
    } else if (taskType == "lattice") {                  // for FCA
       inA1.setAttribute("class", "codeLineInput");      // in order to distngsh from error
       gValue = data;
       oldIn = gValue;
    } else if (taskType == "combin") {                   // for combinatorics
       var outA1 = param.outputArea1;
       var outA2 = param.outputArea2;
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
//// changes in the context matrix -> change inputArea, then call binrel
//////////////////////////////////////////////////////////////////////

function ctxtNewCellVal(id,obj,attr) {
   if (document.getElementById(id).innerHTML == 0) {
      document.getElementById(id).innerHTML = 1;
      if (param.inputArea.value.match(/\{\}/)) {
	  param.inputArea.value = '{['+obj+','+attr+']}'; 
      } else {
        param.inputArea.value=param.inputArea.value.replace(/\]\}/,'], ['+obj+','+attr+']}');
      }
   } else {
      document.getElementById(id).innerHTML = 0;
      let replstring = "\\[\\s*" + obj + "\\s*,\\s*" + attr  + "\\s*\\]\\s*";
      let re1 = new RegExp(replstring,"g");
      param.inputArea.value = param.inputArea.value.replace(re1,'');
      param.inputArea.value = param.inputArea.value.replace(/,\s*,/,',');
      param.inputArea.value = param.inputArea.value.replace(/,\s*}/,'}');
      param.inputArea.value = param.inputArea.value.replace(/{\s*,\s*/,'{');
   }
   binRel(param.taskType,param.inputArea,param.oldInputAreaValue,param.outputArea,param.relType);
};

function ctxtNewObjVal(val,obj) {
   val = val.replace(/ /g,'_');
   let re1 = new RegExp("\\[" + obj + ",",'g');
   param.inputArea.value = param.inputArea.value.replace(re1,'[' + val + ',');
   binRel(param.taskType,param.inputArea,param.oldInputAreaValue,param.outputArea,param.relType);
};

function ctxtNewAttrVal(val,attr) {
   val = val.replace(/ /g,'_');
   let re1 = new RegExp("," + attr + "\\]",'g');
   param.inputArea.value = param.inputArea.value.replace(re1,',' + val + ']');
   binRel(param.taskType,param.inputArea,param.oldInputAreaValue,param.outputArea,param.relType);
};

//////////////////////////////////////////////////////////////////////
//// set in inputArea.value -> binary matrix in matrixArea (via context)
//////////////////////////////////////////////////////////////////////
function showMatrix () {
    var gValue = param.inputArea.value;
    var relType = param.relType;
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
    return [_result,objsList,attrsList,contextList];
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
        _result += "<th class='column' >";
        _result += "<input type='text' id='c_at_"+j+"' size='3' value='" + myAttrs[j] +"'";
        _result += "onchange=\"ctxtNewAttrVal(this.value,'" + myAttrs[j] + "');\"";
        _result += " style='cursor: pointer;'></input></th>";
    }
    _result += "</tr>";
    for(var i=0; i<myArray.length; i++) {
        _result += "<tr>";
        _result += "<th class='row'>";
	_result += "<input type='text' id='c_ob_"+i+"' size='3' value='" + myObjs[i] +"'";
        _result += "onchange=\"ctxtNewObjVal(this.value,'" + myObjs[i] + "');\"";
        _result += " style='cursor: pointer;'></input></th>";
        for(var j=0; j<myArray[i].length; j++){
            _result += "<td id='cell_"+i+"_" + j;
            _result += "' onclick=\"ctxtNewCellVal(this.id,'";
            _result += myObjs[i] + "','" + myAttrs[j] + "');\"";
            _result += " style='cursor: pointer;' >" + myArray[i][j] + "</td>";
        }
        _result += "</tr>";
    }
    _result += "</table>";
    return _result;
}

//////////////////////////////////////////////////////////////////////
//// adds column/row to matrix by entering elements to inputArea
//////////////////////////////////////////////////////////////////////

function addColumn() {
   let re1 = new RegExp("\\[(.*?),(.*?)\\]\s*}");
   param.inputArea.value = param.inputArea.value.replace(re1,'[$1,$2], [$1,newAttr]}');
   binRel(param.taskType,param.inputArea,param.oldInputAreaValue,param.outputArea,param.relType);
}

function addRow() {
   let re1 = new RegExp("\\[(.*?),(.*?)\\]\s*}");
   param.inputArea.value = param.inputArea.value.replace(re1,'[$1,$2], [newObj,$2]}');
   binRel(param.taskType,param.inputArea,param.oldInputAreaValue,param.outputArea,param.relType);
}
