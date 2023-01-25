
//////////////////////////////////////////////////////////////////////
function eqSet (setA, setB) {
    if (setA.size !== setB.size) return false;
    for (let a of setA) if (!setB.has(a)) return false;
    return true;
}

//////////////////////////////////////////////////////////////////////
function unionSet (setA, setB) {
    let _union = new Set(setA);
    for (let elem of setB) { _union.add(elem) }
    return _union;
}

//////////////////////////////////////////////////////////////////////
function intersectionSet (setA, setB) {
    let _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) { _intersection.add(elem) }
    }
    return _intersection;
}

//////////////////////////////////////////////////////////////////////
//// events/buttons somewhere -> change inputArea, then call binRel
//////////////////////////////////////////////////////////////////////

function ctxtNewCellVal(id,obj,attr) {               // click on value in matrix

   if (document.getElementById(id).innerHTML == 0) {
      document.getElementById(id).innerHTML = 1;
      if (param.taskType != "embed") {
         if (param.inputArea.value.match(/\{\}/)) {         // Todo csv
             param.inputArea.value = '{['+obj+','+attr+']}';
         } else {
            param.inputArea.value = 
               param.inputArea.value.replace(/\]\}/,'], ['+obj+','+attr+']}');
         }
         binRel();
      }
   } else {
      document.getElementById(id).innerHTML = 0;
      if (param.taskType != "embed") {                      // todo csv
         let replstring = "\\[\\s*" + obj + "\\s*,\\s*" + attr  + "\\s*\\]\\s*";
         let re1 = new RegExp(replstring,"g");
         param.inputArea.value = param.inputArea.value.replace(re1,'');
         param.inputArea.value = param.inputArea.value.replace(/,\s*,/,',');
         param.inputArea.value = param.inputArea.value.replace(/,\s*}/,'}');
         param.inputArea.value = param.inputArea.value.replace(/{\s*,\s*/,'{');
         binRel();
      }
   }

};

function ctxtNewName(kind,val,elem) {                  // change name of obj/attr in matrix
   if (param.taskType != "embed") {                    // todo csv
      val = val.replace(/ /g,'_');
      if (kind == "obj") {
         let re1 = new RegExp("\\[" + elem + ",",'g');
         param.inputArea.value = param.inputArea.value.replace(re1,'[' + val + ',');
      } else if (kind == "att") {
         let re1 = new RegExp("," + elem + "\\]",'g');
         param.inputArea.value = param.inputArea.value.replace(re1,',' + val + ']');
      }
      binRel();
   }
};

function addRowCol(myKind) {                         // button next to matrix
   let re1 = new RegExp("\\[(.*?),(.*?)\\]");
   let rannr = Math.floor(Math.random() * 1000);
   if (myKind == 'row') {
      if (param.taskType != "embed") {                    // todo csv
         param.inputArea.value = 
              param.inputArea.value.replace(re1,'[$1,$2],[new'+rannr+',$2]');
         binRel();
      }
   } else {
      if (param.taskType != "embed") {                    // todo csv
         param.inputArea.value = 
             param.inputArea.value.replace(re1,'[$1,$2],[$1,new'+rannr+']');
         binRel();
      }
   }
}


//////////////////////////////////////////////////////////////////////
//// returns HTML formatting of a context with lists of objs, attrs and context
//////////////////////////////////////////////////////////////////////
function displayTableHTML(myObjs, myAttrs, myArray) {
    var _result = "<div class='style_container'>";
    _result += "<button class='floating' id='buttCol' onclick='addRowCol(\"col\")'>";
    _result += "Add column</button><div style='float: right;'></div>";
    _result += "<button class='floating' id='buttRow' onclick='addRowCol(\"row\")'>";
    _result += "Add row</button></div>";
    _result += "<table class='matrix'>";
    _result += "<tr><th class='row column'></th>";
    for(let j=0; j<myAttrs.length; j++){
        _result += "<th class='column' >";
        _result += "<input type='text' id='c_at_"+j+"' class='attrHeader' value='" + myAttrs[j] +"' ";
        _result += "onchange=\"ctxtNewName('att',this.value,'" + myAttrs[j] + "');\"";
        _result += "></input></th>";
    }
    _result += "</tr>";
    for(let i=0; i<myArray.length; i++) {
        _result += "<tr>";
        _result += "<th class='row'>";
	_result += "<input type='text' id='c_ob_"+i+"' class='objHeader' value='" + myObjs[i] +"' ";
        _result += "onchange=\"ctxtNewName('obj',this.value,'" + myObjs[i] + "');\"";
        _result += "></input></th>";
        for(let j=0; j<myArray[i].length; j++){
            _result += "<td id='cell_"+i+"_" + j;
            _result += "' class='tableCell' onclick=\"ctxtNewCellVal(this.id,'";
            _result += myObjs[i] + "','" + myAttrs[j] + "');\"";
            _result += " >" + myArray[i][j] + "</td>";
        }
        _result += "</tr>";
    }
    _result += "</table>";
    return _result;
}

//////////////////////////////////////////////////////////////////////
//// reads HTML formatting of a context with lists of objs, attrs and context
//////////////////////////////////////////////////////////////////////
function readTableHTML(myHTMLTable) {

   var myObjs = []; 
   var myAttrs = [];
   var myArray = [];
   var tempArray = [];

   const _elems = myHTMLTable.split('>');
   for (let j=0; j<_elems.length; j++){
      if (_elems[j].search(/attrHeader/) > 0) {
          myAttrs.push(_elems[j].match(/value\s*=\s*'(.*?)'/)[1]);
      } else if(_elems[j].search(/objHeader/) > 0) {
          myObjs.push(_elems[j].match(/value\s*=\s*'(.*?)'/)[1]);
      } else if(_elems[j].search(/tableCell/) > 0) {
          tempArray.push(_elems[j+1].match(/(.*?)</)[1]);
      }
   }
   for (let j=0; j<myObjs.length; j++){
      myArray.push(tempArray.slice(myAttrs.length*j,myAttrs.length*(j+1)));
   }
   return [myObjs,myAttrs,myArray]
}

//////////////////////////////////////////////////////////////////////
//// converts output from readTableHTML to inputArea (eg binary relation)
//////////////////////////////////////////////////////////////////////
function inputAreaString(myObjs,myAttrs,myArray) {

   let _array = [];
   for (let i=0; i<myObjs.length; i++){
      for (let j=0; j<myAttrs.length; j++){
         if(myArray[i][j] == 1) {
            _array.push([myObjs[i],myAttrs[j]]);
         }
      }
   }
   let _string = JSON.stringify(_array);
   _string = _string.replace(/^\s*\[/,"{")
   _string = _string.replace(/\]\s*$/,"}");
   _string = _string.replace(/\],\[/g,"], [");
   _string = _string.replace(/"/g,"");
   return _string
}
