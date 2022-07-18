namespace Gemuesegarten {
    export class Worldbee extends Mob {

        constructor(_position: Vector) {
            super(_position);

            this.mobpath[0] = "img/bee/world/Bee_types_BE_";                //pfad für Biene
            this.minpostion = new Vector(-40, -40);                         //größe des canvases - halbe Biene
            this.maxpostion = new Vector(1940, 1120);                       //größe des canvases + halbe Biene

            this.preloading();

        }
        public update(): void {

            this.updateframe();

            this.position.x += 4;                                           //geschwindigkeit in x richtung
            this.position.y += 4;                                           //geschwindigkeit in y richtung


            if (this.position.y >= this.maxpostion.y) {                     //wenn die maximale canvas höhe erreicht wurde
                this.position.y = this.minpostion.y;                        //setze die Höhe wieder auf die minimalste
            }
            if (this.position.x >= this.maxpostion.x) {                     //wenn die maximale canvas breite erreicht wurde
                this.position.x = this.minpostion.x;                        //setze die breite wieder auf die minimalste
            }
        }

    }
}