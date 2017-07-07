$(document).ready( function(){
    var input = document.getElementById("file-input");
    input.addEventListener("change", function(e) {
        var file = e.target.files[0];

        // Only render plain text files
        if (!file.type === "text/plain")
            return;

        var reader = new FileReader();
        var str2;
        var var2;
        var count = 0;

        reader.onload = function(event) {
            str2 = event.target.result;
            document.getElementById("output").innerText = str2;

            while(1){
                var ini = 0;
                var end = "........";
                var isEnd = 0;

                for (var i = 0; i < 8; i++) {
                    var line = str2.substring(0, 8);

                    if(line.localeCompare(end))
                        isEnd++;

                    if(ini == 0){
                        var2 = new Array(line);
                        ini = 1;
                    }
                    else
                        var2.push(line);
                    str2=str2.substring(10, str2.lenght);
                }
                count++;
                str2=str2.substring(2, str2.lenght);
                    //call function
                process(var2, count);   
                //if end of doc
                if(isEnd == 8)
                    break;
                
                
            }
        };
        
        reader.readAsText(file);
    });
    
    function process(chessArray, count) {
        
        //find black king
        var posN = findKing(0, chessArray);
        var posXN = posN[0];
        var posYN = posN[1];
               

        //find white king
        var posB = findKing(1, chessArray);
        var posXB = posB[0];
        var posYB = posB[1];

        var div = document.getElementById("message");
        
        if(checkKing(0, posN, chessArray))
            div.innerHTML = div.innerHTML + "Game #" + count + ": black king is in check" + "<br>";
        else if(checkKing(1, posB, chessArray))
            div.innerHTML = div.innerHTML + "Game #" + count + ": white king is in check" + "<br>";
        else
            div.innerHTML = div.innerHTML + "Game #" + count + ": no king is in check" + "<br>";
    }

    var checkKing = function(player, pos, chessArray){
        var posX = pos[0];
        var posY = pos[1];
        if(player == 1){ //enemy's values
            pawnChar = "p";
            rookChar = "r";
            bishopChar = "b";
            queenChar = "q";
            knightChar = "n";
        }
        else if(player == 0){
            pawnChar = "P";
            rookChar = "R";
            bishopChar = "B";
            queenChar = "Q";
            knightChar = "N";
        }
        
        for(var i = 0 ; i < 8; i++)
            for(var j = 0; j < 8; j++){
                var currentChar = chessArray[i][j];
                if(currentChar!="." && isEnemy(player,chessArray[i][j])){
                    if(currentChar == pawnChar){
                        var res = checkPawn(player, pos, i, j);
                        if(res == true)
                            return true;
                    }
                    else if(currentChar == rookChar){
                        var res = checkRook(player, pos, i, j, chessArray);
                        if(res == true)
                            return true;
                    }
                    else if(currentChar == bishopChar){
                        var res = checkBishop(player, pos, i, j, chessArray);
                        if(res == true)
                            return true;
                    }
                    else if(currentChar == queenChar){
                        var res = checkQueen(player, pos, i, j, chessArray);
                        if(res == true)
                            return true;
                    }else if(currentChar == knightChar){
                        var res = checkKnight(player, pos, i, j);
                        if(res == true)
                            return true;
                    }
                }
                
            }
        return false;    
    }

    var checkPawn =  function(player, pos, i, j){
        var x = pos[0]; //king position
        var y = pos[1];

        var distance;

        if(player == 0)
            distance = y + 1;
        else if(player == 1)
            distance = y - 1;

        if((distance == j) && (x + 1 == i))
            return true;
        else if((distance == j) && (x - 1 == i))
            return true;
        else
            return false;
    }

    var checkRook = function(player, pos, i, j, chessArray){
        var x = pos[0]; //king position
        var y = pos[1];

        if(i == x){
            for(var m = 0; m < j; m++){
                if(m == y)
                    return true;
                else if(chessArray[i][m] != ".")
                    break;
            }
            for(var m = j + 1; m < 8; m++){
                if(m == y)
                    return true;
                else if(chessArray[i][m] != ".")
                    break;
            }
        }
        else if(j == y){
            for(var m = 0; m < i; m++){
                if(m == x)
                    return true;
                else if(chessArray[m][j] != ".")
                    break;
            }
            for(var m = i + 1; m < 8; m++){
                if(m == x)
                    return true;
                else if(chessArray[m][j] != ".")
                    break;
            }
        }
        else
            return false;

    }

    var checkBishop = function(player, pos, i, j, chessArray){
        var x = pos[0]; 
        var y = pos[1];

        if(Math.abs(i - x) - Math.abs(j - y) != 0)
            return false;
        
        for(var m = i-1, n = j-1; m >= 0 && n >= 0; m--, n--){
            if((m == x) && (n == y))
                return true;
            else if(chessArray[m][n] != ".")
                break;
        }
        for(var m = i-1, n = j+1; m >= 0 && n < 8; m--, n++){
            if((m == x) && (n == y))
                return true;
            else if(chessArray[m][n] != ".")
                break;
        }
        for(var m = i+1, n = j-1; m < 8 && n >= 0; m++, n--){
            if((m == x) && (n == y))
                return true;
            else if(chessArray[m][n] != ".")
                break;
        }
        for(var m = i+1, n = j+1; m < 8 && n < 8; m++, n++){
            if((m == x) && (n == y))
                return true;
            else if(chessArray[m][n] != ".")
                break;
        }
        return false;
    }

    var checkQueen = function(player, pos, i, j, chessArray){
        var rook = checkRook(player, pos, i, j, chessArray);
        if(rook == true)
            return true;

        var bishop = checkBishop(player, pos, i, j, chessArray);
        if(bishop == true)
            return true;

        return false;
    }

    var checkKnight = function(player, pos, i, j){
        var x = pos[0]; //posicion del king
        var y = pos[1];

        if((x + 1 == i) && (y + 2 == j))
            return true;
        else if((x + 1 == i) && (y - 2 == j))
            return true;
        else if((x - 1 == i) && (y + 2 == j))
            return true;
        else if((x - 1 == i) && (y - 2 == j))
            return true;
        else if((x + 2 == i) && (y + 1 == j))
            return true;
        else if((x - 2 == i) && (y + 1 == j))
            return true;
        else if((x + 2 == i) && (y - 1 == j))
            return true;
        else if((x - 2 == i) && (y - 1 == j))
            return true;
        else return false;
    }

    var isEnemy = function(player, piece){
        if(player == 0){
            if(/[A-Z]/.test(piece))
                return true;
        }
        else if(player == 1){
            if(/[a-z]/.test(piece))
                return true;
        }
        return false;    
    }

    var findKing = function(player, chessArray){
        var kingChar;
        var x = -1;
        var y = -1;
        if(player == 0) //black
            kingChar = "k";
        else if(player == 1)
            kingChar = "K";

        for(var i = 0 ; i < 8 ; i++){
            for(var j = 0 ; j < 8 ; j++){
                if(chessArray[i][j] == kingChar){
                    x = i;
                    y = j;
                }
            }
        }
        
        return [x, y];
    }
})

    