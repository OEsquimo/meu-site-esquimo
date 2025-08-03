document.getElementById("tipo").addEventListener("change", function () {
  const tipo = this.value;
  const btuSection = document.getElementById("btuSection");
  btuSection.style.display = tipo ? "block" : "none";
});

document.getElementById("whatsapp").addEventListener("input", function () {
  let valor = this.value.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);
  if (valor.length > 0) valor = "(" + valor;
  if (valor.length > 3) valor = valor.slice(0, 3) + ") " + valor.slice(3);
  if (valor.length > 10) valor = valor.slice(0, 10) + "-" + valor.slice(10);
  this.value = valor;
});

document.getElementById("botaoOrcamento").addEventListener("click", function () {
  const tipo = document.getElementById("tipo").value;
  const btu = document.getElementById("btu").value;
  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();

  if (!tipo || !btu || !nome || !endereco || !whatsapp) {
    alert("Preencha todos os campos antes de continuar.");
    return;
  }

  const preco = calcularPreco(tipo, btu);

  const mensagem = `Olá, me chamo ${nome}. Gostaria de um orçamento para ${tipo} de ar-condicionado de ${btu} BTUs.
Endereço: ${endereco}
WhatsApp: ${whatsapp}
Valor estimado: R$ ${preco.toFixed(2).replace('.', ',')}`;

  const numero = "5583983259341"; // Substitua pelo seu número com DDD
  const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(link, "_blank");

  document.getElementById("orcamentoResultado").style.display = "block";
  document.getElementById("orcamentoResultado").innerText = `Valor estimado: R$ ${preco.toFixed(2).replace('.', ',')}`;
  document.getElementById("mensagemFinal").innerText = "Seus dados foram enviados. Em breve entraremos em contato pelo WhatsApp.";
});

function calcularPreco(tipo, btu) {
  const tabela = {
    instalacao: { "9000": 250, "12000": 280, "18000": 320, "24000": 350 },
    limpeza: { "9000": 100, "12000": 120, "18000": 140, "24000": 160 },
    manutencao: { "9000": 150, "12000": 180, "18000": 200, "24000": 220 }
  };
  return tabela[tipo][btu];
}
