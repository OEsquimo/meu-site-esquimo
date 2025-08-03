function formatarWhatsapp(numero) {
  return numero.replace(/\D/g, "").replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
}

document.addEventListener("DOMContentLoaded", () => {
  const nome = document.getElementById("nome");
  const endereco = document.getElementById("endereco");
  const whatsapp = document.getElementById("whatsapp");
  const btus = document.getElementById("btus");
  const resumo = document.getElementById("resumo");
  const enviar = document.getElementById("enviar");

  function validarCampos() {
    if (
      nome.value.trim() &&
      endereco.value.trim() &&
      whatsapp.value.trim().length >= 14 &&
      btus.value !== ""
    ) {
      enviar.disabled = false;
    } else {
      enviar.disabled = true;
    }
  }

  function calcularPreco(btus) {
    const precos = {
      "9000": 150,
      "12000": 180,
      "18000": 220,
      "24000": 260
    };
    return precos[btus] || 0;
  }

  btus.addEventListener("change", () => {
    const valor = calcularPreco(btus.value);
    if (valor > 0) {
      resumo.classList.remove("hidden");
      resumo.innerHTML = `
        <strong>Resumo do orçamento:</strong><br>
        Nome: ${nome.value}<br>
        Endereço: ${endereco.value}<br>
        WhatsApp: ${formatarWhatsapp(whatsapp.value)}<br>
        Serviço: Instalação de ar-condicionado ${btus.value} BTUs<br>
        Valor estimado: R$ ${valor.toFixed(2)}
      `;
    } else {
      resumo.classList.add("hidden");
    }
    validarCampos();
  });

  [nome, endereco, whatsapp].forEach(el => {
    el.addEventListener("input", validarCampos);
  });

  whatsapp.addEventListener("input", () => {
    whatsapp.value = formatarWhatsapp(whatsapp.value);
    validarCampos();
  });

  enviar.addEventListener("click", () => {
    const valor = calcularPreco(btus.value);
    const mensagem = `Olá! Meu nome é ${nome.value}, endereço: ${endereco.value}, WhatsApp: ${whatsapp.value}. Gostaria de agendar uma instalação de ar-condicionado de ${btus.value} BTUs. Valor estimado: R$ ${valor.toFixed(2)}.`;

    const telefoneEsquimo = "5581983259341"; // Número com DDI Brasil
    const url = `https://wa.me/${telefoneEsquimo}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
  });
});
