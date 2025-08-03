document.addEventListener("DOMContentLoaded", function () {
  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const tipoServico = document.getElementById("tipo-servico");
  const btuSelect = document.getElementById("btu");
  const resultado = document.getElementById("resultado");
  const botaoEnviar = document.getElementById("enviar-btn");

  const precos = {
    "Instalação": {
      "9000": 250,
      "12000": 280,
      "18000": 300,
      "24000": 350
    },
    "Limpeza": {
      "9000": 120,
      "12000": 140,
      "18000": 160,
      "24000": 180
    },
    "Manutenção": {
      "9000": 100,
      "12000": 110,
      "18000": 120,
      "24000": 130
    }
  };

  function validarCampos() {
    return (
      nomeInput.value.trim() !== "" &&
      enderecoInput.value.trim() !== "" &&
      whatsappInput.value.trim().length === 15 &&
      tipoServico.value !== "" &&
      btuSelect.value !== ""
    );
  }

  function atualizarOrcamento() {
    const tipo = tipoServico.value;
    const btu = btuSelect.value;

    if (tipo && btu) {
      const valor = precos[tipo][btu];
      resultado.textContent = `Serviço: ${tipo}\nBTUs: ${btu}\nValor: R$ ${valor},00`;
    } else {
      resultado.textContent = "";
    }

    botaoEnviar.disabled = !validarCampos();
  }

  tipoServico.addEventListener("change", atualizarOrcamento);
  btuSelect.addEventListener("change", atualizarOrcamento);

  [nomeInput, enderecoInput, whatsappInput].forEach(input => {
    input.addEventListener("input", atualizarOrcamento);
  });

  whatsappInput.addEventListener("input", function () {
    let v = whatsappInput.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else {
      v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
    whatsappInput.value = v;
  });

  botaoEnviar.addEventListener("click", function () {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsapp = whatsappInput.value.replace(/\D/g, "");
    const tipo = tipoServico.value;
    const btu = btuSelect.value;
    const valor = precos[tipo][btu];

    const mensagem = `Olá, me chamo ${nome} e gostaria de solicitar um orçamento.\n\n` +
      `Serviço: ${tipo}\nBTUs: ${btu}\nEndereço: ${endereco}\nValor estimado: R$ ${valor},00`;

    const numeroDestino = "5583983259341";
    const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  });
});
