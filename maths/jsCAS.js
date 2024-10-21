function len(n) { return n.length; }
function sqrt(n) { return Math.sqrt(n);}
function pow(m,n) { return Math.pow(m,n);}
function sin(n) { return Math.sin(n);}
function tan(n) { return Math.tan(n);}
function cos(n) { return Math.cos(n);}
function cot(n) { return Math.cot(n);}
function asin(n) { return Math.asin(n);}
function atan(n) { return Math.atan(n);}
function acos(n) { return Math.acos(n);}
function degrees(n) { return n * (180/Math.PI);}
function radians(n) { return n * (Math.PI/180);}
function log(m,n) { return Math.log(m)/Math.log(n)}
function log2(n) { return Math.log2(n)}
function log10(n) { return Math.log10(n)}
function factorial(n) { return math.factorial(n); }
function gcd(m,n) { return math.gcd(m,n);}
function lcm(m,n) { return math.lcm(m,n);}
function comb(n,k) { return math.factorial(n)/(math.factorial(k)*math.factorial(n-k)) }
function simplify(n) { let temp = n.replaceAll("**","^");
                       temp = math.simplify(temp);
		       temp = String(temp).replaceAll("^","**");
		       return temp; }
function solve(n) { return nerdamer.solve(n,'X') }
function mod(n,m) { return ((n % m) + m) % m; }

let traces = [];
let plotArea = "";
function zeichnen2(pl) { Plotly.newPlot(pl, traces);}
function zeichnen(n,pl) {
    let xValues = [];
    let yValues = [];
    if (plotArea != pl) { traces = [];	plotArea = pl; }
    for (let x = 0; x <= 10; x += 0.1) { xValues.push(x); yValues.push(eval(n)); }
    traces.push({x:xValues, y:yValues, mode:"lines"});
    zeichnen2(pl);
    return "" 
}
function zeichnenReset() { traces = []; Plotly.newPlot(plotArea, traces); }

function compute(inA,outA,inA2){
   let result = "";
   let result2 = "";
   let tempstring = "";
   let inputArea = document.querySelector(inA);
   let inp = inputArea.value;
   inp = inp.replaceAll("pi","Math.PI");
   inp = inp.replace(/simplify\((.*)\)/g,"simplify('$1')"); // because Javascr needs quotes
   inp = inp.replace(/solve\((.*)\)/g,"solve('$1')");       // only works for X
   inp = inp.replace(/prOnly\((.*)\)/g,"'$1'");             // print only 
   if (inp.match(/{/)) {                                    // for set operations
       result = setOps(inp);
   } else if (typeof inA2 != 'undefined') {           // inA2 for comparison with hidden
       let inputHArea = document.querySelector(inA2);
       let inp2 = inputHArea.value;
       inp2 = inp2.replaceAll("pi","Math.PI");
       try { 
	   if (inp.match(/^str/)) {
	       inp = inp.replace(/^str/,"");
	       result = inp.toLowerCase();
	       result2 = inp2.toLowerCase();
	   } else {
	       result = eval(inp);
	       result2 = eval(inp2);
	   }
	   tempstring = (result == result2).toString();
           if (tempstring == "true") { 
	       tempstring = "richtig. <font size=5 color='green'>&#10003;</font>"
           } else { tempstring = "falsch. <font size=5 color='red'>&#10007;</font>" }
	   result = "Eingabe: " + result2.toString() 
	       + "&nbsp; ist " + tempstring;
       } catch(err) { result = "Ihre Eingabe war falsch. (" + err + ")"}
   } else {
       try { result = eval(inp); }
       catch(err) { result = "Ihre Eingabe war falsch. (" + err + ")" }
   }

   document.getElementById(outA).innerHTML=result;
}

