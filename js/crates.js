/* 
 * Tux Crates is a Sokoban like strategy game fo Mozilla OS
 * @author: dirk hoeschen aka rubbedecatc (rubbel@c-base.org)
 * This code is public domain. Donations to www.c-base.org 
*/

'use strict';

var Crates = {
	BACKSPACE_TIMEOUT: 750,
   display: document.querySelector("#display"),
   levelinfo: document.querySelector("#levelinfo"),
   info: document.querySelector("#info"),
   levels: ["000000000000000000000000000011100000000024200000000013111100002225354200001435611100002222520000000001410000000002220000000000000000000000000000",
		"000000000000011111000000026332000000013551011100023532024200011131114100002233334200001333133100002333222200001111100000000000000000000000000000",
		"000000000000000000000000001111111000002333332220011522233310023365335320013442353110022441333200001111111100000000000000000000000000000000000000",
		"000000000000000000000000000111110000000263222000000135331000002223232200001413133100002453323200001433353100002222222200000000000000000000000000",
		"000000000000000000000000000022222220000113313610000233323320000153535310000235223320011135313110024444433200011111111100000000000000000000000000",
		"000000000000000000000000000000000000000011111100002223333200011435113110024453533620014435353110022222233200000000111100000000000000000000000000",
		"000000000000022222222200013311333100023335333200015311135100023244423200113144413110235335335320133333136310222222222220000000000000000000000000",
		"000000000000000000000000000022222200000013333100002225553200001635443100001354442200002222332000000001111000000000000000000000000000000000000000",
		"000000000000000000000000000000000000022220022222113310013331235322225332133544443531223333236322011111111110000000000000000000000000000000000000",
		"000000000000000022220000000014410000000223422000000133541000002235332200001331553100002336333200001111111100000000000000000000000000000000000000",
		"000000000000000000000000000111111100002233333200001353553100002444444200001355353100002223622200000011110000000000000000000000000000000000000000",
		"000000000000000000000000002222222000001445441000002442442000001355531000002335332000001355531000002332632000001111111000000000000000000000000000",
		"000000000000000222222000000133331110000235333320011135311310024443533320014445153110022223235320000013363310000022222220000000000000000000000000",
		"000000000000000000000000022222200000013333100000023555220000013314411100022334453200001363333100002222222200000000000000000000000000000000000000",
		"111111111111244432333332144331311331244333332332144331351131244432535332111111335531022335355332016355533131022353223332001333333331002222222222"],
	stones : [], 
	lvl: 0, // current level
	px: 0, // player position
	py: 0,
	field: [], // current playfield
	moves: [],
	_gestures: null,
  /**
   *  Get the game graphics and events
   */
  init: function crates_init() {
//    document.addEventListener('mousedown', this);
//    document.addEventListener('mouseup', this);
    document.addEventListener('keypress', this);
    this._gestures = new GestureDetector(this.display);
    this._gestures.startDetecting();
    document.addEventListener('swipe', this);
    document.addEventListener('dbltap', this);
    for (var i = 0; i <= 6; i++) {
       this.stones[i] = new Image();
       this.stones[i].src = "style/images/stone" + i + ".png";
    }
  },
  /**
   * Rebuild compete level
   */
  initLevel: function crates_initLevel() {
	  var info = document.getElementById('info');
	  this.field = new Array();
	  this.display.innerHTML = "";
	  this.moves.length = 0;
	  for (var i = 0; i <= 11; i++) {
		  this.field[i] = new Array(12);
		  for (var j = 0; j <= 11; j++) {
			  var fval = this.levels[this.lvl].charAt(i*12+j);
			  this.field[i][j] = fval;
			  if (fval==6) { this.px=j; this.py=i };
			  var img = document.createElement("img");
			  img.name = "fld"+i+"x"+j;
			  img.src = this.stones[fval].src;
			  this.display.appendChild(img);
		  }
	  }
	  this.levelinfo.innerHTML = "L"+(this.lvl+1);
  },   
  levelUp: function crates_levelUp() {
	 this.playSound('Powerup');
	 this.lvl++;
	 this.lvl=this.lvl % this.levels.length;
	 this.initLevel();
  },
  levelDown: function crates_levelDown() {
	  if(this.lvl>0) this.lvl--;
	  this.initLevel();
  },
  handleEvent: function crates_handleEvent(evt) {
    var target = evt.target;
    switch (evt.type) {
      case 'mousedown':
        break;
      case 'mouseup':
        break;
      case 'dbltap':
    	this.undoMove();
    	break;
      case 'swipe':
      	this.handlePan(evt);  
    	break;
      case 'keypress':
        this.handleKeys(evt);
        break; 
    }
  },
  handleKeys: function crates_handleKeys(evt) {
	 var code = evt.charCode;
	 if (code==100 || code==68) this.move(1,0)
	 else if (code==97 || code==65) this.move(-1,0)
	 else if (code==83 || code==115) this.move(0,1)
	 else if (code==87 || code==119) this.move(0,-1)
	 else if (code==85 || code==117) this.undoMove()
	 else if (code==43) this.levelUp()
	 else if (code==45) this.levelDown()
	 else if (code==32) this.initLevel();	 	 
  },
  handlePan: function crates_handlePan(evt) {
	  var way = evt.detail.direction;
		console.log(way);
		if (way=="down") this.move(0,1)
		else if (way=="up") this.move(0,-1)
		else if (way=="right") this.move(1,0)
		else if (way=="left") this.move(-1,0);
  },  
  move: function crates_move(sx,sy) {
   if (this.field[this.py+sy][this.px+sx]>=3) {
      if (this.field[this.py+sy][this.px+sx]==5) {
         if ((this.field[this.py+(sy*2)][this.px+(sx*2)]==3) || (this.field[this.py+(sy*2)][this.px+(sx*2)]==4)) {
            this.setField(this.px+(sx*2),this.py+(sy*2),5);
         } else {
			return;
	     }
      }
      this.setField(this.px,this.py,3);
      this.px=this.px+sx;this.py=this.py+sy;
      this.setField(this.px,this.py,6);
      this.playSound('Thip');
      this.checkLvlup();
  }},
  setField: function crates_setField(sx,sy,sv) {
	  if(sv==3 && this.levels[this.lvl].charAt(sy*12+sx)==4) sv=4;
	  this.moves.push(new Move(sx, sy, this.field[sy][sx]));
	  this.field[sy][sx]=sv;
	  document["fld"+sy+"x"+sx].src = this.stones[sv].src;
  },
  undoMove: function crates_undoMove() {
	  if (this.moves.length>=2) 
		  for (var i=0; i<2; i++) {
		  	var m = this.moves.pop();
		  	this.field[m.sy][m.sx]=m.sv;
		  	document["fld"+m.sy+"x"+m.sx].src = this.stones[m.sv].src;
		  	if (m.sv==6) {
		  		this.px=m.sx;this.py=m.sy;
		  	} else if (m.sv==5) i--;
		  }
  },
  checkLvlup: function crates_checkLvlup() {
	 for (var i = 0; i <= 11; i++)
		for (var j = 0; j <= 11; j++) 
			if(this.levels[this.lvl].charAt(i*12+j)==4 && this.field[i][j]!=5) return;
		alert(navigator.mozL10n.get('gotLvlUp'));
		this.levelUp();
  },
  playSound: function crates_playSound(f) {
	  var sound = new Audio();
	  sound.loop = false;
	  sound.src = 'style/sounds/'+f+'.ogg';
	  sound.play();
  }
};

/** prototype to store a move */
function Move (sx,sy,sv) {
    this.sx = sx;
    this.sy = sy;
    this.sv = sv;
};

/** initialize the game on load */
window.addEventListener('load', function cratesLoad(evt) {
  window.removeEventListener('load', cratesLoad);
  Crates.init();
  Crates.initLevel();
});
