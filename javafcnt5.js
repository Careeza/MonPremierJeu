let img = new Image();
img.src = "./44497.png";

const canvas = document.getElementById('canvas'); // <= Initialisation canvas memoire
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; // <= taille du canvas en largeur adapter a la fenetre
canvas.height = window.innerHeight; // <= taille du canvas en hauteur adapter a la fenetre

const ground = Math.round(canvas.height / 4) * 3;

document.addEventListener('keydown', (event) => {
	dealKey(event.key);
	event.preventDefault()
})

const ennemies = []
let dist = 300;
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
	size: 50,
	frame: 0,
	ground: ground,
	newground: ground,
	saveframe: 0,
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
		frame: 0,
		ground: ground - birdHeight,
		newground: ground - birdHeight,
		saveframe: 0,
		jump: false,
		dbjump: false,
		suprisejump: -300
	}
	ennemies.push(obj);
}

function createEnnemy(x) {
	let size = Math.round(Math.random() * 100);

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
		frame: 0,
		ground: ground - size,
		newground: ground - size,
		saveframe: 0,
		jump: false,
		dbjump: false,
		suprisejump: 300
	}
	if (Math.round(Math.random() * 10) > 1) {
		obj.suprisejump = -600;
	}
	ennemies.push(obj);
}

function collision(ennemy) {
	if (square.pos.x < ennemy.pos.x + ennemy.size.x &&
	square.pos.x + square.size > ennemy.pos.x &&
	square.pos.y < ennemy.pos.y + ennemy.size.y &&
	square.pos.y + square.size > ennemy.pos.y) {
		return (false);
	}
	return (true);
}

function dealKey(key) {
	if (key === "ArrowUp" && !square.jmp) {
		if (square.gameOn) {
			square.jmp = true;
			square.speed.y = 30;
			square.frame = 0;
		} else {
			resetGame();
		}
	} else if (key === "ArrowUp" && square.jmp && !square.dbjump) {
		square.newground = square.pos.y;
		square.saveframe = square.frame;
		square.speed.y = 30;
		square.frame = 0;
		square.dbjump = true;
	}
	if (key === "ArrowDown") {
		ctx.clearRect(square.pos.x, square.pos.y, square.size, square.size);
		square.speed.y = 0;
		square.frame = 0;
		square.pos.y = ground;
		square.newground = ground;
		square.jmp = false;
		square.dbjump = false;
	}
}

function mouvement(mvt) {
	mvt.pos.x = mvt.pos.x + mvt.speed.x;
	mvt.pos.y = ((mvt.acc.y / 2) * (mvt.frame ** 2) - (mvt.speed.y * mvt.frame) + mvt.newground);
	if (mvt.pos.y > mvt.ground) {
		mvt.jmp = false
		mvt.dbjump = false;
		mvt.newground = mvt.ground;
		mvt.pos.y = mvt.ground;
	}
	mvt.jmp && mvt.frame++;
}

function playerMouvement() {
	ctx.clearRect(square.pos.x, square.pos.y, square.size, square.size);
	mouvement(square)
	ctx.fillStyle = 'black';
//	ctx.fillRect(square.pos.x, square.pos.y, square.size, square.size);
	ctx.drawImage(img, square.pos.x, square.pos.y, square.size, square.size);
}

function ennemyMouvement() {
	for (const [ index, ennemy ] of ennemies.entries()) {
		ennemy.speed.x = Math.round(ennemySpeed - (0.02 * square.score));
		if (ennemy.bird) {
			ennemy.speed.x = Math.round(ennemy.speed.x * 1.5);
		}
		if (ennemy.pos.x == ennemy.suprisejump)
		{
			ennemy.jmp = true;
			ennemy.speed.y = 30;
			ennemy.frame = 0;
		}
		if (ennemy.pos.x < 0) {
			if (ennemies[index].bird !== true) {
				createEnnemy(Math.round(ennemies[ennemies.length - 1].pos.x + dist + (0.66 * square.score)));
			} else {
				createBird(Math.round(ennemies[ennemies.length - 1].pos.x + dist + (0.66 * square.score)));
			}
			ennemies.splice(index, 1);
		} else {
			ctx.clearRect(ennemy.pos.x, ennemy.pos.y, ennemy.size.x, ennemy.size.y);
			mouvement(ennemy)
			ctx.fillStyle = 'red';
			ennemy.pos.x > 0 && ctx.fillRect(ennemy.pos.x, ennemy.pos.y, ennemy.size.x, ennemy.size.y);
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
	while (num <= 3600 ) {
		if (distance % 2 == 0) {
		createEnnemy(num);
		} else {
			createBird(num);
		}
		num += dist + (distance * 25);
		distance++;
	}
	ctx.fillStyle = 'black';
	ctx.fillRect(0, ground + square.size, canvas.width, 10);
	square.score = 0;
	square.gameOn = true;
	game();
}

function gameOver() {
	square.dbjump = false;
	square.jmp = false;
	square.pos.y = ground;
	square.speed.y = 0;
	square.frame = 0;
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
	ctx.fillText(`Score: ${square.score}, Bestscore: ${square.bestscore}`, 0, 18);
	square.score++;
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
