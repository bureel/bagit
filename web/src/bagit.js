var myGamePiece;
var myBackground;
var myMoney;
var myBanana;
var dollar = 10;

function startGame() {
    myGamePiece = new component(50, 50, "GROCERY_BAG.png", 75, 430, "image");
    myBackground = new component(200, 480, "beltCloseUp.jpg", 0, 0, "background");
    myMoney = new component("40px", "Arial", "black", 220, 50, "text");
    myBanana = new component(30, 30, "yellow", 40, 40);
    myGameArea.start();
}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
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
}

function updateGameArea() {
    myGameArea.clear();
    myBackground.speedY = +1;
    myBackground.newPos();
    myBackground.update();
    myGamePiece.speedX = 0;

    if (myGameArea.key && myGameArea.key == 37 && myGamePiece.x > myBackground.x) {
        myGamePiece.speedX = -2;
    }
    if (myGameArea.key && myGameArea.key == 39 && myGamePiece.x < myBackground.width - myGamePiece.width) {
        myGamePiece.speedX = 2;
    }
    myGamePiece.newPos();
    myGamePiece.update();
    myBanana.speedY = 1;
    myBanana.newPos();
    myBanana.update();
    myMoney.text="MONEY:$ " + dollar;
    if (myGamePiece.crashWith(myBanana)) {
        dollar = dollar - 1;
    }
    myMoney.update();
}
function moveleft() {
    myGamePiece.speedX -= 2;
}

function moveright() {
    myGamePiece.speedX += 2;
}
function stopMove() {
    myGamePiece.speedX = 0;
}