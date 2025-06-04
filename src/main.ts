const dropZone = document.getElementById("dropZone") as HTMLElement;
const analizarBtn = document.getElementById("analizarBtn");


let lineas:string[] = [];

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault(); 
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", async (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragover");


  const file = event.dataTransfer?.files[0];
  if (!file) return;

  const text = await file.text();
  lineas = text.split('\n');
  console.log(lineas)
});

analizarBtn?.addEventListener("click", () => {
  if(!lineas.length){
    alert("Primero arrastra un archivo.");
    return;
  }
  analizadorLexico(lineas);
});


function analizadorLexico(lineas: string[]): void {
  // Definiciones de tokens válidos (igual que antes)
  const palabrasReservadas = new Set(['var', 'val', 'defu', 'if', 'else', 'for', 'match', 'case', '_', 'obj', 'class']);
  const tiposDatos = new Set(['String', 'Doub', 'bol', 'char', 'Int', 'Boolean', 'Arr']);
  const simbolos = new Set(['=', '+', '-', '*', '/', '%', '(', ')', '{', '}', '[', ']', ',', ';', '->', '<-', '>=', '<=', '==', '!=']);
  const operadoresLogicos = new Set(['&&', '||']);
  const metodosEspeciales = new Set(['toDoub', 'toInt', 'length']);

  const tbody = document.getElementById('resultadosBody')!;
  tbody.classList.add("table-row-animate");
  tbody.innerHTML = '';

  let contadorLinea = 0;
  let contadorToken = 0;

  for (const linea of lineas) {
    contadorLinea++;
    
    if (!linea.trim() || linea.trim().startsWith('//')) {
      tbody.innerHTML += `
      <tr>
        <td>${contadorLinea}</td>
        <td colspan="4"><em>Línea vacía o comentario ✅</em></td>
      </tr>
      `;
      continue;
    }

    const tokens = linea.split(/(\s+|"[^"]*"|'[^']'|[(),;{}[\]])/).filter(t => t && t.trim());
    let lineaValida = true;

    for (const token of tokens) {
      contadorToken++;
      let tipo = '';
      let valido = false;

      if (palabrasReservadas.has(token)) {
        tipo = 'palabra reservada';
        valido = true;
      } else if (tiposDatos.has(token)) {
        tipo = 'tipo válido';
        valido = true;
      } else if (simbolos.has(token) || operadoresLogicos.has(token)) {
        tipo = 'símbolo válido';
        valido = true;
      } else if (/^"[^"]*"$/.test(token)) {
        tipo = 'cadena válida';
        valido = true;
      } else if (/^'[^']'$/.test(token)) {
        tipo = 'carácter válido';
        valido = true;
      } else if (/^[0-9]+(\.[0-9]+)?$/.test(token)) {
        tipo = 'número válido';
        valido = true;
      } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
        tipo = 'identificador válido';
        valido = true;
      } else if (/^\.[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
        // Métodos como .toDoub
        tipo = 'método especial';
        valido = metodosEspeciales.has(token.substring(1));
      } else if (/^[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
        // Accesos como numeros.length
        const [_, method] = token.split('.');
        tipo = 'acceso a método';
        valido = metodosEspeciales.has(method);
      } else if (token.includes(':')) {
        // Para parámetros como nombre: String
        const [param, type] = token.split(':');
        tipo = 'parámetro tipado';
        valido = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(param) && tiposDatos.has(type.trim());
      } else {
        tipo = 'token no reconocido';
        valido = false;
        lineaValida = false;
      }

      tbody.innerHTML += `
      <tr>
        <td>${contadorLinea}</td>
        <td>${token}</td>
        <td>${tipo}</td>
        <td>${valido ? '✅' : '❌'}</td>
        <td>${lineaValida ? '✅' : '❌'}</td>
      </tr>
      `;
    }

    tbody.innerHTML += `
    <tr class="${lineaValida ? 'table-success' : 'table-danger'}">
      <td>${contadorLinea}</td>
      <td colspan="3"><strong>Resumen línea ${contadorLinea}</strong></td>
      <td><strong>${lineaValida ? 'Línea válida ✅' : 'Línea inválida ❌'}</strong></td>
    </tr>
    `;
  }
}

