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

        emaralamount: number;
        imgeemarald: HTMLImageElement[] = [];
        timer: number = 30;



        item: ITEM[] = [];
        //allitems: string[] = ["potato", "wheat", "carrot", "beetroot", "pumpkin", "fertilizer", "pesticide" , "beetrootseed" , "wheatseed", "pumpkinseed", "potatoseed", "carrotseed" ];
        //buy: boolean[] = [false, false, false, false, false, false, true, true, true, true, true, true];

        constructor(_emeralamount: number) {


            this.emaralamount = _emeralamount;
            //this.randomprice();
            this.updateUI();

        }
        updateshop(): void {
            this.timer--;
            if (this.timer <= -1) {
                this.timer = 30;
                this.randomprice();
                this.updateUI();
            }
            let storetime: HTMLParamElement = <HTMLParamElement>document.body.querySelector("#timer");
            storetime.innerHTML = this.timer.toString() + "s";

        }
        updateUI(): void {
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
                //tool.appendChild(this.imgeemarald[i]);
            }
            //console.log(this.item[2].randomprice);
            emaraldLabel.innerHTML = this.emaralamount.toString() + "x";

        }
        randomprice(): void {                                                                                                       //update Shop prices
            for (let i: number = 0; i < this.item.length; i++) {
                this.item[i].randomprice = Math.floor(Math.random() * (this.item[i].maxprice - this.item[i].minprice + 1) + this.item[i].minprice);
            }
        }

        sell(_name: string): void {
            let itemname: string = _name;

            for (let i: number = 0; i < this.item.length; i++) {

                if (this.item[i].itemname == itemname) {
                    console.log(itemname);
                    this.emaralamount += this.item[i].randomprice;
                    this.updateUI();
                }
            }
        }
        buy(_name: string): void {

            let itemname: string = _name;

            for (let i: number = 0; i < this.item.length; i++) {

                if ((this.item[i].itemname == itemname + "seed") || (this.item[i].itemname == itemname)) {
                    console.log(this.item.length);
                    if (this.emaralamount - this.item[i].randomprice >= 0) {
                        this.emaralamount -= this.item[i].randomprice;
                        this.item[i].amount++;
                        this.updateUI();
                    }
                }

            }

        }

    }
}