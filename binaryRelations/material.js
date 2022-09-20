var html_function_old = 
'<button id="buttFunc" onclick="examine(\'function\');">Funktion?</button> \
<a href="help_texts.html?Funktion" target="_blank" class="button">i</a> \
<span class="answer_container" id="answer_function"></span><br> \
<button id="buttFunc" onclick="examine(\'injective\');">injektiv?</button> \
<a href="help_texts.html?injektiv" target="_blank" class="button">i</a> \
<span class="answer_container" id="answer_injective"></span>';

var html_helptext1_old = '<div class="style_container"><p>&nbsp;</p><p><details> \
<summary>How to use this page:</summary>The lattice display can be moved and scrolled. \
Clicking on the 0s and 1s of the context changes the values. The names in the context \
can be edited. Rows and columns that contain only 0s are removed from the context.  \
</details></p></div>';

var html_function= 
'<button onclick="examine(\'function\');" class="tooltip">Funktion? \
<span>Für jedes Element des Definitionsbereichs gibt es genau ein Element \
des Wertebereichs.<br>In der Matrix steht in jeder Zeile maximal eine 1.</span></button> \
<span class="answer_container" id="answer_function"></span><br> \
<button onclick="examine(\'injective\');" class="tooltip">injektiv? \
<span>Verschiedene Elemente des Definitionsbereichs werden auf verschiedene Elemente des \
Wertebereichs abgebildet.<br>In der Matrix steht in jeder Spalte maximal eine 1.</span></button> \
<span class="answer_container" id="answer_injective"></span>';

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
For negation enter !, &nbsp; for OR: ||, &nbsp; for AND: &&, &nbsp;\
for conditional: =>, &nbsp; for biconditional: <==> <br>\
for 0 enter: x && !x, &nbsp; for 1 enter: x || !x';

var html_helptext_truthtable_de = '<div class="tooltip"><p></p><p>\
Benutzungshinweise<div>\
Alle Klammern m&uuml;ssen gesetzt werden. <br>\
F&uuml;r Negation verwenden Sie !, &nbsp; f&uuml;r OR: ||, &nbsp; f&uuml;r AND: &&, &nbsp;\
f&uuml;r Subjunktion: =>, &nbsp; f&uuml;r Bijunktion: <==> <br>\
f&uuml;r 0: x && !x, &nbsp; f&uuml;r 1: x || !x';


var html_helptext_truthtable2 = '</div></div>';

var html_helptext_vennEuler = '\
<p>(The software is not perfect. Venn diagrams for more than 3 sets do not \
work consistently.)</p></div></div>';

var html_helptext_vennEuler_de = '\
<p>(Achtung: die Software ist nicht perfekt. Die Venn-Diagramme sind nicht immer richtig, \
insbesondere nicht f&uuml;r mehr als 3 Mengen. Meistens, aber nicht immer, kommt dann \
eine Warnung "WARNING: area ... not represented on screen".))</p></div></div>';

var html_credits = '<p><hr><p><center>\
Copyright 2022. <a href="https://www.upriss.org.uk">Uta Priss</a>, URL:\
<a href="https://upriss.github.io/educaJS/">upriss.github.io/educaJS/</a></center>';
