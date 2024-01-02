var html_functionProps= 
'<button onclick="examine(\'function\');" class="tooltip">function\
<span>Every element is mapped onto exactly one element.<br>\
Every row of the matrix contains exactly one 1.</span></button>\
<span class="answer_container" id="answer_function"></span><br>\
<button onclick="examine(\'injective\');" class="tooltip">injective\
<span>Different elements must not be mapped onto the same element.<br>\
Every Column of the matrix contains at most one 1.</span></button>\
<span class="answer_container" id="answer_injective"></span><br> \
<button onclick="examine(\'surjective\');" class="tooltip">surjective \
<span>Every element of the codomain must be an image of an element of the domain.<br>\
Every column of the matrix contains at least one 1.</span></button>\
<span class="answer_container" id="answer_surjective"></span>';

var html_functionProps_de= 
'<button onclick="examine(\'function\');" class="tooltip">Funktion\
<span>Für jedes Element des Definitionsbereichs gibt es genau ein Element \
des Wertebereichs.<br>In der Matrix steht in jeder Zeile genau eine 1.</span></button>\
<span class="answer_container" id="answer_function"></span><br>\
<button onclick="examine(\'injective\');" class="tooltip">injektiv\
<span>Verschiedene Elemente des Definitionsbereichs dürfen nicht auf das \
gleiche Element des Wertebereichs abgebildet werden.<br>In der Matrix steht in jeder \
Spalte maximal eine 1.</span></button>\
<span class="answer_container" id="answer_injective"></span><br>\
<button onclick="examine(\'surjective\');" class="tooltip">surjektiv\
<span>Für jedes Element des Wertebereichs muss es eins im Definitionsbereich \
geben.<br>In der Matrix steht in jeder Spalte mindestens eine 1.</span></button>\
<span class="answer_container" id="answer_surjective"></span>';

var html_groupProps= 
'<button onclick="examine(\'closed\');" class="tooltip">Closed\
<span>The result of an operation must again be an element of the set.</span></button>\
<span class="answer_container" id="answer_closed"></span><br>\
<button onclick="examine(\'neutral\');" class="tooltip">Neutral element\
<span>A neutral element n must exist with a &#9900; n = n &#9900; a = a.</span></button>\
<span class="answer_container" id="answer_neutral"></span><br>\
<button onclick="examine(\'inverse\');" class="tooltip">Inverse elements\
<span>An inverse element must exist for every element a ∈ Set.</span></button>\
<span class="answer_container" id="answer_inverse"></span><br>\
<button onclick="examine(\'commutative\');" class="tooltip">Commutative\
<span>Sequence of operation does not matter: a &#9900; b = b &#9900; a.</span></button>\
<span class="answer_container" id="answer_commutative"></span>';

var html_groupProps_de= 
'<button onclick="examine(\'closed\');" class="tooltip">Abgeschlossen\
<span>Das Ergebnis der Verknüpfung muss wieder ein Element der Menge sein.</span></button>\
<span class="answer_container" id="answer_closed"></span><br>\
<button onclick="examine(\'neutral\');" class="tooltip">Neutrales Element\
<span>Ein Element n mit a &#9900; n = n &#9900; a = a muss existieren.</span></button>\
<span class="answer_container" id="answer_neutral"></span><br>\
<button onclick="examine(\'inverse\');" class="tooltip">Inverse Elemente\
<span>Zu jedem a ∈ Menge muss es ein inverses Element geben.</span></button>\
<span class="answer_container" id="answer_inverse"></span><br>\
<button onclick="examine(\'commutative\');" class="tooltip">Kommutativ\
<span>Die Reihenfolge ist unwichtig: a &#9900; b = b &#9900; a.</span></button>\
<span class="answer_container" id="answer_commutative"></span>';

////////////////////////////////////////////////////////////////////

var html_helptext_lattice = '<div class="tooltip"><p></p><p>\
How to use this page<div>The lattice display can be moved and scrolled. \
Clicking on the 0s and 1s of the context changes the values. The names in the context \
can be edited. Rows and columns that contain only 0s are removed from the context.  \
</div></p></div>';

var html_helptext_binRel = '<div class="tooltip"><p></p><p>\
How to use this page<div>The graph display can be moved and scrolled. \
Clicking on the 0s and 1s of the matrix changes the values. The names in the matrix \
can be edited. Rows and columns that contain only 0s are removed from the relation.  \
</div></p></div>';

var html_helptext_binRel_de = '<div class="tooltip"><p></p><p>\
Benutzungshinweise<div>Der Graph kann verschoben und vergrößert oder verkleinert \
werden. Die Werte der Matrix können durch Klicken geändert werden. Die Namen \
können in der Matrix editiert werden. Zeilen und Spalten, die nur Nullen enthalten \
werden aus der Relation gelöscht.\
</div></p></div>';

var html_helptext_truthtable = '<div class="tooltip"><p></p><p>\
How to use this page<div>\
Operator precedence is not automatically provided (brackets are needed). <br>\
For negation enter: not, &nbsp; for OR: or, &nbsp; for AND: and, &nbsp;\
for conditional: -s>>, &nbsp; for biconditional: == <br>\
for 0 enter: x and not x, &nbsp; for 1 enter: x or not x';

var html_helptext_truthtable_de = '<div class="tooltip"><p></p><p>\
Benutzungshinweise<div>\
Alle Klammern m&uuml;ssen gesetzt werden. <br>\
F&uuml;r Negation verwenden Sie: not, &nbsp; f&uuml;r OR: or, &nbsp; f&uuml;r AND: and, &nbsp;\
f&uuml;r Subjunktion: -s>>, &nbsp; f&uuml;r Bijunktion: == <br>\
f&uuml;r 0: x and not x, &nbsp; f&uuml;r 1: x or not x';

var html_helptext_truthtable2 = '</div></div>';

var html_helptext_vennEuler = '\
<p>(The software is not perfect. Venn diagrams for more than 3 sets do not \
work consistently.)</p></div></div>';

var html_helptext_vennEuler_de = '\
<p>Es k&ouml;nnen auch die SetlX-Mengenoperatoren &lt;=, ==, + und * verwendet werden. (Achtung: die Software ist nicht perfekt. Darstellungen von mehr als 3 Mengen funktionieren nicht.)</p></div></div>';

////////////////////////////////////////////////////////////////////

var html_credits = '<p><hr><p><center>\
Copyright 2022. <a href="https://www.upriss.org.uk">Uta Priss</a>, URL:\
<a href="https://upriss.github.io/educaJS/">upriss.github.io/educaJS/</a></center>';

////// utilities ////////////////////////////////////////////////

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
//// create link in parameter 'graph' for data_content, show in console.log
//////////////////////////////////////////////////////////////////////

function createURL(data_content) {
  var elems = [window.location.protocol, '//', window.location.host,
               window.location.pathname, '?'];
  const qparams = new URLSearchParams(window.location.search);
  var queryParams = [];
  for (const key of qparams.keys()) {
     if (qparams.get(key) && key != 'graph') {
         queryParams.push(key + '=' + qparams.get(key));
     }
  }
//  if (qparams.get('lang')) { queryParams.push('lang=' + qparams.get('lang')); }
//  if (qparams.get('ttype')) { queryParams.push('ttype=' + qparams.get('ttype')); }
//  if (qparams.get('plusVenn')){queryParams.push('plusVenn=' + qparams.get('plusVenn')); }
//  if (qparams.get('rtype')) { queryParams.push('rtype=' + qparams.get('rtype')); }
//  if (qparams.get('csv')) { queryParams.push('csv=' + qparams.get('csv')); }
  queryParams.push('graph=' + encodeURIComponent(data_content));
  elems.push(queryParams.join('&'));
  console.log(elems.join(''));
}

//////////////////////////////////////////////////////////////////////
//// examine -> set answer
//////////////////////////////////////////////////////////////////////

function examine(property) {                                // uses main.matrixArray
   let TrueSymbol = "<font size=5 color='green'>&#10004;</font>";
   let FalseSymbol = "<font size=5 color='red'>&#10008;</font>";
   if (param.embed == "yes") {
      TrueSymbol = "<font size=5vw color='green'>&#10004;</font>";
      FalseSymbol = "<font size=5vw color='red'>&#10008;</font>";
   }
   let answer = TrueSymbol;
   let flag;
   if (property == 'function') {
     for(let elem of main.matrixArray) {
        if ((elem.join("").match(/1/g) || []).length != 1)  {
           answer = FalseSymbol;
           break;
        }
     }
   } else if (property == 'injective') {               // uses main.transMatrixArray
     for(let elem of main.transMatrixArray) {
        if ((elem.join("").match(/1/g) || []).length > 1 ) {
           answer = FalseSymbol;
           break;
        }
     }
   } else if (property == 'surjective') {              // uses main.transMatrixArray
     for(let elem of main.transMatrixArray) {
        if ((elem.join("").match(/1/g) || []).length == 0 ) {
           answer = FalseSymbol;
           break;
        }
     }
   } else if (property == 'closed') {                  // uses algGrp.universe
       for(let elem1 of main.matrixArray){
           for(let elem2 of elem1) {
	       if (!(algGrp.universe.has(elem2))) {
		   answer = FalseSymbol;
		   break;
	       }
	   }
       }
   } else if (property == 'neutral') {                 // uses algGrp.neutralElem
       if (algGrp.neutralElem == "") {
	   answer = FalseSymbol;
       }
   } else if (property == 'inverse') {                 // algGrp.ntrlElem/universe, grOp
       for (let elem1 of algGrp.universe) {
	   flag = 0;
	   for (let elem2 of algGrp.universe) {
	       if (grOp(elem1,elem2) == algGrp.neutralElem) {
		   flag++;
	       }
	       if (grOp(elem2,elem1) == algGrp.neutralElem) {
		   flag++;
	       }
	   }
	   if (flag != 2) {
	       answer = FalseSymbol;
               break;
	   }
       }
   } else if (property == 'commutative') {             // algGrp.universe, grOp
       for (let elem1 of algGrp.universe) {
	   for (let elem2 of algGrp.universe) {
	       if (grOp(elem1,elem2) != grOp(elem2,elem1) ) {
		   answer = FalseSymbol;
		   break;
	       }
	   }
       }
   }
   document.querySelector("#answer_" + property).innerHTML=answer;
}
