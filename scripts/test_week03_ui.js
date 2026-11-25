"use strict";
const assert=require("node:assert/strict");
const M=require("../docs/assets/js/week03-text-model.js");
const mount=require("../docs/assets/js/week03-text-processing.js");
const data=require("../docs/datasets/text-processing/synthetic_samples.json");
function mockUI(mount,M,data,assert){
 const values={"w3-unicode":"Rīga","w3-form":"NFC","w3-token-text":"Alice Alice","w3-token-mode":"words","w3-step-text":"digital text digital","w3-step-range":"0","w3-freq-text":"The archive archive","w3-freq-mode":"words","w3-min":"1","w3-top":"10","w3-stop":"none","w3-custom-stop":"","w3-na":"1000","w3-nb":"5000","w3-fa":"20","w3-fb":"50","w3-boundary-source":"alice","w3-sample":"custom"};
 const checked=new Set(["w3-token-lower","w3-token-nfc","w3-freq-lower","w3-freq-nfc"]);
 class Elem{constructor(id=""){this.value=values[id]??"";this.checked=checked.has(id);this.style={};this.handlers={};this.children=[];this.textContent="";}append(...ns){this.children.push(...ns);}replaceChildren(...ns){this.children=ns;}setAttribute(){}addEventListener(e,fn){this.handlers[e]=fn;}focus(){}fire(e){this.handlers[e]();}get text(){return this.textContent+" "+this.children.map(n=>n.text).join(" ");}}
 const ids=new Map(),doc={getElementById:id=>{if(!ids.has(id))ids.set(id,new Elem(id));return ids.get(id);},createElement:()=>new Elem()};
 const $=id=>doc.getElementById(id),downloads=[];
 return mount(M,doc,()=>Promise.resolve(data),(...args)=>downloads.push(args)).then(()=>{
 assert($("w3-unicode-out").text.includes("4 Unicode code points"),"unicode DOM");
 assert($("w3-token-out").text.includes("2 tokens · 1 types"),"token DOM");
 $("w3-step-next").fire("click");assert($("w3-step-out").text.includes("Processed 1 of 3"),"step next");
 $("w3-step-prev").fire("click");assert($("w3-step-out").text.includes("Processed 0 of 3"),"step back");
 assert($("w3-boundary-out").text.includes("Excluded — Selected front matter"),"boundary initial");
 $("w3-include-header").checked=true;$("w3-include-header").fire("input");assert($("w3-boundary-out").text.includes("Included — Selected front matter"),"boundary toggle");
 $("w3-use-selection").fire("click");assert($("w3-freq-text").value.includes("Project Gutenberg"),"transfer");
 $("w3-sample").value="veidenbaums";$("w3-sample").fire("input");assert($("w3-freq-text").value.includes("Pēc ideāliem"),"sample change");
 $("w3-export-all").fire("click");$("w3-export-filtered").fire("click");$("w3-export-settings").fire("click");assert(downloads.length===3&&downloads[0][1].includes("ideāliem")&&JSON.parse(downloads[2][1]).input.includes("Pēc"),"download data");
 $("w3-freq-text").value="";$("w3-freq-text").fire("input");assert($("w3-freq-out").text.includes("No results"),"empty input");
 assert($("w3-relative-out").text.includes("ranking reverses"),"normalized rank reversal");
 $("w3-na").value="0";$("w3-fa").value="0";$("w3-fa").fire("input");assert($("w3-relative-out").text.includes("undefined"),"zero denominator");
 $("w3-fa").value="1";$("w3-fa").fire("input");assert($("w3-relative-out").text.includes("must not exceed"),"invalid denominator");
 });
}
mockUI(mount,M,data,(ok,msg)=>assert.ok(ok,msg)).then(()=>console.log("Week 03 simulated DOM checks passed")).catch(err=>{console.error(err);process.exitCode=1;});
