const FOOD=[
['tea','☕ Tea · 250 ml',100,4,4,10,'count'],['chap','🫓 Chapathi · 1',120,4,3,20,'count'],['appam','🥞 Appam · 1',120,2,2,24,'count'],['egg','🥚 Egg · 1',70,6,5,.5,'count'],
['rice','🍚 Plain rice · 100 g',130,2.4,.3,28,'weight'],['biryani','🍛 Biryani rice · 100 g',180,4,6,28,'weight'],['chicken','🍗 Chicken curry · 100 g',180,25,8,3,'weight'],['fish','🐟 Fish curry/fish · 100 g',150,22,6,2,'weight'],
['pump','🎃 Pumpkin seeds · 25 g',140,7,12,4,'count'],['peanut','🥜 Peanuts · 25 g',145,6,12,5,'count'],['biscuit','🍪 Biscuit · 2 pieces',100,2,4,15,'count'],
['puttu','🥥 Puttu · 100 g',170,4,3,31,'weight'],['parotta','🫓 Kerala porotta · 1',220,4,9,30,'count'],['dosa','🥞 Dosa · 1',130,3,3,22,'count'],['idli','⚪ Idli · 2',120,4,1,25,'count'],['matta','🍚 Kerala matta rice · 100 g',130,2.7,.4,28,'weight'],
['chickpea','🫘 Chickpea curry · 100 g',130,6,4,18,'weight'],['avial','🥕 Avial · 100 g',120,3,7,12,'weight'],['thoran','🥬 Vegetable thoran · 100 g',130,3,8,12,'weight'],
['sardine','🐟 Sardine / mathi · 100 g',208,25,11,0,'weight'],['beef','🥩 Beef curry · 100 g',250,25,16,2,'weight']
];
const QUICK={morning:['tea','chap','appam','egg'],lunch:['rice','biryani','chicken','fish'],evening:['tea','pump','peanut','biscuit'],dinner:['chap','appam','puttu','parotta']};
const LABEL={morning:'Morning',lunch:'Lunch',evening:'Evening',dinner:'Dinner'};
const START={weight:68,belly:97,waist:90,chest:100,biceps:30,pull:10,push:18,plank:60,leg:12,hang:8,roller:4,side:30,squat:30};
let profile={age:29,height:159,weight:68,activity:1.35,deficit:400,targets:{cal:1700,p:120,f:55,c:185}};
let day={date:today(),cal:0,p:0,f:0,c:0,steps:0,cycle:0,burn:0,workout:{}};
let meals=[];let dailyHistory=[];let savedFoods=[];let webPending=null;let user=null;

function today(){return new Date().toISOString().slice(0,10)}
function win(){const h=new Date().getHours();return h<11?'morning':h<15?'lunch':h<19?'evening':'dinner'}
function saveLocal(){localStorage.setItem('flc_cache',JSON.stringify({profile,day,meals,dailyHistory,savedFoods}))}
function loadLocal(){try{const x=JSON.parse(localStorage.getItem('flc_cache'));if(x){profile=x.profile||profile;day=x.day||day;meals=x.meals||[];dailyHistory=x.dailyHistory||[];savedFoods=x.savedFoods||[]}}catch{}}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
function go(id){document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.p===id));render()}
function openModal(id){document.getElementById(id).classList.add('show')}
function closeModals(){document.querySelectorAll('.modal').forEach(x=>x.classList.remove('show'))}

async function init(){
 loadLocal();
 const {data}=await sb.auth.getSession(); user=data.session?.user||null;
 if(!user){openModal('authModal')} else {await loadCloud()}
 render();
}
async function auth(mode){
 const email=authEmail.value.trim(),pass=authPassword.value;
 if(!email||pass.length<6){authMsg.textContent='Enter a valid email and password (6+ characters).';return}
 let r=mode==='signup'?await sb.auth.signUp({email,password:pass}):await sb.auth.signInWithPassword({email,password:pass});
 if(r.error){authMsg.textContent=r.error.message;return}
 user=r.data.user;closeModals();await loadCloud();render();toast(mode==='signup'?'Account created':'Signed in')
}
async function signOut(){await sb.auth.signOut();user=null;openModal('authModal');toast('Signed out')}

async function loadCloud(){
 if(!user)return;
 const {data:p}=await sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
 if(p){profile={...profile,age:p.age||29,height:p.height_cm||159,weight:p.starting_weight_kg||68,activity:p.activity_level==='lightly_active'?1.35:1.2,targets:{cal:p.calorie_target||1700,p:p.protein_target||120,f:p.fat_target||55,c:p.carb_target||185}}}
 else await saveProfile(true);
 const {data:logs}=await sb.from('daily_logs').select('*').eq('user_id',user.id).order('date');
 dailyHistory=(logs||[]).map(x=>({date:x.date,cal:x.calories||0,p:x.protein||0,f:x.fat||0,c:x.carbs||0,burn:x.exercise_calories||0,steps:x.steps||0,weight:x.weight_kg}));
 const {data:ml}=await sb.from('meals').select('*').eq('user_id',user.id).eq('date',today()).order('created_at');
 meals=(ml||[]).map(x=>({id:x.id,name:x.food_name,qty:x.quantity,unit:x.unit,cal:x.calories,p:x.protein,f:x.fat,c:x.carbs,foodKey:x.food_key||''}));
 const {data:foods}=await sb.from('foods').select('*').eq('user_id',user.id).order('name');
 savedFoods=foods||[];
}
async function upsertDaily(){
 if(!user){saveLocal();return}
 await sb.from('daily_logs').upsert({user_id:user.id,date:day.date,calories:day.cal,protein:day.p,fat:day.f,carbs:day.c,exercise_calories:day.burn,steps:day.steps,walking_minutes:Math.round(day.steps/100),cycling_minutes:day.cycle,workout_completed:Object.keys(day.workout).length>0},{onConflict:'user_id,date'});
}
async function saveMealCloud(m){
 if(user) await sb.from('meals').insert({user_id:user.id,date:day.date,food_key:m.foodKey||'',food_name:m.name,quantity:m.qty,unit:m.unit,calories:m.calories,protein:m.p,fat:m.f,carbs:m.c});
}
function calcTarget(){
 const bmr=10*profile.weight+6.25*profile.height-5*profile.age+5;
 const cal=Math.max(1400,Math.round(bmr*profile.activity-profile.deficit));
 const p=120,f=55,c=Math.round((cal-p*4-f*9)/4);
 profile.targets={cal,p,f,c};
}
async function saveProfile(silent=false){
 profile.age=+age.value||29;profile.height=+height.value||159;profile.weight=+startWeight.value||68;profile.activity=+activity.value||1.35;profile.deficit=+deficit.value||400;calcTarget();
 if(user) await sb.from('profiles').upsert({id:user.id,age:profile.age,height_cm:profile.height,starting_weight_kg:profile.weight,activity_level:profile.activity===1.35?'lightly_active':'other',calorie_target:profile.targets.cal,protein_target:profile.targets.p,fat_target:profile.targets.f,carb_target:profile.targets.c});
 saveLocal();if(!silent){closeModals();render();toast('Targets saved')}
}
function setSteps(v){day.steps=+v;saveLocal();render();upsertDaily()}
function foodByKey(k){return FOOD.find(x=>x[0]===k)||savedFoods.find(x=>x.food_key===k)}
function addFood(food,qty=1,unit='count'){
 const factor=qty;
 const m={foodKey:food[0]||food.food_key,name:food[1]||food.name,qty,unit,cal:(food[2]||food.calories_100g)*factor,p:(food[3]||food.protein_100g)*factor,f:(food[4]||food.fat_100g)*factor,c:(food[5]||food.carbs_100g)*factor};
 // For count foods values are per item/serving; weight foods use qty grams / 100.
 if(food[6]==='weight'||food.unit==='100g'){m.cal=(food[2]||food.calories_100g)*qty/100;m.p=(food[3]||food.protein_100g)*qty/100;m.f=(food[4]||food.fat_100g)*qty/100;m.c=(food[5]||food.carbs_100g)*qty/100;m.unit='g'}
 const existing=meals.find(x=>x.foodKey===m.foodKey&&x.unit===m.unit);
 if(existing){existing.qty+=m.qty;existing.cal+=m.cal;existing.p+=m.p;existing.f+=m.f;existing.c+=m.c}else meals.push(m);
 day.cal=meals.reduce((a,x)=>a+x.cal,0);day.p=meals.reduce((a,x)=>a+x.p,0);day.f=meals.reduce((a,x)=>a+x.f,0);day.c=meals.reduce((a,x)=>a+x.c,0);
 saveLocal();upsertDaily();saveMealCloud(m);render();toast(m.name+' added');
}
function openPortion(key){
 const f=foodByKey(key);if(!f)return;
 if(f[6]==='weight'||f.unit==='100g'){portionId.value=key;portionTitle.textContent=f[1]||f.name;portionBase.textContent='Enter the amount in grams.';portionWeight.value=100;openModal('portionModal')}
 else addFood(f,1,'count');
}
function addByWeight(){const f=foodByKey(portionId.value);const g=Math.max(1,+portionWeight.value||0);closeModals();addFood(f,g,'g')}
function addCustomFood(){
 const f={food_key:'custom_'+Date.now(),name:customName.value.trim(),calories_100g:+customCal.value||0,protein_100g:+customP.value||0,fat_100g:+customF.value||0,carbs_100g:+customC.value||0,unit:'100g'};
 if(!f.name){toast('Enter a food name');return}
 if(user) sb.from('foods').insert({user_id:user.id,...f});
 savedFoods.push(f);closeModals();openPortion(f.food_key);toast('Custom food saved')
}
function renderFoodList(q=''){
 const query=q.trim().toLowerCase(), quick=QUICK[win()].map(foodByKey).filter(Boolean);
 const list=query?[...FOOD,...savedFoods.map(x=>[x.food_key,x.name,x.calories_100g,x.protein_100g,x.fat_100g,x.carbs_100g,'weight'])].filter(x=>(x[1]||'').toLowerCase().includes(query)):quick;
 quickTitle.textContent=query?'Search results':'Quick foods';mealWindow.textContent=query?'':LABEL[win()];
 quickFoods.innerHTML=list.length?list.map(x=>`<button onclick="openPortion('${x[0]}')"><span>${x[1]}</span><b>~${Math.round(x[2])} kcal</b></button>`).join(''):'<div class="card">No local match. Try web lookup below.</div>';
 if(query) webLookup.classList.remove('hidden'); else webLookup.classList.add('hidden');
 if(query) webLookup.innerHTML=`<b>🌐 Web lookup</b><p>Search the web for nutrition for “${escapeHtml(query)}”.</p><button class="secondary" onclick="webSearch('${escapeAttr(query)}')">Find nutrition</button>`;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function escapeAttr(s){return s.replace(/'/g,"\\'")}
async function webSearch(q){
 // OpenFoodFacts is a public nutrition source. It is used as the first web lookup.
 webLookup.innerHTML='<b>🌐 Looking up nutrition…</b><p>Checking Open Food Facts.</p>';
 try{
  const r=await fetch('https://world.openfoodfacts.org/cgi/search.pl?search_terms='+encodeURIComponent(q)+'&search_simple=1&action=process&json=1&page_size=5');
  const j=await r.json();const p=j.products?.find(x=>x.product_name&&x.nutriments?.['energy-kcal_100g']);
  if(!p){webLookup.innerHTML='<b>No usable nutrition result.</b><p>Use Add custom food and enter the label values.</p>';return}
  webPending={name:p.product_name,brand:p.brands||'',cal:+p.nutriments['energy-kcal_100g']||0,p:+p.nutriments.proteins_100g||0,f:+p.nutriments.fat_100g||0,c:+p.nutriments.carbohydrates_100g||0,source:'Open Food Facts'};
  webLookup.innerHTML=`<b>${escapeHtml(webPending.name)}</b><small>${escapeHtml(webPending.brand)}</small><p>${webPending.cal} kcal · ${webPending.p} g protein · ${webPending.f} g fat · ${webPending.c} g carbs / 100 g</p><button class="secondary" onclick="confirmWebFood()">Verify & add</button>`;
 }catch(e){webLookup.innerHTML='<b>Web lookup unavailable.</b><p>Use Add custom food instead.</p>'}
}
async function confirmWebFood(){
 if(!webPending)return;
 webFoodInfo.innerHTML=`<b>${escapeHtml(webPending.name)}</b><p>${webPending.cal} kcal · ${webPending.p} g protein · ${webPending.f} g fat · ${webPending.c} g carbs / 100 g<br>Source: ${webPending.source}</p>`;
 webAmount.value=100;openModal('portionConfirmModal')
}
async function addWebFood(){
 const f={food_key:'web_'+Date.now(),name:webPending.name,calories_100g:webPending.cal,protein_100g:webPending.p,fat_100g:webPending.f,carbs_100g:webPending.c,unit:'100g'};
 savedFoods.push(f);
 if(user) await sb.from('foods').insert({user_id:user.id,name:f.name,calories_100g:f.calories_100g,protein_100g:f.protein_100g,fat_100g:f.fat_100g,carbs_100g:f.carbs_100g,source:f.source||'Open Food Facts'});
 const g=Math.max(1,+webAmount.value||100);closeModals();addFood(f,g,'g');webPending=null
}
function clearMeals(){meals=[];day.cal=day.p=day.f=day.c=0;saveLocal();upsertDaily();render()}
function generateMealPlan(){
 const r=Math.max(0,profile.targets.cal-day.cal),p=Math.max(0,profile.targets.p-day.p);
 let text=p>40?`Protein is the priority. Try chicken/fish with rice or chapathi, keeping the portion within about ${Math.round(r)} kcal.`:`A balanced next meal fits the remaining ${Math.round(r)} kcal. Choose a normal rice/chapathi portion plus vegetables and a protein source.`;
 planTitle.textContent=p>40?'Protein-focused next meal':'Balanced next meal';planText.textContent=text
}
function workoutTargets(){
 return [['pull','Pull-ups',6,'reps'],['push','Push-ups',30,'reps'],['roller','Ab roller',6,'reps'],['plank','Plank',60,'sec'],['leg','Leg raises',15,'reps']]
}
function changeExercise(id,d){day.workout[id]=Math.max(0,(day.workout[id]||0)+d);saveLocal();upsertDaily();render()}
function schedule(){
 const h=new Date().getHours(), w=win();
 const slots=[
  {time:'Morning',icon:'🌅',text:'5–10 min mobility. Main strength session after breakfast/tea if convenient.',show:true},
  {time:'After lunch',icon:'🍛',text:'15–20 min easy/brisk walk after digestion; avoid hard exercise immediately after a heavy meal.',show:true},
  {time:'Evening',icon:'🌇',text:'25–40 min exercise cycle or brisk walk if activity target is not met.',show:true},
  {time:'Night',icon:'🌙',text:'Optional light mobility. Avoid hard training close to bedtime.',show:true}
 ];
 return slots;
}
function renderWorkout(){
 const targets=workoutTargets();workoutList.innerHTML=targets.map(x=>`<div class="workout-row"><span class="exerciseName">${x[1]}<small>Target ${x[2]} ${x[3]}</small></span><strong class="target">${x[2]}</strong><div class="stepper"><button onclick="changeExercise('${x[0]}',-1)">−</button><b>${day.workout[x[0]]||0}</b><button onclick="changeExercise('${x[0]}',1)">+</button></div></div>`).join('');
 scheduleList.innerHTML=schedule().map(x=>`<div class="slot"><strong>${x.icon} ${x.time}</strong><small>${x.text}</small></div>`).join('');
 workoutWindowTitle.textContent='Smart daily schedule';workoutWindowText.textContent='Strength is best when you are fueled; walking/cardio can be split into shorter sessions.';
}
function saveActivity(){day.cycle=Math.max(0,+cycleInput.value||0);day.burn=Math.max(0,+burnInput.value||0);saveLocal();upsertDaily();render();toast('Activity saved')}
async function saveWeight(){const w=+newWeight.value||0;if(!w)return;day.weight=w;saveLocal();await upsertDaily();if(user)await sb.from('body_measurements').insert({user_id:user.id,date:day.date,weight_kg:w});closeModals();render();toast('Weight saved')}
async function saveMeasurement(){const x={weight_kg:+measureWeight.value,belly_cm:+measureBelly.value,waist_cm:+measureWaist.value,chest_cm:+measureChest.value,biceps_cm:+measureBiceps.value};if(user)await sb.from('body_measurements').insert({user_id:user.id,date:today(),...x});day.weight=x.weight_kg;await upsertDaily();closeModals();render();toast('Measurements saved')}
function simpleChart(el,vals,label,target=0){
 if(!vals.length){el.textContent='Keep logging daily data.';return}
 const max=Math.max(target,...vals,1),min=Math.min(0,...vals),w=460,h=120,p=12;
 const pts=vals.map((v,i)=>`${p+i*(w-2*p)/Math.max(1,vals.length-1)},${h-p-(v-min)/(max-min)*(h-2*p)}`).join(' ');
 el.innerHTML=`<div style="font-size:10px;color:#6b7280">${label}</div><svg viewBox="0 0 ${w} ${h}" width="100%" height="125"><polyline points="${pts}" fill="none" stroke="#111827" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${target?`<line x1="${p}" x2="${w-p}" y1="${h-p-(target-min)/(max-min)*(h-2*p)}" y2="${h-p-(target-min)/(max-min)*(h-2*p)}" stroke="#9ca3af" stroke-dasharray="5 5"/>`:''}</svg><small>${vals.map(v=>Math.round(v)).join(' · ')}</small>`;
}
async function refreshHistory(){
 if(user){const {data}=await sb.from('daily_logs').select('*').eq('user_id',user.id).order('date');dailyHistory=(data||[]).map(x=>({date:x.date,cal:x.calories||0,p:x.protein||0,f:x.fat||0,c:x.carbs||0,burn:x.exercise_calories||0,steps:x.steps||0,weight:x.weight_kg}))}
}
async function analyzeWeek(){
 await refreshHistory();const d=dailyHistory.slice(-7);if(d.length<7){analysis.textContent=`You have ${d.length} logged day(s). Keep going until 7 days before making a meaningful calorie change.`;return}
 const avg=k=>d.reduce((a,x)=>a+(x[k]||0),0)/d.length, w=d.filter(x=>x.weight!=null).map(x=>x.weight);
 const delta=w.length>1?w[w.length-1]-w[0]:0;
 let action=Math.abs(delta)<.1?'Keep calories and improve activity consistency.':delta<-.8?'Progress may be fast; protect strength and recovery.':'Plan appears reasonable; keep monitoring the belly/waist trend.';
 analysis.innerHTML=`<b>Week review</b><br>Average calories: ${Math.round(avg('cal'))} kcal/day<br>Average protein: ${Math.round(avg('p'))} g/day<br>Exercise burn: ${Math.round(d.reduce((a,x)=>a+x.burn,0))} kcal/week<br>Average steps: ${Math.round(avg('steps')).toLocaleString()}<br>Weight change: ${delta>=0?'+':''}${delta.toFixed(1)} kg<br><br><b>Recommendation:</b> ${action}`;
}
function render(){
 const t=profile.targets;
 dayLabel.textContent='Day '+(Math.max(1,dailyHistory.length+1));
 calUsed.textContent=Math.round(day.cal);calTarget.textContent=t.cal;proteinUsed.textContent=`${Math.round(day.p)} / ${t.p} g`;fatUsed.textContent=`${Math.round(day.f)} / ${t.f} g`;carbUsed.textContent=`${Math.round(day.c)} / ${t.c} g`;calBar.style.width=Math.min(100,day.cal/t.cal*100)+'%';
 remainingCal.textContent=Math.max(0,Math.round(t.cal-day.cal)).toLocaleString()+' kcal';remainingP.textContent=Math.max(0,Math.round(t.p-day.p))+' g protein';remainingF.textContent=Math.max(0,Math.round(t.f-day.f))+' g fat';
 steps.textContent=day.steps.toLocaleString();stepRange.value=day.steps;walkMin.textContent=Math.round(day.steps/100)+' min';cycleMin.textContent=day.cycle+' min';burn.textContent=Math.round(day.burn)+' kcal';
 const score=Math.round(Math.min(35,day.p/t.p*35)+Math.min(35,day.cal<=t.cal?35:t.cal/day.cal*35)+Math.min(15,day.steps/7000*15)+(Object.keys(day.workout).length?15:0));document.getElementById('score').textContent=score;
 coachText.textContent=`Target ${t.cal} kcal · ${t.p} g protein. Split exercise across the day rather than forcing one long session.`;
 profileSummary.textContent=`${profile.age} · ${profile.height} cm · Lightly active · ${t.cal} kcal`;
 renderFoodList(foodSearch?.value||'');renderMeals();renderWorkout();
 nextActivity.innerHTML=`<strong>🌇 Evening cardio</strong><br>25–40 min cycle or brisk walk if you haven't met today's activity target.`;
 workoutQuick.textContent=Object.keys(day.workout).length?'Progress saved':'See today's targets';
 simpleChart(nutritionChart,dailyHistory.slice(-7).map(x=>x.cal),'Calories',t.cal);simpleChart(activityChart,dailyHistory.slice(-7).map(x=>x.burn),'Exercise calories');simpleChart(weightChart,dailyHistory.slice(-7).map(x=>x.weight).filter(x=>x!=null),'Weight');
 measurementLog.innerHTML=`<div class="line"><span>Starting</span><b>68 kg · 97 cm belly · 90 cm waist</b></div>`;
}
function renderMeals(){
 if(!meals.length){mealLog.innerHTML='<div class="card">No meals logged today.</div>';return}
 mealLog.innerHTML=meals.map(x=>`<div class="meal"><span>${x.name}${x.unit==='count'?' × '+x.qty:' — '+Math.round(x.qty)+' g'}<small>${Math.round(x.p)} g protein · ${Math.round(x.f)} g fat · ${Math.round(x.c)} g carbs</small></span><b>${Math.round(x.cal)} kcal</b></div>`).join('');
}
document.getElementById('foodSearch').addEventListener('input',e=>renderFoodList(e.target.value));
init();