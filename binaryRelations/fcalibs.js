function cloneArray (a) {
    var b = [];
    for (let k = 0 ; k < a.length; k++) {
       b[k] = a[k];
    }
    return b;
}


function ganter (crosstable,anzM,anzG) {
    // This is an implementation of an algorithm described by Bernhard Ganter
    // in "Two basic algorithms in concept analysis." 
    // but following the implementation in FcaStone where G and M are switched at start

                          // all arrays except @idx are arrays of 0's and 1's
    var idx = [];         // index for attributes, starting from left
    var end = [];         // end for terminating the while loop
    var Ext = [];         // are returned, ext/int for each concept
    var Int = [];         // are returned, ext/int for each concept
    var anzCpt = 0;       // counts the concepts
    var A = [];           // list of extents
    var B = [];           // list of intents
    var temp = [];        // temporary variable
    var _break = 0;       // temporary variable
    var lvl = 0;          // the level in the lattice from the top
    idx[lvl] = -1;        // is lower than the index of leftmost attr

    A[0] = [];
    B[0] = [];
    Ext[0] = [];
    Int[0] = [];
    for (let i = 0; i <= anzG -1; i++) { A[0].push(1); }     // A[0] = [1,...,1]
    for (let i = 0; i <= anzM -1; i++) { B[0].push(0); }     // B[0] = [0,...,0]
    for (let i = 0; i <= anzM -1; i++) { end.push(1); }      // end = [1,...,1]
    for (let i = 0; i <= anzG -1; i++) { Ext[0].push(1); }   // Ext[0] = [1,...,1]
    for (let i = 0; i <= anzM -1; i++) { Int[0].push(0); }   // Int[0] = [0,...,0]

    while ((B[lvl].join('') !== end.join(''))) {
       for (let i= anzM-1; i >= 0; i--) {       // A
          _break = 0;
          if (B[lvl][i] != 1) {                 // B, attribute concept exists => ignore
             while (i < idx[lvl]) { lvl--; }    // C, attr right of previous, reduce level
             idx[lvl+1] = i;                    // D, next: calculate new extent
             A[lvl+1] = [];                     // as intersection with m[i]'
             for (let k=0 ; k < anzG; k++) {  
                if ((A[lvl][k] == 1) && (crosstable[i][k] == 1)) { A[lvl+1][k] = 1; }
                else { A[lvl+1][k] = 0; }
             }

             for (let j = 0; j < i; j++) {      // E-G whether left attr has larger intent
                if (_break == 0 && B[lvl][j] != 1) {  // missing in alg!, ignore old attrs
                   for (let k=0 ; k < anzG; k++) {    // intersection
                      if ((A[lvl+1][k] == 1) && (crosstable[j][k] == 1)) { temp[k] = 1; }
                      else { temp[k] = 0; }
                   }                                  //  if yes, skip rest of for loop
                   if (temp.join('') === A[lvl+1].join('')) { _break =1; } 
                }
             }

             if (_break != 1) {
                B[lvl+1] = cloneArray(B[lvl]);          // H, calculate new intent
                B[lvl+1][i] = 1;
                for (let j=i+1; j<anzM; j++) {          // I-L, whether intent can be
                                                        // enlarged to the right
                   if (B[lvl+1][j] !=1) {               // ignore old attrs
                      for (let k=0 ; k < anzG; k++) {   // intersection
                        if ((A[lvl+1][k] == 1) && (crosstable[j][k] == 1)) { temp[k] = 1; }
                        else { temp[k] = 0; }
                      }   
                      if (temp.join('') === A[lvl+1].join('')) {
                           B[lvl+1][j] = 1;
                      }
                   }
                }
                lvl++;                                  // next level
                anzCpt++;
                Ext[anzCpt] = cloneArray(A[lvl]);
                Int[anzCpt] = cloneArray(B[lvl]);
                break;
             } // if - G
          } // if - B
       } // for - A
    } // while
    if (Ext[0].join('') === Ext[1].join('')) {   // because always start with 0...0, 1...1
       Ext.shift();
       Int.shift();
       anzCpt--;
    }
    return [Ext,Int];
}

function createRel (intArray) {

    var anzCpt = intArray.length;
    var rank = [];
    var temp = [];
    var superCpt = [];                                 // arrays of arrays
    var r = [];
    var r_set = new Set();
//    var rt = [];
//    var s = [];
//    s[0] = [0];

    for (let i= 0; i<anzCpt; i++) {                   // initialize relation
        r[i] = [];
//        rt[i] = [];
        superCpt[i] = [];
        for (let j= 0; j<anzCpt; j++) {
            r[i][j] = 0;
//            rt[i][j] = 0;
        }
    }
    for (let i = 0; i < anzCpt; i++) {
        rank[i] = 1;
        for (let j = i-1; j >= 0; j--) {
            temp = [];
            for (let k=0 ; k < intArray[0].length; k++) {          // intersection
                if ((intArray[j][k] == 1) && (intArray[i][k] == 1)) { temp[k] = 1; }
                else { temp[k] = 0; }
            }
            if (temp.join('') === intArray[i].join('')) {
                superCpt[i].push(j);
                r[i][j] = 1;
                r_set.add(i + " -> " + j + "; ");
//                rt[i][j] = 1;
                for (let k = 0; k < superCpt[i].length; k++) { // delete transitive subs
                   if (r[superCpt[i][k]][j] == 1 ) {
			r[i][j] = 0;
                        r_set.delete(i + " -> " + j + "; ");
                        if (rank[superCpt[i][k]] >= rank[i]){
                            rank[i] = rank[superCpt[i][k]] +1;
                        }
                        break;
                    }
                }
            }  // if
        } // for (let j
//        if (typeof s[rank[i]] == 'undefined') { s[rank[i]] = []; }
//        s[rank[i]].push(i);
    }  // for (let i
//    s[1].shift();                    // because rank set to start at 1
//    return [r, rt, s];
      return [r, r_set]; 
}

function gammaMu (extList,intList,cxtList,oList,aList) {
    var cptlabels = "node [ shape=record,margin=\"0.2,0.055\" ]; edge[dir=\"none\"];\n";
    cptlabels = "node [rx=5 ry=5, labelType=\"html\"]; ";
    cptlabels += "edge[arrowheadStyle=\"display:none\"];";
    var reg;
    var temp;
    var invcxt = [];
    for (let i = 0; i < cxtList[0].length; i++) {       // inverse context
        invcxt[i] = [];
        for (let k = 0; k < cxtList.length; k++) {
            invcxt[i][k] = cxtList[k][i];
        }                                               // intList.length = extList.length
    }      
    for (let i = 0; i < extList.length; i++) { 
        cptlabels += i + ' [label = \"{' + i + '|' + i + '}\"];\n';  // create format
	temp = "";
        for (let k = 0; k < cxtList[0].length; k++) {
//          if (extList[i][k] == 1) { temp += oList[k] + " "; }  // would be full ext
            if (invcxt[k].join('') === extList[i].join('') ) {
	       temp += aList[k] + " ";
            }
        }                                      
        reg = new RegExp("\\{" + i + "\\|");                     // insert attributes
        if (temp.length > 15) {
           temp = "<div title='" + temp + "'>" + temp.substring(0,15) + "...</div>";
        }
        if (temp == "") { cptlabels = cptlabels.replace(reg,"&nbsp;|"); }
        else { cptlabels =  cptlabels.replace(reg,temp + "|"); }
	temp = "";
        for (let k = 0; k < cxtList.length; k++) {
            if (cxtList[k].join('') === intList[i].join('') ) {
	       temp += oList[k] + " ";
            }
        }                                      
        reg = new RegExp("\\|" + i + "\\}");                     // insert objects
        if (temp.length > 15) {
           temp = "<div title='" + temp + "'>" + temp.substring(0,15) + "...</div>";
        }
        if (temp == "") { cptlabels =  cptlabels.replace(reg,"<hr>&nbsp;"); }
        else { cptlabels =  cptlabels.replace(reg,"<hr>" + temp); }
    }                                          
    cptlabels = cptlabels.replace(/\s+</g,"<");                  // remove space
    cptlabels = cptlabels.replace(/\s+"/g,"\"");                 // remove space
    cptlabels = cptlabels.replace(/\"/g,"\"");                   // escape "
    return cptlabels;
}

