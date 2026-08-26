const authMsg=document.getElementById("authMsg");
const age=document.getElementById("age");
const height=document.getElementById("height");
const startWeight=document.getElementById("startWeight");
const activity=document.getElementById("activity");
const deficit=document.getElementById("deficit");
const targetInfo=document.getElementById("targetInfo");
const foodSearch=document.getElementById("foodSearch");
const quickTitle=document.getElementById("quickTitle");
const mealWindow=document.getElementById("mealWindow");
const quickFoods=document.getElementById("quickFoods");
const webLookup=document.getElementById("webLookup");
const mealLog=document.getElementById("mealLog");
const planTitle=document.getElementById("planTitle");
const planText=document.getElementById("planText");
const workoutList=document.getElementById("workoutList");
const scheduleList=document.getElementById("scheduleList");
const cycleInput=document.getElementById("cycleInput");
const burnInput=document.getElementById("burnInput");
const workoutWindowTitle=document.getElementById("workoutWindowTitle");
const workoutWindowText=document.getElementById("workoutWindowText");
const nextActivity=document.getElementById("nextActivity");
const workoutQuick=document.getElementById("workoutQuick");
const dayLabel=document.getElementById("dayLabel");
const calUsed=document.getElementById("calUsed");
const calTarget=document.getElementById("calTarget");
const proteinUsed=document.getElementById("proteinUsed");
const fatUsed=document.getElementById("fatUsed");
const carbUsed=document.getElementById("carbUsed");
const calBar=document.getElementById("calBar");
const remainingCal=document.getElementById("remainingCal");
const remainingP=document.getElementById("remainingP");
const remainingF=document.getElementById("remainingF");
const steps=document.getElementById("steps");
const stepRange=document.getElementById("stepRange");
const walkMin=document.getElementById("walkMin");
const cycleMin=document.getElementById("cycleMin");
const burn=document.getElementById("burn");
const score=document.getElementById("score");
const coachText=document.getElementById("coachText");
const profileSummary=document.getElementById("profileSummary");
const nutritionChart=document.getElementById("nutritionChart");
const activityChart=document.getElementById("activityChart");
const weightChart=document.getElementById("weightChart");
const measurementLog=document.getElementById("measurementLog");
const analysis=document.getElementById("analysis");
const customName=document.getElementById("customName");
const customServing=document.getElementById("customServing");
const customCal=document.getElementById("customCal");
const customP=document.getElementById("customP");
const customF=document.getElementById("customF");
const customC=document.getElementById("customC");
const portionId=document.getElementById("portionId");
const portionTitle=document.getElementById("portionTitle");
const portionBase=document.getElementById("portionBase");
const portionWeight=document.getElementById("portionWeight");
const newWeight=document.getElementById("newWeight");
const measureWeight=document.getElementById("measureWeight");
const measureBelly=document.getElementById("measureBelly");
const measureWaist=document.getElementById("measureWaist");
const measureChest=document.getElementById("measureChest");
const measureBiceps=document.getElementById("measureBiceps");
const webFoodInfo=document.getElementById("webFoodInfo");
const webAmount=document.getElementById("webAmount");
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
let startDate=today();
let selectedDate=today();
let day={date:selectedDate,cal:0,p:0,f:0,c:0,steps:0,cycle:0,burn:0,workout:{}};
let meals=[];let dailyHistory=[];let savedFoods=[];let webPending=null;let user=null;

function today(){return new Date().toISOString().slice(0,10)}
function win(){const h=new Date().getHours();return h<11?'morning':h<15?'lunch':h<19?'evening':'dinner'}
function saveLocal(){localStorage.setItem('flc_cache',JSON.stringify({profile,day,meals,dailyHistory,savedFoods,startDate,selectedDate}))}
function loadLocal(){try{const x=JSON.parse(localStorage.getItem('flc_cache'));if(x){profile=x.profile||profile;day=x.day||day;meals=x.meals||[];dailyHistory=x.dailyHistory||[];savedFoods=x.savedFoods||[];startDate=x.startDate||day.date||today();selectedDate=x.selectedDate||day.date||today()}}catch{}}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
function go(id){document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.p===id));render()}
function openModal(id){document.getElementById(id).classList.add('show')}
function closeModals(){document.querySelectorAll('.modal').forEach(x=>x.classList.remove('show'))}


function dateDiff(a,b){return Math.round((new Date(a+'T00:00:00')-new Date(b+'T00:00:00'))/86400000)}
function dayNumber(date){return Math.max(1,dateDiff(date,startDate)+1)}
function formatDate(date){return new Date(date+'T00:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}
function openDayPicker(){selectedDateInput().value=selectedDate;openModal('dayModal')}
function selectedDateInput(){return document.getElementById('selectedDate')}
function changeDay(delta){
 const d=new Date(selectedDate+'T00:00:00');d.setDate(d.getDate()+delta);
 const next=d.toISOString().slice(0,10);if(next>today())return;loadSelectedDateValue(next);
}
async function loadSelectedDate(){await loadSelectedDateValue(selectedDateInput().value||today());closeModals()}
async function goToday(){await loadSelectedDateValue(today());closeModals()}
async function loadSelectedDateValue(date){
 if(!date||date>today())return;
 if(user)await loadCloudDay(date);
 else {selectedDate=date;day={date,cal:0,p:0,f:0,c:0,steps:0,cycle:0,burn:0,workout:{}};meals=[]}
 selectedDate=date;day.date=date;saveLocal();render();toast('Opened '+formatDate(date));
}
async function loadCloudDay(date){
 if(!user)return;
 const {data:dl}=await sb.from('daily_logs').select('*').eq('profile_id',activeProfile.id).eq('date',date).maybeSingle();
 day=dl?{date,cal:dl.calories||0,p:dl.protein||0,f:dl.fat||0,c:dl.carbs||0,steps:dl.steps||0,cycle:dl.cycling_minutes||0,burn:dl.exercise_calories||0,workout:{}}:{date,cal:0,p:0,f:0,c:0,steps:0,cycle:0,burn:0,workout:{}};
 const {data:ml}=await sb.from('meals').select('*').eq('profile_id',activeProfile.id).eq('date',date).order('created_at');
 meals=(ml||[]).map(x=>({id:x.id,name:x.food_name,qty:x.quantity,unit:x.unit,cal:x.calories||0,p:x.protein||0,f:x.fat||0,c:x.carbs||0,foodKey:x.food_key||''}));
}

let profilesList=[];
let activeProfile=null;
let selectedAvatar='👨🏻';

async function init(){
 loadLocal();
 const {data}=await sb.auth.getSession();
 user=data.session?.user||null;
 if(!user){
   const r=await sb.auth.signInAnonymously();
   if(r.error){toast('Cloud sync unavailable');}
   else user=r.data.user;
 }
 await loadNamedProfiles();
 if(!activeProfile){showProfileGate();} 
 else {await loadCloud();render();}
}
function showProfileGate(){
 const gate=document.getElementById('profileGate');
 if(gate){gate.classList.add('show');renderProfileCards('gateProfiles',true);}
}
function hideProfileGate(){const gate=document.getElementById('profileGate');if(gate)gate.classList.remove('show')}
function showCreateProfile(){
 closeModals();document.getElementById('createProfileModal').classList.add('show');
 const btn=document.querySelector('#createProfileModal .gradient-btn');if(btn){btn.innerHTML='Create Profile <span>→</span>';btn.onclick=createNamedProfile;}
 resetCreateProfileForm();
}
function pickAvatar(a){selectedAvatar=a;const p=document.getElementById('newAvatarPreview');if(p)p.textContent=a;document.querySelectorAll('.avatarChoices button').forEach(b=>b.classList.toggle('selected',b.textContent===a))}
async function loadNamedProfiles(){
 if(!user)return;
 const {data,error}=await sb.from('app_profiles').select('*').eq('owner_id',user.id).order('created_at');
 if(error){console.warn(error);profilesList=[];return}
 profilesList=data||[];
 const savedId=localStorage.getItem('flc_active_profile');
 activeProfile=profilesList.find(p=>p.id===savedId)||null;
}
function renderProfileCards(containerId,gate=false){
 const box=document.getElementById(containerId);if(!box)return;
 box.innerHTML=profilesList.map(p=>`<div class="profile-card-wrap"><button class="profile-card ${activeProfile?.id===p.id?'active':''}" onclick="switchProfile('${p.id}')"><span class="avatar">${p.avatar||'👤'}</span><span class="pcopy"><strong>${escapeHtml(p.name)}</strong><small>${p.starting_weight_kg||'—'} kg · ${activeProfile?.id===p.id?'Active profile':'Tap to switch'}</small></span><span class="chev">›</span></button><button class="profile-edit-btn" onclick="event.stopPropagation();editProfile('${p.id}')">✎</button></div>`).join('');
}
function profileNumber(id){
 const v=document.getElementById(id)?.value.trim();
 return v===''?null:+v;
}
function resetCreateProfileForm(){
 document.getElementById('profileName').value='';
 ['newAge','newHeight','newWeightProfile','newWaist','newBelly','newChest','newBiceps'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
 selectedAvatar='👨🏻';pickAvatar(selectedAvatar);
}
async function createNamedProfile(){
 const name=document.getElementById('profileName').value.trim();
 const age=profileNumber('newAge'), height=profileNumber('newHeight'), weight=profileNumber('newWeightProfile');
 if(!name){toast('Enter your name');return}
 if(age===null||height===null||weight===null){toast('Enter age, height and starting weight');return}
 if(!user){toast('Cloud connection unavailable');return}
 const id=crypto.randomUUID();
 const waist=profileNumber('newWaist'), belly=profileNumber('newBelly'), chest=profileNumber('newChest'), biceps=profileNumber('newBiceps');
 const row={id,owner_id:user.id,name,avatar:selectedAvatar,age,height_cm:height,starting_weight_kg:weight,start_date:today(),calorie_target:1700,protein_target:120,fat_target:55,carb_target:185,starting_waist_cm:waist,starting_belly_cm:belly,starting_chest_cm:chest,starting_biceps_cm:biceps};
 const {data,error}=await sb.from('app_profiles').insert(row).select().single();
 if(error){toast(error.message);return}
 profilesList.push(data);activeProfile=data;localStorage.setItem('flc_active_profile',data.id);
 profile={...profile,age,height,weight,targets:{cal:1700,p:120,f:55,c:185}};
 startDate=today();selectedDate=today();day={date:selectedDate,cal:0,p:0,f:0,c:0,steps:0,cycle:0,burn:0,workout:{}};meals=[];dailyHistory=[];
 // Save optional starting measurements as the first measurement record.
 if(waist!==null||belly!==null||chest!==null||biceps!==null){
   await sb.from('body_measurements').insert({user_id:user.id,profile_id:id,measure_date:today(),weight_kg:weight,waist_cm:waist,belly_cm:belly,chest_cm:chest,biceps_cm:biceps});
 }
 saveLocal();document.getElementById('createProfileModal').classList.remove('show');hideProfileGate();
 await loadCloud();render();toast('Welcome, '+name+' 🎉');
}
async function switchProfile(id){
 const p=profilesList.find(x=>x.id===id);if(!p)return;
 activeProfile=p;localStorage.setItem('flc_active_profile',p.id);
 profile={...profile,age:p.age||29,height:p.height_cm||159,weight:p.starting_weight_kg||68,activity:1.35,deficit:400,targets:{cal:p.calorie_target||1700,p:p.protein_target||120,f:p.fat_target||55,c:p.carb_target||185}};

 startDate=p.start_date||today();selectedDate=today();day={date:selectedDate,cal:0,p:0,f:0,c:0,steps:0,cycle:0,burn:0,workout:{}};meals=[];dailyHistory=[];
 closeModals();hideProfileGate();await loadCloud();render();toast('Switched to '+p.name);
}
function openProfileManager(){closeModals();renderProfileCards('managerProfiles');openModal('profileManagerModal')}

function editProfile(id){
 const p=profilesList.find(x=>x.id===id);if(!p)return;
 document.getElementById('profileName').value=p.name||'';
 document.getElementById('newAge').value=p.age??'';
 document.getElementById('newHeight').value=p.height_cm??'';
 document.getElementById('newWeightProfile').value=p.starting_weight_kg??'';
 document.getElementById('newWaist').value=p.starting_waist_cm??'';
 document.getElementById('newBelly').value=p.starting_belly_cm??'';
 document.getElementById('newChest').value=p.starting_chest_cm??'';
 document.getElementById('newBiceps').value=p.starting_biceps_cm??'';
 pickAvatar(p.avatar||'👨🏻');
 document.getElementById('createProfileModal').classList.add('show');
 const btn=document.querySelector('#createProfileModal .gradient-btn');
 if(btn){btn.innerHTML='Save Profile <span>✓</span>';btn.onclick=()=>saveEditedProfile(id);}
}
async function saveEditedProfile(id){
 const p=profilesList.find(x=>x.id===id);if(!p)return;
 const name=document.getElementById('profileName').value.trim();
 const age=profileNumber('newAge'),height=profileNumber('newHeight'),weight=profileNumber('newWeightProfile');
 if(!name){toast('Enter your name');return}
 if(age===null||height===null||weight===null){toast('Enter age, height and starting weight');return}
 const row={name,avatar:selectedAvatar,age,height_cm:height,starting_weight_kg:weight,starting_waist_cm:profileNumber('newWaist'),starting_belly_cm:profileNumber('newBelly'),starting_chest_cm:profileNumber('newChest'),starting_biceps_cm:profileNumber('newBiceps')};
 const {data,error}=await sb.from('app_profiles').update(row).eq('id',id).select().single();
 if(error){toast(error.message);return}
 profilesList=profilesList.map(x=>x.id===id?data:x);
 if(activeProfile?.id===id){activeProfile=data;profile.age=data.age;profile.height=data.height_cm;profile.weight=data.starting_weight_kg}
 document.getElementById('createProfileModal').classList.remove('show');
 const btn=document.querySelector('#createProfileModal .gradient-btn');if(btn){btn.innerHTML='Create Profile <span>→</span>';btn.onclick=createNamedProfile}
 renderProfileCards('managerProfiles');render();toast('Profile updated');
}
async function deleteCurrentProfile(){
 if(!activeProfile)return;
 if(profilesList.length<=1){toast('Keep at least one profile');return}
 if(!confirm('Delete '+activeProfile.name+' and all its history?'))return;
 const id=activeProfile.id;
 // Child rows are deleted by SQL cascade where configured; otherwise delete explicitly.
 await sb.from('daily_logs').delete().eq('profile_id',id);
 await sb.from('meals').delete().eq('profile_id',id);
 await sb.from('foods').delete().eq('profile_id',id);
 await sb.from('body_measurements').delete().eq('profile_id',id);
 await sb.from('app_profiles').delete().eq('id',id);
 profilesList=profilesList.filter(p=>p.id!==id);activeProfile=profilesList[0]||null;
 if(activeProfile){localStorage.setItem('flc_active_profile',activeProfile.id);await loadCloud();renderProfileCards('managerProfiles');render();toast('Profile deleted')}
 else{localStorage.removeItem('flc_active_profile');showProfileGate()}
}
async function loadCloud(){
 if(!user||!activeProfile)return;
 const p=activeProfile;
 startDate=p.start_date||startDate;
 profile={...profile,age:p.age||29,height:p.height_cm||159,weight:p.starting_weight_kg||68,activity:1.35,targets:{cal:p.calorie_target||1700,p:p.protein_target||120,f:p.fat_target||55,c:p.carb_target||185}};

 const {data:logs}=await sb.from('daily_logs').select('*').eq('profile_id',activeProfile.id).order('date');
 dailyHistory=(logs||[]).map(x=>({date:x.date,cal:x.calories||0,p:x.protein||0,f:x.fat||0,c:x.carbs||0,burn:x.exercise_calories||0,steps:x.steps||0,weight:x.weight_kg}));
 await loadCloudDay(selectedDate);
 const {data:foods}=await sb.from('foods').select('*').eq('profile_id',activeProfile.id).order('name');
 savedFoods=foods||[];
}
async function upsertDaily(){
 if(!user){saveLocal();return}
 await sb.from('daily_logs').upsert({user_id:user.id,profile_id:activeProfile.id,date:day.date,calories:day.cal,protein:day.p,fat:day.f,carbs:day.c,exercise_calories:day.burn,steps:day.steps,walking_minutes:Math.round(day.steps/100),cycling_minutes:day.cycle,workout_completed:Object.keys(day.workout).length>0},{onConflict:'profile_id,date'});
}
async function saveMealCloud(m){
 if(user) await sb.from('meals').insert({user_id:user.id,profile_id:activeProfile.id,date:day.date,food_key:m.foodKey||'',food_name:m.name,quantity:m.qty,unit:m.unit,calories:m.calories,protein:m.p,fat:m.f,carbs:m.c});
}
function calcTarget(){
 const bmr=10*profile.weight+6.25*profile.height-5*profile.age+5;
 const cal=Math.max(1400,Math.round(bmr*profile.activity-profile.deficit));
 const p=120,f=55,c=Math.round((cal-p*4-f*9)/4);
 profile.targets={cal,p,f,c};
}
async function saveProfile(silent=false){
 profile.age=+age.value||29;profile.height=+height.value||159;profile.weight=+startWeight.value||68;profile.activity=+activity.value||1.35;profile.deficit=+deficit.value||400;calcTarget();
 if(user && activeProfile) { const {data:p,error}=await sb.from('app_profiles').update({age:profile.age,height_cm:profile.height,starting_weight_kg:profile.weight,start_date:startDate,calorie_target:profile.targets.cal,protein_target:profile.targets.p,fat_target:profile.targets.f,carb_target:profile.targets.c}).eq('id',activeProfile.id).select().single(); if(!error&&p) activeProfile=p; }
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
 if(user) sb.from('foods').insert({user_id:user.id,profile_id:activeProfile.id,...f});
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
 if(user) await sb.from('foods').insert({user_id:user.id,profile_id:activeProfile.id,name:f.name,calories_100g:f.calories_100g,protein_100g:f.protein_100g,fat_100g:f.fat_100g,carbs_100g:f.carbs_100g,source:f.source||'Open Food Facts'});
 const g=Math.max(1,+webAmount.value||100);closeModals();addFood(f,g,'g');webPending=null
}
async function removeMeal(index){
 const m=meals[index];if(!m)return;
 if(user && m.id) await sb.from('meals').delete().eq('id',m.id).eq('profile_id',activeProfile.id);
 meals.splice(index,1);
 day.cal=meals.reduce((a,x)=>a+x.cal,0);day.p=meals.reduce((a,x)=>a+x.p,0);day.f=meals.reduce((a,x)=>a+x.f,0);day.c=meals.reduce((a,x)=>a+x.c,0);
 saveLocal();await upsertDaily();render();toast(m.name+' removed');
}
function clearMeals(){meals=[];day.cal=day.p=day.f=day.c=0;saveLocal();upsertDaily();render()}
function generateMealPlan(){
 const r=Math.max(0,profile.targets.cal-day.cal),p=Math.max(0,profile.targets.p-day.p);
 let text=p>40?`Protein is the priority. Try chicken/fish with rice or chapathi, keeping the portion within about ${Math.round(r)} kcal.`:`A balanced next meal fits the remaining ${Math.round(r)} kcal. Choose a normal rice/chapathi portion plus vegetables and a protein source.`;
 planTitle.textContent=p>40?'Protein-focused next meal':'Balanced next meal';planText.textContent=text
}
const ALL_EXERCISES=[
 ['cycle','Cycling','minutes','medium','cardio'],['pull','Pull-ups','reps','bodyweight','strength'],
 ['push','Push-ups','reps','bodyweight','strength'],['roller','Ab roller','reps','bodyweight','core'],
 ['plank','Plank','sec','bodyweight','core'],['leg','Leg raises','reps','bodyweight','core'],
 ['hang','Hanging knee raises','reps','bodyweight','core'],['side','Side plank','sec','bodyweight','core'],
 ['squat','Bodyweight squats','reps','bodyweight','legs']
];
function exerciseTarget(id){return ({cycle:30,pull:6,push:30,roller:6,plank:60,leg:15,hang:8,side:30,squat:30})[id]||0}
function recommendedExercises(){
 const h=new Date().getHours();
 if(h<11)return new Set(['pull','push','roller','plank','leg','hang']);
 if(h<15)return new Set([]);
 if(h<19)return new Set(['cycle','pull','push','roller','plank','leg']);
 return new Set(['cycle','plank','side','leg']);
}
function changeExercise(id,d){
 day.workout[id]=Math.max(0,(day.workout[id]||0)+d);
 if(id==='cycle')day.cycle=day.workout[id];
 saveLocal();upsertDaily();render()
}
function renderWorkout(){
 const rec=recommendedExercises();
 const list=ALL_EXERCISES.map(x=>({id:x[0],name:x[1],unit:x[2],type:x[3],category:x[4],target:exerciseTarget(x[0]),recommended:rec.has(x[0])}));
 list.sort((a,b)=>Number(b.recommended)-Number(a.recommended)||a.category.localeCompare(b.category)||a.name.localeCompare(b.name));
 workoutList.innerHTML=list.map(x=>{
  const actual=day.workout[x.id]||0;
  const unit=x.id==='cycle'?'min':x.unit;
  return `<div class="workout-row ${x.recommended?'recommended':''}"><span class="exerciseName"><strong>${x.recommended?'★ ':''}${x.name}</strong><small>${x.recommended?'Recommended today · ':''}Target ${x.target} ${unit}${x.id==='cycle'?' · Medium intensity':''}</small></span><strong class="target">${x.target}</strong><div class="stepper"><button onclick="changeExercise('${x.id}',-1)">−</button><b>${actual}</b><button onclick="changeExercise('${x.id}',1)">+</button></div></div>`;
 }).join('');
 scheduleList.innerHTML=schedule().map(x=>`<div class="slot"><strong>${x.icon} ${x.time}</strong><small>${x.text}</small></div>`).join('');
 workoutWindowTitle.textContent='Smart daily schedule';
 workoutWindowText.textContent='Recommended exercises are highlighted and sorted to the top. Cycling is logged in minutes at medium intensity.';
}

async function refreshHistory(){
 if(user){const {data}=await sb.from('daily_logs').select('*').eq('profile_id',activeProfile.id).order('date');dailyHistory=(data||[]).map(x=>({date:x.date,cal:x.calories||0,p:x.protein||0,f:x.fat||0,c:x.carbs||0,burn:x.exercise_calories||0,steps:x.steps||0,weight:x.weight_kg}))}
}
async function analyzeWeek(){
 await refreshHistory();const d=dailyHistory.slice(-7);if(d.length<7){analysis.textContent=`You have ${d.length} logged day(s). Keep going until 7 days before making a meaningful calorie change.`;return}
 const avg=k=>d.reduce((a,x)=>a+(x[k]||0),0)/d.length, w=d.filter(x=>x.weight!=null).map(x=>x.weight);
 const delta=w.length>1?w[w.length-1]-w[0]:0;
 let action=Math.abs(delta)<.1?'Keep calories and improve activity consistency.':delta<-.8?'Progress may be fast; protect strength and recovery.':'Plan appears reasonable; keep monitoring the belly/waist trend.';
 analysis.innerHTML=`<b>Week review</b><br>Average calories: ${Math.round(avg('cal'))} kcal/day<br>Average protein: ${Math.round(avg('p'))} g/day<br>Exercise burn: ${Math.round(d.reduce((a,x)=>a+x.burn,0))} kcal/week<br>Average steps: ${Math.round(avg('steps')).toLocaleString()}<br>Weight change: ${delta>=0?'+':''}${delta.toFixed(1)} kg<br><br><b>Recommendation:</b> ${action}`;
}
function updateProfileUI(){const s=document.getElementById('profileSummary');if(s)s.textContent=activeProfile?activeProfile.name+' · '+(profile.weight||'—')+' kg':'Choose a profile';const t=document.getElementById('profileTargetSummary');if(t)t.textContent=activeProfile?(profile.targets.cal+' kcal · '+profile.targets.p+' g protein'):'Set your targets';}
function render(){updateProfileUI();
 const t=profile.targets;
 dayLabel.textContent='Day '+dayNumber(selectedDate);
 dateLabel.textContent=selectedDate===today()?'Today':formatDate(selectedDate);
 calUsed.textContent=Math.round(day.cal);calTarget.textContent=t.cal;proteinUsed.textContent=`${Math.round(day.p)} / ${t.p} g`;fatUsed.textContent=`${Math.round(day.f)} / ${t.f} g`;carbUsed.textContent=`${Math.round(day.c)} / ${t.c} g`;calBar.style.width=Math.min(100,day.cal/t.cal*100)+'%';
 remainingCal.textContent=Math.max(0,Math.round(t.cal-day.cal)).toLocaleString()+' kcal';remainingP.textContent=Math.max(0,Math.round(t.p-day.p))+' g protein';remainingF.textContent=Math.max(0,Math.round(t.f-day.f))+' g fat';
 steps.textContent=day.steps.toLocaleString();stepRange.value=day.steps;walkMin.textContent=Math.round(day.steps/100)+' min';cycleMin.textContent=day.cycle+' min';burn.textContent=Math.round(day.burn)+' kcal';
 const score=Math.round(Math.min(35,day.p/t.p*35)+Math.min(35,day.cal<=t.cal?35:t.cal/day.cal*35)+Math.min(15,day.steps/7000*15)+(Object.keys(day.workout).length?15:0));document.getElementById('score').textContent=score;
 coachText.textContent=`Target ${t.cal} kcal · ${t.p} g protein. Split exercise across the day rather than forcing one long session.`;
 profileSummary.textContent=`${profile.age} · ${profile.height} cm · Lightly active · ${t.cal} kcal`;
 renderFoodList(foodSearch?.value||'');renderMeals();renderWorkout();
 nextActivity.innerHTML=`<strong>🌇 Evening cardio</strong><br>25–40 min cycle or brisk walk if you haven't met today's activity target.`;
 workoutQuick.textContent=Object.keys(day.workout).length?'Progress saved':"See today's targets";
 simpleChart(nutritionChart,dailyHistory.slice(-7).map(x=>x.cal),'Calories',t.cal);simpleChart(activityChart,dailyHistory.slice(-7).map(x=>x.burn),'Exercise calories');simpleChart(weightChart,dailyHistory.slice(-7).map(x=>x.weight).filter(x=>x!=null),'Weight');
 measurementLog.innerHTML=`<div class="line"><span>Starting</span><b>68 kg · 97 cm belly · 90 cm waist</b></div>`;
}
function renderMeals(){
 if(!meals.length){mealLog.innerHTML='<div class="card">No meals logged today.</div>';return}
 mealLog.innerHTML=meals.map((x,i)=>`<div class="meal"><span>${x.name}${x.unit==='count'?' × '+x.qty:' — '+Math.round(x.qty)+' g'}<small>${Math.round(x.p)} g protein · ${Math.round(x.f)} g fat · ${Math.round(x.c)} g carbs</small></span><b>${Math.round(x.cal)} kcal</b><button class="removeMeal" title="Remove this item" onclick="removeMeal(${i})">×</button></div>`).join('');
}
document.getElementById('foodSearch').addEventListener('input',e=>renderFoodList(e.target.value));
init();