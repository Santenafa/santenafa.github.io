class Monster{
    constructor(tile, sprite, hp){
        this.move(tile);
        this.sprite = sprite;
        this.hp = hp;
        this.tile = tile;
        this.teleportCounter = 2;
        this.offsetX = 0;           
        this.offsetY = 0;
        this.lastMove = [-1,0];     
        this.bonusAttack = 0;
        this.attackedThisTurn = false;
    }

    update(){
        this.teleportCounter--;
        if(this.stunned || this.teleportCounter > 0){
            this.stunned = false;
            return;
        }
        this.doStuff();
    }

    doStuff(){
        let neighbors = this.tile.getAdjacentPassableNeighbors();
        neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);
        if(neighbors.length){
            neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
            let newTile = neighbors[0];
            this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
        }
    }   

    tryMove(dx, dy){
        let newTile = this.tile.getNeighbor(dx,dy);
        if(newTile.passable){
            this.lastMove = [dx,dy];
            if(!newTile.monster){
                this.move(newTile)
            }else{
                if(this.isPlayer != newTile.monster.isPlayer){
                    this.attackedThisTurn = true;
                    newTile.monster.stunned = true;
                    newTile.monster.hit(1 + this.bonusAttack); 

                    //shake
                    shakeAmount = 5;
                    //bump animation
                    this.offsetX = (newTile.x - this.tile.x)/2;         
                    this.offsetY = (newTile.y - this.tile.y)/2;  
                }
            }
            return true;
        }
        return false;
    }

    move(tile) {
        if(this.tile){
            this.tile.monster = null;
            //move animation
            this.offsetX = this.tile.x - tile.x;
            this.offsetY = this.tile.y - tile.y;
        }
        this.tile = tile;
        tile.monster = this;
        tile.stepOn(this);
    }

    heal(damage){
        this.hp = Math.min(maxHp, this.hp+damage);
    }

    hit(damage){            
        if(this.shield>0){           
            return;                                                             
        }

        this.hp -= damage;
        if(this.hp <= 0){
            this.die();
        }

        if(this.isPlayer){                                                     
            playSound("hit1");                                              
        }else{                                                       
            playSound("hit2"); 
        }
    }

    die(){
        this.dead = true;
        this.tile.monster = null;
        this.sprite = 1;
    }

    draw(){
        if(this.teleportCounter > 1){                                        
            drawSprite(10, this.getDisplayX(),  this.getDisplayY()); 
        }else{
            drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY());
            this.drawHp();
        }

        this.offsetX -= Math.sign(this.offsetX)*(1/8);     
        this.offsetY -= Math.sign(this.offsetY)*(1/8); 
    }

    getDisplayX(){                     
        return this.tile.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.tile.y + this.offsetY;
    }

    drawHp(){
        for(let i=0; i<this.hp; i++){
            drawSprite(
                9,
                this.getDisplayX() + (i%3)*(5/16),   
                this.getDisplayY() - Math.floor(i/3)*(5/16)
            );
        }
    }
}

class Player extends Monster{
    constructor(tile){
        super(tile,0,3);
        this.isPlayer = true;
        this.teleportCounter = 0;
        this.spellsBook = shuffle(Object.keys(spells))
            .splice(0,numSpells);
    }
    tryMove(dx, dy){
        if(super.tryMove(dx,dy)){
            gameState.tick();
        }
    }

    addSpell(){                                  
        let newSpell = shuffle(Object.keys(spells))[0];
        this.spellsBook.push(newSpell);
    }
    
    castSpell(index){                                                   
        let spellName = this.spellsBook[index];
        if(spellName){
            delete this.spellsBook[index];
            spells[spellName](this);
            playSound("spell");
        }
    }
}

class Bird extends Monster{
    constructor(tile){
        super(tile,4,3);
    }
}
class Snake extends Monster{
    constructor(tile){
        super(tile,5,1);
    }
    doStuff(){
        this.attackedThisTurn = false;
        super.doStuff();
        if(!this.attackedThisTurn){
            super.doStuff();
        }
    }
}
class Tank extends Monster{
    constructor(tile){
        super(tile,6,2);
    }

    update(){
        let startedStunned = this.stunned;
        super.update();
        if(!startedStunned){
            this.stunned = true;
        }
    }
}
class Eater extends Monster{
    constructor(tile){
        super(tile,7,1);
    }

    doStuff(){
        let neighbors = this.tile.getAdjacentNeighbors().filter(t => !t.passable && inBounds(t.x,t.y));
        if(neighbors.length){
            neighbors[0].replace(Floor);
            this.heal(0.5);
        }else{
            super.doStuff();
        }
    }
}
class Jester extends Monster{
    constructor(tile){
        super(tile,8,2);
    }

    doStuff(){
        let neighbors = this.tile.getAdjacentPassableNeighbors();
        if(neighbors.length){
            this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
        }
    }
}