// Epic Chicken!

// Variables

let sueloY = 32;
let velY = 0;
let impulso = 1400;
let gravedad = 4400;

let chickenPosX = 125;
let chickenPosY = sueloY;

let sueloX = 0;
let velEscenario = 1280 / 3;
let gameVel = 1;
let score = 0;

let parado = false;
let saltando = false;

let tiempoHastaObstaculo = 2;
let tiempoObstaculoMin = 0.7;
let tiempoObstaculoMax = 1.8;
let obstaculoPosY = 16;
let obstaculos = [];

let tiempoHastaNube = 0.5;
let tiempoNubeMin = 0.7;
let tiempoNubeMax = 2.7;
let maxNubeY = 270;
let minNubeY = 100;
let nubes = [];
let velNube = 0.5;

let contenedor;
let chicken;
let textoScore;
let suelo;
let gameOver;
let gameOverText;

// Configuración del bucle

let time = new Date();
let deltaTime = 0;

if (
	document.readyState === "complete" ||
	document.readyState === "interactive"
) {
	setTimeout(Init, 1);
} else {
	document.addEventListener("DOMContentLoaded", Init);
}

function Init() {
	time = new Date();
	Start();
	Loop();
}

function Loop() {
	deltaTime = (new Date() - time) / 1000;
	time = new Date();
	Update();
	requestAnimationFrame(Loop);
}

// Lógicas del juego

function Start() {
	gameOver = document.querySelector(".game-over");
	gameOverText = document.querySelector(".game-over-text");
	suelo = document.querySelector(".suelo");
	contenedor = document.querySelector(".contenedor");
	textoScore = document.querySelector(".score");
	chicken = document.querySelector(".chicken");
	document.addEventListener("keydown", HandleKeyDown);
	document
		.querySelector(".game-over")
		.addEventListener("click", reiniciarJuego);
}

function Update() {
	if (parado) return;

	MoverGallina();
	MoverSuelo();
	DecidirCrearObstaculos();
	DecidirCrearNubes();
	MoverObstaculos();
	MoverNubes();
	DetectarColision();

	velY -= gravedad * deltaTime;
}

function HandleKeyDown(ev) {
	if (ev.keyCode == 32) {
		Saltar();
	}
}

function Saltar() {
	if (chickenPosY === sueloY) {
		saltando = true;
		velY = impulso;
		chicken.classList.remove("chicken-running");
	}
}

function MoverGallina() {
	chickenPosY += velY * deltaTime;
	if (chickenPosY < sueloY) {
		TocarSuelo();
	}
	chicken.style.bottom = chickenPosY + "px";
}

function TocarSuelo() {
	chickenPosY = sueloY;
	velY = 0;
	if (saltando) {
		chicken.classList.add("chicken-running");
	}
	saltando = false;
}

function MoverSuelo() {
	sueloX += CalcularDesplazamiento();
	suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
	return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
	chicken.classList.remove("chicken-running");
	chicken.classList.add("chicken-estrellado");
	parado = true;
}

function DecidirCrearObstaculos() {
	tiempoHastaObstaculo -= deltaTime;
	if (tiempoHastaObstaculo <= 0) {
		CrearObstaculo();
	}
}

function DecidirCrearNubes() {
	tiempoHastaNube -= deltaTime;
	if (tiempoHastaNube <= 0) {
		CrearNube();
	}
}

/* function CrearObstaculo() {
	let obstaculo = document.createElement("div");
	contenedor.appendChild(obstaculo);
	obstaculo.classList.add("cactus");
	if (Math.random() > 0.5) obstaculo.classList.add("cactus2");
	obstaculo.posX = contenedor.clientWidth;
	obstaculo.style.left = contenedor.clientWidth + "px";

	obstaculos.push(obstaculo);
	tiempoHastaObstaculo =
		tiempoObstaculoMin +
		(Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin)) / gameVel;
} */

function CrearObstaculo() {
	let obstaculo = document.createElement("div");
	contenedor.appendChild(obstaculo);

	// Lista de clases de obstáculos
	const clasesObstaculos = [
		"obstaculoGrill",
		"obstaculoPlanta",
		"obstaculoFuego",
		"obstaculoGodzilla",
		"obstaculoBarril",
		"obstaculoDino",
		"obstaculoBender",
		"obstaculoNelson",
	];

	// Selecciona aleatoriamente una clase de la lista
	const claseSeleccionada =
		clasesObstaculos[Math.floor(Math.random() * clasesObstaculos.length)];
	console.log(claseSeleccionada);
	obstaculo.classList.add(claseSeleccionada);
	obstaculo.posX = window.innerWidth;
	obstaculo.style.left = window.innerWidth + "px";

	obstaculos.push(obstaculo);

	tiempoHastaObstaculo =
		tiempoObstaculoMin +
		(Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin)) / gameVel;
}

function CrearNube() {
	let nube = document.createElement("div");
	contenedor.appendChild(nube);
	nube.classList.add("nube");
	nube.posX = contenedor.clientWidth;
	nube.style.left = contenedor.clientWidth + "px";
	nube.style.bottom = minNubeY + Math.random() * (maxNubeY - minNubeY) + "px";

	nubes.push(nube);
	tiempoHastaNube =
		tiempoNubeMin + (Math.random() * (tiempoNubeMax - tiempoNubeMin)) / gameVel;
}

function MoverObstaculos() {
	for (let i = obstaculos.length - 1; i >= 0; i--) {
		if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
			obstaculos[i].parentNode.removeChild(obstaculos[i]);
			obstaculos.splice(i, 1);
			GanarPuntos();
		} else {
			obstaculos[i].posX -= CalcularDesplazamiento();
			obstaculos[i].style.left = obstaculos[i].posX + "px";
		}
	}
}

function MoverNubes() {
	for (let i = nubes.length - 1; i >= 0; i--) {
		if (nubes[i].posX < -nubes[i].clientWidth) {
			nubes[i].parentNode.removeChild(nubes[i]);
			nubes.splice(i, 1);
		} else {
			nubes[i].posX -= CalcularDesplazamiento() * velNube;
			nubes[i].style.left = nubes[i].posX + "px";
		}
	}
}

function GanarPuntos() {
	score++;
	textoScore.innerText = score;
	if (score == 0) {
		gameVel = 1.25;
		contenedor.classList.add("morning");
	} else if (score == 5) {
		gameVel = 1.25;
		contenedor.classList.add("mediodia");
	} else if (score == 10) {
		gameVel = 1.5;
		contenedor.classList.add("tarde");
	} else if (score == 15) {
		gameVel = 1.5;
		contenedor.classList.add("noche");
	} else if (score == 22) {
		gameVel = 2;
		contenedor.classList.remove("noche", "tarde", "mediodia");
	} else if (score == 30) {
		gameVel = 2.5;
		contenedor.classList.add("mediodia");
	} else if (score == 37) {
		gameVel = 3;
		contenedor.classList.add("tarde");
	} else if (score == 45) {
		gameVel = 3.5;
		contenedor.classList.add("noche");
	} else if (score == 60) {
		gameVel = 4;
		contenedor.classList.remove("noche", "tarde", "mediodia");
	} else if (score == 80) {
		gameVel = 6;
		contenedor.classList.add("mediodia");
	}
		suelo.style.animationDuration = 3 / gameVel + "s";
}

function GameOver() {
	Estrellarse();
	gameOver.style.display = "block";
	gameOver.classList.add("mostrar");
	gameOverText.style.display = "block";
	gameOverText.classList.add("mostrar");
}

function DetectarColision() {
	for (let i = 0; i < obstaculos.length; i++) {
		if (obstaculos[i].posX > chickenPosX + chicken.clientWidth) {
			//EVADE
			break; //al estar en orden, no puede chocar con más
		} else {
			if (IsCollision(chicken, obstaculos[i], 10, 30, 15, 20)) {
				GameOver();
			}
		}
	}
}

function IsCollision(
	a,
	b,
	paddingTop,
	paddingRight,
	paddingBottom,
	paddingLeft
) {
	let aRect = a.getBoundingClientRect();
	let bRect = b.getBoundingClientRect();

	return !(
		aRect.top + aRect.height - paddingBottom < bRect.top ||
		aRect.top + paddingTop > bRect.top + bRect.height ||
		aRect.left + aRect.width - paddingRight < bRect.left ||
		aRect.left + paddingLeft > bRect.left + bRect.width
	);
}

function reiniciarJuego() {
	location.reload();
}
