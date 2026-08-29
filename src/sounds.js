function initSounds(){          
    sounds = {
        hit1: new Audio('sounds/hit1.wav'),
        hit2: new Audio('sounds/hit2.wav'),
        treasure: new Audio('sounds/treasure.wav'),
        newLevel: new Audio('sounds/newLevel.wav'),
        spell: new Audio('sounds/spell.wav'),
    };
}

function playSound(soundName){                       
    const sound = sounds[soundName];
    if (!sound) return;
    sound.currentTime = 0;  
    sound.play();
}