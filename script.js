const form = document.getElementById("orcamentoForm");
const orcamentoResultado = document.getElementById("orcamentoResultado");
const telefoneInput = document.getElementById("telefone");

function aplicarMascaraTelefone(value) {
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length > 6) {
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  } else if (v.length > 2) {
    return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  } else if (v.length > 0) {
    return `(${v}`;
  }
  return "";
}

telefoneInput.addEventListener("input", (e) => {
  e.target.value = aplicarMascaraTelefone(e.target.value);
});

function validarTelefone(tel) {
  const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
  return regex.test(tel);
}

function calcularPreco(btu) {
  if (btu <= 9000) return 480;
  if (btu <= 12000) return 550;
  if (btu <= 18000) return 750;
  if (btu <= 24000) return 950;
  if (btu <= 30000) return 1150;
  if (btu <= 36000) return 1350;
  let extra = btu - 36000;
  let adicional = Math.ceil(extra / 6000) * 200;
  return 1350 + adicional;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const btusStr = document.getElementById("btus").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !endereco || !btusStr || !telefone) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (!validarTelefone(telefone)) {
    alert("Telefone inválido. Use o formato (XX) XXXXX-XXXX");
    return;
  }

  let btuNum = parseInt(btusStr.replace(/\D/g, ""));
  if (isNaN(btuNum)) {
    alert("Informe um valor numérico válido para BTUs.");
    return;
  }

  const preco = calcularPreco(btuNum);

  const orcamentoTexto =
    `🧊 *O Esquimó - Orçamento Técnico* 🧊\n\n` +
    `👤 *Cliente:* ${nome}\n` +
    `📍 *Endereço:* ${endereco}\n` +
    `❄️ *Capacidade (BTUs):* ${btuNum}\n` +
    `🔧 *Valor da instalação:* R$ ${preco.toFixed(2).replace(".", ",")}\n\n` +
    `🔌 *Disjuntor não incluso.*\n` +
    `💡 *Instalação do disjuntor (opcional): R$ 80,00 (até 2 metros de cabo).* \n` +
    `⚠️ *Obs: valores podem variar conforme infraestrutura do local.*`;

  orcamentoResultado.textContent = orcamentoTexto;

  const telefoneCliente = telefone.replace(/\D/g, "");
  const numeroWellington = "5581983259341";

  const urlCliente = `https://wa.me/55${telefoneCliente}?text=${encodeURIComponent(orcamentoTexto)}`;
  const urlWellington = `https://wa.me/${numeroWellington}?text=${encodeURIComponent(orcamentoTexto)}`;

  window.open(urlCliente, "_blank");
  setTimeout(() => {
    window.open(urlWellington, "_blank");
  }, 700);
});
