/* ==========================================================================
   Estilos para Sistema de Agendamento - O Esquimó v3.2
   ========================================================================== */

/* 1. Global Color and Font Variables */
:root {
  --azul-claro: #6bb9f0;
  --azul-medio: #3498db;
  --azul-escuro: #2c3e50;
  --branco: #ffffff;
  --branco-azulado: #f8fbfe;
  --borda-azulada: #d6e6f2;
  --texto-azulado: #4a6b8a;
  --sombra-leve: 0 4px 12px rgba(107, 185, 240, 0.1);
  --sombra-media: 0 8px 20px rgba(52, 152, 219, 0.15);
  --fonte-principal: 'Poppins', sans-serif;
}

/* 2. Base Reset and Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--fonte-principal);
  line-height: 1.7;
  color: var(--texto-azulado);
  background-color: var(--branco-azulado);
  padding: 20px;
}

/* 3. Main Structure */
.topo img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: var(--sombra-media);
  border: 1px solid var(--borda-azulada);
}

.container {
  max-width: 750px;
  margin: 0 auto 30px;
  background-color: var(--branco);
  padding: 25px;
  border-radius: 12px;
  box-shadow: var(--sombra-leve);
  border: 1px solid var(--borda-azulada);
}

.rodape {
  text-align: center;
  margin-top: 30px;
  font-size: 0.85rem;
  color: var(--azul-medio);
  padding: 12px;
  background-color: var(--branco);
  border-radius: 8px;
  border: 1px solid var(--borda-azulada);
}

/* 4. Step Styles */
.step {
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 1px solid var(--borda-azulada);
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--azul-escuro);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.step-title span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, var(--azul-claro), var(--azul-medio));
  color: var(--branco);
  border-radius: 50%;
  margin-right: 12px;
  font-size: 1rem;
  box-shadow: var(--sombra-leve);
}

/* 5. Services Section - 3 Columns Fixed */
.servicos-imagens {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Fixed 3-column layout */
  gap: 15px;
  width: 100%;
}

.servico {
  text-align: center;
  cursor: pointer;
  padding: 15px;
  border-radius: 10px;
  border: 2px solid var(--borda-azulada);
  transition: all 0.25s ease;
  background-color: var(--branco);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
}

.servico:hover {
  transform: translateY(-3px);
  box-shadow: var(--sombra-media);
  border-color: var(--azul-claro);
}

.servico.selecionado {
  border-color: var(--azul-medio);
  background-color: rgba(107, 185, 240, 0.08);
  box-shadow: 0 0 0 3px rgba(107, 185, 240, 0.15);
}

.servico-img-container {
  width: 100%;
  aspect-ratio: 1/1; /* Square containers */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 8px;
  background-color: rgba(214, 230, 242, 0.3);
}

.servico img {
  width: auto;
  max-width: 90%;
  height: auto;
  max-height: 90%;
  object-fit: contain; /* Ensures full image visibility */
}

.servico p {
  font-weight: 600;
  color: var(--azul-escuro);
  font-size: 0.95rem;
  margin-top: auto; /* Aligns text to bottom */
}

/* 6. Form and Button Styles */
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--azul-escuro);
}

input, select, textarea {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 18px;
  border: 1px solid var(--borda-azulada);
  border-radius: 8px;
  font-size: 1rem;
  font-family: var(--fonte-principal);
  transition: all 0.25s;
  background-color: var(--branco);
  color: var(--azul-escuro);
}

input:focus, select:focus, textarea:focus {
  border-color: var(--azul-claro);
  box-shadow: 0 0 0 3px rgba(107, 185, 240, 0.15);
  outline: none;
}

.final-button {
  background: linear-gradient(135deg, var(--azul-claro), var(--azul-medio));
  color: var(--branco);
  border: none;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  transition: all 0.25s ease;
  margin-top: 20px;
  box-shadow: var(--sombra-leve);
}

.final-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--sombra-media);
}

/* 7. Responsive Adjustments */
@media (max-width: 768px) {
  body {
    padding: 15px;
  }
  
  .topo img {
    height: 180px;
  }
  
  .container {
    padding: 20px;
  }
  
  .servicos-imagens {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .servicos-imagens {
    grid-template-columns: repeat(3, 1fr); /* Maintains 3 columns */
    gap: 8px;
  }
  
  .servico {
    padding: 10px;
  }
  
  .servico p {
    font-size: 0.85rem;
  }
  
  .final-button {
    padding: 12px 16px;
    font-size: 1rem;
  }
}

@media (max-width: 360px) {
  .servicos-imagens {
    gap: 6px;
  }
  
  .servico {
    padding: 8px;
  }
  
  .servico p {
    font-size: 0.8rem;
  }
  
  .step-title {
    font-size: 1.3rem;
  }
}
