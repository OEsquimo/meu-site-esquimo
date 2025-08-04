const nomeInput = document.getElementById("nome");
const enderecoInput = document.getElementById("endereco");
const whatsappInput = document.getElementById("whatsapp");
const servicoSelect = document.getElementById("servico");
const btusSelect = document.getElementById("btus");
const enviarBtn = document.getElementById("enviarBtn");
const relatorioDiv = document.getElementById("relatorio");

// Função para calcular valor com base no serviço e BTUs
function calcularValor(servico, btus) {
  const base = {
    "Instalação": 150,
    "Limpeza Split": 100,
    "Limpeza Janela": 80,
    "Manutenção": 120
  };

  const multiplicador = {
    "9000": 1,
    "12000": 1.2,
    "18000": 1.4,
    "24000": 1.6,
    "30000": 2
  };

  const valorBase = base[servico] || 0;
  const fator = multiplicador[btus] || 1;
  return valorBase * fator;
}

// Verifica se todos os campos estão preenchidos
function validarCampos() {
  return (
    nomeInput.value.trim() !== "" &&
    enderecoInput.value.trim() !== "" &&
    whatsappInput.value.trim() !== "" &&
    servicoSelect.value !== "" &&
    btusSelect.value !== ""
  );
}

// Atualiza relatório assim que todos os campos forem preenchidos
function atualizarRelatorio() {
  if (!validarCampos()) {
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

// Adiciona ouvintes para atualizar relatório automaticamente
document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("input", atualizarRelatorio);
  el.addEventListener("change", atualizarRelatorio);
});

// Enviar orçamento via WhatsApp (ajuste conforme necessidade)
enviarBtn.addEventListener("click", () => {
  const numero = "5583983259341"; // Número do O Esquimó
  const texto = encodeURIComponent(relatorioDiv.innerText);
  const url = `https://wa.me/${numero}?text=${texto}`;
  window.open(url, "_blank");
});
