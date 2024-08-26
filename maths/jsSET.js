// called with:
//   if (inp.match(/{/)) {  result = setOps(inp);
// no % allowed
// elements of sets: strings (containing just letters, numbers or _) 
//                   or numbers (with operations +, *, / etc, but no brackets)
// binary operators: in, |, &, ==, !=, <=
// brackets: ()
// replace { ... } with new Set([ ... ])

function subSet (setA, setB) {
    for (let a of setA) if (!setB.has(a)) return false;
    return true;
}

function eqSet (setA, setB) {
    if (setA.size !== setB.size) return false;
    for (let a of setA) if (!setB.has(a)) return false;
    return true;
}

function noteq (setA, setB) {
    if (setA.size !== setB.size) return true;
    if (eqSet(setA, setB) == true) {
	return false;
    } else {
	return true;
    }
}

function union (setA, setB) {
    let _union = new Set(setA);
    for (let elem of setB) { _union.add(elem) }
    return _union;
}

function inters (setA, setB) {
    let _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) { _intersection.add(elem) }
    }
    return _intersection;
}

function displaySet(s) {
    let tempstr = "";
    let tempstr2 = "";
    let tempset = new Set ([]);
    s.forEach (function(value) {
       if (value instanceof Set) {
          tempstr2 = JSON.stringify([...value]);
	  if (!(tempset.has(tempstr2))) {    // eliminate duplicates
	      tempset.add(tempstr2); 
	      tempstr += displaySet(value)
          }
	} else {
          tempstr += value;
	}
	tempstr += ", ";
    })
    tempstr = "{" + tempstr + "}";
    tempstr = tempstr.replace(/, ,/g,",");    // delete last ", "
    tempstr = tempstr.replace(/, }/g,"}");
    return tempstr
}

function parseSets(s) {
    let ctr = 1;
    let matchstr = "";
    let setArray = [];
    while ( s.match(/{/) ) {                             // store sets in setArray
	matchstr = s.match( /{([^{]*?)}/ );              // innermost {...}
	setArray[ctr] = matchstr[0];
	s = s.replace( /{([^{]*?)}/ ,"set"+ctr);
	ctr++;
    }
    while  ( s.match(/\(.*[|&].*\)/) ) {                 // resolve (... |& ...), start, inside
	matchstr = s.match( /\(([^\(]*?)([|&])([^\(]*?)\)/ )   
	if (matchstr[2] == "|") {
	    s = s.replace( /\(([^\(]*?)([|&])([^\(]*?)\)/ , "union[$1,$3]" );
	} else if (matchstr[2] == "&") {
	    s = s.replace( /\(([^\(]*?)([|&])([^\(]*?)\)/ , "inters[$1,$3]" );
        }
    }
    if ( s.match(/\(/) ) { return "Error: too many brackets" } // forbidden characters
    if ( s.match(/[|]/) && s.match(/[&]/) ) { return "Error: brackets missing" }
    if ( s.match(/%/) ) { return "Error: don't use %" }
    s = "%" + s + "%";                                    // beginning and end of string
    while  ( s.match(/[|&]/) ) {                          // resolve ... |& ... (no brackets)
	matchstr = s.match( /([%=]|in)(.*?)([|&])(.*?)(%|==|!=|<=)/ )   
	if (matchstr[3] == "|") {
	    s = s.replace( /([%=]|in)(.*?)([|&])(.*?)(%|==|!=|<=)/ , "union[$2,$4]" );
	} else if (matchstr[3] == "&") {
	    s = s.replace( /([%=]|in)(.*?)([|&])(.*?)(%|==|!=|<=)/ , "inters[$2,$4]" );
        }
    }
    s = s.replace( /(.*)\s+in\s+(.*)/ ,"$2.has($1)");     // insert functions
    s = s.replace( /(.*)\s*==\s*(.*)/ ,"eqSet($1,$2)");
    s = s.replace( /(.*)\s*!=\s*(.*)/ ,"noteq($1,$2)");
    s = s.replace( /(.*)\s*<=\s*(.*)/ ,"subSet($1,$2)");
    s = s.replace( /%/g, "");
    s = s.replace( /\[/g, "(");
    s = s.replace( /\]/g, ")");
    while (ctr > 0) {
	if ( matchstr = s.match( /set(\d+)/ )) {
            s = s.replace( /set(\d+)/ , setArray[Number(matchstr[1])]);
	}
	ctr--;
    }
    s = s.replace( /{/g , "new Set([" );
    s = s.replace( /}/g , "])" );
    return s
}

function setOps (s) {
    let result = "";
    s = parseSets(s);

    try { result = eval(s);
	if (typeof result == "object") {
	    result = displaySet(result);
	}
    }
    catch(err) { result = "Ihre Eingabe war falsch. (" + err + ")" }
    return result
}

