namespace Gemuesegarten {
    export enum STATUS {
        DEFAULT,
        FERTILIZED,
        WATERED,
        GROW,
        READY
    }
    export class Block {

        public status: STATUS;              //Status des Blocks

        public hover: boolean = false;              //hoverzustand des Blocks

        public blocknumber: number;                 //Block nummer für auswertung
        public position: Vector;                    //Position des Blocks

        public path: Path2D = new Path2D();         //klickbarer Pfad des Blocks

        public waterlevel: number[] = [-100, -100, 400];        //Wert 1 minimales Wasserlevel //Wert 2 derzeitiges Wasserlevel // Wert 3 maximales Wasserlevel
        public fertilizerlevel: number[] = [-100, -100, 500];   //Wert 1 minimales Wasserlevel //Wert 2 derzeitiges Wasserlevel // Wert 3 maximales Wasserlevel
        public pestlevel: number;

        public kill: Boolean;               //block zerstören aktiv
        public sell: Boolean = false;       //Pflanze verkaufbar


        public mobspawner: boolean = false; //Mob spawner an falls sich Biene in Pflanze befindet

        private mobspawntime: number = 250; //zeit bis mob spawnt
        private mobspawn: number;

        private plant: Plant;               //Pflanze die später gekapselt wird


        private imgBlock: HTMLImageElement = new Image();   //Bildquelle für Block




        constructor(_position: Vector, _blocknumber: number) {
            this.mobspawn = this.mobspawntime;
            this.status = STATUS.DEFAULT;
            this.blocknumber = _blocknumber;
            this.position = _position;
            this.imgBlock.src = "img/Grasblock.webp";
            this.drawPath();
        }

        public update(): void {

            ctx.drawImage(this.imgBlock, this.position.x, this.position.y);     //male Block

            if (this.hover == true) {                                           //wenn gehovert wurde setze Transparenz auf 50%
                ctx.fillStyle = "#ff000050";
                ctx.fill(this.path);
            }
            if (this.hover == false) {                                          //wenn nicht gehovert wurde setze Transparenz auf 0%
                ctx.fillStyle = "#ff000000";
                ctx.fill(this.path);
            }

            /**********************/
            /**ENUM STATUS EVENTS**/
            /**********************/

            switch (this.status) {
                case STATUS.GROW:                /** Status GROW **/

                    this.waterlevel[1]--;       //dezimieren aktuelles Wasserlevel
                    this.fertilizerlevel[1]--;  //dezimieren aktuelles Düngerlevel

                    this.plant.draw();          //zeichne Pflanze
                    this.plant.update();        //update die Pflanze
                    this.updatePests();         //akualisiere den Mobspawner

                    //water events

                    if (this.waterlevel[1] < this.waterlevel[0]) {      //setze den Blockstatus auf zerstören wenn Block unterwässert ist
                        this.kill = true;
                    }

                    if (this.waterlevel[1] > this.waterlevel[2]) {      //setze den Blockstatus auf zerstören wenn Block überrwässert ist
                        this.kill = true;
                    }

                    if (this.waterlevel[1] <= 0) {                      //ändere Bild wenn pflanze kurz vor der unterwässerung steht
                        this.imgBlock.src = "img/Ackerboden_1.webp";
                    }
                    if (this.waterlevel[1] >= 0) {                      //ändere Bild wenn pflanze genug wasser hat
                        this.imgBlock.src = "img/Ackerboden_2.webp";
                    }

                    //fertilizer events


                    if (this.fertilizerlevel[1] < this.fertilizerlevel[0]) {  //setze den Blockstatus auf zerstören wenn Block unterdüngt ist
                        this.kill = true;
                    }
                    if (this.fertilizerlevel[1] > this.fertilizerlevel[2]) { //setze den Blockstatus auf zerstören wenn Block unterdüngt ist
                        this.kill = true;
                    }



                    if (this.plant.grown == true) {       //Wenn die Pflanze gewachsen ist setze den Status auf Ready
                        this.status = STATUS.READY;
                    }


                    break;
                case STATUS.READY:

                    this.updatePests();
                    this.plant.draw();

                    if (this.plant.bee.length > 0) {    //wenn Bienen auf der Pflanze sind kann der Block nicht verkauft werden
                        this.sell = false;
                    }
                    else {
                        this.sell = true;
                    }

                    break;
            }
        }


        public doClick(_tool: string, _itemshop: Shop): void {

            /*********************/
            /**ENUM CLICK EVENTS**/
            /*********************/


            switch (this.status) {

                /*Startdüngen*/

                case STATUS.DEFAULT:
                    if (_tool == "fertilizer" && (_itemshop.item[5].amount > 0)) {  //wenn Werkzeug Dünger und gemügent vorhanden ist

                        _itemshop.item[5].amount--;                                 //verwende ein Dünger
                        _itemshop.updateUI();                                       //und update den shop

                        this.fertilizerlevel[1] = this.fertilizerlevel[2] - 100;    //und setze einen Startwert für den Block

                        this.imgBlock.src = "img/Ackerboden_1.webp";                //ändere die Blocktextur

                        this.status = STATUS.FERTILIZED;                            //update in den nächsten Status
                    }
                    break;

                /*Startwässern*/

                case STATUS.FERTILIZED:
                    if (_tool == "water") {                                         //wenn Werkzeug Wasser

                        this.imgBlock.src = "img/Ackerboden_2.webp";                //update die Textur

                        this.waterlevel[1] = this.waterlevel[2] - 100;              //und setze einen Startwert für den Block

                        this.status = STATUS.WATERED;                               //update in den nächsten Status
                    }
                    break;

                /*anpflanzen*/

                case STATUS.WATERED:
                    if (_tool == "pumpkinseed" && (_itemshop.item[9].amount > 0)) { //wenn Werkzeug Kürbis und genügent vorhanden ist

                        _itemshop.item[9].amount--;                                 //verwende ein Kürbiskern
                        _itemshop.updateUI();                                       //und update den shop

                        this.plant = new Pumpkin("pumpkinseed", this.position);       //Kapsel die Pflanzen in den Block

                        this.status = STATUS.GROW;                                  //update für den nächsten Status
                    }

                    if (_tool == "carrotseed" && (_itemshop.item[11].amount > 0)) {

                        _itemshop.item[11].amount--;
                        _itemshop.updateUI();

                        this.plant = new Carrot("carrotseed", this.position);

                        this.status = STATUS.GROW;
                    }
                    if (_tool == "potatoseed" && (_itemshop.item[10].amount > 0)) {

                        _itemshop.item[10].amount--;
                        _itemshop.updateUI();

                        this.plant = new Potato("potatoseed", this.position);

                        this.status = STATUS.GROW;
                    }

                    if (_tool == "beetrootseed" && (_itemshop.item[7].amount > 0)) {

                        _itemshop.item[7].amount--;
                        _itemshop.updateUI();

                        this.plant = new Beetroot("beetrootseed", this.position);

                        this.status = STATUS.GROW;
                    }

                    
                    if (_tool == "wheatseed" && (_itemshop.item[8].amount > 0)) {

                        _itemshop.item[8].amount--;
                        _itemshop.updateUI();

                        this.plant = new Wheat("wheatseed", this.position);

                        this.status = STATUS.GROW;
                    }
                    break;
                case STATUS.GROW:

                    if (_tool == "water") {                                             //update das Wasserlevel des blocks mit 100
                        this.waterlevel[1] += 100;
                    }

                    if (_tool == "fertilizer" && (_itemshop.item[5].amount > 0)) {      //update das Düngerlevel des blocks mit 100

                        _itemshop.item[5].amount--;
                        _itemshop.updateUI();

                        this.fertilizerlevel[1] += 100;
                    }

                    if (_tool == "pesticide" && (_itemshop.item[6].amount > 0) && (this.plant.bee.length > 0)) {    //wenn das Werkzeug Pestizide ist, mehr als 1 biene im Feld ist und genügent Pestizide vorhanden sind

                        _itemshop.item[6].amount--;                                                                 //update die anzahl der Pestizide im Inventar

                        _itemshop.updateUI();                                                                       //update den Itemshop           
                        this.killBee();                                                                             //und Töte eine Biene
                    }

                    break;

                case STATUS.READY:

                    if (_tool == "pesticide" && (_itemshop.item[6].amount > 0) && (this.plant.bee.length > 0)) {    //wenn das Werkzeug Pestizide ist, mehr als 1 biene im Feld ist und genügent Pestizide vorhanden sind

                        _itemshop.item[6].amount--;
                        _itemshop.updateUI();                                                                       //update den shop

                        this.killBee();                                                                             //töte eine Biene
                    }
                    if ((_tool == "sell") && this.sell == true) {                                                   //wenn das Werkzeug ist verkaufen und keine Bienen auf dem feld sind

                        _itemshop.sell(this.plant.seed.substring(0, this.plant.seed.length - 4));                   //dann verkauf dieses Item
                        this.kill = true;                                                                           //und zerstöre den Block
                    }
                    break;
            }
        }

        public setHover(): void {
            this.hover = true;
        }
        public clearHover(): void {
            this.hover = false;
        }



        private drawPath(): void {
            this.path.moveTo(16 + this.position.x, 67 + this.position.y);
            this.path.lineTo(150 + this.position.x, 0 + this.position.y);
            this.path.lineTo(284 + this.position.x, 67 + this.position.y);
            this.path.lineTo(150 + this.position.x, 2 * 67 + this.position.y);
            this.path.closePath();
        }

        private updatePests(): void {
            if (this.plant.bee.length > 2) {        //wenn mehr als 2 bzw 3 Bienen im Feld sind zerstöre den Block
                this.kill = true;

            }
            if (this.mobspawner == true) {                  //wenn der mobspawner an ist 
                this.mobspawn++;
                if (this.mobspawn >= this.mobspawntime) {   //
                    this.mobspawn = 0;
                    //this.plant.bee.push(new Blockbee(new Vector(this.position.x, this.position.y), "block")); //neue block Biene
                    this.plant.bee.push(new Blockbee(new Vector(this.position.x, this.position.y))); //neue block Biene
                }
            }
        }
        
        private killBee(): void {
            this.plant.bee.pop();                       //letztes Biene aus pflanze löschen
            if (this.plant.bee.length == 0) {           //wenn keine Bienen mehr drinn sind
                this.mobspawner = false;                //ausschalten des mobspawners
                this.mobspawn = this.mobspawntime;      //Reset der Spawnzeit für neue Biene
            }
        }
    }


}