"use strict";
function inspect(text,form="original"){
 const s=form==="original"?String(text):String(text).normalize(form),chars=Array.from(s);
 return {text:s,codepoints:chars.length,bytes:chars.reduce((sum,c)=>{const n=c.codePointAt(0);return sum+(n<=127?1:n<=2047?2:n<=65535?3:4)},0),chars:chars.map(c=>[c,"U+"+c.codePointAt(0).toString(16).toUpperCase().padStart(4,"0")])};
}

function tokens(text,mode="words",lower=true,nfc=true){
 let s=String(text);if(nfc)s=s.normalize("NFC");if(lower)s=s.toLowerCase();
 if(mode==="space")return s.split(/\s+/u).filter(Boolean);
 if(mode==="numbers")return s.match(/[\p{L}\p{N}]+/gu)||[];
 return s.match(/\p{L}+(?:[’'-]\p{L}+)*/gu)||[];
}

function frequencies(ts){const m=new Map();for(const t of ts)m.set(t,(m.get(t)||0)+1);return [...m].sort((a,b)=>b[1]-a[1]);}

function rate(count,total){return total===0?null:count*1000/total;}

function diversity(ts){return ts.length===0?null:new Set(ts).size/ts.length;}

function prepare(record,include,removeBlank=false){
 const text=record.segments.filter(s=>s.kind==="body"||include.includes(s.kind)).map(s=>s.text).join("\n");
 return removeBlank?text.split(/\r?\n/).filter(s=>s.trim()).join("\n"):text;
}

function analyse(text,settings={}){
 const {mode="words",lower=true,nfc=true,minLength=1,stopwords=""}=settings;
 const raw=tokens(text,mode,lower,nfc),stop=new Set(tokens(stopwords,mode,lower,nfc));
 const retained=raw.filter(t=>Array.from(t).length>=minLength&&!stop.has(t));
 return {raw,retained,allRows:frequencies(raw),rows:frequencies(retained),ttr:diversity(raw)};
}

function tsv(rows,total){return "word\tcount\tper_1000_original_tokens\n"+rows.map(([w,n])=>[w,n,rate(n,total)?.toFixed(6)??""].join("\t")).join("\n")+(rows.length?"\n":"");}

function stepCount(ts,n){const seen=ts.slice(0,n),m=new Map();for(const w of seen)m.set(w,(m.get(w)||0)+1);const word=seen.at(-1),after=word===undefined?null:m.get(word);return {pairs:[...m],word:word??null,before:after===null?null:after-1,after};}

function validCounts(n,f){return Number.isSafeInteger(n)&&Number.isSafeInteger(f)&&n>=0&&f>=0&&f<=n;}
const Week03={inspect,tokens,frequencies,rate,diversity,prepare,analyse,tsv,stepCount,validCounts};
if(typeof module!=="undefined"&&module.exports)module.exports=Week03;
