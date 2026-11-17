(function(root,factory){const e=factory();if(typeof module==='object'&&module.exports)module.exports=e;else root.InflationCity=e;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const COLORS={housing:'#ff5c69',retail:'#ffba24',transport:'#2785ff',energy:'#08ba8b',tech:'#8859ff',community:'#f84fc4'};
const board=[
['start','PAYDAY','💵'],['property','Starter Home','🏠', 'housing',800,105],['event','Life Happens','🎲'],['property','Apartment Block','🏢','housing',1050,135],['bill','Grocery Bill','🛒',null,180],['property','Bus Network','🚌','transport',750,95],['property','EV Charging Hub','⚡','transport',1000,130],['event','Market News','📰'],['corner','PUBLIC PARK','🌳'],
['property','Discount Market','🛍️','retail',850,110],['property','Coffee Shop','☕','retail',950,120],['bill','Insurance Premium','🛡️',null,230],['property','Shopping Center','🏬','retail',1300,175],['event','Life Happens','🎲'],['property','Solar Farm','☀️','energy',1100,145],['property','Battery Storage','🔋','energy',1400,185],['corner','CREDIT CHECK','💳'],
['property','Cloud Data Center','🖥️','tech',1450,195],['event','Market News','📰'],['property','AI Startup','🤖','tech',1650,230],['irs','IRS AUDIT','🏛️'],['property','Fiber Network','📡','tech',1250,165],['event','Life Happens','🎲'],['property','Urgent Care','🏥','community',1200,155],['corner','EMERGENCY FUND','🧰'],
['property','Childcare Center','🧸','community',1000,130],['property','Trade School','🛠️','community',1350,175],['bill','Utility Bill','💡',null,220],['property','Commuter Rail','🚆','transport',1450,190],['event','Market News','📰'],['property','Townhomes','🏘️','housing',1550,205],['property','Wind Farm','🌬️','energy',1600,215]
].map((a,i)=>({id:i,type:a[0],name:a[1],icon:a[2],group:a[3]||null,price:a[4]||0,rent:a[5]||0}));
const groups=Object.keys(COLORS);
const events=[
{kind:'life',title:'Grocery shock',text:'A supply disruption raises your weekly grocery costs.',cash:-240},
{kind:'life',title:'Skills pay off',text:'Your new certification earns a one-time bonus.',cash:420},
{kind:'life',title:'Car repair',text:'A surprise repair reminds you why an emergency fund matters.',cash:-380},
{kind:'life',title:'Tax refund',text:'You receive a refund after filing your taxes.',cash:340},
{kind:'life',title:'Rent increase',text:'Your landlord raises your housing costs.',cash:-300},
{kind:'life',title:'Side hustle',text:'A weekend gig boosts your disposable income.',cash:280},
{kind:'life',title:'Medical deductible',text:'An unexpected appointment costs more than expected.',cash:-450},
{kind:'life',title:'Energy rebate',text:'An efficiency program reduces your household expenses.',cash:250},
{kind:'market',title:'Supply chain crunch',text:'Higher shipping costs push prices up across the economy.',inflation:0.025},
{kind:'market',title:'Productivity boom',text:'Better technology reduces production costs.',inflation:-0.015},
{kind:'market',title:'Interest rate hike',text:'Borrowing becomes more expensive.',rate:0.01},
{kind:'market',title:'Interest rate cut',text:'Borrowing becomes cheaper.',rate:-0.01},
{kind:'market',title:'Wage agreement',text:'Workers negotiate a higher paycheck.',wage:100},
{kind:'market',title:'Energy shortage',text:'Energy and shipping costs lift the price level.',inflation:0.02},
{kind:'market',title:'Consumer slowdown',text:'Weaker demand eases price pressure.',inflation:-0.01},
{kind:'market',title:'Hiring surge',text:'Competition for workers raises wages.',wage:75}
];
// Fictional simulation values; all cash effects are CPI-adjusted.
const extraLife=[
['🦷 Dental emergency','A cracked tooth requires an unexpected treatment.',-520],['💻 Laptop replacement','Your computer fails during a work deadline.',-390],['🛠️ Overtime shift','Extra hours bring in additional earnings.',310],['🚗 Insurance deductible','A minor accident requires an out-of-pocket payment.',-480],['🎓 Scholarship award','A training scholarship covers part of your education.',600],['📱 Phone repair','A broken screen needs replacing.',-170],['💼 Job interview travel','Travel and interview expenses add up.',-120],['🎁 Birthday gift','A relative gives you cash for your birthday.',150],['🐾 Veterinary visit','Your pet needs unexpected treatment.',-320],['🏠 Water leak','A plumbing repair cannot wait.',-440],['🚲 Transit savings','You switch to a cheaper way to commute.',190],['💰 Performance bonus','Your employer rewards strong performance.',550],['📦 Moving expenses','A new lease requires moving costs.',-650],['🔌 Appliance breakdown','Your refrigerator stops working.',-470],['🧾 Billing correction','An overpayment is returned to you.',230],['👶 Childcare gap','A last-minute childcare arrangement costs extra.',-290],['🛍️ Resale success','You sell unused belongings online.',260],['🛠️ Union contract back pay','A new agreement includes a retroactive payment.',480],['🌡️ Heat wave bills','Extra cooling increases your electricity bill.',-210],['🏥 Paid sick leave','Your employer restores wages for a missed shift.',240],['📉 Reduced work hours','Your employer cuts your scheduled hours.',-510],['🧑‍💻 Freelance contract','A client pays you for a completed project.',460],['🏦 Bank fee reversal','Your bank refunds an erroneous fee.',85],['🧳 Family travel emergency','You need to travel on short notice.',-370],['🧯 Home safety repair','You replace a faulty electrical component.',-280],['🎨 Community prize','Your project wins a local competition.',350],['📚 Textbook expense','A required course needs new materials.',-160],['🚘 Registration renewal','Vehicle registration is due.',-260],['🧑‍🍳 Meal planning savings','Buying in bulk lowers your food expenses.',140],['🌱 Garden harvest','Homegrown food reduces your grocery spending.',110],['🧑‍🔧 Apprenticeship bonus','Your employer rewards a completed training milestone.',500],['💳 Fraud reimbursement','Your bank returns money from an unauthorized charge.',400],['🏚️ Security deposit dispute','Your landlord withholds part of a deposit.',-340],['📡 Internet outage','A service disruption costs you a work assignment.',-220],['🚌 Commuter benefit','Your employer offers a transportation stipend.',210],['🧑‍⚕️ Health insurance rebate','Your insurer issues a premium refund.',330],['🛒 Bulk discount','A cooperative purchasing program saves you money.',120],['📈 Investment dividend','A small investment pays a dividend.',275],['🏦 Unexpected overdraft','An automatic payment creates a bank fee.',-95],['💸 Student loan payment','A scheduled education payment comes due.',-300],['🌧️ Storm damage','Your belongings need replacement after a storm.',-420],['🎉 Referral reward','A successful employee referral earns a bonus.',380],['🔧 Tire replacement','Worn tires need replacing before your next commute.',-450],['🤝 Mutual aid payment','A community assistance program helps with bills.',300],['📦 Package theft','A missing delivery must be replaced.',-130],['💼 Promotion award','A new role comes with a signing award.',700]
].map(([title,text,cash])=>({kind:'life',title,text,cash}));
extraLife.push(...[["Layoff notice", "Your employer eliminates your position; you cover a gap in income.", -850], ["New job offer", "A new employer offers a signing bonus.", 800], ["AI retraining voucher", "A workforce program pays for your new technical skills.", 450], ["Automation displacement", "Your hours are cut while you retrain for a new role.", -520], ["Affordable housing grant", "You qualify for a one-time housing assistance payment.", 650], ["Renters insurance claim", "Your insurer reimburses a covered loss.", 420], ["Uninsured flood damage", "You replace belongings after water damage.", -740], ["Heat pump incentive", "A household energy upgrade earns a rebate.", 380], ["Utility deposit", "A new utility account requires a deposit.", -180], ["Water conservation rebate", "Water-saving fixtures qualify for a rebate.", 155], ["Grocery coupon windfall", "A grocery rewards program pays off.", 95], ["Food price squeeze", "Your usual grocery budget no longer covers necessities.", -195], ["Public transit pass", "A discounted transit pass saves money.", 185], ["Missed bus connection", "You pay for an emergency ride to work.", -80], ["Car battery failure", "You pay for a replacement battery.", -310], ["Parking ticket", "An unexpected parking citation comes due.", -95], ["Carpool savings", "Sharing rides reduces your transportation costs.", 165], ["Fuel price jump", "A spike in gasoline prices raises your commute costs.", -220], ["EV charging credit", "Your utility offers a charging credit.", 200], ["Car theft deductible", "You pay the deductible after your vehicle is recovered.", -650], ["Overtime cancelled", "A planned extra shift is cancelled.", -240], ["Holiday premium pay", "You earn extra pay for working a holiday.", 360], ["Paid internship", "A short internship provides a stipend.", 480], ["Professional license renewal", "Your occupational license renewal is due.", -210], ["Tool replacement", "Your work tools break and need replacing.", -315], ["Work uniform allowance", "Your employer reimburses uniform expenses.", 145], ["Unpaid sick day", "You miss a shift without paid leave.", -190], ["Telehealth savings", "A low-cost virtual appointment saves money.", 110], ["Prescription price increase", "A recurring prescription costs more this month.", -175], ["Physical therapy copay", "A course of treatment brings extra copays.", -270], ["Vision exam and glasses", "You need a new prescription and glasses.", -330], ["Dependent care reimbursement", "Your employer reimburses qualifying childcare costs.", 390], ["School supply drive", "A community program covers school supplies.", 125], ["Summer camp deposit", "You must pay for a childcare program.", -330], ["Family caregiver stipend", "A local program supports your caregiving work.", 440], ["Emergency pet boarding", "A work trip requires unexpected pet care.", -210], ["Pet insurance claim", "Your insurance reimburses veterinary costs.", 285], ["Washing machine failure", "Your laundry equipment needs repairs.", -390], ["Furniture resale", "You sell furniture before a move.", 230], ["Home weatherization", "A grant covers part of your energy improvements.", 340], ["Pest control visit", "A household pest problem requires treatment.", -260], ["Rental application fees", "Several rental applications require fees.", -160], ["Shared housing savings", "A roommate shares household expenses.", 370], ["Short-notice relocation", "A job change requires an urgent move.", -680], ["Credit card annual fee", "A card membership fee comes due.", -120], ["Identity theft recovery", "Replacing documents and lost work time costs money.", -350], ["Unclaimed property refund", "The state returns forgotten funds.", 260], ["Deposit interest payout", "Your savings account pays interest.", 130], ["Credit union dividend", "Your credit union distributes a member dividend.", 160], ["Cancelled subscription savings", "You cut recurring subscriptions and keep the savings.", 115], ["Digital subscription increase", "Several services raise their prices.", -90], ["Online marketplace sale", "A buyer purchases your used equipment.", 300], ["Small business grant", "Your side business receives a local grant.", 560], ["Small business permit", "Your side business must renew a permit.", -240], ["Cancelled client project", "A client cancels a job you expected to complete.", -450], ["Freelance referral", "A referral brings you a new paid assignment.", 410], ["Disaster supply kit", "You purchase emergency supplies for your household.", -180], ["Community recovery work", "A relief project pays you for temporary work.", 450], ["Travel reimbursement", "Your employer reimburses a business trip.", 310], ["Family celebration expenses", "A major family event adds to your budget.", -290]].map(([title,text,cash])=>({kind:"life",title,text,cash})));
events.push(...extraLife);
const surpriseEvents=[
{title:'RECESSION ALERT',text:'Demand falls and employers cut hours. Asset valuations decline.',scope:'city',cash:-330,market:-.12,wage:-150},
{title:'INFLATION SURGE',text:'A supply shock drives up everyday prices while wages remain unchanged.',scope:'city',inflation:.075},
{title:'HOUSING MARKET CRASH',text:'Housing prices fall as buyers retreat. Housing owners lose equity.',scope:'city',sector:'housing',sectorChange:-.28},
{title:'EMERGENCY STIMULUS',text:'A relief package delivers direct payments to households.',scope:'city',cash:650},
{title:'WILDFIRE EMERGENCY',text:'Evacuations and supply disruption create emergency expenses for several households.',scope:'group',cash:-540,inflation:.025},
{title:'INTEREST RATE EMERGENCY',text:'The central bank raises rates to fight inflation. Borrowing costs rise.',scope:'city',rate:.025},
{title:'RATE CUT',text:'The central bank reduces borrowing costs as the economy cools.',scope:'city',rate:-.02},
{title:'EARTHQUAKE RECOVERY',text:'Several households pay for repairs; rebuilding raises costs.',scope:'group',cash:-720,inflation:.035},
{title:'CLEAN ENERGY BOOM',text:'New investment increases energy infrastructure values.',scope:'city',sector:'energy',sectorChange:.22},
{title:'AI MARKET CORRECTION',text:'Technology investors reassess expectations. Tech asset prices fall.',scope:'city',sector:'tech',sectorChange:-.24},
{title:'WAGE GROWTH',text:'A tight labor market raises paychecks across the city.',scope:'city',wage:200},
{title:'COMMUNITY GRANTS',text:'A lottery awards economic recovery grants to several residents.',scope:'group',cash:580},
{title:'INSURANCE CRISIS',text:'Insurers increase premiums after a costly year.',scope:'city',cash:-260},
{title:'PRODUCTIVITY BREAKTHROUGH',text:'New technology lowers production costs and lifts asset values.',scope:'city',inflation:-.035,market:.08},
{title:'TRANSPORT STRIKE',text:'Some residents lose work hours and face extra travel costs.',scope:'group',cash:-310},
{title:'HOUSING CONSTRUCTION BOOM',text:'New housing supply reduces housing values and rents.',scope:'city',sector:'housing',sectorChange:-.13},
{title:'POWER GRID FAILURE',text:'Several households lose income and replace spoiled food.',scope:'group',cash:-290},
{title:'TOURISM SURGE',text:'Increased visitor spending boosts retail property values.',scope:'city',sector:'retail',sectorChange:.18},
{title:'TAX RELIEF',text:'A temporary tax credit boosts household cash.',scope:'city',cash:400},
{title:'BANKING CRUNCH',text:'Credit gets more expensive and investment values dip.',scope:'city',rate:.018,market:-.07},
{title:'FLOOD RECOVERY AID',text:'Selected households receive assistance after severe flooding.',scope:'group',cash:750},
{title:'ENERGY PRICE DROP',text:'Lower fuel costs ease inflation and household spending.',scope:'city',inflation:-.025,cash:120},
{title:'LOCAL FACTORY CLOSURE',text:'Several residents experience lost income.',scope:'group',cash:-620},
{title:'CHILDCARE EXPANSION',text:'New funding supports childcare and community services.',scope:'city',sector:'community',sectorChange:.17},
{title:'PUBLIC TRANSIT EXPANSION',text:'New transit investment raises transportation asset values.',scope:'city',sector:'transport',sectorChange:.20},
{title:'CONSUMER CONFIDENCE REBOUNDS',text:'Household demand recovers and asset valuations rise.',scope:'city',market:.10},
{title:'CYBERATTACK DISRUPTION',text:'Several households face lost earnings and replacement costs.',scope:'group',cash:-410},
{title:'GROCERY RELIEF',text:'A citywide food assistance credit offsets household costs.',scope:'city',cash:230},
...extraLife.map(e=>({...e,scope:'individual'})),
{title:'FOOD SUPPLY SHOCK',text:'Crop losses raise food costs across the city.',scope:'city',inflation:.045,cash:-140},
{title:'RENTAL ASSISTANCE PROGRAM',text:'Selected residents receive help with housing costs.',scope:'group',cash:620},
{title:'RETAIL DOWNTURN',text:'Households reduce discretionary purchases; retail assets decline.',scope:'city',sector:'retail',sectorChange:-.19},
{title:'TECH HIRING BOOM',text:'New technology jobs raise wages and tech valuations.',scope:'city',wage:125,sector:'tech',sectorChange:.15},
{title:'SEVERE STORM',text:'A storm damages homes and interrupts work for several residents.',scope:'group',cash:-480},
{title:'SUPPLY CHAINS RECOVER',text:'Transportation bottlenecks ease and prices decline.',scope:'city',inflation:-.04},
{title:'PUBLIC HEALTH COST SURGE',text:'Households face higher health expenses.',scope:'city',cash:-180},
{title:'INFRASTRUCTURE JOBS',text:'Several residents receive pay from temporary infrastructure work.',scope:'group',cash:510},
{title:'COMMERCIAL PROPERTY SLUMP',text:'Business property values weaken as demand drops.',scope:'city',market:-.09},
{title:'HOUSING RECOVERY',text:'Demand rebounds and housing equity increases.',scope:'city',sector:'housing',sectorChange:.18},
{title:'ENERGY GRID INVESTMENT',text:'New infrastructure supports energy companies and employment.',scope:'city',sector:'energy',sectorChange:.16,wage:75},
{title:'BROADBAND EXPANSION',text:'New connections lift the value of technology infrastructure.',scope:'city',sector:'tech',sectorChange:.12},
{title:'CHILDCARE COST SHOCK',text:'A shortage of childcare places raises expenses for selected households.',scope:'group',cash:-420},
{title:'EMERGENCY UTILITY CREDIT',text:'A relief program helps every resident cover utilities.',scope:'city',cash:275},
{title:'FUEL SUPPLY DISRUPTION',text:'Fuel shortages increase prices and transportation expenses.',scope:'city',inflation:.04,cash:-165},
{title:'COMMUNITY BUSINESS REVIVAL',text:'Local services expand, increasing community property values.',scope:'city',sector:'community',sectorChange:.16},
{title:'EXPORT DEMAND BOOM',text:'Strong demand increases business valuations and wages.',scope:'city',market:.11,wage:100},
{title:'EMERGENCY RELOCATION',text:'A local disaster forces selected residents to pay moving costs.',scope:'group',cash:-650},
{title:'TRANSPORTATION RELIEF',text:'Selected commuters receive a rebate.',scope:'group',cash:320},
{title:'DEMAND REBOUND',text:'Consumer spending increases prices and asset values.',scope:'city',inflation:.025,market:.09},
];
const roundEvents=[{title:'Sticky prices',text:'Prices continue to rise while wages lag.',inflation:.018},{title:'Supply bottleneck',text:'A shipping disruption raises the price level.',inflation:.032},{title:'Efficiency gains',text:'Production improvements lower some prices.',inflation:-.012},{title:'Demand cools',text:'Households spend less, easing inflation.',inflation:.005},{title:'Energy cost surge',text:'Higher fuel and electricity costs feed into prices.',inflation:.027},{title:'Wages catch up',text:'Pay increases, but prices still creep upward.',inflation:.012,wage:75},{title:'Steady growth',text:'Demand and supply grow at similar rates.',inflation:.009},{title:'Housing pressure',text:'Housing shortages push the price level higher.',inflation:.022}];

// Simplified fictional policy referendums for classroom economic decision-making.
const policies=[
 {title:'Living Wage Ordinance',question:'Should the city raise wages even if business costs also rise?',pro:'Higher earnings for workers',con:'Risk of higher prices',effect:{wage:250,inflation:.015}},
 {title:'Affordable Housing Initiative',question:'Should the city build additional housing using public funds?',pro:'Lower housing costs',con:'Public spending',effect:{sector:'housing',sectorChange:-.16,cash:-120}},
 {title:'Emergency Stimulus Vote',question:'Should the city distribute relief payments to all residents?',pro:'Immediate cash support',con:'Potential price pressure',effect:{cash:500,inflation:.02}},
 {title:'Clean Energy Investment',question:'Should residents fund renewable energy development?',pro:'Energy investments grow',con:'Upfront contribution',effect:{sector:'energy',sectorChange:.20,cash:-100}},
 {title:'Public Transit Expansion',question:'Should the city invest in better buses and trains?',pro:'Transport investments grow',con:'Public contribution',effect:{sector:'transport',sectorChange:.20,cash:-120}},
 {title:'Interest Relief Package',question:'Should the city negotiate a temporary cut in loan rates?',pro:'Lower credit costs',con:'Shared program costs',effect:{rate:-.015,cash:-80}},
 {title:'Small Business Grants',question:'Should the city provide grants to local shops?',pro:'Retail properties appreciate',con:'Shared cost',effect:{sector:'retail',sectorChange:.20,cash:-140}},
 {title:'Anti-Inflation Program',question:'Should the city prioritize reducing inflation over faster wage growth?',pro:'Slower price increases',con:'Lower paychecks',effect:{inflation:-.035,wage:-75}},
 {title:'Workforce Training Initiative',question:'Should residents fund career training and apprenticeships?',pro:'Long-term wage gains',con:'Immediate household cost',effect:{wage:170,cash:-140}},
 {title:'Community Healthcare Grant',question:'Should the city subsidize emergency healthcare costs?',pro:'Every resident receives relief',con:'Slight inflation risk',effect:{cash:260,inflation:.01}},
 {title:'Technology Innovation Fund',question:'Should the city back local technology and AI businesses?',pro:'Technology holdings appreciate',con:'Public investment costs',effect:{sector:'tech',sectorChange:.18,cash:-110}},
 {title:'Temporary Tax Refund',question:'Should the city return surplus revenue to households?',pro:'Households gain spending money',con:'Potential price pressure',effect:{cash:300,inflation:.012}}
];
const tokenColors=['#ff426a','#2668ff','#00a77d','#9839f5','#ef8d00','#ed3cad','#007ca4','#729b00','#df5832','#6154df','#00a7bd','#9d3964','#47598c','#a68900','#248d39','#7c4a39'];
const money=n=>Math.round(n);const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
function create(names,settings={}){if(!Array.isArray(names)||names.length<2||names.length>16)throw Error('Choose 2–16 players.');let clean=names.map(n=>String(n).trim().slice(0,24));if(clean.some(n=>!n)||new Set(clean.map(n=>n.toLowerCase())).size!==clean.length)throw Error('Player names must be unique and nonempty.');let rounds=Number(settings.rounds??6);if(![3,4,6,8,10,12].includes(rounds))throw Error('Invalid round count.');const start={version:9,createdAt:Date.now(),players:clean.map((name,i)=>({id:i,name,color:tokenColors[i],cash:5000,debt:0,pos:0,bankrupt:false,turns:0,irsVisits:0,disasters:0,qol:65,skipTurns:0,propertyBan:false})),assets:{},turn:0,round:1,maxRounds:rounds,phase:'roll',cpi:1,wage:1500,rate:.04,inflation:0,lastRoll:null,moveSeq:0,movement:null,voting:null,voteHistory:[],log:[],lastEvent:null,winner:null,revision:0,turnCount:0,news:[],newsSeq:0,logSeq:0,market:1,sectors:{},nextSurpriseAt:Date.now()+surpriseDelay(),lastSurprise:-1,resumePhase:null,decks:{},surpriseHistory:[],government:'democracy',leader:null,council:[],treasury:0,taxHistory:[],disaster:null,disasterSeq:0,requiredDisaster:false,governanceHistory:[],governmentBallots:0,leaderDecisions:0,lastGovElection:0,voteResumePhase:'roll',voteResumeTurn:0,dictatorPolicies:{healthcare:false,transport:false,housing:false},dictatorTaxExtra:0,dictatorTopic:null,dictatorDecisionCount:0,dictatorUsage:{},dictatorReignRound:null,nextRevolutionRound:null,revolution:null,revolutionHistory:[],judgment:null,judgmentHistory:[],disasterSites:{},repairHistory:[],soundSeq:0};openGovernmentVote(start,true);return start;}
function surpriseDelay(rng=Math.random){return 35000+Math.floor(rng()*45001);}
function ensure(s){if(!s.news)s.news=[];if(!Number.isInteger(s.newsSeq))s.newsSeq=0;if(!Number.isInteger(s.logSeq))s.logSeq=s.log.length;if(!s.market)s.market=1;if(!s.sectors)s.sectors={};if(!Number.isFinite(s.nextSurpriseAt))s.nextSurpriseAt=Date.now()+surpriseDelay();if(s.lastSurprise===undefined)s.lastSurprise=-1;if(!s.decks)s.decks={};if(!Array.isArray(s.surpriseHistory))s.surpriseHistory=[];if(!Number.isInteger(s.moveSeq))s.moveSeq=0;if(!Array.isArray(s.voteHistory))s.voteHistory=[];if(s.voting===undefined)s.voting=null;if(!s.government)s.government='democracy';if(!Array.isArray(s.council))s.council=[];if(!Array.isArray(s.taxHistory))s.taxHistory=[];if(!Array.isArray(s.governanceHistory))s.governanceHistory=[];if(!Number.isInteger(s.disasterSeq))s.disasterSeq=0;if(s.treasury===undefined)s.treasury=0;if(!s.disasterSites)s.disasterSites={};if(!s.dictatorPolicies)s.dictatorPolicies={healthcare:false,transport:false,housing:false};if(!s.dictatorUsage)s.dictatorUsage={};if(!s.revolutionHistory)s.revolutionHistory=[];if(!s.judgmentHistory)s.judgmentHistory=[];if(s.judgment===undefined)s.judgment=null;if(!s.repairHistory)s.repairHistory=[];if(s.dictatorTaxExtra===undefined)s.dictatorTaxExtra=0;if(s.dictatorDecisionCount===undefined)s.dictatorDecisionCount=0;for(const p of s.players){p.irsVisits??=0;p.disasters??=0;p.qol??=65;p.skipTurns??=0;p.propertyBan??=false;}return s;}
function log(s,text,kind='info',meta={}){ensure(s);s.log.unshift({text,kind,round:s.round,id:++s.logSeq,...meta});if(s.log.length>1800)s.log.pop();}
function announce(s,title,text,kind='info',major=false,meta={}){ensure(s);s.news.unshift({id:++s.newsSeq,title,text,kind,major,round:s.round,...meta});if(s.news.length>300)s.news.pop();}
function transaction(s,title,text,kind,meta={}){log(s,text,kind,meta);announce(s,title,text,kind,false,meta);}
function price(s,id){let b=board[id];return money(b.price*s.cpi*(b.type==='property'?(s.market||1)*(s.sectors?.[b.group]||1):1));}
function groupComplete(s,owner,g){return board.filter(b=>b.group===g).every(b=>s.assets[b.id]?.owner===owner);}
function rent(s,id){let a=s.assets[id];if(!a||socialPublic(s,id)||s.disasterSites?.[id]||(s.government==='dictatorship'&&s.dictatorPolicies?.transport&&board[id]?.group==='transport'))return 0;return money((s.government==='oligarchy'&&s.council.includes(a.owner)?1.25:1)*board[id].rent*s.cpi*(s.sectors?.[board[id].group]||1)*(1+a.level*.55)*(groupComplete(s,a.owner,board[id].group)?1.5:1));}
function repairCost(s,id){let d=s.disasterSites?.[id];return d?money((price(s,id)*(.19+Math.max(1,d.severity)*.14)+75)):0;}
function upgradeCost(s,id){let a=s.assets[id];return money(price(s,id)*.45*(s.government==='oligarchy'&&s.council.includes(a?.owner)?.75:1));}
function assetValue(s,id){let a=s.assets[id];return a?money((price(s,id)+a.level*price(s,id)*.45)*Math.max(.55,1-(a.damage||0)*.18)):0;}
function net(s,p){return p.cash-p.debt+Object.keys(s.assets).filter(id=>s.assets[id].owner===p.id).reduce((v,id)=>v+assetValue(s,+id),0);}
function current(s){return s.players[s.turn];}
function changeQoL(p,delta){p.qol=clamp((p.qol??65)+delta,0,100);}
const GOVERNMENTS={
 democracy:{label:'Representative democracy',icon:'🗳️',description:'One resident, one vote. Moderate income and property taxes; policy referendums decide citywide changes.',tax:'6% wage + 1.5% property value'},
 socialism:{label:'Public-service socialism',icon:'🏥',description:'One resident, one vote. Higher progressive taxes fund universal health and transport services, plus cash benefits.',tax:'14% wage + 2.5% property value; wealth surcharge'},
 dictatorship:{label:'Dictatorship',icon:'👑',description:'A randomly selected ruler controls policy, can confiscate property or money, and decides how to spend or divert public funds.',tax:'Citizens 10% wage + 2.5% property value; ruler fully exempt'},
 oligarchy:{label:'Oligarchy',icon:'💎',description:'Two or three major property owners form a ruling council. Their ballots carry extra weight and their assets receive advantages.',tax:'Council: 4% wage + 0.5% property; others: 14% + 3%'}
};
const GOVERNMENT_OPTIONS=Object.keys(GOVERNMENTS);
const IRS_OUTCOMES=[
 {title:'IRS tax refund',cash:340,icon:'✅'},
 {title:'Earned-income credit',cash:280,icon:'🟢'},
 {title:'Qualified deduction',cash:190,icon:'📄'},
 {title:'Overpayment corrected',cash:240,icon:'💵'},
 {title:'Back taxes owed',cash:-330,icon:'🧾'},
 {title:'Late-filing penalty',cash:-220,icon:'⚠️'},
 {title:'Incorrect withholding',cash:-270,icon:'📉'},
 {title:'Audit and records fee',cash:-180,icon:'🏛️'}
];
const DISASTERS=[
 {type:'wildfire',icon:'🔥',title:'WILDFIRE SPREADS',detail:'Wind-driven fire reaches commercial buildings. Businesses lose equipment and residents face evacuation expenses.',cost:245,damage:1,sector:'energy'},
 {type:'flood',icon:'🌊',title:'FLASH FLOOD EMERGENCY',detail:'Floodwater damages shops and roads, interrupting business operations and commutes.',cost:215,damage:1,sector:'retail'},
 {type:'quake',icon:'🌎',title:'EARTHQUAKE SHAKES THE CITY',detail:'A strong quake damages buildings and shuts down parts of the local economy.',cost:270,damage:1,sector:'housing'},
 {type:'surge',icon:'⚡',title:'POWER SURGE DAMAGES BUSINESSES',detail:'A city grid failure destroys electronics and temporarily disrupts commerce.',cost:190,damage:1,sector:'tech'}
];
function ownedCount(s,id){return Object.values(s.assets).filter(a=>a.owner===id).length;}
function richCouncil(s){let active=s.players.filter(p=>!p.bankrupt).sort((a,b)=>ownedCount(s,b.id)-ownedCount(s,a.id)||net(s,b)-net(s,a));return active.slice(0,Math.min(3,Math.max(2,active.length))).map(p=>p.id);}
function updateCouncil(s){if(s.government==='oligarchy')s.council=richCouncil(s);else s.council=[];}
function voteWeight(s,id,kind='policy'){
 if(kind==='government')return s.government==='oligarchy'&&s.council.includes(id)?Math.min(5,2+ownedCount(s,id)):1;
 if(s.government==='dictatorship')return id===s.leader?1:0;
 if(s.government==='oligarchy')return s.council.includes(id)?Math.min(5,2+ownedCount(s,id)):1;
 return 1;
}
function electedDictator(s,ballots,rng=Math.random){const alive=s.players.filter(p=>!p.bankrupt);return alive[Math.min(alive.length-1,Math.floor(rng()*alive.length))]?.id??0;}
function setGovernment(s,gov,actor,reason){if(!GOVERNMENTS[gov])throw Error('Unknown form of government.');let old=s.government;s.government=gov;s.leader=gov==='dictatorship'?actor:null;updateCouncil(s);s.governanceHistory.unshift({round:s.round,from:old,to:gov,leader:s.leader,council:[...s.council],reason});if(gov==='dictatorship'){s.dictatorReignRound=s.round;s.nextRevolutionRound=s.round+1+Math.floor(Math.random()*2);s.dictatorUsage={};s.dictatorTopic=null;s.dictatorTaxExtra=0;s.dictatorPolicies={healthcare:false,transport:false,housing:false};}else{s.nextRevolutionRound=null;s.dictatorTopic=null;s.dictatorTaxExtra=0;s.dictatorPolicies={healthcare:false,transport:false,housing:false};}let detail=gov==='dictatorship'?` Ruler: ${s.players[s.leader].name}.`:gov==='oligarchy'?` Council: ${s.council.map(id=>s.players[id].name).join(', ')}.`:'';transaction(s,'Government changed',`${GOVERNMENTS[gov].icon} ${GOVERNMENTS[gov].label} takes effect.${detail} ${GOVERNMENTS[gov].tax}.`,'event');announce(s,'🏛️ GOVERNMENT CHANGE: '+GOVERNMENTS[gov].label,`The city's governing rules have changed.${detail} ${GOVERNMENTS[gov].description}`,'event',true,{broadcast:true,scope:'city',who:'All residents',government:gov});}
function concentration(s){let all=Object.entries(s.assets);if(all.length<6)return null;let top=richCouncil(s).slice(0,3);if(top.length<2)return null;let shares=all.filter(([,a])=>top.includes(a.owner));let countShare=shares.length/all.length;let valueAll=all.reduce((x,[id])=>x+assetValue(s,+id),0);let valueShare=shares.reduce((x,[id])=>x+assetValue(s,+id),0)/Math.max(1,valueAll);let owners=top.filter(id=>ownedCount(s,id)>=2);return owners.length>=2&&countShare>=.65&&valueShare>=.60?{top,share:countShare,valueShare}:null;}
function checkOligarchy(s){if(s.government==='dictatorship'||s.government==='oligarchy') {updateCouncil(s);return;}let c=concentration(s);if(c){setGovernment(s,'oligarchy',null,`Automatic wealth concentration: ${Math.round(c.share*100)}% of bought properties owned by the leading investors.`);}}
function socialPublic(s,id){return s.government==='socialism'&&['transport','community'].includes(board[id]?.group);}
function purchaseCost(s,id,owner){let base=price(s,id);let cost=s.government==='dictatorship'?money(base*1.12):s.government==='oligarchy'&&s.council.includes(owner)?money(base*.88):base;return s.disasterSites?.[id]?money(cost*.60):cost;}
function taxDue(s,p){let income=s.wage,assets=Object.keys(s.assets).filter(id=>s.assets[id].owner===p.id).reduce((x,id)=>x+assetValue(s,+id),0),networth=Math.max(0,net(s,p));switch(s.government){
 case 'socialism':return money(income*.14+assets*.025+Math.max(0,networth-6500)*.045);
 case 'dictatorship':return money((p.id===s.leader?0:(.10+(s.dictatorTaxExtra||0)))*income+assets*(p.id===s.leader?0:.025));
 case 'oligarchy':return money(income*(s.council.includes(p.id)?.04:.14)+assets*(s.council.includes(p.id)?.005:.03));
 default:return money(income*.06+assets*.015);}}
function collectTaxes(s){let total=0,receipts=[];for(const p of s.players.filter(q=>!q.bankrupt)){let bill=taxDue(s,p);charge(s,p,bill,'bi-roundly city taxes',undefined,{quiet:true});total+=bill;receipts.push({id:p.id,name:p.name,paid:bill});}s.treasury+=total;let benefits=[];if(s.government==='socialism'){let recipients=s.players.filter(p=>!p.bankrupt),grant=Math.min(260,Math.floor(s.treasury/recipients.length));for(const p of recipients){p.cash+=grant;s.treasury-=grant;changeQoL(p,6);benefits.push({id:p.id,name:p.name,amount:grant});log(s,`${p.name} received $${grant} from the publicly funded service dividend.`,'good');}}s.taxHistory.unshift({round:s.round,government:s.government,receipts,total,benefits});transaction(s,'Tax collection round '+s.round,`Residents paid $${total.toLocaleString()} under ${GOVERNMENTS[s.government].label}. City treasury: $${s.treasury.toLocaleString()}.${benefits.length?' Public-service dividends were distributed.':''}`,'event',{type:'tax',receipts});announce(s,'🏛️ CITY TAX DAY',`Taxes collected from all residents: $${total.toLocaleString()}. Government: ${GOVERNMENTS[s.government].label}. ${benefits.length?'Residents also received publicly funded benefits.':''}`,'event',true,{broadcast:true,scope:'city',who:'All taxpayers'});}
function irsVisit(s,p,rng=Math.random,mandatory=false){if(p.bankrupt)return;if(s.government==='dictatorship'&&p.id===s.leader){log(s,`👑 ${p.name} is exempt from every IRS audit and tax assessment as the ruler.`,'event');p.irsExempt=true;return;}let result=draw(s,'irs',IRS_OUTCOMES,rng);let amount=money(Math.abs(result.cash)*s.cpi);p.irsVisits++;if(result.cash>0){p.cash+=amount;changeQoL(p,2);transaction(s,result.title,`🏛️ ${p.name} visited the IRS and received a ${result.title.toLowerCase()} of $${amount}.`,'good',{player:p.id,amount,type:'irs'});}else charge(s,p,amount,`IRS: ${result.title}`,undefined);log(s,`${p.name} completed ${mandatory?'a mandatory':'an'} IRS audit. IRS visits: ${p.irsVisits}.`,'event');}
function summonIRS(s,p,rng=Math.random){if(p.irsVisits>0||p.bankrupt)return false;if(s.government==='dictatorship'&&p.id===s.leader){p.irsExempt=true;log(s,`👑 ${p.name} received a mandatory IRS exemption under dictatorship.`,'event');return false;}let from=p.pos,steps=(20-from+board.length)%board.length;p.pos=20;s.moveSeq++;s.movement={seq:s.moveSeq,player:p.id,from,to:20,steps,dice:[],summons:true};irsVisit(s,p,rng,true);transaction(s,'Mandatory IRS visit',`${p.name} was summoned to the IRS and moved to the IRS space.`,'event',{player:p.id,type:'irs'});return true;}
function triggerDisaster(s,rng=Math.random,mandatory=false){
 ensure(s);let d=DISASTERS[Math.floor(rng()*DISASTERS.length)],props=board.filter(b=>b.type==='property'),start=props[Math.floor(rng()*props.length)].id;
 let affected=[];for(let i=0;i<8;i++){let id=(start+i)%board.length;if(board[id].type==='property')affected.push(id);}if(!affected.length)affected=[start];
 s.disasterSeq++;const at=Date.now();
 for(const [i,id] of affected.entries()){
  const previous=s.disasterSites[id];let severity=Math.min(3,(previous?.severity||0)+1+(rng()>.68?1:0));
  s.disasterSites[id]={type:d.type,icon:d.icon,severity,seq:s.disasterSeq,at:at+i*350,round:s.round,status:'CLOSED'};
  const a=s.assets[id];if(a){a.damage=severity;a.closed=true;a.level=Math.max(0,a.level-1);}
 }
 let impacts=[];for(const p of s.players.filter(q=>!q.bankrupt)){
  let exposed=affected.filter(id=>s.assets[id]?.owner===p.id);
  let cost=money((d.cost+(exposed.length?170*exposed.length:0))*s.cpi);
  charge(s,p,cost,d.title,undefined,{quiet:true});p.disasters++;
  changeQoL(p,s.government==='socialism'?-5:-8);
  impacts.push({id:p.id,name:p.name,amount:-cost,properties:exposed});
 }
 s.disaster={seq:s.disasterSeq,type:d.type,icon:d.icon,title:d.title,detail:d.detail,affected,at,round:s.round};s.requiredDisaster=true;updateCouncil(s);
 log(s,`${d.icon} ${d.title}: ${d.detail} ${affected.length} businesses are now CLOSED until their owners pay for repairs. All residents experienced emergency costs.`,'event',{type:'disaster'});
 announce(s,`${d.icon} ${d.title}`,`${d.detail} ${affected.length} locations remain visibly damaged and collect $0 rent until repaired.`,`cost`,true,{broadcast:true,scope:'city',who:'All residents',disaster:s.disaster,impacts,sound:'disaster'});
}
function openGovernmentVote(s,initial=false){s.voteResumePhase=initial?'roll':s.phase;s.voteResumeTurn=s.turn;s.voting={kind:'government',round:s.round,ballots:{},open:true,initial};s.phase='vote';s.governmentBallots++;s.lastGovElection=s.round;log(s,'🏛️ GOVERNMENT ELECTION OPEN — choose a new form of government.','event');announce(s,'🗳️ CITY GOVERNMENT ELECTION','Choose how Inflation City should be governed. Dictatorship voters must also select a ruler.','event',true,{scope:'city',who:'All residents',broadcast:true});}
function applyEvent(s,e,p,opts={}){ensure(s);let targets=opts.targets||[p],major=!!opts.major,scope=opts.scope|| (e.kind==='life'?'individual':'city');let before=s.players.filter(q=>!q.bankrupt).map(q=>({id:q.id,name:q.name,cash:q.cash,debt:q.debt,net:net(s,q),qol:q.qol}));let effects=[];if(e.inflation){let old=s.cpi;s.cpi=clamp(s.cpi*(1+e.inflation),.7,3);s.inflation=s.cpi/old-1;effects.push(`CPI ${(old*100).toFixed(1)} → ${(s.cpi*100).toFixed(1)} (${s.inflation>=0?'+':''}${(s.inflation*100).toFixed(1)}%)`);}if(e.rate){let old=s.rate;s.rate=clamp(s.rate+e.rate,.01,.15);effects.push(`Loan rate ${(old*100).toFixed(1)}% → ${(s.rate*100).toFixed(1)}%`);}if(e.wage){let old=s.wage;s.wage=Math.max(500,s.wage+e.wage);effects.push(`Paycheck $${old} → $${s.wage}`);}if(e.market){let old=s.market;s.market=clamp(s.market*(1+e.market),.4,2);effects.push(`City asset index ${(old*100).toFixed(0)} → ${(s.market*100).toFixed(0)}`);}if(e.sector){let old=s.sectors[e.sector]||1;s.sectors[e.sector]=clamp(old*(1+e.sectorChange),.35,2.5);effects.push(`${e.sector} value index ${(old*100).toFixed(0)} → ${(s.sectors[e.sector]*100).toFixed(0)}`);}let impacts=[];if(e.cash){let n=money(Math.abs(e.cash)*s.cpi);for(let q of targets){if(q.bankrupt)continue;if(e.cash<0){let medical=/medical|hospital|health|dental|prescription|urgent care|insurance deductible|clinic|pharmacy/i.test(e.title);let publicHealth=medical&&(s.government==='socialism'||(s.government==='dictatorship'&&s.dictatorPolicies?.healthcare));let billed=publicHealth?(s.government==='socialism'?money(n*.25):0):n;if(billed)charge(s,q,billed,e.title+(billed<n?' (public health benefit applied)':''),undefined,{quiet:true});else log(s,`${q.name} received no-cost publicly funded medical care (${e.title}).`,'good');} else{q.cash+=n;log(s,`${q.name} received $${n.toLocaleString()} — ${e.title}.`,'good',{player:q.id,amount:n});}changeQoL(q,e.cash<0?-2:2);impacts.push({id:q.id,name:q.name,amount:e.cash<0?-((s.government==='socialism'||(s.government==='dictatorship'&&s.dictatorPolicies?.healthcare))&&/medical|hospital|health|dental|prescription|urgent care|insurance deductible|clinic|pharmacy/i.test(e.title)?(s.government==='socialism'?money(n*.25):0):n):n});}effects.push(`${e.cash<0?'−':'+'}$${n.toLocaleString()} per affected player`);}let changes=before.map(b=>{let q=s.players[b.id];return {...b,cashChange:q.cash-b.cash,debtChange:q.debt-b.debt,netChange:net(s,q)-b.net,qolChange:q.qol-b.qol};}).filter(b=>b.cashChange||b.debtChange||b.netChange||b.qolChange);let who=scope==='city'?'Entire city':targets.map(q=>q.name).join(', ');let text=`${e.text} ${effects.join(' • ')}`.trim();s.lastEvent={title:e.title,text,scope};log(s,`${e.title} — ${who}: ${text}`,'event');const macroChange=!!(e.inflation||e.rate||e.wage||e.market||e.sectorChange);const allResidents=targets.filter(q=>!q.bankrupt).length===s.players.filter(q=>!q.bankrupt).length;const broadcast=macroChange||(scope==='city'&&allResidents);announce(s,e.title,text,e.cash<0||e.inflation>0||e.market<0||e.sectorChange<0||e.rate>0||e.wage<0?'cost':'good',major,{scope,who,impacts,effects,changes,broadcast});checkOligarchy(s);}
function charge(s,p,n,why,recipient,opts={}){p.cash-=n;if(n>=100)changeQoL(p,n>=450?-3:-1);if(recipient)recipient.cash+=n;let text=`${p.name} paid $${n.toLocaleString()} ${recipient?'to '+recipient.name+' for '+why:'for '+why}.`;let meta={player:p.id,recipient:recipient?.id,amount:n,reason:why,receipt:{payer:p.name,payee:recipient?.name||'City / provider',amount:n,reason:why}};if(opts.quiet)log(s,text,'cost',meta);else transaction(s,recipient?'Rent paid':'Expense paid',text,'cost',meta);if(p.cash<0){let needed=-p.cash,available=Math.max(0,5000-p.debt),borrowed=Math.min(available,needed);p.cash+=borrowed;p.debt+=borrowed;if(borrowed){let t=`${p.name} used $${borrowed.toLocaleString()} in emergency credit.`;if(opts.quiet)log(s,t,'cost');else transaction(s,'Emergency credit',t,'cost');}if(p.cash<0){if(p.id===s.turn&&s.phase!=='distress'&&s.phase!=='vote'){s.resumePhase=s.phase;s.phase='distress';}log(s,`${p.name} must sell assets to cover the shortfall, or declare bankruptcy on their turn.`,'cost');}}}
function draw(s,key,deck,rng=Math.random){ensure(s);let d=s.decks[key];if(!d||d.size!==deck.length)d=s.decks[key]={size:deck.length,used:[],last:-1};let pool=deck.map((_,i)=>i).filter(i=>!d.used.includes(i));if(!pool.length){d.used=[];pool=deck.map((_,i)=>i).filter(i=>i!==d.last);if(!pool.length)pool=[0];}let ix=pool[Math.floor(rng()*pool.length)];d.used.push(ix);d.last=ix;return deck[ix];}
function tick(s,now=Date.now(),rng=Math.random){ensure(s);if(s.phase==='finished'||s.phase==='vote'||s.phase==='revolution'||s.phase==='judgment'||now<s.nextSurpriseAt)return false;let alive=s.players.filter(p=>!p.bankrupt);if(!alive.length)return false;if(rng()<.14){triggerDisaster(s,rng);s.nextSurpriseAt=now+surpriseDelay(rng);s.revision++;return true;}let e=draw(s,'surprise',surpriseEvents,rng);s.lastSurprise=surpriseEvents.indexOf(e);s.surpriseHistory.push(e.title);if(s.surpriseHistory.length>300)s.surpriseHistory.shift();let pool=alive.slice();for(let i=pool.length-1;i>0;i--){let j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}let targets=e.scope==='city'?alive:e.scope==='individual'?pool.slice(0,1):pool.slice(0,Math.min(pool.length,Math.max(2,Math.ceil(pool.length*(.25+rng()*.35)))));applyEvent(s,e,targets[0],{targets,scope:e.scope,major:true});if(s.phase==='distress'&&current(s).cash>=0){s.phase=s.resumePhase||'end';s.resumePhase=null;}s.nextSurpriseAt=now+surpriseDelay(rng);s.revision++;return true;}
function land(s,p,rng){let b=board[p.pos];s.phase='end';if(b.type==='property'){let a=s.assets[b.id];if(!a){if(socialPublic(s,b.id)){changeQoL(p,2);log(s,`${p.name} used the publicly funded ${b.name}. No private purchase is permitted under the current city system.`,'good');}else if(p.propertyBan){log(s,`🚫 ${p.name} cannot buy ${b.name} due to the permanent property-acquisition ban approved by citizens.`,'event');}else{s.phase='buy';log(s,`${p.name} landed on ${b.name}. Available for $${purchaseCost(s,b.id,p.id).toLocaleString()}.`);}}else if(a.owner!==p.id){if(s.disasterSites?.[b.id]){log(s,`🚧 ${p.name} landed on ${b.name}, but it is CLOSED from ${s.disasterSites[b.id].type} damage. No rent is charged.`,'good');}else if(rent(s,b.id)===0){changeQoL(p,2);log(s,`🚌 ${p.name} used ${b.name} for free under the current government service policy.`,'good');}else charge(s,p,rent(s,b.id),'rent at '+b.name,s.players[a.owner]);}else log(s,`${p.name} visited their own ${b.name}.`);}else if(b.type==='event'){let deck=events.filter(e=>e.kind===(b.name==='Market News'?'market':'life'));applyEvent(s,draw(s,b.name==='Market News'?'market':'life',deck,rng),p,{major:true});}else if(b.type==='bill'){charge(s,p,money(b.price*s.cpi),b.name);}else if(b.type==='irs'){irsVisit(s,p,rng);}else if(b.id===16){if(p.debt){let n=money(p.debt*s.rate);charge(s,p,n,'credit check interest');}else log(s,`${p.name} passed the credit check debt-free.`,'good');}else if(b.id===24){let n=money(250*s.cpi);p.cash+=n;transaction(s,'Emergency relief',`${p.name} received $${n.toLocaleString()} from an emergency relief program.`,'good');}else if(b.id===8)log(s,`${p.name} enjoyed the public park. No charge.`);}
function finish(s){s.phase='finished';let alive=s.players.filter(p=>!p.bankrupt);let ranked=(alive.length?alive:s.players).slice().sort((a,b)=>net(s,b)-net(s,a)||a.id-b.id);s.winner=ranked[0].id;log(s,`${ranked[0].name} wins with a net worth of $${net(s,ranked[0]).toLocaleString()}!`,'good');}

const DICTATOR_CHOICES=[
 {id:'healthcare',icon:'🏥',title:'Healthcare for everyone?',good:'Provide universal healthcare funded by the treasury',bad:'Privatize healthcare and collect costly health fees'},
 {id:'taxes',icon:'🧾',title:'Who should carry the tax burden?',good:'Lower citizens’ taxes and pay emergency tax relief',bad:'Raise taxes and divert new revenue to yourself'},
 {id:'housing',icon:'🏘️',title:'Homes for people—or power?',good:'Fund affordable housing grants for residents',bad:'Confiscate a valuable property from another owner'},
 {id:'business',icon:'🏭',title:'Rescue struggling businesses?',good:'Provide taxpayer-funded small business and repair assistance',bad:'Seize a successful private business'},
 {id:'transport',icon:'🚌',title:'Who gets to travel?',good:'Make all transportation free for citizens',bad:'Impose a transportation toll payable to yourself'},
 {id:'disaster',icon:'🚒',title:'Who receives disaster relief?',good:'Spend public funds reopening closed businesses',bad:'Keep available emergency aid for yourself'},
 {id:'education',icon:'🎓',title:'Build the future or enrich yourself?',good:'Invest the city budget in education and raise wages',bad:'Cut education funding and extract a personal education fee'}
];
function citizens(s){return s.players.filter(p=>!p.bankrupt&&p.id!==s.leader);}
function dictatorPowerCheck(s,actor,type){
 if(s.government!=='dictatorship'||actor!==s.leader||s.players[actor]?.bankrupt)throw Error('Only the current dictator has that power.');
 // God Mode has no per-round action quotas. The ruler remains subject to a successful revolution.
 if(s.phase==='finished')throw Error('The game has ended.');
 return true;
}
function dictatorTransfer(s,owner,id,free=false){
 const a=s.assets[id];if(board[id]?.type!=='property'||(free?!!a:!a||a.owner===owner))throw Error(free?'Choose an available unowned property.':'Choose a property owned by another resident.');
 const leader=s.players[owner];if(!leader||leader.bankrupt)throw Error('The leader is not active.');if(leader.propertyBan)throw Error('Citizens permanently barred this ruler from acquiring property.');
 let old=a?s.players[a.owner]:null;let paid=0;
 if(!free){changeQoL(old,-5);}s.assets[id]={...a,owner,level:a?.level||0,purchasePrice:paid,purchaseRound:s.round,damage:s.disasterSites[id]?.severity||0,closed:!!s.disasterSites[id]};
 transaction(s,free?'👑 FREE PROPERTY GRANT':'👑 FORCED PROPERTY TRANSFER',free?`${leader.name} granted themselves ${board[id].name} without paying the city bank.`:`${leader.name} compelled ${old.name} to sell ${board[id].name} with no compensation under God Mode. Ownership transferred immediately.`,'event',{type:free?'freebuy':'forcedsale',property:id,amount:paid,player:owner,previousOwner:old?.id,receipt:{property:board[id].name,buyer:leader.name,seller:old?.name||'City bank',price:paid,owner:leader.name}});
 return paid;
}
function openDictatorTurn(s,rng=Math.random){
 if(s.government!=='dictatorship'||s.leader!==s.turn||s.players[s.turn].bankrupt)return false;
 const topic=draw(s,'dictator-topics',DICTATOR_CHOICES,rng);
 s.dictatorTopic=topic.id;s.phase='dictator';
 log(s,`👑 ${s.players[s.leader].name} must make a public-interest or self-interest decision before rolling.`,'event');
 announce(s,'👑 DICTATOR’S DECISION',`${topic.title} ${topic.good} OR ${topic.bad}.`,'event',false,{scope:'city',broadcast:false});return true;
}
function spendTreasury(s,limit,recipients,reason,qol=0){
 let count=recipients.length;if(!count)return 0;let each=Math.min(Math.max(0,limit),Math.floor(Math.max(0,s.treasury)/count));
 for(const p of recipients){p.cash+=each;changeQoL(p,qol);}s.treasury-=each*count;
 log(s,`The treasury spent $${(each*count).toLocaleString()} on ${reason}.`,'good');return each;
}
function dictatorDecision(s,actor,choice,rng=Math.random){
 if(s.government!=='dictatorship'||s.leader!==actor||s.phase!=='dictator')throw Error('Only the ruler may choose an executive decision at the start of their turn.');
 if(!['good','bad'].includes(choice))throw Error('Choose help the people or enrich the ruler.');
 const topic=DICTATOR_CHOICES.find(t=>t.id===s.dictatorTopic);if(!topic)throw Error('Executive topic unavailable.');
 const people=citizens(s),ruler=s.players[actor];let detail='';
 if(topic.id==='healthcare'){
  if(choice==='good'){s.dictatorPolicies.healthcare=true;let paid=spendTreasury(s,120,people,'public healthcare',7);detail=`Healthcare became free; each resident received $${paid} in medical assistance.`;}
  else{s.dictatorPolicies.healthcare=false;for(const p of people){charge(s,p,140,'privatized healthcare fee',ruler,{quiet:true});changeQoL(p,-3);}detail='Private medical fees of $140 per resident went directly to the ruler.';}
 }else if(topic.id==='taxes'){
  if(choice==='good'){s.dictatorTaxExtra=Math.max(-.06,s.dictatorTaxExtra-.04);let paid=spendTreasury(s,100,people,'taxpayer relief',4);detail=`Income tax surcharge lowered by 4 percentage points; each citizen received $${paid} in relief.`;}
  else{s.dictatorTaxExtra=Math.min(.22,s.dictatorTaxExtra+.04);for(const p of people)charge(s,p,190,'personal executive tax',ruler,{quiet:true});detail='The tax surcharge increased by 4 points and each citizen paid $190 directly to the ruler.';}
 }else if(topic.id==='housing'){
  if(choice==='good'){s.dictatorPolicies.housing=true;let paid=spendTreasury(s,175,people,'affordable housing',5);detail=`Housing assistance paid $${paid} per citizen.`;}
  else{let list=Object.entries(s.assets).filter(([,a])=>a.owner!==actor).sort((a,b)=>assetValue(s,+b[0])-assetValue(s,+a[0]));if(list.length){let [id,a]=list[0],former=s.players[a.owner];a.owner=actor;changeQoL(former,-9);detail=`${board[id].name} was confiscated from ${former.name} without compensation.`;}else{for(const p of people)charge(s,p,120,'housing appropriation',ruler,{quiet:true});detail='No private property was available; each resident paid $120 to the ruler.';}}
 }else if(topic.id==='business'){
  if(choice==='good'){let repaired=0;for(const [id,a] of Object.entries(s.assets)){if(!s.disasterSites[id])continue;let cost=repairCost(s,+id);if(cost>s.treasury)continue;s.treasury-=cost;delete s.disasterSites[id];a.damage=0;a.closed=false;repaired++;}let grants=spendTreasury(s,80,people,'small-business aid',3);detail=`${repaired} businesses reopened; public grants paid $${grants} to citizens.`;}
  else{let list=Object.entries(s.assets).filter(([,a])=>a.owner!==actor).sort((a,b)=>assetValue(s,+b[0])-assetValue(s,+a[0]));if(list.length){let [id,a]=list[0],former=s.players[a.owner];a.owner=actor;changeQoL(former,-10);detail=`${board[id].name} was seized from ${former.name}.`;}else{for(const p of people)charge(s,p,150,'business monopoly levy',ruler,{quiet:true});detail='Citizens paid a $150 monopoly levy to the ruler.';}}
 }else if(topic.id==='transport'){
  if(choice==='good'){s.dictatorPolicies.transport=true;people.forEach(p=>changeQoL(p,5));detail='Transport businesses now collect zero fares while the executive decree remains active.';}
  else{s.dictatorPolicies.transport=false;for(const p of people)charge(s,p,100,'executive transit toll',ruler,{quiet:true});detail='Residents pay a $100 private transit toll to the ruler.';}
 }else if(topic.id==='disaster'){
  if(choice==='good'){let repaired=0;for(const [id,a] of Object.entries(s.assets)){if(!s.disasterSites[id])continue;const cost=repairCost(s,+id);if(cost>s.treasury)continue;s.treasury-=cost;delete s.disasterSites[id];a.damage=0;a.closed=false;repaired++;}const aid=spendTreasury(s,110,people,'emergency relief',4);detail=`${repaired} closed businesses reopened and residents received $${aid} each.`;}
  else{let stolen=Math.min(1400,Math.max(0,s.treasury));s.treasury-=stolen;ruler.cash+=stolen;people.forEach(p=>changeQoL(p,-5));detail=`The ruler transferred $${stolen} of emergency relief from the treasury into their own balance.`;}
 }else if(topic.id==='education'){
  if(choice==='good'){let paid=spendTreasury(s,150,people,'education grants',6);s.wage+=60;detail=`Public grants of $${paid} per citizen; city paychecks rise by $60.`;}
  else{for(const p of people)charge(s,p,180,'education austerity fee',ruler,{quiet:true});s.wage=Math.max(500,s.wage-40);detail='Residents paid $180 per person to the ruler and future wages fell by $40.';}
 }
 s.dictatorDecisionCount++;s.dictatorTopic=null;s.phase=ruler.cash<0?'distress':'roll';s.resumePhase=s.phase==='distress'?'roll':null;
 changeQoL(ruler,choice==='good'?2:-1);
 transaction(s,'👑 EXECUTIVE ORDER: '+topic.title,`${ruler.name} chose to ${choice==='good'?'HELP THE PEOPLE':'ENRICH THE RULER'}. ${detail}`,'event',{type:'dictator-decision',decision:topic.id,choice,treasury:s.treasury});
 announce(s,'👑 EXECUTIVE ORDER',`${ruler.name}: ${detail}`,'event',true,{scope:'city',broadcast:true,who:'Everyone'});
}
function openRevolution(s){
 if(s.government!=='dictatorship')return false;let eligible=citizens(s);if(!eligible.length)return false;
 const threshold=Math.max(1,Math.ceil(eligible.length*2/3));
 s.revolution={round:s.round,open:true,ballots:{},threshold,eligible:eligible.map(p=>p.id)};
 s.phase='revolution';s.voteResumePhase='roll';s.voteResumeTurn=s.turn;
 announce(s,'✊ REVOLUTION VOTE OPEN',`Citizens may vote to overthrow ${s.players[s.leader].name}. ${threshold} of ${eligible.length} YES votes are required (two-thirds). The dictator cannot vote.`,'event',true,{broadcast:true,scope:'city',sound:'coup'});
 log(s,`REVOLUTION ORGANIZED: ${threshold} of ${eligible.length} residents must support the uprising.`,'event');return true;
}
function beginJudgment(s,formerId,reason,nextElection=false){
 const eligible=s.players.filter(p=>!p.bankrupt&&p.id!==formerId).map(p=>p.id);
 const threshold=Math.floor(eligible.length/2)+1;
 s.judgment={open:true,former:formerId,eligible,threshold,ballots:{},round:s.round,reason,nextElection};
 s.phase='judgment';s.voteResumePhase='roll';
 const former=s.players[formerId];
 announce(s,'⚖️ THE PEOPLE WILL DECIDE',`${former.name} is no longer dictator. Citizens must now vote: confiscate all their cash, return their properties to the bank, suspend one turn, and permanently bar property acquisition — OR forgive them and leave everything unchanged. A majority of ${threshold} citizen ballots is required for confiscation.`,'event',true,{broadcast:true,sound:'coup',scope:'city',who:'All residents'});
 log(s,`Citizens opened a post-dictatorship judgment vote for ${former.name}. ${threshold} votes needed to impose sanctions.`,'event');
}
function skipCurrentSuspended(s,rng=Math.random){
 if(s.phase!=='roll')return;
 const p=s.players[s.turn];if(!p||p.bankrupt||!p.skipTurns)return;
 p.skipTurns--;transaction(s,'🚫 SUSPENDED TURN',`${p.name} must miss this turn under the citizen judgment. The next resident will play.`,'event',{type:'suspension',player:p.id});
 advance(s,rng);
}
function closeJudgment(s,rng=Math.random){
 const v=s.judgment;if(!v?.open||s.phase!=='judgment')throw Error('No judgment vote is open.');
 const yes=Object.values(v.ballots).filter(x=>x==='punish').length;
 const no=Object.values(v.ballots).filter(x=>x==='forgive').length;
 const punished=yes>=v.threshold;const former=s.players[v.former];
 v.open=false;v.result={punished,yes,no};
 let transferred=0,properties=0;
 if(punished){
  const recipients=v.eligible.map(id=>s.players[id]).filter(p=>p&&!p.bankrupt);
  const seized=Math.max(0,Math.floor(former.cash));former.cash-=seized;
  if(recipients.length){
   const each=Math.floor(seized/recipients.length),extra=seized%recipients.length;
   recipients.forEach((p,i)=>{p.cash+=each+(i<extra?1:0);changeQoL(p,5);});transferred=seized;
  }else former.cash+=seized;
  for(const id of Object.keys(s.assets)){if(s.assets[id].owner===former.id){delete s.assets[id];properties++;}}
  former.skipTurns=1;former.propertyBan=true;changeQoL(former,-10);
  checkOligarchy(s);
  transaction(s,'🏛️ PROPERTY REPOSSESSION',`${properties} former-dictator properties were returned to City Bank and are available for purchase again.`,'event',{type:'repossessed',former:former.id,count:properties});
  announce(s,'⚖️ FORMER DICTATOR SANCTIONED',`${yes} citizens voted to punish ${former.name}. ${transferred.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})} of cash was redistributed among ${recipients.length} other active residents; ${properties} properties are now for sale. One turn is suspended, and ${former.name} is permanently barred from acquiring property.`,'event',true,{broadcast:true,sound:'coup',scope:'city'});
 }else{
  announce(s,'🕊️ CITIZENS VOTE FOR CLEMENCY',`${no} voted to forgive and ${yes} voted to punish ${former.name}; the required majority was ${v.threshold}. The former dictator keeps all their cash and property and may continue playing normally.`,'event',true,{broadcast:true,sound:'coup',scope:'city'});
 }
 s.judgmentHistory.unshift({round:s.round,former:former.id,yes,no,punished,transferred,properties});
 s.phase=s.players[s.turn].cash<0?'distress':'roll';s.resumePhase=s.phase==='distress'?'roll':null;
 if(v.nextElection){openGovernmentVote(s);return;}
 skipCurrentSuspended(s,rng);
 if(s.phase==='roll'&&s.government==='dictatorship'&&s.turn===s.leader)openDictatorTurn(s,rng);
}
function closeRevolution(s,rng=Math.random){
 const v=s.revolution;if(!v?.open)throw Error('No active revolution.');v.open=false;
 let yes=Object.values(v.ballots).filter(x=>x==='rise').length,no=Object.values(v.ballots).filter(x=>x==='loyal').length,success=yes>=v.threshold;
 const prior=s.leader,former=s.players[prior];let outcome='';
 if(success){
  let choices=['democracy','socialism','oligarchy','election'];let next=choices[Math.floor(rng()*choices.length)];
  if(next==='election'){setGovernment(s,'democracy',null,'Provisional democracy after revolution');outcome='A provisional democracy formed. Another constitution vote follows the judgment.';}
  else{setGovernment(s,next,null,'Citizen revolution succeeded');outcome=`The city entered ${GOVERNMENTS[next].label}.`;}
  s.revolutionHistory.unshift({round:s.round,yes,no,success:true,trueOutcome:next,former:prior});
  announce(s,'✊ DICTATOR OVERTHROWN!',`The uprising succeeded with ${yes} of ${v.eligible.length} citizens. ${former.name} is out of power. ${outcome} Citizens will now decide whether to punish or forgive the former ruler.`,'event',true,{broadcast:true,sound:'coup',scope:'city',who:'Entire city'});
  beginJudgment(s,prior,'Successful revolution',next==='election');
 }else{
  let total=0;for(const [id,ballot] of Object.entries(v.ballots)){if(ballot==='rise'){const p=s.players[+id];charge(s,p,220,'failed uprising penalty',former,{quiet:true});changeQoL(p,-6);total+=220;}}
  s.revolutionHistory.unshift({round:s.round,yes,no,success:false,penalties:total});
  s.nextRevolutionRound=s.round+1+Math.floor(rng()*3);
  announce(s,'👑 REVOLUTION DEFEATED',`${yes} voted to rebel; ${v.threshold} were required. ${former.name} stays in power. Rebellion supporters paid $${total.toLocaleString()} in collective penalties.`,'cost',true,{broadcast:true,sound:'coup',scope:'city',who:'Entire city'});
  s.phase=s.players[s.turn].cash<0?'distress':'roll';s.resumePhase=s.phase==='distress'?'roll':null;if(s.phase==='roll'&&s.turn===s.leader)openDictatorTurn(s,rng);
 }
 log(s,`Revolution ${success?'succeeded':'failed'}: ${yes} for, ${no} against, threshold ${v.threshold}. ${outcome}`,'event');return success;
}
function openVote(s,rng=Math.random){
 const proposal=draw(s,'policies',policies,rng),index=policies.indexOf(proposal);
 s.voteResumePhase='roll';s.voteResumeTurn=s.turn;
 s.voting={kind:'policy',index,round:s.round,ballots:{},open:true};s.phase='vote';
 let message=`${proposal.question} YES: ${proposal.pro}. NO: No policy changes. ${proposal.con}.`;
 log(s,`CITY POLICY VOTE OPENED — ${proposal.title}: ${message}`,'event');
 announce(s,'🗳️ CITY POLICY VOTE: '+proposal.title,message,'event',true,{scope:'city',who:'All active residents',broadcast:true});
}
function closeVote(s){
 const v=s.voting;if(!v||!v.open||s.phase!=='vote')throw Error('There is no open vote.');
 const alive=s.players.filter(x=>!x.bankrupt),votes=Object.entries(v.ballots),abstained=alive.length-votes.length;
 v.open=false;
 if(v.kind==='government'){
  let totals=Object.fromEntries(GOVERNMENT_OPTIONS.map(k=>[k,0]));
  for(const [id,b] of votes)totals[b.choice]+=voteWeight(s,+id,'government');
  let result=GOVERNMENT_OPTIONS.slice().sort((a,b)=>totals[b]-totals[a]||(a===s.government?-1:b===s.government?1:GOVERNMENT_OPTIONS.indexOf(a)-GOVERNMENT_OPTIONS.indexOf(b)))[0];
  let departing=s.government==='dictatorship'&&(result!=='dictatorship')?s.leader:null;
  let ruler=result==='dictatorship'?electedDictator(s,v.ballots):null;
  if(s.government==='dictatorship'&&result==='dictatorship'&&s.leader!==ruler)departing=s.leader;
  v.result={government:result,totals,abstained,ruler};
  s.voteHistory.unshift({type:'government',round:v.round,government:result,totals,abstained});
  setGovernment(s,result,ruler,'Constitutional ballot');
  if(departing!==null&&departing!==undefined)beginJudgment(s,departing,'Government election');
  log(s,`Election result: ${GOVERNMENTS[result].label} won with ${totals[result]} weighted ballots; ${abstained} abstentions.`,'event');
 }else{
  let yes=0,no=0;for(const [id,b] of votes){let weight=voteWeight(s,+id,'policy');if(b.choice==='yes')yes+=weight;else no+=weight;}
  const passed=yes>no,p=policies[v.index];v.result={yes,no,abstained,passed};
  s.voteHistory.unshift({type:'policy',round:v.round,index:v.index,yes,no,abstained,passed});
  if(passed){const effect={...p.effect,title:'POLICY PASSED: '+p.title,text:p.question+' The city approved the proposal.'};applyEvent(s,effect,alive[0],{targets:alive,scope:'city',major:false});}
  transaction(s,`Referendum ${passed?'passed':'rejected'}: ${p.title}`,`${yes} weighted YES · ${no} weighted NO · ${abstained} abstained. ${passed?'Approved.':'Rejected.'}`,'event',{type:'vote',round:v.round,yes,no,abstained,passed});
  announce(s,passed?'🗳️ POLICY APPROVED':'🗳️ POLICY REJECTED',`${p.title}: ${yes} YES / ${no} NO. ${passed?'The policy now changes the economy.':'Existing policy remains unchanged.'}`,'event',true,{scope:'city',who:'City referendum',broadcast:true});
 }
 if(s.phase==='judgment')return;
 s.phase=s.players[s.turn].cash<0?'distress':s.voteResumePhase||'roll';s.resumePhase=s.phase==='distress'?(s.voteResumePhase||'roll'):null;skipCurrentSuspended(s);if(s.phase==='roll'&&s.government==='dictatorship'&&s.turn===s.leader)openDictatorTurn(s);
}
function advance(s,rng){
 let p=current(s);p.turns++;s.turnCount++;
 if(s.players.filter(q=>!q.bankrupt).length<=1){finish(s);return;}
 let next=s.turn,enteredNewRound=false;
 do{
  next=(next+1)%s.players.length;
  if(next===0){
   if(s.round>=s.maxRounds){finish(s);return;}
   s.round++;enteredNewRound=true;
   if(s.round%2===0)collectTaxes(s);
   if(s.round===2&&!s.requiredDisaster)triggerDisaster(s,rng,true);
   let e=draw(s,'round',roundEvents,rng);applyEvent(s,e,p,{major:true});
   let borrowers=[];
   for(let q of s.players){if(!q.bankrupt&&q.debt){let interest=money(q.debt*s.rate);q.debt+=interest;if(interest){log(s,`${q.name}'s loan accrued $${interest.toLocaleString()} interest.`,'cost');borrowers.push({id:q.id,name:q.name,amount:-interest});}}}
   if(borrowers.length)announce(s,'Loan interest posted',`${borrowers.length} borrower(s) accrued interest this round. Their outstanding debt increased.`,'cost',false,{impacts:borrowers});
   log(s,`Round ${s.round} begins. CPI ${Math.round(s.cpi*100)}, paycheck $${s.wage.toLocaleString()}.`,'event');
  }
  if(!s.players[next].bankrupt&&s.players[next].skipTurns>0){let held=s.players[next];held.skipTurns--;held.turns++;s.turnCount++;transaction(s,'🚫 SUSPENDED TURN',`${held.name} misses their next turn under the citizen judgment.`,'event',{type:'suspension',player:held.id});continue;}
  if(!s.players[next].bankrupt)break;
 }while(true);
 s.turn=next;s.phase=s.players[next].cash<0?'distress':'roll';s.resumePhase=s.phase==='distress'?'roll':null;s.lastRoll=null;
 if(enteredNewRound&&s.government==='dictatorship'&&s.nextRevolutionRound!==null&&s.round>=s.nextRevolutionRound){openRevolution(s);}else if(enteredNewRound&&s.round%4===0)openGovernmentVote(s);else if(enteredNewRound&&s.round%2===0)openVote(s,rng);else if(s.phase==='roll'&&s.government==='dictatorship'&&s.turn===s.leader)openDictatorTurn(s,rng);
}
function action(s,actor,act,rng=Math.random){if(s)ensure(s);if(!s||s.phase==='finished')throw Error('Game is over.');
let type=act?.type;if(typeof type!=='string')throw Error('Invalid action.');
// Public disaster repairs can be funded by ANY active student, even outside their own turn.
if(type==='repair'){
 const payer=s.players[actor],id=Number(act.id),damage=s.disasterSites?.[id],asset=s.assets[id];
 if(!payer||payer.bankrupt)throw Error('Only an active student may pay for repairs.');
 if(!Number.isInteger(id)||board[id]?.type!=='property'||!damage)throw Error('This property is not damaged.');
 if(payer.propertyBan)throw Error('Citizens barred this former dictator from acquiring property, including through repairs.');
 const cost=repairCost(s,id);if(payer.cash<cost)throw Error('Not enough cash to fund this repair.');
 const previous=asset?s.players[asset.owner]:null;
 payer.cash-=cost;delete s.disasterSites[id];
 s.assets[id]={...asset,owner:payer.id,level:asset?.level??0,purchasePrice:previous?.id===payer.id?(asset?.purchasePrice??cost):cost,purchaseRound:previous?.id===payer.id?(asset?.purchaseRound??s.round):s.round,damage:0,closed:false};
 s.repairHistory.unshift({id,payer:actor,previousOwner:previous?.id??null,newOwner:payer.id,round:s.round,cost});
 checkOligarchy(s);
 transaction(s,'🛠️ REPAIR & OWNERSHIP TRANSFER',`${payer.name} paid ${cost.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})} to restore ${board[id].name}. Ownership transferred from ${previous?.name||'City Bank'} to ${payer.name} for no additional purchase price. Rent is now ${rent(s,id).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})}.`,'good',{type:'repair',property:id,payer:actor,previousOwner:previous?.id??null,owner:payer.id,amount:cost,receipt:{property:board[id].name,buyer:payer.name,seller:previous?.name||'City Bank',price:cost,owner:payer.name}});
 s.revision++;return s;
}
if(s.phase==='judgment'){
 const v=s.judgment;
 if(type==='judgmentVote'){
  if(!v?.open||!v.eligible.includes(actor)||s.players[actor].bankrupt)throw Error('Only active non-dictator citizens can cast a judgment ballot.');
  if(v.ballots[actor])throw Error('You already voted.');
  if(!['punish','forgive'].includes(act.choice))throw Error('Choose confiscation or forgiveness.');
  v.ballots[actor]=act.choice;log(s,`${s.players[actor].name} voted on the former dictator's fate.`,'event');
  const yes=Object.values(v.ballots).filter(x=>x==='punish').length,remaining=v.eligible.length-Object.keys(v.ballots).length;
  if(yes>=v.threshold||yes+remaining<v.threshold||remaining===0)closeJudgment(s,rng);
  s.revision++;return s;
 }
 if(type==='closeJudgment'){if(actor!==0)throw Error('Only the teacher can close a judgment vote early.');closeJudgment(s,rng);s.revision++;return s;}
 throw Error('Finish the post-dictatorship judgment vote before playing.');
}
if(s.phase==='revolution'){
 if(type==='revolutionVote'){let v=s.revolution;if(!v?.open||!v.eligible.includes(actor))throw Error('Only non-ruler citizens may vote in a revolution.');if(v.ballots[actor])throw Error('You have already voted.');if(!['rise','loyal'].includes(act.choice))throw Error('Choose overthrow or remain loyal.');v.ballots[actor]=act.choice;log(s,`${s.players[actor].name} cast a revolution ballot.`,'event');let yes=Object.values(v.ballots).filter(x=>x==='rise').length,remaining=v.eligible.length-Object.keys(v.ballots).length;if(yes>=v.threshold||yes+remaining<v.threshold||remaining===0)closeRevolution(s,rng);s.revision++;return s;}
 if(type==='closeRevolution'){if(actor!==0)throw Error('Only the teacher can close the revolution early.');closeRevolution(s,rng);s.revision++;return s;}throw Error('Resolve the revolution vote before taking another action.');}
if(s.phase==='vote'){
 if(type==='vote'){
  let voter=s.players[actor];if(!voter||voter.bankrupt)throw Error('Only active players can vote.');
  if(s.voting.ballots[actor])throw Error('You have already voted.');
  if(s.voting.kind==='government'){
   if(!GOVERNMENT_OPTIONS.includes(act.choice))throw Error('Choose a valid form of government.');
   s.voting.ballots[actor]={choice:act.choice};
  }else{
   if(s.government==='dictatorship'&&actor!==s.leader)throw Error('Only the current ruler can decide this policy.');
   if(!['yes','no'].includes(act.choice))throw Error('Select YES or NO.');
   s.voting.ballots[actor]={choice:act.choice};
   if(s.government==='dictatorship')s.leaderDecisions++;
  }
  const counted=Object.keys(s.voting.ballots).length,active=s.players.filter(p=>!p.bankrupt).length;
  log(s,`${voter.name} submitted a ${voteWeight(s,actor,s.voting.kind)}-weight ballot. ${counted}/${active} residents have voted.`,'event');
  if(counted===active||(s.voting.kind==='policy'&&s.government==='dictatorship'))closeVote(s);
  s.revision++;return s;
 }
 if(type==='closeVote'){
  if(actor!==0)throw Error('Only the room host can close a vote early.');
  closeVote(s);s.revision++;return s;
 }
 throw Error('Finish the city vote before taking another turn.');
}
if(type==='dictatorDecision'){dictatorDecision(s,actor,act.choice,rng);s.revision++;return s;}
if(['dictatorForceSale','dictatorFreeBuy','dictatorPersonalTax','dictatorSeize','dictatorIRS','dictatorClaim','dictatorGrantProperty','dictatorGrantCash','dictatorMint','dictatorSetWage','dictatorSetCPI','dictatorSetTax','dictatorClose','dictatorRestore'].includes(type)){
 dictatorPowerCheck(s,actor,type);
 const leader=s.players[actor],id=Number(act.id),target=s.players[Number(act.target)];
 const moneyAmount=()=>{const v=Number(act.amount);if(!Number.isSafeInteger(v)||v<1)throw Error('Enter a positive whole-dollar amount.');return v;};
 const safeAdd=(a,b)=>{if(!Number.isSafeInteger(a+b))throw Error('Amount would exceed the game money system.');return a+b;};
 if(type==='dictatorForceSale'||type==='dictatorFreeBuy'){
  dictatorTransfer(s,actor,id,type==='dictatorFreeBuy');
 }else if(type==='dictatorClaim'||type==='dictatorGrantProperty'){
  if(board[id]?.type!=='property')throw Error('Select a real property.');
  const recipient=type==='dictatorClaim'?leader:target;
  if(recipient?.propertyBan)throw Error('A permanent property acquisition ban applies to this resident.');
  if(!recipient||recipient.bankrupt)throw Error('Choose an active recipient.');
  const old=s.assets[id],previous=old?s.players[old.owner]:null;
  if(previous?.id===recipient.id)throw Error('That resident already owns this property.');
  s.assets[id]={...old,owner:recipient.id,level:old?.level??0,purchasePrice:0,purchaseRound:s.round,damage:s.disasterSites?.[id]?.severity||0,closed:!!s.disasterSites?.[id]};
  if(previous)changeQoL(previous,-5);
  checkOligarchy(s);
  transaction(s,'👑 GOD MODE PROPERTY DECREE',`${leader.name} transferred ${board[id].name} from ${previous?.name||'City Bank'} to ${recipient.name} for $0. The ownership registry updates immediately.`,'event',{type,property:id,previousOwner:previous?.id??null,newOwner:recipient.id,receipt:{property:board[id].name,buyer:recipient.name,seller:previous?.name||'City Bank',price:0,owner:recipient.name}});
 }else if(type==='dictatorSetWage'||type==='dictatorSetCPI'||type==='dictatorSetTax'){
  const value=Number(act.amount);
  if(!Number.isFinite(value))throw Error('Enter a valid number.');
  if(type==='dictatorSetWage'){
    if(!Number.isSafeInteger(value)||value<0||value>1e9)throw Error('Enter a wage from $0 to $1 billion.');
    s.wage=value;transaction(s,'👑 EXECUTIVE WAGE ORDER',`${leader.name} set the city paycheck to $${value.toLocaleString()}.`,'event',{type,value});
  }else if(type==='dictatorSetCPI'){
    if(value<25||value>1000)throw Error('Enter a price index between 25 and 1,000.');
    const previous=s.cpi;s.cpi=value/100;s.inflation=s.cpi/previous-1;
    transaction(s,'👑 PRICE CONTROL DECREE',`${leader.name} set the consumer price index to ${value.toFixed(1)}. Property prices and household bills change immediately.`,'event',{type,value});
  }else{
    if(value<0||value>300)throw Error('Enter an income tax surcharge from 0% to 300%.');
    s.dictatorTaxExtra=value/100;
    transaction(s,'👑 TAX CODE DECREE',`${leader.name} set the additional citizen income-tax rate to ${value} percentage points. The ruler remains tax-exempt.`,'event',{type,value});
  }
 }else if(type==='dictatorClose'||type==='dictatorRestore'){
  if(board[id]?.type!=='property')throw Error('Select a property.');
  if(type==='dictatorClose'){
    s.disasterSites[id]={type:'surge',icon:'⚡',severity:3,round:s.round,status:'CLOSED',seq:++s.disasterSeq,at:Date.now()};
    if(s.assets[id]){s.assets[id].damage=3;s.assets[id].closed=true;}
    transaction(s,'👑 FORCED CLOSURE',`${leader.name} shut down ${board[id].name}. Rent is now $0 until repaired.`,'cost',{type,property:id});
  }else{
    if(!s.disasterSites[id])throw Error('That property is not damaged.');
    delete s.disasterSites[id];if(s.assets[id]){s.assets[id].damage=0;s.assets[id].closed=false;}
    transaction(s,'👑 INSTANT RESTORATION',`${leader.name} reopened ${board[id].name} at no cost.`,'good',{type,property:id});
  }
 }else if(type==='dictatorMint'||type==='dictatorGrantCash'){
  const recipient=type==='dictatorMint'?leader:target;
  if(!recipient||recipient.bankrupt)throw Error('Choose an active recipient.');
  let amount=moneyAmount();recipient.cash=safeAdd(recipient.cash,amount);
  transaction(s,'👑 EXECUTIVE MONEY CREATION',`${leader.name} created $${amount.toLocaleString()} and issued it to ${recipient.name}.`,'event',{type,amount,recipient:recipient.id});
 }else{
  if(!target||target.bankrupt||target.id===actor)throw Error('Choose an active resident other than the dictator.');
  let requested=moneyAmount();let amount=requested;
  if(type==='dictatorSeize'){amount=Math.min(amount,Math.max(0,target.cash));if(!amount)throw Error('That resident has no cash left to seize.');}
  const toTreasury=type==='dictatorIRS'&&act.destination!=='personal';
  if(!Number.isSafeInteger(target.cash-amount)||!Number.isSafeInteger((toTreasury?s.treasury:leader.cash)+amount))throw Error('Amount would exceed the game money system.');
  charge(s,target,amount,type==='dictatorIRS'?'executive IRS assessment':type==='dictatorSeize'?'cash seizure':'dictator personal tax',toTreasury?undefined:leader,{quiet:true});
  if(toTreasury)s.treasury+=amount;
  transaction(s,'👑 UNLIMITED EXECUTIVE COLLECTION',`${leader.name} ${type==='dictatorIRS'?'charged':type==='dictatorSeize'?'seized cash from':'taxed'} ${target.name} for $${amount.toLocaleString()}, deposited ${toTreasury?'in the treasury':'to the ruler'}.`,'cost',{type,amount,target:target.id,leader:actor});
 }
 s.revision++;return s;
}
if(type==='callElection'){if(s.lastGovElection===s.round)throw Error('A government election already occurred this round.');if(!['roll','end'].includes(s.phase))throw Error('Call an election between player actions.');openGovernmentVote(s);s.revision++;return s;}
if(actor!==s.turn)throw Error('It is not your turn.');let p=current(s);let id=Number(act.id),a=s.assets[id];const own=()=>{if(!Number.isInteger(id)||!a||a.owner!==p.id)throw Error('You do not own this property.');};const normal=()=>{if(!['roll','buy','end'].includes(s.phase))throw Error('Resolve your shortfall first.');};
switch(type){case 'roll':if(s.phase!=='roll')throw Error('You already rolled.');{let d1=1+Math.floor(rng()*6),d2=1+Math.floor(rng()*6),n=d1+d2;s.lastRoll=[d1,d2];let old=p.pos;p.pos=(old+n)%board.length;s.moveSeq++;s.movement={seq:s.moveSeq,player:p.id,from:old,to:p.pos,steps:n,dice:[d1,d2]};log(s,`${p.name} rolled ${d1} + ${d2} = ${n}.`);if(old+n>=board.length){let paid=money(s.wage*(p.qol>=80?1.07:p.qol<=30?.90:1));p.cash+=paid;transaction(s,'Payday',`${p.name} collected a $${paid.toLocaleString()} paycheck${paid!==s.wage?' (wellbeing adjustment)':''}.`,'good',{player:p.id,amount:paid});}land(s,p,rng);}break;
case 'buy':if(s.phase!=='buy')throw Error('No purchase is available.');id=p.pos;if(s.assets[id]||board[id].type!=='property')throw Error('Property is unavailable.');{if(socialPublic(s,id))throw Error('This is a publicly funded service under the current government.');if(p.propertyBan)throw Error('Citizens permanently barred this former dictator from acquiring property.');let cost=purchaseCost(s,id,p.id);if(p.cash<cost)throw Error('Not enough cash. Borrow or sell an asset first.');p.cash-=cost;s.assets[id]={owner:p.id,level:0,purchasePrice:cost,purchaseRound:s.round,damage:s.disasterSites?.[id]?.severity||0,closed:!!s.disasterSites?.[id]};s.phase='end';if(s.government==='dictatorship')s.treasury+=cost-price(s,id);checkOligarchy(s);transaction(s,'Property sold!',`${p.name} bought ${board[id].name} from the bank for $${cost.toLocaleString()}. Rent: $${rent(s,id).toLocaleString()}. New cash: $${p.cash.toLocaleString()}.`,'good',{player:p.id,property:id,amount:cost,type:'purchase',receipt:{property:board[id].name,buyer:p.name,seller:'City Bank',price:cost,rent:rent(s,id),cash:p.cash,owner:p.name}});}break;
case 'pass':if(s.phase!=='buy')throw Error('Nothing to pass.');s.phase='end';log(s,`${p.name} passed on ${board[p.pos].name}.`);break;
case 'end':if(s.phase!=='end')throw Error('Complete your turn first.');if(s.round===2&&p.irsVisits===0)summonIRS(s,p,rng);advance(s,rng);break;

case 'upgrade':normal();own();if(s.disasterSites?.[id])throw Error('Repair the damaged property before upgrading.');if(a.level>=2)throw Error('Maximum upgrade level reached.');{let cost=upgradeCost(s,id);if(p.cash<cost)throw Error('Not enough cash.');p.cash-=cost;a.level++;transaction(s,'Property upgraded',`${p.name} upgraded ${board[id].name} to level ${a.level} for $${cost.toLocaleString()}. New rent: $${rent(s,id).toLocaleString()}.`,'good',{player:p.id,property:id,amount:cost,type:'upgrade'});}break;
case 'sell':own();{let value=money(assetValue(s,id)*.7);delete s.assets[id];p.cash+=value;checkOligarchy(s);transaction(s,'Property returned to bank',`${p.name} sold ${board[id].name} to the bank for $${value.toLocaleString()}. It is available again.`,'good',{player:p.id,property:id,amount:value,type:'sale',receipt:{property:board[id].name,buyer:'City Bank',seller:p.name,price:value,cash:p.cash,owner:'City Bank (for sale)'}});if(s.phase==='distress'&&p.cash>=0){s.phase=s.resumePhase||'end';s.resumePhase=null;}}break;
case 'borrow':normal();{let amount=Number(act.amount);if(![250,500,1000,2000].includes(amount)||p.debt+amount>5000)throw Error('Loan limit is $5,000.');p.cash+=amount;p.debt+=amount;transaction(s,'New bank loan',`${p.name} borrowed $${amount.toLocaleString()}. Total debt: $${p.debt.toLocaleString()}.`,'cost');}break;
case 'repay':normal();{let amount=act.amount==='all'?Math.min(p.cash,p.debt):Number(act.amount);if(!Number.isInteger(amount)||amount<=0||amount>p.cash||amount>p.debt)throw Error('Repayment exceeds your available cash or debt.');p.cash-=amount;p.debt-=amount;transaction(s,'Loan repayment',`${p.name} repaid $${amount.toLocaleString()}. Remaining debt: $${p.debt.toLocaleString()}.`,'good');}break;
case 'bankrupt':if(s.phase!=='distress')throw Error('Bankruptcy is available only during a shortfall.');p.bankrupt=true;p.cash=0;p.debt=0;for(let k of Object.keys(s.assets))if(s.assets[k].owner===p.id)delete s.assets[k];if(s.leader===p.id){s.leader=s.players.find(q=>q.id!==p.id&&!q.bankrupt)?.id??null;log(s,'An acting ruler took office after the previous ruler was eliminated.','event');}checkOligarchy(s);transaction(s,'Bankruptcy',`${p.name} declared bankruptcy and left the game. Their properties returned to the bank.`,'cost');advance(s,rng);break;
default:throw Error('Unknown action.');}s.revision++;return s;}
return {board,groups,COLORS,create,action,price,purchaseCost,rent,repairCost,upgradeCost,assetValue,net,current,DICTATOR_CHOICES,openRevolution,closeRevolution,beginJudgment,closeJudgment,openDictatorTurn,dictatorDecision,dictatorTransfer,tokenColors,tick,ensure,events,surpriseEvents,draw,policies,GOVERNMENTS,GOVERNMENT_OPTIONS,DISASTERS,IRS_OUTCOMES,ownedCount,voteWeight,taxDue,checkOligarchy,triggerDisaster,irsVisit,summonIRS,openGovernmentVote,collectTaxes};});
