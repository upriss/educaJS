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
