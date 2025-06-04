(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))l(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&l(a)}).observe(document,{childList:!0,subtree:!0});function c(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(t){if(t.ep)return;t.ep=!0;const o=c(t);fetch(t.href,o)}})();const d=document.getElementById("dropZone"),g=document.getElementById("analizarBtn");let m=[];d.addEventListener("dragover",i=>{i.preventDefault(),d.classList.add("dragover")});d.addEventListener("dragleave",()=>{d.classList.remove("dragover")});d.addEventListener("drop",async i=>{var l;i.preventDefault(),d.classList.remove("dragover");const n=(l=i.dataTransfer)==null?void 0:l.files[0];if(!n)return;m=(await n.text()).split(`
`),console.log(m)});g==null||g.addEventListener("click",()=>{if(!m.length){alert("Primero arrastra un archivo.");return}y(m)});function y(i){const n=new Set(["var","val","defu","if","else","for","match","case","_","obj","class"]),c=new Set(["String","Doub","bol","char","Int","Boolean","Arr"]),l=new Set(["=","+","-","*","/","%","(",")","{","}","[","]",",",";","->","<-",">=","<=","==","!="]),t=new Set(["&&","||"]),o=new Set(["toDoub","toInt","length"]),a=document.getElementById("resultadosBody");a.classList.add("table-row-animate"),a.innerHTML="";let f=0;for(const p of i){if(f++,!p.trim()||p.trim().startsWith("//")){a.innerHTML+=`
      <tr>
        <td>${f}</td>
        <td colspan="4"><em>Línea vacía o comentario ✅</em></td>
      </tr>
      `;continue}const h=p.split(/(\s+|"[^"]*"|'[^']'|[(),;{}[\]])/).filter(e=>e&&e.trim());let u=!0;for(const e of h){let r="",s=!1;if(n.has(e))r="palabra reservada",s=!0;else if(c.has(e))r="tipo válido",s=!0;else if(l.has(e)||t.has(e))r="símbolo válido",s=!0;else if(/^"[^"]*"$/.test(e))r="cadena válida",s=!0;else if(/^'[^']'$/.test(e))r="carácter válido",s=!0;else if(/^[0-9]+(\.[0-9]+)?$/.test(e))r="número válido",s=!0;else if(/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(e))r="identificador válido",s=!0;else if(/^\.[a-zA-Z_][a-zA-Z0-9_]*$/.test(e))r="método especial",s=o.has(e.substring(1));else if(/^[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*$/.test(e)){const[L,v]=e.split(".");r="acceso a método",s=o.has(v)}else if(e.includes(":")){const[L,v]=e.split(":");r="parámetro tipado",s=/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(L)&&c.has(v.trim())}else r="token no reconocido",s=!1,u=!1;a.innerHTML+=`
      <tr>
        <td>${f}</td>
        <td>${e}</td>
        <td>${r}</td>
        <td>${s?"✅":"❌"}</td>
        <td>${u?"✅":"❌"}</td>
      </tr>
      `}a.innerHTML+=`
    <tr class="${u?"table-success":"table-danger"}">
      <td>${f}</td>
      <td colspan="3"><strong>Resumen línea ${f}</strong></td>
      <td><strong>${u?"Línea válida ✅":"Línea inválida ❌"}</strong></td>
    </tr>
    `}}
