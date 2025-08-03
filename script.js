// Função para aplicar máscara no WhatsApp
function mascaraWhatsApp(value) {
  // Remove tudo que não for número
  value = value.replace(/\D/g, '');

  // Formata para (XX) XXXXX-XXXX
  if (value.length > 11) value = value.slice(0, 11);

  if (value.length <= 10) {
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else {
    value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
  }

  return value.trim();
}

const form = document.getElementById('formOrcamento');
const tipoServico = document.getElementById('tipoServico');
const limpezaTipoContainer = document.getElementById('limpezaTipoContainer');
const limpezaTipo = document.getElementById('limpezaTipo');
const btuContainer = document.getElementById('btuContainer');
const btu = document.getElementById('btu');
const defeitoContainer = document.getElementById('defeitoContainer');
const defeito = document.getElementById('defeito');
const relatorio = document.getElementById('relatorio');
const relatorioConteudo = document.getElementById('relatorioConteudo');
const mensagemManutencao = document.getElementById('mensagemManutencao');
const btnEnviar = document.getElementById('btnEnviar');
const msgEnvio = document.getElementById('msgEnvio');
const whatsappInput = document.getElementById('whatsapp');

whatsappInput.addEventListener('input', (e) => {
  e.target.value = mascaraWhatsApp(e.target.value);
  validarFormulario();
});

tipoServico.addEventListener('change', () => {
  limparCamposDependentes();

  const tipo = tipoServico.value;

  if (tipo === 'limpeza') {
    limpezaTipoContainer.style.display = 'block';
    btuContainer.style.display = 'none';
    defeitoContainer.style.display = 'none';
    mensagemManutencao.style.display = 'none';
  } else if (tipo === 'instalacao') {
    limpezaTipoContainer.style.display = 'none';
    btuContainer.style.display = 'block';
    defeitoContainer.style.display = 'none';
    mensagemManutencao.style.display = 'none';
  } else if (tipo === 'manutencao') {
    limpezaTipoContainer.style.display = 'none';
    btuContainer.style.display = 'block';
    defeitoContainer.style.display = 'block';
    mensagemManutencao.style.display = 'block';
  } else {
    limpezaTipoContainer.style.display = 'none';
    btuContainer.style.display = 'none';
    defeitoContainer.style.display = 'none';
    mensagemManutencao.style.display = 'none';
  }
  relatorio.style.display = 'none';
  btnEnviar.disabled = true;
});

limpezaTipo.addEventListener('change', () => {
  if (limpezaTipo.value === 'split') {
    btuContainer.style.display = 'block';
  } else {
    btuContainer.style.display = 'none';
    btu.value = '';
  }
  relatorio.style.display = 'none';
  btnEnviar.disabled = true;
});

[btu, defeito, form.nome, form.endereco, form.whatsapp].forEach(el => {
  el.addEventListener('input', validarFormulario);
});

btnEnviar.addEventListener('click', () => {
  if (validarFormulario()) {
    enviarOrcamentoWhatsApp();
  }
});

// Limpa campos dependentes ao trocar o tipo de serviço
function limparCamposDependentes() {
  limpezaTipo.value = '';
  btu.value = '';
  defeito.value = '';
}

function validarFormulario() {
  const nomeValido = form.nome.value.trim().length > 0;
  const enderecoValido = form.endereco.value.trim().length > 0;
  const whatsappValido = validarWhatsApp(form.whatsapp.value.trim());
  const tipo = tipoServico.value;
  let limpezaTipoValido = true;
  let btuValido = true;
  let defeitoValido = true;

  if (!nomeValido || !enderecoValido || !whatsappValido || !tipo) {
    btnEnviar.disabled = true;
    relatorio.style.display = 'none';
    msgEnvio.style.display = 'none';
    return false;
  }

  if (tipo === 'limpeza') {
    if (!limpezaTipo.value) {
      btnEnviar.disabled = true;
      relatorio.style.display = 'none';
      msgEnvio.style.display = 'none';
      return false;
    }
    limpezaTipoValido = true;

    if (limpezaTipo.value === 'split') {
      if (!btu.value) {
        btnEnviar.disabled = true;
        relatorio.style.display = 'none';
        msgEnvio.style.display = 'none';
        return false;
      }
      btuValido = true;
    }
  }

  if (tipo === 'instalacao') {
    if (!btu.value) {
      btnEnviar.disabled = true;
      relatorio.style.display = 'none';
      msgEnvio.style.display = 'none';
      return false;
    }
  }

  if (tipo === 'manutencao') {
    if (!btu.value) {
      btnEnviar.disabled = true;
      relatorio.style.display = 'none';
      msgEnvio.style.display = 'none';
      return false;
    }
    if (defeito.value.trim().length < 3) {
      btnEnviar.disabled = true;
      relatorio.style.display = 'none';
      msgEnvio.style.display = 'none';
      return false;
    }
  }

  btnEnviar.disabled = false;
  gerarRelatorio();
  return true;
}

function validarWhatsApp(tel) {
  // Regex para (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  const regex = /^\d{2} \d{4,5}-\d{4}$/;
  return regex.test(tel);
}

function gerarRelatorio() {
  const nome = form.nome.value.trim();
  const endereco = form.endereco.value.trim();
  const whatsapp = form.whatsapp.value.trim();
  const tipo = tipoServico.value;
  const limpezaTipoVal = limpezaTipo.value;
  const btuVal = btu.value;
  const defeitoVal = defeito.value.trim();

  let precoEstimado = calcularPreco(tipo, limpezaTipoVal, btuVal);

  let textoPreco = precoEstimado !== null ? `R$ ${precoEstimado}` : 'Orçamento sob análise';

  let textoRelatorio = `
    <strong>Nome:</strong> ${nome}<br />
    <strong>Endereço:</strong> ${endereco}<br />
    <strong>WhatsApp:</strong> ${whatsapp}<br />
    <strong>Tipo de serviço:</strong> ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}<br />
  `;

  if (tipo === 'limpeza') {
    textoRelatorio += `<strong>Tipo de limpeza:</strong> ${limpezaTipoVal === 'split' ? 'Split' : 'Janela'}<br />`;
  }

  if (btuVal) {
    textoRelatorio += `<strong>BTUs:</strong> ${parseInt(btuVal).toLocaleString('pt-BR')}<br />`;
  }

  textoRelatorio += `<strong>Preço estimado:</strong> ${textoPreco}<br />
