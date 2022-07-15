namespace Gemuesegarten {
    enum DIRECTION {
        LEFT,
        RIGHT,
        UP,
        DOWN
    }

    export class Mob {
        
        public position: Vector;
        private direction: DIRECTION;

        private minpostion: Vector;
        private maxpostion: Vector;

        private imgMob: HTMLImageElement[] = [];
        private mobpath: string[] = [];

        private mode: string;
        private frame: number;

        constructor(_position: Vector, _mode: string) {

            this.mode = _mode;

            this.frame = 0;
            this.position = _position;
            this.position.y -= 40;

            if (this.mode == "world") {                                         //weltbiene
                this.mobpath[0] = "img/bee/world/Bee_types_BE_";                //pfad für Biene

                this.minpostion = new Vector(-40, -40);                         //größe des canvases - halbe Biene
                this.maxpostion = new Vector(1940, 1120);                       //größe des canvases + halbe Biene

            }
            if (this.mode == "block") {
                this.mobpath[0] = "img/bee/block/Bee_types_BE_";                            //pfad start

                this.minpostion = new Vector(_position.x + 50, _position.y);                //minimale grenzen wo die Biene Fliegt
                this.maxpostion = new Vector(_position.x + 300 - 50, _position.y + 300);    //maximale grenze wo die Biene Fliegt
                this.direction = DIRECTION.RIGHT;                                           //ändere Richtung

            }
            this.mobpath[1] = ".png";                                                       //Pfad ende

            for (let i: number = 0; i <= 8; i++) {                              //preload für Bilder der der Biene
                this.imgMob[i] = new Image();                                       
                this.imgMob[i].src = this.mobpath[0] + i + this.mobpath[1];
            }

        }

        public update(): void {
            this.frame++;                                                      //add ne frame

            ctx.drawImage(this.imgMob[this.frame], this.position.x - 40, this.position.y - 40); //male Biene
            
            if (this.frame == 8) {                                              //reset zu frame 0
                this.frame = 0;
            }


            if (this.mode == "world") {                                         //wenn es eine Weltbiene ist
                this.position.x += 4;                                           //geschwindigkeit in x richtung
                this.position.y += 4;                                           //geschwindigkeit in y richtung


                if (this.position.y >= this.maxpostion.y) {                     //wenn die maximale canvas höhe erreicht wurde
                    this.position.y = this.minpostion.y;                        //setze die Höhe wieder auf die minimalste
                }
                if (this.position.x >= this.maxpostion.x) {                     //wenn die maximale canvas breite erreicht wurde
                    this.position.x = this.minpostion.x;                        //setze die breite wieder auf die minimalste
                }
            }
            if (this.mode == "block") {                                         //wenn es eine Blockbiene ist
                if (this.direction == DIRECTION.RIGHT) {                        //und die Richtung Rechts ist

                    if (this.position.x >= this.maxpostion.x) {                 //die maximale Position erreicht wurde
                        this.direction = DIRECTION.LEFT;                        //ändere die Richtung nach Links
                    }
                    else {
                        this.position.x += 4;                                   //ansonsten fliege weiter nach rechts
                    }
                }
                if (this.direction == DIRECTION.LEFT) {                         //wenn die Richtung Links ist
                    if (this.position.x <= this.minpostion.x) {                 //und die minimalste Position erreicht wurde
                        this.direction = DIRECTION.RIGHT;                       //ändere die Richtung nach Rechts
                    }
                    else {
                        this.position.x -= 4;                                   //ansonsten flieg weiter nach links
                    }
                }
            }



        }
    }
}
