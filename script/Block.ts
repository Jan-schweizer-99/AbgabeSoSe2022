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
        waterlevel: number[] = [0, 1, 0]; //Wert 1 minimales Wasserlevel //Wert 2 derzeitiges Wasserlevel // Wert 3 maximales Wasserlevel
        pestlevel: number;
        fertilizerlevel: number;

        position: Vector;
        plant: Plant;

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
                        this.status = STATUS.WATERED;
                    }
                    else {
                        console.log("erst Wässern dann kann gepflanzt werden");
                    }
                    break;
                case STATUS.WATERED:
                    if (tool == "pumpkinseed") {
                        this.plant = new Plant("pumpkinseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (tool == "carrotseed") {
                        this.plant = new Plant("carrotseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (tool == "potatoseed") {
                        this.plant = new Plant("potatoseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (tool == "beetrootseed") {
                        this.plant = new Plant("beetrootseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (tool == "wheatseed") {
                        this.plant = new Plant("wheatseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    else {
                        console.log("erst Wässern dann kann ");
                    }
                    break;
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
        update(): void {
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

            switch (this.status) {
                case STATUS.GROW:
                    this.waterlevel[1] --;
                    this.plant.draw();
                    this.plant.update();
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