// Game state management
class GameState {
    constructor() {
        this.currentLevel = 1;
        this.level1Completed = false;
        this.level2Completed = false;
        this.level3Completed = false;
        this.outliersRemaining = 5;
        this.currentQuestion = null;
        this.selectedAnswer = null;
        this.level2Solution = {};
        this.removedOutliers = new Set();
        
        this.loadFromStorage();
    }

    saveToStorage() {
        localStorage.setItem('gameState', JSON.stringify({
            currentLevel: this.currentLevel,
            level1Completed: this.level1Completed,
            level2Completed: this.level2Completed,
            level3Completed: this.level3Completed,
            outliersRemaining: this.outliersRemaining,
            level2Solution: this.level2Solution,
            removedOutliers: Array.from(this.removedOutliers)
        }));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('gameState');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentLevel = data.currentLevel || 1;
            this.level1Completed = data.level1Completed || false;
            this.level2Completed = data.level2Completed || false;
            this.level3Completed = data.level3Completed || false;
            this.outliersRemaining = data.outliersRemaining || 5;
            this.level2Solution = data.level2Solution || {};
            this.removedOutliers = new Set(data.removedOutliers || []);
        }
    }

    reset() {
        this.currentLevel = 1;
        this.level1Completed = false;
        this.level2Completed = false;
        this.level3Completed = false;
        this.outliersRemaining = 5;
        this.currentQuestion = null;
        this.selectedAnswer = null;
        this.level2Solution = {};
        this.removedOutliers = new Set();
        this.saveToStorage();
    }
}

// Number pattern generation
class PatternGenerator {
    static generateQuestion() {
        const patterns = [
            this.arithmeticSequence,
            this.geometricSequence,
            this.fibonacciLike,
            this.squareNumbers,
            this.primeNumbers,
            this.triangularNumbers
        ];
        
        const patternFunc = patterns[Math.floor(Math.random() * patterns.length)];
        return patternFunc();
    }

    static arithmeticSequence() {
        const start = Math.floor(Math.random() * 20) + 1;
        const diff = Math.floor(Math.random() * 10) + 1;
        const sequence = [];
        
        for (let i = 0; i < 6; i++) {
            sequence.push(start + i * diff);
        }
        
        const missingIndex = 2 + Math.floor(Math.random() * 3); // Index 2, 3, or 4
        const answer = sequence[missingIndex];
        
        return {
            sequence: sequence.map((num, idx) => idx === missingIndex ? '?' : num),
            answer: answer,
            choices: this.generateChoices(answer),
            missingIndex: missingIndex
        };
    }

    static geometricSequence() {
        const start = Math.floor(Math.random() * 5) + 2;
        const ratio = 2 + Math.floor(Math.random() * 3);
        const sequence = [];
        
        for (let i = 0; i < 5; i++) {
            sequence.push(start * Math.pow(ratio, i));
        }
        
        const missingIndex = 2 + Math.floor(Math.random() * 2); // Index 2 or 3
        const answer = sequence[missingIndex];
        
        return {
            sequence: sequence.map((num, idx) => idx === missingIndex ? '?' : num),
            answer: answer,
            choices: this.generateChoices(answer),
            missingIndex: missingIndex
        };
    }

    static fibonacciLike() {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const sequence = [a, b];
        
        for (let i = 2; i < 6; i++) {
            sequence.push(sequence[i-1] + sequence[i-2]);
        }
        
        const missingIndex = 3 + Math.floor(Math.random() * 2); // Index 3 or 4
        const answer = sequence[missingIndex];
        
        return {
            sequence: sequence.map((num, idx) => idx === missingIndex ? '?' : num),
            answer: answer,
            choices: this.generateChoices(answer),
            missingIndex: missingIndex
        };
    }

    static squareNumbers() {
        const start = Math.floor(Math.random() * 3) + 1;
        const sequence = [];
        
        for (let i = 0; i < 5; i++) {
            sequence.push(Math.pow(start + i, 2));
        }
        
        const missingIndex = 2 + Math.floor(Math.random() * 2);
        const answer = sequence[missingIndex];
        
        return {
            sequence: sequence.map((num, idx) => idx === missingIndex ? '?' : num),
            answer: answer,
            choices: this.generateChoices(answer),
            missingIndex: missingIndex
        };
    }

    static primeNumbers() {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
        const startIndex = Math.floor(Math.random() * 5);
        const sequence = primes.slice(startIndex, startIndex + 5);
        
        const missingIndex = 2;
        const answer = sequence[missingIndex];
        
        return {
            sequence: sequence.map((num, idx) => idx === missingIndex ? '?' : num),
            answer: answer,
            choices: this.generateChoices(answer),
            missingIndex: missingIndex
        };
    }

    static triangularNumbers() {
        const sequence = [];
        for (let i = 1; i <= 6; i++) {
            sequence.push(i * (i + 1) / 2);
        }
        
        const missingIndex = 3;
        const answer = sequence[missingIndex];
        
        return {
            sequence: sequence.map((num, idx) => idx === missingIndex ? '?' : num),
            answer: answer,
            choices: this.generateChoices(answer),
            missingIndex: missingIndex
        };
    }

    static generateChoices(answer) {
        const choices = [answer];
        
        while (choices.length < 4) {
            const variation = Math.floor(Math.random() * 10) - 5;
            const choice = answer + variation;
            if (choice > 0 && !choices.includes(choice)) {
                choices.push(choice);
            }
        }
        
        // Shuffle choices
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }
        
        return choices;
    }
}

// Scatter plot data generator
class ScatterPlotGenerator {
    static generateData() {
        const points = [];
        const outliers = [];
        
        // Generate main cluster
        for (let i = 0; i < 45; i++) {
            const x = 150 + Math.random() * 300 + Math.random() * 50;
            const y = 100 + x * 0.3 + (Math.random() - 0.5) * 60;
            points.push({ x, y, isOutlier: false, id: i });
        }
        
        // Generate outliers
        for (let i = 45; i < 50; i++) {
            let x, y;
            if (Math.random() < 0.5) {
                // High x, low y outlier
                x = 400 + Math.random() * 150;
                y = 80 + Math.random() * 50;
            } else {
                // Low x, high y outlier
                x = 100 + Math.random() * 100;
                y = 250 + Math.random() * 100;
            }
            outliers.push({ x, y, isOutlier: true, id: i });
        }
        
        return [...points, ...outliers];
    }
}

// Toast notification system
class Toast {
    static show(message, type = 'info', duration = 3000) {
        const toast = document.getElementById('toast');
        const content = document.getElementById('toastContent');
        
        content.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.className = 'toast';
        }, duration);
    }
}

// Main game controller
class Game {
    constructor() {
        this.state = new GameState();
        this.scatterData = ScatterPlotGenerator.generateData();
        this.init();
    }

    init() {
        this.updateProgress();
        this.showCurrentLevel();
        this.setupEventListeners();
        
        if (this.state.currentLevel === 1) {
            this.generateNewQuestion();
        } else if (this.state.currentLevel === 3) {
            this.initScatterPlot();
        }
    }

    setupEventListeners() {
        // Level 1 events
        document.getElementById('newQuestionBtn').addEventListener('click', () => this.generateNewQuestion());
        document.getElementById('checkAnswerBtn').addEventListener('click', () => this.checkLevel1Answer());

        // Level 2 events
        document.getElementById('resetLevel2Btn').addEventListener('click', () => this.resetLevel2());
        document.getElementById('checkLevel2Btn').addEventListener('click', () => this.checkLevel2Solution());

        // Level 3 events
        document.getElementById('resetLevel3Btn').addEventListener('click', () => this.resetLevel3());
        document.getElementById('finishGameBtn').addEventListener('click', () => this.completeGame());

        // Game completion events
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());

        // Level 2 form changes
        const shapeInputs = document.querySelectorAll('.shape-color, .shape-count');
        shapeInputs.forEach(input => {
            input.addEventListener('change', () => this.updateLevel2Solution());
        });
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const labels = ['level1Label', 'level2Label', 'level3Label'];
        
        let progress = 0;
        if (this.state.level1Completed) progress = 33;
        if (this.state.level2Completed) progress = 66;
        if (this.state.level3Completed) progress = 100;
        
        progressFill.style.width = `${progress}%`;
        
        labels.forEach((labelId, index) => {
            const label = document.getElementById(labelId);
            const level = index + 1;
            
            if (level < this.state.currentLevel || (level === 1 && this.state.level1Completed) || 
                (level === 2 && this.state.level2Completed) || (level === 3 && this.state.level3Completed)) {
                label.className = 'progress-label completed';
            } else if (level === this.state.currentLevel) {
                label.className = 'progress-label active';
            } else {
                label.className = 'progress-label';
            }
        });
    }

    showCurrentLevel() {
        const levels = ['level1', 'level2', 'level3', 'gameComplete'];
        levels.forEach(levelId => {
            document.getElementById(levelId).classList.add('hidden');
        });

        if (this.state.level1Completed && this.state.level2Completed && this.state.level3Completed) {
            document.getElementById('gameComplete').classList.remove('hidden');
        } else {
            document.getElementById(`level${this.state.currentLevel}`).classList.remove('hidden');
        }
    }

    // Level 1 Methods
    generateNewQuestion() {
        this.state.currentQuestion = PatternGenerator.generateQuestion();
        this.state.selectedAnswer = null;
        this.renderQuestion();
        document.getElementById('checkAnswerBtn').disabled = true;
    }

    renderQuestion() {
        const sequenceDisplay = document.getElementById('sequenceDisplay');
        const choicesContainer = document.getElementById('choicesContainer');
        
        // Clear previous content
        sequenceDisplay.innerHTML = '';
        choicesContainer.innerHTML = '';
        
        // Render sequence
        this.state.currentQuestion.sequence.forEach((num, index) => {
            const numDiv = document.createElement('div');
            numDiv.className = 'sequence-number';
            if (num === '?') {
                numDiv.className += ' missing';
            }
            numDiv.textContent = num;
            sequenceDisplay.appendChild(numDiv);
        });
        
        // Render choices
        this.state.currentQuestion.choices.forEach(choice => {
            const choiceBtn = document.createElement('button');
            choiceBtn.className = 'choice-btn';
            choiceBtn.textContent = choice;
            choiceBtn.addEventListener('click', () => this.selectAnswer(choice, choiceBtn));
            choicesContainer.appendChild(choiceBtn);
        });
    }

    selectAnswer(answer, buttonElement) {
        // Remove previous selections
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Select new answer
        buttonElement.classList.add('selected');
        this.state.selectedAnswer = answer;
        document.getElementById('checkAnswerBtn').disabled = false;
    }

    checkLevel1Answer() {
        const isCorrect = this.state.selectedAnswer === this.state.currentQuestion.answer;
        
        // Update button styles
        document.querySelectorAll('.choice-btn').forEach(btn => {
            const value = parseInt(btn.textContent);
            if (value === this.state.currentQuestion.answer) {
                btn.classList.add('correct');
            } else if (value === this.state.selectedAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
            btn.disabled = true;
        });
        
        if (isCorrect) {
            Toast.show('Correct! Well done!', 'success');
            this.state.level1Completed = true;
            this.state.currentLevel = 2;
            
            setTimeout(() => {
                this.updateProgress();
                this.showCurrentLevel();
                this.state.saveToStorage();
            }, 2000);
        } else {
            Toast.show('Not quite right. Try again!', 'error');
            setTimeout(() => {
                this.generateNewQuestion();
            }, 2000);
        }
    }

    // Level 2 Methods
    updateLevel2Solution() {
        const shapes = ['triangle', 'circle', 'square', 'hexagon', 'octagon'];
        this.state.level2Solution = {};
        
        shapes.forEach(shape => {
            const colorSelect = document.querySelector(`[data-shape="${shape}"].shape-color`);
            const countInput = document.querySelector(`[data-shape="${shape}"].shape-count`);
            
            if (colorSelect.value && countInput.value) {
                this.state.level2Solution[shape] = {
                    color: colorSelect.value,
                    count: parseInt(countInput.value)
                };
            }
        });
        
        this.state.saveToStorage();
    }

    checkLevel2Solution() {
        const correctSolution = {
            triangle: { color: 'purple', count: 4 },
            circle: { color: 'green', count: 7 },
            square: { color: 'yellow', count: 5 },
            hexagon: { color: 'brown', count: 6 },
            octagon: { color: 'red', count: 3 }
        };
        
        const shapes = Object.keys(correctSolution);
        let allCorrect = true;
        
        // Check if all fields are filled
        for (const shape of shapes) {
            if (!this.state.level2Solution[shape] || 
                !this.state.level2Solution[shape].color || 
                !this.state.level2Solution[shape].count) {
                Toast.show('Please fill in all colors and counts before checking.', 'error');
                return;
            }
        }
        
        // Check correctness
        for (const shape of shapes) {
            const correct = correctSolution[shape];
            const provided = this.state.level2Solution[shape];
            
            if (provided.color !== correct.color || provided.count !== correct.count) {
                allCorrect = false;
                break;
            }
        }
        
        if (allCorrect) {
            Toast.show('Congratulations! You solved the logic puzzle correctly!', 'success');
            this.state.level2Completed = true;
            this.state.currentLevel = 3;
            
            setTimeout(() => {
                this.updateProgress();
                this.showCurrentLevel();
                this.initScatterPlot();
                this.state.saveToStorage();
            }, 2000);
        } else {
            Toast.show('Some of your answers are incorrect. Review the clues and try again.', 'error');
        }
    }

    resetLevel2() {
        this.state.level2Solution = {};
        document.querySelectorAll('.shape-color').forEach(select => select.value = '');
        document.querySelectorAll('.shape-count').forEach(input => input.value = '');
        this.state.saveToStorage();
    }

    // Level 3 Methods
    initScatterPlot() {
        const svg = document.getElementById('scatterPlot');
        svg.innerHTML = '';
        
        // Create axes
        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xAxis.setAttribute('x1', '50');
        xAxis.setAttribute('y1', '350');
        xAxis.setAttribute('x2', '550');
        xAxis.setAttribute('y2', '350');
        xAxis.setAttribute('class', 'chart-axis');
        svg.appendChild(xAxis);
        
        const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yAxis.setAttribute('x1', '50');
        yAxis.setAttribute('y1', '50');
        yAxis.setAttribute('x2', '50');
        yAxis.setAttribute('y2', '350');
        yAxis.setAttribute('class', 'chart-axis');
        svg.appendChild(yAxis);
        
        // Create data points
        this.scatterData.forEach((point, index) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', point.x);
            circle.setAttribute('cy', point.y);
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', '#3b82f6');
            circle.setAttribute('class', 'data-point');
            circle.setAttribute('data-id', point.id);
            
            if (this.state.removedOutliers.has(point.id)) {
                circle.classList.add('outlier-removed');
            }
            
            circle.addEventListener('click', () => this.toggleOutlier(point.id, circle));
            svg.appendChild(circle);
        });
        
        this.updateOutlierCounter();
    }

    toggleOutlier(pointId, circleElement) {
        const point = this.scatterData.find(p => p.id === pointId);
        
        if (this.state.removedOutliers.has(pointId)) {
            // Re-add the point
            this.state.removedOutliers.delete(pointId);
            circleElement.classList.remove('outlier-removed');
            if (point.isOutlier) {
                this.state.outliersRemaining++;
            }
        } else {
            // Remove the point
            this.state.removedOutliers.add(pointId);
            circleElement.classList.add('outlier-removed');
            if (point.isOutlier) {
                this.state.outliersRemaining--;
            }
        }
        
        this.updateOutlierCounter();
        this.state.saveToStorage();
    }

    updateOutlierCounter() {
        document.getElementById('outliersRemaining').textContent = this.state.outliersRemaining;
        document.getElementById('finishGameBtn').disabled = this.state.outliersRemaining > 0;
    }

    resetLevel3() {
        this.state.removedOutliers.clear();
        this.state.outliersRemaining = 5;
        this.initScatterPlot();
        this.state.saveToStorage();
    }

    completeGame() {
        if (this.state.outliersRemaining === 0) {
            Toast.show('Congratulations! You completed all levels!', 'success');
            this.state.level3Completed = true;
            
            setTimeout(() => {
                this.updateProgress();
                this.showCurrentLevel();
                this.state.saveToStorage();
            }, 2000);
        }
    }

    resetGame() {
        this.state.reset();
        this.scatterData = ScatterPlotGenerator.generateData();
        this.updateProgress();
        this.showCurrentLevel();
        this.generateNewQuestion();
        Toast.show('Game reset! Starting over...', 'info');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});