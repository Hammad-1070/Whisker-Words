// WhiskerWords Game Logic

class WhiskerWordsGame {
    constructor() {
        this.gameData = {
            categories: {
                countries: ["ARGENTINA", "AUSTRALIA", "BRAZIL", "CANADA", "CHINA", "DENMARK", "EGYPT", "FRANCE", "GERMANY", "INDIA", "ITALY", "JAPAN", "MEXICO", "NORWAY", "PAKISTAN", "RUSSIA", "SPAIN", "TURKEY", "UKRAINE", "VIETNAM"],
                landmarks: ["EIFFEL TOWER", "STATUE OF LIBERTY", "TAJ MAHAL", "COLOSSEUM", "BIG BEN", "PYRAMIDS", "STONEHENGE", "MOUNT RUSHMORE", "GOLDEN GATE BRIDGE", "SYDNEY OPERA HOUSE", "GREAT WALL", "LEANING TOWER", "MACHU PICCHU", "CHRIST REDEEMER", "ACROPOLIS"],
                movies: ["STAR WARS", "TITANIC", "THE GODFATHER", "JURASSIC PARK", "AVATAR", "THE LION KING", "FINDING NEMO", "HARRY POTTER", "AVENGERS", "FORREST GUMP", "THE MATRIX", "JAWS", "CASABLANCA", "ROCKY", "BATMAN"],
                actors: ["KEANU REEVES", "MORGAN FREEMAN", "LEONARDO DICAPRIO", "SCARLETT JOHANSSON", "ROBERT DOWNEY JR", "BRAD PITT", "ANGELINA JOLIE", "TOM CRUISE", "WILL SMITH", "JOHNNY DEPP", "MERYL STREEP", "JENNIFER LAWRENCE", "RYAN GOSLING", "EMMA STONE", "CHRIS EVANS"],
                historical: ["ABRAHAM LINCOLN", "NAPOLEON", "GANDHI", "EINSTEIN", "CHURCHILL", "CLEOPATRA", "JULIUS CAESAR", "MARTIN LUTHER KING", "ISAAC NEWTON", "LEONARDO DA VINCI", "MARIE CURIE", "BEETHOVEN", "SHAKESPEARE", "TESLA", "EDISON"],
                athletes: ["MUHAMMAD ALI", "MICHAEL JORDAN", "SERENA WILLIAMS", "USAIN BOLT", "LIONEL MESSI", "CRISTIANO RONALDO", "TIGER WOODS", "MICHAEL PHELPS", "KOBE BRYANT", "LEBRON JAMES", "ROGER FEDERER", "SIMONE BILES", "WAYNE GRETZKY", "TOM BRADY", "BABE RUTH"],
                quotes: ["CARPE DIEM", "JUST DO IT", "TO BE OR NOT TO BE", "I HAVE A DREAM", "THINK DIFFERENT", "STAY HUNGRY", "BE YOURSELF", "NEVER GIVE UP", "FOLLOW YOUR HEART", "LIVE LAUGH LOVE", "DREAM BIG", "SEIZE THE DAY", "BELIEVE IN YOURSELF", "MAKE IT HAPPEN", "STAY STRONG"],
                gaming: ["NOOB", "PWNED", "RESPAWN", "CAMPING", "GRINDING", "LOOT", "BOSS FIGHT", "LEVEL UP", "POWER UP", "GAME OVER", "HIGH SCORE", "SPEED RUN", "MULTIPLAYER", "SINGLE PLAYER", "ACHIEVEMENT"]
            }
        };

        this.gameState = {
            currentScreen: 'welcome-screen',
            selectedMode: null,
            selectedCategory: null,
            currentWord: '',
            guessedLetters: [],
            correctLetters: [],
            wrongLetters: [],
            livesRemaining: 6,
            wordsCompleted: 0,
            maxWords: 10,
            maxMistakes: 6,
            soundEnabled: true,
            usedWords: [],
            hintsUsed: 0,
            extraLifeUsed: false
        };

        // Ensure DOM is fully loaded before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('WhiskerWords Game Initializing...');
        this.setupEventListeners();
        this.createAlphabet();
        this.showScreen('welcome-screen');
        console.log('Game initialized successfully!');
    }

    setupEventListeners() {
        // Welcome screen - with multiple fallback methods
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Start button clicked!');
                this.showScreen('main-menu');
            });
            
            // Fallback for touch devices
            startBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                console.log('Start button touched!');
                this.showScreen('main-menu');
            });
        }

        // Main menu
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                console.log('Play button clicked!');
                this.showScreen('mode-selection');
            });
        }

        const howToPlayBtn = document.getElementById('how-to-play-btn');
        if (howToPlayBtn) {
            howToPlayBtn.addEventListener('click', () => {
                this.showScreen('how-to-play');
            });
        }

        const creditsBtn = document.getElementById('credits-btn');
        if (creditsBtn) {
            creditsBtn.addEventListener('click', () => {
                this.showScreen('credits-screen');
            });
        }

        // Sound toggle
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                this.toggleSound();
            });
        }

        const gameSoundToggle = document.getElementById('game-sound-toggle');
        if (gameSoundToggle) {
            gameSoundToggle.addEventListener('click', () => {
                this.toggleSound();
            });
        }

        // Mode selection
        const onlineMode = document.getElementById('online-mode');
        if (onlineMode) {
            onlineMode.addEventListener('click', () => {
                this.gameState.selectedMode = 'online';
                this.showScreen('category-selection');
            });
        }

        const offlineMode = document.getElementById('offline-mode');
        if (offlineMode) {
            offlineMode.addEventListener('click', () => {
                this.gameState.selectedMode = 'offline';
                this.showScreen('category-selection');
            });
        }

        const backToMenu = document.getElementById('back-to-menu');
        if (backToMenu) {
            backToMenu.addEventListener('click', () => {
                this.showScreen('main-menu');
            });
        }

        // Category selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.gameState.selectedCategory = category;
                console.log('Selected category:', category);
                this.startGame();
            });
        });

        const backToMode = document.getElementById('back-to-mode');
        if (backToMode) {
            backToMode.addEventListener('click', () => {
                this.showScreen('mode-selection');
            });
        }

        // Game controls
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                this.useHint();
            });
        }

        const watchAdBtn = document.getElementById('watch-ad-btn');
        if (watchAdBtn) {
            watchAdBtn.addEventListener('click', () => {
                this.watchAd();
            });
        }

        const quitGame = document.getElementById('quit-game');
        if (quitGame) {
            quitGame.addEventListener('click', () => {
                this.resetGame();
                this.showScreen('main-menu');
            });
        }

        // Victory screen
        const playAgain = document.getElementById('play-again');
        if (playAgain) {
            playAgain.addEventListener('click', () => {
                this.resetGame();
                this.showScreen('category-selection');
            });
        }

        const victoryMenu = document.getElementById('victory-menu');
        if (victoryMenu) {
            victoryMenu.addEventListener('click', () => {
                this.resetGame();
                this.showScreen('main-menu');
            });
        }

        // Defeat screen
        const tryAgain = document.getElementById('try-again');
        if (tryAgain) {
            tryAgain.addEventListener('click', () => {
                this.gameState.wordsCompleted = 0;
                this.gameState.usedWords = [];
                this.startGame();
            });
        }

        const defeatMenu = document.getElementById('defeat-menu');
        if (defeatMenu) {
            defeatMenu.addEventListener('click', () => {
                this.resetGame();
                this.showScreen('main-menu');
            });
        }

        // Info screens
        const backFromHelp = document.getElementById('back-from-help');
        if (backFromHelp) {
            backFromHelp.addEventListener('click', () => {
                this.showScreen('main-menu');
            });
        }

        const backFromCredits = document.getElementById('back-from-credits');
        if (backFromCredits) {
            backFromCredits.addEventListener('click', () => {
                this.showScreen('main-menu');
            });
        }
    }

    showScreen(screenId) {
        console.log('Showing screen:', screenId);
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show selected screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.gameState.currentScreen = screenId;

            // Add fade-in animation
            targetScreen.classList.add('fade-in');
            setTimeout(() => {
                targetScreen.classList.remove('fade-in');
            }, 500);
            
            console.log('Screen shown successfully:', screenId);
        } else {
            console.error('Screen not found:', screenId);
        }
    }

    createAlphabet() {
        const alphabetGrid = document.getElementById('alphabet-grid');
        if (!alphabetGrid) return;
        
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        alphabetGrid.innerHTML = '';
        
        for (let letter of letters) {
            const button = document.createElement('button');
            button.className = 'letter-btn';
            button.textContent = letter;
            button.dataset.letter = letter;
            button.addEventListener('click', () => this.guessLetter(letter));
            alphabetGrid.appendChild(button);
        }
    }

    startGame() {
        console.log('Starting game with category:', this.gameState.selectedCategory);
        this.resetGameState();
        this.selectNewWord();
        this.updateGameDisplay();
        this.resetAlphabet();
        this.showScreen('game-screen');
    }

    resetGameState() {
        this.gameState.guessedLetters = [];
        this.gameState.correctLetters = [];
        this.gameState.wrongLetters = [];
        this.gameState.livesRemaining = this.gameState.maxMistakes;
        this.gameState.hintsUsed = 0;
        this.gameState.extraLifeUsed = false;
        
        // Hide watch ad button
        const watchAdBtn = document.getElementById('watch-ad-btn');
        if (watchAdBtn) {
            watchAdBtn.classList.add('hidden');
        }
        
        // Reset cat state
        const gameCat = document.getElementById('game-cat');
        if (gameCat) {
            gameCat.className = 'game-cat';
        }
    }

    resetGame() {
        this.gameState.wordsCompleted = 0;
        this.gameState.usedWords = [];
        this.gameState.selectedCategory = null;
        this.gameState.selectedMode = null;
        this.resetGameState();
    }

    selectNewWord() {
        const categoryWords = this.gameData.categories[this.gameState.selectedCategory];
        let availableWords = categoryWords.filter(word => !this.gameState.usedWords.includes(word));
        
        if (availableWords.length === 0) {
            // If all words used, reset the used words array
            this.gameState.usedWords = [];
            availableWords = [...categoryWords];
        }
        
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        this.gameState.currentWord = availableWords[randomIndex];
        this.gameState.usedWords.push(this.gameState.currentWord);
        
        console.log('Selected word:', this.gameState.currentWord);
        this.createWordBlanks();
    }

    createWordBlanks() {
        const wordBlanks = document.getElementById('word-blanks');
        if (!wordBlanks) return;
        
        wordBlanks.innerHTML = '';
        
        for (let char of this.gameState.currentWord) {
            const blank = document.createElement('div');
            blank.className = char === ' ' ? 'letter-blank space' : 'letter-blank';
            blank.dataset.letter = char;
            
            if (char === ' ') {
                blank.textContent = '';
            }
            
            wordBlanks.appendChild(blank);
        }
    }

    guessLetter(letter) {
        if (this.gameState.guessedLetters.includes(letter)) {
            return;
        }

        console.log('Guessing letter:', letter);
        this.gameState.guessedLetters.push(letter);
        
        // Disable button
        const button = document.querySelector(`[data-letter="${letter}"]`);
        if (button) {
            button.disabled = true;
        }

        if (this.gameState.currentWord.includes(letter)) {
            // Correct guess
            this.gameState.correctLetters.push(letter);
            this.handleCorrectGuess(letter, button);
        } else {
            // Wrong guess
            this.gameState.wrongLetters.push(letter);
            this.handleWrongGuess(letter, button);
        }

        this.updateGameDisplay();
        this.checkGameState();
    }

    handleCorrectGuess(letter, button) {
        if (button) {
            button.classList.add('correct');
        }
        this.playSound('correct');
        this.animateCat('happy');
        
        // Fill in the letter
        const blanks = document.querySelectorAll('.letter-blank');
        blanks.forEach(blank => {
            if (blank.dataset.letter === letter) {
                blank.textContent = letter;
                blank.style.animation = 'slideUp 0.3s ease-out';
            }
        });
    }

    handleWrongGuess(letter, button) {
        if (button) {
            button.classList.add('wrong');
        }
        this.gameState.livesRemaining--;
        this.playSound('wrong');
        this.animateCat('sad');
        
        // Show watch ad button after 4 mistakes
        if (this.gameState.livesRemaining === 2 && !this.gameState.extraLifeUsed) {
            const watchAdBtn = document.getElementById('watch-ad-btn');
            if (watchAdBtn) {
                watchAdBtn.classList.remove('hidden');
            }
        }
        
        // Add danger animation when close to losing
        if (this.gameState.livesRemaining <= 2) {
            const gameCat = document.getElementById('game-cat');
            if (gameCat) {
                gameCat.classList.add('danger');
            }
        }
    }

    useHint() {
        if (this.gameState.livesRemaining <= 0) return;
        
        // Find an unguessed letter that's in the word
        const unguessedLetters = [];
        for (let char of this.gameState.currentWord) {
            if (char !== ' ' && !this.gameState.guessedLetters.includes(char)) {
                unguessedLetters.push(char);
            }
        }
        
        if (unguessedLetters.length === 0) return;
        
        // Use one life for the hint
        this.gameState.livesRemaining--;
        this.gameState.hintsUsed++;
        
        // Reveal a random letter
        const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
        this.guessLetter(randomLetter);
    }

    watchAd() {
        // Simulate watching an ad
        this.gameState.extraLifeUsed = true;
        this.gameState.livesRemaining++;
        
        // Hide the watch ad button
        const watchAdBtn = document.getElementById('watch-ad-btn');
        if (watchAdBtn) {
            watchAdBtn.classList.add('hidden');
        }
        
        // Remove danger animation
        const gameCat = document.getElementById('game-cat');
        if (gameCat) {
            gameCat.classList.remove('danger');
        }
        
        this.updateGameDisplay();
        
        // Show feedback
        this.showToast('Extra life gained! 🎯');
    }

    checkGameState() {
        // Check if word is complete
        const wordComplete = this.gameState.currentWord
            .split('')
            .filter(char => char !== ' ')
            .every(char => this.gameState.correctLetters.includes(char));

        if (wordComplete) {
            this.handleWordComplete();
        } else if (this.gameState.livesRemaining <= 0) {
            this.handleGameOver();
        }
    }

    handleWordComplete() {
        this.gameState.wordsCompleted++;
        this.playSound('correct');
        this.animateCat('happy');
        
        console.log('Word completed! Total:', this.gameState.wordsCompleted);
        
        if (this.gameState.wordsCompleted >= this.gameState.maxWords) {
            // Victory!
            setTimeout(() => {
                this.playSound('victory');
                this.showScreen('victory-screen');
            }, 1500);
        } else {
            // Next word
            this.showToast(`Word ${this.gameState.wordsCompleted}/10 complete!`);
            setTimeout(() => {
                this.resetGameState();
                this.selectNewWord();
                this.updateGameDisplay();
                this.resetAlphabet();
            }, 1500);
        }
    }

    handleGameOver() {
        this.playSound('defeat');
        const revealedWordEl = document.getElementById('revealed-word');
        if (revealedWordEl) {
            revealedWordEl.textContent = this.gameState.currentWord;
        }
        
        setTimeout(() => {
            this.showScreen('defeat-screen');
        }, 1000);
    }

    updateGameDisplay() {
        // Update progress info
        const wordsCompletedEl = document.getElementById('words-completed');
        const livesRemainingEl = document.getElementById('lives-remaining');
        
        if (wordsCompletedEl) {
            wordsCompletedEl.textContent = this.gameState.wordsCompleted;
        }
        if (livesRemainingEl) {
            livesRemainingEl.textContent = this.gameState.livesRemaining;
        }
        
        // Update category display
        const currentCategoryEl = document.getElementById('current-category');
        if (currentCategoryEl && this.gameState.selectedCategory) {
            currentCategoryEl.textContent = 
                this.gameState.selectedCategory.charAt(0).toUpperCase() + 
                this.gameState.selectedCategory.slice(1);
        }
    }

    resetAlphabet() {
        document.querySelectorAll('.letter-btn').forEach(button => {
            button.disabled = false;
            button.classList.remove('correct', 'wrong');
        });
    }

    animateCat(emotion) {
        const gameCat = document.getElementById('game-cat');
        if (!gameCat) return;
        
        gameCat.classList.remove('happy', 'sad', 'danger');
        gameCat.classList.add(emotion);
        
        setTimeout(() => {
            gameCat.classList.remove(emotion);
        }, 600);
    }

    playSound(type) {
        if (!this.gameState.soundEnabled) return;
        
        // Create audio context for better sound effects
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            let frequency, duration;
            
            switch (type) {
                case 'correct':
                    frequency = 800;
                    duration = 0.2;
                    break;
                case 'wrong':
                    frequency = 300;
                    duration = 0.3;
                    break;
                case 'victory':
                    this.playVictoryMelody(audioContext);
                    return;
                case 'defeat':
                    frequency = 200;
                    duration = 0.5;
                    break;
                default:
                    return;
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            console.log('Web Audio API not supported');
        }
    }

    playVictoryMelody(audioContext) {
        const notes = [523, 659, 784, 1047]; // C, E, G, C (victory melody)
        const duration = 0.3;
        
        notes.forEach((frequency, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            }, index * 200);
        });
    }

    toggleSound() {
        this.gameState.soundEnabled = !this.gameState.soundEnabled;
        
        const soundStatus = document.querySelector('.sound-status');
        const gameSoundToggle = document.getElementById('game-sound-toggle');
        
        if (this.gameState.soundEnabled) {
            if (soundStatus) soundStatus.textContent = '🔊';
            if (gameSoundToggle) gameSoundToggle.textContent = '🔊';
        } else {
            if (soundStatus) soundStatus.textContent = '🔇';
            if (gameSoundToggle) gameSoundToggle.textContent = '🔇';
        }
    }

    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 500;
            z-index: 1000;
            animation: slideDown 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }
}

// Initialize the game when the DOM is loaded
let gameInstance = null;

function initGame() {
    if (!gameInstance) {
        gameInstance = new WhiskerWordsGame();
    }
}

// Multiple initialization methods for compatibility
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

// Fallback initialization
window.addEventListener('load', () => {
    if (!gameInstance) {
        initGame();
    }
});

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);