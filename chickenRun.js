// Epic Chicken!


const sueloY = 22;
const velY = 0;
const impulso = 900;
const gravedad = 2500;

const chickePosX = 75;
const chickePosY = sueloY;

const sueloX = 0;
const velEscenario = 1280/3;
const gameVel = 1;

let score = 0;

let parado = false;
let saltando = false;

const contenedor;
const chicken;
const textoScore;
const suelo;
const gameOver;

function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".textoScore");
    chicken = document.querySelector(".chicken");
}


function Update() {
     

    MoverSuelo();
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;

}