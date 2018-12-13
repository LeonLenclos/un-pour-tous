var SCL = 16; // la taille d'une case
var FRM = 7; // la durée d'un instant

var gameData;//Où le fichier est chargé
var game =[];//Où sont stockées les infos (premier traitement) du jeu
var maps;// Où l'on met les cartes du niveau en cours

var direction;//La direction dans la quelle se déplace le joueur


var win =false;// le niveau est-il gagné ?
var loose =false;// le niveau est-il perdu

var currentLevel = 0;// l'index du niveau actuel

var message = "loading...";// ce qui est affiché comme message

function preload() {
	gameData = loadStrings('map');
	//Le fichier map doit contenir tous les niveaux.
	//Deux niveaux sont séparés par une ligne commençant par "_" et contenant le titre.
	//Au sein d'un niveau, deux cartes sont séparées par une ligne commençant par >
	//Les cartes sont dessinées, necessairement réctangles
	// . = Case vide
	// # = BOX_WALL les murs
	// * = BOX_HOT si on le touche on meurt
	// + = BOX_MOVABLE une caisse que l'on peut pousser
	// S = BOX_STARTER là où le joueur commence
	// T = BOX TARGET là où le joueur doit aller
}

function setup() {
	//Premier traitement des données map
	//consiste a creer un array d'objet game
	// game = [ { title : "" ,
	//			  maps : [ [ "" ] , [ "" ] , ... ] },
	//			{ title : "" ,
	//			  maps : [ [ "" ] , [ "" ] , ... },
	//			... ]
	var mapIndex =0;
	for (var i = 0; i < gameData.length; i++) {
		if(gameData[i].charAt(0)=="_"){
			game.push({title : gameData[i].substring(1),
						maps : [[]]});
			mapIndex =0;
		} else if(gameData[i].charAt(0) ==">") {
			game[game.length-1].maps.push([]);
			mapIndex ++;
		} else if(gameData[i].charAt(0)) {
			game[game.length-1].maps[mapIndex].push(gameData[i]);
		}
	}

	//Prefs Graphiques
	createCanvas(800, 400);
	noStroke();
	frameRate(50);

	//Récuperer les parametres dans l'URL (dev)
	var params = getURLParams();
	currentLevel = params.l ? params.l : 0;

	//c'est parti
	newGame(currentLevel);
}

function draw() {

	//le background en fonction du statut de victoire
	if(win) {
		background(BOX_COL[BOX_TARGET]);
	} else if (loose) {
		background(BOX_COL[BOX_HOT]);
	} else {
		background(200,220,255);
	}

	push();
	//Ecrire le message
	translate(SCL,SCL);
	fill(0);
	text(message,0,0);

	//Dessiner les maps
	translate(0,SCL);
	win = true; // hypothèse
	loose =false; // hypothèse
	var freeSpaceLeft = width;//la place qu'il reste à droite de la derniere map dessinée
	var lineHeight =0; // la hauteur de la plus haute map de la ligne en cours
	push();
	for (var i = 0; i < maps.length; i++) {
		if(maps[i].gameOver){
			//une seule carte ou c'est perdu et tout est perdu.
			message = "Press ENTER to restart.";
			win = false;
			loose = true;
		} else if (!maps[i].win) {
			//une carte ou c'est ni perdu ni gagné, on y joue
			if(frameCount%FRM === 0) { // toutes les 'FRM' frms
				maps[i].update();
				maps[i].movePlayer(direction);
			}
			//une seule partie ou c'est pas gagné et rien n'est encore gagné
			win = false;
		}
		// affichage des cartes
		maps[i].show();
		//on actualise freeSpaceLeft et lineHeight
		freeSpaceLeft -= (maps[i].width+1)*SCL;
		if(maps[i].height>lineHeight) {
			lineHeight =maps[i].height;
		}
		//s'il y a encore une map a dessinée on decide s'il faut la dessiner a droite ou en bas
		if(maps[i+1]){
			if(freeSpaceLeft>(maps[i+1].width+1)*SCL){
				translate(maps[i].width*SCL+SCL,0);
			}
			else {
				pop();
				translate(0,lineHeight*SCL+SCL);
				lineHeight = 0;
				freeSpaceLeft =width;
				push();
			}
		}

	}
	pop();
	pop();

	//quand on gagne
	if(win) {
		message = "Press ENTRER for the next level";
		if(keyCode == ENTER) {
			//passer au niveau suivant
			currentLevel++;
			newGame(currentLevel);
		}
	}

}

function newGame (level) {
	//réinitialise l'array map
	maps = [];
	// on recréé les maps
	for (var i = 0; i < game[level].maps.length; i++) {
		maps.push(new Map(game[level].maps[i]));
		maps[i].restart();
	}
	// on affiche le titre
	message = game[level].title;
	//on réinitialise la direction
	direction = createVector(0,0);
}

function keyPressed() {
	//[W][A][S][D] ou touches fléchées pour se déplacer
	//[R] pour Restart
	//enfait pour se déplacer on actualise le p5.Vector direction et toutes les 10 frms on bouge les persos en fonction de la valeur actuelle.
	if(key == "W" || keyCode == UP_ARROW) {
		// if(direction.equals(0,-1)) FRM = 2;
		direction.set(0,-1);
	} else if(key == "A" || keyCode == LEFT_ARROW) {
		// if(direction.equals(-1,0)) FRM = 2;
		direction.set(-1,0);
	} else if(key == "D" || keyCode == RIGHT_ARROW) {
		// if(direction.equals(1,0)) FRM = 2;
		direction.set(1,0);
	} else if(key == "S" || keyCode == DOWN_ARROW) {
		// if(direction.equals(0,1)) FRM = 2;
		direction.set(0,1);
	}

	if(key == "R" || keyCode == ENTER) newGame(currentLevel);



}
