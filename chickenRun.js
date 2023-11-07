// Epic Chicken!


let time = new Date();
let deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
}else{
    document.addEventListener("DOMContentLoaded", Init); 
}

function Init(){
    time = new Date();
    Start();
    Loop();
}

function Loop(){
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

// Lógicas del juego

let sueloY = 22;
let velY = 0;
let impulso = 900;
let gravedad = 2500;

let chickenPosX = 75; 
let chickenPosY = sueloY;

let sueloX = 0;
let velEscenario = 1280/3;
let gameVel = 1;

let score = 0;

let parado = false;
let saltando = false;

let contenedor;
let chicken;
let textoScore;
let suelo;
let gameOver;



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

function MoverSuelo(){
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento(){
    return velEscenario * deltaTime * gameVel;

}