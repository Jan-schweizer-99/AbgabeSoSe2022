namespace Gemuesegarten {
    export class Pumpkin extends Plant {

        constructor(_seed: string, _position: Vector) {
            super(_seed, _position);
            this.growtime = 60;
            this.maxgrowlvl = 8;
            this.path[0] = "img/Pumpkin/Pumpkin_Stem_Age_";
        }

    }
}