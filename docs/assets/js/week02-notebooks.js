"use strict";
(function (root) {
  const split = s => String(s).split(/[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+/u).filter(Boolean);
  const fresh = () => ({text:null,words:null,n:0,counts:[null,null,null],outputs:["Not executed","Not executed","Not executed"]});
  function run(s,i,source) {
    const next={...s,n:s.n+1,counts:[...s.counts],outputs:[...s.outputs]};
    next.counts[i]=next.n;
    if(i===0){next.text=source;next.outputs[i]="Assigned text (no displayed Python expression).";}
    if(i===1){if(s.text===null){next.outputs[i]="NameError: name 'text' is not defined";}else{next.words=split(s.text);next.outputs[i]="Assigned words (no displayed Python expression).";}}
    if(i===2){next.outputs[i]=s.words===null?"NameError: name 'words' is not defined":String(s.words.length);}
    return next;
  }
  const restart = s => ({...fresh(),counts:[...s.counts],outputs:[...s.outputs]});
  const all = source => [0,1,2].reduce((s,i)=>run(s,i,source),fresh());
  const imports={module:["math","math.sqrt(81)"],alias:["m","m.sqrt(81)"],function:["sqrt","sqrt(81)"],functionAlias:["square_root","square_root(81)"]};
  const evaluate=(mode,call)=>call===imports[mode][1]?"9.0":"NameError: name '"+call.split(/[.(]/)[0]+"' is not defined";
  const environment=()=>({installed:false,imported:false,log:"Environment initialized."});
  function env(s,action){
    switch(action){
      case "install": return {...s,installed:true,log:"Installed requests (simulation). Import still required."};
      case "import": return {...s,imported:s.installed,log:s.installed?"Import successful.":"ModuleNotFoundError: No module named 'requests'"};
      case "inspect": return {...s,log:s.imported?"requests.get is available. No network request sent.":"NameError: name 'requests' is not defined"};
      case "restart": return {...s,imported:false,log:"Kernel restarted; installed distributions remain in this environment."};
      case "new": return environment();
      default: return s;
    }
  }
  const files=["/content/data/sample.txt","/content/data/metadata.csv","/content/results/counts.tsv","/content/research.ipynb"];
  const dirs=["/","/content","/content/data","/content/results"];
  function resolve(cwd,path){
    const parts=(path.startsWith("/")?path:cwd+"/"+path).split("/"), stack=[];
    for(const p of parts){if(!p||p===".")continue;if(p==="..")stack.pop();else stack.push(p);}
    const absolute="/"+stack.join("/");
    const status=files.includes(absolute)?"File found":dirs.includes(absolute)?"IsADirectoryError — path is a directory":"FileNotFoundError";
    return {absolute,status};
  }
  function analyze(corpus,lower){
    const docs=corpus.split("\n").filter(line=>split(line).length);
    const tokens=docs.flatMap(line=>split(lower?line.toLowerCase():line));
    const counts=new Map();
    for(const token of tokens)counts.set(token,(counts.get(token)||0)+1);
    return {documents:docs.length,tokens:tokens.length,unique:counts.size,frequencies:[...counts].sort((a,b)=>b[1]-a[1])};
  }
  // JSON string literals normally match Python double-quoted strings, but JSON surrogate
  // escapes do not combine in Python. Keep Unicode characters and escape lone surrogates.
  const pythonString = s => JSON.stringify(s).replace(/\u007f/g,"\\u007f");
  const generated=(corpus,lower)=>"from collections import Counter\n\ntext = "+pythonString(corpus)+"\nwords = text"+(lower?".lower()":"")+".split()\nfrequencies = Counter(words)\nprint(frequencies.most_common())";
  const examples={words:['text = "Rīga ir Latvijas galvaspilsēta"\nlen(text.split())',"4"],print:['print("Sveika, Rīga!")',"Sveika, Rīga!"],type:['type("Rīga")',"<class 'str'>"]};
  function markdownLines(source){return source.split("\n").map(line=>{const m=/^(#{1,6}) (.*)$/.exec(line);return {heading:!!m,text:m?m[2]:line};});}
  const model={split,fresh,run,restart,all,imports,evaluate,environment,env,resolve,analyze,generated,examples,markdownLines};
  if(typeof module==="object"&&module.exports)module.exports=model;
  else root.Week02=model;
  if(typeof document==="undefined")return;
  const $=id=>document.getElementById(id);
  if(!$("w02-runtime"))return;
  const on=(id,event,fn)=>$(id).addEventListener(event,fn);
  const put=(id,value)=>{$(id).textContent=value;};
  const node=(tag,content,cls)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(content!==undefined)el.textContent=content;return el;};
  function editor(){
    const md=$("w02-cell-kind").value==="markdown";
    $("w02-md-wrap").hidden=!md;$("w02-code-wrap").hidden=md;
    put("w02-example-source",examples[$("w02-example").value][0]);
    put("w02-editor-result","Choose a cell and run it.");
  }
  on("w02-cell-kind","change",editor);on("w02-example","change",editor);
  on("w02-editor-run","click",()=>{
    const result=$("w02-editor-result");
    if($("w02-cell-kind").value==="markdown"){
      result.replaceChildren(...markdownLines($("w02-md").value).map(line=>node("p",line.text,line.heading?"w02-md-heading":"")));
    }else result.replaceChildren(node("pre",examples[$("w02-example").value][1]));
  });
  editor();
  let state=fresh();
  function memory(){
    for(let i=0;i<3;i++){put("w02-count-"+i,"In ["+(state.counts[i]??" ")+"]");put("w02-output-"+i,state.outputs[i]);}
    put("w02-memory","text = "+(state.text===null?"<not defined>":JSON.stringify(state.text))+"\nwords = "+(state.words===null?"<not defined>":JSON.stringify(state.words))+"\nCurrent kernel executions: "+state.n);
  }
  for(let i=0;i<3;i++)on("w02-run-"+i,"click",()=>{state=run(state,i,$("w02-source").value);memory();});
  on("w02-restart","click",()=>{state=restart(state);memory();});
  on("w02-all","click",()=>{state=all($("w02-source").value);memory();});
  on("w02-clear","click",()=>{state={...state,outputs:["Output cleared","Output cleared","Output cleared"]};memory();});
  memory();
  function importsUI(){const [name,call]=imports[$("w02-import-mode").value];put("w02-bound",name);put("w02-import-result","Valid call: "+call+"\nResult: 9.0");put("w02-call-result","Choose a call.");}
  on("w02-import-mode","change",importsUI);on("w02-call-run","click",()=>put("w02-call-result",evaluate($("w02-import-mode").value,$("w02-call").value)));importsUI();
  let environmentState=environment();
  function envUI(){put("w02-packages","math: available\ncollections: available\njson: available\nrequests: "+(environmentState.installed?"installed":"not installed")+"\nrequests name: "+(environmentState.imported?"bound":"not bound"));put("w02-install-log",environmentState.log);}
  for(const [id,action] of [["w02-install","install"],["w02-do-import","import"],["w02-inspect","inspect"],["w02-kernel","restart"],["w02-new-env","new"]])on(id,"click",()=>{environmentState=env(environmentState,action);envUI();});
  envUI();
  function fsUI(){const result=resolve($("w02-cwd").value,$("w02-path").value);put("w02-path-result","Resolved: "+result.absolute+"\n"+result.status);}
  on("w02-cwd","change",fsUI);on("w02-path","input",fsUI);fsUI();
  function pipeline(){
    const corpus=$("w02-corpus").value,lower=$("w02-lower").checked,result=analyze(corpus,lower);
    $("w02-metrics").replaceChildren(...[["Documents",result.documents],["Tokens",result.tokens],["Unique tokens",result.unique]].map(([label,value])=>{const el=node("div");el.append(node("span",label),node("strong",String(value)));return el;}));
    const max=result.frequencies[0]?.[1]||1;
    $("w02-bars").replaceChildren(...result.frequencies.slice(0,12).map(([token,count])=>{const row=node("div",undefined,"w02-bar-row"),track=node("div",undefined,"w02-bar-track"),fill=node("div",undefined,"w02-bar-fill");fill.style.width=(100*count/max)+"%";track.setAttribute("aria-hidden","true");track.append(fill);row.append(node("span",token),track,node("span",String(count)));return row;}));
    put("w02-truncated",result.unique>12?"Showing 12 of "+result.unique+" unique tokens.":result.unique?"All unique tokens shown.":"No tokens to count.");
    put("w02-generated",generated(corpus,lower));
  }
  on("w02-corpus","input",pipeline);on("w02-lower","change",pipeline);pipeline();
})(typeof globalThis==="object"?globalThis:this);
