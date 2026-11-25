const $ = s => document.querySelector(s);
const chats = [
  {id:1,name:"Основной чат",detail:"Группа • добавлен вручную"},
  {id:2,name:"Новости проекта",detail:"Канал • добавлен вручную"},
  {id:3,name:"Команда",detail:"Группа • добавлен вручную"}
];
let selected = new Set(), paused = false;
function render(){
  const q=$("#search").value.toLowerCase();
  const items=chats.filter(c=>c.name.toLowerCase().includes(q));
  $("#chatList").innerHTML=items.length?items.map(c=>`<label class="chat"><input type="checkbox" data-id="${c.id}" ${selected.has(c.id)?"checked":""}><span class="avatar">${c.name.slice(0,1).toUpperCase()}</span><span class="chat-name">${escapeHtml(c.name)}<small>${escapeHtml(c.detail)}</small></span></label>`).join(""):'<div class="empty">Чаты не найдены</div>';
  $("#selectedCount").textContent=selected.size;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("#chatList").addEventListener("change",e=>{if(e.target.matches("input[data-id]")){const id=Number(e.target.dataset.id);e.target.checked?selected.add(id):selected.delete(id);$("#selectedCount").textContent=selected.size;}});
$("#search").addEventListener("input",render);
$("#addChat").onclick=()=>{const name=prompt("Название чата (для вашего списка):");if(name&&name.trim()){chats.push({id:Math.max(0,...chats.map(c=>c.id))+1,name:name.trim(),detail:"Добавлен вручную"});render();}};
$("#message").addEventListener("input",()=>{const v=$("#message").value;$("#charCount").textContent=v.length;$("#counter").textContent=`${v.length} / 4000`;$("#preview").textContent=v||"Текст сообщения появится здесь.";});
$("#delay").oninput=()=>$("#delayValue").textContent=$("#delay").value+" сек";
$("#copy").onclick=async()=>{if(!$("#message").value.trim())return notice("Сначала введи текст сообщения.");try{await navigator.clipboard.writeText($("#message").value);notice("Текст скопирован. Отправь его вручную в выбранных чатах.");}catch{notice("Не удалось скопировать автоматически.");}};
$("#save").onclick=()=>{if(!$("#message").value.trim())return notice("Черновик пуст.");notice("Черновик подготовлен. Сообщение не отправлено.");$("#state").textContent="Сохранён";};
$("#pause").onclick=()=>{paused=!paused;$("#pause").textContent=paused?"Продолжить":"Пауза";notice(paused?"План приостановлен.":"План снова активен.");};
$("#stop").onclick=()=>{paused=false;selected.clear();$("#pause").textContent="Пауза";render();notice("План сброшен. Черновик сообщения сохранён.");};
function notice(t){$("#notice").textContent=t;}
render();
if(window.Telegram?.WebApp){Telegram.WebApp.ready();Telegram.WebApp.expand();Telegram.WebApp.setHeaderColor("#0b0d13");Telegram.WebApp.setBackgroundColor("#0b0d13");}
