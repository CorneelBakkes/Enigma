function openCase(i){location.href=`dossier-${i+1}.html`;}
const view=document.body.dataset.view||'home';
const pageLinks=[['bureau.html','Dossiers'],['kaart.html','Kaart'],['tijdlijn.html','Tijdlijn'],['finale.html','Finale']];
const activeFile=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.topbar a').forEach(a=>{if(a.getAttribute('href')===activeFile)a.setAttribute('aria-current','page');});
function trail(label){return `<nav class="page-trail" aria-label="Je bevindt je hier"><a href="index.html">Binnenkomst</a><span>/</span><a href="bureau.html">Bureau</a><span>/</span><strong>${esc(label)}</strong></nav>`;}
document.querySelectorAll('main>section').forEach(s=>s.classList.add('route-hidden'));
const targets={home:'aankomst',bureau:'werkruimte',kaart:'kaart',tijdlijn:'tijdlijn',finale:'finale',slot:'slotverklaring'};
if(view.startsWith('dossier-')){
 const i=Number(view.split('-')[1])-1;
 if(i>=0&&i<CASES.length){renderCase(i);$('#case-dialog').close();const article=document.createElement('article');article.className='dossier-page';article.innerHTML=trail(`Dossier 0${i+1}`);article.append($('#case-body'));const nav=document.createElement('nav');nav.className='dossier-navigation';nav.setAttribute('aria-label','Door het onderzoek');nav.innerHTML=`<a href="${i===0?'bureau.html':`dossier-${i}.html`}">← ${i===0?'Alle dossiers':'Vorig dossier'}</a><a href="bureau.html">Terug naar het bureau</a><a href="${i===4?'finale.html':`dossier-${i+2}.html`}">${i===4?'Naar de finale':'Volgend dossier'} →</a>`;article.append(nav);$('main').prepend(article);$('#case-title').focus({preventScroll:true});window.scrollTo(0,0);}
}else{
 const target=document.getElementById(targets[view]||'aankomst');target.classList.remove('route-hidden');target.classList.add('route-visible');
 if(view==='slot'){if(state.final?.open){target.hidden=false;}else{target.hidden=true;const locked=document.createElement('article');locked.className='locked-page';locked.innerHTML=trail('Slotverklaring')+'<h2>De laatste bladzijde.</h2><p>Lees eerst het onderschepte bericht en open de getuigenenvelop.</p><a class="primary" href="finale.html">Naar de finale →</a>';$('main').prepend(locked);}}
 if(view!=='home'){target.insertAdjacentHTML('afterbegin',trail({bureau:'Dossiers',kaart:'Kaart',tijdlijn:'Tijdlijn',finale:'Finale',slot:'Slotverklaring'}[view]));}
 if(view==='bureau'){document.querySelectorAll('#route button').forEach((button,i)=>{const a=document.createElement('a');a.className='dossier-link';a.href=`dossier-${i+1}.html`;a.innerHTML=`<span class="file-number">0${i+1}</span><span>${esc(CASES[i].title)}</span><span aria-hidden="true">↗</span>`;button.replaceWith(a);});}
}
if(state.decoded){$('#witness-open').hidden=false;}
// The next step stays a normal page link, including after a dossier is marked discussed.
document.addEventListener('click',e=>{if(e.target.closest('#continue')&&state.completed.length===5)location.href='finale.html';});

if(["bureau","slot","finale"].includes(view)){const bonus=document.createElement("p");bonus.className="bonus-link";bonus.innerHTML='<a href="eigen-bericht.html">Klaar? Maak je eigen Enigma-bericht →</a>';document.querySelector(".route-visible")?.append(bonus);}
