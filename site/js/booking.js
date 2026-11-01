const AR_M=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const AR_D=["أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"];
const form=$("#bookForm"),modal=$("#modal"),body=$("#body");
let S={step:0,view:new Date(),date:null,time:null,name:"",phone:"",service:"",file:null,preview:""};
const phoneOk=p=>/^(\+?20|0)?1[0125]\d{8}$/.test(p.replace(/\s/g,""));
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const fmt=d=>`${AR_D[d.getDay()]} ${d.getDate()} ${AR_M[d.getMonth()]} ${d.getFullYear()}`;
const taken=()=>JSON.parse(localStorage.getItem("demoBookings")||"[]");
function check(){const f=new FormData(form),n=f.get("name").trim(),p=f.get("phone").trim(),s=f.get("service");
 const e=!n?"من فضلك أدخل الاسم الكامل.":!phoneOk(p)?"رقم الهاتف غير صحيح (مثال: 01012345678).":!s?"اختر الخدمة المطلوبة.":"";
 $("#formErr").textContent=e;return e?null:{n,p,s,notes:f.get("notes").trim()}}
$("#waBtn").onclick=()=>{const v=check();if(!v)return;
 const msg=`السلام عليكم، أود حجز موعد.\nالاسم: ${v.n}\nالهاتف: ${v.p}\nالخدمة: ${v.s}${v.notes?"\nملاحظات: "+v.notes:""}`;
 window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`,"_blank","noopener")};
$("#siteBtn").onclick=()=>{const v=check();if(!v)return;Object.assign(S,{step:0,date:null,time:null,name:v.n,phone:v.p,service:v.s,file:null,preview:"",view:new Date()});open_();render()};
function open_(){modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function close_(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""}
$("#closeM").onclick=close_;modal.onclick=e=>e.target===modal&&close_();addEventListener("keydown",e=>e.key==="Escape"&&close_());
const go=n=>{S.step=n;render()};
function render(){$("#steps").innerHTML=[0,1,2,3,4].map(i=>`<i class="${i<=Math.min(S.step,4)?"on":""}"></i>`).join("");
 [stepDate,stepTime,stepInfo,stepPay,stepUpload,stepDone][S.step]();lucide.createIcons()}
function stepDate(){const v=S.view,y=v.getFullYear(),m=v.getMonth(),first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),today=new Date();today.setHours(0,0,0,0);
 let h=`<h3>1. اختر التاريخ</h3><div class="cal-h"><button id="nx" aria-label="التالي">‹</button><span>${AR_M[m]} ${y}</span><button id="pv" aria-label="السابق">›</button></div><div class="cal">${AR_D.map(d=>`<small>${d}</small>`).join("")}${"<span></span>".repeat(first)}`;
 for(let d=1;d<=days;d++){const dt=new Date(y,m,d),dis=dt<today||CONFIG.closedWeekdays.includes(dt.getDay());
  h+=`<button data-d="${iso(dt)}" ${dis?"disabled":""} class="${+dt===+today?"today ":""}${S.date===iso(dt)?"sel":""}">${d}</button>`}
 body.innerHTML=h+`</div><p style="margin-top:12px;font-size:.88rem;color:var(--muted)">${S.date?"التاريخ المختار: "+fmt(new Date(S.date+"T00:00")):"لم يتم اختيار تاريخ بعد (الجمعة إجازة)"}</p><button class="btn btn-dark" id="go" ${S.date?"":"disabled"}>التالي</button>`;
 $("#pv").onclick=()=>{const n=new Date(y,m-1,1);if(n>=new Date(today.getFullYear(),today.getMonth(),1)){S.view=n;stepDate()}};
 $("#nx").onclick=()=>{S.view=new Date(y,m+1,1);stepDate()};
 $$(".cal [data-d]",body).forEach(b=>b.onclick=()=>{S.date=b.dataset.d;S.time=null;stepDate()});
 $("#go").onclick=()=>go(1)}
function stepTime(){const used=taken().filter(b=>b.date===S.date).map(b=>b.time);
 body.innerHTML=`<h3>2. اختر الوقت</h3><p style="color:var(--muted)">${fmt(new Date(S.date+"T00:00"))}</p><div class="slots">${CONFIG.slots.map(t=>`<button data-t="${t}" ${used.includes(t)?"disabled":""} class="${S.time===t?"sel":""}">${t}</button>`).join("")}</div><button class="btn btn-dark" id="go" ${S.time?"":"disabled"}>التالي</button><button class="btn btn-outline" id="bk">رجوع</button>`;
 $$(".slots button",body).forEach(b=>b.onclick=()=>{S.time=b.dataset.t;stepTime()});$("#go").onclick=()=>go(2);$("#bk").onclick=()=>go(0)}
function stepInfo(){body.innerHTML=`<h3>3. بيانات المريض</h3><div style="display:grid;gap:12px"><label>الاسم الكامل<input id="n" value="${S.name}"></label><label>رقم الهاتف<input id="p" type="tel" value="${S.phone}"></label><label>الخدمة<input value="${S.service}" readonly></label><label>الموعد<input value="${fmt(new Date(S.date+"T00:00"))} — ${S.time}" readonly></label></div><p class="err" id="e"></p><button class="btn btn-dark" id="go">متابعة للعربون</button><button class="btn btn-outline" id="bk">رجوع</button>`;
 $("#go").onclick=()=>{const n=$("#n").value.trim(),p=$("#p").value.trim();if(n.length<3)return $("#e").textContent="أدخل الاسم الكامل.";if(!phoneOk(p))return $("#e").textContent="رقم الهاتف غير صحيح.";S.name=n;S.phone=p;go(3)};$("#bk").onclick=()=>go(1)}
function stepPay(){body.innerHTML=`<h3>4. عربون الحجز</h3><p>لتأكيد حجز موعدك، يرجى دفع عربون بقيمة ${CONFIG.deposit} جنيه مصري.</p><div class="pay" style="margin-top:12px"><span class="vf">vodafone cash</span><div class="num">${CONFIG.depositPhone}</div><b>المبلغ: ${CONFIG.deposit} EGP</b><br><button class="btn btn-outline" id="cp" style="width:auto;margin-top:10px"><i data-lucide="copy"></i> نسخ الرقم</button><ol><li>افتح تطبيق فودافون كاش (أو اطلب *9*7#).</li><li>حوّل ${CONFIG.deposit} جنيه إلى الرقم أعلاه.</li><li>التقط صورة لإثبات التحويل وارفعها في الخطوة التالية.</li></ol></div><small class="demo" style="display:block;margin-top:10px">⚠ عرض تجريبي: الرقم وهمي ولا يتم تنفيذ أي تحويل حقيقي.</small><button class="btn btn-dark" id="go">لقد حوّلت المبلغ</button><button class="btn btn-outline" id="bk">رجوع</button>`;
 $("#cp").onclick=async e=>{try{await navigator.clipboard.writeText(CONFIG.depositPhone)}catch{}e.currentTarget.textContent="تم النسخ ✓"};$("#go").onclick=()=>go(4);$("#bk").onclick=()=>go(2)}
function stepUpload(){body.innerHTML=`<h3>5. ارفع صورة إثبات التحويل</h3><div class="drop" id="dz" tabindex="0">${S.preview?`<img alt="معاينة" src="${S.preview}">`:"اسحب الصورة هنا أو اضغط للاختيار<br><small>JPG / PNG / WEBP — حتى 5MB</small>"}</div><input type="file" id="fi" accept="image/jpeg,image/png,image/webp" hidden><p class="err" id="e"></p>${S.preview?'<button class="btn btn-outline" id="rm">حذف / استبدال الصورة</button>':""}<button class="btn btn-dark" id="go" ${S.preview?"":"disabled"}>تأكيد الإرسال</button><button class="btn btn-outline" id="bk">رجوع</button>`;
 const fi=$("#fi"),dz=$("#dz"),take=f=>{if(!f)return;if(!["image/jpeg","image/png","image/webp"].includes(f.type))return $("#e").textContent="نوع الملف غير مدعوم.";if(f.size>5*1048576)return $("#e").textContent="حجم الصورة أكبر من 5MB.";
  const r=new FileReader();r.onload=()=>{S.file=f.name;S.preview=r.result;stepUpload()};r.readAsDataURL(f)};
 dz.onclick=()=>fi.click();dz.onkeydown=e=>e.key==="Enter"&&fi.click();fi.onchange=()=>take(fi.files[0]);
 ["dragover","dragenter"].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();dz.classList.add("over")}));["dragleave","drop"].forEach(t=>dz.addEventListener(t,()=>dz.classList.remove("over")));
 dz.addEventListener("drop",e=>{e.preventDefault();take(e.dataTransfer.files[0])});
 if($("#rm"))$("#rm").onclick=()=>{S.file=null;S.preview="";stepUpload()};
 $("#go").onclick=()=>{S.ref="SM-"+Date.now().toString(36).toUpperCase().slice(-6);const l=taken();l.push({ref:S.ref,date:S.date,time:S.time,name:S.name,service:S.service,proof:S.file,status:"pending"});localStorage.setItem("demoBookings",JSON.stringify(l));go(5)};$("#bk").onclick=()=>go(3)}
function stepDone(){body.innerHTML=`<div class="ok"><div class="ring"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="25"/><path d="M14 27l8 8 16-17"/></svg></div><h3 style="margin-top:12px">تم الحجز</h3><p>تم استلام إثبات الدفع بنجاح</p><p class="pend">الحالة: في انتظار مراجعة الدفع</p></div><div class="rcpt"><p><span>رقم الحجز</span><b>${S.ref}</b></p><p><span>المريض</span><b>${S.name}</b></p><p><span>التاريخ</span><b>${fmt(new Date(S.date+"T00:00"))}</b></p><p><span>الوقت</span><b>${S.time}</b></p><p><span>العربون</span><b>${CONFIG.deposit} جنيه</b></p></div><small class="demo" style="display:block;margin-top:12px">هذا عرض تجريبي: لم يتم التحقق من أي دفع، والصورة لم تُرسل لأي خادم.</small><button class="btn btn-dark" id="fin">إغلاق</button>`;$("#fin").onclick=()=>{close_();form.reset()}}
