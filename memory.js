document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('start-game');
    startGameButton.addEventListener('click', startMemoryGame);
});

let score = 0; // Initialize score
let attempts = 0; // Initialize attempts
const scoreElement = document.getElementById('score'); // Get the score element
const attemptsElement = document.getElementById('attempts'); // Get the attempts element

function startMemoryGame() {
   
    const photoSourceSelect = document.getElementById('photo-source');
    const selectedSource = photoSourceSelect.value;

    if (selectedSource === 'random') {
        const randomSource = getRandomPhotoSource();
        fetchPhotos(randomSource);
    } else {
        fetchPhotos(selectedSource);
    }
    score = 0;
    attempts = 0;
    updateScoreAndAttempts(); // Update the displayed score and attempts

   
}
function getRandomPhotoSource() {
    const sources = ['harry-potter', 'dogs', 'country-flags'];
    const randomIndex = Math.floor(Math.random() * sources.length);
    return sources[randomIndex];
}

let characterImages = [];
const defaultCardImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/640px-Card_back_01.svg.png";  // New Line

function fetchPhotos(source) {
    let apiUrl = '';

    switch (source) {
        case 'harry-potter':
            apiUrl = 'https://hp-api.onrender.com/api/characters';
            break;
        case 'dogs':
            apiUrl = 'https://dog.ceo/api/breeds/image/random/8';
            break;
        case 'country-flags':
            apiUrl = 'https://restcountries.com/v3.1/all';
            break;
        default:
            return;
    }

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        characterImages = processData(data, source).slice(0, 8);
        const images = [...characterImages, ...characterImages];
        startMemoryGameWithImages(shuffleArray(images));
    })
    .catch(error => console.error('Error fetching images:', error));
}

function processData(data, source) {
    let imageUrls = [];

    switch (source) {
        case 'harry-potter':
            imageUrls = data.map(character => character.image);
            break;
        case 'dogs':
            imageUrls = data.message;
            break;
        case 'country-flags':
            imageUrls = data.map(country => country.flags.png); // Updated this line to properly get the PNG flags
            break;
    }
    return imageUrls;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startMemoryGameWithImages(images) {
    const gameBoard = document.getElementById('game');
    gameBoard.innerHTML = '';
    gameBoard.classList.remove('face-down');

    for (let i = 0; i < 16; i++) {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.matchId = images[i];
        card.style.backgroundImage = `url(${defaultCardImage})`;  // Updated Line
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    }
}


let flippedCards = [];
let isFlipping = false;


function flipCard() {
    if (isFlipping || this === flippedCards[0]) return;
    this.classList.add('flipped');
    this.style.backgroundImage = `url(${this.dataset.matchId})`;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        isFlipping = true;
        setTimeout(checkForMatch, 1000);
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.matchId === card2.dataset.matchId) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        score += 2; // Award points for a match (adjust as needed)
    } else {
        score -= 1; // Deduct points for a mismatch (adjust as needed)
        setTimeout(() => {
            card1.style.backgroundImage = `url(${defaultCardImage})`;
            card2.style.backgroundImage = `url(${defaultCardImage})`;
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000); // Timing should align with the duration of the CSS flipping animation
    }
    if (document.querySelectorAll('.matched').length === document.querySelectorAll('.memory-card').length) {
        alert('Congratulations! You won the game!');
        resetGame();
    }
 else {
    setTimeout(() => {
        card1.style.backgroundImage = `url(${defaultCardImage})`;
        card2.style.backgroundImage = `url(${defaultCardImage})`;
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }, 1000); // Timing should align with the duration of the CSS flipping animation
}
    attempts++; // Increase the number of attempts on each flip
    updateScoreAndAttempts(); // Update the displayed score and attempts

    flippedCards = [];
    isFlipping = false;
}

function updateScoreAndAttempts() {
    scoreElement.textContent = `Score: ${score}`;
    attemptsElement.textContent = `Attempts: ${attempts}`;
}

function resetGame() {
    const gameBoard = document.getElementById('game');
    gameBoard.innerHTML = '';
    gameBoard.classList.add('face-down');
    flippedCards = [];
    isFlipping = false;
}

