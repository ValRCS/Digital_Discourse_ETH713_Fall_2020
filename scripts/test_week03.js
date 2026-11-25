"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const M=require("../docs/assets/js/week03-text-model.js");
const dir=path.join(__dirname,"../docs/datasets/text-processing");
const data=JSON.parse(fs.readFileSync(path.join(dir,"synthetic_samples.json"),"utf8"));
function runTests(M,data,assert){
 const eq=(x,y)=>assert(JSON.stringify(x)===JSON.stringify(y),JSON.stringify(x)+" != "+JSON.stringify(y));
 eq(M.inspect("Rīga","NFC").codepoints,4);eq(M.inspect("Rīga","NFD").codepoints,5);eq(M.inspect("Rīga","NFC").bytes,5);eq(M.inspect("Rīga","NFD").bytes,6);eq(M.inspect("😀").bytes,4);
 eq(M.tokens(""),[]);eq(M.tokens("!? — 2026"),[]);eq(M.tokens("A, A!","space"),["a,","a!"]);eq(M.tokens("Ri\u0304ga RĪGA"),["rīga","rīga"]);eq(M.tokens("“Alice’s” well-known — dzīvē, 2026"),["alice’s","well-known","dzīvē"]);eq(M.tokens("A 23","numbers"),["a","23"]);eq(M.tokens("A a","words",false),["A","a"]);eq(M.tokens("Straße"),["straße"]);
 eq(M.frequencies(["b","a","b","a","c"]),[["b",2],["a",2],["c",1]]);eq(M.stepCount(["a","a"],2),{pairs:[["a",2]],word:"a",before:1,after:2});eq(M.stepCount([],0).after,null);eq(M.rate(0,0),null);eq(M.rate(20,1000),20);eq(M.rate(50,5000),10);eq(M.diversity([]),null);eq(M.diversity(["a","a"]),0.5);assert(!M.validCounts(5,6)&&!M.validCounts(2.2,1)&&M.validCounts(0,0),"count validation");
 const r=M.analyse("The texts, texts! es",{minLength:3,stopwords:"the"});eq(r.raw.length,4);eq(r.retained,["texts","texts"]);eq(r.rows,[["texts",2]]);eq(r.allRows.reduce((n,x)=>n+x[1],0),4);eq(M.tsv(r.rows,4),"word\tcount\tper_1000_original_tokens\ntexts\t2\t500.000000\n");
 for(const record of data.records){const clean=M.prepare(record,[]),raw=M.prepare(record,["header","title","footer"]);assert(M.tokens(raw).length>M.tokens(clean).length,"metadata changes counts");eq(M.tokens(clean),M.tokens(M.prepare(record,[],true)));eq(M.frequencies(M.tokens(clean)).reduce((n,x)=>n+x[1],0),M.tokens(clean).length);}
 assert(M.tokens(M.prepare(data.records[0],["header","footer"])).includes("gutenberg"),"Gutenberg metadata");assert(!M.tokens(M.prepare(data.records[0],[])).includes("gutenberg"),"Gutenberg not body");eq(M.tokens(M.prepare(data.records[1],["title"])).filter(w=>w==="ideāliem").length,2);
}
runTests(M,data,(ok,msg)=>assert.ok(ok,msg));
for(const r of data.records)assert.equal(fs.readFileSync(path.join(dir,r.id+"_excerpt.txt"),"utf8"),M.prepare(r,[])+"\n");
console.log("Week 03 model and fixture checks passed");
