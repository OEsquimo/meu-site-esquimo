const CLEANING_TEXT = `
Limpeza a partir de R$ 180,00.
Pode variar conforme a dificuldade
para retirada do ar-condicionado.
`;

const MAINTENANCE_TEXT = 
  "Serviço de manutenção: valor sob avaliação após vistoria.";

const BASIC_INSTALLATION_TEXT = `
Materiais utilizados:
- 2 metros de tubulação
- Cabo PP
- Esponjoso
- Fita PVC
- Suporte
- Buchas e parafusos
Valor: R$ 480,80
`;

const STANDARD_INSTALLATION_TEXT = "Valor da instalação: R$ 780,00.";

function showResponse(text) {
  const responseArea = document.getElementById("responseArea");
  responseArea.textContent = text;
  responseArea.classList.remove("hidden");

  const whatsappButton = document.getElementById("whatsappButton");
  whatsappButton.classList.remove("hidden");
}

function hideResponse() {
  const responseArea = document.getElementById("responseArea");
  responseArea.classList.add("hidden");
  responseArea.textContent = "";

  const whatsappButton = document.getElementById("whatsappButton");
  whatsappButton.classList.add("hidden");
}

function handleServiceChange() {
  const service = document.getElementById("service").value.toLowerCase();
  const installOptions = document.getElementById("installOptions");

  hideResponse();

  if (service === "instalacao") {
    installOptions.classList.remove("hidden");
  } else {
    installOptions.classList.add("hidden");

    if (service === "limpeza") {
      showResponse(CLEANING_TEXT);
    } else if (service === "manutencao") {
      showResponse(MAINTENANCE_TEXT);
    }
  }
}

function handleInstallType() {
  const type = document.getElementById("installType").value.toLowerCase();

  if (type === "básico") {
    showResponse(BASIC_INSTALLATION_TEXT);
  } else if (type === "padrao") {
    showResponse(STANDARD_INSTALLATION_TEXT);
  } else {
    hideResponse();
  }
}

function sendToWhatsApp() {
  const responseText = document.getElementById("responseArea").textContent;
  const phone = "5581983259341"; // Número do O Esquimó com DDI + DDD
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(responseText)}`;

  window.open(url, '_blank');
}
