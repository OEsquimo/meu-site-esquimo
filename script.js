const nomeInput = document.getElementById("nome");
const enderecoInput = document.getElementById("endereco");
const whatsappInput = document.getElementById("whatsapp");
const servicoSelect = document.getElementById("servico");
const btusSelect = document.getElementById("btus");
const enviarBtn = document.getElementById("enviarBtn");
const relatorioDiv = document.getElementById("relatorio");

function calcularValor(servico, btus) {
  let valor = 0;

  if (servico === "Instalação") {
    if (btus === "9000") valor = 250;
    else if (btus === "12000") valor = 270;
    else if (btus === "18000") valor = 300;
    else if (btus === "24000") valor = 330;
    else if (btus === "30000") valor = 400;
  } else if (servico === "Limpeza Split") {
    if (btus === "9000") valor = 120;
    else if (btus === "12000") valor = 130;
    else if (btus === "18000") valor = 150;
    else if (btus === "24000") valor = 180;
    else if (btus === "30000") valor = 220;
  } else if (servico === "Limpeza Janela") {
    valor = 100;
  } else if (servico === "Manutenção") {
    valor = 150;
  }

  return valor;
}

function atualizarRelatorio() {
  if (
    nomeInput.value.trim() === "" ||
    enderecoInput.value.trim() === "" ||
    whatsappInput.value.trim() === "" ||
    servicoSelect.value === "" ||
    btusSelect.value === ""
  ) {
    relatorioDiv.innerText = "";
    enviarBtn.disabled = true;
    return;
  }

  const nome = nomeInput.value.trim();
  const endereco = enderecoInput.value.trim();
  const whatsapp = whatsappInput.value.trim();
  const servico = servicoSelect.value;
  const btus = btusSelect.value;
  const valor = calcularValor(servico, btus);

  const mensagem =
    `📋 *Orçamento de Serviço - O Esquimó*\n\n` +
    `👤 Nome: ${nome}\n` +
    `🏠 Endereço: ${endereco}\n` +
    `📱 WhatsApp: ${whatsapp}\n` +
    `🛠️ Serviço: ${servico}\n` +
    `❄️ Capacidade: ${btus} BTUs\n` +
    `💰 Valor do Orçamento: R$ ${valor.toFixed(2)}`;

  relatorioDiv.innerText = mensagem;
  enviarBtn.disabled = false;
}

document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("input", atualizarRelatorio);
  el.addEventListener("change", atualizarRelatorio);
});

enviarBtn.addEventListener("click", () => {
  const numero = "5583983259341"; // número do O Esquimó
  const mensagem = encodeURIComponent(relatorioDiv.innerText);
  const url = `https://api.whatsapp.com/send?phone=${numero}&text=${mensagem}`;
  window.open(url, "_blank");
});
