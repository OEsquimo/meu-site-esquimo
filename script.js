function formatarWhatsApp(input) {
  input.addEventListener('input', function () {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);

    if (valor.length >= 2 && valor.length <= 6)
      input.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    else if (valor.length > 6)
      input.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
  });
}

function validarCampos() {
  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const servico = document.getElementById("servico").value;
  const btus = document.getElementById("btus").value;
  const enviarBtn = document.getElementById("enviarBtn");

  enviarBtn.disabled = !(nome && endereco && whatsapp && servico && btus);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");
  const btus = document.getElementById("btus");
  const orcamentoDiv = document.getElementById("orcamento");
  const mensagem = document.getElementById("mensagemConfirmacao");

  formatarWhatsApp(document.getElementById("whatsapp"));

  document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", validarCampos);
    el.addEventListener("change", validarCampos);
  });

  btus.addEventListener("change", () => {
    const tipo = document.getElementById("servico").value;
    const valor = btus.value;

    if (tipo && valor) {
      const precos = {
        Instalação: { "9000": 250, "12000": 280, "18000": 330, "24000": 380 },
        Limpeza: { "9000": 90, "12000": 100, "18000": 120, "24000": 150 },
        Manutenção: { "9000": 130, "12000": 150, "18000": 170, "24000": 200 }
      };

      const preco = precos[tipo][valor];
      orcamentoDiv.innerHTML = `<strong>Orçamento:</strong> R$ ${preco},00`;
      orcamentoDiv.style.display = "block";
    } else {
      orcamentoDiv.style.display = "none";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();
    const servico = document.getElementById("servico").value;
    const btus = document.getElementById("btus").value;
    const valor = orcamentoDiv.textContent;

    mensagem.style.display = "block";

    const texto = `Olá, sou ${nome}.\nEndereço: ${endereco}\nWhatsApp: ${whatsapp}\nSolicito: ${servico} de ar-condicionado de ${btus} BTUs.\n${valor}`;
    const url = `https://wa.me/5583983259341?text=${encodeURIComponent(texto)}`;

    setTimeout(() => {
      window.open(url, "_blank");
    }, 1000);
  });
});
