const words =
  "cebola trem estrela vaso plantas de ursinho de pelúcia biscoito perna quando pode ser maior até hoje filme perder estar nem haver o nada usar possível isto sobre sem haver pequeno qualquer dever ajudar problema mulher agora tal eu jogo tipo nome elas fazer social de conseguir vez para trabalhar tão também qual então aquele mulher coisa contra tanto questão para novo palavra serviço esse cidade sem tentar como hora criar dia aquele".split(
    " "
  );

const wordsCount = words.length;
const gameTime = 30 * 1000;
window.gameStart = null

function restartTimer () {
  clearTimeout()
}

function addClass(el,name) {
  el.className += ' '+name;
}
function removeClass(el,name) {
  el.className = el.className.replace(name,'');
}

function randomWords() {
  const randomIndex = Math.ceil(Math.random() * wordsCount);
  return words[randomIndex - 1];
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word
    .split("")
    .join('</span><span class="letter">')}</span></div>`;
}
function newGame() {
  document.getElementById("words").innerHTML = "";
  for (let i = 0; i < 200; i++) {
    document.getElementById("words").innerHTML += formatWord(randomWords());
  }
  addClass(document.querySelector(".word"), "current");
  addClass(document.querySelector(".letter"), "current");
  document.getElementById('info').innerHTML = (gameTime / 1000)
  window.timer = null;
}

function getWpm() {
  const words = [...document.querySelectorAll('.word')]
  const lastTypedWord = document.querySelector('.word.current')
  const lastTypedWordIndex = words.indexOf(lastTypedWord)
  const typedWords =  words.slice(0, lastTypedWordIndex)
  const correctWords = typedWords.filter(words => {
    const letters = [...words.children]
    const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'))
    const correctLetters = letters.filter(letter => letter.className.includes('correct'))
    return incorrectLetters.length === 0 && correctLetters.length === letters.length
  })
  return correctWords.length / gameTime * 60000;
}
function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById('game'), 'over')
  document.getElementById('info').innerHTML = `WPM: ${getWpm()}`;
}

function restartGame () {
  document.getElementById("game").addEventListener("keydown", (ev) => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current')
    const currentLetter = document.querySelector(".letter.current");
    const expected = currentLetter?.innerHTML || " ";
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace'
    const isFirstLetter = currentLetter === currentWord.firstChild;
  
    if (document.querySelector('#game.over')) {
      return;
    }
  
  if(!window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = (new Date()).getTime();
      }
      const currentTime = (new Date()).getTime();
      const msPassed = currentTime - window.gameStart;
      const sPassed = Math.round(msPassed / 1000)
      const sLeft = (gameTime / 1000) - sPassed
      if (sLeft <= 0) {
        gameOver();
        return;
      }
      document.getElementById('info').innerHTML = sLeft + ''
    }, 1000)
  }
  
  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
      removeClass(currentLetter, 'current');
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, 'current');
      }
    } else {
      if (expected !== ' ') {
        if (currentWord.lastChild.className.includes('extra')) {
          currentWord.removeChild(currentWord.lastChild);
        }
        const incorrectLetter = document.createElement('span');
        incorrectLetter.innerHTML = key;
        incorrectLetter.className = 'letter incorrect extra';
        currentWord.appendChild(incorrectLetter);
      }
    }
  }
  
    if (isSpace) {
      if(expected !== '') {
        const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')]
        lettersToInvalidate.forEach(letter => {
          addClass(letter, 'incorrect')
        })
      }
      removeClass(currentWord, 'current')
      addClass(currentWord.nextSibling, 'current')
      if (currentLetter) {
        removeClass(currentLetter, 'current')
      }
      addClass(currentWord.nextSibling.firstChild, 'current')
    }
  
    if (isBackspace) {
      if (currentLetter && isFirstLetter) {
        // fazendo a palavra anterior ser atual, ultima letra atual
        removeClass(currentWord, 'current')
        addClass(currentWord.previousSibling, 'current')
        removeClass(currentLetter, 'current')
        addClass(currentWord.previousSibling.lastChild, 'current')
        removeClass(currentWord.previousSibling.lastChild, 'incorrect')
        removeClass(currentWord.previousSibling.lastChild, 'correct')
      }
      if (currentLetter && !isFirstLetter) {
        // voltando uma letra, invalidando letra
        removeClass(currentLetter, 'current')
        addClass(currentLetter.previousSibling, 'current')
        removeClass(currentLetter.previousSibling, 'incorrect')
        removeClass(currentLetter.previousSibling, 'correct')
      }
      if (!currentLetter) {
        addClass(currentWord.lastChild, 'current')
        removeClass(currentWord.lastChild, 'incorrect')
        removeClass(currentWord.lastChild, 'correct')
      }
    }
  
    // movendo as linhas / palavras
    if (currentWord.getBoundingClientRect().top > 250) {
      const words = document.getElementById('words')
      const margin = parseInt(words.style.marginTop || '0px');
      words.style.marginTop = (margin - 35) + 'px';
  
    }
  
    // movimentando cursor
    const nextLetter = document.querySelector('.letter.current')
    const nextWord = document.querySelector('.word.current')
    const cursor = document.getElementById('cursor')
    cursor.style.transition = 'left .1s ease' 
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect(). top + 2 + 'px'
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px'
  });
  return
}

document.getElementById('newGameBtn').addEventListener('click', () => {
  location.reload()
})
restartGame()
newGame();

// AFAZERES // 
/*
1 - O foco deve começar no texto, e desaparecer após 10 segundos em caso de inatividade
2 - Adicionar um icone ao botão New Game e fazer com que ele não resete a página, mas resete apenas o jogo.
3 - Adicionar transição na carret, entre as letras.
4 - Arrumar o design inteiro do site

//PENSAMENTOS//
Talvez o foco tenha que ser arrumado por inteiro, usando uma função ao invés de fazer tudo no css
Usar o window.onload

Se a proxima letra for space, ultimo parente ! space, não deixa a letra vermelha
*/

// if (nextLetter === space)  