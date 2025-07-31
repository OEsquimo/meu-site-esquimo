function handleServiceChange() {
  const service = document.getElementById("service").value;
  const installOptions = document.getElementById("installOptions");
  const responseArea = document.getElementById("responseArea");

  responseArea.style.display = "none";
  responseArea.innerHTML = "";

  if (service === "instalacao") {
    installOptions.classList.remove("hidden");
  } else {
    installOptions.classList.add("hidden");

    if (service === "limpeza") {
      responseArea.innerHTML = "Serviço de limpeza: a partir de R$ 250,00.";
      responseArea.style.display = "block";
    } else if (service === "manutencao") {
      responseArea.innerHTML = "Serviço de manutenção: valor sob avaliação após vistoria.";
      responseArea.style.display = "block";
    }
  }
}

function handleInstallType() {
  const type = document.getElementById("installType").value;
  const responseArea = document.getElementById("responseArea");

  if (type === "Básica") {
    responseArea.innerHTML = "Valor da instalação:\n" +
"2 metros de tubulação.\n" +
"Cabo PP.\n" +
"Esponjoso.\n" +
"Fita PVC.\n" +
"Suporte.\n" +
"Buchas e parafusos.";
    responseArea.style.display = "block";
  } else if (type === "padrao") {
    responseArea.innerHTML = "Valor da instalação: R$ 780,00.";
    responseArea.style.display = "block";
  } else {
    responseArea.style.display = "none";
  }
}
