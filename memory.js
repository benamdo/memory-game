document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('start-game');
    startGameButton.addEventListener('click', startMemoryGame);
});

function startMemoryGame() {
    const photoSourceSelect = document.getElementById('photo-source');
    const selectedSource = photoSourceSelect.value;

    if (selectedSource === 'random') {
        const randomSource = getRandomPhotoSource();
        fetchPhotos(randomSource);
    } else {
        fetchPhotos(selectedSource);
    }
}

function getRandomPhotoSource() {
    const sources = ['harry-potter', 'dogs', 'country-flags'];
    const randomIndex = Math.floor(Math.random() * sources.length);
    return sources[randomIndex];
}

function fetchPhotos(source) {
    let apiUrl = '';

    switch (source) {
        case 'harry-potter':
            apiUrl = 'https://hp-api.onrender.com/api/characters'; // Example Harry Potter API endpoint
            break;
        case 'dogs':
            apiUrl = 'https://dog.ceo/api/breeds/image/random/8'; // Example Dogs API endpoint
            break;
        case 'country-flags':
            apiUrl = 'https://restcountries.com/v3.1/all'; // Example Country Flags API endpoint
            break;
        default:
            return;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const images = processData(data, source);
            startMemoryGameWithImages(images);
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });
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
            imageUrls = data.map(country => country.flags[16]);
            break;
    }

    // Duplicate and shuffle the image URLs to create pairs for the memory game
    const imagePairs = [...imageUrls, ...imageUrls];
    return shuffleArray(imagePairs);
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

    // Shuffle the images
    images = shuffleArray(images);

    // Create and append 16 cards (8 pairs)
    for (let i = 0; i < 16; i++) {
        const card = document.createElement('div');
        card.classList.add('memory-card', 'flipped');
        card.dataset.card = `card-${i}`;
        card.style.backgroundImage = `url(${images[i]})`;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    }

    setTimeout(() => {
        const allCards = document.querySelectorAll('.memory-card');
        allCards.forEach(card => card.classList.remove('flipped'));
    }, 2000);
}




let flippedCards = [];
let isFlipping = false;

function flipCard() {
    if (isFlipping || this === flippedCards[0]) return;
    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        isFlipping = true;
        setTimeout(checkForMatch, 1000);
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.style.backgroundImage === card2.style.backgroundImage) {
        card1.classList.add('matched');
        card2.classList.add('matched');

        if (document.querySelectorAll('.matched').length === document.querySelectorAll('.memory-card').length) {
            alert('Congratulations! You won the game!');
            resetGame();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    flippedCards = [];
    isFlipping = false;
}

function resetGame() {
    const gameBoard = document.getElementById('game');
    gameBoard.innerHTML = '';
    gameBoard.classList.add('face-down'); // Add the face-down class back
}




