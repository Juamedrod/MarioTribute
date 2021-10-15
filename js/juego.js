let escenario = document.querySelector('#escenario');
let mario = document.querySelector('#runner img');
let gameOverDiv = document.querySelector('.gameover');
let runner = document.querySelector('#runner');
let score = document.querySelector('#score');
let avanceEscenario = 0;
let malosArray = new Array();
let proyectiles = new Array();
let bossTargets = new Array();//array que contiene al boss y todas las refereencias a sus esbirros


//Gameplay vars
let vidas = 3;
let vidaBoss = 9;
let jumping = false;
let enemigosDestruidos = 0;
const enemigosHastaBoss = 15;
let isBossPhase = false;

//Boss vars



document.addEventListener('keydown', saltar);
document.addEventListener('keyup', correr);
document.addEventListener('keyup', disparar);

//var seta = setTimeout(salirSeta, 5000);

let intervaloEscenario = setInterval(moverEscenario, 100);

let tiempoIntervalo = Math.random() * 5000 + 200;
let seta = setInterval(salirSeta, tiempoIntervalo);//intervalo de spawn de setas en el modo normal
score.innerText = `Enemy killed: ${enemigosDestruidos}
SHOT WITH E KEY`;

function moverEscenario() {//intervalo global que gobierna los aspectos basicos del juego.
    avanceEscenario -= 10;
    escenario.style.backgroundPosition = avanceEscenario + 'px 0px';
    isBossPhase ? proyectilCheckBoss() : proyectilCheck();
    isBossPhase ? moveBossTargets() : moveEnemies();

}

function intervaloBoss() {//cuando entramos en la fase dle boss final este es el intervalo de spawn de ataques
    bossattack();
}

function saltar(e) {
    switch (e.keyCode) {
        case 32:
            mario.src = "images/salto.gif";
            mario.style.display = 'inline-block';
            mario.style.marginBottom = "100px";
            jumping = true;
            console.log('Estoy saltando? ', jumping);
            break;
    }
}

function correr(e) {
    switch (e.keyCode) {
        case 32:
            mario.src = "images/mario.gif";
            mario.style.marginBottom = "0px";
            jumping = false;
            console.log('Estoy saltando? ', jumping);
            break;
    }

}


function finalBossStage() {  //Set the game to the final boss stage phase, the migthy gaming mouse railing hadoukens

    clearInterval(seta);
    isBossPhase = true;
    setTimeout(() => {
        let boss = document.createElement('div');
        let imgBoss = document.createElement('img');
        let p = document.createElement('p');
        p.innerText = 'Vidas: ' + vidaBoss;
        p.className = 'scoreboss';
        imgBoss.src = "images/mouse.gif"
        boss.style.marginRight = '0px';
        boss.className = 'boss';
        boss.appendChild(imgBoss);
        boss.appendChild(p);
        escenario.appendChild(boss);
        bossTargets.push(boss);
        setInterval(intervaloBoss, 1000);
    }, 2000);

}

function disparar(e) {//disparo del proyectil
    if (e.keyCode == 69 && proyectiles.length < 2 && !jumping) {
        let proyectil = document.createElement('div');
        proyectil.style.marginLeft = '80px';
        proyectil.className = 'proyectil';
        proyectiles.push(proyectil)
        runner.appendChild(proyectil);
        console.log(jumping);
        if (jumping) proyectil.style.Bottom = "100px";
    }

}


function salirSeta() { //spawn de setas
    let malo = document.createElement('div');
    malo.style.marginRight = '0px';
    malo.className = 'malo';
    malosArray.push(malo)
    escenario.appendChild(malo);

}

function moveEnemies() {//muevo los enemigos en el array de enemigos.

    malosArray.forEach((malo, index) => {

        let actualOffset = parseInt(malo.style.marginRight.slice(0, -2));

        if (colision(mario, malo)) {
            vidas > 1 ? dañar(malo) : gameOver()
        } else if (actualOffset <= 850) {

            actualOffset += 15;
            malo.style.marginRight = actualOffset + 'px';
        } else {
            malo.parentNode.removeChild(malo);
            malosArray.splice(index, 1);

        }
    });
}

function bossattack() {
    let bossTarget = document.createElement('div');
    bossTarget.style.marginRight = '0px';
    bossTarget.className = 'bosstarget';
    bossTargets.push(bossTarget)
    escenario.appendChild(bossTarget);
}

function moveBossTargets() {
    bossTargets.forEach((bossTarget, index) => {
        console.log('index del bosstarget: ' + index);
        if (index > 0) {
            let actualOffset = parseInt(bossTarget.style.marginRight.slice(0, -2));

            if (colision(mario, bossTarget)) {
                vidas > 1 ? dañar(bossTarget) : gameOver()
            } else if (actualOffset <= 850) {

                actualOffset += 20;
                bossTarget.style.marginRight = actualOffset + 'px';
            } else {
                bossTarget.parentNode.removeChild(bossTarget);
                bossTargets.splice(index, 1);

            }
        }

    });


}


function proyectilCheck() {  //Check de las colisiones de los proyectiles y el update de su posicion.
    proyectiles.forEach((proyectil, proyIndex) => {
        malosArray.forEach((malo, index) => {
            if (colision(proyectil, malo)) {
                console.log('proyectil hit');
                malo.parentNode.removeChild(malo);
                malosArray.splice(index, 1);
                proyectil.parentNode.removeChild(proyectil);
                proyectiles.splice(proyIndex, 1);
                enemigosDestruidos++;
                score.innerText = `Enemy killed: ${enemigosDestruidos} 
                SHOT WITH E KEY`;
                if (enemigosDestruidos >= enemigosHastaBoss && !isBossPhase) finalBossStage();
            }
        });
    })

    proyectiles.forEach((proyectil, proyIndex) => {

        let actualOffset = parseInt(proyectil.style.marginLeft.slice(0, -2));
        if (actualOffset <= 850) {
            actualOffset += 25;
            proyectil.style.marginLeft = actualOffset + 'px';
        } else {
            proyectil.parentNode.removeChild(proyectil);
            proyectiles.splice(proyIndex, 1);

        }
    })

}

function proyectilCheckBoss() {

    proyectiles.forEach((proyectil, proyIndex) => {
        bossTargets.forEach((bosstarget, index) => {
            if (colision(proyectil, bosstarget)) {
                console.log('proyectil hit');
                if (index == 0) {
                    vidaBoss--;
                    proyectil.parentNode.removeChild(proyectil);
                    proyectiles.splice(proyIndex, 1);
                    let p = document.querySelector('.scoreboss');
                    p.innerText = 'Vidas: ' + vidaBoss;
                    vidaBoss > 1 ? 1 : victory();

                } else {

                    bosstarget.parentNode.removeChild(bosstarget);
                    bossTargets.splice(index, 1);
                    proyectil.parentNode.removeChild(proyectil);
                    proyectiles.splice(proyIndex, 1);
                }


            }
        });
    })

    proyectiles.forEach((proyectil, proyIndex) => {

        let actualOffset = parseInt(proyectil.style.marginLeft.slice(0, -2));
        if (actualOffset <= 850) {
            actualOffset += 25;
            proyectil.style.marginLeft = actualOffset + 'px';
        } else {
            proyectil.parentNode.removeChild(proyectil);
            proyectiles.splice(proyIndex, 1);

        }
    })

}

function dañar(malo, index) {
    malo.parentNode.removeChild(malo);
    malosArray.splice(index, 1);
    vidas--;
}

function gameOver() {//pantalla de game over y paro los intervalos
    console.log('game over');
    gameOverDiv.style.display = 'block';
    clearInterval(seta);
    clearInterval(intervaloEscenario);
}

function victory() {
    console.log('Victoria');
    gameOverDiv.style.display = 'block';
    gameOverDiv.style.backgroundColor = 'green';
    let p = document.querySelector('.gameover p').innerText = '¡¡¡¡¡¡¡VICTORY!!!!!!!'
    clearInterval(seta);
    clearInterval(intervaloEscenario);
}

function clearBadGuys() {
    malosArray.forEach((m, index) => {
        m.parentNode.removeChild(m);
        malosArray.splice(index, 1);
    })
}

function colision(a, b) {  //Detector de colisiones entre objetos HTML
    const rect1 = a.getBoundingClientRect();
    const rect2 = b.getBoundingClientRect();
    const isInHoriztonalBounds =
        rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
    const isInVerticalBounds =
        rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
    return isOverlapping;
}
