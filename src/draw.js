function drawGame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    screenShake();

    //ctx.fillRect (x*tileSize,y*tileSize,tileSize,tileSize);
    for(let i=0;i<numTiles;i++){
        for(let j=0;j<numTiles;j++){
            getTile(i,j).draw();
        }
    }

    for(let i=0;i<monsters.length;i++){
        monsters[i].draw();
    }
    
    player.draw();

    drawText("Level: "+level+"/"+numLevels, 30, false, 40, "violet");
    drawText("Score: "+score, 30, false, 70, "gold");

    for(let i=0; i<player.spellsBook.length; i++){
        let spellText = (i+1) + ") " + (player.spellsBook[i] || "");                        
        drawText(spellText, 20, false, 110+i*40, "aqua");  
    } 
}

function screenShake(){
    if(shakeAmount > 0){
        shakeAmount--;
    }
    let shakeAngle = Math.random()*Math.PI*2;
    shakeX = Math.round(Math.cos(shakeAngle)*shakeAmount);
    shakeY = Math.round(Math.sin(shakeAngle)*shakeAmount);
}

function drawText(text, size, centered, textY, color){
    ctx.fillStyle = color;
    ctx.font = size + "px monospace";
    let textX;
    if(centered){
        textX = (canvas.width-ctx.measureText(text).width)/2;
    }else{
        textX = canvas.width-uiWidth*tileSize+25;
    }
    ctx.fillText(text, textX, textY);
}