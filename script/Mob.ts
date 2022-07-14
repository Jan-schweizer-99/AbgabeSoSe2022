namespace Gemuesegarten {
    enum DIRECTION {
        LEFT,
        RIGHT,
        UP,
        DOWN
    }

    export class Mob {
        
        public direction: DIRECTION;
        frame: number;
        framedelay: number = 0;
        position: Vector;

        minpostion: Vector;
        maxpostion: Vector;

        imgMob: HTMLImageElement[] = [];
        mobpath: string[] = [];
        mode: string;

        constructor(_position: Vector, _mode: string) {

            this.mode = _mode;

            console.log(this.mode);
            this.frame = 0;
            this.position = _position;
            this.position.y -= 40;
            //canvas.addEventListener("click", this.pathclicklisterner);
            if (this.mode == "world") {
                this.mobpath[0] = "img/bee/world/Bee_types_BE_";

                this.minpostion = new Vector(-40, -40);
                this.maxpostion = new Vector(1940, 1120);

            }
            if (this.mode == "block") {
                this.mobpath[0] = "img/bee/block/Bee_types_BE_";

                this.minpostion = new Vector(_position.x + 50, _position.y);
                this.maxpostion = new Vector(_position.x + 300 - 50, _position.y + 300);
                this.direction = DIRECTION.RIGHT;

            }
            this.mobpath[1] = ".png";

            for (let i: number = 0; i <= 8; i++) {
                this.imgMob[i] = new Image();
                this.imgMob[i].src = this.mobpath[0] + i + this.mobpath[1];
            }

        }

        update(): void {
            this.frame++;

            //this.imgMob.src = this.mobpath[0] + this.frame + this.mobpath[1];

            ctx.drawImage(this.imgMob[this.frame], this.position.x - 40, this.position.y - 40);
            
            if (this.frame == 8) {
                this.frame = 0;
            }


            if (this.mode == "world") {
                this.position.x += 4;
                this.position.y += 4;


                if (this.position.y >= this.maxpostion.y) {
                    this.position.y = this.minpostion.y;
                }
                if (this.position.x >= this.maxpostion.x) {
                    this.position.x = this.minpostion.x;
                }
            }
            if (this.mode == "block") {
                if (this.direction == DIRECTION.RIGHT) {

                    if (this.position.x >= this.maxpostion.x) {
                        this.direction = DIRECTION.LEFT;
                    }
                    else {
                        this.position.x += 4;
                    }
                }
                if (this.direction == DIRECTION.LEFT) {
                    if (this.position.x <= this.minpostion.x) {
                        this.direction = DIRECTION.RIGHT;
                    }
                    else {
                        this.position.x -= 4;
                    }
                }
            }



        }
    }
}
