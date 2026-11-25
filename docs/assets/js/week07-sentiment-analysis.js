"use strict";
(function browser(M,annotation){
 const $=id=>document.getElementById(id);
 const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);if(cls)n.className=cls;return n;};
 const para=(p,t)=>p.append(node("p",t));
 const fmt=v=>v===null?"N/A":Number(v.toFixed(3)).toString();
 const pct=v=>v===null?"N/A":(100*v).toFixed(1)+"%";
 const on=(ids,fn)=>ids.forEach(id=>{$(id).addEventListener("input",fn);$(id).addEventListener("change",fn);});
 const render=(id,fn)=>{const p=$(id);p.replaceChildren();try{fn(p)}catch(e){para(p,e.message||String(e));}};
 function table(parent,headers,rows){const wrap=node("div",undefined,"w7-scroll"),t=node("table"),thead=node("thead"),tr=node("tr");headers.forEach(h=>{const th=node("th",h);th.scope="col";tr.append(th)});thead.append(tr);t.append(thead);const body=node("tbody");rows.forEach(row=>{const tr=node("tr");row.forEach((v,i)=>{const c=node(i===0?"th":"td",v);if(!i)c.scope="row";tr.append(c)});body.append(tr)});t.append(body);wrap.append(t);parent.append(wrap);}
 function report(p,r,show=true){para(p,`Prediction: ${r.label} · Raw score ${fmt(r.net)} · Positive ${fmt(r.pos)} · Negative ${fmt(r.neg)}`);para(p,`Matched ${r.matches}/${r.tokens} tokens · coverage ${pct(r.coverage)} · per token ${fmt(r.perToken)} · per match ${fmt(r.perMatch)}`);if(show){const tokens=node("div");r.details.slice(0,300).forEach(d=>tokens.append(node("span",`${d.word}${d.matched?` (${fmt(d.value)})`:""}${d.rules.length?" ["+d.rules.join(", ")+"]":""}`,"w7-token "+(d.value>0?"w7-pos":d.value<0?"w7-neg":""))));p.append(tokens);if(r.details.length>300)para(p,"Showing the first 300 tokens; score includes all tokens.");}}
 function showMetrics(p,m){const e=M.evaluate(m);para(p,`Accuracy ${pct(e.accuracy)} · Macro F1 ${fmt(e.macroF1)} · ${e.correct}/${e.total} correct · ${e.abstentions} abstentions`);table(p,["Reference","Support","Precision","Recall","F1"],e.perClass.map(c=>[c.label,c.support,fmt(c.precision),fmt(c.recall),fmt(c.f1)]));}
 const showAnn=()=>{$("ann-text").textContent=annotation[Number($("ann-item").value)][0];$("ann-answer").value="";$("ann-result").replaceChildren();};
 on(["ann-item"],showAnn);showAnn();$("ann-reveal").addEventListener("click",()=>render("ann-result",p=>{if(!$("ann-answer").value){para(p,"Choose an annotation first.");return;}const a=annotation[Number($("ann-item").value)];para(p,`Your label: ${$("ann-answer").value}. Suggested label: ${a[1]}. ${a[2]}`);}));
 const initial=[[4,1,0,1,0],[1,3,0,0,2],[1,0,4,0,1],[1,0,2,3,0]];
 function resetMatrix(){const p=$("matrix-input");p.replaceChildren();const t=node("table"),head=node("thead"),tr=node("tr");["Reference ↓",...M.predictions].forEach(h=>{const th=node("th",h);th.scope="col";tr.append(th)});head.append(tr);t.append(head);const body=node("tbody");M.reference.forEach((label,i)=>{const tr=node("tr"),th=node("th",label);th.scope="row";tr.append(th);M.predictions.forEach((pred,j)=>{const td=node("td"),input=node("input");input.type="number";input.min="0";input.max="10000";input.step="1";input.value=String(initial[i][j]);input.id=`matrix-${i}-${j}`;input.setAttribute("aria-label",`Reference ${label}, prediction ${pred}`);input.addEventListener("input",updateMatrix);td.append(input);tr.append(td)});body.append(tr)});t.append(body);p.append(t);updateMatrix();}
 function updateMatrix(){render("matrix-result",p=>{const m=M.reference.map((_,i)=>M.predictions.map((_,j)=>{const el=$(`matrix-${i}-${j}`);if(el.value===""||!el.validity.valid)throw Error("Use an integer between 0 and 10000 in every cell.");return Number(el.value)}));showMetrics(p,m)});}
 $("matrix-reset").addEventListener("click",resetMatrix);resetMatrix();
 const scenarios=[["The buses are excellent, but the tickets are expensive.","ticket prices","negative","The tickets are expensive.","Mixed overall evaluation; target is ticket prices."],["The minister called the proposal disastrous.","proposal","unclear","The minister called the proposal disastrous.","The speaker is the minister; the author's own view is unclear."],["I waited three hours for assistance.","service","negative","I waited three hours for assistance.","Implicit negative evaluation is a plausible reading, not certain."]];
 function updatePrompt(){render("llm-result",p=>{const a=scenarios[Number($("llm-case").value)],level=Number($("llm-level").value);para(p,"Text: "+a[0]);const prompt=level===0?"Classify the text as positive, neutral or negative.":level===1?`Classify the author's sentiment towards ${a[1]} as positive, neutral, negative, mixed or unclear. Distinguish quoted speakers.`:`Classify the author's sentiment towards ${a[1]}. Return JSON with sentiment, target, exact evidence and uncertainty (low, medium or high). Distinguish quoted speakers.`;para(p,"Prompt: "+prompt);para(p,"Illustrative stored response (not generated live):");p.append(node("pre",level===0?["negative","negative","negative"][Number($("llm-case").value)]:level===1?a[2]:JSON.stringify({sentiment:a[2],target:a[1],evidence:a[3],uncertainty:"medium"},null,2)));para(p,a[4]);});}
 on(["llm-case","llm-level"],updatePrompt);updatePrompt();
 const load=async file=>{const r=await fetch("../../datasets/sentiment-analysis/"+file);if(!r.ok)throw Error(`Cannot load ${file}: HTTP ${r.status}`);return r.json();};
 Promise.all([load("lexicon_en.json"),load("lexicon_lv.json"),load("sample_sentiment_corpus.json")]).then(([en,lv,corpus])=>{
   const lex={en:en.weights,lv:lv.weights},records=corpus.records;
   const lexText=l=>Object.entries(l).map(([k,v])=>`${k} = ${v}`).join("\n");
   const lang=id=>$(id).value;
   function threshold(id){const e=$(id);if(!e.value||!e.validity.valid)throw Error("Enter a threshold from 0 to 100 in steps of 0.5.");return Number(e.value);}
   function baseline(){render("score-result",p=>report(p,M.score($("score-text").value,lex[lang("score-lang")],{lang:lang("score-lang")})));}
   on(["score-lang","score-text"],baseline);
   $("score-neg").addEventListener("click",()=>{$("score-text").value=lang("score-lang")==="en"?"This is not good.":"Tas nav labs.";baseline()});
   $("score-empty").addEventListener("click",()=>{$("score-text").value=lang("score-lang")==="en"?"The council published a report.":"Dome publicēja ziņojumu.";baseline()});
   baseline();
   function custom(){render("custom-result",p=>report(p,M.score($("custom-text").value,M.parseLexicon($("custom-lex").value),{lang:lang("custom-lang"),threshold:threshold("custom-threshold")})));}
   function resetCustom(){$("custom-lex").value=lexText(lex[lang("custom-lang")]);custom();}
   on(["custom-lex","custom-text","custom-threshold"],custom);$("custom-lang").addEventListener("change",resetCustom);$("custom-reset").addEventListener("click",resetCustom);resetCustom();
   function context(){render("ctx-result",p=>{const langValue=lang("ctx-lang"),text=$("ctx-text").value,l=lex[langValue];p.append(node("h4","Baseline"));report(p,M.score(text,l,{lang:langValue}),false);p.append(node("h4","Selected rules"));report(p,M.score(text,l,{lang:langValue,negation:$("rule-neg").checked,intensity:$("rule-int").checked,contrast:$("rule-con").checked,punctuation:$("rule-pun").checked}));});}
   on(["ctx-lang","ctx-text","rule-neg","rule-int","rule-con","rule-pun"],context);context();
   const pairs=[["This is good.","Tas ir labs."],["This is not good.","Tas nav labs."],["Good ideas are helpful.","Labas idejas ir noderīgas."],["Very good.","Loti labi."]];
   function multi(){render("multi-result",p=>{const en=M.parseLexicon($("multi-lex-en").value),lv=M.parseLexicon($("multi-lex-lv").value),a=$("multi-en").value,b=$("multi-lv").value;for(const [title,text,l,langValue] of [["English with English lexicon",a,en,"en"],["Latvian with Latvian lexicon",b,lv,"lv"],["Latvian with English lexicon",b,en,"lv"]]){p.append(node("h4",title));report(p,M.score(text,l,{lang:langValue}));}});}
   function resetMulti(){$("multi-lex-en").value=lexText(lex.en);$("multi-lex-lv").value=lexText(lex.lv);multi();}
   $("multi-pair").addEventListener("change",()=>{const a=pairs[Number($("multi-pair").value)];$("multi-en").value=a[0];$("multi-lv").value=a[1];multi()});on(["multi-en","multi-lv","multi-lex-en","multi-lex-lv"],multi);$("multi-reset").addEventListener("click",resetMulti);resetMulti();
   let exportData=null;
   function dashboard(){exportData=null;$("corp-download").disabled=true;render("corp-result",p=>{
     const filter={language:lang("corp-lang"),source:$("corp-source").value,year:$("corp-year").value,genre:$("corp-genre").value},method=$("corp-method").value,thresholdValue=threshold("corp-threshold"),enabled=method==="rules",options={threshold:thresholdValue,negation:enabled,intensity:enabled,contrast:enabled,punctuation:enabled};
     const rows=M.analyze(M.filterRecords(records,filter),lex[filter.language],options);
     para(p,`${rows.length} documents · synthetic reference labels · ${method} · threshold ${thresholdValue}`);
     const counts=(subset,reference=false)=>Object.fromEntries(M.predictions.map(l=>[l,subset.filter(x=>(reference?x.record.annotation.label:x.result.label)===l).length]));
     for(const source of ["Environmental bulletin","Business bulletin"]){
       const subset=rows.filter(x=>x.record.metadata.source===source), c=counts(subset),ref=counts(subset,true);
       p.append(node("h4",`${source} (n=${subset.length})`));
       if(!subset.length){para(p,"No documents under these filters.");continue;}
       const bar=node("div",undefined,"w7-bars");bar.setAttribute("aria-hidden","true");M.predictions.forEach(l=>{if(c[l]){const span=node("span",undefined,l);span.style.flex=String(c[l]);bar.append(span);}});p.append(bar);
       table(p,["Label","Predicted count","Predicted %","Reference count"],M.predictions.map(l=>[l,c[l],pct(c[l]/subset.length),ref[l]]));
       const tokens=subset.reduce((s,x)=>s+x.result.tokens,0),matches=subset.reduce((s,x)=>s+x.result.matches,0);
       para(p,`Mean raw score ${fmt(subset.reduce((s,x)=>s+x.result.net,0)/subset.length)} · pooled token coverage ${pct(tokens?matches/tokens:null)}`);
     }
     const matrix=M.matrixFrom(rows.map(x=>({actual:x.record.annotation.label,predicted:x.result.label})));p.append(node("h4","Reference versus prediction"));table(p,["Reference ↓",...M.predictions],matrix.map((row,i)=>[M.reference[i],...row]));showMetrics(p,matrix);
     p.append(node("h4","Inspect individual documents"));for(const {record,result} of rows){const details=node("details"),s=node("summary",`${record.id} · ${record.annotation.label} → ${result.label}`);details.append(s);para(details,record.text);para(details,`${record.metadata.source} · ${record.metadata.year} · ${record.metadata.genre} · target: ${record.annotation.target}`);para(details,record.annotation.note);report(details,result);p.append(details);}
     exportData={source:corpus.metadata,method_version:"week07-v1",filter,method,options,lexicon:lex[filter.language],matrix,metrics:M.evaluate(matrix),records:rows.map(x=>({id:x.record.id,text:x.record.text,language:x.record.language,metadata:x.record.metadata,annotation:x.record.annotation,prediction:x.result.label,score:x.result.net,coverage:x.result.coverage,token_count:x.result.tokens,matched_count:x.result.matches}))};$("corp-download").disabled=false;
   });}
   on(["corp-lang","corp-source","corp-year","corp-genre","corp-method","corp-threshold"],dashboard);
   $("corp-download").addEventListener("click",()=>{if(!exportData)return;const url=URL.createObjectURL(new Blob([JSON.stringify(exportData,null,2)+"\n"],{type:"application/json"})),a=node("a");a.href=url;a.download="week07-sentiment-results.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
   $("data-status").textContent=`Loaded ${records.length} synthetic documents and two instructional lexicons.`;dashboard();
 }).catch(e=>{for(const id of ["score-result","custom-result","ctx-result","multi-result","corp-result"])render(id,p=>para(p,`Local fixtures unavailable. Serve the site over HTTP. ${e.message}`));$("data-status").textContent="Unable to load local fixtures.";});
})(Week07Model, [["The new transport system is excellent.","positive","Explicit praise of the transport system."],["The council published its annual report.","neutral","Factual statement without explicit evaluation."],["Great, another two-hour delay.","negative","Likely irony; positive wording is not necessarily positive evaluation."],["The museum is beautiful, but admission is overpriced.","mixed","Different evaluations of the venue and price."],["The minister described the proposal as disastrous.","negative","Negative evaluation attributed to the minister, not necessarily endorsed by the author."]]);
