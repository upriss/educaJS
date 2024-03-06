const param = {taskType: "",    // bool, boolVenn, binRel, lattice, combin, group1
               inputArea: "", 
               outputArea1: "",
               outputArea2: "",
	       oldInputAreaValue: "",
               leftset: "",
               rightset: "",
	       relType: "",     // auto
	       csv: "",
	       embed: ""};    

const main = {objArray: [],
              attrArray: [],
	      intensionArray: [],  // only euler/venn
	      zoneArray: [],   // only euler/venn
              matrixArray: [],
	      transMatrixArray: []};

const algGrp = {universe: new Set(),      // only for group theory
                neutralElem : ""}

const debug = 0;

//////////////////////////////////////////////////////////////////////
//// debug mode: show values of main variables
//////////////////////////////////////////////////////////////////////

function show_values_for_debug () {
    console.log ("taskType: " + param.taskType);
    console.log ("relType: " + param.relType);
    console.log ("inputArea.value: " + param.inputArea.value);
    console.log ("outputArea1 "); 
    console.log(param.outputArea1);
    console.log ("outputArea2: " + param.outputArea2);
    console.log ("objArray: " + main.objArray ); 
    console.log ("attrArray: " + main.attrArray ); 
    console.log ("zoneArray: " + JSON.stringify(main.zoneArray)); 
    console.log ("intensionArray: "+ JSON.stringify(main.intensionArray)); 
    console.log ("matrixArray: "+ JSON.stringify(main.matrixArray ));
}


//////////////////////////////////////////////////////////////////////
//// start function, calls drawRelationGraph/VennDiagram and showMatrix
//////////////////////////////////////////////////////////////////////

function truth_venn (choice,inArea,oldIn,out1) {
   param.taskType = "bool";
   param.inputArea = inArea;
   param.oldInputAreaValue = oldIn;
   param.outputArea1 = out1;
   createURL(param.inputArea.value);            // write current URL to console
   param.outputArea1.value = setlxToBool(param.inputArea.value);
   constructJB(); 
   let temArray = construct(); 
   main.intensionArray = temArray[0];
   main.zoneArray = temArray[1];
   if (choice == "euler") {
      param.taskType = "boolVenn";
      drawVennDiagram(main.zoneArray,main.intensionArray);
   } else if (choice == "venn") {
      param.taskType = "boolVenn";
      let temSet = new Set();
      for(let el = 0; el < main.zoneArray.length; el++) {   // union of all elements
         temSet = unionSet (temSet,main.zoneArray[el].sets);
      }
      temSet.delete("U");
      main.attrArray = Array.from(temSet);
      let wdth = 490;                         // size of boundary and background
      let hgt = 490;
      if (main.attrArray.length == 1) {       // adjust for number of sets
	  hgt = (hgt/2)/2 + 15; 
	  wdth = wdth/2 + 10;
      } else if (main.attrArray.length < 4) { hgt = hgt/2 + 15; }
      d3.selectAll("svg").remove(); 
      d3.select("#venn").append("svg").attr("width", wdth).attr("height", hgt);
      const svg = d3.select("svg");
      const margin = { top: 0, right: 0, bottom: 0, left: 0 };
      var g =svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");
      if (main.attrArray.length <= 3) {
           g.append("rect").attr('id','backgr').attr('x',0).attr('y', 0)
           .attr('width', svg.attr("width") - margin.left - margin.right)
           .attr('height', svg.attr("height") - margin.top - margin.bottom)
           .attr('translate',"translate(-"+margin.left+","+margin.top+")");
          vennDir(main.attrArray,main.intensionArray,main.attrArray.length,g);
      } else {
         d3.selectAll("svg").remove();
//         d3.selectAll("g").selectAll("*").remove();
//         g.append("text").text("This display is only available for 2 or 3 sets")
//          .attr("x", 10).attr("y", 10);
      }
   }
   if (debug == 1) {show_values_for_debug()} 
}

function combin (taskType,inArea,oldIn,out1,out2) {
    param.taskType = taskType;
    param.inputArea = inArea;
    param.oldInputAreaValue = oldIn;
    param.outputArea1 = out1;
    param.outputArea2 = out2;
    createURL(param.inputArea.value);            // write current URL to console
    drawRelationGraph();
    if (debug == 1) {show_values_for_debug()} 
}

function binRel (taskType,inArea,oldIn,outArea,relType,lset,rset,csv) {
    let tempArray = document.querySelectorAll(".answer_container");  // delete answers
    for (let elem of tempArray) {
         elem.innerHTML = "";
    }
    if (param.inputArea == "") {
        param.taskType = taskType;
        param.inputArea = inArea;
        param.oldInputAreaValue = oldIn;
        param.outputArea = outArea;
        param.relType = relType; 
        param.leftset = lset;
        param.rightset = rset;
        param.csv = csv;
    }

    createURL(param.inputArea.value);                    // write current URL to console
    param.outputArea.innerHTML = showMatrix();
    var oList = main.objArray;
    var aList = main.attrArray;
    if (param.relType == "auto") {                       // display the two sets
       param.leftset.value = "{" + oList.join(", ") + ", " + aList.join(", ") + "}";
    } else {
       param.leftset.value = "{" + oList.join(", ") + "}";
       param.rightset.value = "{" + aList.join(", ") + "}";
    }
    if (param.taskType == "binRel") {
        drawRelationGraph(); 
    } else if (param.taskType == "lattice") {            // uses fcalibs
        var ctxtList = main.matrixArray;
        _array = ganter(ctxtList,oList.length,aList.length); 
        var intList = _array[0]
        var extList = _array[1]
        _array = createRel(intList);
        var subsuper = _array[1];
        var ret_string = gammaMu(extList,intList,ctxtList,oList,aList);
        drawRelationGraph("digraph {" + ret_string + Array.from(subsuper).join('') + "}"); 
    }
    if (debug == 1) {show_values_for_debug()} 
}

function groups(taskType,inArea,oldIn,out1,out2,emb) {
    param.taskType = "group1";                           // not used at the moment
    param.inputArea = inArea;
    param.outputArea1 = out1;
    param.outputArea2 = out2;
    param.oldInputAreaValue = oldIn;
    param.embed = emb;
    createURL(param.inputArea.value);                    // write current URL to console
    algGrp.universe = new Set ();
    let tempArray = [];
    tempArray = inArea.value.split(";")                  // read from inArea
    main.objArray = JSON.parse(tempArray[0].trim());
    main.attrArray = JSON.parse(tempArray[1].trim());
    main.matrixArray = JSON.parse(tempArray[2].trim());
    tbldata = matrixToTable (main.objArray,main.attrArray,main.matrixArray);
    createGroupTable(tbldata,main.attrArray);
    for (let elem of main.objArray){ algGrp.universe.add(elem); }
    for (let elem of main.attrArray){ algGrp.universe.add(elem); }
    if (debug == 1) {show_values_for_debug()} 
}

//////////////////////////////////////////////////////////////////////
//// set in inputArea -> graph in <svg> <g> (via dot format)
//////////////////////////////////////////////////////////////////////
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
          let tempArray = [];                            // create data structure
          tempArray = combinArray(fm1.value,fm2.value,fmBck.checked,fmSeq.checked);
          outA1.innerHTML =                              // display count and content
              displayComArray(tempArray,fm1.value,fmSeq.checked,outA2);
          var tempString = "";                           // convert array to dot
          var tempString2 = "";
          for (let val of tempArray[fm1.value-1]) {      // process first level
                tempString += "node" + "1" + val.substring(1,2)
                           +" [label=\"" + val.substring(1,2) + "\"];";
          }
          for (let val of tempArray[fm1.value-1]) {      // process array of last level
             for(let i = 2; i < Array.from(val).length; i++) {   // create edges
                tempString2 = "node"+ (i-1).toString() + val.substring(1,i)
                              + "->node" + i.toString() + val.substring(1,i+1) + ";";
//                let reg = new RegExp(tempString2);     // avoid duplicate edges
//                if (tempString.search(reg) < 0) {      // not needed with strict
		tempString += tempString2;
//                }
                tempString2 = "node"+ i.toString() + val.substring(1,i+1) +  // node labels
                          " [label=\"" + val.substring(i,i+1).toString() + "\"];";
                tempString += tempString2;               // ToDo: avoid duplicates
             }
          }
          gValue = "strict digraph {rankdir=LR;" + tempString + "}";
       }
    }
    try {
      grapharea = graphlibDot.read(gValue);              // Todo: need more checks?
    } catch (e) {
      if (typeof inA1.value != 'undefined') { 
         inA1.setAttribute("class", "codeLineInput error");
      }
      throw e;
    }
    if (!grapharea.graph().hasOwnProperty("marginx") &&  // Set margins, if not present
        !grapharea.graph().hasOwnProperty("marginy")) {
      grapharea.graph().marginx = 5;
      grapharea.graph().marginy = 5;
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

    var objUnionAtt = unionSet(objs,attrs);            // union of objects and attributes
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
    main.objArray = objsList;                          // assign return values
    main.attrArray = attrsList;
    main.matrixArray = contextList;
    main.transMatrixArray = 
         contextList[0].map((_, colIndex) => contextList.map(row => row[colIndex]));
    return [_result];
//    return [_result,objsList,attrsList,contextList];
}

//////////////////////////////////////////////////////////////////////
//// set in zoneArray -> graph in <svg> <g> within <div id="venn">  
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
    var _formul = inString.replace(/ /g,'');         // logical operators
    _formul = _formul.replace(/not/g,'~');
    _formul = _formul.replace(/and/g,'&');
    _formul = _formul.replace(/or/g,'v');
    _formul = _formul.replace(/==/g,'<>');
    _formul = _formul.replace(/\-s>>/g,'>');
//    _formul = _formul.replace(/&/g,'&');            // set operators
    _formul = _formul.replace(/\|/g,'v');
    _formul = _formul.replace(/<=/g,'>');
    return _formul;
}

//////////////////////////////////////////////////////////////////////
//// conversion, for a set of a binary relation
//////////////////////////////////////////////////////////////////////
function stringToSet (myString,myType) {
    var _Set = new Set();
    var _Set2 = new Set();
    myString = myString.trim();
    if (param.csv == 'yes') {
       myString = myString.replace(/\n/g,']?&&?[');      // separate the lines
       myString = myString.replace(/(.*)/,'[$1]');       // change to [..|..] ?&&? [..|..]
    } else {
       myString = myString.replace(/\]\s*,/g, '] ?&&?'); // separate the elements
       myString = myString.replace(/[{}]/g,'');          // delete brackets {}
       myString = myString.replace(/,/g,'|');            // replace , with |
    }
    if (myType == "toDot") {                             // convert into dot format
	myString = myString.replace(/\[(.*?)\|(.*?)\]/g, '$1 -> $2;');
        _Set = new Set(myString.split('?&&?')); 
    } else {
        _Set = new Set(myString.split('?&&?'));
        for (let elem of _Set) {                         // turn string [..,..] into array
            elem = elem.replace(/[\[\]{}\s]/g,'');
            _Set2.add(elem.split('|'));
        }
        _Set = _Set2;
}
    return _Set;
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

