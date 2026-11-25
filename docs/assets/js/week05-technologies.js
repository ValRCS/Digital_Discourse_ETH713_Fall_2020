"use strict";
(()=>{
function textNodes(nodes,separator,strip){const v=strip?nodes.map(s=>s.trim()).filter(Boolean):nodes;return v.join(separator);}
function v2Main(){
 const $=id=>document.getElementById(id), on=(id,event,fn)=>$(id).addEventListener(event,fn), make=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
 const article=$("tech-preview").querySelector("article"),original=article.outerHTML,css='.tech-styled .tech-news {\n  background: #e3f1ed;\n  padding: 20px;\n  border-radius: 12px;\n  color: #193847;\n}',script='const article = document.querySelector("#tech-preview article");\nconst p = document.createElement("p");\np.textContent = "Digitālās kolekcijas ir pieejamas pētniekiem.";\narticle.append(p);';
 function tech(){const styled=$("tech-style").checked,updated=$("tech-update").checked; $("tech-preview").classList.toggle("tech-styled",styled);article.querySelector("[data-added]")?.remove();if(updated){const p=make("p","Digitālās kolekcijas ir pieejamas pētniekiem.");p.dataset.added="true";article.append(p);}const source={html:original,css,js:script,dom:article.outerHTML};$("tech-code").textContent=source[$("tech-view").value];$("tech-status").textContent=(styled?"CSS styling on. ":"CSS styling off. ")+(updated?"Current DOM contains an added paragraph; original source unchanged.":"Current DOM contains only original article content.");}
 ["tech-style","tech-update","tech-view"].forEach(id=>on(id,"change",tech));tech();
 const types=[
 ['html = \'<p class="intro">Rīga</p>\'','<p class="intro">Rīga</p>','str','An ordinary Python string containing markup.'],
 ['soup = BeautifulSoup(html, "html.parser")','<p class="intro">Rīga</p>','BeautifulSoup','A parsed document root; printing may resemble the input.'],
 ['paragraph = soup.find("p")','<p class="intro">Rīga</p>','Tag','An element object with attributes, parent and children.'],
 ['paragraph.string','Rīga','NavigableString','A string node attached to the tree; may be None if there are multiple children.'],
 ['paragraph.get_text()','Rīga','str','An ordinary Python string for text processing.'],
 ['soup.find_all("p")','[<p class="intro">Rīga</p>]','ResultSet','A list-like collection, empty if nothing matches.'],
 ['soup.select("p")','[<p class="intro">Rīga</p>]','ResultSet','CSS selector result collection in current Beautiful Soup.'],
 ['soup.find("h1")','None','NoneType','No matching element found. Check before calling a method.'],
 ['paragraph.attrs',"{'class': ['intro']}",'dict','Attribute names and values; class is represented as a list.'],
 ['record = {"text": paragraph.get_text()}',
 "{'text': 'Rīga'}",'dict','A research record we construct, independent of the parse tree.']];
 function type(){const [expr,value,name,note]=types[Number($("bs-type-choice").value)];$("bs-type-code").textContent=expr;$("bs-type-value").textContent=value;$("bs-type-name").textContent=name;$("bs-type-note").textContent=note;}on("bs-type-choice","change",type);type();
 const ws={words:{html:"<p> Digitālās<strong>humanitārās</strong>zinātnes </p>",nodes:[" Digitālās","humanitārās","zinātnes "]},inside:{html:"<p> biblio<em>tē</em>ka </p>",nodes:[" biblio","tē","ka "]}};
 function whitespace(){const x=ws[$("ws-example").value],sep={space:" ",empty:"",newline:"\n"}[$("ws-separator").value],strip=$("ws-strip").checked;$("ws-html").textContent=x.html;$("ws-python").textContent="tag.get_text("+JSON.stringify(sep)+", strip="+(strip?"True":"False")+")";$("ws-output").textContent=textNodes(x.nodes,sep,strip).replaceAll(" ","·");$("ws-note").textContent=$("ws-example").value==="inside"?"Separators inside a word can create false token boundaries.":"Without a separator, neighbouring text nodes can merge words."; }["ws-example","ws-separator","ws-strip"].forEach(id=>on(id,"change",whitespace));whitespace();
 const dynamic=$("dynamic-preview").querySelector(".dynamic-results"),initial=dynamic.outerHTML,data=[{title:"Digitālās kolekcijas",text:"Pētnieki analizē tekstus."},{title:"Rīgas arhīvs",text:"Dokumenti saglabā atmiņu."}];
 $("dynamic-source").textContent=initial;$("dynamic-json").textContent="(not loaded)";
 function load(){dynamic.replaceChildren();for(const r of data){const a=make("article");a.append(make("h4",r.title),make("p",r.text));dynamic.append(a);}$("dynamic-json").textContent=JSON.stringify(data,null,2);updateDynamic();}
 function updateDynamic(){$("dynamic-dom").textContent=dynamic.outerHTML;$("dynamic-status").textContent="Original shell: 0 articles · Current DOM: "+dynamic.querySelectorAll("article").length+" articles.";}
 on("dynamic-load","click",load);on("dynamic-reset","click",()=>{dynamic.replaceChildren();$("dynamic-json").textContent="(not loaded)";updateDynamic();});updateDynamic();
 async function nestedLabs(){try{const r=await fetch("../../datasets/web-scraping/sample_nested_articles.html.txt");if(!r.ok)throw Error("HTTP "+r.status);const source=await r.text(),parse=()=>new DOMParser().parseFromString(source,"text/html"),doc=parse(),article=doc.querySelector("#article-123");
 function comb(){const selector=$("comb-choice").value,matched=new Set(doc.querySelectorAll(selector));$("comb-status").textContent=matched.size+" matching paragraph(s).";const out=$("comb-tree");out.replaceChildren();function walk(e,depth){const line=make("div",(matched.has(e)?"✓ ":"")+"<"+e.tagName.toLowerCase()+">"+(e.children.length?"":" "+e.textContent.trim()));line.className="node-line"+(matched.has(e)?" matched":"");line.style.setProperty("--depth",depth);out.append(line);for(const c of e.children)walk(c,depth+1);}walk(article,0);}
 function redesign(){const d=parse(),a=d.querySelector("#article-123");if($("redesign-wrapper").checked){for(const p of [...a.querySelectorAll(":scope > p")]){const wrapper=d.createElement("div");wrapper.className="new-wrapper";p.replaceWith(wrapper);wrapper.append(p);}}const narrow="#article-123 > p",broad="#article-123 p";$("redesign-counts").textContent=narrow+": "+d.querySelectorAll(narrow).length+" matches · "+broad+": "+d.querySelectorAll(broad).length+" matches.";$("redesign-html").textContent=a.outerHTML;}
 on("comb-choice","change",comb);on("redesign-wrapper","change",redesign);comb();redesign();}catch(e){$("comb-status").textContent="Nested fixture unavailable: "+e.message;$("redesign-counts").textContent="Nested fixture unavailable.";}}
 nestedLabs();
}
if(typeof module!=='undefined'&&module.exports)module.exports={textNodes};else v2Main();
})();
