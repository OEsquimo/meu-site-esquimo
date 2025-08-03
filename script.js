// Máscara para WhatsApp (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
function mascaraWhatsApp(value) {
  value = value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  if (value.length <= 10) {
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else {
    value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
  }
  return value.trim();
}

// Elementos
const form = document.getElementById('formOrcamento');
const nomeInput = form.nome;
const enderecoInput = form.endereco;
const whatsappInput = form.whatsapp;
const tipoServico = form.tipoServico;
const limpezaTipoContainer = document.getElementById('limpezaTipoContainer');
const limpezaTipo = form.limpezaTipo;
const btuContainer = document.getElementById('btuContainer');
const btu = form.btu;
const defeitoContainer = document.getElementById('defeitoContainer');
const defeito = form.defeito;
const mensagemManutencao = document.getElementById('mensagemManutencao');
const relatorio = document.getElementById('relatorio');
const relatorioConteudo = document.getElementById('relatorioConteudo');
const msgEnvio = document.getElementById('msgEnvio');
const btnEnviar = document.getElementById('btnEnviar');

// Eventos
whatsappInput.addEventListener('input', (e) => {
  e.target.value = mascaraWhatsApp(e.target.value);
  validarFormulario();
});

tipoServico.addEventListener('change', () => {
  limpezaTipo.value = '';
  btu.value = '';
  defeito.value = '';

  const tipo = tipoServico.value;

  if (tipo === 'limpeza') {
    limpezaTipoContainer.classList.remove('oculto');
    btuContainer.classList.add('oculto');
    defeitoContainer.classList.add('oculto');
    mensagemManutencao.classList.add('oculto');
  } else if (tipo === 'instalacao') {
    limpezaTipoContainer.classList.add('oculto');
    btuContainer.classList.remove('oculto');
    defeitoContainer.classList.add('oculto');
    mensagemManutencao.classList.add('oculto');
  } else if (tipo === 'manutencao') {
    limpezaTipoContainer.classList.add('oculto');
    btuContainer.classList.remove('oculto');
    defeitoContainer.classList.remove('oculto');
    mensagemManutencao.classList.remove('oculto');
  } else {
    limpezaTipoContainer.classList.add('oculto');
    btuContainer.classList.add('oculto');
    defeitoContainer.classList.add('oculto');
    mensagemManutencao.classList.add('oculto');
  }

  relatorio.classList.add('oculto');
  msgEnvio.classList.add('oculto');
  btnEnviar.disabled = true;
});

limpezaTipo.addEventListener('change', () => {
  if (limpezaTipo.value === 'split') {
    btuContainer.classList.remove('oculto');
  } else {
    btuContainer.classList.add('oculto');
    btu.value = '';
  }

  relatorio.classList.add('oculto');
  msgEnvio.classList.add('oculto');
  btnEnviar.disabled = true;
});

[nomeInput, enderecoInput, whatsappInput, tipoServico, limpezaTipo, btu, defeito].forEach(el => {
  el.addEventListener('input', validarFormulario);
});

btnEnviar.addEventListener('click', () => {
  if (validarFormulario()) {
    enviarOrcamentoWhatsApp();
  }
});

// Funções

function validarWhatsApp(tel) {
  const regex = /^\d{2} \d{4,5}-\d{4}$/;
  return regex.test(tel);
}

function validarFormulario() {
  const nomeValido = nomeInput.value.trim().length > 0;
  const enderecoValido = enderecoInput.value.trim().length > 0;
  const whatsappValido = validarWhatsApp(whatsappInput.value.trim());
  const tipo = tipoServico.value;

  if (!nomeValido || !enderecoValido || !whatsappValido || !tipo) {
    btnEnviar.disabled = true;
    relatorio.classList.add('oculto');
    msgEnvio.classList.add('oculto');
    return false;
  }

  if (tipo === 'limpeza') {
    if (!limpezaTipo.value) {
      btnEnviar.disabled = true;
      relatorio.classList.add('oculto');
      msgEnvio.classList.add('oculto');
      return false;
    }
    if (limpezaTipo.value === 'split' && !btu.value) {
      btnEnviar.disabled = true;
      relatorio.classList.add('oculto');
      msgEnvio.classList.add('oculto');
      return false;
    }
  }

  if ((tipo === 'instalacao' || tipo === 'manutencao') && !btu.value) {
    btnEnviar.disabled = true;
    relatorio.classList.add('oculto');
    msgEnvio.classList.add('oculto');
    return false;
  }

  if (tipo === 'manutencao' && defeito.value.trim().length < 3) {
    btnEnviar.disabled = true;
    relatorio.classList.add('oculto');
    msgEnvio.classList.add('oculto');
    return false;
  }

  btnEnviar.disabled = false;
  gerarRelatorio();
  return true;
}

function calcularPreco(tipo, limpezaTipoVal, btuVal) {
  const precosInstalacao = {
    '9000': 500,
    '12000': 600,
    '18000': 700,
    '24000': 800,
    '30000': 900
  };

  const precosLimpezaSplit = {
    '9000': 180,
    '12000': 230,
    '18000': 280,
    '24000': 330,
    '30000': 380
  };

  if (tipo === 'instalacao') {
    return precosInstalacao[btuVal] || null;
  } else if (tipo === 'limpeza') {
    if (limpezaTipoVal === 'split') {
      return precosLimpezaSplit[btuVal] || null;
    } else if (limpezaTipoVal === 'janela') {
      return 150;
    }
  }

  return null;
}

function gerarRelatorio() {
  const nome = nomeInput.value.trim();
  const endereco = enderecoInput.value.trim();
  const whatsapp = whatsappInput.value.trim();
  const tipo = tipoServico.value;
  const limpezaTipoVal = limpezaTipo.value;
  const btuVal = btu.value;
  const defeitoVal = defeito.value.trim();

  const precoEstimado = calcularPreco(tipo, limpezaTipoVal, btuVal);
  const textoPreco = precoEstimado !== null ? `R$ ${precoEstimado.toFixed(2).replace('.', ',')}` : 'Orçamento sob análise';

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

  textoRelatorio += `<strong>Preço estimado:</strong> ${textoPreco}<br />`;

  if (tipo === 'manutencao') {
    textoRelatorio += `<strong>Descrição do defeito:</strong> ${defeitoVal}<br />`;
  }

  relatorioConteudo.innerHTML = textoRelatorio;
  relatorio.classList.remove('oculto');
  msgEnvio.classList.remove('oculto');
}

function enviarOrcamentoWhatsApp() {
  const nome = nomeInput.value.trim();
  const endereco = enderecoInput.value.trim();
  const whatsappCliente = whatsappInput.value.trim();
  const tipo = tipoServico.value;
  const limpezaTipoVal = limpezaTipo.value;
  const btuVal = btu.value;
  const defeitoVal = defeito.value.trim();

  const precoEstimado = calcularPreco(tipo, limpezaTipoVal, btuVal);
  const textoPreco = precoEstimado !== null ? `R$ ${precoEstimado.toFixed(2).
