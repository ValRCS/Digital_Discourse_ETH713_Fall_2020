"use strict";
function parseJSON(text) {
  try { return {ok:true,value:JSON.parse(text)}; } catch(e) { return {ok:false,error:e.message}; }
}

function jsonType(value) {
  return value===null?"null":Array.isArray(value)?"array":typeof value==="object"?"object":typeof value;
}

function pythonType(value, numberLexeme) {
  return ({object:"dict",array:"list",string:"str",boolean:"bool",null:"NoneType"})[jsonType(value)] || (numberLexeme!==undefined ? (/[.eE]/.test(numberLexeme)?"float":"int") : "int or float (depends on original JSON number syntax)");
}

function pythonPath(parts) {
  return "data"+parts.map(p=>"["+(typeof p==="number"?p:JSON.stringify(p))+"]").join("");
}

function treeEntries(value, path=[]) {
  return Array.isArray(value)?value.map((v,i)=>({key:i,value:v,path:[...path,i]})):value!==null&&typeof value==="object"?Object.entries(value).map(([k,v])=>({key:k,value:v,path:[...path,k]})):[];
}

function serialize(value, indent, ascii) {
  const text=JSON.stringify(value,null,indent);
  return ascii?text.replace(/[\u007f-\uffff]/g,c=>"\\u"+c.charCodeAt(0).toString(16).padStart(4,"0")):text;
}

function makeCorpus(records, ids, fields, metadata, generatedAt) {
  const selected=records.filter(r=>ids.includes(r.id));
  const kept=selected.filter(r=>typeof r.text==="string"&&r.text.trim()&&typeof r.id==="string"&&typeof r.language==="string"&&typeof r.title==="string");
  const output=kept.map(r=>Object.fromEntries(fields.filter(f=>Object.hasOwn(r,f)).map(f=>[f,r[f]])));
  return {metadata:{...metadata,generated_at_utc:generatedAt,selected_ids:ids,retained_fields:fields,extraction:"Select records and fields; reject incomplete required records",selected_count:selected.length,retained_count:kept.length,skipped_count:selected.length-kept.length},records:output};
}

function tokenize(text) {
  return text.normalize("NFC").toLowerCase().match(/\p{L}+(?:['’\-]\p{L}+)*/gu)||[];
}

function frequencies(records, language, removeStops) {
  const stop=new Set(language==="lv"?["ir","un","ar"]:["and","the","is","a"]);
  const tokens=records.filter(r=>r.language===language&&typeof r.text==="string").flatMap(r=>tokenize(r.text)).filter(t=>!removeStops||!stop.has(t));
  const counts=new Map();
  for(const t of tokens)counts.set(t,(counts.get(t)||0)+1);
  return {total:tokens.length,distinct:counts.size,rows:[...counts].sort((a,b)=>b[1]-a[1]||(a[0]<b[0]?-1:a[0]>b[0]?1:0))};
}

function tsvCell(value) {
  const s=value===undefined?"":value===null?"null":typeof value==="object"?JSON.stringify(value):String(value);
  return /[\t\r\n"]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
}

function corpusTSV(corpus) {
  const fields=corpus.metadata.retained_fields;
  // Include provenance in every row; JSON remains canonical for empty datasets.
  const meta=["source_kind","generated_at_utc","limitations"];
  return [fields.concat(meta).map(tsvCell).join("\t"),...corpus.records.map(r=>fields.map(f=>tsvCell(r[f])).concat(meta.map(f=>tsvCell(corpus.metadata[f]))).join("\t"))].join("\n")+"\n";
}

function freqTSV(result,language) {
  return "language\tword_form\tcount\n"+result.rows.map(([word,count])=>[language,word,count].map(tsvCell).join("\t")).join("\n")+(result.rows.length?"\n":"");
}

function checkShape(value) {
  return value!==null&&typeof value==="object"&&!Array.isArray(value)&&typeof value.title==="string"&&typeof value.language==="string";
}

const week04 = {parseJSON,jsonType,pythonType,pythonPath,treeEntries,serialize,makeCorpus,tokenize,frequencies,tsvCell,corpusTSV,freqTSV,checkShape};
if(typeof module!=="undefined"&&module.exports)module.exports=week04;
if(typeof document!=="undefined")(function browser() {
  const $=id=>document.getElementById(id);
  const on=(id,event,fn)=>$(id).addEventListener(event,fn);
  const show=(id,value)=>{$(id).textContent=value;};
  const examples={object:'{\n  "city": "Rīga",\n  "active": true,\n  "score": null\n}',python:"{'city': 'Rīga', 'active': True}",comma:'{"city":"Rīga",}',array:'["Rīga","Liepāja"]',null:"null",number:"1e3",comment:'// note\n{"city":"Rīga"}'};
  let fixture=null, api=null, corpus=null, freq=null, frequencyLanguage="lv";
  function drawTree(value) {
    const root=$("json-tree");root.replaceChildren();
    let nodeCount=0;
    function add(parent,v,path,key,depth) {
      if(++nodeCount>1000||depth>30){const p=document.createElement("p");p.textContent="Display limit reached.";parent.append(p);return;}
      const children=treeEntries(v,path), button=document.createElement("button");
      button.type="button";button.className="tree-button";button.textContent=String(key)+" · "+jsonType(v);
      button.addEventListener("click",()=>{root.querySelectorAll("button[aria-pressed]").forEach(b=>b.setAttribute("aria-pressed","false"));button.setAttribute("aria-pressed","true");show("tree-path",pythonPath(path));show("tree-type",pythonType(v,path.length===0&&typeof v==="number"?$("json-input").value.trim():undefined));show("tree-value",JSON.stringify(v,null,2));});
      button.setAttribute("aria-pressed","false");
      if(children.length){const details=document.createElement("details"),summary=document.createElement("summary"),group=document.createElement("div");summary.textContent=String(key)+" ("+children.length+")";details.open=depth<2;group.className="tree-group";details.append(summary,button,group);parent.append(details);for(const child of children){if(nodeCount>=1000)break;add(group,child.value,child.path,child.key,depth+1);}}
      else parent.append(button);
      if(depth===0)button.click();
    }
    add(root,value,[],"root",0);
  }
  function validate(format=false) {
    const text=$("json-input").value;
    if(text.length>100000){show("json-status","Input exceeds the 100,000-character teaching limit.");return;}
    const result=parseJSON(text);
    $("json-format").disabled=!result.ok;
    if(!result.ok){show("json-status","Invalid JSON. "+result.error+" Check double quotes, commas, brackets, and lowercase JSON keywords.");$("json-tree").replaceChildren();["tree-path","tree-type","tree-value"].forEach(id=>show(id,"—"));return;}
    // JS numeric representation may round big integers or overflow; never silently reformat them.
    const lexemes=text.replace(/"(?:\\.|[^"\\])*"/g,'""').match(/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/g)||[];
    const risky=lexemes.some(s=>!Number.isFinite(Number(s))||Math.abs(Number(s))>Number.MAX_SAFE_INTEGER||s.replace(/[^0-9]/g,"").length>15);
    $("json-format").disabled=risky;
    if(format&&!risky)$("json-input").value=JSON.stringify(result.value,null,2);
    const displayedText=$("json-input").value;
    show("json-status","Valid JSON · root: "+jsonType(result.value)+" · expected Python type: "+pythonType(result.value,typeof result.value==="number"?displayedText.trim():undefined)+(risky?". Numeric precision may be lost in JavaScript; formatting disabled.":"")+(format?" · formatting may normalize number notation.":""));
    drawTree(result.value);
  }
  on("json-example","change",()=>{$("json-input").value=examples[$("json-example").value];validate();});
  on("json-validate","click",()=>validate());
  on("json-format","click",()=>validate(true));
  on("json-input","input",()=>{$("json-format").disabled=true;show("json-status","Edited — validate again.");$("json-tree").replaceChildren();["tree-path","tree-type","tree-value"].forEach(id=>show(id,"—"));});
  on("load-nested","click",()=>{if(api){$("json-input").value=JSON.stringify(api,null,2);validate();}});
  $("json-input").value=examples.object;validate();
  const rounds={
    dict:["{'city': 'Rīga'}",'{"city": "Rīga"}',"{'city': 'Rīga'}","Preserves the dictionary and string key."],
    list:["[1, 2]","[1, 2]","[1, 2]","Preserves the list."],
    tuple:["(1, 2)","[1, 2]","[1, 2]","Tuple becomes list."],
    key:["{1: 'one'}",'{"1": "one"}',"{'1': 'one'}","Integer key becomes a string."],
    set:["{1, 2}","TypeError","Not reached","Default encoder does not support sets."],
    date:["datetime(2026, 11, 25)","TypeError","Not reached","Choose an explicit date representation, e.g. ISO 8601 string."]
  };
  function round(){const r=rounds[$("round-choice").value];["round-before","round-json","round-after","round-note"].forEach((id,i)=>show(id,r[i]));}
  on("round-choice","change",round);round();
  function unicode(){const v=serialize({city:"Rīga",text:"Āboli, ķirši un bumbieri.",emoji:"😀"},Number($("indent").value),$("ascii").checked);show("unicode-output",v);show("unicode-count",Array.from(v).length+" Unicode code points; "+new TextEncoder().encode(v).length+" UTF-8 bytes. Both forms decode to the same values.");}
  on("ascii","change",unicode);on("indent","change",unicode);unicode();
  const scenarios={
    ok:[200,"application/json",'{"title":"Rīga","language":"lv"}'],
    shape:[200,"application/json",'{"title":null}'],
    html:[200,"text/html","<html><h1>Welcome</h1></html>"],
    missing:[404,"application/json",'{"error":"Not found"}'],
    limit:[429,"application/json",'{"error":"Rate limit"}'],
    server:[500,"application/json",'{"error":"Server error"}'],
    timeout:[null,"",""]
  };
  function http(){const s=scenarios[$("http-choice").value];show("request-url","GET https://example.invalid/articles?language="+encodeURIComponent($("query-lang").value)+"&limit="+encodeURIComponent($("query-limit").value));show("http-response",s[0]===null?"Timeout: no HTTP response received.":"HTTP "+s[0]+"\nContent-Type: "+s[1]+"\n\n"+s[2]);const p=parseJSON(s[2]);show("http-result",s[0]===null?"Network/timeout handling; no status code.":s[0]>=400?"HTTP error. "+(s[0]===429?"Respect Retry-After and rate limits.":"Check endpoint or handle server error.") : !p.ok?"HTTP success; JSON parsing failed.":!checkShape(p.value)?"HTTP and syntax succeeded; structure validation failed.":"HTTP, JSON syntax and expected structure passed.");}
  ["http-choice","query-lang","query-limit"].forEach(id=>on(id,"change",http));http();
  function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function drawFreq(){
    frequencyLanguage=$("freq-lang").value;
    const available=corpus&&corpus.metadata.retained_fields.includes("text")&&corpus.metadata.retained_fields.includes("language");
    freq=frequencies(available?corpus.records:[],frequencyLanguage,$("stopwords").checked);
    show("freq-text",available?corpus.records.filter(r=>r.language===frequencyLanguage).map(r=>r.text).join("\n\n")||"No selected records for this language.":"Retain text and language in the corpus builder.");
    show("freq-summary",freq.total+" tokens · "+freq.distinct+" distinct word forms");
    const out=$("freq-rows");out.replaceChildren();
    for(const [word,count] of freq.rows.slice(0,12)){const row=document.createElement("div"),label=document.createElement("span"),bar=document.createElement("progress"),num=document.createElement("span");row.className="frequency-row";label.textContent=word;bar.max=freq.rows[0][1];bar.value=count;bar.setAttribute("aria-label",word+": "+count);num.textContent=count;row.append(label,bar,num);out.append(row);}
    $("download-freq").disabled=!available||!freq.total;
  }
  function rebuild(){
    if(!fixture)return;
    const ids=[...$("record-choices").querySelectorAll("input:checked")].map(c=>c.value),fields=[...$("field-choices").querySelectorAll("input:checked")].map(c=>c.value);
    corpus=makeCorpus(fixture.records,ids,fields,{...fixture.metadata,source_file:"sample_records.json"},new Date().toISOString());
    show("corpus-summary",corpus.metadata.selected_count+" selected · "+corpus.metadata.retained_count+" retained · "+corpus.metadata.skipped_count+" skipped (invalid required fields)");
    show("corpus-preview",JSON.stringify(corpus,null,2));$("download-json").disabled=!fields.length||!corpus.records.length;$("download-tsv").disabled=$("download-json").disabled;drawFreq();
  }
  on("field-choices","change",rebuild);on("record-choices","change",rebuild);
  on("freq-lang","change",drawFreq);on("stopwords","change",drawFreq);
  on("download-json","click",()=>download("discourse_corpus.json",JSON.stringify(corpus,null,2)+"\n","application/json;charset=utf-8"));
  on("download-tsv","click",()=>download("discourse_corpus.tsv",corpusTSV(corpus),"text/tab-separated-values;charset=utf-8"));
  on("download-freq","click",()=>download("word_frequencies.tsv",freqTSV(freq,frequencyLanguage),"text/tab-separated-values;charset=utf-8"));
  Promise.all(["sample_records.json","sample_api_response.json"].map(name=>fetch("../../datasets/json-apis/"+name).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json();}))).then(([f,a])=>{
    fixture=f;api=a;
    for(const r of f.records){const label=document.createElement("label"),input=document.createElement("input");input.type="checkbox";input.value=r.id;input.checked=true;label.append(input,document.createTextNode(" "+r.title+" ("+r.language+")"+(r.text===null?" — deliberately incomplete":"")));$("record-choices").append(label);}
    $("load-nested").disabled=false;show("fixture-status","Local synthetic fixtures loaded. No live API requests.");rebuild();
  }).catch(e=>show("fixture-status","Could not load local fixtures. Serve this site over HTTP; other labs still work. "+e.message));
})();
