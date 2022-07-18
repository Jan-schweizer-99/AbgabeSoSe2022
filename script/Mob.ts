namespace Gemuesegarten {
    export enum DIRECTION {
        LEFT,
        RIGHT,
        UP,
        DOWN
    }

    export abstract class Mob {

        public position: Vector;
        protected frame: number;

        protected imgMob: HTMLImageElement[] = [];
        protected mobpath: string[] = [];

        protected minpostion: Vector;
        protected maxpostion: Vector;

        protected direction: DIRECTION;


        constructor(_position: Vector) {

            this.frame = 1;
            this.position = _position;
            this.position.y -= 40;
            this.mobpath[1] = ".png";                                       //Pfad ende

        }

        abstract update(): void;


        protected updateframe(): void {
            this.frame++;                                                      //add ne frame

            ctx.drawImage(this.imgMob[this.frame], this.position.x - 40, this.position.y - 40); //male Biene

            if (this.frame == 8) {                                              //reset zu frame 0
                this.frame = 0;
            }
        }
        protected preloading(): void {
            for (let i: number = 0; i <= 8; i++) {                              //preload für Bilder der der Biene
                this.imgMob[i] = new Image();
                this.imgMob[i].src = this.mobpath[0] + i + this.mobpath[1];
            }
        }
    }
}
