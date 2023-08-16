// eg form id = 'w1'
// select id = "w1_61_1"
// answer id = "w1_61_1_ans"

function examine(property) {
//   var solutions = {"w1_61_1":"Aussage", "w1_61_2":"Aussage"};
   form_elements = document.querySelector("#"+property).elements;
   for (i = 0; i < form_elements.length ;i++) {
      var answer = "<font size=5 color='red'>&#10007;</font>";
      if (typeof solutions[form_elements[i].id] !== 'undefined') {
         if (form_elements[i].value == 
             decodeURIComponent(escape(atob(solutions[form_elements[i].id] )))) {
             answer = "<font size=5 color='green'>&#10003;</font>";
         }
      document.querySelector("#" + form_elements[i].id + "_ans").innerHTML=answer;
      }
   }
}
