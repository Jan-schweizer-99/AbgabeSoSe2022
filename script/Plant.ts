namespace Gemuesegarten {
    export class Plant {



        imgPlant: HTMLImageElement = new Image();
        public blocknumber: number;

        position: Vector = new Vector(0, 0);
        seed: string;

        growtimecounter: number;
        growtime: number; //time to grow

        maxgrowlvl: number;
        public growlvl: number = 0;



        private path: string[] = [];




        constructor(_seed: string, _position: Vector) {

            this.position.x = _position.x;
            this.position.y = _position.y - 155;        //verschiebung in Y richtung

            this.seed = _seed;
            this.growlvl = 0;

            if (this.seed == "carrotseed") {
                this.growtime = 100;
                this.maxgrowlvl = 3;
                this.path[0] = "img/Carrot/Carrot_Age_";
            }
            if (this.seed == "beetrootseed") {
                this.growtime = 100;
                this.maxgrowlvl = 3;
                this.path[0] = "img/Beetroot/Beetroot_Age_";
            }
            if (this.seed == "potatoseed") {
                this.growtime = 100;
                this.maxgrowlvl = 3;
                this.path[0] = "img/Potato/Potato_Age_";
            }
            if (this.seed == "pumpkinseed") {
                this.growtime = 100;
                this.maxgrowlvl = 8;
                this.path[0] = "img/Pumpkin/Pumpkin_Stem_Age_";
            }
            if (this.seed == "wheatseed") {
                this.growtime = 100;
                this.maxgrowlvl = 6;
                this.path[0] = "img/Wheat/Wheat_Age_";
            }
            this.path[1] = ".webp";

            
            this.growlvl = 0;
            this.growtimecounter = 0;
            //setInterval(this.update, this.growtime);
            
        }


        draw(): void {
            this.imgPlant.src = this.path[0] + this.growlvl + this.path[1];
            ctx.drawImage(this.imgPlant, this.position.x, this.position.y);
            //console.log(this.growlvl);

        }

        update(): void {            //if (this. growlvl <= this.maxgrowlvl) {

            this.growtimecounter++;
            if (this.growtimecounter >= this.growtime) {
                if (this.growlvl < this.maxgrowlvl) {
                    this.growlvl++;
                }
                
                this.growtimecounter = 0;
            }
            console.log(this.growtimecounter);
            //console.log(this.maxgrowlvl);
        //}
        //else {

        //console.log("plant is ready sir");
        }

    }
}