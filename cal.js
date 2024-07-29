document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.button, .button-wide');
  const display = document.getElementById('display');
  const history = document.getElementById('history');
  const clearHistoryButton = document.getElementById('clear-history');
  const customizeButton = document.getElementById('customize-button');
  const modal = document.getElementById('customization-modal');
  const closeModal = document.querySelector('.close');
  const backgroundImageInput = document.getElementById('background-image');
  const applyCustomizationButton = document.getElementById('apply-customization');
  const calculatorBackgroundInput = document.getElementById('calculator-background');
  let currentInput = '';
  let historyContent = [];
  let soundInterval;

  const buttonSound = new Audio('click.mp3');
  buttonSound.preload = 'auto';

  function playSound() {
      buttonSound.currentTime = 0; // Reset sound to start
      buttonSound.play().catch(error => console.error('Audio play error:', error));
  }

  function startPlayingSound() {
      if (!soundInterval) {
          soundInterval = setInterval(playSound, 100); // Play sound every 100ms
      }
  }

  function stopPlayingSound() {
      clearInterval(soundInterval);
      soundInterval = null;
  }

  buttons.forEach(button => {
      button.addEventListener('click', () => {
          handleButtonClick(button.textContent);
          playSound();
      });
  });

  clearHistoryButton.addEventListener('click', () => {
      historyContent = [];
      history.innerHTML = '';
      playSound();
  });

  customizeButton.addEventListener('click', () => {
      modal.style.display = 'flex';
  });

  closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
  });

  applyCustomizationButton.addEventListener('click', () => {
      const backgroundImageUrl = backgroundImageInput.value;
      document.body.style.backgroundImage = `url(${backgroundImageUrl})`;

      const calculatorBackgroundColor = calculatorBackgroundInput.value;
      document.querySelector('.calculator').style.backgroundColor = calculatorBackgroundColor;

      modal.style.display = 'none';
  });

  document.addEventListener('keydown', (event) => {
      const key = event.key;
      if ((key >= '0' && key <= '9') || key === '.' || key === '/' || key === '*' || key === '-' || key === '+') {
          handleButtonClick(key);
          startPlayingSound();
      } else if (key === 'Enter') {
          handleButtonClick('=');
          startPlayingSound();
      } else if (key === 'Backspace') {
          currentInput = currentInput.slice(0, -1);
          display.value = currentInput;
          startPlayingSound();
      }
  });

  document.addEventListener('keyup', (event) => {
      stopPlayingSound();
  });

  function handleButtonClick(value) {
      if (value === 'C') {
          currentInput = '';
          display.value = currentInput;
      } else if (value === '=' || value === 'Enter') {
          try {
              const result = eval(currentInput);
              historyContent.push(`<div class="history-item">${currentInput} = ${result}</div>`);
              updateHistory();
              currentInput = result.toString();
          } catch {
              currentInput = 'Error';
          }
          display.value = currentInput;
      } else if (['sin', 'cos', 'tan', 'log', '√', 'x²'].includes(value)) {
          try {
              const result = handleScientificFunction(value, parseFloat(currentInput));
              historyContent.push(`<div class="history-item">${value}(${currentInput}) = ${result}</div>`);
              updateHistory();
              currentInput = result.toString();
          } catch {
              currentInput = 'Error';
          }
          display.value = currentInput;
      } else {
          currentInput += value;
          display.value = currentInput;
      }
  }

  function handleScientificFunction(func, value) {
      switch (func) {
          case 'sin':
              return Math.sin(value);
          case 'cos':
              return Math.cos(value);
          case 'tan':
              return Math.tan(value);
          case 'log':
              return Math.log10(value);
          case '√':
              return Math.sqrt(value);
          case 'x²':
              return Math.pow(value, 2);
          default:
              return value;
      }
  }

  function updateHistory() {
      history.innerHTML = historyContent.join('<br>');
  }

  history.addEventListener('click', (event) => {
      if (event.target.classList.contains('history-item')) {
          const result = event.target.textContent.split('=')[1].trim();
          currentInput = result;
          display.value = currentInput;
          playSound();
      }
  });
});
