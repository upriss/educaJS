// var html_function_old = 
// '<button id="buttFunc" onclick="examine(\'function\');">Funktion?</button> \
// <a href="help_texts.html?Funktion" target="_blank" class="button">i</a> \
// <span class="answer_container" id="answer_function"></span><br> \
// <button id="buttFunc" onclick="examine(\'injective\');">injektiv?</button> \
// <a href="help_texts.html?injektiv" target="_blank" class="button">i</a> \
// <span class="answer_container" id="answer_injective"></span>';

// var html_helptext1_old = '<div class="style_container"><p>&nbsp;</p><p><details> \
// <summary>How to use this page:</summary>The lattice display can be moved and scrolled. \
// Clicking on the 0s and 1s of the context changes the values. The names in the context \
// can be edited. Rows and columns that contain only 0s are removed from the context.  \
// </details></p></div>';

var html_function= 
'<button onclick="examine(\'function\');" class="tooltip">Funktion? \
<span>Funktion: Für jedes Element des Definitionsbereichs gibt es genau ein Element \
des Wertebereichs.<br>In der Matrix steht in jeder Zeile genau eine 1.</span></button> \
<span class="answer_container" id="answer_function"></span><br> \
<button onclick="examine(\'injective\');" class="tooltip">injektiv? \
<span>Injektiv: Verschiedene Elemente des Definitionsbereichs dürfen nicht auf das \
gleiche Element des Wertebereichs abgebildet werden.<br>In der Matrix steht in jeder \
Spalte maximal eine 1.</span></button> \
<span class="answer_container" id="answer_injective"></span><br> \
<button onclick="examine(\'surjective\');" class="tooltip">surjektiv? \
<span>Surjektiv: Für jedes Element des Wertebereichs muss es eins im Definitionsbereich \
geben.<br>In der Matrix steht in jeder Spalte mindestens eine 1.</span></button> \
<span class="answer_container" id="answer_surjective"></span>';

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

var html_credits = '<p><hr><p><center>\
Copyright 2022. <a href="https://www.upriss.org.uk">Uta Priss</a>, URL:\
<a href="https://upriss.github.io/educaJS/">upriss.github.io/educaJS/</a></center>';
