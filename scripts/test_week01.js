"use strict";
const {createModel, init} = require("../docs/assets/js/week01-python.js");
function runChecks(m){
 let n=0;const eq=(a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error("Expected "+JSON.stringify(b)+" got "+JSON.stringify(a));n++;};
 eq(m.chars("Rīga").length,4);eq(m.chars("e\u0304").length,2);eq(m.chars("😀").length,1);eq(m.slice("bibliotēka",1,5),"ibli");eq(m.slice("Rīga",-2,4),"ga");eq(m.slice("Rīga",3,1),"");eq(m.slice("",0,0),"");eq(m.slice("😀a",0,1),"😀");
 eq(m.split(" \u0085Rīga\u001clasa\u00a0"),["Rīga","lasa"]);eq(m.split("\ufeff"),["\ufeff"]);eq(m.split(" \t\n"),[]);eq(m.transform("  Rīga  ","strip"),"Rīga");eq(m.transform("Rīga Rīga","count"),2);eq(m.transform("rīga","count"),0);eq(m.transform("Rīga","lower"),"rīga");eq(m.transform("Rīga","upper"),"RĪGA");eq(m.transform("Rīga Rīga","replace"),"Jelgava Jelgava");eq(m.transform("Rīga","len"),4);
 eq(m.convert("year","int").result,"1937");eq(m.convert("city","float").result,"ValueError");eq(m.convert("none","int").result,"TypeError");eq(m.convert("falseText","bool").result,"True");eq(m.convert("empty","bool").result,"False");eq(m.convert("decimal","int").result,"4");eq(m.convert("zero","float").result,"0.0");eq(m.binding.missing,["None","NoneType"]);eq(m.rule(1918,"Latvian",1918).include,true);eq(m.rule(1917,"Latvian",1918).include,false);eq(m.rule(2026,"German",1918).include,false);
 eq(m.trace(m.program,0),[]);eq(m.trace(m.program,2),["Sveika, Rīga!","5"]);eq(m.trace(m.words,9),m.words);eq(m.trace(m.words,-1),[]);
 let r=m.analyze("Rīga ir skaista. Rīga ir vēsturiska. Latvija ir skaista.",true,true);eq(r.tokens.length,9);eq(r.unique,5);eq(r.frequencies,[["ir",3],["rīga",2],["skaista",2],["vēsturiska",1],["latvija",1]]);eq(m.analyze("a,b",false,true).tokens,["a","b"]);eq(m.analyze("A a",false,false).unique,2);eq(m.analyze("A a",true,false).unique,1);eq(m.analyze("",true,true).frequencies,[]);eq(m.analyze("__",true,true).tokens,[]);eq(m.analyze("a a b b c",false,false).frequencies,[["a",2],["b",2],["c",1]]);
 return n;
}
console.log("Week 01 model assertions passed: "+runChecks(createModel()));
