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
let suelo;

let epicBanner;
let textoScore;
let muteButton;

let pantallaInicio;
let botonInicio;

let gameOver;
let gameReload;

// Configuración de estado de inicio

let startGame = false;

// Configuración del bucle y condicionales de pantallas de inicio

let time = new Date();
let deltaTime = 0;

document.addEventListener("DOMContentLoaded", function () {
	pantallaInicio = document.querySelector(".start-screen");
	botonInicio = document.querySelector(".start-button");
	contenedor = document.querySelector(".contenedor");


	function iniciarJuego() {
		startGame = true;
		GameStart();
	}

	botonInicio.addEventListener("click", iniciarJuego);

	if (
		document.readyState === "complete" ||
		document.readyState === "interactive"
	) {
		setTimeout(GameStart, 1);
	}

	document.addEventListener("keydown", function (event) {
		if (event.keyCode === 32) {
			if (startGame === false) {
				iniciarJuego();
			}
		}
	});
}); 

function GameStart() {
	if (startGame === false) {
		pantallaInicio.style.display = "block";
		pantallaInicio.style.position = "absolute";
		textoScore = document.querySelector(".score");
		textoScore.style.display = "none";
		epicBanner = document.querySelector(".epic-banner");
		epicBanner.style.display = "none";
		chicken = document.querySelector(".chicken");
		chicken.style.display = "none";

		parado = true;
	} else {
		Init();
	}
}

function Init() {
	pantallaInicio.style.display = "none";
	contenedor.style.display = "block";

	startGame = true;
	parado = false;
	time = new Date();
	Start();
	Loop();

	console.log("Init called");
}

function Loop() {
	deltaTime = (new Date() - time) / 1000;
	time = new Date();
	Update();
	requestAnimationFrame(Loop);
}

// Lógicas de inicio del juego

function Start() {
	suelo = document.querySelector(".suelo");
	contenedor = document.querySelector(".contenedor");
	textoScore = document.querySelector(".score");
	textoScore.style.display = "block";
	epicBanner = document.querySelector(".epic-banner");
	epicBanner.style.display = "block";
	chicken = document.querySelector(".chicken");
	chicken.classList.remove("chicken-estrellado");
	chicken.classList.add("chicken-running");
	chicken.style.display = "block";
	document.addEventListener("keydown", HandleSpaceDown); // Keydown para salto
	gameOver = document.querySelector(".game-over");
	gameReload = document.querySelector(".game-reload");
	gameReload.addEventListener("click", GameReload);
	muteButton = document.querySelector("#boton-Mute");
	muteButton.style.display = "block";
	reproducirMusica();

	console.log("Start called");
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

// Configuración del audio

const audio = document.getElementById("chicken-sound");
function reproducirMusica() {
	audio.volume = 0.25;
	audio.play();
}
function pausarMusica() {
	audio.pause();
}
document.getElementById("boton-Mute").addEventListener("click", pausarMusica);

// Lógicas de funciones del juego

function HandleSpaceDown(ev) {
	let keyValue = ev.key;
	let codeValue = ev.code;
	if (ev.keyCode == 32) {
		Saltar();
		console.log(
			"keyValue: " +
				keyValue +
				" codeValue: " +
				codeValue +
				" ------------Jump!!"
		);
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
		"obstaculoBbq",
		"obstaculoRodillo",
		"obstaculoDientes",
		"obstaculoBbq",
		"obstaculoRodillo",
		"obstaculoDientes",
		"obstaculoBbq",
		"obstaculoRodillo",
		"obstaculoDientes",
		"obstaculoGodzilla",
	];

	// Selecciona aleatoriamente una clase de la lista
	const claseSeleccionada =
		clasesObstaculos[Math.floor(Math.random() * clasesObstaculos.length)];
	obstaculo.classList.add(claseSeleccionada);
	console.log(claseSeleccionada);
	obstaculo.posX = window.innerWidth;
	obstaculo.style.left = window.innerWidth + "px";

	obstaculos.push(obstaculo);

	tiempoHastaObstaculo =
		tiempoObstaculoMin +
		(Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin)) / gameVel;
}

function CrearNube() {
	if (score <= 5) {
		let nube = document.createElement("div");
		contenedor.appendChild(nube);
		nube.classList.add("nube");
		nube.posX = contenedor.clientWidth;
		nube.style.left = contenedor.clientWidth + "px";
		nube.style.bottom = minNubeY + Math.random() * (maxNubeY - minNubeY) + "px";

		nubes.push(nube);
		tiempoHastaNube =
			tiempoNubeMin +
			(Math.random() * (tiempoNubeMax - tiempoNubeMin)) / gameVel;
	} else {
	}
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
	console.log(score);
	textoScore.innerText = score;
	if (score == 0) {
		gameVel = 1.25;
	} else if (score == 5) {
		gameVel = 1.3;
		contenedor.classList.add("mediodia");
	} else if (score == 10) {
		gameVel = 1.5;
		contenedor.classList.add("tarde");
	} else if (score == 15) {
		gameVel = 1.65;
		contenedor.classList.add("noche");
	} else if (score == 20) {
		gameVel = 1.85;
		contenedor.classList.remove("noche", "tarde", "mediodia");
	} else if (score == 27) {
		gameVel = 2;
		contenedor.classList.add("mediodia");
	} else if (score == 34) {
		gameVel = 2.3;
		contenedor.classList.add("tarde");
	} else if (score == 41) {
		gameVel = 2.6;
		contenedor.classList.add("noche");
	} else if (score == 48) {
		gameVel = 3;
		contenedor.classList.remove("noche", "tarde", "mediodia");
	} else if (score == 55) {
		gameVel = 3.5;
		contenedor.classList.add("mediodia");
	} else if (score == 65) {
		contenedor.classList.add("tarde");
	} else if (score == 75) {
		gameVel = 4;
		contenedor.classList.add("noche");
	} else if (score == 85) {
		contenedor.classList.remove("noche", "tarde", "mediodia");
	} else if (score == 100) {
		contenedor.classList.add("caos");
		gameVel = 5;
	} else if (score == 120) {
		contenedor.classList.remove("caos");
		contenedor.classList.add("recaos");
	} else if (score == 150) {
		contenedor.classList.remove("recaos");
		contenedor.classList.add("death");
	} else if (score == 200) {
		gameVel = 6;

		suelo.style.animationDuration = 3 / gameVel + "s";
	}
}

// Logicas de colisión

function Estrellarse() {
	chicken.classList.remove("chicken-running");
	chicken.classList.add("chicken-estrellado");
	parado = true;
	console.log("Estrellarse called");
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

//

function GameOver() {
	Estrellarse();
	pausarMusica();
	document.addEventListener("keydown", function (event) {
		if (event.keyCode === 32) {
			GameReload();
		}
	});
	gameOver.style.display = "block";
	gameReload.style.display = "block";
	muteButton.style.display = "none";
	epicBanner.style.display = "none";
}

function GameReload() {
	//reiniciar la aplicación
	location.reload(true);
	/* 	console.log("GameReload called");
	sueloY = 32;
	velY = 0;
	chickenPosX = 125;
	chickenPosY = sueloY;
	sueloX = 0;
	velEscenario = 1280 / 3;
	gameVel = 1;
	score = 0;
	parado = false;
	saltando = false;
	tiempoHastaObstaculo = 2;
	tiempoHastaNube = 0.5;


	scoreContainer = document.querySelector(".scoreContainer");
	scoreContainer.style.display = "none";
	// Eliminar obstácu los y nubes existentes
	for (let i = 0; i < obstaculos.length; i++) {
		obstaculos[i].parentNode.removeChild(obstaculos[i]);
	}
	obstaculos = [];

	for (let i = 0; i < nubes.length; i++) {
		nubes[i].parentNode.removeChild(nubes[i]);
	}
	nubes = [];

	// Restablecer tiempo
	time = new Date();
	deltaTime = 0;

	// Ocultar elementos de Game Over
	gameOver.style.display = "none";
	gameReload.style.display = "none";

	// Ocultar a la gallina
	chicken = document.querySelector(".chicken");
	chicken.style.display = "none";

	// Volver a la pantalla de inicio
	startGame = false;
	parado = true;
	pantallaInicio.style.display = "block";
	pantallaInicio.style.position = "absolute"; */
}
