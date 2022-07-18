namespace Gemuesegarten {
    export class Blockbee extends Mob {

        constructor(_position: Vector) {
            super(_position);
            this.mobpath[0] = "img/bee/block/Bee_types_BE_";                            //pfad start

            this.minpostion = new Vector(_position.x + 50, _position.y);                //minimale grenzen wo die Biene Fliegt
            this.maxpostion = new Vector(_position.x + 300 - 50, _position.y + 300);    //maximale grenze wo die Biene Fliegt
            this.direction = DIRECTION.RIGHT;                                           //ändere Richtung
            this.preloading();
        }

        public update(): void {
            this.updateframe();
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