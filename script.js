function gerarOrcamento() {
  const servico = document.getElementById("servico").value;
  const descricao = document.getElementById("descricao").value.trim();
  const responseArea = document.getElementById("responseArea");
  const btnEnviar = document.getElementById("btnEnviar");

  if (!servico) {
    alert("Por favor, selecione um serviço.");
    return;
  }

  let texto = `Orçamento solicitado:\nServiço: ${servico}`;

  if (descricao) {
    texto += `\nDescrição: ${descricao}`;
  }

  // Preços baseados no serviço
  switch(servico.toLowerCase()) {
    case "instalação":
      texto += "\n\nValor estimado:\n- Instalação básica a partir de R$ 480,00";
      break;
    case "limpeza":
      texto += "\n\nValor estimado:\n- Limpeza a partir de R$ 180,00, dependendo da dificuldade.";
      break;
    case "manutenção":
      texto += "\n\nValor estimado:\n- Manutenção sob avaliação após vistoria.";
      break;
  }

  responseArea.textContent = texto;
  responseArea.classList.remove("hidden");
  btnEnviar.classList.remove("hidden");
}

function enviarParaWhatsApp() {
  const telefoneInput = document.getElementById("whatsapp").value;
  const telefone = telefoneInput.replace(/\D/g, ""); // Remove qualquer caractere que não seja número

  if (telefone.length < 10) {
    alert("Por favor, insira um número de WhatsApp válido com DDD.");
    return;
  }

  const responseText = document.getElementById("responseArea").textContent;
  const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(responseText)}`;
  window.open(url, "_blank");
}
