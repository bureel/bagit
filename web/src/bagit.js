var myGamePiece;
var myBackground;
var myMoney;
var myBottom;
var myTop;
var myBanana = new component(85, 85, "peanut-butter-jelly-time.gif", 40, 40, "image");
var myApple = new component(30, 30, "appleGamePiece.png", 40, 40, "image");
var myGrapes = new component(30, 30, "GrapesGamePiece.png", 40, 40, "image");
var myOrange = new component(30, 30, "orangeGamePiece.png", 40, 40, "image");
var myPear = new component(30, 30, "PearGamePiece.png", 40, 40, "image");
var myWatermelon = new component(30, 30, "watermelonGamePiece.png", 40, 40, "image");
var fruitTemplates = [myBanana, myApple, myGrapes, myOrange, myPear, myWatermelon];
var dollar = 10;
var myFruits = [];

function startGame() {
    myGamePiece = new component(50, 50, "bob.png", 165, 580, "image");
    myBackground = new component(250, 676, "beltCloseUp.jpg", 65, 0, "background");
    myMoney = new component("40px", "Arial", "black", 580, 250, "text");
    myBottom = new component(431, 96, "bottom.png", 0, 580, "image");
    myTop = new component(350, 49, "top.png", 0, 0, "image");
    myGameArea.start();
}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 900;
        this.canvas.height = 676;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        });
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
};

function component(width, height, color, x, y, type) {
    this.type = type;
    this.color = color;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image,
                    this.x,
                    this.y - this.height,
                    this.width, this.height);
            }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.y == +(this.height)) {
                this.y = 0;
            }
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    this.clone = function() {
        return new component(this.width, this.height, this.color, 0, 0, this.type);
    }
}

function updateGameArea() {
    myGameArea.clear();
    myBackground.speedY = 2;
    myBackground.newPos();
    myBackground.update();
    myTop.update();
    myBottom.update();
    myGamePiece.speedX = 0;
    myMoney.text="MONEY:$ " + dollar;
    myMoney.update();

    if (myGameArea.key && myGameArea.key == 37 && myGamePiece.x > myBackground.x) {
        myGamePiece.speedX = -2;
    }
    if (myGameArea.key && myGameArea.key == 39 && myGamePiece.x < myBackground.width + 65 - myGamePiece.width) {
        myGamePiece.speedX  = 2;
    }
    myGamePiece.newPos();
    myGamePiece.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        var newFruit = fruitTemplates[getRandomInt(0,5)].clone();
        newFruit.x = getRandomInt(65, myBackground.width - newFruit.width);
        console.log('Generated new fruit', newFruit);
        myFruits.push(newFruit);
    }
    for (i = 0; i < myFruits.length; i += 1) {
        if (myGamePiece.crashWith(myFruits[i])) {
            dollar = dollar - 1;
            console.log('Removing a dollar', dollar);
            console.log('Destroyed fruit', myFruits.splice(i, 1));
        }if (dollar == 0) {
            myGameArea.stop();
        }if (myFruits[i].y > myBackground.height - myBottom.height) {
            console.log('Destroyed fruit', myFruits.splice(i, 1));
        } else {
            myFruits[i].y += 2;
            myFruits[i].update();
        }
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}