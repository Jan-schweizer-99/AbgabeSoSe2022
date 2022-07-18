namespace Gemuesegarten {
    export class Carrot extends Plant {

        constructor(_seed: string, _position: Vector) {
            super(_seed, _position);
            this.growtime = 100;
            this.maxgrowlvl = 3;
            this.path[0] = "img/Carrot/Carrot_Age_";
        }

    }
}