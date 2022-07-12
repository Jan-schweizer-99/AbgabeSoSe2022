namespace Gemuesegarten {


    export class Mob {

        frame: number;
        position: Vector;
        imgMob: HTMLImageElement = new Image();
        mobpath: string[] = [];
        private flightdirection: FLIGHTDIRECTION;

        constructor(_position: Vector) {

            this.frame = 0;
            this.position = _position;
            //canvas.addEventListener("click", this.pathclicklisterner);
            this.mobpath[0] = "img/bee/Bee_types_BE_";
            this.mobpath[1] = ".png";

        }

        update(): void {
            this.frame++;
            this.imgMob.src = this.mobpath[0] + this.frame + this.mobpath[1];
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.imgMob, this.position.x - 40, this.position.y - 40);
            ctx.restore();
            this.position.x -= 4;
            if (this.position.x <= -1940) {
                this.position.x = 40;
            }
            this.position.y += 4;
            if (this.position.y >= 1120) {
                this.position.y = -40;
            }











            if (this.frame == 8) {
                this.frame = 0;
            }


        }
    }
}
