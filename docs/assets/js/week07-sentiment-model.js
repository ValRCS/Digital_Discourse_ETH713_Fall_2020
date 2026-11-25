"use strict";
// Transparent teaching model, not VADER or a trained classifier.
const Week07Model = (function makeModel(){
 const reference=["positive","neutral","negative","mixed"], predictions=[...reference,"unclear"];
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 function tokenize(text){return (String(text).normalize("NFC").toLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu)||[])}
 function parseLexicon(text){const weights=Object.create(null);for(const [i,line] of String(text).split(/\r?\n/).entries()){if(!line.trim())continue;const match=line.trim().match(/^(.+?)\s*=\s*([+-]?\d+(?:\.\d+)?)$/);if(!match)throw Error(`Line ${i+1}: expected word = number`);const word=match[1].normalize("NFC").toLowerCase();const w=Number(match[2]);if(tokenize(word).length!==1||tokenize(word)[0]!==word||!Number.isFinite(w)||Math.abs(w)>10||own(weights,word))throw Error(`Line ${i+1}: use a unique single token and weight from -10 to 10`);weights[word]=w;}return weights;}
 const rules={
 en:{neg:["not","never","no"],boost:{very:1.5,extremely:2,somewhat:0.5,slightly:0.5},contrast:["but","although","however"]},
 lv:{neg:["nav","ne","nekad"],boost:{ļoti:1.5,ārkārtīgi:2,nedaudz:0.5,mazliet:0.5},contrast:["bet","tomēr"]}
 };
 function score(text,weights,options={}){
   const {lang="en",negation=false,intensity=false,contrast=false,punctuation=false,threshold=0}=options;
   if(!Number.isFinite(threshold)||threshold<0)throw Error("Threshold must be nonnegative and finite");
   const r=rules[lang]||rules.en, details=[];
   let tokens=0,pos=0,neg=0,matches=0;
   // Hard clause boundaries: punctuation . ! ? ; : , or explicit contrast word.
   const chunks=String(text).normalize("NFC").toLowerCase().match(/[^.!?;:,]+[.!?;:,]*/gu)||[];
   for(const chunk of chunks){
    const ts=tokenize(chunk);
    let recent=[],afterContrast=false;
    const emphasis=punctuation&&/!/.test(chunk)?1.25:1;
    for(const word of ts){
      tokens++;
      if(r.contrast.includes(word)){recent=[];afterContrast=true;}
      const matched=own(weights,word), base=matched?weights[word]:0;
      let value=base, applied=[];
      if(matched){
        matches++;
        if(negation&&recent.slice(-3).filter(t=>r.neg.includes(t)).length%2===1){value*=-1;applied.push("negation ×−1");}
        if(intensity&&recent.length&&own(r.boost,recent[recent.length-1])){const f=r.boost[recent[recent.length-1]];value*=f;applied.push(`modifier ×${f}`);}
        if(contrast&&afterContrast){value*=1.5;applied.push("contrast ×1.5");}
        if(emphasis!==1){value*=emphasis;applied.push("exclamation ×1.25");}
      }
      if(value>0)pos+=value;else if(value<0)neg+=value;
      details.push({word,base,value,matched,rules:applied});recent.push(word);if(recent.length>3)recent.shift();
    }
   }
   const net=pos+neg;
   let label=matches===0?"unclear":Math.abs(net)<=threshold?(pos>0&&neg<0?"mixed":"neutral"):net>0?"positive":"negative";
   return {tokens,matches,pos,neg,net,label,coverage:tokens?matches/tokens:null,perToken:tokens?net/tokens:null,perMatch:matches?net/matches:null,details};
 }
 function filterRecords(records,filter){return records.filter(r=>["language","source","year","genre"].every(k=>!filter[k]||filter[k]==="all"||String(k==="language"?r.language:r.metadata[k])===String(filter[k])))}
 function matrixFrom(pairs){const matrix=reference.map(()=>predictions.map(()=>0));for(const p of pairs){const a=reference.indexOf(p.actual),b=predictions.indexOf(p.predicted);if(a<0||b<0)throw Error("Unknown class");matrix[a][b]++;}return matrix;}
 function evaluate(matrix){
   if(matrix.length!==4||matrix.some(row=>row.length!==5||row.some(v=>!Number.isSafeInteger(v)||v<0)))throw Error("Expected a nonnegative integer 4×5 matrix");
   const total=matrix.flat().reduce((a,b)=>a+b,0),correct=reference.reduce((a,_,i)=>a+matrix[i][i],0);
   const perClass=reference.map((label,i)=>{const tp=matrix[i][i],actual=matrix[i].reduce((a,b)=>a+b,0),predicted=matrix.reduce((a,row)=>a+row[i],0),p=predicted?tp/predicted:0,r=actual?tp/actual:0;return {label,support:actual,precision:p,recall:r,f1:p+r?2*p*r/(p+r):0};});
   return {total,correct,accuracy:total?correct/total:null,macroF1:total?perClass.reduce((a,x)=>a+x.f1,0)/4:null,abstentions:matrix.reduce((a,row)=>a+row[4],0),perClass};
 }
 function analyze(records,weights,opts){return records.map(record=>({record,result:score(record.text,weights,{...opts,lang:record.language})}));}
 return {reference,predictions,tokenize,parseLexicon,score,filterRecords,matrixFrom,evaluate,analyze};
})();
if (typeof module !== "undefined" && module.exports) module.exports = Week07Model;
