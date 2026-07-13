const C=window.AQEEL_CONFIG||{}, $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let lang="es", property="cabin", month=new Date(new Date().getFullYear(),new Date().getMonth(),1), booked=[];

const T={
 es:{navStay:"Hospedaje",navGallery:"Galería",navAvailability:"Disponibilidad",navReviews:"Reseñas",navNearby:"Cerca",navGettingHere:"Cómo llegar",heroEyebrow:"Retiro privado en la naturaleza de Panamá",heroTitle:"Duerme junto al río. Despierta en la selva.",heroText:"Aqeel Cabin y Jungle River Dome en Churuquita Grande, Coclé.",checkDates:"Revisar fechas",bookWhatsApp:"Reservar por WhatsApp",chooseStayEyebrow:"Elige tu estadía",chooseStayTitle:"Dos experiencias privadas, una propiedad natural",cabinDesc:"Cabaña privada con cocina, terraza, hamacas, BBQ, Wi‑Fi Starlink y espacio para familias o grupos pequeños.",domeDesc:"Domo privado junto al río con cama queen, aire acondicionado, kitchenette, terraza y BBQ exterior.",checkCabin:"Ver disponibilidad de la cabaña →",checkDome:"Ver disponibilidad del domo →",storyEyebrow:"La historia de Aqeel",storyTitle:"Un lugar creado con propósito",storyText:"Aqeel Cabin & Dome lleva el nombre del hijo del propietario, Aqeel. La propiedad nació durante el viaje de su familia a Panamá y se convirtió en un refugio de naturaleza, descanso y conexión.",galleryEyebrow:"Galería",galleryTitle:"Naturaleza real, momentos reales",galleryHint:"Las fotos y videos originales se cargan desde la carpeta assets.",availabilityEyebrow:"Disponibilidad en vivo",availabilityTitle:"¿Qué alojamiento deseas revisar?",cabinSelector:"Revisar calendario de la cabaña",domeSelector:"Revisar calendario del domo",currentlyChecking:"Actualmente revisando:",available:"Disponible",booked:"Ocupado",loadingCalendar:"Cargando calendario…",bookingRequest:"Solicitud de reserva",arrival:"Llegada",nights:"Noches",guests:"Huéspedes",checkAndWhatsApp:"Revisar y continuar por WhatsApp",reviewsEyebrow:"Opiniones de huéspedes",reviewsTitle:"Experiencias compartidas",leaveGoogleReview:"Dejar reseña en Google",nearbyEyebrow:"Comida y compras cerca",nearbyTitle:"Restaurantes y supermercados",faqTitle:"Pregunta sobre la estadía",faqText:"Escribe en español o inglés. El asistente usa tu base de datos de preguntas frecuentes.",faqPlaceholder:"Escribe tu pregunta aquí",ask:"Preguntar",readyEyebrow:"¿Listo para escapar?",readyTitle:"Confirma tu fecha directamente con nosotros"},
 en:{navStay:"Stay",navGallery:"Gallery",navAvailability:"Availability",navReviews:"Reviews",navNearby:"Nearby",navGettingHere:"Getting here",heroEyebrow:"A private nature retreat in Panama",heroTitle:"Sleep by the river. Wake in the jungle.",heroText:"Aqeel Cabin and Jungle River Dome in Churuquita Grande, Coclé.",checkDates:"Check dates",bookWhatsApp:"Book on WhatsApp",chooseStayEyebrow:"Choose your stay",chooseStayTitle:"Two private experiences on one natural property",cabinDesc:"Private cabin with kitchen, terrace, hammocks, BBQ, Starlink Wi‑Fi and room for families or small groups.",domeDesc:"Private riverside dome with queen bed, air conditioning, kitchenette, terrace and outdoor BBQ.",checkCabin:"Check Cabin availability →",checkDome:"Check Dome availability →",storyEyebrow:"The Aqeel story",storyTitle:"A place created with purpose",storyText:"Aqeel Cabin & Dome is named after the owner's son, Aqeel. The property began during his family's journey to Panama and grew into a retreat for nature, rest and connection.",galleryEyebrow:"Gallery",galleryTitle:"Real nature, real moments",galleryHint:"Original photos and videos load from the assets folder.",availabilityEyebrow:"Live availability",availabilityTitle:"Which stay would you like to check?",cabinSelector:"Check the Cabin calendar",domeSelector:"Check the Dome calendar",currentlyChecking:"Currently checking:",available:"Available",booked:"Booked",loadingCalendar:"Loading calendar…",bookingRequest:"Booking request",arrival:"Arrival",nights:"Nights",guests:"Guests",checkAndWhatsApp:"Check and continue on WhatsApp",reviewsEyebrow:"Guest reviews",reviewsTitle:"Experiences guests shared",leaveGoogleReview:"Leave a Google review",nearbyEyebrow:"Food and shopping nearby",nearbyTitle:"Restaurants and grocery stores",faqTitle:"Ask about your stay",faqText:"Type in English or Spanish. The assistant uses your FAQ database.",faqPlaceholder:"Type your question here",ask:"Ask",readyEyebrow:"Ready to escape?",readyTitle:"Confirm your dates directly with us"}
};

function applyLanguage(){
 document.documentElement.lang=lang;
 $$("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(T[lang][k])el.innerHTML=T[lang][k]});
 $$("[data-i18n-placeholder]").forEach(el=>el.placeholder=T[lang][el.dataset.i18nPlaceholder]||"");
 $$(".lang-switch button").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
 renderNearby(); renderCalendar(); renderReviews($(".review-source-tabs .active")?.dataset.source||"google");
}
$$(".lang-switch button").forEach(b=>b.onclick=()=>{lang=b.dataset.lang;applyLanguage()});
$(".menu-toggle").onclick=()=>{const n=$(".nav");n.classList.toggle("open");$(".menu-toggle").setAttribute("aria-expanded",n.classList.contains("open"))};

function setProperty(p){
 property=p;
 $$(".property-option").forEach(b=>{const on=b.dataset.property===p;b.classList.toggle("active",on);b.setAttribute("aria-checked",on)});
 $("#selectedPropertyName").textContent=p==="cabin"?"Aqeel Cabin":"Jungle River Dome";
 loadCalendar();
}
$$(".property-option").forEach(b=>b.onclick=()=>setProperty(b.dataset.property));
$$(".property-jump").forEach(a=>a.onclick=()=>setProperty(a.dataset.property));

function renderGallery(){
 const g=$("#galleryGrid"); g.innerHTML="";
 (C.GALLERY||[]).forEach((m,i)=>{
  const b=document.createElement("button");b.className="gallery-item";
  if(m.type==="video"){
   b.innerHTML=`<video muted playsinline preload="metadata" poster="${m.poster||""}"><source src="${m.src}" type="video/mp4"></video><span class="play">▶ Video</span>`;
  }else b.innerHTML=`<img loading="lazy" src="${m.src}" alt="${m.alt||""}">`;
  b.querySelector("img,video").addEventListener("error",()=>{b.innerHTML=`<div class="placeholder">Add ${m.src} to the assets folder</div>`});
  b.onclick=()=>openLightbox(m);g.appendChild(b);
 });
}
function openLightbox(m){
 const box=$("#lightboxContent");box.innerHTML=m.type==="video"?`<video controls autoplay playsinline poster="${m.poster||""}"><source src="${m.src}" type="video/mp4"></video>`:`<img src="${m.src}" alt="${m.alt||""}">`;
 $("#lightbox").showModal();
}
$("#lightboxClose").onclick=()=>$("#lightbox").close();

async function loadCalendar(){
 $("#calendarStatus").textContent=lang==="es"?"Cargando calendario…":"Loading calendar…";
 booked=[];
 if(!C.API_URL||C.API_URL.includes("PASTE_")){
  $("#calendarStatus").textContent=lang==="es"?"Añade tu URL actual de Google Apps Script en config.js para activar el calendario en vivo.":"Add your existing Google Apps Script URL in config.js to activate the live calendar.";
  renderCalendar();return;
 }
 try{
  const r=await fetch(`${C.API_URL}?action=calendar&property=${property}`),d=await r.json();
  booked=d.events||[];$("#calendarStatus").textContent=(lang==="es"?"Actualizado: ":"Updated: ")+(d.updated||new Date().toLocaleString());renderCalendar();
 }catch(e){$("#calendarStatus").textContent=lang==="es"?"No se pudo conectar al calendario.":"Could not connect to the calendar.";renderCalendar()}
}
function iso(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function isBooked(s){const d=new Date(s+"T00:00:00");return booked.some(e=>d>=new Date(e.start+"T00:00:00")&&d<new Date(e.end+"T00:00:00"))}
function renderCalendar(){
 const names=lang==="es"?["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"]:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
 $("#monthTitle").textContent=month.toLocaleDateString(lang==="es"?"es-PA":"en-US",{month:"long",year:"numeric"});
 const g=$("#calendarGrid");g.innerHTML=names.map(n=>`<div class="cal-head">${n}</div>`).join("");
 const first=new Date(month.getFullYear(),month.getMonth(),1).getDay(),days=new Date(month.getFullYear(),month.getMonth()+1,0).getDate(),today=new Date();today.setHours(0,0,0,0);
 for(let i=0;i<first;i++)g.insertAdjacentHTML("beforeend","<div></div>");
 for(let n=1;n<=days;n++){const d=new Date(month.getFullYear(),month.getMonth(),n),s=iso(d),cls=["cal-day",isBooked(s)?"booked":""];if(d<today)cls.push("past");if(+d===+today)cls.push("today");g.insertAdjacentHTML("beforeend",`<div class="${cls.join(" ")}">${n}</div>`)}
}
$("#prevMonth").onclick=()=>{month.setMonth(month.getMonth()-1);renderCalendar()};$("#nextMonth").onclick=()=>{month.setMonth(month.getMonth()+1);renderCalendar()};

$("#bookingForm").onsubmit=e=>{
 e.preventDefault();const date=$("#arrivalDate").value,n=Number($("#nights").value),guests=Number($("#guests").value);
 if(!date)return;
 let conflict=false;for(let i=0;i<n;i++){const d=new Date(date+"T00:00:00");d.setDate(d.getDate()+i);if(isBooked(iso(d)))conflict=true}
 const prop=property==="cabin"?"Aqeel Cabin":"Jungle River Dome";
 const msg=lang==="es"?`Hola, deseo consultar una reserva.\nAlojamiento: ${prop}\nLlegada: ${date}\nNoches: ${n}\nHuéspedes: ${guests}\n${conflict?"El calendario muestra un posible conflicto; deseo confirmar opciones.":"El calendario parece disponible; deseo confirmar precio y reserva."}`:`Hello, I would like to check a booking.\nProperty: ${prop}\nArrival: ${date}\nNights: ${n}\nGuests: ${guests}\n${conflict?"The calendar shows a possible conflict; please confirm alternatives.":"The calendar appears available; please confirm price and booking."}`;
 $("#availabilityMessage").textContent=conflict?(lang==="es"?"Una o más noches aparecen ocupadas. Abriremos WhatsApp para confirmar alternativas.":"One or more nights appear booked. WhatsApp will open to confirm alternatives."):(lang==="es"?"Las fechas parecen disponibles. Confirma por WhatsApp.":"The dates appear available. Confirm on WhatsApp.");
 window.open(`https://wa.me/${C.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
};

function renderNearby(){
 const g=$("#nearbyGrid");g.innerHTML="";
 (C.NEARBY||[]).forEach(x=>{const a=document.createElement("article");a.className="nearby-card";a.innerHTML=`${x.image?`<img loading="lazy" src="${x.image}" alt="${x.name}">`:`<div class="nearby-image">${x.type==="restaurant"?"🍽️":"🛒"}</div>`}<div class="nearby-body"><h3>${x.name}</h3><p>${lang==="es"?x.description_es:x.description_en}</p><a class="map-btn" href="${x.map}" target="_blank" rel="noopener">${lang==="es"?"Obtener ubicación →":"Get location →"}</a></div>`;g.appendChild(a)})
}

async function renderReviews(source){
 $$(".review-source-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.source===source));
 const grid=$("#reviewsGrid"),summary=$("#reviewsSummary"),note=$("#reviewsNote");grid.innerHTML="";summary.textContent="";note.textContent="";
 const endpoint=C.REVIEWS_ENDPOINTS?.[source];
 let data=null;
 if(endpoint){try{data=await (await fetch(endpoint)).json()}catch(e){}}
 const reviews=data?.reviews||C.REVIEW_FALLBACKS?.[source]||[];
 if(data?.rating)summary.textContent=`★ ${data.rating} · ${data.total||reviews.length} ${lang==="es"?"reseñas":"reviews"}`;
 if(!reviews.length){
  note.textContent=lang==="es"?`${source==="google"?"Google":"Las reseñas de "+source} está preparado para conexión en vivo. Agrega un endpoint seguro en config.js; no coloques claves secretas directamente en el navegador.`:`${source==="google"?"Google":source+" reviews"} is ready for a live connection. Add a secure endpoint in config.js; do not place secret keys in browser code.`;
  grid.innerHTML=`<article class="review-card"><div class="stars">★★★★★</div><p>${lang==="es"?"Las reseñas aparecerán aquí automáticamente cuando se conecte el servicio.":"Reviews will appear here automatically when the service is connected."}</p><small>${source}</small></article>`;
  return;
 }
 reviews.slice(0,6).forEach(r=>grid.insertAdjacentHTML("beforeend",`<article class="review-card"><div class="stars">${"★".repeat(Math.round(r.rating||5))}</div><p>“${r.text||""}”</p><small>${r.author||"Guest"} · ${source}</small></article>`));
}
$$(".review-source-tabs button").forEach(b=>b.onclick=()=>renderReviews(b.dataset.source));

async function askFAQ(){
 const q=$("#faqInput").value.trim(),a=$("#faqAnswer");if(!q)return;a.style.display="block";a.textContent=lang==="es"?"Buscando…":"Searching…";
 if(!C.API_URL||C.API_URL.includes("PASTE_")){a.textContent=lang==="es"?"Añade tu URL actual de Google Apps Script en config.js para activar el asistente.":"Add your existing Google Apps Script URL in config.js to activate the assistant.";return}
 try{const u=`${C.API_URL}?action=ask&question=${encodeURIComponent(q)}&language=${lang}&property=${property}`,d=await (await fetch(u)).json();a.innerHTML=linkify(d.answer||d.message||"")}
 catch(e){a.textContent=lang==="es"?"No se pudo conectar. Intenta por WhatsApp.":"Could not connect. Please try WhatsApp."}
}
function linkify(s){return String(s).replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>')}
$("#faqAsk").onclick=askFAQ;$("#faqInput").onkeydown=e=>{if(e.key==="Enter")askFAQ()};

renderGallery();renderNearby();applyLanguage();loadCalendar();renderReviews("google");
