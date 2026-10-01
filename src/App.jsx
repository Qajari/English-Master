import React, {useEffect, useMemo, useState} from "react";
import {lessons, vocabulary, grammar, readings, listening} from "./data";
import {loadProgress, saveProgress, resetProgress} from "./storage";

const nav = [
  ["home","⌂","Home"],["lessons","▣","Lessons"],["words","Aa","Words"],
  ["grammar","✓","Grammar"],["reading","◫","Reading"],["listening","◉","Listening"],
  ["speaking","◌","Speaking"],["writing","✎","Writing"]
];

function App(){
  const [page,setPage]=useState("home");
  const [p,setP]=useState(loadProgress);
  useEffect(()=>saveProgress(p),[p]);

  const addXP=(n)=>setP(x=>({...x,xp:x.xp+n}));
  const completeLesson=(id)=>{
    setP(x=>x.completedLessons.includes(id)?x:{...x,completedLessons:[...x.completedLessons,id],xp:x.xp+30});
  };
  const markWord=(word)=>{
    setP(x=>x.learnedWords.includes(word)?x:{...x,learnedWords:[...x.learnedWords,word],xp:x.xp+5});
  };
  const levelProgress=Math.min(100, Math.round((p.xp%500)/5));

  return <div className="app">
    <header className="topbar">
      <button className="brand" onClick={()=>setPage("home")}><span className="brandMark">✦</span><span>ENGLISH MASTER</span></button>
      <div className="topStats"><span>🔥 {p.streak}</span><span>⚡ {p.xp} XP</span><span className="levelPill">{p.level}</span></div>
    </header>
    <main className="content">
      {page==="home" && <Home p={p} setPage={setPage} progress={levelProgress}/>}
      {page==="lessons" && <Lessons p={p} setPage={setPage} completeLesson={completeLesson}/>}
      {page==="words" && <Words p={p} markWord={markWord}/>}
      {page==="grammar" && <Grammar p={p} setP={setP} addXP={addXP}/>}
      {page==="reading" && <Reading p={p} setP={setP}/>}
      {page==="listening" && <Listening p={p} setP={setP}/>}
      {page==="speaking" && <Speaking p={p} setP={setP}/>}
      {page==="writing" && <Writing p={p} setP={setP}/>}
    </main>
    <nav className="bottomNav">{nav.slice(0,5).map(([id,icon,label])=><button key={id} className={page===id?"active":""} onClick={()=>setPage(id)}><b>{icon}</b><small>{label}</small></button>)}</nav>
    <button className="moreBtn" onClick={()=>setPage("lessons")}>☰</button>
  </div>
}

function Home({p,setPage,progress}){
 return <section>
   <div className="hero card">
    <div><span className="eyebrow">YOUR ENGLISH JOURNEY</span><h1>Build English<br/><em>for real life.</em></h1><p>Train vocabulary, grammar, reading, listening, speaking and writing in one structured path.</p></div>
    <div className="levelCircle"><strong>{p.level}</strong><span>{progress}%</span></div>
   </div>
   <div className="grid2">
    <button className="actionCard" onClick={()=>setPage("lessons")}><span>▶</span><div><b>Continue learning</b><small>Pick up where you left off</small></div><i>→</i></button>
    <button className="actionCard" onClick={()=>setPage("words")}><span>✦</span><div><b>Review words</b><small>{p.learnedWords.length} words learned</small></div><i>→</i></button>
   </div>
   <h2>Skills</h2>
   <div className="skillGrid">
    {[
      ["📚","Vocabulary","words"],["✓","Grammar","grammar"],["◫","Reading","reading"],
      ["◉","Listening","listening"],["◌","Speaking","speaking"],["✎","Writing","writing"]
    ].map(x=><button key={x[2]} className="skill" onClick={()=>setPage(x[2])}><span>{x[0]}</span><b>{x[1]}</b><i>→</i></button>)}
   </div>
 </section>
}

function Lessons({p,setPage,completeLesson}){
 return <section><PageTitle title="Lessons" sub="Follow the path from A1 to C2."/>
 <div className="lessonList">{lessons.map(l=>{
  const done=p.completedLessons.includes(l.id);
  return <article className={"lesson card "+(done?"done":"")} key={l.id}>
   <div className="lessonNum">{String(l.id).padStart(2,"0")}</div>
   <div className="lessonBody"><span className="tag">{l.level}</span><h3>{l.title}</h3><p>{l.desc}</p><small>Grammar: {l.grammar}</small></div>
   <button onClick={()=>{completeLesson(l.id);setPage("words")}}>{done?"✓ Done":"Start"}</button>
  </article>
 })}</div></section>
}

function Words({p,markWord}){
 const [q,setQ]=useState(""); const [level,setLevel]=useState("ALL");
 const list=useMemo(()=>vocabulary.filter(v=>(level==="ALL"||v[3]===level)&&v.slice(0,3).join(" ").toLowerCase().includes(q.toLowerCase())),[q,level]);
 return <section><PageTitle title="Vocabulary" sub="Learn words in context, not in isolation."/>
 <div className="filters"><input placeholder="Search a word..." value={q} onChange={e=>setQ(e.target.value)}/><select value={level} onChange={e=>setLevel(e.target.value)}><option>ALL</option>{["A1","A2","B1","B2","C1","C2"].map(x=><option key={x}>{x}</option>)}</select></div>
 <div className="wordList">{list.map(v=><article className="word card" key={v[0]}><div><span className="tag">{v[3]}</span><h3>{v[0]}</h3><p>{v[1]}</p><blockquote>{v[2]}</blockquote></div><button className={p.learnedWords.includes(v[0])?"learned":""} onClick={()=>markWord(v[0])}>{p.learnedWords.includes(v[0])?"✓":"Learn"}</button></article>)}</div>
 </section>
}

function Grammar({p,setP,addXP}){
 const [i,setI]=useState(0),[choice,setChoice]=useState(null); const g=grammar[i];
 const answer=choice===g.answer;
 return <section><PageTitle title="Grammar" sub="Understand the rule, then use it."/>
 <article className="card lessonCard"><span className="tag">{g.level}</span><h2>{g.title}</h2><p>{g.rule}</p><div className="example">{g.example}</div><h3>Quick check</h3><p>{g.question}</p><div className="options">{g.options.map(o=><button className={choice===o?(o===g.answer?"correct":"wrong"):""} onClick={()=>{if(choice===null){setChoice(o);if(o===g.answer){addXP(15);setP(x=>({...x,grammarScore:x.grammarScore+1}))}}}} key={o}>{o}</button>)}</div>{choice&&<div className={answer?"feedback good":"feedback bad"}>{answer?"Correct! +15 XP":"Not quite. Review the rule and try the next one."}</div>}<button className="primary" onClick={()=>{setI((i+1)%grammar.length);setChoice(null)}}>Next lesson →</button></article>
 </section>
}

function Reading({p,setP}){
 const [i,setI]=useState(0),[choice,setChoice]=useState(null); const r=readings[i]; const ok=choice===r.answer;
 return <section><PageTitle title="Reading" sub="Read for meaning, structure and vocabulary."/><article className="card reading"><span className="tag">{r.level}</span><h2>{r.title}</h2><p className="readingText">{r.text}</p><hr/><h3>{r.question}</h3><div className="options">{r.options.map(o=><button className={choice===o?(o===r.answer?"correct":"wrong"):""} onClick={()=>{if(choice===null){setChoice(o);if(o===r.answer)setP(x=>({...x,readingScore:x.readingScore+1,xp:x.xp+20}))}}} key={o}>{o}</button>)}</div>{choice&&<div className={ok?"feedback good":"feedback bad"}>{ok?"Excellent reading. +20 XP":"Review the paragraph and look for the main idea."}</div>}<button className="primary" onClick={()=>{setI((i+1)%readings.length);setChoice(null)}}>Next text →</button></article></section>
}

function Listening({p,setP}){
 const [i,setI]=useState(0),[choice,setChoice]=useState(null); const l=listening[i]; const ok=choice===l.answer;
 const speak=()=>{if("speechSynthesis" in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(l.text);u.lang="en-US";u.rate=0.82;speechSynthesis.speak(u)}};
 return <section><PageTitle title="Listening" sub="Listen, understand, answer."/><article className="card lessonCard"><span className="tag">{l.level}</span><h2>{l.title}</h2><button className="listenBtn" onClick={speak}>▶ Play audio</button><p className="hint">Listen twice. First for the general meaning, then for details.</p><h3>{l.question}</h3><div className="options">{l.options.map(o=><button className={choice===o?(o===l.answer?"correct":"wrong"):""} onClick={()=>{if(choice===null){setChoice(o);if(o===l.answer)setP(x=>({...x,listeningScore:x.listeningScore+1,xp:x.xp+20}))}}} key={o}>{o}</button>)}</div>{choice&&<div className={ok?"feedback good":"feedback bad"}>{ok?"Great listening. +20 XP":"Listen again and focus on the key detail."}</div>}<button className="primary" onClick={()=>{setI((i+1)%listening.length);setChoice(null)}}>Next audio →</button></article></section>
}

function Speaking({p,setP}){
 const [recording,setRecording]=useState(false),[result,setResult]=useState("");
 const start=()=>{
   const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
   if(!SR){setResult("Speech recognition is not available in this browser. Try Safari on iPhone or Chrome with speech recognition support.");return}
   const r=new SR(); r.lang="en-US"; r.interimResults=false;
   r.onstart=()=>setRecording(true); r.onend=()=>setRecording(false);
   r.onresult=e=>{setResult(e.results[0][0].transcript);setP(x=>({...x,speakingSessions:x.speakingSessions+1,xp:x.xp+15}))};
   r.onerror=()=>{setRecording(false);setResult("Could not capture speech. Check microphone permission.");}; r.start();
 };
 return <section><PageTitle title="Speaking" sub="Speak out loud and build fluency."/><article className="card speaking"><span className="tag">B1 → C2</span><h2>Speak for 60 seconds</h2><p>Describe a skill you would like to learn and explain why it matters to you.</p><div className="promptBox">“I would like to learn... because...”</div><button className={"record "+(recording?"recording":"")} onClick={start}>{recording?"● Listening...":"🎙 Start speaking"}</button>{result&&<div className="transcript"><b>Transcript</b><p>{result}</p></div>}<p className="hint">This offline-first version uses your browser's speech recognition when available. Later we can add a dedicated pronunciation engine.</p></article></section>
}

function Writing({p,setP}){
 const [text,setText]=useState(""); const words=text.trim()?text.trim().split(/\s+/).length:0;
 const checks=[["Length",words>=80,`${words}/80 words`],["Paragraphs",text.split(/\n\s*\n/).filter(Boolean).length>=2,"Use at least 2 paragraphs"],["Because/Although",/\b(because|although|however|therefore)\b/i.test(text),"Use a linking word"]];
 return <section><PageTitle title="Writing" sub="Write clearly, then review your own language."/><article className="card writing"><span className="tag">B1+</span><h2>Opinion paragraph</h2><p>Write at least 80 words: <b>Should people work from home when possible?</b></p><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write your answer here..."/><div className="writeStats"><span>{words} words</span><span>{text.length} characters</span></div><div className="checks">{checks.map(c=><div key={c[0]} className={c[1]?"check ok":"check"}><span>{c[1]?"✓":"○"}</span><b>{c[0]}</b><small>{c[2]}</small></div>)}</div><button className="primary" onClick={()=>setP(x=>({...x,writingSessions:x.writingSessions+1,xp:x.xp+10}))}>Save practice +10 XP</button></article></section>
}

function PageTitle({title,sub}){return <div className="pageTitle"><span className="eyebrow">ENGLISH MASTER</span><h1>{title}</h1><p>{sub}</p></div>}

export default App;