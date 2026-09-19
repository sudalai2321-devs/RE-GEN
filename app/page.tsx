import Link from 'next/link';
import { ArrowRight, Database, FileSearch, FlaskConical, GitBranch, ShieldCheck, Sparkles, Target } from 'lucide-react';

export default function Home(){
 return <main className="content">
   <section className="hero">
     <div className="hero-grid"/>
     <div className="hero-content">
       <div className="eyebrow">Open innovation intelligence platform</div>
       <h1>From failed ideas<br/><span>to new possibilities.</span></h1>
       <p>Innovation DNA turns documented innovation attempts into structured capabilities, evidence-linked gaps, cross-domain opportunities, and testable validation experiments.</p>
       <div className="hero-actions">
         <Link href="/analyze" className="btn primary"><Sparkles size={14}/> Analyze a Failed Innovation <ArrowRight size={14}/></Link>
         <Link href="/opportunities" className="btn"><LightbulbIcon/> Explore Opportunities</Link>
         <Link href="/how-it-works" className="btn subtle">How It Works</Link>
       </div>
     </div>
   </section>

   <div className="mt-6 grid grid-4">
     {[['Collect','Gather documented projects, reports and evidence.',Database],['Decode','Extract the innovation’s DNA.',GitBranch],['Discover','Match capabilities to real problems.',Target],['Validate','Generate a measurable experiment.',FlaskConical]].map(([title,desc,Icon],i)=>{const C=Icon as React.ElementType;return <div className="card card-pad" key={title as string}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span className="status green">Step 0{i+1}</span><C size={16} color="#c8ff54"/></div><div style={{fontWeight:700,fontSize:13,marginTop:12}}>{title}</div><div style={{color:'#737d88',fontSize:11,lineHeight:1.6,marginTop:6}}>{desc}</div></div>})}
   </div>

   <section className="mt-6 split-hero">
     <div className="card card-pad">
       <div className="section-head"><div><div className="section-title">Innovation intelligence, not idea generation</div><div className="section-note">The core product distinction</div></div></div>
       <div className="grid grid-2">
         <div className="callout"><strong>Idea generator</strong><br/>Starts with an empty page and proposes possibilities without necessarily grounding the starting assumptions in evidence.</div>
         <div className="callout" style={{borderLeftColor:'#79c8ff', background:'#0d1217'}}><strong>Innovation intelligence</strong><br/>Starts from documented attempts, decodes what they can do, exposes limitations, and traces every material claim back to sources.</div>
       </div>
     </div>
     <div className="card card-pad">
       <div className="section-head"><div><div className="section-title">Trust layer</div><div className="section-note">Facts stay separate from AI analysis</div></div><ShieldCheck size={17} color="#c8ff54"/></div>
       <div className="space-y">
         {['Source-established fact','AI interpretation','AI-derived hypothesis','Verified evidence','Unknown / conflicting'].map((x,i)=><div className="quick-link" key={x}><strong>{x}</strong><span>{['Source','Analysis','Hypothesis','Verification','Review'][i]}</span></div>)}
       </div>
     </div>
   </section>
   <div className="footer-note">Frontend prototype aligned to the supplied Innovation DNA build specification. Demo records are clearly marked and intended for UI demonstration.</div>
 </main>
}

function LightbulbIcon(){return <Sparkles size={14}/>}
