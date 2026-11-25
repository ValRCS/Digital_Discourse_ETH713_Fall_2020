"use strict";
function tokens(text,lower=true,keep=false){return (String(text).normalize("NFC").match(keep?/[\p{L}\p{M}\p{N}]+|[^\s\p{L}\p{M}\p{N}]/gu:/[\p{L}\p{M}\p{N}]+/gu)||[]).map(t=>lower?t.toLowerCase():t);}
function frequencies(ts){const m=new Map();for(const t of ts)m.set(t,(m.get(t)||0)+1);return [...m].sort((a,b)=>b[1]-a[1]||(a[0]<b[0]?-1:a[0]>b[0]?1:0));}
function selectDocs(ds,lang,year="all",genre="all",source="all"){return ds.filter(d=>d.language===lang&&(year==="all"||String(d.metadata.year)===year)&&(genre==="all"||d.metadata.genre===genre)&&(source==="all"||d.metadata.source===source));}
function norm(count,total,base=1000){return total>0?count/total*base:null;}
function kwic(ds,query,window=4,sensitive=false){const q=tokens(query,!sensitive);if(q.length!==1)return [];return ds.flatMap(d=>{const t=tokens(d.text,false);return t.flatMap((w,i)=>(sensitive?w:w.toLowerCase())===q[0]?[{doc:d,left:t.slice(Math.max(0,i-window),i),word:w,right:t.slice(i+1,i+1+window)}]:[]);});}
function ngrams(ds,n,sentence=false){return frequencies(ds.flatMap(d=>(sentence?d.text.split(/[.!?]+/u):[d.text]).flatMap(s=>{const t=tokens(s);return Array.from({length:Math.max(0,t.length-n+1)},(_,i)=>t.slice(i,i+n).join(" "));})));}
function neighbours(ds,query,window=3){const q=tokens(query);if(q.length!==1)return [];return frequencies(ds.flatMap(d=>{const t=tokens(d.text);return t.flatMap((w,i)=>w===q[0]?[...t.slice(Math.max(0,i-window),i),...t.slice(i+1,i+1+window)]:[]);}));}
function compare(ds,words,base=1000){const sources=["Environmental bulletin","Business bulletin"];const ts=sources.map(s=>ds.filter(d=>d.metadata.source===s).flatMap(d=>tokens(d.text)));const maps=ts.map(t=>new Map(frequencies(t)));return {totals:ts.map(t=>t.length),rows:words.map(w=>({word:w,counts:maps.map(m=>m.get(w)||0),rates:maps.map((m,i)=>norm(m.get(w)||0,ts[i].length,base))}))};}
const Week06={tokens,frequencies,selectDocs,norm,kwic,ngrams,neighbours,compare};
if(typeof module!=="undefined"&&module.exports)module.exports=Week06;
