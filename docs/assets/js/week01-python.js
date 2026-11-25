"use strict";
// Fixed Python models, not an interpreter. No eval or user code execution.
function createModel(){
 const ws=/[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+/u;
 const strip=s=>s.replace(/^[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+|[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/gu,"");
 const split=s=>strip(s)?strip(s).split(ws):[];
 const chars=s=>Array.from(s);
 const slice=(s,a,b)=>chars(s).slice(a,b).join("");
 const binding={text:['"Rīga"',"str"],number:["1937","int"],missing:["None","NoneType"]};
 const values={year:['"1937"',"1937","1937.0",'"1937"',"True"],city:['"Rīga"',"ValueError","ValueError",'"Rīga"',"True"],decimal:["4.75","4","4.75",'"4.75"',"True"],zero:["0","0","0.0",'"0"',"False"],empty:['""',"ValueError","ValueError",'""',"False"],falseText:['"False"',"ValueError","ValueError",'"False"',"True"],none:["None","TypeError","TypeError",'"None"',"False"]};
 const convert=(sample,method)=>({expression:method+"("+values[sample][0]+")",result:values[sample][["int","float","str","bool"].indexOf(method)+1]});
 const transform=(s,m)=>({lower:()=>s.toLowerCase(),upper:()=>s.toUpperCase(),strip:()=>strip(s),split:()=>split(s),len:()=>chars(s).length,count:()=>s.split("Rīga").length-1,replace:()=>s.split("Rīga").join("Jelgava")}[m]());
 const rule=(y,l,min)=>({year:y>=min,language:l==="Latvian",include:y>=min&&l==="Latvian"});
 const analyze=(text,lower,punct)=>{let normalized=lower?text.toLowerCase():text;if(punct) normalized=normalized.replace(/\p{P}/gu," ");const tokens=split(normalized),counts=new Map();for(const token of tokens)counts.set(token,(counts.get(token)||0)+1);return {normalized,tokens,characters:chars(text).length,unique:counts.size,frequencies:[...counts].sort((a,b)=>b[1]-a[1])};};
 const program=["Sveika, Rīga!","5","Digital Humanities"],words=["rīga","lasīt","rīga","bibliotēka"];
 const trace=(list,n)=>list.slice(0,Math.max(0,Math.min(n,list.length)));
 return {strip,split,chars,slice,binding,convert,transform,rule,analyze,program,words,trace};
}
function init(model,doc){
 const $=id=>doc.getElementById("w01-"+id), on=(id,event,fn)=>$(id).addEventListener(event,fn), txt=(id,s)=>{$(id).textContent=s;}, v=id=>$(id).value;
 const show=(id,s)=>txt(id,typeof s==="string"?s:JSON.stringify(s));
 const bool=x=>x?"True":"False";
 let step=0,iteration=0;
 function mark(id,n){Array.from($(id).children).forEach((el,i)=>{el.dataset.done=String(i<n);if(i===n)el.setAttribute("aria-current","step");else el.removeAttribute("aria-current");});}
 function program(){mark("step-lines",step);show("step-output",model.trace(model.program,step).join("\n")||"No output yet.");txt("step-status",step+" / 3 lines executed");$("step-next").disabled=step===3;}
 on("step-next","click",()=>{step=Math.min(3,step+1);program();});on("step-reset","click",()=>{step=0;program();});program();
 function bind(){const [value,type]=model.binding[v("binding")];txt("binding-code","document = "+value);txt("binding-value",value);txt("binding-type",type);txt("binding-note","document now refers to a "+type+" object. The name has been rebound.");}on("binding","change",bind);bind();
 function convert(){const c=model.convert(v("convert-value"),v("convert-method"));show("convert-output",c.expression+"\n→ "+c.result);}on("convert-value","change",convert);on("convert-method","change",convert);convert();
 function renderSlice(){const chars=model.chars(v("word")),a=Number(v("start")),b=Number(v("stop")),n=chars.length;txt("start-label",a);txt("stop-label",b);const bound=x=>Math.min(n,Math.max(0,x<0?n+x:x));$("chars").replaceChildren();chars.forEach((c,i)=>{const el=doc.createElement("div");el.className="w01-char";el.dataset.selected=String(i>=bound(a)&&i<bound(b));for(const [tag,t] of [["small",i],["code",c===" "?"␣":c],["small",i-n]]){const child=doc.createElement(tag);child.textContent=t;el.append(child);}$("chars").append(el);});show("slice-output","text["+a+":"+b+"] → "+JSON.stringify(model.slice(v("word"),a,b))+"\nlen(text) = "+n);}
 function resetSlice(){let n=model.chars(v("word")).length;for(const id of ["start","stop"]){$(id).min=-n;$(id).max=n;} $("start").value=0;$("stop").value=n;renderSlice();}
 on("word","input",resetSlice);on("start","input",renderSlice);on("stop","input",renderSlice);renderSlice();
 function transform(){const m=v("method"),x=model.transform(v("text"),m);const expr=m==="len"?"len(text)":m==="count"?'text.count("Rīga")':m==="replace"?'text.replace("Rīga", "Jelgava")':"text."+m+"()";show("transform-output",expr+"\n→ "+JSON.stringify(x));}on("method","change",transform);on("text","input",transform);transform();
 function decision(){const y=Number(v("year")),m=Number(v("min-year")),l=v("language"),r=model.rule(y,l,m);txt("year-label",y);txt("min-label",m);show("rule-output","year >= "+m+" → "+bool(r.year)+'\nlanguage == "Latvian" → '+bool(r.language)+"\nCombined: "+bool(r.include)+"\n"+(r.include?"Include in corpus":"Exclude from corpus"));}on("year","input",decision);on("min-year","input",decision);on("language","change",decision);decision();
 function loop(){mark("loop-items",iteration);const last=iteration?model.words[iteration-1]:null;txt("loop-binding",iteration===0?"word is not yet bound by this loop.":'word = '+JSON.stringify(last)+(iteration===model.words.length?" (loop finished; last binding remains)":""));show("loop-output",model.trace(model.words,iteration).join("\n")||"No output yet.");$("loop-next").disabled=iteration===model.words.length;}on("loop-next","click",()=>{iteration=Math.min(model.words.length,iteration+1);loop();});on("loop-reset","click",()=>{iteration=0;loop();});loop();
 function research(){const r=model.analyze(v("corpus"),$("lower").checked,$("punct").checked);txt("metric-chars",r.characters);txt("metric-tokens",r.tokens.length);txt("metric-unique",r.unique);show("normalized",JSON.stringify(r.normalized));txt("token-list",r.tokens.length?"Tokens (first 80): "+r.tokens.slice(0,80).map(x=>JSON.stringify(x)).join(" · "):"No tokens.");$("frequency").replaceChildren();for(const [word,count] of r.frequencies.slice(0,12)){const row=doc.createElement("div");row.className="w01-frequency-row";row.setAttribute("role","listitem");const label=doc.createElement("span");label.textContent=word;const meter=doc.createElement("meter");meter.min=0;meter.max=r.frequencies[0][1];meter.value=count;meter.setAttribute("aria-label",word+" frequency");const number=doc.createElement("span");number.textContent=count;row.append(label,meter,number);$("frequency").append(row);}txt("research-status",r.tokens.length?r.frequencies.length+" distinct tokens; "+Math.min(12,r.frequencies.length)+" frequencies shown.":"Empty or whitespace-only input; no frequencies.");}on("corpus","input",research);on("lower","change",research);on("punct","change",research);research();
}
if (typeof module !== "undefined" && module.exports) module.exports = {createModel, init};
if (typeof document !== "undefined") init(createModel(), document);
