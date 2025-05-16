document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const menuEl = document.getElementById('menu');
    const gameContainerEl = document.getElementById('game-container');
    const targetEl = document.getElementById('target');
    const scoreDisplay = document.getElementById('score');
    const accuracyDisplay = document.getElementById('accuracy');
    const streakDisplay = document.getElementById('streak-counter');
    const levelDisplay = document.getElementById('level-display');
    const startBtn = document.getElementById('start-game');
    const menuBtn = document.getElementById('menu-btn');
    
    // Difficulty buttons
    const level0Btn = document.getElementById('level0');
    const level1Btn = document.getElementById('level1');
    const level2Btn = document.getElementById('level2');
    const level3Btn = document.getElementById('level3');
    const level4Btn = document.getElementById('level4');
    const level5Btn = document.getElementById('level5');
    const level6Btn = document.getElementById('level6');
    const level7Btn = document.getElementById('level7');
    const level8Btn = document.getElementById('level8');
    const level9Btn = document.getElementById('level9');
    const level10Btn = document.getElementById('level10');
    
    // Game over elements
    const gameOverEl = document.getElementById('game-over');
    const finalScoreEl = document.getElementById('final-score');
    const finalAccuracyEl = document.getElementById('final-accuracy');
    const finalLevelEl = document.getElementById('final-level');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    
    // Level complete elements
    const levelCompleteEl = document.getElementById('level-complete');
    const levelScoreEl = document.getElementById('level-score');
    const levelAccuracyEl = document.getElementById('level-accuracy');
    const levelCompletedEl = document.getElementById('level-completed');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const levelMenuBtn = document.getElementById('level-menu-btn');
    
    // Game state
    let clickCount = 0;
    let missCount = 0;
    let totalClicks = 0;
    let currentDifficulty = 1;
    let isFullscreen = false;
    let gameActive = false;
    let successStreak = 0;
    const STREAK_TO_ADVANCE = 10;
    const MIN_ACCURACY = 30;
    
    // Target animation variables
    let fadeInterval = null;
    let moveInterval = null;
    let glideInterval = null;
    let sizeChangeInterval = null;
    let teleportInterval = null;
    
    const colors = [
        '#FF6B6B', // red
        '#4ECDC4', // teal
        '#FFD166', // yellow
        '#6A0572', // purple
        '#FF9F1C', // orange
        '#2EC4B6', // turquoise
        '#E71D36', // bright red
        '#FF9F1C', // amber
        '#8338EC', // violet
        '#3A86FF'  // blue
    ];
    
    // Apply difficulty settings
    function applyDifficultySettings() {
        // Reset target styles and clear any ongoing animations
        clearInterval(fadeInterval);
        clearInterval(moveInterval);
        clearInterval(glideInterval);
        clearInterval(sizeChangeInterval);
        clearInterval(teleportInterval);
        
        targetEl.style.transition = 'transform 0.2s, background-color 0.3s';
        targetEl.style.opacity = '1';
        targetEl.style.marginLeft = '0px';
        targetEl.style.marginTop = '0px';
        
        // Update level display
        levelDisplay.textContent = `Level: ${currentDifficulty}`;
        
        // Level 0 - Very Easy: Extra large target with strong hover effect
        if (currentDifficulty === 0) {
            targetEl.style.width = '240px';
            targetEl.style.height = '240px';
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(1.3)';
            };
        }
        // Level 1 - Easy: Target grows on hover (default CSS handles this)
        else if (currentDifficulty === 1) {
            targetEl.style.width = '120px';
            targetEl.style.height = '120px';
            // Remove the manual override to allow CSS :hover to work
            targetEl.onmouseover = null;
        }
        // Level 2 - Medium: No hover effect, normal speed
        else if (currentDifficulty === 2) {
            // Remove the hover effect by directly setting the CSS
            targetEl.style.width = '120px';
            targetEl.style.height = '120px';
            targetEl.style.transform = 'scale(1.0)';
            // Override the hover effect
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(1.0)';
            };
        } 
        // Level 3 - Hard: No hover effect, smaller target
        else if (currentDifficulty === 3) {
            targetEl.style.width = '80px';
            targetEl.style.height = '80px';
            // Override the hover effect
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(1.0)';
            };
        }
        // Level 4 - Challenging: Smaller target, shrinks on hover
        else if (currentDifficulty === 4) {
            targetEl.style.width = '70px';
            targetEl.style.height = '70px';
            // Shrink on hover
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(0.8)';
            };
        }
        // Level 5 - Advanced: Even smaller target with rapid shrink effect
        else if (currentDifficulty === 5) {
            targetEl.style.width = '60px';
            targetEl.style.height = '60px';
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(0.7)';
                setTimeout(() => {
                    targetEl.style.transform = 'scale(0.9)';
                }, 100);
            };
            // Add slight movement
            startMovingTarget(3000);
        }
        // Level 6 - Tricky: Small target with faster fade and movement
        else if (currentDifficulty === 6) {
            targetEl.style.width = '55px';
            targetEl.style.height = '55px';
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(0.7)';
            };
            
            // Add moderate fade and movement effects
            startFadeEffect(0.4, 2000);
            startMovingTarget(2500);
        }
        // Level 7 - Complex: Small target with faster fade and rapid movement plus size changes
        else if (currentDifficulty === 7) {
            targetEl.style.width = '50px';
            targetEl.style.height = '50px';
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(0.6)';
                targetEl.style.opacity = '0.7';
            };
            
            // Add faster fade effect and quicker movements
            startFadeEffect(0.3, 1500);
            startMovingTarget(2000);
            
            // Add size change effect - pulsate
            startSizeChangeEffect(0.8, 1.2, 1800);
        }
        // Level 8 - Advanced: Small target with unpredictable movement and teleportation
        else if (currentDifficulty === 8) {
            targetEl.style.width = '50px';
            targetEl.style.height = '50px';
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(0.7)';
                const smallShift = (Math.random() - 0.5) * 20;
                targetEl.style.marginLeft = `${smallShift}px`;
                targetEl.style.marginTop = `${smallShift}px`;
            };
            
            startFadeEffect(0.3, 1400);
            startMovingTarget(2000);
            
            startTeleportEffect(5000);
        }
        // Level 9 - Master: Very small target with erratic movement, gliding and strong fade
        else if (currentDifficulty === 9) {
            targetEl.style.width = '45px';
            targetEl.style.height = '45px';
            targetEl.style.transition = 'transform 0.15s, background-color 0.3s, opacity 0.5s';
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(0.6)';
                const randomX = (Math.random() - 0.5) * 30;
                const randomY = (Math.random() - 0.5) * 30;
                targetEl.style.marginLeft = `${randomX}px`;
                targetEl.style.marginTop = `${randomY}px`;
            };
            
            startFadeEffect(0.25, 1200);
            startMovingTarget(1200);
            
            startGlidingEffect(1600);
            
            startSizeChangeEffect(0.8, 1.2, 1400);
            
            startTeleportEffect(3500);
        }
        // Level 10 - Expert: Tiny target with extreme movement, fade, gliding and teleportation
        else if (currentDifficulty === 10) {
            targetEl.style.width = '35px';
            targetEl.style.height = '35px';
            targetEl.style.transition = 'transform 0.1s, background-color 0.3s, opacity 0.3s';
            targetEl.onmouseover = () => {
                // Random transform on hover
                const scale = 0.4 + Math.random() * 0.2;
                targetEl.style.transform = `scale(${scale})`;
                // Random position shift on hover
                const randomX = (Math.random() - 0.5) * 60;
                const randomY = (Math.random() - 0.5) * 60;
                targetEl.style.marginLeft = `${randomX}px`;
                targetEl.style.marginTop = `${randomY}px`;
            };
            
            // Add very fast fade and extremely rapid movement
            startFadeEffect(0.15, 800);
            startMovingTarget(700);
            
            // Add jitter effect
            const jitterInterval = setInterval(() => {
                if (!gameActive) {
                    clearInterval(jitterInterval);
                    return;
                }
                
                const jitterX = (Math.random() - 0.5) * 10;
                const jitterY = (Math.random() - 0.5) * 10;
                targetEl.style.marginLeft = `${jitterX}px`;
                targetEl.style.marginTop = `${jitterY}px`;
            }, 100);
            
            // Add rapid gliding movement
            startGlidingEffect(800);
            
            // Add dramatic size changes
            startSizeChangeEffect(0.6, 1.4, 900);
            
            // Add frequent teleportation
            startTeleportEffect(1700);
        }
        // Default fallback
        else {
            targetEl.style.width = '60px';
            targetEl.style.height = '60px';
        }
    }
    
    // Menu button handlers
    level0Btn.addEventListener('click', () => {
        setActiveButton(level0Btn);
        currentDifficulty = 0;
    });
    
    level1Btn.addEventListener('click', () => {
        setActiveButton(level1Btn);
        currentDifficulty = 1;
    });
    
    level2Btn.addEventListener('click', () => {
        setActiveButton(level2Btn);
        currentDifficulty = 2;
    });
    
    level3Btn.addEventListener('click', () => {
        setActiveButton(level3Btn);
        currentDifficulty = 3;
    });
    
    level4Btn.addEventListener('click', () => {
        setActiveButton(level4Btn);
        currentDifficulty = 4;
    });
    
    level5Btn.addEventListener('click', () => {
        setActiveButton(level5Btn);
        currentDifficulty = 5;
    });
    
    level6Btn.addEventListener('click', () => {
        setActiveButton(level6Btn);
        currentDifficulty = 6;
    });
    
    level7Btn.addEventListener('click', () => {
        setActiveButton(level7Btn);
        currentDifficulty = 7;
    });
    
    level8Btn.addEventListener('click', () => {
        setActiveButton(level8Btn);
        currentDifficulty = 8;
    });
    
    level9Btn.addEventListener('click', () => {
        setActiveButton(level9Btn);
        currentDifficulty = 9;
    });
    
    level10Btn.addEventListener('click', () => {
        setActiveButton(level10Btn);
        currentDifficulty = 10;
    });
    
    function setActiveButton(activeBtn) {
        // Remove active class from all buttons
        [level0Btn, level1Btn, level2Btn, level3Btn, level4Btn, level5Btn, 
         level6Btn, level7Btn, level8Btn, level9Btn, level10Btn].forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to clicked button
        activeBtn.classList.add('active');
    }
    
    // Start the game
    startBtn.addEventListener('click', () => {
        // Hide menu and show game
        menuEl.style.display = 'none';
        gameContainerEl.style.display = 'block';
        
        // Reset game state
        clickCount = 0;
        missCount = 0;
        totalClicks = 0;
        successStreak = 0;
        scoreDisplay.textContent = `Clicks: ${clickCount}`;
        accuracyDisplay.textContent = `Accuracy: 100%`;
        streakDisplay.textContent = `Streak: ${successStreak}`;
        levelDisplay.textContent = `Level: ${currentDifficulty}`;
        gameActive = true;
        
        // Make sure the target has initial position values before any animations start
        targetEl.style.left = '50%';
        targetEl.style.top = '50%';
        
        // Set initial position and color
        positionTarget();
        changeTargetColor();
        
        // Apply difficulty settings
        applyDifficultySettings();
        
        // Enter fullscreen if not already
        if (!isFullscreen) {
            requestFullscreen();
        }
    });
    
    // Return to menu
    menuBtn.addEventListener('click', () => {
        // Hide game and show menu
        gameContainerEl.style.display = 'none';
        menuEl.style.display = 'flex';
        gameActive = false;
    });
    
    // Add event listeners for both left and right clicks
    targetEl.addEventListener('mousedown', handleTargetClick);
    
    // Track misclicks on the game container (but not on the target)
    gameContainerEl.addEventListener('mousedown', (e) => {
        // Only count misclicks if game is active and the click is not on the target or menu button
        if (gameActive && e.target !== targetEl && e.target !== menuBtn) {
            handleMissClick();
            e.stopPropagation(); // Prevent the click from registering elsewhere
        }
    });
    
    // Prevent context menu on right-click for the entire document
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    function requestFullscreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().then(() => {
                isFullscreen = true;
            }).catch(err => {
                console.log("Error attempting to enable fullscreen:", err);
            });
        }
    }
    
    function handleTargetClick(e) {
        // Prevent default behavior to handle both left and right clicks
        e.preventDefault();
        
        // Play sound
        playClickSound();
        
        // Increment score
        clickCount++;
        totalClicks++;
        
        // Increment streak
        successStreak++;
        streakDisplay.textContent = `Streak: ${successStreak}`;
        
        updateScoreDisplay();
        
        // Check if streak reached to advance level
        if (successStreak >= STREAK_TO_ADVANCE) {
            showLevelComplete();
            return;
        }
        
        // Add visual feedback
        playHappyAnimation();
        
        // Move target to new position and change color
        positionTarget();
        changeTargetColor();
    }
    
    function handleMissClick() {
        // Increment miss counter
        missCount++;
        totalClicks++;
        
        // Reset streak on miss
        successStreak = 0;
        streakDisplay.textContent = `Streak: ${successStreak}`;
        
        // Play miss sound (lower pitched)
        playMissSound();
        
        // Update accuracy display
        updateScoreDisplay();
        
        // Check for game over condition (accuracy below 30%)
        const accuracy = Math.round((clickCount / totalClicks) * 100);
        if (accuracy < MIN_ACCURACY && totalClicks > 5) {
            showGameOver();
        }
    }
    
    function updateScoreDisplay() {
        scoreDisplay.textContent = `Clicks: ${clickCount}`;
        
        // Calculate and display accuracy
        const accuracy = totalClicks > 0 ? Math.round((clickCount / totalClicks) * 100) : 100;
        accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
        
        // Change color based on accuracy
        if (accuracy >= 80) {
            accuracyDisplay.style.color = '#4CAF50'; // Green for good accuracy
        } else if (accuracy >= 60) {
            accuracyDisplay.style.color = '#FF9800'; // Orange for medium accuracy
        } else {
            accuracyDisplay.style.color = '#F44336'; // Red for low accuracy
        }
        
        // Check for game over condition (accuracy below 30%)
        if (accuracy < MIN_ACCURACY && totalClicks > 5) {
            showGameOver();
        }
    }
    
    function positionTarget() {
        positionTargetSafely();
    }
    
    function changeTargetColor() {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        targetEl.style.backgroundColor = randomColor;
    }
    
    function playClickSound() {
        // Create audio element
        const audio = new Audio();
        
        // Alternate between different sounds
        if (clickCount % 3 === 0) {
            audio.src = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCgUFBQUFDMzMzMzM0dHR0dHR1tbW1tbW2ZmZmZmZnp6enp6eoODg4ODg5eXl5eXl6ysrKysrMDAwMDAwNTU1NTU1Ojo6Ojo6P39/f39/f///////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UGQAAANUMEoFPeACNQUIwKe8AEeQUaQU94AIwgoghp7wAQAAAP/////KZ0UP/JBEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABg/P/8YP/kQMKJ98QMHDgPmgIEBcF0Q3jgPHaBwEcU7JoUJ0EIoCBwMIHDQIKg4EAIVESBEKCcy4bkHKAcDgMZJ0DLDweBgGIaGw8awaBhjrYbGoeOB8MkAyPJxMQgYbAw6AmAYQR05o0NjbUdMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UGQRgAQ9NFM9eeACLqZp5689gEXQ2T7354ApPhuoXz3gBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
        } else if (clickCount % 2 === 0) {
            audio.src = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCgUFBQUFDMzMzMzM0dHR0dHR1tbW1tbW2ZmZmZmZnp6enp6eoODg4ODg5eXl5eXl6ysrKysrMDAwMDAwNTU1NTU1Ojo6Ojo6P39/f39/f///////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UGQAAANUMEoFPeACNQUIwKe8AEeQUaQU94AIwgoghp7wAQAAAP/////KZ0UP/JBEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABg/P/8YP/kQMKJ98QMHDgPmgIEBcF0Q3jgPHaBwEcU7JoUJ0EIoCBwMIHDQIKg4EAIVESBEKCcy4bkHKAcDgMZJ0DLDweBgGIaGw8awaBhjrYbGoeOB8MkAyPJxMQgYbAw6AmAYQR05o0NjbUdMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UGQRgAQ9NFM9eeACLqZp5689gEXQ2T7354ApPhuoXz3gBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
        } else {
            audio.src = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCgUFBQUFDMzMzMzM0dHR0dHR1tbW1tbW2ZmZmZmZnp6enp6eoODg4ODg5eXl5eXl6ysrKysrMDAwMDAwNTU1NTU1Ojo6Ojo6P39/f39/f///////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UGQAAANUMEoFPeACNQUIwKe8AEeQUaQU94AIwgoghp7wAQAAAP/////KZ0UP/JBEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABg/P/8YP/kQMKJ98QMHDgPmgIEBcF0Q3jgPHaBwEcU7JoUJ0EIoCBwMIHDQIKg4EAIVESBEKCcy4bkHKAcDgMZJ0DLDweBgGIaGw8awaBhjrYbGoeOB8MkAyPJxMQgYbAw6AmAYQR05o0NjbUdMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UGQRgAQ9NFM9eeACLqZp5689gEXQ2T7354ApPhuoXz3gBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
        }
        
        audio.volume = 0.3;
        audio.play();
    }
    
    function playMissSound() {
        // Create audio element for miss sound
        const audio = new Audio();
        audio.src = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCgUFBQUFDMzMzMzM0dHR0dHR1tbW1tbW2ZmZmZmZnp6enp6eoODg4ODg5eXl5eXl6ysrKysrMDAwMDAwNTU1NTU1Ojo6Ojo6P39/f39/f///////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UGQAAANUMEoFPeACNQUIwKe8AEeQUaQU94AIwgoghp7wAQAAAP/////KZ0UP/JBEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABg/P/8YP/kQMKJ98QMHDgPmgIEBcF0Q3jgPHaBwEcU7JoUJ0EIoCBwMIHDQIKg4EAIVESBEKCcy4bkHKAcDgMZJ0DLDweBgGIaGw8awaBhjrYbGoeOB8MkAyPJxMQgYbAw6AmAYQR05o0NjbUdMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UGQRgAQ9NFM9eeACLqZp5689gEXQ2T7354ApPhuoXz3gBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
        audio.volume = 0.15; // Lower volume for miss sound
        audio.playbackRate = 0.7; // Lower pitch for miss sound
        audio.play();
    }
    
    function playHappyAnimation() {
        // Create and append temporary elements for animation
        const emojis = ['🎉', '🌟', '👏', '💖', '🎈'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Create multiple particles
        for (let i = 0; i < 3; i++) {
            const animElement = document.createElement('div');
            animElement.className = 'happy-animation';
            animElement.style.position = 'absolute';
            
            // Position around the clicked target
            const targetRect = targetEl.getBoundingClientRect();
            const offsetX = (Math.random() - 0.5) * 60;
            const offsetY = (Math.random() - 0.5) * 60;
            
            animElement.style.left = `${targetRect.left + targetRect.width/2 + offsetX}px`;
            animElement.style.top = `${targetRect.top + targetRect.height/2 + offsetY}px`;
            
            animElement.style.fontSize = '40px';
            animElement.textContent = randomEmoji;
            animElement.style.zIndex = '5';
            animElement.style.transition = 'all 0.8s ease-out';
            animElement.style.opacity = '1';
            
            document.body.appendChild(animElement);
            
            // Animate and remove
            setTimeout(() => {
                animElement.style.transform = `translateY(-${50 + Math.random() * 50}px)`;
                animElement.style.opacity = '0';
            }, 50);
            
            setTimeout(() => {
                document.body.removeChild(animElement);
            }, 1000);
        }
    }
    
    // Handle window resize to ensure target stays visible
    window.addEventListener('resize', () => {
        positionTarget();
    });
    
    // Handle fullscreen change
    document.addEventListener('fullscreenchange', () => {
        isFullscreen = !!document.fullscreenElement;
    });
    
    // Game Over
    function showGameOver() {
        gameActive = false;
        
        // Stop any animations
        clearInterval(fadeInterval);
        clearInterval(moveInterval);
        
        // Update final stats
        finalScoreEl.textContent = `Score: ${clickCount}`;
        const accuracy = Math.round((clickCount / totalClicks) * 100);
        finalAccuracyEl.textContent = `Accuracy: ${accuracy}%`;
        finalLevelEl.textContent = `Level: ${currentDifficulty}`;
        
        // Show game over screen
        gameOverEl.style.display = 'flex';
    }
    
    // Level Complete
    function showLevelComplete() {
        gameActive = false;
        
        // Stop any animations
        clearInterval(fadeInterval);
        clearInterval(moveInterval);
        
        // Update level stats
        levelScoreEl.textContent = `Score: ${clickCount}`;
        const accuracy = Math.round((clickCount / totalClicks) * 100);
        levelAccuracyEl.textContent = `Accuracy: ${accuracy}%`;
        levelCompletedEl.textContent = `Level Completed: ${currentDifficulty}`;
        
        // Show level complete screen
        levelCompleteEl.style.display = 'flex';
    }
    
    // Try Again Button
    tryAgainBtn.addEventListener('click', () => {
        // Hide game over screen
        gameOverEl.style.display = 'none';
        
        // Reset game state
        clickCount = 0;
        missCount = 0;
        totalClicks = 0;
        successStreak = 0;
        scoreDisplay.textContent = `Clicks: ${clickCount}`;
        accuracyDisplay.textContent = `Accuracy: 100%`;
        streakDisplay.textContent = `Streak: ${successStreak}`;
        
        // Make game active again
        gameActive = true;
        
        // Reposition target
        positionTarget();
        changeTargetColor();
    });
    
    // Back to Menu Buttons
    backToMenuBtn.addEventListener('click', () => {
        gameOverEl.style.display = 'none';
        gameContainerEl.style.display = 'none';
        menuEl.style.display = 'flex';
    });
    
    levelMenuBtn.addEventListener('click', () => {
        levelCompleteEl.style.display = 'none';
        gameContainerEl.style.display = 'none';
        menuEl.style.display = 'flex';
    });
    
    // Next Level Button
    nextLevelBtn.addEventListener('click', () => {
        // Hide level complete screen
        levelCompleteEl.style.display = 'none';
        
        // Increment difficulty (max 10)
        currentDifficulty = Math.min(currentDifficulty + 1, 10);
        
        // Update active button in menu (for when they return to menu)
        if (currentDifficulty === 0) {
            setActiveButton(level0Btn);
        } else if (currentDifficulty === 1) {
            setActiveButton(level1Btn);
        } else if (currentDifficulty === 2) {
            setActiveButton(level2Btn);
        } else if (currentDifficulty === 3) {
            setActiveButton(level3Btn);
        } else if (currentDifficulty === 4) {
            setActiveButton(level4Btn);
        } else if (currentDifficulty === 5) {
            setActiveButton(level5Btn);
        } else if (currentDifficulty === 6) {
            setActiveButton(level6Btn);
        } else if (currentDifficulty === 7) {
            setActiveButton(level7Btn);
        } else if (currentDifficulty === 8) {
            setActiveButton(level8Btn);
        } else if (currentDifficulty === 9) {
            setActiveButton(level9Btn);
        } else if (currentDifficulty === 10) {
            setActiveButton(level10Btn);
        }
        
        // Reset game state
        clickCount = 0;
        missCount = 0;
        totalClicks = 0;
        successStreak = 0;
        scoreDisplay.textContent = `Clicks: ${clickCount}`;
        accuracyDisplay.textContent = `Accuracy: 100%`;
        streakDisplay.textContent = `Streak: ${successStreak}`;
        
        // Apply new difficulty settings
        applyDifficultySettings();
        
        // Make game active again
        gameActive = true;
        
        // Reposition target
        positionTarget();
        changeTargetColor();
    });
    
    // Start fade animation effect
    function startFadeEffect(minOpacity, duration) {
        clearInterval(fadeInterval);
        fadeInterval = setInterval(() => {
            if (!gameActive) return;
            
            // Fade out
            targetEl.style.transition = `opacity ${duration/2}ms ease-in-out`;
            targetEl.style.opacity = minOpacity;
            
            // Fade back in after half the duration
            setTimeout(() => {
                if (!gameActive) return;
                targetEl.style.opacity = '1';
            }, duration/2);
        }, duration);
    }
    
    // Start moving target animation
    function startMovingTarget(interval) {
        clearInterval(moveInterval);
        moveInterval = setInterval(() => {
            if (!gameActive) return;
            
            // For higher difficulty levels, add some randomness to movement
            if (currentDifficulty >= 8) {
                // Random quick position changes
                const quickMove = () => {
                    try {
                        // Get container dimensions
                        const containerWidth = gameContainerEl.clientWidth;
                        const containerHeight = gameContainerEl.clientHeight;
                        
                        // Calculate maximum position values (accounting for target size)
                        const maxX = containerWidth - targetEl.offsetWidth;
                        const maxY = containerHeight - targetEl.offsetHeight;
                        
                        // When difficulty is high, sometimes make larger jumps
                        let jumpFactor = 1;
                        if (currentDifficulty >= 9 && Math.random() > 0.7) {
                            jumpFactor = 2;
                        }
                        
                        // Ensure target has valid initial position
                        if (!targetEl.style.left || !targetEl.style.top) {
                            targetEl.style.left = `${containerWidth / 2}px`;
                            targetEl.style.top = `${containerHeight / 2}px`;
                        }
                        
                        // Generate random position with constraints
                        let currentX = parseInt(targetEl.style.left) || 0;
                        let currentY = parseInt(targetEl.style.top) || 0;
                        
                        // Extra safety check - if we get unreasonable values, reset
                        if (isNaN(currentX) || isNaN(currentY) || 
                            currentX < 0 || currentX > containerWidth || 
                            currentY < 0 || currentY > containerHeight) {
                            console.log("Invalid position detected, resetting");
                            currentX = containerWidth / 2;
                            currentY = containerHeight / 2;
                            targetEl.style.left = `${currentX}px`;
                            targetEl.style.top = `${currentY}px`;
                        }
                        
                        const moveRadius = 200 * jumpFactor;
                        
                        // Calculate new position within move radius
                        let newX = currentX + (Math.random() - 0.5) * moveRadius;
                        let newY = currentY + (Math.random() - 0.5) * moveRadius;
                        
                        // Ensure the target stays within bounds
                        newX = Math.max(0, Math.min(newX, maxX));
                        newY = Math.max(0, Math.min(newY, maxY));
                        
                        // Define safe zones (areas to avoid)
                        const scoreAreaWidth = 180; // Width of the score display area
                        const menuButtonWidth = 100; // Width of the menu button area
                        const topMargin = 220;      // Height of the top margin to avoid score display
                        
                        // Check if new position is in a restricted area and adjust if needed
                        if ((newX > maxX - scoreAreaWidth && newY < topMargin) || 
                            (newX < menuButtonWidth && newY < topMargin)) {
                            // Move to center if in restricted area
                            newY = Math.max(topMargin, newY);
                        }
                        
                        // Apply position with easing for smoother movement
                        const transitionTime = currentDifficulty >= 10 ? '0.2s' : '0.4s';
                        targetEl.style.transition = `left ${transitionTime} ease-out, top ${transitionTime} ease-out`;
                        targetEl.style.left = `${newX}px`;
                        targetEl.style.top = `${newY}px`;
                        
                        // Reset transition after movement completes
                        setTimeout(() => {
                            targetEl.style.transition = 'transform 0.2s, background-color 0.3s, opacity 0.3s';
                        }, currentDifficulty >= 10 ? 200 : 400);
                    } catch (e) {
                        console.error("Error in quickMove:", e);
                        // In case of error, use the safe positioning function
                        positionTargetSafely();
                    }
                };
                
                quickMove();
            } else {
                // Standard position change for lower difficulties
                positionTarget();
            }
        }, interval);
    }
    
    // Start size change effect
    function startSizeChangeEffect(minScale, maxScale, duration) {
        clearInterval(sizeChangeInterval);
        sizeChangeInterval = setInterval(() => {
            if (!gameActive) return;
            
            // Calculate scale
            const scale = Math.random() * (maxScale - minScale) + minScale;
            
            // Apply scale
            targetEl.style.transform = `scale(${scale})`;
            
            // Reset scale after duration
            setTimeout(() => {
                if (!gameActive) return;
                targetEl.style.transform = 'scale(1)';
            }, duration);
        }, duration);
    }
    
    // Start teleportation effect
    function startTeleportEffect(interval) {
        clearInterval(teleportInterval);
        
        teleportInterval = setInterval(() => {
            if (!gameActive) return;
            
            // Make the target briefly disappear
            targetEl.style.opacity = '0';
            
            // After a short delay, teleport and reappear
            setTimeout(() => {
                if (!gameActive) return;
                
                // Position to a completely new location with safe zones
                positionTargetSafely();
                
                // Random size change for higher difficulties
                if (currentDifficulty >= 9) {
                    const randomScale = 0.8 + Math.random() * 0.4;
                    targetEl.style.transform = `scale(${randomScale})`;
                }
                
                // Reappear
                targetEl.style.opacity = '1';
            }, 200);
        }, interval);
    }
    
    // Safe positioning function to avoid UI elements
    function positionTargetSafely() {
        // Get container dimensions
        const containerWidth = gameContainerEl.clientWidth;
        const containerHeight = gameContainerEl.clientHeight;
        
        // Calculate maximum position values (accounting for target size)
        const maxX = containerWidth - targetEl.offsetWidth;
        const maxY = containerHeight - targetEl.offsetHeight;
        
        // Define safe zones (areas to avoid)
        const scoreAreaWidth = 180; // Width of the score display area
        const menuButtonWidth = 100; // Width of the menu button area
        const topMargin = 220;     // Height of the top margin to avoid score display
        
        // Generate random position
        let randomX, randomY;
        
        // Keep generating positions until we find one not in a restricted area
        do {
            randomX = Math.floor(Math.random() * maxX);
            randomY = Math.floor(Math.random() * maxY);
        } while (
            // Avoid top-right corner (score display area)
            (randomX > maxX - scoreAreaWidth && randomY < topMargin) ||
            // Avoid top-left corner (menu button area)
            (randomX < menuButtonWidth && randomY < topMargin)
        );
        
        // Apply position
        targetEl.style.left = `${randomX}px`;
        targetEl.style.top = `${randomY}px`;
    }
    
    // Start gliding movement effect
    function startGlidingEffect(interval) {
        clearInterval(glideInterval);
        
        // Initial position
        const containerWidth = gameContainerEl.clientWidth;
        const containerHeight = gameContainerEl.clientHeight;
        const maxX = containerWidth - targetEl.offsetWidth;
        const maxY = containerHeight - targetEl.offsetHeight;
        
        // Define safe zones (areas to avoid)
        const scoreAreaWidth = 180; // Width of the score display area
        const menuButtonWidth = 100; // Width of the menu button area
        const topMargin = 220;     // Height of the top margin to avoid score display
        
        // Ensure target has valid initial position
        if (!targetEl.style.left || !targetEl.style.top) {
            targetEl.style.left = '50%';
            targetEl.style.top = '50%';
            positionTargetSafely();
        }
        
        // Set initial destination (ensuring it's not in a restricted area)
        let destX, destY;
        do {
            destX = Math.random() * maxX;
            destY = Math.random() * maxY;
        } while (
            // Avoid top-right corner (score display area)
            (destX > maxX - scoreAreaWidth && destY < topMargin) ||
            // Avoid top-left corner (menu button area)
            (destX < menuButtonWidth && destY < topMargin)
        );
        
        glideInterval = setInterval(() => {
            if (!gameActive) return;
            
            // Get current position with safe parsing
            let currentX = 0;
            let currentY = 0;
            
            try {
                // Handle cases where parseInt might return NaN
                currentX = parseInt(targetEl.style.left) || 0;
                currentY = parseInt(targetEl.style.top) || 0;
                
                // Extra safety check - if we get unreasonable values, reset
                if (isNaN(currentX) || isNaN(currentY) || 
                    currentX < 0 || currentX > containerWidth || 
                    currentY < 0 || currentY > containerHeight) {
                    console.log("Invalid position detected, resetting");
                    currentX = containerWidth / 2;
                    currentY = containerHeight / 2;
                    targetEl.style.left = `${currentX}px`;
                    targetEl.style.top = `${currentY}px`;
                }
            } catch (e) {
                console.error("Error parsing position:", e);
                currentX = containerWidth / 2;
                currentY = containerHeight / 2;
                targetEl.style.left = `${currentX}px`;
                targetEl.style.top = `${currentY}px`;
            }
            
            // Calculate step size
            const stepFactor = currentDifficulty >= 10 ? 0.08 : 0.05;
            const stepX = (destX - currentX) * stepFactor;
            const stepY = (destY - currentY) * stepFactor;
            
            // Apply movement
            targetEl.style.transition = 'none'; // For smooth gliding
            targetEl.style.left = `${currentX + stepX}px`;
            targetEl.style.top = `${currentY + stepY}px`;
            
            // When close to destination, pick a new destination
            if (Math.abs(currentX - destX) < 10 && Math.abs(currentY - destY) < 10) {
                // Set new destination (ensuring it's not in a restricted area)
                do {
                    destX = Math.random() * maxX;
                    destY = Math.random() * maxY;
                } while (
                    // Avoid top-right corner (score display area)
                    (destX > maxX - scoreAreaWidth && destY < topMargin) ||
                    // Avoid top-left corner (menu button area)
                    (destX < menuButtonWidth && destY < topMargin)
                );
            }
        }, 30); // Update at 30ms for smoother animation
    }
}); 