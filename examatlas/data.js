/*
 * EXAMATLAS DEMONSTRATION DATA
 * These are EXAMPLE opportunities. Every application date, examination date,
 * rule and match is an illustrative placeholder. None is a verified schedule.
 * Before public launch, replace this file with server-verified records.
 */
(() => {
  const CATEGORIES = [
    {name:'Engineering',icon:'⚙️',background:'#e5edff'},
    {name:'Medicine',icon:'🩺',background:'#fce8ea'},
    {name:'Science',icon:'🔬',background:'#e4f4fa'},
    {name:'Commerce',icon:'📈',background:'#fff1e0'},
    {name:'Law',icon:'⚖️',background:'#f2eafd'},
    {name:'Design',icon:'🎨',background:'#fff0e9'},
    {name:'Management',icon:'💼',background:'#e5f1ff'},
    {name:'Defence',icon:'🛡️',background:'#e7f8ed'},
    {name:'Government Jobs',icon:'🏛️',background:'#fff0dc'},
    {name:'Professional',icon:'📜',background:'#e7eef8'},
    {name:'International',icon:'🌍',background:'#e8f6f8'},
    {name:'Scholarships',icon:'✨',background:'#fff2d2'},
    {name:'Universities',icon:'🎓',background:'#f3edff'},
    {name:'Maritime',icon:'🚢',background:'#e4f5f3'},
  ];
  const D = (opens, closes, exam) => ({opens,closes,exam});
  const E = (id,name,organizer,category,type,streams,description,url,dates,extra={}) => ({
    id,name,organizer,category,type,streams,description,url,...dates,
    country:extra.country || 'India',
    state:extra.state || '',
    requiredSubjects:extra.requiredSubjects || [],
    eligibilityNotes:extra.eligibilityNotes || ['Class 12 appearing / qualified candidates may be considered; confirm exact cycle rules.'],
    tags:extra.tags || [],
    admissionsNote:extra.admissionsNote || 'Admission, counselling, minimum marks and seat-allotment rules can differ from eligibility to appear for the exam.',
    sourceVerified:false,
    featured:!!extra.featured
  });
  const OPPORTUNITIES = [
    E('jee-main','JEE Main','National Testing Agency','Engineering','Entrance exam',['PCM'],'National-level engineering entrance examination for participating institutions.','https://jeemain.nta.nic.in/',D('2026-11-01','2026-12-05','2027-01-22'),{requiredSubjects:['Mathematics','Physics'],tags:['B.Tech','B.E.','NIT','IIIT'],featured:true,eligibilityNotes:['PCM is relevant for engineering pathways.','Qualifying-year, subject combinations and admission thresholds require official-cycle checking.']}),
    E('jee-advanced','JEE Advanced','IIT organizing institute','Engineering','Entrance exam',['PCM'],'Entrance examination used for undergraduate admissions to the IITs.','https://jeeadv.ac.in/',D('2027-04-14','2027-05-04','2027-05-25'),{requiredSubjects:['Physics','Chemistry','Mathematics'],tags:['IIT','B.Tech'],eligibilityNotes:['Admission routes often involve JEE Main performance and rank requirements.','Board marks, qualifying years and attempt rules require official verification.']}),
    E('bitsat','BITSAT','BITS Pilani','Engineering','Entrance exam',['PCM','PCB'],'Entrance test for selected undergraduate programmes at BITS campuses.','https://www.bitsadmission.com/',D('2026-12-10','2027-02-18','2027-05-23'),{tags:['BITS','B.E.','B.Pharm'],requiredSubjects:['Physics','Chemistry'],eligibilityNotes:['Programme-specific PCM or PCB combinations may apply.','Minimum subject-wise and aggregate percentage conditions need verification.']}),
    E('viteee','VITEEE','VIT','Engineering','Entrance exam',['PCM','PCB'],'Entrance examination for selected VIT undergraduate engineering programmes.','https://viteee.vit.ac.in/',D('2026-11-09','2027-03-29','2027-04-27'),{tags:['VIT','B.Tech'],featured:true,eligibilityNotes:['Subject combinations and programme-specific rules may vary.','Check minimum marks, qualifying year and official criteria.']}),
    E('srmjeee','SRMJEEE','SRM Institute of Science and Technology','Engineering','Entrance exam',['PCM','PCB'],'University entrance test for selected undergraduate engineering programmes.','https://www.srmist.edu.in/',D('2027-01-11','2027-04-10','2027-04-21'),{tags:['SRM','B.Tech']}),
    E('comedk','COMEDK UGET','COMEDK','Engineering','Entrance exam',['PCM'],'Undergraduate entrance examination used by participating colleges in Karnataka.','https://www.comedk.org/',D('2027-02-02','2027-04-01','2027-05-09'),{state:'Karnataka',tags:['B.Tech','Karnataka']}),
    E('wbjee','WBJEE','WBJEEB','Engineering','Entrance exam',['PCM'],'State-level entrance exam for participating undergraduate programmes in West Bengal.','https://wbjeeb.nic.in/',D('2027-01-07','2027-02-06','2027-04-25'),{state:'West Bengal',tags:['State CET']}),
    E('mht-cet','MHT CET','State CET Cell, Maharashtra','Engineering','Entrance exam',['PCM','PCB'],'State entrance exam for relevant professional undergraduate courses in Maharashtra.','https://cetcell.mahacet.org/',D('2027-01-02','2027-02-22','2027-05-10'),{state:'Maharashtra',tags:['Maharashtra','State CET']}),
    E('kcet','KCET','Karnataka Examinations Authority','Engineering','Entrance exam',['PCM','PCB'],'Common entrance examination used in Karnataka for selected courses.','https://cetonline.karnataka.gov.in/kea/',D('2027-01-19','2027-03-04','2027-04-18'),{state:'Karnataka',tags:['State CET']}),
    E('neet-ug','NEET UG','National Testing Agency','Medicine','Entrance exam',['PCB'],'National medical entrance examination for undergraduate medical and related pathways.','https://neet.nta.nic.in/',D('2027-02-04','2027-03-06','2027-05-02'),{requiredSubjects:['Physics','Chemistry','Biology'],tags:['MBBS','BDS','Medical'],eligibilityNotes:['Biology-related subject requirements apply to the main medical route.','Age, recognized qualification, marks and other current-cycle requirements need confirmation.']}),
    E('cuet-ug','CUET UG','National Testing Agency','Universities','Entrance exam',['Any'],'Common university entrance examination accepted by participating institutions.','https://cuet.nta.nic.in/',D('2027-02-06','2027-03-10','2027-05-14'),{tags:['B.A.','B.Sc.','B.Com.','Universities'],featured:true,eligibilityNotes:['Class 12 candidates may pursue relevant programmes.','Individual universities determine eligible subject combinations and admission requirements.']}),
    E('iiser-iat','IISER IAT','IISER Admissions','Science','Entrance exam',['PCM','PCB'],'Admission test for selected science and interdisciplinary undergraduate programmes.','https://iiseradmission.in/',D('2027-03-12','2027-04-22','2027-06-06'),{tags:['Research','BS-MS','Science']}),
    E('nest','NEST','NISER / UM-DAE CEBS','Science','Entrance exam',['PCM','PCB'],'Entrance screening test for selected integrated science programmes.','https://www.nestexam.in/',D('2027-02-11','2027-04-28','2027-06-13'),{tags:['Research','Integrated MSc']}),
    E('clat','CLAT UG','Consortium of National Law Universities','Law','Entrance exam',['Any'],'Common Law Admission Test for participating undergraduate law programmes.','https://consortiumofnlus.ac.in/',D('2026-09-01','2026-11-27','2026-12-13'),{tags:['LL.B.','Law','NLU'],featured:true,eligibilityNotes:['Different educational streams may be considered.','Qualifying examination, marks and other official conditions must be checked.']}),
    E('ailet','AILET','National Law University Delhi','Law','Entrance exam',['Any'],'All India Law Entrance Test for eligible programmes at NLU Delhi.','https://nationallawuniversitydelhi.in/',D('2026-08-18','2026-11-24','2026-12-14'),{tags:['Law','BA LLB']}),
    E('ipmat','IPMAT Indore','IIM Indore','Management','Entrance exam',['Any'],'Integrated Programme in Management Aptitude Test for eligible candidates.','https://www.iimidr.ac.in/',D('2027-02-14','2027-03-30','2027-05-20'),{tags:['IPM','IIM','Management'],eligibilityNotes:['Minimum academic percentages and qualifying-year constraints may apply.','Check any age, category and programme-specific conditions.']}),
    E('jipmat','JIPMAT','National Testing Agency','Management','Entrance exam',['Any'],'Joint Integrated Programme in Management Admission Test.','https://exams.nta.ac.in/JIPMAT/',D('2027-03-01','2027-04-16','2027-05-31'),{tags:['IPM','IIM']}),
    E('set','Symbiosis SET','Symbiosis International University','Management','Entrance exam',['Any'],'University entrance test for participating undergraduate programmes.','https://www.set-test.org/',D('2026-12-01','2027-04-03','2027-05-08'),{tags:['BBA','Mass Communication']}),
    E('uceed','UCEED','IIT Bombay','Design','Entrance exam',['Any'],'Undergraduate Common Entrance Examination for Design.','https://www.uceed.iitb.ac.in/2027/',D('2026-10-05','2026-11-30','2027-01-17'),{tags:['B.Des','IIT','Design'],featured:true,eligibilityNotes:['Candidates from different streams may be able to take UCEED.','First appearance year, age and number of attempts are important.','B.Des admission to individual institutions has separate eligibility rules.']}),
    E('nid-dat','NID DAT','National Institute of Design','Design','Entrance exam',['Any'],'Design Aptitude Test for participating NID undergraduate programmes.','https://admissions.nid.edu/',D('2026-10-25','2026-12-07','2027-01-05'),{tags:['B.Des','Design']}),
    E('nift','NIFT Entrance','National Institute of Fashion Technology','Design','Entrance exam',['Any'],'Selection route for eligible design, fashion and technology programmes.','https://www.nift.ac.in/',D('2026-11-21','2027-01-08','2027-02-12'),{tags:['Fashion','Design']}),
    E('nata','NATA','Council of Architecture','Design','Entrance exam',['PCM'],'National Aptitude Test in Architecture for architecture admissions.','https://www.nata.in/',D('2027-02-16','2027-05-08','2027-05-25'),{requiredSubjects:['Mathematics'],tags:['B.Arch','Architecture'],eligibilityNotes:['Subject combination and marks rules for B.Arch admissions require confirmation.']}),
    E('nda','NDA & NA','Union Public Service Commission','Defence','Entrance exam',['Any'],'Competitive examination for eligible entry to the National Defence Academy and Naval Academy.','https://upsc.gov.in/',D('2026-12-23','2027-01-12','2027-04-18'),{tags:['Army','Navy','Air Force'],eligibilityNotes:['Academy and service-specific subjects can differ.','Age, nationality, marital status and other conditions are essential and must be verified.']}),
    E('imu-cet','IMU CET','Indian Maritime University','Maritime','Entrance exam',['PCM'],'Common entrance examination for selected maritime programmes.','https://www.imu.edu.in/',D('2027-03-10','2027-05-06','2027-06-08'),{requiredSubjects:['Physics','Chemistry','Mathematics'],tags:['Merchant Navy','Marine Engineering']}),
    E('ssc-chsl','SSC CHSL','Staff Selection Commission','Government Jobs','Government job',['Any'],'Recruitment examination for specified posts requiring Class 12 qualifications.','https://ssc.gov.in/',D('2027-05-01','2027-05-28','2027-08-10'),{tags:['LDC','DEO','Government'],eligibilityNotes:['Post-specific age, education, nationality and other requirements apply.','Certain posts may require specific subjects and marks.']}),
    E('rrb-ntpc','RRB NTPC UG','Railway Recruitment Boards','Government Jobs','Government job',['Any'],'Recruitment pathway for eligible undergraduate-level non-technical railway posts.','https://indianrailways.gov.in/',D(null,null,null),{tags:['Railways','12th pass','Recruitment'],eligibilityNotes:['Vacancy notification, age criteria and post eligibility vary by cycle.']}),
    E('ca-foundation','CA Foundation','Institute of Chartered Accountants of India','Professional','Professional qualification',['Any'],'Entry-level qualifying examination in the Chartered Accountancy pathway.','https://www.icai.org/',D('2027-01-03','2027-02-09','2027-05-12'),{tags:['Chartered Accountant','Accounts'],eligibilityNotes:['Registration, examination form and eligibility milestones require separate checks.']}),
    E('cma-foundation','CMA Foundation','Institute of Cost Accountants of India','Professional','Professional qualification',['Any'],'Foundation-level examination for a Cost and Management Accountancy pathway.','https://icmai.in/',D('2027-01-03','2027-03-12','2027-06-12'),{tags:['Cost Accounting','Commerce']}),
    E('cseet','CSEET','Institute of Company Secretaries of India','Professional','Professional qualification',['Any'],'Entrance examination in the Company Secretary qualification pathway.','https://www.icsi.edu/',D('2026-11-12','2026-12-15','2027-01-10'),{tags:['Company Secretary','CS','Commerce']}),
    E('sat','SAT','College Board','International','Entrance exam',['Any'],'Standardized test accepted by some universities, including institutions outside India.','https://satsuite.collegeboard.org/sat',D('2026-11-20','2027-02-22','2027-03-13'),{country:'International',tags:['Study Abroad','Universities'],eligibilityNotes:['The test is not itself a guarantee of admission.','Institution and country-specific requirements vary.']}),
    E('act','ACT','ACT','International','Entrance exam',['Any'],'Standardized assessment accepted by some universities, mainly for undergraduate admissions.','https://www.act.org/',D(null,null,null),{country:'International',tags:['Study Abroad','University']}),
    E('nsp','National Scholarship Portal','Government of India','Scholarships','Scholarship',['Any'],'Portal for eligible scholarship schemes; each scheme has its own criteria and dates.','https://scholarships.gov.in/',D('2026-11-23','2027-01-23',null),{tags:['Financial Aid','Merit','Need'],eligibilityNotes:['Eligibility differs by scholarship scheme, institution, income and other conditions.','A portal-wide application window cannot establish eligibility for every scheme.']}),
    E('ashoka','Ashoka University UG Admissions','Ashoka University','Universities','Admissions',['Any'],'Undergraduate application pathway with institution-specific selection steps.','https://www.ashoka.edu.in/',D('2026-10-18','2026-12-10',null),{tags:['Liberal Arts','Admissions'],eligibilityNotes:['The university determines current-cycle prerequisites and selection requirements.']}),
  ];
  window.ExamAtlasData={CATEGORIES,OPPORTUNITIES};
})();
