const nomeInput = document.getElementById("nome");
const telefoneInput = document.getElementById("telefone");
const enderecoInput = document.getElementById("endereco");
const servicoSelect = document.getElementById("servico");
const btuSelect = document.getElementById("btu");
const enviarBtn = document.getElementById("enviar");

function validarCampos() {
  let campos = [
    { campo: nomeInput, nome: "Nome" },
    { campo: telefoneInput, nome: "Telefone" },
    { campo: enderecoInput, nome: "Endereço" },
    { campo: servicoSelect, nome: "Serviço" },
    { campo: btuSelect, nome: "BTU" },
  ];

  for (let item of campos) {
    if (item.campo.value.trim() === "" || item.campo.value === "default") {
      item.campo.classList.add("erro");
      item.campo.placeholder = `Preencha o campo ${item.nome}`;
      item.campo.focus();
      return false; // para no primeiro erro
    } else {
      item.campo.classList.remove("erro");
    }
  }

  return true;
}

enviarBtn.addEventListener("click", function (e) {
  if (!validarCampos()) {
    e.preventDefault(); // impede envio se houver erro
    return;
  }

  // Se chegou aqui, está tudo ok — pode enviar o orçamento
  let nome = nomeInput.value;
  let telefone = telefoneInput.value;
  let endereco = enderecoInput.value;
  let servico = servicoSelect.value;
  let btu = btuSelect.value;

  let mensagem = `Olá! Gostaria de solicitar um orçamento:\n\n` +
    `*Nome:* ${nome}\n` +
    `*Telefone:* ${telefone}\n` +
    `*Endereço:* ${endereco}\n` +
    `*Serviço:* ${servico}\n` +
    `*BTU:* ${btu}`;

  let url = `https://wa.me/5581983259341?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
});
