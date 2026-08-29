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
const dateLabel=document.getElementById("dateLabel");
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

async function sha256(text){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function today(){return new Date().toISOString().slice(0,10)}
function win(){const h=new Date().getHours();return h<11?'morning':h<15?'lunch':h<19?'evening':'dinner'}
function saveLocal(){
 localStorage.setItem('flc_cache',JSON.stringify({profile,day,meals,dailyHistory,savedFoods,startDate,selectedDate}));
 if(profilesList?.length) localStorage.setItem('flc_profiles_cache',JSON.stringify(profilesList));
}
function loadLocal(){
 try{
   const x=JSON.parse(localStorage.getItem('flc_cache'));
   if(x){profile=x.profile||profile;day=x.day||day;meals=x.meals||[];dailyHistory=x.dailyHistory||[];savedFoods=x.savedFoods||[];startDate=x.startDate||day.date||today();selectedDate=x.selectedDate||day.date||today()}
 }catch{}
 try{
   const cached=JSON.parse(localStorage.getItem('flc_profiles_cache'));
   if(Array.isArray(cached)) profilesList=cached;
 }catch{}
}
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
 if(!user||!activeProfile)return;
 const {data:dl,error:de}=await sb.from('daily_logs').select('*').eq('profile_id',activeProfile.id).eq('log_date',date).maybeSingle();
 if(de) console.warn('daily log load failed',de);
 const workout=dl?.workout_data||{};
 day=dl?{id:dl.id,date,cal:dl.calories||0,p:dl.protein||0,f:dl.fat||0,c:dl.carbs||0,steps:dl.steps||0,cycle:dl.cycling_minutes||0,burn:dl.exercise_calories||0,workout,weight:dl.weight_kg||0}:{date,cal:0,p:0,f:0,c:0,steps:0,cycle:0,burn:0,workout:{},weight:0};
 if(dl){
   const {data:ml,error:me}=await sb.from('meals').select('*').eq('profile_id',activeProfile.id).eq('daily_log_id',dl.id).order('created_at');
   if(me){console.error('FITTRACK MEAL LOAD FAILED',me);toast('⚠️ Meals could not be loaded: '+me.message);}
   const grouped={};
   (ml||[]).forEach(x=>{
     const foodKey=x.food_key||x.food_name, key=foodKey+'|'+x.unit;
     if(!grouped[key]) grouped[key]={id:x.id,name:x.food_name,qty:+x.quantity||0,unit:x.unit,cal:+x.calories||0,p:+x.protein||0,f:+x.fat||0,c:+x.carbs||0,foodKey};
     else {
       const g=grouped[key];g.qty+=(+x.quantity||0);g.cal+=(+x.calories||0);g.p+=(+x.protein||0);g.f+=(+x.fat||0);g.c+=(+x.carbs||0);g.id=null;
     }
   });
   meals=Object.values(grouped);
 } else meals=[];
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
 const savedId=localStorage.getItem('flc_active_profile');
 let cloudProfiles=[];
 try{
   const {data,error}=await sb.rpc('list_login_profiles');
   if(error) throw error;
   cloudProfiles=data||[];
 }catch(error){
   console.warn('Profile list load failed; using device cache',error);
   try{const cached=JSON.parse(localStorage.getItem('flc_profiles_cache'));if(Array.isArray(cached)) cloudProfiles=cached;}catch{}
 }
 profilesList=cloudProfiles;
 if(profilesList.length) localStorage.setItem('flc_profiles_cache',JSON.stringify(profilesList));
 activeProfile=profilesList.find(p=>p.id===savedId)||null;
}
function openProfileLogin(p){
 const profile=profilesList.find(x=>x.id===p.id)||p;
 if(!profile)return;
 window.loginTargetProfile=profile;
 document.getElementById('loginProfileName').textContent=profile.name||'Profile';
 document.getElementById('loginAvatar').textContent=profile.avatar||'👤';
 document.getElementById('loginPassword').value='';
 closeModals();openModal('profileLoginModal');
 setTimeout(()=>document.getElementById('loginPassword')?.focus(),50);
}
async function loginSelectedProfile(){
 const p=window.loginTargetProfile;
 const pw=document.getElementById('loginPassword').value;
 if(!p)return;
 if(pw.length<4){toast('Password must be at least 4 characters');return}
 if(!user){const r=await sb.auth.signInAnonymously();if(r.error){toast('Cloud connection unavailable');return}user=r.data.user}
 const {data,error}=await sb.rpc('login_profile',{p_profile_id:p.id,p_password:pw});
 if(error){toast(error.message||'Incorrect password');return}
 activeProfile=data;
 profilesList=profilesList.map(x=>x.id===data.id?data:x);
 localStorage.setItem('flc_active_profile',data.id);
 localStorage.setItem('flc_profiles_cache',JSON.stringify(profilesList));
 closeModals();hideProfileGate();
 profile={...profile,age:data.age||29,height:data.height_cm||159,weight:data.starting_weight_kg||68,activity:1.35,deficit:400,targets:{cal:data.calorie_target||1700,p:data.protein_target||120,f:data.fat_target||55,c:data.carb_target||185}};
 startDate=data.start_date||today();selectedDate=today();day={date:selectedDate,cal:0,p:0,f:0,c:0,steps:0,cycle:0,burn:0,workout:{}};meals=[];dailyHistory=[];
 await loadCloud();saveLocal();render();toast('Welcome back, '+data.name+' 👋');
}
function renderProfileCards(containerId,gate=false){
 const box=document.getElementById(containerId);if(!box)return;
 if(!profilesList.length){box.innerHTML='<div class="profile-empty">No profiles available. Check your connection.</div>';return;}
 const cards=profilesList.map(p=>`<button class="profile-bubble" onclick="openProfileLogin(${JSON.stringify({id:p.id,name:p.name,avatar:p.avatar||'👤'})})"><span class="bubble-avatar">${p.avatar||'👤'}</span><strong>${escapeHtml(p.name||'Profile')}</strong></button>`).join('');
 const add=`<button class="profile-bubble add-profile-bubble" onclick="showCreateProfile()"><span class="bubble-avatar">＋</span><strong>Add New</strong></button>`;
 box.innerHTML=cards+add;
}
function profileNumber(id){
 const v=document.getElementById(id)?.value.trim();
 return v===''?null:+v;
}
function resetCreateProfileForm(){
 document.getElementById('profileName').value='';
 document.getElementById('profilePassword').value='';
 ['newAge','newHeight','newWeightProfile','newWaist','newBelly','newChest','newBiceps'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
 selectedAvatar='👨🏻';pickAvatar(selectedAvatar);
}
async function createNamedProfile(){
 const name=document.getElementById('profileName').value.trim();
 const password=document.getElementById('profilePassword').value;
 const age=profileNumber('newAge'), height=profileNumber('newHeight'), weight=profileNumber('newWeightProfile');
 if(!name){toast('Enter your name');return}
 if(password.length<4){toast('Password must be at least 4 characters');return}
 if(age===null||height===null||weight===null){toast('Enter age, height and starting weight');return}
 if(!user){toast('Cloud connection unavailable');return}
 const id=crypto.randomUUID();
 const waist=profileNumber('newWaist'), belly=profileNumber('newBelly'), chest=profileNumber('newChest'), biceps=profileNumber('newBiceps');
 const salt=crypto.randomUUID().replaceAll('-',''); const password_hash=await sha256(password.toLowerCase()+salt); const row={id,owner_id:user.id,name,avatar:selectedAvatar,password_salt:salt,password_hash,age,height_cm:height,starting_weight_kg:weight,start_date:today(),calorie_target:1700,protein_target:120,fat_target:55,carb_target:185,starting_waist_cm:waist,starting_belly_cm:belly,starting_chest_cm:chest,starting_biceps_cm:biceps};
 const {data,error}=await sb.from('app_profiles').insert(row).select().single();
 if(error){toast(error.message);return}
 profilesList.push(data);activeProfile=data;localStorage.setItem('flc_active_profile',data.id);
 localStorage.setItem('flc_profiles_cache',JSON.stringify(profilesList));
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
 localStorage.setItem('flc_profiles_cache',JSON.stringify(profilesList));
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
 localStorage.setItem('flc_profiles_cache',JSON.stringify(profilesList));
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
 localStorage.setItem('flc_profiles_cache',JSON.stringify(profilesList));
 if(activeProfile){localStorage.setItem('flc_active_profile',activeProfile.id);await loadCloud();renderProfileCards('managerProfiles');render();toast('Profile deleted')}
 else{localStorage.removeItem('flc_active_profile');localStorage.removeItem('flc_profiles_cache');showProfileGate()}
}
async function loadCloud(){
 if(!user||!activeProfile)return;
 const p=activeProfile;
 startDate=p.start_date||startDate;
 profile={...profile,age:p.age||29,height:p.height_cm||159,weight:p.starting_weight_kg||68,activity:1.35,targets:{cal:p.calorie_target||1700,p:p.protein_target||120,f:p.fat_target||55,c:p.carb_target||185}};
 const {data:logs,error:le}=await sb.from('daily_logs').select('*').eq('profile_id',activeProfile.id).order('log_date');
 if(le) console.warn('history load failed',le);
 dailyHistory=(logs||[]).map(x=>({date:x.log_date,cal:x.calories||0,p:x.protein||0,f:x.fat||0,c:x.carbs||0,burn:x.exercise_calories||0,steps:x.steps||0,weight:x.weight_kg}));
 await loadCloudDay(selectedDate);
 const {data:foods,error:fe}=await sb.from('foods').select('*').eq('profile_id',activeProfile.id).order('name');
 if(fe) console.warn('saved foods load failed',fe);
 savedFoods=(foods||[]).map(x=>({id:x.id,food_key:'saved_'+x.id,name:x.name,serving_size:x.serving_size||'100 g',calories_100g:+x.calories||0,protein_100g:+x.protein||0,fat_100g:+x.fat||0,carbs_100g:+x.carbs||0,unit:'100g'}));
}
async function upsertDaily(){
 if(!user||!activeProfile){saveLocal();return null}
 const payload={
   user_id:user.id,profile_id:activeProfile.id,log_date:day.date,
   day_number:dayNumber(day.date),calories:Math.round(day.cal),protein:day.p,fat:day.f,carbs:day.c,
   exercise_calories:Math.round(day.burn||0),steps:Math.round(day.steps||0),
   walking_minutes:Math.round((day.steps||0)/100),cycling_minutes:Math.round(day.cycle||0),
   workout_completed:Object.values(day.workout||{}).some(v=>v>0),
   weight_kg:day.weight||null,workout_data:day.workout||{}
 };
 const {data,error}=await sb.from('daily_logs').upsert(payload,{onConflict:'profile_id,log_date'}).select().single();
 if(error){console.error('daily save failed',error);toast('Cloud save failed — check connection');return null}
 day.id=data.id;return data.id;
}
async function saveMealCloud(m){
 if(!user||!activeProfile){toast('⚠️ Cloud session unavailable');return false}
 const logId=await upsertDaily();
 if(!logId){toast('⚠️ Daily log could not be saved');return false}

 const row={
   user_id:user.id,
   profile_id:activeProfile.id,
   daily_log_id:logId,
   meal_type:mealTypeForNow(),
   food_key:String(m.foodKey||m.name),
   food_name:String(m.name),
   quantity:Number(m.qty)||1,
   unit:String(m.unit||'count'),
   calories:Number(m.cal)||0,
   protein:Number(m.p)||0,
   fat:Number(m.f)||0,
   carbs:Number(m.c)||0
 };

 console.log('FITTRACK meal save',row);
 // The verified database path is a normal authenticated INSERT. Try it first.
 // If a deployment has the save_meal RPC installed, use it as a fallback.
 let data=null, error=null;
 const direct=await sb.from('meals').insert(row).select('*').single();
 data=direct.data; error=direct.error;
 if(error){
   console.warn('FITTRACK direct meal insert failed; trying RPC',error);
   const rpc=await sb.rpc('save_meal', {
     p_profile_id: row.profile_id,
     p_daily_log_id: row.daily_log_id,
     p_meal_type: row.meal_type,
     p_food_key: row.food_key,
     p_food_name: row.food_name,
     p_quantity: row.quantity,
     p_unit: row.unit,
     p_calories: row.calories,
     p_protein: row.protein,
     p_fat: row.fat,
     p_carbs: row.carbs
   });
   data=rpc.data; error=rpc.error;
 }
 if(error){
   console.error('FITTRACK MEAL SAVE FAILED',error);
   toast('⚠️ Meal save failed: '+(error.message||'unknown error'));
   return false;
 }
 if(m.id==null)m.id=data?.id;
 console.log('FITTRACK meal saved',data);
 // Recalculate and persist the daily summary only after the meal itself saved.
 await upsertDaily();
 toast('☁️ '+m.name+' saved');
 return true;
}
async function testMealCloud(){
 const test={foodKey:'__fittrack_test__',name:'FitTrack test',qty:1,unit:'count',cal:0,p:0,f:0,c:0};
 const ok=await saveMealCloud(test);
 if(ok && user&&activeProfile){
   await sb.from('meals').delete().eq('profile_id',activeProfile.id).eq('food_key','__fittrack_test__');
   toast('☁️ Meal database test passed');
 }
 return ok;
}
function mealTypeForNow(){
 const h=new Date().getHours();
 return h<11?'breakfast':h<15?'lunch':h<19?'snack':'dinner';
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
async function addFood(food,qty=1,unit='count'){
 const isWeight=food[6]==='weight'||food.unit==='100g';
 const m={foodKey:food[0]||food.food_key,name:food[1]||food.name,qty:+qty||1,unit:isWeight?'g':unit,
   cal:0,p:0,f:0,c:0};
 if(isWeight){
   m.cal=(food[2]??food.calories_100g??0)*m.qty/100;
   m.p=(food[3]??food.protein_100g??0)*m.qty/100;
   m.f=(food[4]??food.fat_100g??0)*m.qty/100;
   m.c=(food[5]??food.carbs_100g??0)*m.qty/100;
 }else{
   m.cal=(food[2]??food.calories_100g??0)*m.qty;
   m.p=(food[3]??food.protein_100g??0)*m.qty;
   m.f=(food[4]??food.fat_100g??0)*m.qty;
   m.c=(food[5]??food.carbs_100g??0)*m.qty;
 }
 const existing=meals.find(x=>x.foodKey===m.foodKey&&x.unit===m.unit);
 if(existing){
   existing.qty+=m.qty;existing.cal+=m.cal;existing.p+=m.p;existing.f+=m.f;existing.c+=m.c;
   day.cal=meals.reduce((a,x)=>a+x.cal,0);day.p=meals.reduce((a,x)=>a+x.p,0);day.f=meals.reduce((a,x)=>a+x.f,0);day.c=meals.reduce((a,x)=>a+x.c,0);
   saveLocal();render();
   if(user&&activeProfile&&existing.id){
     const {data,error}=await sb.from('meals').update({
       quantity:existing.qty,calories:existing.cal,protein:existing.p,fat:existing.f,carbs:existing.c
     }).eq('id',existing.id).eq('profile_id',activeProfile.id).select('*').single();
     if(error){
       console.error('FITTRACK MEAL UPDATE FAILED',error);
       toast('⚠️ Meal update failed: '+error.message);
     }else{
       console.log('FITTRACK meal updated',data);
       toast('☁️ '+existing.name+' updated');
     }
     await upsertDaily();
   }else{
     // If the previous insert failed, retry the aggregated item as a fresh row.
     existing.id=null;
     await saveMealCloud(existing);
   }
 }else{
   meals.push(m);day.cal=meals.reduce((a,x)=>a+x.cal,0);day.p=meals.reduce((a,x)=>a+x.p,0);day.f=meals.reduce((a,x)=>a+x.f,0);day.c=meals.reduce((a,x)=>a+x.c,0);
   saveLocal();render();
   await saveMealCloud(m);
 }
 toast(m.name+' added');
}
function openPortion(key){
 const f=foodByKey(key);if(!f)return;
 if(f[6]==='weight'||f.unit==='100g'){portionId.value=key;portionTitle.textContent=f[1]||f.name;portionBase.textContent='Enter the amount in grams.';portionWeight.value=100;openModal('portionModal')}
 else addFood(f,1,'count');
}
async function addByWeight(){const f=foodByKey(portionId.value);const g=Math.max(1,+portionWeight.value||0);closeModals();await addFood(f,g,'g')}
async function addCustomFood(){
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
 if(!webPending)return;
 const f={food_key:'web_'+Date.now(),name:webPending.name,calories_100g:webPending.cal,protein_100g:webPending.p,fat_100g:webPending.f,carbs_100g:webPending.c,unit:'100g'};
 if(user&&activeProfile){
   const {data,error}=await sb.from('foods').insert({user_id:user.id,profile_id:activeProfile.id,name:f.name,serving_size:'100 g',calories:f.calories_100g,protein:f.protein_100g,fat:f.fat_100g,carbs:f.carbs_100g}).select().single();
   if(error)console.error('web food save failed',error); else if(data)f.id=data.id;
 }
 savedFoods.push(f);
 const g=Math.max(1,+webAmount.value||100);closeModals();await addFood(f,g,'g');webPending=null;
}
async function removeMeal(index){
 const m=meals[index];if(!m)return;
 if(user&&activeProfile){
   if(m.id) await sb.from('meals').delete().eq('id',m.id).eq('profile_id',activeProfile.id);
   else if(day.id) await sb.from('meals').delete().eq('daily_log_id',day.id).eq('profile_id',activeProfile.id).eq('food_key',m.foodKey);
 }
 meals.splice(index,1);
 day.cal=meals.reduce((a,x)=>a+x.cal,0);day.p=meals.reduce((a,x)=>a+x.p,0);day.f=meals.reduce((a,x)=>a+x.f,0);day.c=meals.reduce((a,x)=>a+x.c,0);
 saveLocal();await upsertDaily();render();toast(m.name+' removed');
}
async function clearMeals(){if(user&&activeProfile&&day.id)await sb.from('meals').delete().eq('daily_log_id',day.id).eq('profile_id',activeProfile.id);meals=[];day.cal=day.p=day.f=day.c=0;saveLocal();await upsertDaily();render();toast('All meals cleared')}
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
function schedule(){
 const h=new Date().getHours();
 if(h<11) return [
  {icon:'🌅',time:'Morning',text:'Protein-rich breakfast and a short strength session if convenient.'},
  {icon:'🚶',time:'Late morning',text:'Take a short walk and keep hydration steady.'},
  {icon:'🍛',time:'Lunch',text:'Aim for a balanced meal with a clear protein source.'}
 ];
 if(h<15) return [
  {icon:'🍛',time:'Lunch',text:'Keep the portion aligned with your remaining calorie target.'},
  {icon:'🚶',time:'Afternoon',text:'A short walk after lunch is a simple activity win.'},
  {icon:'💪',time:'Later',text:'Complete the recommended strength work if you have time.'}
 ];
 if(h<19) return [
  {icon:'🚴',time:'Evening',text:'25–40 min cycling or brisk walking is a good cardio option.'},
  {icon:'🍽️',time:'Dinner',text:'Prioritize protein and keep dinner within your remaining calories.'},
  {icon:'💧',time:'Night',text:'Finish the day hydrated and review your logged activity.'}
 ];
 return [
  {icon:'🌙',time:'Tonight',text:'Keep dinner sensible and avoid adding unnecessary calories.'},
  {icon:'🚶',time:'After dinner',text:"A gentle walk can help you finish today's activity target."},
  {icon:'📋',time:'Before bed',text:"Check that today's meals and exercise are fully logged."}
 ];
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
function saveActivity(){day.cycle=day.workout.cycle||0;day.burn=Math.max(0,+dom("burnInput").value||0);saveLocal();upsertDaily();render();toast('Activity saved')}
async function saveWeight(){const w=+newWeight.value||0;if(!w)return;day.weight=w;saveLocal();await upsertDaily();if(user)await sb.from('body_measurements').insert({user_id:user.id,profile_id:activeProfile.id,measure_date:day.date,day_number:dayNumber(day.date),weight_kg:w});closeModals();render();toast('Weight saved')}
async function saveMeasurement(){const x={weight_kg:+measureWeight.value,belly_cm:+measureBelly.value,waist_cm:+measureWaist.value,chest_cm:+measureChest.value,biceps_cm:+measureBiceps.value};if(user)await sb.from('body_measurements').insert({user_id:user.id,profile_id:activeProfile.id,date:today(),...x});day.weight=x.weight_kg;await upsertDaily();closeModals();render();toast('Measurements saved')}
function simpleChart(el,vals,label,target=0){
 if(!vals.length){el.textContent='Keep logging daily data.';return}
 const max=Math.max(target,...vals,1),min=Math.min(0,...vals),w=460,h=120,p=12;
 const pts=vals.map((v,i)=>`${p+i*(w-2*p)/Math.max(1,vals.length-1)},${h-p-(v-min)/(max-min)*(h-2*p)}`).join(' ');
 el.innerHTML=`<div style="font-size:10px;color:#6b7280">${label}</div><svg viewBox="0 0 ${w} ${h}" width="100%" height="125"><polyline points="${pts}" fill="none" stroke="#111827" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${target?`<line x1="${p}" x2="${w-p}" y1="${h-p-(target-min)/(max-min)*(h-2*p)}" y2="${h-p-(target-min)/(max-min)*(h-2*p)}" stroke="#9ca3af" stroke-dasharray="5 5"/>`:''}</svg><small>${vals.map(v=>Math.round(v)).join(' · ')}</small>`;
}
async function refreshHistory(){
 if(user){const {data}=await sb.from('daily_logs').select('*').eq('profile_id',activeProfile.id).order('log_date');dailyHistory=(data||[]).map(x=>({date:x.log_date,cal:x.calories||0,p:x.protein||0,f:x.fat||0,c:x.carbs||0,burn:x.exercise_calories||0,steps:x.steps||0,weight:x.weight_kg}))}
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