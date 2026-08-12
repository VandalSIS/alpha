(function(){
"use strict";
/* ============================================================
   PROJECT ALPHA — Board Aspiration and Readiness Workbook
   Schema. Question wording is reproduced from the source
   document verbatim. Do not reword.
   t: field type. r: required. cap: max selections.
   lim: character limit. showIf: conditional rule.
   ============================================================ */
var PA_STEPS = [

/* ---------- STEP 1 — Participant and Aspiration Foundations ---------- */
{n:1, title:"Participant and aspiration foundations",
 intro:"Start with who you are and why board service matters now.",
 groups:[
 {h:"Participant", f:[
  {id:"p_name",  t:"text",  q:"Participant", r:1},
  {id:"p_title", t:"text",  q:"Current Role", r:1},
  {id:"p_org",   t:"text",  q:"Organization", r:1},
  {id:"p_date",  t:"date",  q:"Date", r:1}
 ]},
 {h:"Aspiration Foundations", f:[
  {id:"m_value", t:"long", q:"What would make this process valuable for you?", r:1, lim:2500},
  {id:"m_why",   t:"long", q:"Why are you considering board service at this stage of your career?", r:1, lim:2500},
  {id:"m_contr", t:"long", q:"What would you most like to contribute through board service?", r:1, lim:2500},
  {id:"m_learn", t:"long", q:"What would you most like to learn, experience, or develop?", r:1, lim:2500}
 ]}]},

/* ---------- STEP 2 — Journey, environments, industry & contribution ---------- */
{n:2, title:"Board journey, environments, and contribution",
 intro:"Where the next five years should lead, and the environments in which you can create value.",
 groups:[
 {h:"Five-Year Board Journey and Target Environments", f:[
  {id:"j_look", t:"multi", q:"What would a successful board journey look like over the next five years?", help:"Select all that apply:", r:1,
   o:["One meaningful board role","A portfolio of board roles","Committee leadership","Board chair or lead director","Mission-driven service","International board experience","Public company board","Advisory or interim board service"]},
  {id:"j_desc", t:"long", q:"Additional details on successful board journey (five years)", lim:2500},
  {id:"o_env",  t:"multi", q:"Which environments interest you most?", help:"Select all that apply:", r:1,
   o:["Public company","Private equity portfolio company","Venture-backed or growth company","Founder-led or family-owned company","Advisory board","Nonprofit or mission-driven organization","Government or public sector","Board-level turnaround or transformation"]},
  {id:"o_env_other", t:"text", q:"Other board environment (please specify)"},
  {id:"o_stage",t:"multi", q:"Which company stages are the strongest fit?", help:"Select all that apply:", r:1,
   o:["Early stage","Scale-up","Mid-market","Large enterprise","Pre-transaction","Post-transaction"]},
  {id:"o_two",  t:"long", q:"Which two board environments are the strongest fit for you, and why?", r:1, lim:2500}
 ]},
 {h:"Industry, Geography, and Board Contribution Scope", f:[
  {id:"i_cred", t:"long", q:"Which industries or adjacent sectors give you immediate credibility?", r:1, lim:2500},
  {id:"o_geo",  t:"long", q:"What geographic scope would you be comfortable supporting?", r:1, lim:1200},
  {id:"c_areas",t:"multi", q:"Select the areas that best reflect your experience (board contribution)", help:"Select all that apply:", r:1,
   o:["CEO and enterprise leadership","P&L and operational performance","Growth and commercialization","Strategy and transformation","Technology, AI, or cybersecurity","Finance and capital allocation","Mergers, acquisitions, and integration","Risk, governance, and compliance","People, culture, and talent","International expansion","Sustainability and ESG","Stakeholder and reputation management","Other"], other:1},
  {id:"c_core", t:"long", q:"Which two or three areas form the core of your board proposition?", r:1, lim:2500},
  {id:"t_enh",  t:"long", q:"What is the single greatest enhancement you could bring to a board?", r:1, lim:2500}
 ]}]},

/* ---------- STEP 3 — Capabilities, governance examples, director profile ---------- */
{n:3, title:"Capabilities and governance experience",
 intro:"Map your capability depth, then give two governance-relevant examples and your director profile.",
 groups:[
 {h:"Capability Matrices", f:[
  {id:"cap_ent", t:"multi", q:"Enterprise capability selections", help:"Select all that apply:",
   o:["Strategic planning","Corporate transformation","M&A and integration","Capital allocation","Risk management","Stakeholder management","Investor relations","Board leadership","Succession planning","Crisis management","ESG and sustainability","International expansion","Commercial strategy","Revenue growth","Go-to-market strategy","Business development","Customer retention","Pricing strategy","Partnerships and alliances","Market entry","Sector regulation","Public policy","Competitive intelligence","P&L ownership","Product commercialization","Other"], other:1},
  {id:"cap_com", t:"multi", q:"Commercial capability selections", help:"Select all that apply:",
   o:["Sales leadership","Enterprise sales","Key account management","Channel strategy","Marketing strategy","Brand management","Customer experience","Market research","Demand generation","Negotiation","Contracting","Commercial operations","Revenue operations","Partnership development","Pricing and packaging","Business planning","Go-to-market execution","Pipeline management","Sales enablement","Product positioning","Client advisory","Other"], other:1},
  {id:"cap_sec", t:"multi", q:"Sector capability selections", help:"Select all that apply:",
   o:["Financial services","Technology","Healthcare","Energy and utilities","Consumer and retail","Industrial and manufacturing","Telecommunications","Professional services","Media and entertainment","Education","Real estate","Transportation and logistics","Life sciences","Government and public sector","Nonprofit and social impact","Private equity and venture capital","SaaS and software","Cybersecurity","AI and data analytics","Sustainability and climate","Other"], other:1},
  {id:"cap_tech",t:"multi", q:"Technology capability selections", help:"Select all that apply:",
   o:["Digital transformation","Enterprise architecture","Data strategy","Artificial intelligence","Cybersecurity","Cloud platforms","Software product management","IT governance","Automation and process digitization","Technology risk management","Systems integration","Privacy and data protection","Emerging technologies","Technology due diligence","Architecture modernization","Other"], other:1},
  {id:"cap_ops", t:"multi", q:"Operations capability selections", help:"Select all that apply:",
   o:["Operational excellence","Supply chain management","Procurement","Manufacturing operations","Service delivery","Process improvement","Quality management","Program management","Change management","Workforce planning","Performance management","Budget management","Business continuity","Operational risk","Vendor management","Other"], other:1}
 ]},
 {h:"Governance-Relevant Experience Example 1", f:[
  {id:"g1_ctx",  t:"long", q:"Context or challenge", r:1, lim:2500},
  {id:"g1_resp", t:"long", q:"Your responsibility", r:1, lim:2500},
  {id:"g1_out",  t:"long", q:"Outcome achieved", r:1, lim:2500},
  {id:"g1_rel",  t:"long", q:"Board-level relevance", r:1, lim:2500}
 ]},
 {h:"Governance-Relevant Experience Example 2", f:[
  {id:"g2_ctx",  t:"long", q:"Context or challenge", lim:2500},
  {id:"g2_resp", t:"long", q:"Your responsibility", lim:2500},
  {id:"g2_out",  t:"long", q:"Outcome achieved", lim:2500},
  {id:"g2_rel",  t:"long", q:"Board-level relevance", lim:2500}
 ]},
 {h:"Director and Committee Profile Matching", f:[
  {id:"d_prof", t:"multi", q:"Which director profiles best match your experience?", help:"Select all that apply:", r:1,
   o:["Chair","Non-Executive Director","Independent Director","Executive Director","Lead Director","Other"], other:1},
  {id:"d_comm", t:"multi", q:"Which committees align most closely with your experience?", help:"Select all that apply:", r:1,
   o:["Audit","Risk","Nomination and Governance","Remuneration","Sustainability","Other"], other:1},
  {id:"d_now",  t:"long", q:"Where could you contribute immediately?", r:1, lim:2500},
  {id:"d_dev",  t:"long", q:"Where would you need further exposure or development?", lim:2500}
 ]}]},

/* ---------- STEP 4 — Ideal board profile and readiness ---------- */
{n:4, title:"Ideal board profile and readiness",
 intro:"Describe the board you are targeting and rate your current readiness.",
 groups:[
 {h:"Ideal Board Profile and Role Targets", f:[
  {id:"ib_ind",   t:"long", q:"Ideal board profile – Industry or sector", r:1, lim:1200},
  {id:"ib_own",   t:"long", q:"Ideal board profile – Ownership structure", r:1, lim:1200},
  {id:"ib_stage", t:"long", q:"Ideal board profile – Company stage and scale", r:1, lim:1200},
  {id:"ib_geo",   t:"long", q:"Ideal board profile – Geographic footprint", r:1, lim:1200},
  {id:"ib_prio",  t:"long", q:"Ideal board profile – Primary strategic priorities", r:1, lim:1200},
  {id:"ib_accom", t:"long", q:"What would the organization likely be trying to accomplish during your tenure?", r:1, lim:2500},
  {id:"ib_known", t:"long", q:"What contribution would you want to be known for?", r:1, lim:2500},
  {id:"ib_cred",  t:"long", q:"What type of first or next board role would be credible within the next one to two years?", r:1, lim:2500},
  {id:"ib_port",  t:"long", q:"What would you like your board portfolio to include within three to five years?", lim:2500},
  {id:"ib_orgs",  t:"long", q:"Are there specific organizations, sectors, or causes you would be proud to support?", lim:2500}
 ]},
 {h:"Board Readiness Self-Assessment",
  note:"Rate each area from 1 to 5.", f:[
  {id:"z_overall", t:"scale", q:"Overall board readiness self-assessment", r:1},
  {id:"z_strat",   t:"scale", q:"Strategic thinking", r:1},
  {id:"z_fin",     t:"scale", q:"Financial acumen", r:1},
  {id:"z_gov",     t:"scale", q:"Governance and compliance", r:1},
  {id:"z_risk",    t:"scale", q:"Risk oversight", r:1},
  {id:"z_stake",   t:"scale", q:"Stakeholder engagement", r:1},
  {id:"z_ind",     t:"scale", q:"Industry expertise", r:1},
  {id:"z_lead",    t:"scale", q:"Leadership and influence", r:1},
  {id:"z_strengthen", t:"long", q:"Which two areas should you strengthen first?", r:1, lim:1200}
 ]}]},

/* ---------- STEP 5 — Biography, positioning, acknowledgement ---------- */
{n:5, title:"Biography, positioning, and submit",
 intro:"Complete your biography inputs and positioning statements, attach materials, then submit.",
 groups:[
 {h:"Board Biography Inputs", f:[
  {id:"bio_role",  t:"long", q:"Current or most significant role", r:1, lim:2500},
  {id:"bio_years", t:"text", q:"Years of executive leadership", r:1},
  {id:"bio_pl",    t:"text", q:"Largest P&L or budget responsibility"},
  {id:"bio_team",  t:"text", q:"Largest team or organization led"},
  {id:"bio_ind",   t:"text", q:"Industries and markets"},
  {id:"bio_own",   t:"text", q:"Ownership environments"},
  {id:"bio_geo",   t:"text", q:"Geographic scope"},
  {id:"bio_boards",t:"long", q:"Current board or advisory roles", lim:2500},
  {id:"bio_edu",   t:"long", q:"Education and credentials", lim:2500},
  {id:"bio_acc",   t:"long", q:"List three defining accomplishments that best support your board candidacy", r:1, lim:2500},
  {id:"bio_cap",   t:"long", q:"Which capabilities should be most prominent in your board biography?", lim:2500},
  {id:"bio_must",  t:"long", q:"Is there anything that must be represented in your board biography?", lim:2500}
 ]},
 {h:"Positioning Statements", f:[
  {id:"t_s1", t:"text", q:"I am best positioned to serve organizations that are:", r:1},
  {id:"t_s2", t:"text", q:"I bring particular value in:", r:1},
  {id:"t_s3", t:"text", q:"I am most relevant to organizations facing:", r:1},
  {id:"t_s4", t:"text", q:"My strongest board contribution is:", r:1},
  {id:"t_s5", t:"text", q:"My target board environments are:", r:1},
  {id:"t_s6", t:"text", q:"My likely committee contribution is:", r:1},
  {id:"t_s7", t:"text", q:"My near-term board goal is:", r:1},
  {id:"t_s8", t:"text", q:"My longer-term board aspiration is:", r:1},
  {id:"bio_emph", t:"multi", q:"Which capabilities should be emphasized in your board biography?", help:"Select all that apply:",
   o:["Strategy","Financial oversight","Governance","Risk management","Transformation","M&A","Operations","Talent and succession","Digital and technology","International growth","ESG and sustainability","Other"], other:1},
  {id:"t_chg", t:"long", q:"What would need to change in your current professional and personal commitments for you to serve effectively on a board, particularly during periods of increased demand?", lim:2500},
  {id:"t_cap", t:"long", q:"If a board required significantly more time than expected because of a transaction, crisis, CEO transition, or regulatory issue, how much additional capacity could you realistically provide?", lim:2500}
 ]},
 {h:"Supporting Documents", f:[
  {id:"files", t:"file", q:"Please attach your board bio, or resume",
   help:"Upload your board biography or résumé. Additional supporting documents are welcome."}
 ]},
 {h:"Participant Acknowledgement", f:[
  {id:"ack", t:"ack", r:1,
   lines:[
    "I understand that Project Alpha is a board readiness, positioning, and relationship-development initiative.",
    "I understand that participation does not guarantee a board appointment, nomination, introduction, interview, or placement.",
    "I confirm that the information provided is accurate to the best of my knowledge and may be used by Christian & Timbers to support my confidential Project Alpha assessment and strategy review.",
    "I understand that Christian & Timbers does not have permission to formally submit, nominate, or represent me for a specific opportunity without prior discussion and my authorisation."
   ], label:"I agree"},
  {id:"ack_name", t:"text", q:"Participant name", r:1},
  {id:"ack_date", t:"date", q:"Date", r:1}
 ]}]}
]


var TOTAL_STEPS = PA_STEPS.length;

/* ============================================================
   State. Swap this layer for the application API.
   ============================================================ */
var D = window.__PA_BOOTSTRAP || { step:0, data:{}, files:{}, done:false, ref:null };
if (!D.data) D.data = {};
D.files = normalizeFiles(D.files);

function normalizeFiles(files){
  var out = {};
  Object.keys(files || {}).forEach(function(k){
    out[k] = (files[k] || []).map(function(x){
      if (x && typeof x === 'object' && x.name) return { id: x.id || null, name: String(x.name) };
      return { id: null, name: String(x) };
    });
  });
  return out;
}
function fileLabel(item){ return (item && item.name) ? item.name : String(item); }
var participant = window.__PA_PARTICIPANT || {};
var saveTimer = null;
var saveSeq = 0;
function markSaved(){
  var t = new Date();
  var el = document.getElementById('pw-saved');
  if (!el) return;
  el.textContent = 'Saved at ' + String(t.getHours()).padStart(2,'0') + ':' + String(t.getMinutes()).padStart(2,'0');
  el.classList.add('on');
}
function persist(opts){
  opts = opts || {};
  markSaved();
  var seq = ++saveSeq;
  // Never persist browser fakepath strings from <input type="file">
  var clean = Object.assign({}, D.data);
  Object.keys(clean).forEach(function(k){
    var v = clean[k];
    if (typeof v === 'string' && /fakepath/i.test(v)) delete clean[k];
  });
  var payload = {
    step: D.step,
    answers: Object.assign({}, clean, { __files: D.files }),
    done: !!opts.done
  };
  return fetch('/api/workbook', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(payload)
  }).then(function(res){
    return res.json().then(function(j){ return { ok: res.ok, j: j }; });
  }).then(function(r){
    if (seq !== saveSeq) return;
    if (!r.ok) throw new Error((r.j && r.j.error) ? String(r.j.error) : 'Save failed');
    if (r.j.reference) D.ref = r.j.reference;
    if (r.j.done) D.done = true;
    markSaved();
    return r.j;
  }).catch(function(err){
    var el = document.getElementById('pw-saved');
    if (el){ el.textContent = 'Save failed — retry'; el.classList.add('on'); }
    console.error(err);
  });
}
function queueSave(){ clearTimeout(saveTimer); saveTimer = setTimeout(function(){ persist(); }, 600); }

/* ============================================================
   Helpers
   ============================================================ */
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function val(id){ return D.data[id]; }
function arr(id){ var v = D.data[id]; return Array.isArray(v) ? v : []; }
function el(id){ return document.getElementById(id); }

/* A field is live only when its condition is met. Hidden fields are
   never validated and never appear on the review page. */
function live(f){
  if (!f.showIf) return true;
  var c = f.showIf, v = D.data[c.f];
  if (v == null || v === '') return false;
  if (c.is)  return c.is.indexOf(v) > -1;
  if (c.not) return c.not.indexOf(v) === -1;
  return true;
}
function stepFields(s){
  var out = [];
  s.groups.forEach(function(g){ g.f.forEach(function(f){ if (live(f)) out.push(f); }); });
  return out;
}
function answered(f){
  if (f.t === 'multi') return arr(f.id).length > 0;
  if (f.t === 'file')  return (D.files[f.id]||[]).length > 0;
  if (f.t === 'ack')   return val(f.id) === true;
  if (f.t === 'perSel'){
    var src = arr(f.src); if (!src.length) return false;
    return src.every(function(o){ return (val(f.id + '::' + o) || '').trim() !== ''; });
  }
  return (val(f.id) != null && String(val(f.id)).trim() !== '');
}

/* ============================================================
   Field rendering
   ============================================================ */
function labelFor(f, forId){
  var req = f.r ? ' <span class="pw-req">Required</span>' : '';
  return '<label class="pw-q" for="'+forId+'">'+f.q+req+'</label>';
}
function legendFor(f){
  var req = f.r ? ' <span class="pw-req">Required</span>' : '';
  return '<legend class="pw-q">'+f.q+req+'</legend>';
}
function helpFor(f){ return f.help ? '<p class="pw-help" id="'+f.id+'-help">'+f.help+'</p>' : ''; }
function errFor(f){ return '<p class="pw-err" id="'+f.id+'-err"></p>'; }

function renderField(f){
  var h = '<div class="pw-f" data-field="'+f.id+'">';
  var desc = (f.help ? f.id+'-help ' : '') + f.id+'-err';

  if (f.t==='text'||f.t==='email'||f.t==='tel'||f.t==='url'||f.t==='date'){
    h += labelFor(f, f.id) + helpFor(f);
    h += '<input class="pw-in" id="'+f.id+'" type="'+f.t+'" aria-describedby="'+desc+'" value="'+esc(val(f.id)||'')+'">';

  } else if (f.t==='long'){
    h += labelFor(f, f.id) + helpFor(f);
    h += '<textarea class="pw-in" id="'+f.id+'" maxlength="'+(f.lim||1200)+'" aria-describedby="'+desc+' '+f.id+'-c">'+esc(val(f.id)||'')+'</textarea>';
    h += '<p class="pw-count" id="'+f.id+'-c"></p>';

  } else if (f.t==='one'){
    h += '<fieldset aria-describedby="'+desc+'">'+legendFor(f)+helpFor(f)+'<div class="pw-opts">';
    f.o.forEach(function(o,i){
      var id = f.id+'_'+i;
      h += '<label class="pw-opt" for="'+id+'"><input type="radio" id="'+id+'" name="'+f.id+'" value="'+esc(o)+'"'+(val(f.id)===o?' checked':'')+'><span>'+esc(o)+'</span></label>';
    });
    h += '</div></fieldset>';

  } else if (f.t==='multi'){
    var sel = arr(f.id), full = f.cap && sel.length >= f.cap;
    h += '<fieldset aria-describedby="'+desc+'">'+legendFor(f)+helpFor(f)+'<div class="pw-opts">';
    f.o.forEach(function(o,i){
      var id = f.id+'_'+i, on = sel.indexOf(o) > -1, dis = full && !on;
      h += '<label class="pw-opt'+(dis?' dis':'')+'" for="'+id+'"><input type="checkbox" id="'+id+'" name="'+f.id+'" value="'+esc(o)+'"'+(on?' checked':'')+(dis?' disabled':'')+'><span>'+esc(o)+'</span></label>';
    });
    h += '</div>';
    if (f.cap) h += '<p class="pw-cap'+(full?' full':'')+'" id="'+f.id+'-cap"></p>';
    if (f.other && sel.indexOf('Other') > -1){
      h += '<div class="pw-other"><label class="pw-sr" for="'+f.id+'_other">Please specify</label>'
         + '<input class="pw-in" id="'+f.id+'_other" type="text" placeholder="Please specify" value="'+esc(val(f.id+'_other')||'')+'"></div>';
    }
    h += '</fieldset>';

  } else if (f.t==='scale'){
    h += '<fieldset aria-describedby="'+desc+'">'+legendFor(f)+'<div class="pw-scale">';
    [1,2,3,4,5].forEach(function(n){
      var id = f.id+'_'+n;
      h += '<label for="'+id+'"><input type="radio" id="'+id+'" name="'+f.id+'" value="'+n+'"'+(String(val(f.id))===String(n)?' checked':'')+'><span>'+n+'</span></label>';
    });
    h += '</div></fieldset>';

  } else if (f.t==='perSel'){
    var src = arr(f.src);
    h += '<p class="pw-q">'+f.q+(f.r?' <span class="pw-req">Required</span>':'')+'</p>' + helpFor(f);
    if (!src.length){
      h += '<p class="pw-help">Answers appear here once you have made a selection above.</p>';
    } else {
      src.forEach(function(o,i){
        var sid = f.id+'::'+o, dom = f.id+'_s'+i;
        h += '<label class="pw-q" style="margin-top:18px" for="'+dom+'">'+esc(o)+'</label>'
           + '<textarea class="pw-in" id="'+dom+'" data-key="'+esc(sid)+'" maxlength="'+(f.lim||2500)+'" aria-describedby="'+f.id+'-err">'+esc(val(sid)||'')+'</textarea>';
      });
    }

  } else if (f.t==='file'){
    var list = D.files[f.id] || [];
    h += labelFor(f, f.id) + helpFor(f);
    h += '<div class="pw-drop">PDF or Word. Up to 4.5 MB per file.<br><input type="file" id="'+f.id+'" accept=".pdf,.doc,.docx" '+(f.max>1?'multiple':'')+' style="margin-top:12px"></div>';
    h += '<div class="pw-files" id="'+f.id+'-list">';
    list.forEach(function(item,i){
      h += '<div class="pw-file"><b>'+esc(fileLabel(item))+'</b> uploaded. <button type="button" data-rm="'+f.id+'" data-i="'+i+'">Remove</button></div>';
    });
    h += '</div>';

  } else if (f.t==='ack'){
    h += '<div class="pw-ack"><ul>';
    f.lines.forEach(function(l){ h += '<li>'+esc(l)+'</li>'; });
    h += '</ul><label class="pw-opt" for="'+f.id+'"><input type="checkbox" id="'+f.id+'"'+(val(f.id)===true?' checked':'')+'><span>'+esc(f.label)+' <span class="pw-req">Required</span></span></label></div>';

  } else if (f.t==='opt'){
    h += '<label class="pw-opt" for="'+f.id+'"><input type="checkbox" id="'+f.id+'"'+(val(f.id)===true?' checked':'')+'><span>'+f.q+'</span></label>';
  }

  h += errFor(f) + '</div>';
  return h;
}

/* ============================================================
   Screens
   ============================================================ */
function screenWelcome(){
  return '<div class="pw-page">'
   + '<p class="pw-eyebrow">A Christian &amp; Timbers Initiative</p>'
   + '<h1 class="pw-h1">Board Aspiration and Readiness Workbook</h1>'
   + '<p class="pw-intro">Your answers inform a confidential Project Alpha strategy review and the development of your board readiness assessment, appointment thesis, target board profile, positioning, and recommended next steps.</p>'
   + '<p class="pw-note" style="margin-top:22px">Answer candidly and with enough detail for a considered assessment. Where possible, support your answers with specific examples, measurable results, and organisational context.</p>'
   + '<p class="pw-note" style="margin-top:18px">Five steps, approximately 45 to 60 minutes. Your answers save as you go, and a link returns you to where you stopped.</p>'
   + '<p class="pw-note" style="margin-top:18px">Participation does not guarantee a board appointment, nomination, introduction, interview, or placement.</p>'
   + '<p style="margin-top:38px"><button class="pw-btn" type="button" id="pw-begin">'
   + (D.step > 0 ? 'Continue where you stopped' : 'Begin')
   + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.4 12h15.2"/><path d="m13.8 6.4 5.8 5.6-5.8 5.6"/></svg></button></p>'
   + '</div>';
}

function screenStep(s){
  var h = '<div class="pw-page">'
   + '<div class="pw-sum" id="pw-sum" role="alert" tabindex="-1"><strong id="pw-sum-t"></strong><ul id="pw-sum-l"></ul></div>'
   + '<p class="pw-eyebrow">Step ' + s.n + ' of ' + TOTAL_STEPS + '</p>'
   + '<h1 class="pw-h1">' + esc(s.title) + '</h1>'
   + '<p class="pw-intro">' + esc(s.intro) + '</p>';

  if (s.review) h += renderReview();

  s.groups.forEach(function(g){
    var vis = g.f.filter(live);
    if (!vis.length && !g.h && !g.note) return;
    h += '<section class="pw-group">';
    if (g.h)    h += '<h2>' + esc(g.h) + '</h2>';
    if (g.sub)  h += '<h3>' + esc(g.sub) + '</h3>';
    if (g.note) h += '<p class="pw-note">' + esc(g.note) + '</p>';
    vis.forEach(function(f){ h += renderField(f); });
    h += '</section>';
  });
  return h + '</div>';
}

function renderReview(){
  var h = '<div class="pw-rev"><p class="pw-note" style="padding:22px 0 4px">Check each section below. Use Edit to change an answer and return here.</p>';
  PA_STEPS.forEach(function(s){
    if (s.review) return;
    h += '<div class="pw-rev-s"><div class="pw-rev-h"><h2>Step ' + s.n + '. ' + esc(s.title) + '</h2>'
       + '<button type="button" data-edit="' + s.n + '">Edit</button></div>';
    stepFields(s).forEach(function(f){
      var a = '';
      if (f.t === 'multi'){
        a = arr(f.id).slice();
        var o = val(f.id + '_other');
        if (o) a = a.map(function(x){ return x === 'Other' ? 'Other: ' + o : x; });
        a = a.join(', ');
      } else if (f.t === 'file'){
        a = (D.files[f.id] || []).map(fileLabel).join(', ');
      } else if (f.t === 'perSel'){
        a = arr(f.src).map(function(o){ return o + ' — ' + (val(f.id + '::' + o) || ''); }).join('\n\n');
      } else if (f.t === 'scale'){
        a = val(f.id) ? val(f.id) + ' of 5' : '';
      } else if (f.t === 'ack' || f.t === 'opt'){
        a = val(f.id) === true ? 'Yes' : '';
      } else {
        a = val(f.id) || '';
      }
      var q = f.q || (f.t === 'ack' ? 'Acknowledgement' : f.id);
      var empty = String(a).trim() === '';
      h += '<div class="pw-rev-r"><div class="pw-rev-q">' + q + '</div>'
         + '<div class="pw-rev-a' + (empty && f.r ? ' empty' : '') + '">'
         + (empty ? (f.r ? 'Not yet answered' : '—') : esc(a)) + '</div></div>';
    });
    h += '</div>';
  });
  return h + '</div>';
}

function screenDone(){
  var email = val('p_email') || val('ack_name') || 'your email address';
  var home = 'https://www.christianandtimbers.com/apply-for-ai-board-opportunities';
  return '<div class="pw-conf">'
   + '<p class="pw-eyebrow">Project Alpha</p>'
   + '<h1 class="pw-h1">Your workbook has been received</h1>'
   + '<p class="pw-ref">Reference ' + esc(D.ref) + '</p>'
   + '<p class="pw-intro" style="margin-top:34px">The Project Alpha team will review your responses and contact you within five business days to arrange your strategy review. A confirmation has been sent to ' + esc(email) + '.</p>'
   + '<p class="pw-note" style="margin-top:22px">Questions: <a href="mailto:projectalpha@christian-timbers.com" style="color:var(--ct-black);font-weight:700;box-shadow:inset 0 -8px 0 var(--ct-yellow);text-decoration:none">projectalpha@christian-timbers.com</a></p>'
   + '<p style="margin-top:38px"><a class="pw-btn" href="' + home + '">Return to Project Alpha</a></p>'
   + '</div>';
}

/* ============================================================
   Paint
   ============================================================ */
function paintProgress(){
  var p = el('pw-prog'), n = el('pw-stepn');
  if (D.done || D.step === 0){ p.innerHTML = ''; n.textContent = ''; return; }
  var h = '';
  for (var i = 1; i <= TOTAL_STEPS; i++){
    h += '<i class="' + (i < D.step ? 'on' : i === D.step ? 'now' : '') + '"></i>';
  }
  p.innerHTML = h;
  n.textContent = 'Step ' + D.step + ' of ' + TOTAL_STEPS;
}

function render(opts){
  opts = opts || {};
  var keepScroll = !!opts.keepScroll;
  var y = keepScroll ? window.scrollY : 0;
  var v = el('pw-view');
  if (D.done)          v.innerHTML = screenDone();
  else if (D.step === 0) v.innerHTML = screenWelcome();
  else                 v.innerHTML = screenStep(PA_STEPS[D.step - 1]);

  el('pw-nav').hidden = (D.step === 0 || D.done);
  el('pw-back').style.visibility = D.step > 1 ? 'visible' : 'hidden';
  el('pw-next').innerHTML = (D.step === TOTAL_STEPS)
    ? 'Submit my workbook'
    : 'Continue <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.4 12h15.2"/><path d="m13.8 6.4 5.8 5.6-5.8 5.6"/></svg>';

  paintProgress();
  if (D.step > 0 && !D.done) refreshCounters();
  if (keepScroll) {
    window.scrollTo(0, y);
    requestAnimationFrame(function(){ window.scrollTo(0, y); });
  } else {
    window.scrollTo(0, 0);
    var head = v.querySelector('h1');
    if (head){ head.setAttribute('tabindex','-1'); head.focus({preventScroll:true}); }
  }
}

function refreshCounters(){
  var s = PA_STEPS[D.step - 1];
  if (!s) return;
  stepFields(s).forEach(function(f){
    if (f.t === 'long'){
      var t = el(f.id), c = el(f.id + '-c');
      if (t && c){
        var left = (f.lim || 1200) - t.value.length;
        c.textContent = left + ' characters remaining';
        c.classList.toggle('warn', left < 100);
      }
    }
    if (f.t === 'multi' && f.cap){
      var cap = el(f.id + '-cap');
      if (cap){
        var n = arr(f.id).length;
        cap.textContent = n >= f.cap
          ? 'Select up to ' + f.cap + '. You have selected ' + f.cap + '.'
          : 'Select up to ' + f.cap + '. You have selected ' + n + '.';
      }
    }
  });
}

/* ============================================================
   Input handling
   ============================================================ */
var view = el('pw-view');

view.addEventListener('input', function(e){
  var t = e.target;
  if (t.type === 'file') return; // browsers expose C:\fakepath\… — real files live in D.files
  if (t.dataset && t.dataset.key){ D.data[t.dataset.key] = t.value; }
  else if (t.id){ D.data[t.id] = t.value; }
  refreshCounters();
  clearErr(t);
  queueSave();
});

view.addEventListener('change', function(e){
  var t = e.target, f, name = t.name || t.id;

  if (t.type === 'checkbox' && t.name){
    var cur = arr(t.name);
    if (t.checked){ if (cur.indexOf(t.value) < 0) cur.push(t.value); }
    else cur = cur.filter(function(x){ return x !== t.value; });
    D.data[t.name] = cur;
    clearErr(t);
    persist();
    f = findField(t.name);
    // Full re-render only when UI must change (cap disable, Other text, dependents).
    // Always keep scroll so checkboxes don't jump the page to the top.
    var needsRedraw = (f && f.cap) || (f && f.other) || dependents(t.name).length > 0;
    if (needsRedraw) render({ keepScroll: true });
    else refreshCounters();
    return;
  }
  if (t.type === 'checkbox'){ D.data[t.id] = t.checked; clearErr(t); queueSave(); return; }

  if (t.type === 'radio'){
    D.data[t.name] = t.value;
    clearErr(t);
    persist();
    f = findField(t.name);
    if (f && dependents(t.name).length) render({ keepScroll: true });   // conditional questions
    return;
  }

  if (t.type === 'file'){
    f = findField(t.id);
    if (!f || !t.files || !t.files.length) return;
    var max = f.max || 1;
    var cur = (D.files[t.id] || []).slice();
    var room = max - cur.length;
    if (room <= 0){
      t.value = '';
      return;
    }
    var toUpload = Array.prototype.slice.call(t.files, 0, room);
    t.value = '';
    var drop = t.closest ? t.closest('.pw-drop') : null;
    if (drop) drop.insertAdjacentHTML('beforeend', '<p class="pw-help" id="'+t.id+'-up">Uploading…</p>');

    Promise.all(toUpload.map(function(file){
      var fd = new FormData();
      fd.append('fieldId', t.id);
      fd.append('file', file);
      return fetch('/api/workbook/upload', {
        method: 'POST',
        credentials: 'same-origin',
        body: fd
      }).then(function(res){
        return res.json().then(function(j){ return { ok: res.ok, j: j }; });
      });
    })).then(function(results){
      var up = document.getElementById(t.id + '-up');
      if (up) up.remove();
      results.forEach(function(r){
        if (r.ok && r.j.file){
          cur.push({ id: r.j.file.id, name: r.j.file.name });
        } else {
          alert((r.j && r.j.error) ? r.j.error : 'Upload failed');
        }
      });
      D.files[t.id] = cur;
      persist();
      render({ keepScroll: true });
    }).catch(function(err){
      console.error(err);
      var up = document.getElementById(t.id + '-up');
      if (up) up.textContent = 'Upload failed — try again.';
    });
    return;
  }
});

view.addEventListener('click', function(e){
  var b = e.target.closest ? e.target.closest('button') : null;
  if (!b) return;
  if (b.id === 'pw-begin'){
    D.step = Math.max(1, D.step);
    if (participant.name && !D.data.p_name) D.data.p_name = participant.name;
    if (participant.email && !D.data.p_email) D.data.p_email = participant.email;
    if (!D.data.p_date) D.data.p_date = new Date().toISOString().slice(0,10);
    persist(); render(); return;
  }
  if (b.dataset.edit){ D.step = parseInt(b.dataset.edit, 10); persist(); render(); return; }
  if (b.dataset.rm){
    var list = (D.files[b.dataset.rm] || []).slice();
    var idx = parseInt(b.dataset.i, 10);
    var removed = list[idx];
    list.splice(idx, 1);
    D.files[b.dataset.rm] = list;
    if (removed && removed.id){
      fetch('/api/workbook/upload', {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: removed.id })
      }).catch(function(err){ console.error(err); });
    }
    persist(); render({ keepScroll: true }); return;
  }
});

function findField(id){
  for (var i = 0; i < PA_STEPS.length; i++){
    var g = PA_STEPS[i].groups;
    for (var j = 0; j < g.length; j++){
      for (var k = 0; k < g[j].f.length; k++) if (g[j].f[k].id === id) return g[j].f[k];
    }
  }
  return null;
}
function dependents(id){
  var out = [];
  PA_STEPS.forEach(function(s){ s.groups.forEach(function(g){ g.f.forEach(function(f){
    if ((f.showIf && f.showIf.f === id) || f.src === id) out.push(f);
  }); }); });
  return out;
}

/* ============================================================
   Validation
   ============================================================ */
function clearErr(t){
  var w = t.closest ? t.closest('[data-field]') : null;
  if (!w) return;
  var e2 = w.querySelector('.pw-err');
  if (e2){ e2.classList.remove('on'); e2.textContent = ''; }
  w.querySelectorAll('[aria-invalid]').forEach(function(x){ x.removeAttribute('aria-invalid'); });
}

function validateStep(){
  var s = PA_STEPS[D.step - 1], errs = [];
  stepFields(s).forEach(function(f){
    if (!f.r || answered(f)) return;
    var msg;
    if (f.t === 'multi')       msg = 'Select at least one option.';
    else if (f.t === 'one' || f.t === 'scale') msg = 'Choose one option.';
    else if (f.t === 'file')   msg = 'Attach your executive résumé or curriculum vitae.';
    else if (f.t === 'ack')    msg = 'Confirm the acknowledgement before submitting.';
    else if (f.t === 'perSel') msg = 'Complete a description for each situation you selected.';
    else if (f.t === 'email')  msg = 'Enter your email address.';
    else                       msg = 'This answer is required.';
    errs.push({ f: f, msg: msg });
  });

  var em = val('p_email');
  if (D.step === 1 && em && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(em).trim())){
    errs.push({ f: findField('p_email'), msg: 'Enter your email address in the form name@example.com.' });
  }

  errs.forEach(function(x){
    var w = view.querySelector('[data-field="' + x.f.id + '"]');
    if (!w) return;
    var box = w.querySelector('.pw-err');
    box.textContent = x.msg; box.classList.add('on');
    var input = w.querySelector('input,textarea');
    if (input) input.setAttribute('aria-invalid', 'true');
  });

  var sum = el('pw-sum');
  if (!errs.length){ if (sum) sum.classList.remove('on'); return true; }

  el('pw-sum-t').textContent = errs.length === 1
    ? 'One answer needs your attention before you continue.'
    : errs.length + ' answers need your attention before you continue.';
  var ul = el('pw-sum-l'); ul.innerHTML = '';
  errs.forEach(function(x){
    var li = document.createElement('li'), a = document.createElement('a');
    a.href = '#' + x.f.id;
    a.textContent = (x.f.q || 'Acknowledgement') + ' — ' + x.msg;
    a.addEventListener('click', function(ev){
      ev.preventDefault();
      var w = view.querySelector('[data-field="' + x.f.id + '"]');
      var i = w && w.querySelector('input,textarea');
      if (i){ i.focus(); w.scrollIntoView({block:'center'}); }
    });
    li.appendChild(a); ul.appendChild(li);
  });
  sum.classList.add('on'); sum.focus();
  window.scrollTo(0, 0);
  return false;
}

/* ============================================================
   Navigation
   ============================================================ */
el('pw-next').addEventListener('click', function(){
  if (!validateStep()) return;
  if (D.step === TOTAL_STEPS){
    persist({ done: true }).then(function(j){
      if (!j) return;
      D.done = true;
      if (j.reference) D.ref = j.reference;
      render();
    });
    return;
  }
  D.step++; persist(); render();
});

el('pw-back').addEventListener('click', function(){ if (D.step > 1){ D.step--; persist(); render(); } });

el('pw-later').addEventListener('click', function(){
  persist();
  var b = el('pw-later'), old = b.textContent;
  b.disabled = true;
  b.textContent = 'Saving…';
  fetch('/api/workbook/resume', {
    method: 'POST',
    credentials: 'same-origin'
  }).then(function(res){
    return res.json().then(function(j){ return { ok: res.ok, j: j }; });
  }).then(function(r){
    if (r.ok){
      b.textContent = (r.j && r.j.message)
        ? r.j.message
        : 'Your answers are saved. We have emailed a link that returns you to this step. The link works for 30 days.';
      if (r.j && r.j.devLink){
        console.log('Resume link (dev):', r.j.devLink);
      }
    } else {
      b.textContent = 'Saved locally, but the email failed. Try again later.';
    }
    setTimeout(function(){ b.textContent = old; b.disabled = false; }, 8000);
  }).catch(function(){
    b.textContent = 'Saved. Email could not be sent — try again later.';
    setTimeout(function(){ b.textContent = old; b.disabled = false; }, 6000);
  });
});

render();
window.__PA_RERENDER = render;
})();