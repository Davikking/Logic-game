
class LogicGame {
  constructor() {
    this.currentScreen = 'home';
    this.currentLevel = 1;
    this.currentQuestion = 0;
    this.level1Score = 0;
    this.scatterPoints = [];
    this.outliers = [];
    this.clusters = [];
    
    this.level1Questions = [
      // Easy questions
      {
        sequence: [2, 4, 6, 8],
        answer: 10,
        options: [10, 12, 9, 14],
        difficulty: 'easy'
      },
      {
        sequence: [5, 10, 15, 20],
        answer: 25,
        options: [25, 30, 24, 22],
        difficulty: 'easy'
      },
      {
        sequence: [1, 3, 5, 7],
        answer: 9,
        options: [8, 9, 10, 11],
        difficulty: 'easy'
      },
      // Medium questions
      {
        sequence: [1, 4, 9, 16],
        answer: 25,
        options: [20, 25, 24, 36],
        difficulty: 'medium'
      },
      {
        sequence: [2, 6, 12, 20],
        answer: 30,
        options: [28, 30, 32, 24],
        difficulty: 'medium'
      },
      {
        sequence: [3, 6, 12, 24],
        answer: 48,
        options: [36, 42, 48, 50],
        difficulty: 'medium'
      },
      // Hard questions
      {
        sequence: [2, 3, 5, 8, 13],
        answer: 21,
        options: [18, 19, 21, 23],
        difficulty: 'hard'
      },
      {
        sequence: [1, 1, 2, 3, 5],
        answer: 8,
        options: [6, 7, 8, 9],
        difficulty: 'hard'
      },
      {
        sequence: [2, 3, 5, 8, 12],
        answer: 17,
        options: [15, 16, 17, 18],
        difficulty: 'hard'
      }
    ];

    // Level 2 solution
    this.level2Solution = {
      'Circle-Red': false, 'Circle-Yellow': false, 'Circle-Green': true, 'Circle-Purple': false, 'Circle-Brown': false,
      'Square-Red': false, 'Square-Yellow': true, 'Square-Green': false, 'Square-Purple': false, 'Square-Brown': false,
      'Hexagon-Red': false, 'Hexagon-Yellow': false, 'Hexagon-Green': false, 'Hexagon-Purple': false, 'Hexagon-Brown': true,
      'Triangle-Red': false, 'Triangle-Yellow': false, 'Triangle-Green': false, 'Triangle-Purple': true, 'Triangle-Brown': false,
      'Octagon-Red': true, 'Octagon-Yellow': false, 'Octagon-Green': false, 'Octagon-Purple': false, 'Octagon-Brown': false,
      'Circle-3': false, 'Circle-4': false, 'Circle-5': false, 'Circle-6': false, 'Circle-7': true,
      'Square-3': false, 'Square-4': false, 'Square-5': true, 'Square-6': false, 'Square-7': false,
      'Hexagon-3': false, 'Hexagon-4': false, 'Hexagon-5': false, 'Hexagon-6': true, 'Hexagon-7': false,
      'Triangle-3': false, 'Triangle-4': true, 'Triangle-5': false, 'Triangle-6': false, 'Triangle-7': false,
      'Octagon-3': true, 'Octagon-4': false, 'Octagon-5': false, 'Octagon-6': false, 'Octagon-7': false
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.showScreen('home');
  }

  bindEvents() {
    document.getElementById('start-game').addEventListener('click', () => this.startGame());
    document.getElementById('clear-grid').addEventListener('click', () => this.clearGrid());
    document.getElementById('check-solution').addEventListener('click', () => this.checkLevel2Solution());
    document.getElementById('reset-scatter').addEventListener('click', () => this.resetScatter());
    document.getElementById('check-scatter').addEventListener('click', () => this.checkLevel3Solution());
    document.getElementById('play-again').addEventListener('click', () => this.resetGame());
    document.getElementById('try-again').addEventListener('click', () => this.resetGame());
  }

  showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    document.getElementById(`${screenName}-screen`).classList.add('active');
    this.currentScreen = screenName;
  }

  startGame() {
    this.currentLevel = 1;
    this.level1Score = 0;
    this.currentQuestion = 0;
    this.showScreen('level1');
    this.startLevel1();
  }

  startLevel1() {
    // Select 3 questions: 1 easy, 1 medium, 1 hard
    const easy = this.level1Questions.filter(q => q.difficulty === 'easy');
    const medium = this.level1Questions.filter(q => q.difficulty === 'medium');
    const hard = this.level1Questions.filter(q => q.difficulty === 'hard');
    
    this.selectedQuestions = [
      easy[Math.floor(Math.random() * easy.length)],
      medium[Math.floor(Math.random() * medium.length)],
      hard[Math.floor(Math.random() * hard.length)]
    ];
    
    this.currentQuestion = 0;
    this.level1Score = 0;
    this.showQuestion();
  }

  showQuestion() {
    const question = this.selectedQuestions[this.currentQuestion];
    const progress = ((this.currentQuestion + 1) / 3) * 100;
    
    document.getElementById('level1-progress').style.width = `${progress}%`;
    document.getElementById('current-question').textContent = this.currentQuestion + 1;
    document.getElementById('question-text').textContent = `Find the next number in the sequence:`;
    document.getElementById('sequence-display').textContent = question.sequence.join(', ') + ', ?';
    
    const buttonsContainer = document.getElementById('answer-buttons');
    buttonsContainer.innerHTML = '';
    
    question.options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'answer-btn';
      button.textContent = option;
      button.addEventListener('click', () => this.selectAnswer(option, question.answer));
      buttonsContainer.appendChild(button);
    });
  }

  selectAnswer(selected, correct) {
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
      btn.disabled = true;
      if (parseInt(btn.textContent) === correct) {
        btn.classList.add('correct');
      } else if (parseInt(btn.textContent) === selected && selected !== correct) {
        btn.classList.add('incorrect');
      }
    });

    if (selected === correct) {
      this.level1Score++;
    }

    setTimeout(() => {
      this.currentQuestion++;
      if (this.currentQuestion < 3) {
        this.showQuestion();
      } else {
        this.endLevel1();
      }
    }, 1500);
  }

  endLevel1() {
    const resultDiv = document.getElementById('level1-result');
    if (this.level1Score === 3) {
      resultDiv.innerHTML = '<p>Excellent! All correct! Moving to Level 2...</p>';
      resultDiv.className = 'result-message success';
      setTimeout(() => {
        this.startLevel2();
      }, 2000);
    } else {
      resultDiv.innerHTML = '<p>Game Over! You need all 3 correct to proceed.</p>';
      resultDiv.className = 'result-message failure';
      setTimeout(() => {
        this.showScreen('gameover');
      }, 2000);
    }
    resultDiv.classList.remove('hidden');
  }

  startLevel2() {
    this.showScreen('level2');
    this.setupGrid();
  }

  setupGrid() {
    const shapes = ['Circle', 'Square', 'Hexagon', 'Triangle', 'Octagon'];
    const colors = ['Red', 'Yellow', 'Green', 'Purple', 'Brown'];
    
    const tbody = document.querySelector('#logic-grid tbody');
    tbody.innerHTML = '';

    // Create shape-color rows
    shapes.forEach(shape => {
      const row = document.createElement('tr');
      const headerCell = document.createElement('td');
      headerCell.className = 'row-header';
      headerCell.textContent = shape;
      row.appendChild(headerCell);

      colors.forEach(color => {
        const cell = document.createElement('td');
        const gridCell = document.createElement('div');
        gridCell.className = 'grid-cell';
        gridCell.dataset.key = `${shape}-${color}`;
        gridCell.addEventListener('click', () => this.toggleCell(gridCell));
        cell.appendChild(gridCell);
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });

    // Create shape-count rows with number inputs
    shapes.forEach(shape => {
      const row = document.createElement('tr');
      const headerCell = document.createElement('td');
      headerCell.className = 'row-header';
      headerCell.textContent = `${shape} Count`;
      row.appendChild(headerCell);

      // Create a single cell spanning all columns for the number input
      const cell = document.createElement('td');
      cell.colSpan = 5;
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '3';
      input.max = '7';
      input.className = 'count-input';
      input.dataset.shape = shape;
      input.placeholder = 'Enter count (3-7)';
      cell.appendChild(input);
      row.appendChild(cell);
      tbody.appendChild(row);
    });
  }

  toggleCell(cell) {
    if (cell.classList.contains('selected')) {
      cell.classList.remove('selected');
      cell.classList.add('eliminated');
    } else if (cell.classList.contains('eliminated')) {
      cell.classList.remove('eliminated');
    } else {
      cell.classList.add('selected');
    }
  }

  clearGrid() {
    document.querySelectorAll('.grid-cell').forEach(cell => {
      cell.classList.remove('selected', 'eliminated');
    });
    document.querySelectorAll('.count-input').forEach(input => {
      input.value = '';
    });
  }

  checkLevel2Solution() {
    const selectedCells = document.querySelectorAll('.grid-cell.selected');
    const countInputs = document.querySelectorAll('.count-input');
    let correct = true;
    let selectedKeys = new Set();

    // Check color selections
    selectedCells.forEach(cell => {
      selectedKeys.add(cell.dataset.key);
    });

    // Check color solution
    for (const [key, shouldBeSelected] of Object.entries(this.level2Solution)) {
      if (key.includes('-3') || key.includes('-4') || key.includes('-5') || key.includes('-6') || key.includes('-7')) {
        continue; // Skip count keys, handle separately
      }
      if (shouldBeSelected && !selectedKeys.has(key)) {
        correct = false;
        break;
      }
      if (!shouldBeSelected && selectedKeys.has(key)) {
        correct = false;
        break;
      }
    }

    // Check count inputs
    const expectedCounts = {
      'Circle': 7,
      'Square': 5,
      'Hexagon': 6,
      'Triangle': 4,
      'Octagon': 3
    };

    countInputs.forEach(input => {
      const shape = input.dataset.shape;
      const enteredValue = parseInt(input.value);
      if (enteredValue !== expectedCounts[shape]) {
        correct = false;
      }
    });

    const resultDiv = document.getElementById('level2-result');
    if (correct) {
      resultDiv.innerHTML = '<p>Perfect! Logic puzzle solved! Moving to Level 3...</p>';
      resultDiv.className = 'result-message success';
      setTimeout(() => {
        this.startLevel3();
      }, 2000);
    } else {
      resultDiv.innerHTML = '<p>Not quite right. Review the clues and try again!</p>';
      resultDiv.className = 'result-message failure';
    }
    resultDiv.classList.remove('hidden');
  }

  startLevel3() {
    this.showScreen('level3');
    this.setupScatterPlot();
  }

  setupScatterPlot() {
    const canvas = document.getElementById('scatter-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Generate points
    this.scatterPoints = [];
    this.outliers = [];
    this.clusters = [];

    // Create 3 dense clusters
    const clusterCenters = [
      { x: 150, y: 150 },
      { x: 450, y: 250 },
      { x: 300, y: 320 }
    ];

    clusterCenters.forEach((center, clusterIndex) => {
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 40;
        const point = {
          x: center.x + Math.cos(angle) * distance,
          y: center.y + Math.sin(angle) * distance,
          isCluster: true,
          clusterIndex: clusterIndex,
          removed: false
        };
        this.scatterPoints.push(point);
        this.clusters.push(point);
      }
    });

    // Add outliers
    for (let i = 0; i < 25; i++) {
      let point;
      let validPoint = false;
      let attempts = 0;
      
      while (!validPoint && attempts < 50) {
        point = {
          x: Math.random() * (canvas.width - 40) + 20,
          y: Math.random() * (canvas.height - 40) + 20,
          isCluster: false,
          removed: false
        };
        
        // Check if point is far enough from clusters
        validPoint = clusterCenters.every(center => {
          const distance = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2));
          return distance > 80;
        });
        attempts++;
      }
      
      if (validPoint) {
        this.scatterPoints.push(point);
        this.outliers.push(point);
      }
    }

    this.drawScatterPlot();
    this.updatePointsCount();

    // Add click event listener
    canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
  }

  drawScatterPlot() {
    const canvas = document.getElementById('scatter-canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    this.scatterPoints.forEach(point => {
      if (!point.removed) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.isCluster ? 4 : 6, 0, 2 * Math.PI);
        ctx.fillStyle = point.isCluster ? '#4299e1' : '#f56565';
        ctx.fill();
        ctx.strokeStyle = point.isCluster ? '#2b6cb0' : '#c53030';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }

  handleCanvasClick(e) {
    const canvas = document.getElementById('scatter-canvas');
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find closest point within click radius
    let closestPoint = null;
    let closestDistance = Infinity;

    this.scatterPoints.forEach(point => {
      if (!point.removed) {
        const distance = Math.sqrt(Math.pow(clickX - point.x, 2) + Math.pow(clickY - point.y, 2));
        if (distance < 10 && distance < closestDistance) {
          closestDistance = distance;
          closestPoint = point;
        }
      }
    });

    if (closestPoint) {
      closestPoint.removed = true;
      this.drawScatterPlot();
      this.updatePointsCount();
    }
  }

  updatePointsCount() {
    const remaining = this.scatterPoints.filter(p => !p.removed).length;
    document.getElementById('points-remaining').textContent = remaining;
  }

  resetScatter() {
    this.scatterPoints.forEach(point => {
      point.removed = false;
    });
    this.drawScatterPlot();
    this.updatePointsCount();
  }

  checkLevel3Solution() {
    const removedOutliers = this.outliers.filter(p => p.removed).length;
    const removedClusters = this.clusters.filter(p => p.removed).length;
    const totalOutliers = this.outliers.length;

    const resultDiv = document.getElementById('level3-result');
    
    if (removedOutliers >= totalOutliers * 0.8 && removedClusters <= this.clusters.length * 0.1) {
      resultDiv.innerHTML = '<p>Excellent! You successfully filtered the noise! 🎉</p>';
      resultDiv.className = 'result-message success';
      setTimeout(() => {
        this.showScreen('victory');
      }, 2000);
    } else if (removedClusters > this.clusters.length * 0.3) {
      resultDiv.innerHTML = '<p>You removed too many cluster points! Try to preserve the dense areas.</p>';
      resultDiv.className = 'result-message failure';
    } else {
      resultDiv.innerHTML = '<p>Remove more outlier points (the scattered red dots)!</p>';
      resultDiv.className = 'result-message failure';
    }
    resultDiv.classList.remove('hidden');
  }

  resetGame() {
    this.currentLevel = 1;
    this.level1Score = 0;
    this.currentQuestion = 0;
    
    // Clear all result messages
    document.querySelectorAll('.result-message').forEach(div => {
      div.classList.add('hidden');
      div.innerHTML = '';
    });
    
    this.showScreen('home');
  }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  new LogicGame();
});
