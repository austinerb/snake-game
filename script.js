class Snake {
    constructor(dimensions, game) {
        this.game = game;
        this.dimensions = dimensions;
        this.snake = [[6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1]]; // head is first index
        this.direction = 2; // 0 left, 1 up, 2 right, 3 down
        this.outOfBounds = false;
        this.tailStep = false;
        this.isNewSegment = false;
        
        this.drawFirstSnake();
    }

    // check direction value to change move 1 space in that direction
    update() {
        // erase the old tail before moving
        if (!this.isNewSegment) {
            this.eraseTail();
        }

        let newP = this.snake[0]; // new position

        // check direction value and move the position 1 space in that direction
        if (this.direction == 0) {
            newP = [newP[0] - 1, newP[1]];
        } else if (this.direction == 1) {
            newP = [newP[0], newP[1] - 1];
        } else if (this.direction == 2) {
            newP = [newP[0] + 1, newP[1]];
        } else if (this.direction == 3) {
            newP = [newP[0], newP[1] + 1];
        }

        // append new position
        this.snake.unshift(newP);

        // remove last position
        if (!this.isNewSegment) {
            this.snake.pop();
        } else {
            this.isNewSegment = false;
        }
        

        // check if new position is out of bounds
        this.checkOutOfBounds();

        // check if the snake ate its own tail
        this.checkTailStep();

        // if not out of bounds, draw the head
        // (not doing this resulted in drawing the head to a new linel)
        if (!this.outOfBounds) {
            // draw the new head
            this.drawHead();
        }

        // try to eat the apple
        this.eatApple();
    }

    eatApple() {
        let x = this.snake[0][0];
        let y = this.snake[0][1];

        // if 0 index = apple location
        if (x == this.game.apple.x && y == this.game.apple.y) {
            let convert = x + ((y - 1) * this.dimensions);
            const segment = document.querySelector("#container div:nth-child(" + convert + ")");
            segment.classList.toggle("apple");

            this.game.appleIsEaten = true;

            // update score
            this.game.updateScore();

            // add new segment
            this.isNewSegment = true;
        }        
    }

    checkOutOfBounds() {
        let x = this.snake[0][0];
        let y = this.snake[0][1];
    
        if (x < 1 || x > this.dimensions || y < 1 || y > this.dimensions) {
            this.outOfBounds = true;
        } else {
            this.outOfBounds =  false;
        }
    }

    checkTailStep() {
        let x = this.snake[0][0];
        let y = this.snake[0][1];
        let count = 0; 
        // count the number of times pos appears in the snake
        // if more than 1, the snake ate its own tail
        for (let i = 1; i < this.snake.length; i++) {
            if (x == this.snake[i][0] && y == this.snake[i][1]) {
                this.tailStep = true;
            }
        }
    }

    drawHead() {
        // draw new head position
        this.toggleSegment(this.snake[0][0], this.snake[0][1]);
    }
    
    eraseTail() {
        // clear current tail position
        this.toggleSegment(this.snake[this.snake.length-1][0], this.snake[this.snake.length-1][1]);
    }

    // takes an x and y coordinate and toggles the segment class on that div
    toggleSegment(x, y) {
        let convert = x + ((y - 1) * this.dimensions);
        const segment = document.querySelector("#container div:nth-child(" + convert + ")");
        segment.classList.toggle("segment");
    }

    drawFirstSnake() {
        for (let i = 0; i < this.snake.length; i++) {
            this.toggleSegment(this.snake[i][0], this.snake[i][1]);
        }
    }

    isOutOfBounds() {
        return this.outOfBounds;
    }
}

class Apple {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
    }
}

class Game {
    constructor(dimensions, container) {
        this.dimensions = dimensions;
        this.container = container;
        this.populateBoard();
        this.snake = new Snake(this.dimensions, this);
        this.addKeyListeners();
        this.appleIsEaten = true; // is there an apple to eat?
        this.score = 0;
    }

    start() {
        // start the game loop interval
        let x = this;
        this.interval = setInterval(function() {
            x.gameLoop();
        }, 250);
    }

    gameLoop() {
        this.addApple();
        this.snake.update();
    
        if (this.snake.isOutOfBounds() || this.snake.tailStep) {
            this.endGame();
        }
    }

    updateScore() {
        this.score += 10;

        document.querySelector("#score").innerHTML = this.score;
    }

    addApple() {
        if (!this.appleIsEaten) return;

        // create new location
        let x = Math.floor(Math.random() * this.dimensions) + 1;
        let y = Math.floor(Math.random() * this.dimensions) + 1;

        this.apple = new Apple(x,y, this);

        // draw apple
        let convert = x + ((y - 1) * this.dimensions);
        const segment = document.querySelector("#container div:nth-child(" + convert + ")");
        segment.classList.toggle("apple");

        this.appleIsEaten = false;
    }

    getApple() {
        return apple;
    }

    populateBoard() {
        this.clearBoard();

        for (let i = 0; i < this.dimensions*this.dimensions; i++) {
            const div = document.createElement("div");
            container.appendChild(div);
        }
    }

    clearBoard() {
        this.container.textContent = "";
    }

    endGame() {
        clearInterval(this.interval);

        gameOverScreen.classList.remove("hide");
    }

    addKeyListeners() {
        let x = this;

        document.documentElement.addEventListener("keydown", function(e) {
            if (e.keyCode == 37 && x.snake.direction != 2) {
                x.snake.direction = 0;
            } else if (e.keyCode == 38 && x.snake.direction != 3) {
                x.snake.direction = 1;
            } else if (e.keyCode == 39 && x.snake.direction != 0) {
                x.snake.direction = 2;
            } else if (e.keyCode == 40 && x.snake.direction != 1) {
                x.snake.direction = 3;
            }
        });
    }
}

function newGame() {
    let dimensions = 30; // value also used in css
    const container = document.querySelector("#container");
    
    let game = new Game(dimensions, container);
    game.start();
}

//

const newGameButton = document.querySelector("#new-game");
const restartGameButton = document.querySelector("#restart-game");

const homeScreen = document.querySelector("#home-screen");
const gameScreen = document.querySelector("#game-screen");
const gameOverScreen = document.querySelector("#game-over-screen");

function init() {
    homeScreen.classList.add("hide");
    gameScreen.classList.remove("hide");
    gameOverScreen.classList.add("hide");
    newGame(); 
}

newGameButton.addEventListener("click", init);
restartGameButton.addEventListener("click", init);