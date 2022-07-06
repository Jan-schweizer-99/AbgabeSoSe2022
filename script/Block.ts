namespace Gemuesegarten {
    enum STATUS {
        DEFAULT,
        FERTILIZED,
        WATERED,
        GROW,
        READY
    }
    export class Block {



        imgBlock: HTMLImageElement = new Image();
        public path: Path2D = new Path2D();
        public hover: boolean = false;

        public blocknumber: number;

        position: Vector;

        private status: STATUS;



        constructor(_position: Vector, _blocknumber: number) {

            this.status = STATUS.DEFAULT;
            this.blocknumber = _blocknumber;
            this.position = _position;
            //canvas.addEventListener("click", this.pathclicklisterner);
            this.imgBlock.src = "img/Grasblock.webp";
            this.drawPath();
        }
        public doClick(_tool: string): void {
            let tool: string = _tool;
            switch (this.status) {
                case STATUS.DEFAULT:
                    if (tool == "fertilizer") {
                        this.imgBlock.src = "img/Ackerboden_1.webp";
                        this.status = STATUS.FERTILIZED;
                    }
                    else {
                        console.log("erst Düngen");
                    }
                    break;
                case STATUS.FERTILIZED:
                    if (tool == "water") {
                        this.imgBlock.src = "img/Ackerboden_2.webp";
                    }
                    else {
                        console.log("erst Wässern");
                    }

            }



        }

        getpath(): Path2D {
            return this.path;
        }
        setHover(): void {
            this.hover = true;
        }
        clearHover(): void {
            this.hover = false;
        }

        /*pathclicklisterner(_event: MouseEvent): void {
            if (ctx.isPointInPath(this.path, mousepositon.x, mousepositon.y)) {
                console.log("Pfad wurde gedrückt");
                console.log("test für pfad in ");
            }
    
        }*/
        draw(): void {
            ctx.drawImage(this.imgBlock, this.position.x, this.position.y);
            if (this.hover == true) {
                ctx.fill(this.path);
                ctx.fillStyle = "#ff000050";
                this.drawPath();
            }
            if (this.hover == false) {

                ctx.fill(this.path);
                ctx.fillStyle = "#ff000000";
                this.drawPath();
            }
        }
        drawPath(): void {
            //ctx.drawImage(this.imgBlock, 0, 0);
            //ctx.beginPath();
            this.path.moveTo(16 + this.position.x, 67 + this.position.y);
            this.path.lineTo(150 + this.position.x, 0 + this.position.y);
            this.path.lineTo(284 + this.position.x, 67 + this.position.y);
            this.path.lineTo(150 + this.position.x, 2 * 67 + this.position.y);
            this.path.closePath();

            //ctx.stroke();

        }
    }

}