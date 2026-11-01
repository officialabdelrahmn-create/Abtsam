const CONFIG={whatsapp:"20100XXXXXXX",depositPhone:"010XXXXXXXX",deposit:20,
 slots:["10:00 ص","11:00 ص","12:00 م","02:00 م","03:00 م","04:00 م","06:00 م"],closedWeekdays:[5]};
const U=(id,w=700)=>`https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`;
const SERVICES=[
 {t:"زراعة الأسنان",d:"زراعة آمنة ودقيقة بأحدث أنظمة الزرعات لتعويض الأسنان المفقودة.",i:"photo-1606811841689-23dfddce3e95"},
 {t:"تجميل الأسنان",d:"تبييض وابتسامة هوليوود وعدسات تمنحك مظهراً طبيعياً متألقاً.",i:"photo-1588776814546-1ffcf47267a5"},
 {t:"تقويم الأسنان",d:"تقويم معدني وشفاف بخطط علاج مخصصة لكل مريض.",i:"photo-1609840114035-3c981b782dfe"}];
const REVIEWS=[["منى السيد","تجربة رائعة، الطبيب هادئ جداً ولم أشعر بأي ألم أثناء العلاج."],["كريم عادل","أفضل عيادة زرتها. نظافة عالية والتزام تام بالمواعيد."],["هدى محمود","ابتسامتي تغيّرت بالكامل بعد التجميل. شكراً لكل الفريق!"],["يوسف حسن","شرح مفصل للخطة العلاجية وأسعار واضحة من البداية."],["سارة نبيل","حجز سهل وخدمة محترمة، أنصح بها بشدة."]];
const FACES=["photo-1494790108377-be9c29b29330","photo-1500648767791-00dcc994a43e","photo-1438761681033-6461ffad8d80","photo-1472099645785-5658abf4ff4e","photo-1544005313-94ddf0286df2"];
const BA=[["زراعة الأسنان","استعادة كاملة للأسنان الأمامية خلال 4 أشهر.","photo-1606811841689-23dfddce3e95"],["تبييض الأسنان","ابتسامة أفتح بثلاث درجات في جلسة واحدة.","photo-1588776814546-1ffcf47267a5"],["تقويم الأسنان","علاج الازدحام السني خلال 14 شهراً.","photo-1609840114035-3c981b782dfe"],["عدسات الأسنان","تصميم ابتسامة متناسق وطبيعي.","photo-1629909613654-28e377c37b09"]];
const GAL=[["غرفة العلاج","photo-1629909613654-28e377c37b09"],["أجهزة التصوير الرقمي","photo-1606811841689-23dfddce3e95"],["استقبال العيادة","photo-1588776814546-1ffcf47267a5"],["الطبيب مع المريض","photo-1609840114035-3c981b782dfe"],["وحدة التعقيم","photo-1612349317150-e413f6a5b16d"]];
const FAQ=[["هل يمكن حجز موعد أونلاين؟","نعم، يمكنك الحجز من الموقع باختيار اليوم والوقت، أو عبر واتساب."],["ما هي طرق الدفع المتاحة؟","نقبل الدفع نقداً بالعيادة، ويُدفع عربون الحجز الإلكتروني عبر فودافون كاش."],["هل تقدمون خدمات زراعة الأسنان؟","نعم، نقدم زراعة الأسنان بأنظمة معتمدة وبإشراف أخصائي زراعة."],["كم تستغرق جلسة تنظيف الأسنان؟","من 30 إلى 45 دقيقة في المعتاد."],["هل يمكن تغيير موعد الحجز؟","بالتأكيد، تواصل معنا قبل الموعد بـ 24 ساعة على الأقل."],["هل تقدمون استشارات أولية؟","نعم، نقدم كشفاً واستشارة أولية لتحديد الخطة المناسبة."],["هل يوجد ضمان على بعض الخدمات؟","نعم، تتوفر فترات ضمان على الزرعات والتركيبات حسب نوع الحالة."]];
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

// render sections
$("#svc").innerHTML=SERVICES.map((s,i)=>`<article class="card"><img loading="lazy" alt="${s.t}" src="${U(s.i)}"><div><h3>${s.t}</h3><p>${s.d}</p><a href="#booking">اعرف المزيد ←</a></div></article>`).join("");
$("#track").innerHTML=REVIEWS.map((r,i)=>`<article class="rv"><div class="th"><img loading="lazy" alt="${r[0]}" src="${U(FACES[i],500)}"><span class="pl"><i data-lucide="play"></i></span></div><div class="tx"><div class="stars">★★★★★</div><b>${r[0]}</b><p>${r[1]}</p></div></article>`).join("");
$("#ba").innerHTML=BA.map(b=>`<div><div class="ba"><img alt="بعد" src="${U(b[2],900)}"><div class="bf"><img alt="قبل" src="${U(b[2],900)}"></div><span class="lb" style="right:12px">بعد</span><span class="lb" style="left:12px">قبل</span><div class="hd" tabindex="0" role="slider" aria-label="مقارنة قبل وبعد"></div></div><div class="bat"><b>${b[0]}</b><span>${b[1]}</span></div></div>`).join("");
$("#gal").innerHTML=GAL.map(g=>`<figure><img loading="lazy" alt="${g[0]}" src="${U(g[1],600)}"><figcaption>${g[0]}</figcaption></figure>`).join("");
$("#faq").innerHTML=FAQ.map(f=>`<div class="acc"><button aria-expanded="false">${f[0]}</button><div class="pn"><p>${f[1]}</p></div></div>`).join("");
$("[name=service]").innerHTML='<option value="">اختر الخدمة</option>'+[...SERVICES.map(s=>s.t),"كشف واستشارة","تنظيف الأسنان"].map(s=>`<option>${s}</option>`).join("");
$("#waLink").href="https://wa.me/"+CONFIG.whatsapp;

// img fallback (no blank images)
document.addEventListener("error",e=>{if(e.target.tagName==="IMG"){e.target.style.opacity=0}},true);

// header, menu, scroll spy
const hdr=$("#header"),links=$("#links"),burger=$("#burger"),fbar=$(".fbar");
addEventListener("scroll",()=>hdr.classList.toggle("scrolled",scrollY>30),{passive:true});
burger.onclick=()=>{links.classList.toggle("open");burger.classList.toggle("o")};
$$("a",links).forEach(a=>a.onclick=()=>links.classList.remove("open"));
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const id="#"+e.target.id;$$(".links a,.fbar a").forEach(a=>a.classList.toggle("active",a.getAttribute("href")===id&&a.closest(".links")));$$(".fbar a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")===id));fbar.classList.toggle("hide",id==="#contact")}}),{rootMargin:"-45% 0px -50% 0px"});
$$("section[id],footer[id]").forEach(s=>spy.observe(s));

// carousel
const track=$("#track"),cards=$$(".rv",track),dots=$("#dots");
dots.innerHTML=cards.map(()=>"<i></i>").join("");
const upd=()=>{const w=cards[0].offsetWidth+20,i=Math.min(cards.length-1,Math.round(Math.abs(track.scrollLeft)/w));$$("i",dots).forEach((d,k)=>d.classList.toggle("on",k===i))};
track.addEventListener("scroll",upd,{passive:true});upd();
$$(".arrows button").forEach(b=>b.onclick=()=>track.scrollBy({left:-b.dataset.dir*(cards[0].offsetWidth+20)}));

// before/after sliders
$$(".ba").forEach(box=>{const bf=$(".bf",box),hd=$(".hd",box);let on=false;
 const set=x=>{const r=box.getBoundingClientRect(),p=Math.max(0,Math.min(100,(x-r.left)/r.width*100));hd.style.left=p+"%";bf.style.clipPath=`inset(0 0 0 ${p}%)`};
 hd.addEventListener("pointerdown",e=>{on=true;hd.setPointerCapture(e.pointerId)});
 hd.addEventListener("pointermove",e=>on&&set(e.clientX));hd.addEventListener("pointerup",()=>on=false);
 box.addEventListener("click",e=>set(e.clientX));
 hd.addEventListener("keydown",e=>{const r=box.getBoundingClientRect(),c=hd.getBoundingClientRect().left-r.left;if(e.key==="ArrowLeft")set(r.left+c-20);if(e.key==="ArrowRight")set(r.left+c+20)})});

// FAQ accordion
$$(".acc").forEach(a=>$("button",a).onclick=()=>{const open=a.classList.contains("open");
 $$(".acc.open").forEach(o=>{o.classList.remove("open");$(".pn",o).style.maxHeight=0;$("button",o).setAttribute("aria-expanded","false")});
 if(!open){a.classList.add("open");const p=$(".pn",a);p.style.maxHeight=p.scrollHeight+30+"px";$("button",a).setAttribute("aria-expanded","true")}});

$("#playBtn").onclick=()=>alert("فيديو تعريفي توضيحي — استبدله برابط الفيديو الفعلي للعيادة.");
