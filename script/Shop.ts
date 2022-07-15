namespace Gemuesegarten {
    export interface ITEM {

        itemname: string;
        minprice: number;
        maxprice: number;
        buy: boolean;
        germanName: string;
        randomprice: number;
        amount: number;
    }

    export class Shop {

        public item: ITEM[] = [];
        private timer: number = 30;
        private imgeemarald: HTMLImageElement[] = [];
        private emaralamount: number;


        constructor(_emeralamount: number) {
            this.emaralamount = _emeralamount;
            this.updateUI();
        }

        public updateshop(): void {
            let storetime: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#timer");      //definition des shop timers
            this.timer--;               
            if (this.timer <= -1) { //wenn der timer 0
                this.timer = 30;    //setze den shop timer wieder auf 30
                this.randomprice(); //erstelle wieder neue random shop preise
                this.updateUI();    //update die UI
            }
            storetime.innerHTML = this.timer.toString() + "s";  //aktualisiere shopzeit im HTML

        }
        public updateUI(): void {

            let emaraldLabel: HTMLParamElement = <HTMLParamElement>document.body.querySelector("#emarals");

            for (let i: number = 0; i < this.item.length; i++) {
                this.imgeemarald[i] = new Image();
                this.imgeemarald[i].src = "img/items/Emerald.webp";
                this.imgeemarald[i].width = 24;
                this.imgeemarald[i].height = 24;
                let tool: HTMLParamElement = <HTMLParamElement>document.body.querySelector("#" + this.item[i].itemname + "price");
                tool.innerHTML = this.item[i].randomprice.toString();
                tool.appendChild(this.imgeemarald[i]);
            }

            for (let i: number = 5; i < this.item.length; i++) {
                let tool: HTMLParamElement = <HTMLParamElement>document.body.querySelector("#" + this.item[i].itemname + "amount");
                tool.innerHTML = this.item[i].amount.toString();
            }

            emaraldLabel.innerHTML = this.emaralamount.toString() + "x";    //verkette die emaralzahl mit x und aktualisier sie im shop

        }
        public randomprice(): void {                                                                                                       //update Shop prices
            for (let i: number = 0; i < this.item.length; i++) {
                this.item[i].randomprice = Math.floor(Math.random() * (this.item[i].maxprice - this.item[i].minprice + 1) + this.item[i].minprice);
            }
            this.updateUI();
        }


        public sell(_name: string): void {
            let itemname: string = _name;

            for (let i: number = 0; i < this.item.length; i++) {

                if (this.item[i].itemname == itemname) {
                    console.log(itemname);
                    this.emaralamount += this.item[i].randomprice;
                    this.updateUI();
                }
            }
        }

        public buy(_name: string): void {

            //let itemname: string = _name;
            
            for (let i: number = 0; i < this.item.length; i++) {        //frage alle seed items ab ob eines richtig 
                if ((this.item[i].itemname == _name + "seed")) {     //(kleine hilfe) verkette den itemnamen mit dem seed
                    this.buyhelp(i);                                    //öffne kaufhilfe (also ob es kaufbar ist)
                }
            }
            if ((_name == "fertilizer")) {                           //wenn es Dünger ist 
                this.buyhelp(5);                                        //öffne kaufhilfe
            }
            if ((_name == "pesticide")) {                            //wenn es Pestiziede sind 
                this.buyhelp(6);                                        //öffne kaufhilfe
            }
        }

        private buyhelp(_number: number): void {
            if (this.emaralamount - this.item[_number].randomprice >= 0) {
                this.emaralamount -= this.item[_number].randomprice;
                this.item[_number].amount++;
                this.updateUI();
            }
        }
    }
}