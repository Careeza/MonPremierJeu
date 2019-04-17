let img = new Image();
img.src = "Perso.png";

const canvas = document.getElementById('canvas'); // <= Initialisation canvas memoire
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; // <= taille du canvas en largeur adapter a la fenetre
canvas.height = window.innerHeight; // <= taille du canvas en hauteur adapter a la fenetre

const ground = Math.round(canvas.height / 2);

document.addEventListener('keydown', (event) => {
	dealKey(event.key);
	event.preventDefault()
})

document.addEventListener('touchstart', (event) => {
	dealKey("ArrowUp");
	event.preventDefault()
})

const ennemies = []
let dist = 600;
let ennemySpeed = -10;

const square = {
	acc: {
		x: 0,
		y: 2
	},
	speed: {
		x: 0,
		y: 0
	},
	pos: {
		x: 100,
		y: ground
	},
	size: {
		x: 50,
		y: 50
	},
	ground: ground,
	newground: ground,
	jump: false,
	dbjump: false,
	score: 0,
	gameOn: true,
	bestscore: 0
}

img.onload = resetGame();

function createBird(x) {
	let birdHeight = Math.round(Math.random() * 100) + 300;

	const obj = {
		acc: {
			x: 0,
			y: 2
		},
		speed: {
			x: ennemySpeed - 5,
			y: 0
		},
		pos: {
			x: x,
			y: ground - birdHeight
		},
		size: {
			x: 50,
			y: 50
		},
		bird: true,
		ground: ground - birdHeight,
		newground: ground - birdHeight,
		jump: false,
		dbjump: false,
		suprisejump: -300
	}
	ennemies.push(obj);
}

function createEnnemy(x) {
	let size = Math.round(Math.random() * 200);

	const obj = {
		acc: {
			x: 0,
			y: 2
		},
		speed: {
			x: ennemySpeed,
			y: 0
		},
		pos: {
			x: x,
			y: ground - size
		},
		size: {
			x: 50,
			y: 50 + size
		},
		bird: false,
		ground: ground - size,
		newground: ground - size,
		saveframe: 0,
		jump: false,
		dbjump: false,
	}
	ennemies.push(obj);
}

function collision(ennemy) {
	if (square.pos.x < ennemy.pos.x + ennemy.size.x &&
	square.pos.x + square.size.x > ennemy.pos.x &&
	square.pos.y < ennemy.pos.y + ennemy.size.y &&
	square.pos.y + square.size.y > ennemy.pos.y) {
		return (false);
	}
	return (true);
}

function dealKey(key) {
	if (key === "ArrowUp" && !square.jmp) {
		if (square.gameOn) {
			square.jmp = true;
			square.speed.y = -30;
		} else {
			resetGame();
		}
	} else if (key === "ArrowUp" && square.jmp && !square.dbjump) {
		square.speed.y = -30;
		square.dbjump = true;
	}
	if (key === "ArrowDown") {
		square.acc.y = 50;
		square.jmp = false;
		square.dbjump = false;
	}
}

function mouvement(mvt) {
	mvt.speed.x += mvt.acc.x;
	mvt.pos.x += mvt.speed.x;
	mvt.speed.y += mvt.acc.y;
	mvt.pos.y += mvt.speed.y;
	console.log(square.speed.y);
	if (mvt.pos.y > mvt.ground) {
		mvt.jmp = false
		mvt.dbjump = false;
		square.acc.y = 2;
		mvt.pos.y = mvt.ground;
		if (mvt.speed.y > 0)
			mvt.speed.y = 0;
	}
}

function playerMouvement() {
	ctx.clearRect(square.pos.x, square.pos.y, square.size.x, square.size.y);
	mouvement(square);
//	square.size.y = 50 + Math.round(square.speed.y)
	ctx.fillStyle = 'black';
	ctx.drawImage(img, square.pos.x, square.pos.y, square.size.x, square.size.y);
}

function ennemyMouvement() {
	for (const [ index, ennemy ] of ennemies.entries()) {
		ennemy.speed.x = Math.round(ennemySpeed - (0.015 * square.score));
		if (ennemy.bird) {
			ennemy.speed.x = Math.round(ennemy.speed.x * 1.5);
		}
		if (ennemy.pos.x < 0) {
			if (ennemies[index].bird !== true) {
				createEnnemy(Math.round(ennemies[ennemies.length - 1].pos.x + dist + (0.33 * square.score)));
			} else {
				createBird(Math.round(ennemies[ennemies.length - 1].pos.x + dist + (0.33 * square.score)));
			}
			ennemies.splice(index, 1);
		} else {
			if (!ennemy.bird || square.score > 500) {
					ctx.clearRect(ennemy.pos.x, ennemy.pos.y, ennemy.size.x, ennemy.size.y);
					mouvement(ennemy)
					ctx.fillStyle = 'red';
					ennemy.pos.x > 0 && ctx.fillRect(ennemy.pos.x, ennemy.pos.y, ennemy.size.x, ennemy.size.y);
				}
			}
		if (!collision(ennemy)) {
			return (false);
		}
	}
	return (true);
}

function resetGame() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ennemies.splice(0, ennemies.length);
	let distance = 0;
	let num = 1200;
	while (num <= 7200) {
		createEnnemy(num);
		num += dist + (distance * 50);
		distance++;
	}
	distance = 0;
	num = 3000;
	while (num <= 7200) {
		createBird(num);
		num += Math.round((dist * 1.5) + (distance * 25));
		distance++;
	}
	ctx.fillStyle = 'black';
	ctx.fillRect(0, ground + 50, canvas.width, 10);
	square.score = 0;
	square.gameOn = true;
	game();
}

function gameOver() {
	square.dbjump = false;
	square.jmp = false;
	square.size.y = 50;
	square.pos.y = ground;
	square.speed.y = 0;
	square.newground = ground;
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.font = '100px Quicksand';
	ctx.fillStyle = 'red';
	ctx.textAlign = "center"; 
	ctx.fillText(`Game Over Score = ${square.score}`, canvas.width / 2, canvas.height / 2);
	if (square.score > square.bestscore) {
		square.bestscore = square.score;
	}
}

function score() {
	ctx.fillStyle = 'black';
	ctx.clearRect(0, 0, 300, 21);
	ctx.font = '20px Quicksand';
	square.score++;
	ctx.textAlign = "left"; 
	if (square.score < square.bestscore) {
		ctx.fillText(`Score: ${square.score}, Bestscore: ${square.bestscore}`, 0, 18)
	} else {
		ctx.fillText(`Score: ${square.score}, Bestscore: new best`, 0, 18)
	}
}

function game() {
	score();
	playerMouvement();
	if (!ennemyMouvement()) {
		gameOver();
		square.gameOn = false;
	}
	square.gameOn && requestAnimationFrame(game);
}
