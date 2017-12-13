//genre de constantes pour gérer les types de box
//et leur couleur
var BOX_PLAYER = 0,
	BOX_WALL = 1,
	BOX_HOT = 2,
	BOX_MOVABLE = 3,
	BOX_TARGET = 4,
	BOX_COL = ["#3B5998",
				"#FFEB7F",
				"#FF7570",
				"#FFAB7F",
				"#7FFF7F"];

//L'objet Box sert a gérer tous les ellements de la map
//y compris le player
function Box (pos,k) {

	this.pos = pos; // position (p5.Vector)
	this.pPos = pos; // position précédente (p5.Vector)
	//nb: une case est une unité

	this.kind = k; // le type de box (uttilise les constantes BOX_)

	//afficher la box
	this.show = function () {
		//couleur en fonction de kind
		fill(color(BOX_COL[this.kind]));
		//on fait glicer la box avec un mouvement continu
		var x = lerp(this.pPos.x,this.pos.x,frameCount%FRM/FRM);
		var y = lerp(this.pPos.y,this.pos.y,frameCount%FRM/FRM);
		//on dessine le rect
		rect(x*SCL,y*SCL,SCL,SCL);
	};

	//déplace la box dans la direction dir, dans la map env
	//renvoie true si on a pu se déplacer false sinon
	this.move = function (dir,env) {
		var newPos = p5.Vector.add(this.pos,dir); // tmp : Là où on veut aller
		var destination = env.boxAt(newPos.x,newPos.y); // ce qu'il y a là ou en veut aller
		if(destination) {
			//s'il y a quelquechose
			if(destination.kind == BOX_WALL) {
				//si c'est un mur on bouge pas.
				return false;
			} else if(destination.kind == BOX_MOVABLE){
				//si c'est un bloc déplacable on uttilise une petite récursion :
				//On deplace le bloc,
				if(destination.move(dir,env)){
					// s'il se déplace bien on se deplace aussi
					this.pos.add(dir);
					return true;
				} else {
					//sinon bah non.
					return false;
				}
			} else if(destination.kind == BOX_HOT){
				// si c'est une case brulante
				if(this.kind == BOX_PLAYER){
					//si on est le joueur, on meurt
					env.gameOver = true;
					return false;
				} else {
					//dans tous les cas, on ne se déplace pas
					return false;
				}
			} else if(destination.kind == BOX_TARGET){
				//si c'est la cible
				if(this.kind == BOX_PLAYER){
					//si on est le joueur, on gagne
					env.win = true;
					return false;
				} else {
					//dans tous les cas, on ne se déplace pas
					return false;
				}
			}
		} else {
			//si la case est vide on se déplace
			this.pos.add(dir);
			return true;
		}

	};

}