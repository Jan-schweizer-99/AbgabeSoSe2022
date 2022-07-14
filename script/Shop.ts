namespace Gemuesegarten {
    export interface ITEM {

        itemname: string;
        minprice: number;
        maxprice: number;
        buy: boolean;
        germanName: string;

                
    }
    export class Shop {

        pricerange: number;
        emaralamount: number;


        item: ITEM[] = [];
        //allitems: string[] = ["potato", "wheat", "carrot", "beetroot", "pumpkin", "fertilizer", "pesticide" , "beetrootseed" , "wheatseed", "pumpkinseed", "potatoseed", "carrotseed" ];
        //buy: boolean[] = [false, false, false, false, false, false, true, true, true, true, true, true];
        
        constructor(_pricerange: number, _emaralamount: number) {
            this.pricerange = _pricerange;
            this.emaralamount = _emaralamount;

            for (let i: number = 0; i < this.allitems.length; i++) {
                this.item[i].buy = this.buy[i];
                this.item[i].itemname = this.allitems[i];
                if (i <= 4) {
                this.item[i].price = this.randomprice();
                }


            }
            update(): void {

            }
            

        }
        randomprice(): number {
            return Math.floor(Math.random() * this.pricerange);
        }

    }
}