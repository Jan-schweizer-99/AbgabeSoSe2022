namespace Gemuesegarten {
    export enum STATUS {
        DEFAULT,
        FERTILIZED,
        WATERED,
        GROW,
        READY
    }
    export class Block {


        blockinfo: string;
        imgBlock: HTMLImageElement = new Image();
        public path: Path2D = new Path2D();
        public hover: boolean = false;

        public blocknumber: number;
        waterlevel: number[] = [-100, 0, 400]; //Wert 1 minimales Wasserlevel //Wert 2 derzeitiges Wasserlevel // Wert 3 maximales Wasserlevel
        fertilizerlevel: number[] = [-100, 0, 400]; //Wert 1 minimales Wasserlevel //Wert 2 derzeitiges Wasserlevel // Wert 3 maximales Wasserlevel
        pestlevel: number;

        position: Vector;
        plant: Plant;

        mobspawn: number;
        mobspawntime: number = 250;
        mobspawner: boolean = false;

        public kill: Boolean;
        public sell: Boolean = false;

        public status: STATUS;




        constructor(_position: Vector, _blocknumber: number) {

            this.mobspawn = this.mobspawntime;
            this.status = STATUS.DEFAULT;
            this.blocknumber = _blocknumber;
            this.position = _position;
            //canvas.addEventListener("click", this.pathclicklisterner);
            this.imgBlock.src = "img/Grasblock.webp";
            this.drawPath();
        }
        newBee(): void {
            this.plant.bee.push(new Mob(new Vector(this.position.x, this.position.y), "block"));
            //this.mobspawner = true;
            console.log("test");
        }
        killBee(): void {
            this.plant.bee.pop();               // letztes mob aus pflanze löschen
            if (this.plant.bee.length == 0) {
                this.mobspawner = false;               //ausschalten der mobspawner Block
                this.mobspawn = this.mobspawntime; //Reset der Spawnzeit für neue Biene
            }
        }
        public doClick(_tool: string, _itemshop: Shop): void {
            //let itemShop: Shop = _itemshop;
            let tool: string = _tool;
            switch (this.status) {
                case STATUS.DEFAULT:
                    if (tool == "fertilizer" && (_itemshop.item[5].amount > 0)) {
                        _itemshop.item[5].amount--;
                        _itemshop.updateUI();
                        console.log();
                        this.imgBlock.src = "img/Ackerboden_1.webp";
                        this.fertilizerlevel[1] = this.fertilizerlevel[2] - 100;
                        this.status = STATUS.FERTILIZED;
                    }
                    else {
                        console.log("erst Düngen");
                    }
                    break;
                case STATUS.FERTILIZED:
                    if (tool == "water") {
                        this.imgBlock.src = "img/Ackerboden_2.webp";
                        this.waterlevel[1] = this.waterlevel[2] - 100;
                        this.status = STATUS.WATERED;
                    }
                    else {
                        console.log("erst Wässern dann kann gepflanzt werden");
                    }
                    break;
                case STATUS.WATERED:
                    if (tool == "pumpkinseed" && (_itemshop.item[9].amount > 0)) {
                        _itemshop.item[9].amount--;
                        _itemshop.updateUI();
                        this.plant = new Plant("pumpkinseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (tool == "carrotseed" && (_itemshop.item[11].amount > 0)) {
                        _itemshop.item[11].amount--;
                        _itemshop.updateUI();
                        this.plant = new Plant("carrotseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (tool == "potatoseed" && (_itemshop.item[10].amount > 0)) {
                        _itemshop.item[10].amount--;
                        _itemshop.updateUI();
                        this.plant = new Plant("potatoseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (tool == "beetrootseed" && (_itemshop.item[7].amount > 0)) {
                        _itemshop.item[7].amount--;
                        _itemshop.updateUI();
                        this.plant = new Plant("beetrootseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (tool == "wheatseed" && (_itemshop.item[8].amount > 0)) {
                        _itemshop.item[8].amount--;
                        _itemshop.updateUI();
                        this.plant = new Plant("wheatseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    else {
                        console.log("erst Wässern dann kann ");
                    }
                    break;
                case STATUS.GROW:
                    if (tool == "water") {
                        this.waterlevel[1] +=  100;
                    }
                    if (tool == "fertilizer" && (_itemshop.item[5].amount > 0)) {
                        _itemshop.item[5].amount--;
                        _itemshop.updateUI();
                        this.fertilizerlevel[1] += 100;
                    }
                    if (tool == "pesticide" && (_itemshop.item[6].amount > 0)) {
                        _itemshop.item[6].amount--;
                        _itemshop.updateUI();
                        this.killBee();
                    }
                    break;
                case STATUS.READY:
                    if (tool == "pesticide" && (_itemshop.item[6].amount > 0)) {
                        _itemshop.item[6].amount--;
                        _itemshop.updateUI();
                        this.killBee();
                    }
                    if ((tool == "sell") && this.sell == true) {

                        _itemshop.sell(this.plant.seed.substring(0, this.plant.seed.length - 4));
                        this.kill = true;
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
            this.blockinfo = "water: " + this.waterlevel[1].toString() + " min: " + this.waterlevel[0].toString() + " max: " + this.waterlevel[2].toString() + "<br> fertilizer: " + this.fertilizerlevel[1].toString() + " min: " + this.fertilizerlevel[0].toString() + " max: " + this.fertilizerlevel[2].toString();
            ctx.drawImage(this.imgBlock, this.position.x, this.position.y);
            if (this.hover == true) {
                ctx.fill(this.path);
                ctx.fillStyle = "#ff000050";
                //this.drawPath();
            }
            if (this.hover == false) {

                ctx.fill(this.path);
                ctx.fillStyle = "#ff000000";
                //this.drawPath();
            }

            switch (this.status) {
                case STATUS.GROW:
                    this.waterlevel[1]--;
                    this.fertilizerlevel[1]--;

                    this.plant.draw();
                    this.plant.update();

                    //water events

                    if (this.waterlevel[1] < this.waterlevel[0]) {
                        this.kill = true;

                    }
                    if (this.waterlevel[1] > this.waterlevel[2]) {
                        this.kill = true;
                    }

                    if (this.waterlevel[1] <= 0) {                      //change image for image
                        this.imgBlock.src = "img/Ackerboden_1.webp";
                    }
                    if (this.waterlevel[1] >= 0) {
                        this.imgBlock.src = "img/Ackerboden_2.webp";
                    }

                    //fertilizer events

                    if (this.fertilizerlevel[1] < this.waterlevel[0]) {
                        this.kill = true;

                    }
                    if (this.fertilizerlevel[1] > this.waterlevel[2]) {
                        this.kill = true;
                    }

                    //mob events


                    this.updatePests();
                    if (this.plant.grown == true) {
                        this.status = STATUS.READY;
                    }
                    break;
                case STATUS.READY:
                    if (this.plant.bee.length > 0) {
                        this.sell = false;
                    }
                    else {
                        this.sell = true;
                    }
                    this.updatePests();
                    console.log("Plant is Ready");
                    this.plant.draw();
                    break;
            }


        }
        updatePests(): void {

            if (this.plant.bee.length > 2) {
                this.kill = true;

            }
            if (this.mobspawner == true) {
                this.mobspawn++;
                if (this.mobspawn >= this.mobspawntime) {
                    this.mobspawn = 0;
                    this.newBee();
                }
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