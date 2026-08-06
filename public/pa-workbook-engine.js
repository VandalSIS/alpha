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

/* ---------- STEP 1 — section 1 ---------- */
{n:1, title:"Participant profile",
 intro:"Start with the scope of your executive career. Scale carries more weight than title, so state revenue, budget, team size, and geography where relevant.",
 groups:[{h:"1. Participant Profile", f:[
  {id:"p_name",  t:"text",  q:"Full name", r:1},
  {id:"p_title", t:"text",  q:"Current title", r:1},
  {id:"p_org",   t:"text",  q:"Current organization", r:1},
  {id:"p_loc",   t:"text",  q:"Primary location", r:1},
  {id:"p_email", t:"email", q:"Email address", r:1},
  {id:"p_tel",   t:"tel",   q:"Telephone number", r:1},
  {id:"p_li",    t:"url",   q:"LinkedIn profile"},
  {id:"p_date",  t:"date",  q:"Date completed", r:1},
  {id:"p_role",  t:"long",  q:"Current or most significant executive role", r:1, lim:1200},
  {id:"p_years", t:"text",  q:"Years of executive leadership experience", r:1},
  {id:"p_pl",    t:"long",  q:"Largest P&L, revenue base, operating budget, or capital responsibility",
   help:"Please indicate the approximate scale and whether your responsibility was direct or shared.", r:1, lim:1200},
  {id:"p_team",  t:"long",  q:"Largest team or organization led",
   help:"Please include direct and indirect employees where relevant.", r:1, lim:1200},
  {id:"p_ind",   t:"long",  q:"Primary industries and markets", r:1, lim:1200},
  {id:"p_geo",   t:"multi", q:"Geographic scope of leadership experience", help:"Select all that apply:", r:1,
   o:["Local","National","North American","European","Asia-Pacific","Middle Eastern","Latin American","Global","Other"], other:1},
  {id:"p_own",   t:"multi", q:"Ownership environments experienced", help:"Select all that apply:", r:1,
   o:["Public company","Privately held company","Private equity portfolio company","Venture-backed company","Founder-led company","Family-owned company","Government or public-sector organization","Nonprofit or mission-driven organization","Other"], other:1},
  {id:"p_boards",t:"long",  q:"Current board, advisory, trustee, or governance committee roles",
   help:"Please include the organization, role, appointment date, and whether the position is fiduciary or advisory.", lim:2500},
  {id:"p_edu",   t:"long",  q:"Education, professional credentials, and governance qualifications", r:1, lim:2500}
 ]}]},

/* ---------- STEP 2 — sections 2, 3 ---------- */
{n:2, title:"Motivation and five-year board journey",
 intro:"Why board service, why now, and where the next five years should lead.",
 groups:[
 {h:"2. Board Motivation and Aspirations", f:[
  {id:"m_why",   t:"long", q:"Why are you considering board service at this stage of your career?", r:1, lim:2500},
  {id:"m_value", t:"long", q:"What would make your participation in Project Alpha valuable?", r:1, lim:1200},
  {id:"m_contr", t:"long", q:"What would you most like to contribute through board service?", r:1, lim:1200},
  {id:"m_learn", t:"long", q:"What would you most like to learn, experience, or develop through board service?", r:1, lim:1200},
  {id:"m_prio",  t:"one",  q:"How important is securing a board appointment within the next 24 months?", help:"Select one:", r:1,
   o:["Exploratory interest","Meaningful objective","High priority","Immediate priority"]},
  {id:"m_prompt",t:"multi",q:"What has prompted your interest in board service now?", help:"Select all that apply:", r:1,
   o:["Desire to contribute beyond my executive responsibilities","Preparation for a future executive transition","Development of a portfolio career","Interest in governance and enterprise stewardship","Desire to support a CEO or management team","Interest in a particular industry or mission","Desire to broaden my professional perspective","Interest in public-company governance","Interest in private equity or venture-backed companies","Interest in nonprofit or community service","Other"], other:1},
  {id:"m_conc",  t:"long", q:"What concerns, questions, or uncertainties do you currently have about pursuing board service?", lim:2500}
 ]},
 {h:"3. Five-Year Board Journey", f:[
  {id:"j_look",  t:"multi",q:"What would a successful board journey look like over the next five years?", help:"Select all that apply:", r:1,
   o:["One meaningful board role","A portfolio of board roles","Public-company board service","Private-company board service","Private equity portfolio board service","Venture-backed or growth-company board service","Committee membership","Committee leadership","Board chair or lead director responsibility","International board experience","Advisory board service","Nonprofit or mission-driven board service","Government or public-sector board service","Other"], other:1},
  {id:"j_desc",  t:"long", q:"Describe your desired five-year board journey.",
   help:"Consider the types of organizations, responsibilities, experiences, and contributions you would like your portfolio to include.", r:1, lim:2500},
  {id:"j_known", t:"long", q:"What contribution would you want to be known for across your board career?", r:1, lim:1200},
  {id:"j_orgs",  t:"long", q:"Are there specific organizations, sectors, communities, or causes you would be proud to support?", lim:1200},
  {id:"j_role",  t:"long", q:"What role do you expect board service to play in your broader career and life?", r:1, lim:1200}
 ]}]},

/* ---------- STEP 3 — sections 4, 5 ---------- */
{n:3, title:"Board experience and governance judgment",
 intro:"Your formal board roles, your exposure to boards as an executive, and the judgment you have shown in the room.",
 groups:[
 {h:"4. Existing Board and Governance Experience", sub:"Formal Board Experience", f:[
  {id:"b_roles", t:"long", q:"What formal board, advisory board, trustee, observer, or governance committee roles have you held?",
   help:"For each role, please provide: Organization; Role; Ownership environment; Appointment dates; Fiduciary or advisory status; Committees served; Primary responsibilities; Most significant contribution.", lim:2500}
 ]},
 {h:"", sub:"Executive Exposure to Boards", f:[
  {id:"b_freq",  t:"one",  q:"How frequently have you worked directly with or presented to a board?", r:1,
   o:["Never","Occasionally","Quarterly","Monthly","More frequently than monthly"]},
  {id:"b_cap",   t:"multi",q:"In what capacity have you worked with boards?", help:"Select all that apply:", r:1,
   o:["CEO or enterprise leader","Business unit or P&L leader","Functional executive","Management presenter","Transaction or integration leader","Board secretary or governance support","Adviser or consultant","Investor representative","Other"], other:1,
   showIf:{f:"b_freq", not:["Never"]}},
  {id:"b_matt",  t:"multi",q:"Which matters have you presented to or discussed with boards?", help:"Select all that apply:",
   o:["Enterprise strategy","Annual operating plan","Financial performance","Capital allocation","Mergers and acquisitions","Post-merger integration","Enterprise risk","Regulatory or compliance matters","Cybersecurity or technology risk","Transformation","CEO succession","Executive succession","Talent and compensation","Crisis response","Investor relations","Stakeholder matters","International expansion","Major customer or commercial matters","Restructuring or turnaround","Other"], other:1,
   showIf:{f:"b_freq", not:["Never"]}},
  {id:"b_sig",   t:"long", q:"Describe the most significant matter you have brought before a board.",
   help:"Please address: The context; The decision required; Your recommendation; The board's response; The outcome; What the experience taught you.", lim:2500,
   showIf:{f:"b_freq", not:["Never"]}},
  {id:"b_learn", t:"long", q:"What have you learned from observing effective or ineffective boards?", r:1, lim:2500}
 ]},
 {h:"5. Governance Judgment and Boardroom Contribution", f:[
  {id:"g_chal",  t:"long", q:"Describe a situation in which you constructively challenged a CEO, board, investor, or senior stakeholder.",
   help:"What was at stake, how did you approach the situation, and what was the result?", r:1, lim:2500},
  {id:"g_change",t:"long", q:"Describe a situation in which you changed your recommendation after hearing contrary evidence or perspectives.", r:1, lim:2500},
  {id:"g_bal",   t:"long", q:"Describe an occasion when you had to balance short-term performance with the long-term interests of an organization.", r:1, lim:2500},
  {id:"g_diff",  t:"long", q:"How would your contribution as a director differ from your contribution as an executive?", r:1, lim:1200},
  {id:"g_undmin",t:"long", q:"How would you challenge management without undermining the CEO or management team?", r:1, lim:1200},
  {id:"g_infl",  t:"long", q:"How do you influence decisions when you do not have direct authority?", r:1, lim:1200},
  {id:"g_when",  t:"long", q:"How do you determine when to ask questions, provide advice, or allow management to execute?", r:1, lim:1200},
  {id:"g_sep",   t:"long", q:"What experience do you have separating governance oversight from management execution?", r:1, lim:1200},
  {id:"g_adj",   t:"long", q:"What aspects of board service may require the greatest adjustment from you?", r:1, lim:1200}
 ]}]},

/* ---------- STEP 4 — section 6 ---------- */
{n:4, title:"Governance-relevant accomplishments",
 intro:"Three accomplishments that support your board candidacy. Choose examples with a decision you owned, a stakeholder set, and a measurable result.",
 groups:[
 {h:"6. Governance-Relevant Accomplishments",
  note:"Please provide three accomplishments that most strongly support your board candidacy. Select examples that demonstrate enterprise judgment, strategic contribution, leadership through complexity, or experience relevant to board oversight.", f:[]},
 {h:"", sub:"Accomplishment 1", f:[
  {id:"a1_org",  t:"long", q:"Organization and context", r:1, lim:1200},
  {id:"a1_chal", t:"long", q:"Strategic, financial, operational, or organizational challenge", r:1, lim:1200},
  {id:"a1_resp", t:"long", q:"Your specific responsibility", r:1, lim:1200},
  {id:"a1_dec",  t:"long", q:"Important decisions you made or influenced", r:1, lim:1200},
  {id:"a1_stak", t:"long", q:"Stakeholders involved", r:1, lim:1200},
  {id:"a1_out",  t:"long", q:"Outcome achieved", r:1, lim:1200},
  {id:"a1_meas", t:"long", q:"Measurable result", r:1, lim:1200},
  {id:"a1_rel",  t:"long", q:"Why this accomplishment is relevant to board service", r:1, lim:1200}
 ]},
 {h:"", sub:"Accomplishment 2", f:[
  {id:"a2_org",  t:"long", q:"Organization and context", r:1, lim:1200},
  {id:"a2_chal", t:"long", q:"Strategic, financial, operational, or organizational challenge", r:1, lim:1200},
  {id:"a2_resp", t:"long", q:"Your specific responsibility", r:1, lim:1200},
  {id:"a2_dec",  t:"long", q:"Important decisions you made or influenced", r:1, lim:1200},
  {id:"a2_stak", t:"long", q:"Stakeholders involved", r:1, lim:1200},
  {id:"a2_out",  t:"long", q:"Outcome achieved", r:1, lim:1200},
  {id:"a2_meas", t:"long", q:"Measurable result", r:1, lim:1200},
  {id:"a2_rel",  t:"long", q:"Why this accomplishment is relevant to board service", r:1, lim:1200}
 ]},
 {h:"", sub:"Accomplishment 3", f:[
  {id:"a3_org",  t:"long", q:"Organization and context", r:1, lim:1200},
  {id:"a3_chal", t:"long", q:"Strategic, financial, operational, or organizational challenge", r:1, lim:1200},
  {id:"a3_resp", t:"long", q:"Your specific responsibility", r:1, lim:1200},
  {id:"a3_dec",  t:"long", q:"Important decisions you made or influenced", r:1, lim:1200},
  {id:"a3_stak", t:"long", q:"Stakeholders involved", r:1, lim:1200},
  {id:"a3_out",  t:"long", q:"Outcome achieved", r:1, lim:1200},
  {id:"a3_meas", t:"long", q:"Measurable result", r:1, lim:1200},
  {id:"a3_rel",  t:"long", q:"Why this accomplishment is relevant to board service", r:1, lim:1200}
 ]},
 {h:"", f:[
  {id:"a_diff",  t:"long", q:"Which of these accomplishments is most differentiated in the board market? Why?", r:1, lim:1200},
  {id:"a_ent",   t:"long", q:"Which accomplishment best demonstrates enterprise-level judgment? Why?", r:1, lim:1200}
 ]}]},
/* ---------- STEP 5 — sections 7, 8, 9, 10 ---------- */
{n:5, title:"Capabilities, industries, strategic situations",
 intro:"Where you hold credibility, and the situations in which a board would call on you. Select tightly. A short list reads stronger than a long one.",
 groups:[
 {h:"7. Core Enterprise Capabilities", f:[
  {id:"c_core", t:"multi", q:"Select no more than five capabilities for which you have substantial and demonstrable experience.", r:1, cap:5,
   o:["CEO and enterprise leadership","P&L leadership","Enterprise strategy","Corporate transformation","Capital allocation","Financial oversight","Mergers and acquisitions","Post-merger integration","Enterprise risk management","Crisis leadership","Stakeholder management","Investor relations","CEO and executive succession","Culture and organizational effectiveness","International expansion","Public policy and government relations","Sustainability and ESG","Private equity value creation","Founder or family-business transition","Other"], other:1},
  {id:"c_two",  t:"long",  q:"Which two of these capabilities most clearly differentiate you from other executives with similar backgrounds?", r:1, lim:1200},
  {id:"c_evid", t:"long",  q:"What evidence demonstrates those differentiating capabilities?", r:1, lim:2500}
 ]},
 {h:"8. Functional and Technical Capabilities", f:[
  {id:"f_areas",t:"multi", q:"Select no more than five areas for which you possess significant and board-relevant expertise.", r:1, cap:5,
   o:["Growth and commercialization","Go-to-market strategy","Enterprise sales","Business development","Product commercialization","Pricing strategy","Customer and market strategy","Operations","Manufacturing","Supply chain and procurement","Quality and safety","Program management","Financial management","Corporate finance","Technology strategy","Digital transformation","Artificial intelligence","Data strategy","Cybersecurity","Software and product management","Human capital and succession","Organizational design","Regulatory and compliance","Government relations","Other"], other:1},
  {id:"f_prom", t:"long",  q:"Which of these areas should be most prominent in your board positioning?", r:1, lim:1200},
  {id:"f_supp", t:"long",  q:"Which areas are valuable supporting capabilities but should not define your board profile?", lim:1200}
 ]},
 {h:"9. Industry and Market Credibility", f:[
  {id:"i_prim", t:"multi", q:"Which industries give you immediate credibility?", help:"Select no more than three primary sectors:", r:1, cap:3,
   o:["Aerospace and defense","Aviation","Space","Industrial and manufacturing","Technology","SaaS and software","Artificial intelligence and data","Cybersecurity","Financial services","Healthcare","Life sciences","Energy and utilities","Consumer and retail","Telecommunications","Professional services","Media and entertainment","Education","Real estate","Transportation and logistics","Government and public sector","Nonprofit and social impact","Private equity","Venture capital","Sustainability and climate","Other"], other:1},
  {id:"i_evid", t:"long",  q:"What evidence supports your credibility in each selected sector?",
   help:"Consider your tenure, scope, reputation, relationships, accomplishments, and familiarity with the sector's economics and risks.", r:1, lim:2500},
  {id:"i_adj",  t:"multi", q:"Which adjacent sectors could credibly value your experience?", help:"Select no more than three.", cap:3,
   o:["Aerospace and defense","Aviation","Space","Industrial and manufacturing","Technology","SaaS and software","Artificial intelligence and data","Cybersecurity","Financial services","Healthcare","Life sciences","Energy and utilities","Consumer and retail","Telecommunications","Professional services","Media and entertainment","Education","Real estate","Transportation and logistics","Government and public sector","Nonprofit and social impact","Private equity","Venture capital","Sustainability and climate","Other"], other:1},
  {id:"i_care", t:"long",  q:"Which sectors may appear relevant but would require additional learning or careful positioning?", lim:1200},
  {id:"i_no",   t:"long",  q:"Are there sectors or business models you would not consider? Why?", lim:1200}
 ]},
 {h:"10. Strategic Situation Relevance",
  note:"Boards frequently appoint directors because their experience is particularly relevant to a foreseeable challenge, transition, or opportunity.", f:[
  {id:"s_sit",  t:"multi", q:"During which situations would your experience become especially valuable?", help:"Select no more than three:", r:1, cap:3,
   o:["Rapid growth","Enterprise transformation","Operational underperformance","Turnaround or restructuring","CEO succession","Founder transition","Leadership team buildout","International expansion","M&A","Post-merger integration","IPO preparation","Public-to-private transition","Private equity value creation","Capital constraints","Regulatory change","Digital transformation","Artificial intelligence adoption","Cybersecurity exposure","Supply-chain disruption","Product commercialization","Go-to-market transformation","New market entry","Crisis or reputational event","Other"], other:1},
  {id:"s_each", t:"perSel", src:"s_sit", q:"For each selected situation, briefly describe:",
   help:"The experience you have navigating it; the decisions you made or influenced; the results achieved; the lessons relevant to board oversight.", r:1, lim:2500},
  {id:"s_cent", t:"long",  q:"Which one of these situations should be most central to your board positioning? Why?", r:1, lim:1200}
 ]}]},

/* ---------- STEP 6 — sections 11, 12, 13, 14 ---------- */
{n:6, title:"Appointment thesis and target board profile",
 intro:"The board-level problem you are equipped to help solve, and the organisations most likely to need it.",
 groups:[
 {h:"11. Board Appointment Thesis", f:[
  {id:"t_prob", t:"long", q:"What board-level problem are you unusually well equipped to help an organization solve?", r:1, lim:2500},
  {id:"t_why",  t:"long", q:"Why would a board choose you over another accomplished executive from your industry?", r:1, lim:2500},
  {id:"t_caps", t:"long", q:"Which two or three capabilities support that proposition?", r:1, lim:1200},
  {id:"t_evid", t:"long", q:"What evidence proves that you possess those capabilities?", r:1, lim:2500},
  {id:"t_orgs", t:"long", q:"Which types of organizations are most likely to need your experience?", r:1, lim:1200},
  {id:"t_enh",  t:"long", q:"What is the single greatest enhancement you could bring to a board?", r:1, lim:1200},
  {id:"t_s1",   t:"text", q:"I am best positioned to serve organizations that are:", r:1},
  {id:"t_s2",   t:"text", q:"I bring particular value in:", r:1},
  {id:"t_s3",   t:"text", q:"I am most relevant to organizations facing:", r:1},
  {id:"t_s4",   t:"text", q:"My strongest board contribution is:", r:1},
  {id:"t_s5",   t:"text", q:"The evidence supporting this contribution is:", r:1},
  {id:"t_s6",   t:"text", q:"My likely committee contribution is:", r:1},
  {id:"t_chg",  t:"long", q:"What would need to change in your current professional and personal commitments for you to serve effectively on a board, particularly during periods of increased demand?", r:1, lim:2500},
  {id:"t_cap",  t:"long", q:"If a board required significantly more time than expected because of a transaction, crisis, CEO transition, or regulatory issue, how much additional capacity could you realistically provide?", r:1, lim:1200},
  {id:"t_prop", t:"long", q:"In two or three sentences, describe the value you believe you would bring to a board.", r:1, lim:1200}
 ]},
 {h:"12. Target Board Profile", sub:"Ownership Environment", f:[
  {id:"o_env",  t:"multi",q:"Which board environments interest you most?", help:"Select all that apply:", r:1,
   o:["Public company","Privately held company","Private equity portfolio company","Venture-backed company","Founder-led company","Family-owned company","Advisory board","Nonprofit or mission-driven organization","Government or public-sector organization","Other"], other:1},
  {id:"o_two",  t:"long", q:"Which two ownership environments are the strongest fit for you? Why?", r:1, lim:1200}
 ]},
 {h:"", sub:"Company Stage", f:[
  {id:"o_stage",t:"multi",q:"Which company stages are the strongest fit?", help:"Select all that apply:", r:1,
   o:["Early stage","Venture growth","Scale-up","Mid-market","Large enterprise","Pre-transaction","Post-transaction","Pre-IPO","Public company","Turnaround","Mature or stable enterprise"]},
  {id:"o_scale",t:"long", q:"What organization scale is most appropriate for your experience?",
   help:"Consider: revenue; enterprise value; market capitalization; employee count; geographic footprint; operational complexity.", r:1, lim:1200}
 ]},
 {h:"", sub:"Geography", f:[
  {id:"o_geo",  t:"multi",q:"What geographic scope would you be comfortable supporting?", r:1,
   o:["Local","National","North American","European","Asia-Pacific","Global","Other"], other:1},
  {id:"o_where",t:"long", q:"Which countries or regions are most relevant to your experience?", r:1, lim:1200},
  {id:"o_not",  t:"long", q:"Are there countries or regions where you would be unable or unwilling to serve?", lim:1200}
 ]},
 {h:"", sub:"Strategic Priorities", f:[
  {id:"o_acc",  t:"long", q:"What would your ideal organization likely be trying to accomplish during your tenure?", r:1, lim:1200},
  {id:"o_known",t:"long", q:"What contribution would you want to be known for?", r:1, lim:1200},
  {id:"o_cred", t:"long", q:"What type of first or next board role would be credible within the next one to two years?", r:1, lim:1200},
  {id:"o_str",  t:"long", q:"What type of appointment would represent an appropriate stretch?", lim:1200}
 ]},
 {h:"13. First-Seat Strategy and Trade-Offs", f:[
  {id:"fs_one", t:"one",  q:"Which factor matters most in your first or next board appointment?", help:"Select one:", r:1,
   o:["Quality of the organization","Sector relevance","Governance experience","Committee experience","Public-company credibility","Private equity exposure","Compensation","Equity participation","Mission","Network value","International exposure","Strategic complexity"]},
  {id:"fs_three",t:"multi",q:"Which three additional factors are most important?", r:1, cap:3,
   o:["Quality of the organization","Sector relevance","Governance experience","Committee experience","Public-company credibility","Private equity exposure","Compensation","Equity participation","Mission","Network value","International exposure","Strategic complexity"]},
  {id:"fs_comp",t:"long", q:"Which elements would you be willing to compromise on to secure the right developmental opportunity?", r:1, lim:1200},
  {id:"fs_small",t:"one", q:"Would you consider a smaller or less prominent organization to gain meaningful governance experience?", r:1,
   o:["Yes","No","Possibly"]},
  {id:"fs_small_x",t:"long", q:"Please explain.", r:1, lim:1200},
  {id:"fs_adv", t:"one",  q:"Would you consider an advisory appointment as a deliberate bridge to a fiduciary board role?", r:1,
   o:["Yes","No","Possibly"]},
  {id:"fs_np",  t:"one",  q:"Would you consider a nonprofit or mission-driven role if it offered substantive governance responsibility?", r:1,
   o:["Yes","No","Possibly"]},
  {id:"fs_min", t:"long", q:"What is the smallest organization or earliest company stage you would credibly support?", r:1, lim:1200},
  {id:"fs_wrongish",t:"long", q:"What opportunities might appear attractive but would not advance your longer-term board strategy?", lim:1200},
  {id:"fs_wrong",t:"long",q:"What would constitute the wrong first or next board appointment for you?", r:1, lim:1200}
 ]},
 {h:"14. Director and Committee Profile", f:[
  {id:"d_prof", t:"multi",q:"Which director profiles most closely align with your current experience?", help:"Select all that apply:", r:1,
   o:["Non-executive director","Independent director","Executive director","Investor-appointed director","Advisory director","Committee member","Committee chair","Lead director","Board chair"]},
  {id:"d_comm", t:"multi",q:"Which committees align most closely with your experience?", help:"Select no more than three:", r:1, cap:3,
   o:["Audit","Risk","Nomination and governance","Compensation or remuneration","Technology","Cybersecurity","Sustainability","Strategy","Finance","Investment","M&A","Human resources","Safety","Regulatory or compliance","Other"], other:1},
  {id:"d_now",  t:"long", q:"Where could you contribute immediately?", r:1, lim:1200},
  {id:"d_dev",  t:"long", q:"Where would you need further exposure or development?", r:1, lim:1200},
  {id:"d_entry",t:"long", q:"Which committee could provide the most credible initial entry point?", r:1, lim:1200},
  {id:"d_long", t:"long", q:"Which committee or leadership role could become realistic over the longer term?", lim:1200}
 ]}]},
/* ---------- STEP 7 — sections 15, 16, 17 ---------- */
{n:7, title:"Market perception, availability, self-assessment",
 intro:"How the market reads you today, what you are able to commit, and an honest view of your readiness.",
 groups:[
 {h:"15. Market Perception and Positioning",
  note:"How do you believe the following groups would describe you?", f:[
  {id:"k_ceo",  t:"long", q:"CEOs and senior executives", r:1, lim:1200},
  {id:"k_chair",t:"long", q:"Board chairs and directors", r:1, lim:1200},
  {id:"k_inv",  t:"long", q:"Investors or owners", r:1, lim:1200},
  {id:"k_coll", t:"long", q:"Current and former colleagues", r:1, lim:1200},
  {id:"k_three",t:"long", q:"What three qualities would these groups most consistently associate with your leadership?", r:1, lim:1200},
  {id:"k_perc", t:"multi",q:"How are you currently perceived in the market?", help:"Select up to three:", r:1, cap:3,
   o:["Enterprise leader","P&L operator","Functional specialist","Sector expert","Transformation leader","Growth executive","Technology leader","Financial leader","Governance leader","Founder or entrepreneur","Investor","Adviser","Other"], other:1},
  {id:"k_narrow",t:"long",q:"Where might your experience appear narrower than it actually is?", r:1, lim:1200},
  {id:"k_under",t:"long", q:"What parts of your experience may be misunderstood or undervalued?", r:1, lim:1200},
  {id:"k_conc", t:"long", q:"What concerns or questions might a nominating committee have about your candidacy?", r:1, lim:1200},
  {id:"k_hist", t:"long", q:"Are there elements of your career history that may require explanation or careful positioning?", lim:1200},
  {id:"k_over", t:"long", q:"What evidence could overcome any perceived gaps?", r:1, lim:1200},
  {id:"k_comp", t:"long", q:"What would make you clearly more compelling than another candidate with similar experience?", r:1, lim:1200}
 ]},
 {h:"16. Practical Readiness and Availability", f:[
  {id:"r_emp",  t:"one",  q:"Has your current employer formally confirmed that you may accept an outside board appointment?", r:1,
   o:["Yes","No","Formal approval would be required","I have not yet confirmed","Not applicable"]},
  {id:"r_avail",t:"one",  q:"When would you realistically be available to accept an appointment?", r:1,
   o:["Immediately","Within six months","Within 12 months","Within 24 months","Longer-term"]},
  {id:"r_how",  t:"text", q:"How many board appointments could you responsibly hold?", r:1},
  {id:"r_trav", t:"one",  q:"What level of travel would you accept?", r:1,
   o:["Limited local travel","Domestic travel","North American travel","International travel","Extensive global travel"]},
  {id:"r_inp",  t:"one",  q:"Would you be available for regular in-person board and committee meetings?", r:1,
   o:["Yes","No","Depending on location"]},
  {id:"r_surge",t:"one",  q:"During a transaction, crisis, CEO transition, investigation, restructuring, or regulatory event, could you accommodate a material increase in board responsibilities?", r:1,
   o:["Yes","No","Depending on the circumstances"]},
  {id:"r_lim",  t:"long", q:"Please explain any limitations.", lim:1200},
  {id:"r_restr",t:"one",  q:"Are you currently aware of any employer, competitive, regulatory, geographic, or other restrictions that could affect your ability to serve?", r:1,
   o:["Yes","No","Unsure"]},
  {id:"r_ctx",  t:"long", q:"Please provide appropriate context.", r:1, lim:2500,
   showIf:{f:"r_restr", is:["Yes","Unsure"]}}
 ]},
 {h:"17. Board Readiness Self-Assessment",
  note:"Rate each area from 1 to 5. 1: Limited exposure. 2: Developing. 3: Credible. 4: Strong. 5: Highly developed.", f:[
  {id:"z_overall", t:"scale", q:"Overall board readiness", r:1},
  {id:"z_strat",   t:"scale", q:"Enterprise strategic thinking", r:1},
  {id:"z_fin",     t:"scale", q:"Financial acumen", r:1},
  {id:"z_lit",     t:"scale", q:"Financial statement literacy", r:1},
  {id:"z_cap",     t:"scale", q:"Capital allocation", r:1},
  {id:"z_gov",     t:"scale", q:"Governance and fiduciary understanding", r:1},
  {id:"z_risk",    t:"scale", q:"Risk oversight", r:1},
  {id:"z_stake",   t:"scale", q:"Stakeholder engagement", r:1},
  {id:"z_ind",     t:"scale", q:"Industry expertise", r:1},
  {id:"z_judg",    t:"scale", q:"Leadership judgment", r:1},
  {id:"z_pres",    t:"scale", q:"Executive presence", r:1},
  {id:"z_chal",    t:"scale", q:"Constructive challenge", r:1},
  {id:"z_list",    t:"scale", q:"Listening and inquiry", r:1},
  {id:"z_cons",    t:"scale", q:"Consensus building", r:1},
  {id:"z_succ",    t:"scale", q:"CEO and executive succession", r:1},
  {id:"z_crisis",  t:"scale", q:"Crisis oversight", r:1},
  {id:"z_indep",   t:"scale", q:"Independence of thought", r:1},
  {id:"z_bound",   t:"scale", q:"Understanding of board-management boundaries", r:1},
  {id:"z_first",   t:"long",  q:"Which two areas should you strengthen first?", r:1, lim:1200},
  {id:"z_evid",    t:"long",  q:"What evidence supports your strongest ratings?", r:1, lim:2500},
  {id:"z_diff",    t:"long",  q:"Where might others assess your readiness differently?", lim:1200},
  {id:"z_edu",     t:"long",  q:"What governance education, exposure, or experience would be most valuable?", r:1, lim:1200}
 ]}]},

/* ---------- STEP 8 — sections 18, 19, 20, 21 ---------- */
{n:8, title:"Positioning, development, review priorities",
 intro:"Inputs for your board biography, the actions you are prepared to take, and the questions you want your strategy review to answer.",
 groups:[
 {h:"18. Board Biography and Positioning Inputs", f:[
  {id:"y_caps", t:"multi",q:"Which capabilities should be most prominent in your board biography?", help:"Select no more than five:", r:1, cap:5,
   o:["Enterprise strategy","Financial oversight","Governance","Risk management","Transformation","M&A","Operations","Growth and commercialization","Talent and succession","Digital and technology","Artificial intelligence","Cybersecurity","International growth","ESG and sustainability","Regulatory leadership","Crisis management","Private equity value creation","Founder support","Other"], other:1},
  {id:"y_ind",  t:"long", q:"Which industries should be emphasized?", r:1, lim:1200},
  {id:"y_own",  t:"long", q:"Which ownership environments should be emphasized?", r:1, lim:1200},
  {id:"y_geo",  t:"long", q:"Which geographic experience should be emphasized?", r:1, lim:1200},
  {id:"y_acc",  t:"long", q:"Which accomplishments must appear?", r:1, lim:2500},
  {id:"y_met",  t:"long", q:"Which metrics or indicators of scale should appear?",
   help:"Examples may include: revenue; P&L responsibility; enterprise value; capital deployed; employees; countries; facilities; transactions; growth achieved; margin improvement; organizational transformation.", r:1, lim:2500},
  {id:"y_orgs", t:"long", q:"Which current or former organizations provide the strongest credibility?", r:1, lim:1200},
  {id:"y_must", t:"long", q:"Is there anything that must be represented in your board biography?", lim:1200},
  {id:"y_min",  t:"long", q:"Is there anything that should be minimized, reframed, or excluded?", lim:1200},
  {id:"y_c1",   t:"text", q:"My target board environments are:", r:1},
  {id:"y_c2",   t:"text", q:"My likely committee contribution is:", r:1},
  {id:"y_c3",   t:"text", q:"My near-term board goal is:", r:1},
  {id:"y_c4",   t:"text", q:"My longer-term board aspiration is:", r:1},
  {id:"y_c5",   t:"text", q:"The three words I would want a board chair to associate with me are:", r:1}
 ]},
 {h:"19. Development and Activation Readiness", f:[
  {id:"v_done", t:"multi",q:"What actions have you already taken to pursue board service?", help:"Select all that apply:", r:1,
   o:["Developed a board biography","Developed a board résumé","Completed governance education","Joined a fiduciary board","Joined an advisory board","Contacted executive search firms","Spoke with directors or chairs","Approached private equity or venture firms","Requested introductions","Attended governance events","Published thought leadership","Joined professional associations","Pursued nonprofit governance experience","No formal action yet","Other"], other:1},
  {id:"v_block",t:"long", q:"What has prevented you from making greater progress?", r:1, lim:1200},
  {id:"v_time", t:"text", q:"How much time are you willing to dedicate each month to board development?", r:1},
  {id:"v_next", t:"multi",q:"Which actions are you prepared to undertake during the next 12 months?", help:"Select all that apply:", r:1,
   o:["Refine my board proposition","Develop a board-specific biography","Develop a board-specific résumé","Complete governance education","Request references","Reconnect with relevant relationships","Build relationships with board chairs","Build relationships with investors","Attend targeted events","Publish thought leadership","Speak at events","Participate in peer forums","Pursue advisory experience","Pursue nonprofit governance experience","Consider a smaller initial board","Other"], other:1},
  {id:"v_a1",   t:"text", q:"Action 1", help:"Three actions you are personally prepared to complete within the next 90 days.", r:1},
  {id:"v_a2",   t:"text", q:"Action 2", r:1},
  {id:"v_a3",   t:"text", q:"Action 3", r:1},
  {id:"v_supp", t:"multi",q:"What support would be most valuable from Project Alpha?", help:"Select up to five:", r:1, cap:5,
   o:["Board readiness assessment","Board-market perspective","Target board profile","Board appointment thesis","Board biography","Board résumé","LinkedIn positioning","Governance education recommendations","Committee positioning","Relationship mapping","Introduction strategy","Private equity positioning","Public-company positioning","Advisory board strategy","First-seat strategy","Interview preparation","Board opportunity diligence","Ongoing accountability","Other"], other:1},
  {id:"v_meas", t:"long", q:"How would you like progress to be measured over the next year?", r:1, lim:1200}
 ]},
 {h:"20. Strategy Review Priorities", f:[
  {id:"q_q1",   t:"long", q:"Question 1", help:"The three most important questions you would like addressed during your Project Alpha strategy review.", r:1, lim:1200},
  {id:"q_q2",   t:"long", q:"Question 2", r:1, lim:1200},
  {id:"q_q3",   t:"long", q:"Question 3", r:1, lim:1200},
  {id:"q_succ", t:"long", q:"What would a successful Project Alpha strategy review produce for you?", r:1, lim:2500},
  {id:"q_verb", t:"long", q:"Are there any sensitive matters you would prefer to discuss verbally rather than include in this workbook?", lim:1200},
  {id:"q_else", t:"long", q:"Is there anything else Christian & Timbers should understand about your aspirations, experience, readiness, or circumstances?", lim:2500}
 ]},
 {h:"21. Positioning and Market Engagement Permission", f:[
  {id:"pm_ok",  t:"one",  q:"How comfortable are you with Christian & Timbers confidentially testing your board positioning with selected trusted market relationships?", help:"Select one:", r:1,
   o:["Comfortable now","Comfortable after reviewing and approving my final positioning","Comfortable only with prior approval of each individual contact","Not comfortable at this stage"],
   note:"This question does not authorize Christian & Timbers to formally submit, nominate, or represent you for a specific appointment without appropriate discussion and authorization."}
 ]}]},

/* ---------- STEP 9 — section 22 ---------- */
{n:9, title:"Supporting documents",
 intro:"Attach your executive resume. Add any board biography or governance materials you already hold.",
 groups:[
 {h:"22. Supporting Documents", note:"Please attach the most current versions available. PDF or Word. Up to 15 MB per file.", f:[]},
 {h:"", sub:"Required", f:[
  {id:"u_req", t:"file", q:"Executive résumé or curriculum vitae", r:1, max:1}
 ]},
 {h:"", sub:"Optional", f:[
  {id:"u_opt", t:"file", q:"Optional", max:4,
   help:"Up to four files: existing board biography; existing board résumé; professional or corporate biography; current board profile; governance qualifications; published articles; speaking materials; other relevant supporting documents."}
 ]}]},

/* ---------- STEP 10 — review, acknowledgement, submit ---------- */
{n:10, title:"Review and submit",
 intro:"Review your answers before submitting. Edit any section, then confirm the acknowledgement.",
 review:1,
 groups:[
 {h:"Participant Acknowledgement", f:[
  {id:"ack", t:"ack", r:1,
   lines:[
    "I understand that Project Alpha is a board readiness, positioning, and relationship-development initiative.",
    "I understand that participation does not guarantee a board appointment, nomination, introduction, interview, or placement.",
    "I confirm that the information provided is accurate to the best of my knowledge and may be used by Christian & Timbers to support my confidential Project Alpha assessment and strategy review.",
    "I understand that Christian & Timbers does not have permission to formally submit, nominate, or represent me for a specific opportunity without prior discussion and my authorisation."
   ], label:"I agree"},
  {id:"ack_name", t:"text", q:"Participant name", r:1},
  {id:"ack_date", t:"date", q:"Date", r:1},
  {id:"mkt", t:"opt", q:"Optional. Send me Christian &amp; Timbers commentary on governance and the board market. This is separate from Project Alpha and has no bearing on your participation."}
 ]}]}
];

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
  var payload = {
    step: D.step,
    answers: Object.assign({}, D.data, { __files: D.files }),
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
    h += '<div class="pw-drop">PDF or Word. Up to 15 MB per file.<br><input type="file" id="'+f.id+'" accept=".pdf,.doc,.docx" '+(f.max>1?'multiple':'')+' style="margin-top:12px"></div>';
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
  var fill = window.__PA_DEV
    ? '<p style="margin-top:16px"><button class="pw-btn pw-btn--ghost" type="button" id="pw-fill-test">Fill test answers (dev)</button></p>'
    : '';
  return '<div class="pw-page">'
   + '<p class="pw-eyebrow">A Christian &amp; Timbers Initiative</p>'
   + '<h1 class="pw-h1">Board Aspiration and Readiness Workbook</h1>'
   + '<p class="pw-intro">Your answers inform a confidential Project Alpha strategy review and the development of your board readiness assessment, appointment thesis, target board profile, first-seat strategy, positioning, development priorities, and recommended next steps.</p>'
   + '<p class="pw-note" style="margin-top:22px">Answer candidly and with enough detail for a considered assessment. Where possible, support your answers with specific examples, measurable results, and organisational context.</p>'
   + '<p class="pw-note" style="margin-top:18px">Ten steps, approximately 45 to 60 minutes. Your answers save as you go, and a link returns you to where you stopped.</p>'
   + '<p class="pw-note" style="margin-top:18px">Participation does not guarantee a board appointment, nomination, introduction, interview, or placement.</p>'
   + '<p style="margin-top:38px"><button class="pw-btn" type="button" id="pw-begin">'
   + (D.step > 0 ? 'Continue where you stopped' : 'Begin')
   + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.4 12h15.2"/><path d="m13.8 6.4 5.8 5.6-5.8 5.6"/></svg></button></p>'
   + fill
   + '</div>';
}

function screenStep(s){
  var h = '<div class="pw-page">'
   + '<div class="pw-sum" id="pw-sum" role="alert" tabindex="-1"><strong id="pw-sum-t"></strong><ul id="pw-sum-l"></ul></div>'
   + '<p class="pw-eyebrow">Step ' + s.n + ' of 10</p>'
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
  return '<div class="pw-conf">'
   + '<p class="pw-eyebrow">Project Alpha</p>'
   + '<h1 class="pw-h1">Your workbook has been received</h1>'
   + '<p class="pw-ref">Reference ' + esc(D.ref) + '</p>'
   + '<p class="pw-intro" style="margin-top:34px">The Project Alpha team will review your responses and contact you within five business days to arrange your strategy review. A confirmation has been sent to ' + esc(email) + '.</p>'
   + '<p class="pw-note" style="margin-top:22px">Questions: <a href="mailto:projectalpha@christian-timbers.com" style="color:var(--ct-black);font-weight:700;box-shadow:inset 0 -8px 0 var(--ct-yellow);text-decoration:none">projectalpha@christian-timbers.com</a></p>'
   + '</div>';
}

/* ============================================================
   Paint
   ============================================================ */
function paintProgress(){
  var p = el('pw-prog'), n = el('pw-stepn');
  if (D.done || D.step === 0){ p.innerHTML = ''; n.textContent = ''; return; }
  var h = '';
  for (var i = 1; i <= 10; i++){
    h += '<i class="' + (i < D.step ? 'on' : i === D.step ? 'now' : '') + '"></i>';
  }
  p.innerHTML = h;
  n.textContent = 'Step ' + D.step + ' of 10';
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
  el('pw-next').innerHTML = (D.step === 10)
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
  if (b.id === 'pw-fill-test'){
    fillTestAnswers();
    return;
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

/** Dev-only: fill every live field so you can jump to review/submit. */
function fillTestAnswers(){
  if (!window.__PA_DEV) return;
  function fillOne(f){
    if (!live(f)) return;
    if (f.t === 'multi'){
      var n = f.cap || 1;
      D.data[f.id] = (f.o || []).slice(0, n);
      if (f.other && D.data[f.id].indexOf('Other') > -1) D.data[f.id + '_other'] = 'Test other';
    } else if (f.t === 'one'){
      D.data[f.id] = (f.o && f.o[0]) || 'Yes';
    } else if (f.t === 'scale'){
      D.data[f.id] = '3';
    } else if (f.t === 'ack' || f.t === 'opt'){
      D.data[f.id] = true;
    } else if (f.t === 'file'){
      if (!(D.files[f.id] || []).length){
        D.files[f.id] = [{ id: null, name: 'TEST-' + f.id + '.pdf' }];
      }
    } else if (f.t === 'perSel'){
      arr(f.src).forEach(function(o){
        D.data[f.id + '::' + o] = 'Test note for ' + o;
      });
    } else if (f.t === 'email'){
      D.data[f.id] = participant.email || 'test@example.com';
    } else if (f.t === 'date'){
      D.data[f.id] = new Date().toISOString().slice(0, 10);
    } else if (f.t === 'url'){
      D.data[f.id] = 'https://example.com';
    } else if (f.t === 'tel'){
      D.data[f.id] = '+1 415 000 0000';
    } else {
      D.data[f.id] = 'Test answer (' + f.id + ').';
    }
  }
  // Two passes: parents first, then showIf / perSel dependents
  [0, 1].forEach(function(){
    PA_STEPS.forEach(function(s){
      if (s.review) return;
      s.groups.forEach(function(g){ g.f.forEach(fillOne); });
    });
  });
  if (participant.name) D.data.p_name = participant.name;
  if (participant.email) D.data.p_email = participant.email;
  D.step = 10;
  persist();
  render();
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
  if (D.step === 10){
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