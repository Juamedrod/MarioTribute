let escenario = document.querySelector('#escenario');
let mario = document.querySelector('#runner img');
let gameOverDiv = document.querySelector('.gameover');
let runner = document.querySelector('#runner');
let avanceEscenario = 0;
let malosArray = new Array();
let proyectiles = new Array();

let vidas = 3;
let uniqueId = 0;
let intervaloEscenario = setInterval(moverEscenario, 100);

document.addEventListener('keydown', saltar);
document.addEventListener('keyup', correr);
document.addEventListener('keyup', disparar);

//var seta = setTimeout(salirSeta, 5000);
let tiempoIntervalo = Math.random() * 5000;
let seta = setInterval(salirSeta, tiempoIntervalo);


function moverEscenario() {
    avanceEscenario -= 10;
    escenario.style.backgroundPosition = avanceEscenario + 'px 0px';
    proyectilCheck();
    //moveEnemies(); REMOVER COENTARIO VERSION FINAL

}

function saltar(e) {
    switch (e.keyCode) {
        case 32:
            mario.src = "images/salto.gif";
            mario.style.display = 'inline-block';
            mario.style.paddingBottom = "100px";
            break;
    }

}

function correr(e) {
    switch (e.keyCode) {
        case 32:
            mario.src = "images/mario.gif";
            mario.style.paddingBottom = "0px";
            break;
    }
}

function disparar(e) {
    if (e.keyCode == 69 && proyectiles.length < 2) {
        let proyectil = document.createElement('div');
        proyectil.style.marginLeft = '80px';
        proyectil.className = 'proyectil';
        proyectiles.push(proyectil)
        runner.appendChild(proyectil);
    }

}


function salirSeta() {
    let malo = document.createElement('div');
    malo.style.marginRight = '0px';
    malo.className = 'malo';
    malosArray.push(malo)
    escenario.appendChild(malo);

}

function moveEnemies() {
    //me quedé aqui, tengo que recorrer el array de enemigos y moverlos
    malosArray.forEach((malo, index) => {

        let actualOffset = parseInt(malo.style.marginRight.slice(0, -2));
        console.log(actualOffset);
        if (colision(mario, malo)) {
            vidas > 1 ? dañar(malo) : gameOver()
        } else if (actualOffset <= 850) {
            actualOffset += 15;
            console.log(actualOffset);
            malo.style.marginRight = actualOffset + 'px';
        } else {
            malo.parentNode.removeChild(malo);
            malosArray.splice(index, 1);
        }
    });
}

function proyectilCheck() {
    proyectiles.forEach((proyectil, proyIndex) => {
        malosArray.forEach((malo, index) => {
            if (colision(proyectil, malo)) {
                malo.parentNode.removeChild(malo);
                malosArray.splice(index, 1);
                proyectil.parentNode.removeChild(proyectil);
                proyectiles.splice(proyIndex, 1);
            }
        });

        //check si el proyectil sale de mapa

    })


}

function dañar(malo, index) {
    malo.parentNode.removeChild(malo);
    malosArray.splice(index, 1);
    vidas--;
}

function gameOver() {
    console.log('game over');
    gameOverDiv.style.display = 'block';
    clearInterval(seta);
    clearInterval(intervaloEscenario);
}


function colision(a, b) {
    const rect1 = a.getBoundingClientRect();
    const rect2 = b.getBoundingClientRect();
    const isInHoriztonalBounds =
        rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
    const isInVerticalBounds =
        rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
    return isOverlapping;
}
