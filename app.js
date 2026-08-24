const K='flc-v3';
const FOOD=[['tea','☕ Tea · 250 ml',100,4,4,10],['chap','🫓 Chapathi · 1 piece',120,4,3,20],['chicken','🍗 Chicken curry · 1 serving',220,30,10,2],['chick','🫘 Chickpea curry · 1 bowl',220,10,6,30],['peanut','🥜 Peanuts · 25 g',145,6,12,5],['pump','🎃 Pumpkin seeds · 25 g',140,7,12,4],['egg','🥚 Eggs · 2',140,12,10,1],['banana','🍌 Banana · 1',105,1,0,27],['curd','🥣 Curd · 150 g',90,5,4,7]];
const TEST=[['pull','🏋️ Pull-ups','reps',10],['push','💪 Push-ups','reps',18],['plank','🧱 Plank','sec',60],['leg','🦵 Lying leg raises','reps',12],['hang','🔗 Hanging knee raises','reps',8],['roller','🛞 Ab roller','reps',4],['side','↔️ Side plank','sec/side',30],['squat','🦵 Squats','reps',30]];
let s=JSON.parse(localStorage.getItem(K)||'null')||{age:29,activity:1.35,deficit:400,targets:{cal:1700,p:120,f:55,c:185},cal:0,p:0,f:0,c:0,meals:[],steps:0,cycle:0,burn:0,workout:false,tests:{pull:10,push:18,plank:60,leg:12,hang:8,roller:4,side:30,squat:30},weights:[68],measure:[{day:0,w:68,b:97,z:90,ch:100,arm:30}],daily:[]};
function save(){localStorage.setItem(K,JSON.stringify(s))}
function go(id){document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.p===id));render()}
function modal(id){document.getElementById(id).classList.add('show');if(id==='profile'){age.value=s.age;activity.value=s.activity;deficit.value=s.deficit}}
function closeM(){document.querySelectorAll('.modal').forEach(x=>x.classList.remove('show'))}
function toast(t){let x=document.getElementById('toast');x.textContent=t;x.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>x.classList.remove('show'),2200)}
function saveProfile(){s.age=+age.value;s.activity=+activity.value;s.deficit=+deficit.value;let bmr=10*68+6.25*159-5*s.age+5,tdee=bmr*s.activity;let cal=Math.max(1400,Math.round(tdee-s.deficit));let p=120,f=55,c=Math.round((cal-p*4-f*9)/4);s.targets={cal,p,f,c};save();closeM();render();toast(`${cal} kcal · ${p} g protein target`)}
function add(id){let x=FOOD.find(x=>x[0]===id);s.cal+=x[2];s.p+=x[3];s.f+=x[4];s.c+=x[5];s.meals.push(x);save();render();toast(x[1]+' added')}
function customFood(){let x=['custom','🍽️ '+fn.value,+fc.value||0,+fp.value||0,+ff.value||0,+fcarb.value||0];s.cal+=x[2];s.p+=x[3];s.f+=x[4];s.c+=x[5];s.meals.push(x);save();closeM();render();toast('Food added')}
function clearToday(){s.cal=0;s.p=0;s.f=0;s.c=0;s.meals=[];save();render()}
function steps(v){s.steps=+v;save();render()}
function saveWeight(){let w=+nw.value;s.weights.push(w);save();closeM();render();toast('Weight saved')}
function saveMeasure(){let m={day:s.measure.length*7,w:+mw.value,b:+mb.value,z:+mz.value,ch:+mc.value,arm:+marm.value};s.measure.push(m);s.weights.push(m.w);save();closeM();render();toast('Measurements saved')}
function saveTests(){TEST.forEach(t=>s.tests[t[0]]=+document.getElementById('t_'+t[0]).value||0);save();render();toast('Day 0 baseline saved')}
function completeWorkout(){s.workout=true;s.burn+=+wb.value||0;s.daily.push(snapshot());save();render();toast('Workout logged')}
function snapshot(){return{day:s.daily.length+1,cal:s.cal,p:s.p,f:s.f,c:s.c,burn:s.burn,steps:s.steps,weight:s.weights.at(-1)}}
function plan(){if(!s.targets){modal('profile');return}let rem=s.targets.cal-s.cal,rp=s.targets.p-s.p;let title=rp>35?'Protein-focused dinner':'Balanced next meal';let text=rp>35?'Try 4 chapathi + 4 medium chicken pieces + vegetables, adjusting portions to fit the remaining calories.':'Try 3–4 chapathi + chicken curry + vegetables, or a measured biryani portion with a protein-rich side.';document.getElementById('pt').textContent=title;document.getElementById('px').textContent=`${text} Remaining: ${Math.max(0,Math.round(rem))} kcal and ${Math.max(0,Math.round(rp))} g protein.`;go('food')}
function week(){if(s.daily.length<1){toast('Keep logging daily data. The first full review is after 7 days.');return}let d=s.daily.slice(-7),ac=d.reduce((a,x)=>a+x.cal,0)/d.length,ap=d.reduce((a,x)=>a+x.p,0)/d.length,ab=d.reduce((a,x)=>a+x.burn,0),as=d.reduce((a,x)=>a+x.steps,0)/d.length;let w=s.weights.at(-1)-68;let msg=`Last ${d.length} logged day(s): average intake ${Math.round(ac)} kcal/day, protein ${Math.round(ap)} g/day, estimated exercise burn ${Math.round(ab)} kcal total, average steps ${Math.round(as).toLocaleString()}. Weight change from 68 kg: ${w>=0?'+':''}${w.toFixed(1)} kg. ${d.length<7?'Continue until Day 7 before making a meaningful plan change.':'Use this trend to decide whether to keep or tweak calories/activity.'}`;document.getElementById('analysis').textContent=msg;go('progress')}
function resetApp(){if(confirm('Reset all app data?')){localStorage.removeItem(K);location.reload()}}
function render(){
document.getElementById('day').textContent='Day '+Math.max(0,s.measure.length-1);
let t=s.targets;cu.textContent=Math.round(s.cal);ct.textContent=t.cal;ps.textContent=`${Math.round(s.p)} / ${t.p} g`;fs.textContent=`${Math.round(s.f)} / ${t.f} g`;cs.textContent=`${Math.round(s.c)} / ${t.c} g`;cb.style.width=Math.min(100,s.cal/t.cal*100)+'%';
rem.textContent=Math.max(0,Math.round(t.cal-s.cal)).toLocaleString()+' kcal';rp.textContent=Math.max(0,Math.round(t.p-s.p))+' g protein';rf.textContent=Math.max(0,Math.round(t.f-s.f))+' g fat';
steps.textContent=s.steps.toLocaleString();walk.textContent=Math.round(s.steps/100)+' min';cy.textContent=s.cycle+' min';burn.textContent=Math.round(s.burn)+' kcal';hw.textContent=s.weights.at(-1).toFixed(1);hb.textContent=s.measure.at(-1).b;hz.textContent=s.measure.at(-1).z;pb.textContent=s.tests.pull;
let score=Math.round(Math.min(35,s.p/t.p*35)+Math.min(35,s.cal<=t.cal?35:t.cal/s.cal*35)+Math.min(15,s.steps/7000*15)+(s.workout?15:0));document.getElementById('score').textContent=score;coach.textContent=`Target ${t.cal} kcal · ${t.p} g protein. Log meals and I'll plan what comes next.`;
document.getElementById('foods').innerHTML=FOOD.map(x=>`<button onclick="add('${x[0]}')">${x[1]}<b>~${x[2]} kcal</b></button>`).join('');
document.getElementById('log').innerHTML=s.meals.length?s.meals.map(x=>`<div class="meal"><span>${x[1]}<small>${x[3]} g protein · ${x[4]} g fat</small></span><b>${x[2]} kcal</b></div>`).join(''):'<div class="card">No meals logged today.</div>';
document.getElementById('tests').innerHTML=TEST.map(t=>`<div class="test"><span>${t[1]}</span><input id="t_${t[0]}" type="number" value="${s.tests[t[0]]}"><small>${t[2]}</small></div>`).join('');
document.getElementById('measurements').innerHTML=s.measure.slice(-5).reverse().map(m=>`<div class="line" style="padding:8px 0"><span>Day ${m.day}</span><b>${m.w} kg · ${m.b} cm belly · ${m.z} cm waist</b></div>`).join('');
document.getElementById('weightChart').textContent=s.weights.length>1?'Weight: '+s.weights.join(' → ')+' kg':'Add daily weights to see trend';
document.getElementById('nutritionChart').innerHTML=s.daily.length?`Daily calories: ${s.daily.map(x=>x.cal).join(' · ')}<br>Protein: ${s.daily.map(x=>x.p).join(' · ')} g`:'Log daily data to see nutrition history.';
document.getElementById('activityChart').innerHTML=s.daily.length?`Exercise burn: ${s.daily.map(x=>x.burn).join(' · ')} kcal<br>Steps: ${s.daily.map(x=>x.steps).join(' · ')}`:'Exercise calories will appear here.';
document.getElementById('summary').textContent=`Age ${s.age} · Lightly active · ${t.cal} kcal`;
}
render();if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
