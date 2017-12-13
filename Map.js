function Map (arr) {
	
	this.mapData = arr; //ou on stock les données (array de strings)

	// hauteur et largeur de la carte (NB 1 = 1box)
	this.height = this.mapData.length; 
	this.width = this.mapData[0].length;

	// les booleens de victoire et de défaite
	this.gameOver = false;
	this.win = false;

	//l'array qui contient les objets Box
	this.boxes= [];

	//pointeur pour l'ellement de l'array 'boxes' qui représente le joueur
	this.joueur = null;

	//installer (ou ré-installer) la map
	this.restart = function () {
		//réinitialier boxes
		this.boxes= [];
		//visiter mapData et interpreter les signes (cf sketch.js preload(){})
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				value = this.mapData[y].charAt(x);

				if(value == '#') {
					this.boxes.push(new Box(createVector(x,y),BOX_WALL));
				} else if (value == 'S') {
					this.joueur = new Box(createVector(x,y),BOX_PLAYER);
					this.boxes.push(this.joueur);
				}  else if (value == '+') {
					this.boxes.push(new Box(createVector(x,y),BOX_MOVABLE));
				} else if (value == '*') {
					this.boxes.push(new Box(createVector(x,y),BOX_HOT));
				} else if (value == 'T') {
					this.boxes.push(new Box(createVector(x,y),BOX_TARGET));
				} else {
				}
				
			}
		}
	};

	//afficher la map
	this.show = function () {
		//le background en fonction de la victoire/défaite
		var bg;
		if(this.gameOver) bg = color(BOX_COL[BOX_HOT]);
		else if(this.win) bg = color(BOX_COL[BOX_TARGET]);
		else bg = color(200,255,255);
		fill(bg);
		rect(0,0,this.width*SCL,this.height*SCL);
		
		// dessine le motif en dammier
		if(!this.gameOver && !this.win){
			fill(0,15);
			for(var x = 0 ; x<this.width ; x++)
				for(var y = x%2 ; y<this.height ; y+=2)
					rect(x*SCL,y*SCL,SCL,SCL);
		}
		//afficher chaque box
		for (var i = 0; i < this.boxes.length; i++) {
			this.boxes[i].show();
		}
	};

	//updater la variable pPos
	// (en vérité c'est nécessaire que pour les BOX_MOVABLE mais bon)
	this.update = function () {
		for (var i = 0; i < this.boxes.length; i++) {
			this.boxes[i].pPos = this.boxes[i].pos.copy();
		}
	};

	//bouger le joueur en fonction d'une direction
	this.movePlayer = function (dir) {
		this.joueur.move(dir,this);
	};

	// renvoie la box aux coordonnées indiquées, null s'il n'y a rien
	this.boxAt = function (x,y) {
		for (var i = 0; i < this.boxes.length; i++) {
			if(this.boxes[i].pos.equals(x,y)) return this.boxes[i];
		}
		return null;
	};
}