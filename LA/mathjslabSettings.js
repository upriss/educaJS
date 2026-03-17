function compu (inp,outp) {
//console.log(inp)
   const evaluator = new Evaluator();
   const input = evaluator.Parse(inp);
   let result; 
   try { result = evaluator.Evaluate(input);
      result = evaluator.UnparseMathML(result).replace(/\n/g,"<br>");
      result = result.replace(/,/g,", ");
      outp.innerHTML = result
   } catch (err) {
      console.log(err)
      outp.innerHTML = "<font color='red'>Error: " + err.message + ".</font>";
   }
//   outp.innerHTML = evaluator.Unparse(result)
}
