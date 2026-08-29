function getScores(){
    if(localStorage["scores"]){
        return JSON.parse(localStorage["scores"]);
    }else{
        return [];
    }
}

function addScore(score,won){
    let scores = getScores();
    let scoreObject = {
        score: score, run: 1,
        totalScore: score, active: won
    };
    let lastScore = scores.pop();

    if(lastScore){
        if(lastScore.active){
            scoreObject.run = lastScore.run + 1;
            scoreObject.totalScore += lastScore.totalScore;
        }else{
            scores.push(lastScore);
        }
    }
    scores.push(scoreObject);
    localStorage["scores"] = JSON.stringify(scores);
}

function drawScores(){
    let scores = getScores();
    if(scores.length){
        drawText(
            rightPad(["RUN","SCORE","TOTAL"]),
            18,
            true,
            canvas.height/2,
            "white"
        );
        let newestScore = scores.pop();
        scores.sort(function(a,b){return b.totalScore - a.totalScore;});
        scores.unshift(newestScore);
        for(let i=0;i<Math.min(10,scores.length);i++){
            let scoreText = rightPad([scores[i].run, scores[i].score, scores[i].totalScore]);
            drawText(scoreText,18,true,canvas.height/2 + 24+i*24,i == 0 ? "aqua" : "violet");
        }
    }
}