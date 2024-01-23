//////////////////////////////////////////////////////////////////////
/// convert to Tabulator format
//////////////////////////////////////////////////////////////////////

function matrixToTable (oArray,aArray,mArray) {
    let tempstring = '['; 
    for (let cnt1 = 0; cnt1 < oArray.length; cnt1++) {
	tempstring += '{"id":"'+ cnt1 + '","objcts":"'+ oArray[cnt1] +'",' ; 
	for (let cnt2 = 0; cnt2 < aArray.length; cnt2++) {
            tempstring += '"' + aArray[cnt2] + '":"' + mArray[cnt1][cnt2] +'",' ;
	}
	tempstring = tempstring.slice(0, -1);
	tempstring += '},';
    }
    tempstring = tempstring.slice(0, -1);
    tempstring += ']';
    return (JSON.parse(tempstring));
}

//////////////////////////////////////////////////////////////////////
/// converts from Tabulator format, updates main...variables
//////////////////////////////////////////////////////////////////////

function tableToMatrix (tabledata) {            // read as HTML
   main.objArray = [];
   main.matrixArray = [];
   tabledata = tabledata.replace(/<\/tr><\/tbody><\/table>/,"");
   let tmpArray = tabledata.split("</tr>");
   let tmpArray2;
   let counter = 0;
   for (let row of tmpArray){
      row = row.replace(/<.*?>/g,",");
      row = row.replace(/,+/g,",");             // comma separated
      row = row.slice(1,-1);
      tmpArray2 = row.split(",");
      if (counter == 0 ) {                      // first row, extract attributes
         tmpArray2.shift();
         main.attrArray = tmpArray2;
	 counter++;
      } else {
         main.objArray.push(tmpArray2[0]);      // extract objects
         tmpArray2.shift();
         main.matrixArray.push(tmpArray2);      // extract matrix
      }
   }
}

//////////////////////////////////////////////////////////////////////
/// returns the element that is in row x and column y
//////////////////////////////////////////////////////////////////////

function grOp(x,y) {
   let oIndex = main.objArray.indexOf(x);
   let aIndex = main.attrArray.indexOf(y);
   return main.matrixArray[oIndex][aIndex];
}

//////////////////////////////////////////////////////////////////////
/// recalculates the universe and neutral element
//////////////////////////////////////////////////////////////////////

function updateGroupProps () {
    param.outputArea1.innerHTML = "{" + Array.from(algGrp.universe) + "}";
    let oIndex;
    let aIndex;
    let flag;
    algGrp.neutralElem = "";
    for (let elem1 of algGrp.universe) {
        flag = 1;
	for (let elem2 of algGrp.universe) {
	    if (grOp(elem1,elem2) != elem2 || grOp(elem2,elem1) != elem2) {
		flag = 0;
	    }
	}
	if (flag == 1) {
	    algGrp.neutralElem = elem1;
	}
    }
}

//////////////////////////////////////////////////////////////////////
/// sets up Tabulator
//////////////////////////////////////////////////////////////////////

function createGroupTable(tbldata,aArray) {
    var table1;
    var coldata = []; 
    coldata.push({ title: "+", field: "objcts", editor: "input", frozen:true });
    for (let elem of aArray) {
        tm = {title:elem, field:elem, headerSort:false, hozAlign:"center", editor:"list",
              editorParams:{values:{"a":"a","b":"b","c":"c","d":"d","e":"e","f":"f"}}};
        coldata.push(tm);
    }
    table1 = new Tabulator(param.outputArea2, {data: tbldata, layout: "fitDataTable", 
		 movableColumns: true, movableRows: true, resizableColumnFit:true, 
		 columns:coldata})
    table1.on("tableBuilt", function(){
	updateGroupProps();
    });
    table1.on("cellEdited", function(cell){
	tableToMatrix(table1.getHtml());
	updateGroupProps();
    });
    table1.on("headerTapHold", function(e, column){  // update after moving
	tableToMatrix(table1.getHtml());
	updateGroupProps();
    });
    table1.on("rowTapHold", function(e, row){
	tableToMatrix(table1.getHtml());
	updateGroupProps();
    });
}
    


    
