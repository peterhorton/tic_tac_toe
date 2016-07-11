$(document).ready(function(){


	var turnCount=-1;
	var need_comp=false;
	var pause = false;
	var hard = false;
	var comp_first = false;
	var play = ["X","Y"];
	var cols = 2;
	var matrix = []
	initBoard(matrix,cols);

	$(".new-game").on('click',newGame_click);
	$(".pick").on('click',selectGame_click);
	$(".choose").on('click',selectFirst_click);

	function newGame_click(){
		turnCount=-1;
		need_comp = false;
		hard = false;
		comp_first = false;
		resetBoard(matrix);
		pause = false;
		play = ["X","Y"];
		$("td").text("");
		$(this).css("visibility","hidden");
		$(".winner-display").text("");
		$("#first-player").css("visibility","visible");	
	}

	function selectFirst_click(){
		$("#first-player").css("visibility","hidden");
		$("#num-players").css("visibility","visible");
		if($(this).hasClass('x')){
			comp_first = true;
			play = ["Y","X"];
		} 
		else{
			comp_first = false;
		}
	}

	function selectGame_click(){
		$("#num-players").css("visibility","hidden");
		if($(this).hasClass('computer')){
			need_comp = true;
			$("#computer-options").css("visibility","visible");
			$(".cpu").on('click',selectDiff_click);
		}
		else{
			alert("Here");
			$("td").on('click', section_click);
		}
	}

	function selectDiff_click(){
		//alert("inside selectDiff_click");
		$("td").on('click', section_click2);
		$("#computer-options").css("visibility","hidden");	
		if($(this).hasClass('easy')){
			hard = false;
		}
		else{
			hard = true;
		}	
		//alert("Calling computer play from options click");
		if (need_comp && comp_first && turnCount==-1){
			computer_play();
		}	
	}


	function computer_play(){
		if (hard){
			var spots = smarter_select();
		}
		else{
			var spots = random_select();
		}		
		matrix[spots[0]][spots[1]]=1;	//Only supports the computer playing second 
		$("tr[row="+spots[0]+"] > td[col="+spots[1]+"]").text(play[1]).unbind('click');
		turnCount++;
		pause = false;	//Unpauses computer
		checkVictory(matrix);
	}


	function section_click(){
			pause = true;
			turnCount++;
			$(this).unbind('click');
			var row = parseInt($(this).parent().attr("row"));
			var col = parseInt($(this).attr("col"));
			if(turnCount%2==0){
				$(this).text(play[0]);
				matrix[row][col]=0;		
			}
			else{
				$(this).text(play[1]);
				matrix[row][col]=1;
			}
			checkVictory(matrix);
	}

	function section_click2(){
		if(!pause){
			turnCount++;
			$(this).unbind('click');
			var row = parseInt($(this).parent().attr("row"));
			var col = parseInt($(this).attr("col"));
			$(this).text(play[0]);
			matrix[row][col]=0;	
			if(!checkVictory(matrix)){
				pause = true;
				//alert("Calling computer play from section_click2");
				setTimeout(function(){computer_play()},500);	//Pauses computer before playing
				}
			}
	}
	
	function checkVictory(board){
		var complete = false;
		if (checkWinner(board)){
			$("td").unbind('click');
			if(turnCount%2==0){
				var s = play[0];
				complete = true;
			}
			if(turnCount%2==1){
				var s = play[1];
				complete = true;
			}
		}
		if(turnCount>=8 && !complete){
			var s = "No one";
			complete = true;
		}
		if(complete){
			$(".winner-display").text(s+ " is the winner!");
			$(".new-game").css("visibility","visible");
		}
		return complete;
	}
/*
General Methods
*/
	function random_select(){
		var val=[];
		var row = Math.floor((Math.random()*3));
		var col = Math.floor((Math.random()*3));
		while (!valid_play(row,col)){
			row = Math.floor((Math.random()*3));
			col = Math.floor((Math.random()*3));
		}
		val[0]=row;
		val[1]=col;
		return val;
	}

	function smarter_select(){
		for (var i=0; i<3; i++){
			for (var j=0; j<3; j++){
				var temp = copyBoard();
				if(valid_play(i,j)){
					temp[i][j]=1;
					if(checkWinner(temp)){
						return [i,j];
					}			
				}
			}
		}
		for (var i=0; i<3; i++){
			for (var j=0; j<3; j++){
				var temp = copyBoard();
				if(valid_play(i,j)){
					temp[i][j]=0;
					if(checkWinner(temp)){
						return [i,j];
					}
				}
			}
		}
		return random_select();
	}

	function valid_play(row,col){
		if(matrix[row][col]!=0 && matrix[row][col] !=1){
			return true;
		}
		else{
			return false;
		}
	}

	function checkWinner(board){
		if(checkRow(board)[0] || checkColumn(board)[0] || checkDiagonal(board)[0]){
			return true;
		}
		else{
			return false;
		}
	}

	function checkRow(board){
		for(var i=0; i<=2; i++){
			if(board[i][0]!=null &&(board[i][0]==board[i][1]) && (board[i][1]==board[i][2])){
				console.log("Check Row");
				if(board[i][2]==0){
					return [true,"X"];
				}
				else{
					return[true,"Y"];
				}
				
			}
		}
		return [false];
	}

	function checkColumn(board){
		for(var i=0; i<=2; i++){
			if(board[0][i]!=null &&(board[0][i]==board[1][i]) && (board[1][i]==board[2][i])){
				console.log("Check Column");
				if(board[0][i]==0){
					return [true,"X"];
				}
				else{
					return[true,"Y"];
				}
				
			}
		}
		return [false];
	}

	function checkDiagonal(board){
		if(board[0][0]!=null &&(board[0][0]==board[1][1]) && (board[1][1]==board[2][2])){
			console.log("Check down diag");
			if(board[2][2]==0){
				return [true,"X"];
			}
			else{
				return [true,"Y"];
			}
		}
		else if(board[0][2]!=null &&(board[0][2]==board[1][1]) && (board[1][1]==board[2][0])){
			console.log("Check up diag");
			if(board[0][2]==0){
				return [true,"X"];
			}
			else{
				return [true,"Y"];
			}
			
		}
		else{
			return [false];
		}
	}

	function printBoard(board){
		var string = "";
		for (var i=0; i<=2; i++){
			for (var j=0; j<=2; j++){
				string += board[i][j]+ " "
			}
			console.log(string);
			string = "";
		}
		console.log("<br");
	}

	function initBoard(board,cols){
		for(var i = 0; i <= cols; i++ ) {
			board[i] = []; 
		}
	}

	function resetBoard(board){
		for (var i=0; i<3; i++){
			for(var j=0; j<3; j++){
				board[i][j]=undefined;
			}
		}
	}

	function copyBoard(){
		var copyMatrix = [[],[],[]];
		for (var i=0; i<3; i++){
			for (var j=0; j<3; j++){
				copyMatrix[i][j]=matrix[i][j];
			}
		}
		return copyMatrix;
	}

	function returnValue(board){
		if(turnCount%2==0){
			if()
		}
		
	}

});