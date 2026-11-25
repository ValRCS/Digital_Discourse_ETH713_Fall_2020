"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const M = require("../docs/assets/js/week07-sentiment-model.js");
const root = path.join(__dirname,"../docs/datasets/sentiment-analysis");
const load = name => JSON.parse(fs.readFileSync(path.join(root,name),"utf8"));
const corpus=load("sample_sentiment_corpus.json");
const lex={en:load("lexicon_en.json").weights,lv:load("lexicon_lv.json").weights};
const expected=load("expected_results.json");
assert.equal(corpus.records.length,48);
assert.equal(new Set(corpus.records.map(r=>r.id)).size,48);
for(const language of ["en","lv"]) for(const label of M.reference) {
 const subset=corpus.records.filter(r=>r.language===language&&r.annotation.label===label);
 assert.equal(subset.length,6);
 for(const source of ["Environmental bulletin","Business bulletin"]) assert.equal(subset.filter(r=>r.metadata.source===source).length,3);
}
for(const c of expected.cases){const r=M.score(c.text,lex[c.lang],{...c.options,lang:c.lang});assert.equal(r.net,c.net,c.text);assert.equal(r.label,c.label,c.text);}
assert.deepEqual(M.tokenize("Ri\u0304ga — 2026"),["rīga","2026"]);
assert.equal(M.score("",lex.en).coverage,null);
assert.equal(M.score("unknown",lex.en).perMatch,null);
assert.equal(M.score("constructor",lex.en).matches,0);
assert.equal(M.score("but",M.parseLexicon("but = 2")).net,2);
assert.equal(M.parseLexicon("constructor = 2").constructor,2);
assert.throws(()=>M.parseLexicon("good=2\ngood=3"));
assert.throws(()=>M.parseLexicon("a b = 2"));
assert.throws(()=>M.parseLexicon("good = 99"));
assert.throws(()=>M.score("good",lex.en,{threshold:-1}));
assert.equal(M.filterRecords(corpus.records,{language:"en",source:"Business bulletin"}).length,12);
assert.equal(M.filterRecords(corpus.records,{year:"1900"}).length,0);
const empty=M.evaluate(M.matrixFrom([]));assert.equal(empty.accuracy,null);assert.equal(empty.macroF1,null);
const ex=M.evaluate(M.matrixFrom([{actual:"positive",predicted:"positive"},{actual:"neutral",predicted:"unclear"},{actual:"negative",predicted:"positive"},{actual:"mixed",predicted:"mixed"}]));
assert.equal(ex.accuracy,0.5);assert.equal(ex.abstentions,1);
assert.throws(()=>M.matrixFrom([{actual:"unclear",predicted:"positive"}]));
assert.throws(()=>M.evaluate([[1]]));
for(const lang of ["en","lv"])for(const method of ["baseline","rules"]){
 const opts=method==="rules"?{negation:true,intensity:true,contrast:true,punctuation:true,threshold:0}:{};
 const rows=M.analyze(M.filterRecords(corpus.records,{language:lang}),lex[lang],opts);
 const matrix=M.matrixFrom(rows.map(x=>({actual:x.record.annotation.label,predicted:x.result.label})));
 assert.deepEqual({matrix,metrics:M.evaluate(matrix)},expected.corpusResults[lang+"-"+method]);
}
const page=fs.readFileSync(path.join(__dirname,"../docs/lessons/07-sentiment-analysis/index.html"),"utf8");
const ui=fs.readFileSync(path.join(__dirname,"../docs/assets/js/week07-sentiment-analysis.js"),"utf8");
const ids=new Set([...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
for(const match of ui.matchAll(/\$\("([^"]+)"\)/g))assert(ids.has(match[1]),"Missing UI ID "+match[1]);
assert.equal([...page.matchAll(/data-quiz /g)].length,12);
assert(!/\.innerHTML\s*=/.test(ui),"Use textContent, not HTML injection");
console.log("Week 07 model, fixtures, metrics, and static UI bindings passed.");
