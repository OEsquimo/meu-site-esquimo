function hideResponse() {
  responseArea.classList.remove("show");
  // Deixa invisível só depois do tempo da transição para evitar corte brusco
  setTimeout(() => {
    responseArea.classList.add("hidden");
    responseArea.textContent = "";
  }, 500);
}

function showResponse(text) {
  responseArea.textContent = text;
  responseArea.classList.remove("hidden");
  setTimeout(() => {
    responseArea.classList.add("show");
  }, 20);
}

function hideError() {
  errorMsg.classList.remove("show");
  setTimeout(() => {
    errorMsg.classList.add("hidden");
    errorMsg.textContent = "";
  }, 500);
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
  setTimeout(() => {
    errorMsg.classList.add("show");
  }, 20);
}
