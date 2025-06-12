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
    const streakSlider = document.getElementById('streak-slider');
    const streakValueDisplay = document.getElementById('streak-value');
    
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
    let STREAK_TO_ADVANCE = 10;
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
    
    // Initialize streak slider
    streakSlider.addEventListener('input', () => {
        STREAK_TO_ADVANCE = parseInt(streakSlider.value);
        streakValueDisplay.textContent = STREAK_TO_ADVANCE;
    });
    
    // Apply difficulty settings
    function applyDifficultySettings() {
        // Reset target styles and clear any ongoing animations
        clearInterval(fadeInterval);
        clearInterval(moveInterval);
        clearInterval(glideInterval);
        clearInterval(sizeChangeInterval);
        clearInterval(teleportInterval);
        
        // Show original target for non-multiple target levels
        if (currentDifficulty < 9) {
            targetEl.style.display = 'block';
        }
        
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
            targetEl.style.width = '90px';
            targetEl.style.height = '90px';
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(0.85)';
                setTimeout(() => {
                    targetEl.style.transform = 'scale(0.95)';
                }, 300);
            };
            // Add slight movement with longer interval
            startMovingTarget(7000);
        }
        // Level 6 - Tricky: Small target with faster fade and movement
        else if (currentDifficulty === 6) {
            targetEl.style.width = '150px';  // Increased from 110px
            targetEl.style.height = '150px';  // Increased from 110px
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(0.7)';
            };
            
            // Add moderate fade and movement effects
            startFadeEffect(0.4, 2000);
            startMovingTarget(2500);  // Keeping the same fast movement
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
        // Level 9 - Master: Fast moving target with multiple effects
        else if (currentDifficulty === 9) {
            targetEl.style.width = '45px';
            targetEl.style.height = '45px';
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(0.7)';
                const smallShift = (Math.random() - 0.5) * 30;
                targetEl.style.marginLeft = `${smallShift}px`;
                targetEl.style.marginTop = `${smallShift}px`;
            };
            
            // Combine multiple effects for increased difficulty
            startFadeEffect(0.2, 800);
            startMovingTarget(600);
            startGlidingEffect(1000);
            startSizeChangeEffect(0.8, 1.2, 1500);
        }
        // Level 10 - Expert: Extremely challenging single target
        else if (currentDifficulty === 10) {
            targetEl.style.width = '35px';
            targetEl.style.height = '35px';
            targetEl.onmouseover = () => {
                targetEl.style.transform = 'scale(0.6)';
                const shift = (Math.random() - 0.5) * 40;
                targetEl.style.marginLeft = `${shift}px`;
                targetEl.style.marginTop = `${shift}px`;
            };
            
            // Combine all effects at their most challenging settings
            startFadeEffect(0.15, 600);
            startMovingTarget(500);
            startGlidingEffect(800);
            startSizeChangeEffect(0.7, 1.3, 1200);
            startTeleportEffect(3000);
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
        // Prevent default behavior
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
        playHappyAnimation(e.target);
        
        // Move and change color
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
        
        // Check for game over condition (accuracy below 30%) only for levels below 7
        if (currentDifficulty < 7) {
            const accuracy = Math.round((clickCount / totalClicks) * 100);
            if (accuracy < MIN_ACCURACY && totalClicks > 5) {
                showGameOver();
            }
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
        
        // Check for game over condition (accuracy below 30%) only for levels below 7
        if (currentDifficulty < 7) {
            if (accuracy < MIN_ACCURACY && totalClicks > 5) {
                showGameOver();
            }
        }
    }
    
    function positionTarget() {
        positionTargetSafely();
    }
    
    function changeTargetColor() {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        targetEl.style.backgroundColor = randomColor;
    }

    function startMovingTarget(interval, target = targetEl) {
        clearInterval(moveInterval);
        moveInterval = setInterval(() => {
            const x = Math.random() * (window.innerWidth - target.offsetWidth);
            const y = Math.random() * (window.innerHeight - target.offsetHeight);
            target.style.left = `${x}px`;
            target.style.top = `${y}px`;
        }, interval);
    }

    function startFadeEffect(minOpacity, interval, target = targetEl) {
        clearInterval(fadeInterval);
        let fadeOut = true;
        fadeInterval = setInterval(() => {
            const currentOpacity = parseFloat(target.style.opacity) || 1;
            if (fadeOut) {
                target.style.opacity = Math.max(minOpacity, currentOpacity - 0.1);
                if (parseFloat(target.style.opacity) <= minOpacity) fadeOut = false;
            } else {
                target.style.opacity = Math.min(1, currentOpacity + 0.1);
                if (parseFloat(target.style.opacity) >= 1) fadeOut = true;
            }
        }, interval / 10);
    }

    function startGlidingEffect(interval, target = targetEl) {
        clearInterval(glideInterval);
        glideInterval = setInterval(() => {
            const currentX = parseFloat(target.style.left) || window.innerWidth / 2;
            const currentY = parseFloat(target.style.top) || window.innerHeight / 2;
            const newX = currentX + (Math.random() - 0.5) * 100;
            const newY = currentY + (Math.random() - 0.5) * 100;
            
            // Keep target within bounds
            target.style.left = `${Math.max(0, Math.min(window.innerWidth - target.offsetWidth, newX))}px`;
            target.style.top = `${Math.max(0, Math.min(window.innerHeight - target.offsetHeight, newY))}px`;
        }, interval / 10);
    }

    function startSizeChangeEffect(minScale, maxScale, interval, target = targetEl) {
        clearInterval(sizeChangeInterval);
        let growing = true;
        let scale = 1;
        sizeChangeInterval = setInterval(() => {
            if (growing) {
                scale += 0.05;
                if (scale >= maxScale) growing = false;
            } else {
                scale -= 0.05;
                if (scale <= minScale) growing = true;
            }
            target.style.transform = `scale(${scale})`;
        }, interval / 20);
    }

    function startTeleportEffect(interval, target = targetEl) {
        clearInterval(teleportInterval);
        teleportInterval = setInterval(() => {
            const x = Math.random() * (window.innerWidth - target.offsetWidth);
            const y = Math.random() * (window.innerHeight - target.offsetHeight);
            target.style.transition = 'none';
            target.style.left = `${x}px`;
            target.style.top = `${y}px`;
            setTimeout(() => {
                target.style.transition = 'transform 0.2s, background-color 0.3s';
            }, 50);
        }, interval);
    }

    function positionTargetSafely(target = targetEl) {
        const margin = 50; // Minimum distance from edges
        const x = margin + Math.random() * (window.innerWidth - target.offsetWidth - 2 * margin);
        const y = margin + Math.random() * (window.innerHeight - target.offsetHeight - 2 * margin);
        target.style.left = `${x}px`;
        target.style.top = `${y}px`;
    }

    function playClickSound() {
        // Placeholder for sound effect
        // You can implement actual sound here
    }

    function playMissSound() {
        // Placeholder for sound effect
        // You can implement actual sound here
    }

    function playHappyAnimation(target) {
        target.classList.add('happy-animation');
        setTimeout(() => {
            target.classList.remove('happy-animation');
        }, 500);
    }

    function showGameOver() {
        gameActive = false;
        gameOverEl.style.display = 'flex';
        finalScoreEl.textContent = `Score: ${clickCount}`;
        finalAccuracyEl.textContent = `Accuracy: ${Math.round((clickCount / totalClicks) * 100)}%`;
        finalLevelEl.textContent = `Level: ${currentDifficulty}`;
    }

    function showLevelComplete() {
        gameActive = false;
        levelCompleteEl.style.display = 'flex';
        levelScoreEl.textContent = `Score: ${clickCount}`;
        levelAccuracyEl.textContent = `Accuracy: ${Math.round((clickCount / totalClicks) * 100)}%`;
        levelCompletedEl.textContent = `Level Completed: ${currentDifficulty}`;
    }

    // Add event listeners for game over and level complete buttons
    tryAgainBtn.addEventListener('click', () => {
        gameOverEl.style.display = 'none';
        startBtn.click();
    });

    backToMenuBtn.addEventListener('click', () => {
        gameOverEl.style.display = 'none';
        menuEl.style.display = 'flex';
        gameContainerEl.style.display = 'none';
    });

    nextLevelBtn.addEventListener('click', () => {
        levelCompleteEl.style.display = 'none';
        currentDifficulty = Math.min(10, currentDifficulty + 1);
        startBtn.click();
    });

    levelMenuBtn.addEventListener('click', () => {
        levelCompleteEl.style.display = 'none';
        menuEl.style.display = 'flex';
        gameContainerEl.style.display = 'none';
    });
});