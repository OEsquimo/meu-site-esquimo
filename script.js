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
    if (btus === "9000") valor = 480,00;
    else if (btus === "12000") valor = 550,00;
    else if (btus === "18000") valor = 600,00;
    else if (btus === "24000") valor = 800,00;
    else if (btus === "30000") valor = 950,00;
  } else if (servico === "Limpeza Split") {
    if (btus === "9000") valor = 180,00;
    else if (btus === "12000") valor = 200,00;
    else if (btus === "18000") valor = 250,00;
    else if (btus === "24000") valor = 350,00;
    else if (btus === "30000") valor = 400,00;
  } else if (servico === "Limpeza Janela") {
    valor = 150,00;
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
  const numero = "5581983259341"; // número do O Esquimó
  const mensagem = encodeURIComponent(relatorioDiv.innerText);
  const url = `https://api.whatsapp.com/send?phone=${numero}&text=${mensagem}`;
  window.open(url, "_blank");
});
