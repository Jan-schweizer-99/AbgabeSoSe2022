namespace Gemuesegarten {
    export class Plant {

        //public blocknumber: number;
        public bee: Mob [] = [];
        public grown: Boolean = false;
        

        public seed: string;


        protected maxgrowlvl: number;                           //max Texturenumber set in Class Carrot Pumpkin....
        protected path: string[] = [];                          //path of Texture of plant

        protected growtime: number = 0;                             //time to grow set in Class Carrot Pumpkin....
        private growtimecounter: number = 0;

        private imgPlant: HTMLImageElement = new Image();     //texture of this plant
        private position: Vector = new Vector(0, 0);

        private  growlvl: number = 0;


        constructor(_seed: string, _position: Vector) {

            this.seed = _seed;

            this.position.x = _position.x;
            this.position.y = _position.y - 155;        //verschiebung in Y richtung

            this.path[1] = ".webp";

        }


        draw(): void {
            this.imgPlant.src = this.path[0] + this.growlvl + this.path[1];
            ctx.drawImage(this.imgPlant, this.position.x, this.position.y);
            if (this.bee.length > 0) {
                for (let i: number = 0; i < this.bee.length; i++) {
                    this.bee[i].update();
                }

            }

        }

        update(): void {            //if (this. growlvl <= this.maxgrowlvl) {

            this.growtimecounter++;
            if (this.growtimecounter >= this.growtime) {
                if (this.growlvl <= this.maxgrowlvl) {
                    this.growlvl++;
                }

                this.growtimecounter = 0;
            }
            if (this.growlvl == this.maxgrowlvl) {
                this.grown = true;
            }
        }

    }
}