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

// Dependency-free simulated DOM events; not a browser layout test.
function interactionChecks(createModel,init){
 let checks=0;
 const eq=(a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error("Interaction expected "+JSON.stringify(b)+" got "+JSON.stringify(a));checks++;};
 class Element {
  constructor(){this.children=[];this.dataset={};this.attrs={};this.events={};this.value="";this.checked=false;this.disabled=false;this.textContent="";}
  addEventListener(type,fn){(this.events[type]??=[]).push(fn);}
  trigger(type){for(const fn of this.events[type]||[])fn();}
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.children=children;}
  setAttribute(k,v){this.attrs[k]=v;}
  removeAttribute(k){delete this.attrs[k];}
 }
 const elements=new Map(),el=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
 const doc={getElementById:id=>el(id.replace(/^w01-/,"")),createElement:()=>new Element()};
 const set=(id,v,event="input")=>{el(id).value=String(v);el(id).trigger(event);};
 const click=id=>el(id).trigger("click");
 const check=(id,val)=>{el(id).checked=val;el(id).trigger("change");};
 for(const [id,value] of Object.entries({binding:"text","convert-value":"year","convert-method":"int",word:"bibliotēka",start:1,stop:5,text:"  Rīga ir skaista. Rīga lasa.  ",method:"lower",year:1937,language:"Latvian","min-year":1918,corpus:"Rīga ir skaista. Rīga ir vēsturiska. Latvija ir skaista."}))el(id).value=String(value);
 el("lower").checked=true;el("punct").checked=true;
 el("step-lines").children=Array.from({length:3},()=>new Element());el("loop-items").children=Array.from({length:4},()=>new Element());
 init(createModel(),doc);
 eq(el("step-output").textContent,"No output yet.");click("step-next");eq(el("step-output").textContent,"Sveika, Rīga!");click("step-next");click("step-next");eq(el("step-next").disabled,true);eq(el("step-output").textContent,"Sveika, Rīga!\n5\nDigital Humanities");click("step-reset");eq(el("step-next").disabled,false);
 set("binding","number","change");eq(el("binding-value").textContent,"1937");eq(el("binding-type").textContent,"int");
 set("convert-value","city","change");eq(el("convert-output").textContent,'int("Rīga")\n→ ValueError');set("convert-method","bool","change");eq(el("convert-output").textContent,'bool("Rīga")\n→ True');
 eq(el("chars").children.length,10);eq(el("slice-output").textContent,'text[1:5] → "ibli"\nlen(text) = 10');set("word","😀a");eq(el("chars").children.length,2);eq(el("start").min,-2);eq(el("stop").max,2);set("stop",1);eq(el("slice-output").textContent,'text[0:1] → "😀"\nlen(text) = 2');set("word","");eq(el("chars").children.length,0);eq(el("slice-output").textContent,'text[0:0] → ""\nlen(text) = 0');
 set("text"," Rīga \u0085 lasa ");set("method","split","change");eq(el("transform-output").textContent,'text.split()\n→ ["Rīga","lasa"]');
 set("year",1917);eq(el("rule-output").textContent.endsWith("Exclude from corpus"),true);set("year",1918);eq(el("rule-output").textContent.endsWith("Include in corpus"),true);set("language","German","change");eq(el("rule-output").textContent.endsWith("Exclude from corpus"),true);
 click("loop-next");eq(el("loop-binding").textContent,'word = "rīga"');eq(el("loop-output").textContent,"rīga");click("loop-next");click("loop-next");click("loop-next");eq(el("loop-next").disabled,true);eq(el("loop-binding").textContent.includes("last binding remains"),true);click("loop-reset");eq(el("loop-output").textContent,"No output yet.");
 eq(el("metric-chars").textContent,56);eq(el("metric-tokens").textContent,9);eq(el("metric-unique").textContent,5);eq(el("frequency").children.length,5);
 set("corpus","A,a");check("lower",false);eq(el("metric-unique").textContent,2);check("lower",true);eq(el("metric-unique").textContent,1);check("punct",false);eq(el("metric-tokens").textContent,1);set("corpus","");eq(el("metric-tokens").textContent,0);eq(el("frequency").children.length,0);
 return checks;
}
console.log("Week 01 DOM interaction assertions passed: "+interactionChecks(createModel, init));
