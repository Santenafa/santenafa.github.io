function drawSprite(spriteNumber, x, y){
    ctx.drawImage(
        spriteSheet,
        spriteNumber*16,
        0,
        16,
        16,
        x*tileSize + shakeX,
        y*tileSize + shakeY,
        tileSize,
        tileSize
    );
}

function showTitle(){                                          
    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    gameState = new TitleState();

    drawText("TINY", 40, true, canvas.height/2 - 110, "white");
    drawText("BROUGHLIKE", 70, true, canvas.height/2 - 50, "white"); 

    drawScores();
}

function startGame(){                                           
    level = 1;
    score = 0;
    numSpells = 1;
    startLevel(startingHp);
    gameState = new GameplayState();
}

function startLevel(playerHp, playerSpells){   
    spawnRate = 15;
    spawnCounter = spawnRate;                       
    generateLevel();
    player = new Player(randomPassableTile());
    player.hp = playerHp;

    if(playerSpells){
        player.spells = playerSpells;
    }

    randomPassableTile().replace(Exit); 
}

class State{
    tick(){}
    draw(){}
    onKeyDown(e){}
}

class GameplayState extends State{
    tick(){
        for (let k = monsters.length-1; k>=0; k--) {
            const monster = monsters[k];
            if (monster.dead){
                monsters.splice(k,1);
            }else{
                monster.update();
            }
        }
        if(player.dead){
            addScore(score, false);
            gameState = new DeadState();
        }
        spawnCounter--;
        if(spawnCounter <= 0){  
            spawnMonster();
            spawnCounter = spawnRate;
            spawnRate--;
        }

        if(wasCoinPicked){
            spawnMonster();
            wasCoinPicked = false;
        }
    }

    draw(){
        drawGame();
    }

    onKeyDown(e){
        if(e.key=="w") player.tryMove(0,-1);
        if(e.key=="s") player.tryMove(0,1);
        if(e.key=="a") player.tryMove(-1,0);
        if(e.key=="d") player.tryMove(1,0);
        if(e.key>=1 && e.key<=9) player.castSpell(e.key-1);
    }
}
class DeadState extends State{
    tick(){}
    draw(){
        drawGame();
    }
    onKeyDown(e){
        showTitle();
    }
}
class TitleState extends State{
    tick(){}
    draw(){}
    onKeyDown(e){
        startGame();
    }
}
class LoadingState extends State{
    tick(){}
    draw(){
    }
}