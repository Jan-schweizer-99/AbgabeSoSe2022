namespace Gemuesegarten {
    export class Wheat extends Plant {

        constructor(_seed: string, _position: Vector) {
            super(_seed, _position);
            this.growtime = 80;
            this.maxgrowlvl = 6;
            this.path[0] = "img/Wheat/Wheat_Age_";
            console.log("der HUSO FUNZT");
        }

    }
}