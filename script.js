document.addEventListener('DOMContentLoaded', function () {
  const tipoServico = document.getElementById('tipo');
  const btusDiv = document.getElementById('btusDiv');
  const manutencaoDiv = document.getElementById('manutencaoDiv');
  const valorDiv = document.getElementById('valor');
  const form = document.getElementById('agendamentoForm');
  const mensagemDiv = document.getElementById('mensagem');

  tipoServico.addEventListener('change', function () {
    const tipo = tipoServico.value;
    btusDiv.classList.add('hidden');
    manutencaoDiv.classList.add('hidden');
    valorDiv.textContent = "";
    mensagemDiv.textContent = "";

    if (tipo === 'instalacao') {
      btusDiv.classList.remove('hidden');
    } else if (tipo === 'manutencao') {
      manutencaoDiv.classList.remove('hidden');
    }
  });

  document.getElementById('btus').addEventListener('change', atualizarValor);
  document.getElementById('tipoManutencao').addEventListener('change', atualizarValor);

  function atualizarValor() {
    let valor = "";
    const tipo = tipoServico.value;

    if (tipo === 'instalacao') {
      const btus = document.getElementById('btus').value;
      if (btus === '9000') valor = "R$ 180,00";
      else if (btus === '12000') valor = "R$ 200,00";
      else if (btus === '18000') valor = "R$ 250,00";
      else if (btus === '24000') valor = "R$ 300,00";
    }

    if (tipo === 'manutencao') {
      const tipoManutencao = document.getElementById('tipoManutencao').value;
      if (tipoManutencao === 'simples') valor = "R$ 80,00";
      else if (tipoManutencao === 'completa') valor = "R$ 130,00";
    }

    valorDiv.textContent = valor ? `Valor estimado do serviço:\n${valor}` : "";
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    mensagemDiv.textContent = "";

    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const tipo = tipoServico.value;
    const btus = document.getElementById('btus').value;
    const tipoManutencao = document.getElementById('tipoManutencao').value;
    const pagamento = document.getElementById('pagamento').value;
    const valorTexto = valorDiv.textContent.replace("Valor estimado do serviço:\n", "").trim();

    if (!nome || !telefone || !endereco || !tipo || !pagamento) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    let servico = "";
    if (tipo === 'instalacao') {
      if (!btus) {
        alert('Selecione a capacidade em BTUs!');
        return;
      }
      servico = `Instalação de ar ${btus} BTUs`;
    } else if (tipo === 'manutencao') {
      if (!tipoManutencao) {
        alert('Selecione o tipo de manutenção!');
        return;
      }
      servico = `Manutenção ${tipoManutencao}`;
    }

    const dados = {
      nome,
      telefone,
      endereco,
      servico,
      valor: valorTexto,
      pagamento,
      data: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0,5)
    };

    try {
      const res = await fetch('http://localhost:5000/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      const resultado = await res.json();

      if (resultado.status === 'sucesso') {
        const numeroDestino = '5581983259341';
        const texto = `*Novo agendamento - O Esquimó*%0A` +
                      `*Nome:* ${nome}%0A` +
                      `*WhatsApp:* ${telefone}%0A` +
                      `*Endereço:* ${endereco}%0A` +
                      `*Serviço:* ${servico}%0A` +
                      `*Valor:* ${valorTexto}%0A` +
                      `*Forma de pagamento:* ${pagamento}%0A` +
                      `*Data:* ${dados.data}%0A` +
                      `*Hora:* ${dados.hora}%0A`;

        window.open(`https://wa.me/${numeroDestino}?text=${texto}`, '_blank');

        mensagemDiv.style.color = 'green';
        mensagemDiv.textContent = "Agendamento confirmado! WhatsApp aberto para envio.";
        form.reset();
        btusDiv.classList.add('hidden');
        manutencaoDiv.classList.add('hidden');
        valorDiv.textContent = "";
      } else {
        mensagemDiv.style.color = 'red';
        mensagemDiv.textContent = resultado.mensagem || "Erro ao salvar agendamento.";
      }
    } catch (error) {
      mensagemDiv.style.color = 'red';
      mensagemDiv.textContent = "Erro de conexão com o servidor.";
      console.error(error);
    }
  });
});
