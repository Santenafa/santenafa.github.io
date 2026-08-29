spells = {
    WOOP: function(caster){
        caster.move(randomPassableTile());
    },
    QUAKE: function(){                  
        for(let i=0; i<numTiles; i++){
            for(let j=0; j<numTiles; j++){
                let tile = getTile(i,j);
                if(tile.monster){
                    let numWalls = 4 - tile.getAdjacentPassableNeighbors().length;
                    tile.monster.hit(numWalls*2);
                }
            }
        }
        shakeAmount = 20;
        gameState.tick();
    },
    MAELSTROM: function(){
        for(let i=0;i<monsters.length;i++){
            monsters[i].move(randomPassableTile());
            monsters[i].teleportCounter = 2;
        }
        gameState.tick();
    },
    MULLIGAN: function(){
        startLevel(1, player.spells);
        gameState.tick();
    },
    DIG: function(){
        for(let i=1;i<numTiles-1;i++){
            for(let j=1;j<numTiles-1;j++){
                let tile = getTile(i,j);
                if(!tile.passable){
                    tile.replace(Floor);
                }
            }
        }
        //player.tile.setEffect(13);
        player.heal(2);
        gameState.tick();
    }
}