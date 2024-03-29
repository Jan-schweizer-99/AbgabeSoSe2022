namespace Gemuesegarten {

    export let ctx: CanvasRenderingContext2D;
    
    window.addEventListener("load", hndLoad);

    let mousepositon: Vector;

    let rect: DOMRect;
    let scaleX: number;
    let scaleY: number;

    let tool: string = "fertilizer";
    let selectedblock: number = 0;

    let block: Block[] = [];
    let bee: Mob[] = [];
    let beenumber: number;

    //data for shop 
    let itemShop: Shop;
    let item: ITEM[] = [];
    let gemamount: number;
    //let world: World[] = [];

    


    function hndLoad(_event: Event): void {

        buildField();
        initslider();       
        mousepositon = new Vector(0, 0); // erstelle deine Mausposition


        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector("#canvas");
        let startgame: HTMLButtonElement = <HTMLButtonElement>document.querySelector("button#start");
        let tool: HTMLInputElement = <HTMLInputElement>document.querySelector("div#shop");
        let slider: HTMLInputElement = <HTMLInputElement>document.querySelector("div#menu");
        
        let shopbutton: HTMLButtonElement[] = [];

        for (let i: number = 0; i < 7; i++) {                                                       //installing shopbutton listener
            shopbutton[i] = <HTMLButtonElement>document.querySelector("button#buy" + item[i].itemname);
            shopbutton[i].addEventListener("click", buyItem);
        }


        tool.addEventListener("change", handleChange);
        slider.addEventListener("input", handleslider);
        startgame.addEventListener("click", startGame);
        ctx = canvas.getContext("2d")!;

        rect = canvas.getBoundingClientRect();                //initialisierung für canvas click listener
        scaleX = canvas.width / rect.width;                   //initialisierung für canvas click listener
        scaleY = canvas.height / rect.height;                 //initialisierung für canvas click listener

        canvas.addEventListener("click", pathclicklisterner); //click listener für canvas

        canvas.addEventListener("mousemove", setmouseposition); //oeffne bei der Mausbewegung irgendwo im auf der Seite die handlemousemove funktion

    }
    function buyItem(_event: Event): void {
        itemShop.buy((_event.target as Element).id.slice(3));
    }
    function buildField(): void {
        let index: number = 0;                                                                                      // Index für Feld-Feld Generator


        let startpositon: Vector = new Vector(660, 150);                                                            // start Postion für Feld-Generator
        let positon: Vector = new Vector(134, 67);                                                                  // verschiebung der blöcke
        let positondown: Vector = new Vector(-134, 67);                                                             // Position nach unten für Feld-Generator


    

        for (let i: number = 0; i < 6; i++) {
            for (let i: number = 0; i < 7; i++) {

                block[index] = new Block(new Vector(startpositon.x + i * positon.x, startpositon.y + i * positon.y), index);
                index++;
            }

            startpositon.add(positondown);                                                                                      //Addiere Startposition in die zweite Reihe
        }
    }
    function initslider(): void {
        let itemsnames: string[] = ["potato", "wheat", "carrot", "beetroot", "pumpkin", "fertilizer", "pesticide", "beetrootseed", "wheatseed", "pumpkinseed", "potatoseed", "carrotseed"];
        let germanName: string[] = ["Kartoffel", "Weizen", "Karotte", "Rote Bete", "Kürbis", "Dünger", "Pestiziede", "Rote Bete", "Weizen", "Kürbis", "kartoffel", "Karotte"];
        let buy: boolean[] = [false, false, false, false, false, true, true, true, true, true, true, true];
        for (let i: number = 0; i < itemsnames.length; i++) {
            item[i] = {
                itemname: itemsnames[i],
                minprice: 0,
                maxprice: 0,
                buy: buy[i],
                germanName: germanName[i],
                randomprice: 0,
                amount: 0
            };
        }
        let beeAmount: HTMLInputElement = <HTMLInputElement>document.body.querySelector("#bees");
        let beeslabel: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#beesLabel");
        let gemAmount: HTMLInputElement = <HTMLInputElement>document.body.querySelector("#startgems");
        let gemlabel: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#startgemsLabel");
        
        for (let i: number = 0; i < itemsnames.length; i++) {

            let slider: HTMLInputElement = <HTMLInputElement>document.body.querySelector("#max" + itemsnames[i] + "Price");
            let label: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#" + itemsnames[i] + "Label");
            //label.innerHTML = nowAmount;
            item[i].maxprice = Number(slider.value);
            item[i].minprice = Number(slider.min);

            if (item[i].buy == false) {
                label.innerHTML = item[i].germanName + " Gewinn: " + slider.min + "/" + slider.value + "/" + slider.max;
            }
            if (item[i].buy == true) {
                label.innerHTML = item[i].germanName + " kosten: " + slider.min + "/" + slider.value + "/" + slider.max;
            }
        }
        gemlabel.innerHTML = "Startgems: " + gemAmount.value;
        beeslabel.innerHTML = "Bienen: " + beeAmount.value;
        beenumber = Number(beeAmount.value);
        gemamount = Number(gemAmount.value);
    }

    function startGame(_event: Event): void {             //start des spieles
        
        let startScreen: HTMLDivElement = <HTMLDivElement>document.body.querySelector("#menu");       //definiere das slider menü

        itemShop = new Shop(gemamount);                   //erstellen neuen shop
        for (let i: number = 0; i < item.length; i++) {   //schiebe eingestellte slider werte in den shop 
            itemShop.item.push(item[i]);
        }
        itemShop.randomprice();                           //generiere einen zufälligen shop preis
        startScreen.style.visibility = "hidden";          //verstecke das slider menü
        for (let i: number = 0; i < beenumber; i++) {     // Instanzierung der Bienen
            bee[i] = new Worldbee(new Vector(Math.random() * (1920 - 0) + 0, Math.random() * (1080 - 0) + 0));
        }
        setInterval(update, 40);                          //stare update funktion
        setInterval(updatetime, 1000);                    //stare updateshopzeit funktion
    }

    function updatetime(): void {
        itemShop.updateshop();
    }

    function handleslider(_event: Event): void {

        let nowAmount: string = (<HTMLInputElement>_event.target).value;
        let minAmount: string = (<HTMLInputElement>_event.target).min;
        let maxAmount: string = (<HTMLInputElement>_event.target).max;

        let name: string = (<HTMLInputElement>_event.target).name;
        //progress.value = parseFloat(amount);

        for (let i: number = 0; i < item.length; i++) {
            if (name == item[i].itemname) {
                let label: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#" + name + "Label");

                item[i].maxprice = Number(nowAmount);
                item[i].minprice = Number(minAmount);

                if (item[i].buy == false) {
                    label.innerHTML = item[i].germanName + " Gewinn: " + minAmount + "/" + nowAmount + "/" + maxAmount;
                }
                if (item[i].buy == true) {
                    label.innerHTML = item[i].germanName + " kosten: " + minAmount + "/" + nowAmount + "/" + maxAmount;
                }
            }

            if (name == "startgems") {
                let label: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#" + name + "Label");
                gemamount = Number(nowAmount);

                label.innerHTML = "Startgems: " + gemamount;
            }
            if (name == "bees") {
                let label: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#" + name + "Label");
                beenumber = Number(nowAmount); 

                label.innerHTML = "Bienen: " + beenumber;
            }

        }

    }
    function handleChange(_event: Event): void {

        let formData: FormData = new FormData(document.forms[0]);                                               //update Formdatas
        for (let entry of formData) {                                                                           //array of all Formdata
            let item: HTMLInputElement = <HTMLInputElement>document.querySelector("[value='" + entry[1] + "']");
            console.log(item.value);
            tool = item.value; //set selected item
        }
    }
    function update(): void {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector("#canvas");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#2e2e2e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fill();

        for (let index: number = 0; index < block.length; index++) {

            setprogressbar();

            if (block[index].kill == true) {                                                            //Zerstörung des Blockes -> weitere in Block.ts
                block[index] = new Block(block[index].position, block[index].blocknumber);              //ersetze zerstörten block 

            }

            block[index].update();                                                                      //update des blockes
        }
        for (let i: number = 0; i < beenumber; i++) {                                                                               //update alle Weltbienen
            bee[i].update();                                                                                                        //..
            for (let index: number = 0; index < block.length; index++) {                                                            //frage alle blöcke ab.
                if (ctx.isPointInPath(block[index].path, bee[i].position.x, bee[i].position.y)) {                                   //Wenn die "Welt" Biene ist im Pfad des blockes
                    if ((block[index].status == STATUS.GROW) || (block[index].status == STATUS.READY)) {                            //Der Blockzustand im Wachstum oder Fertig und
                        if (block[index].mobspawner == false) {                                                                     //fals der Mobspawner aus ist
                            block[index].mobspawner = true;                                                                         //schalte den Mobspawner des Blockes an
                            bee[i] = new Worldbee(new Vector(-40, Math.random() * (1080 - 0) + 0));                             //und setze die gleiche "Welt" Biene wieder an zurück an eine Random Position 
                        }
                    }
                }
            }
        }
    }
    function pathclicklisterner(_event: MouseEvent): void {
        for (let index: number = 0; index < block.length; index++) {                    //instanzierung
            if (ctx.isPointInPath(block[index].path, mousepositon.x, mousepositon.y)) { //wenn innerhalb eines Pfades gedrückt wurde
                block[index].doClick(tool, itemShop);                                   //dann Führe eine Aktion mit auf dem dementsprechenden Block mit jeweiligem ausgewähltem Werkzeug durch
            }
        }

    }
    function setprogressbar(): void {
        let progresbarWater: HTMLProgressElement = <HTMLProgressElement>document.querySelector("#prog-bar-water");           //dekleration der Progress bar
        let progresbarFertilizer: HTMLProgressElement = <HTMLProgressElement>document.querySelector("#prog-bar-fertilizer"); //dekleration der Progressbar vom Wasser
        progresbarWater.max = 100;
        progresbarFertilizer.max = 100;
        progresbarWater.value = getPercentage(block[selectedblock].waterlevel[1], block[selectedblock].waterlevel[0], block[selectedblock].waterlevel[2]);
        progresbarFertilizer.value = getPercentage(block[selectedblock].fertilizerlevel[1], block[selectedblock].fertilizerlevel[0], block[selectedblock].fertilizerlevel[2]);
    }

    function setmouseposition(_event: MouseEvent): void {
        
        let position: HTMLElement = <HTMLElement>document.querySelector("span");  //deklariere das span
        mousepositon.x = (_event.clientX - rect.left) * scaleX;                   //deklariere die X position mit der eventfunktion der Maus
        mousepositon.y = (_event.clientY - rect.top) * scaleY;                    //deklariere die y position mit der eventfunktion der Maus

        for (let index: number = 0; index < block.length; index++) {        //Feld makierung anzeigen  <-- bekomme gleich einen Kotzanfall wenn die scheise jetzt dann nicht funktioniert gut habs dirty gelöst

            if (ctx.isPointInPath(block[index].path, _event.clientX, _event.clientY)) { //wenn Mausposition auf dementsprechenden Feld ist
                position.style.left = (_event.clientX + 30) + "px";                     //aendere die Position des span (x) neben der Maus
                position.style.top = (_event.clientY) + "px";                           //aendere die position des span (y) neben der Maus

                selectedblock = block[index].blocknumber;                  //update ausgewählten block
                block[index].setHover();                                   //zeige Hover Position auf Feldern an

            }
            else {
                block[index].clearHover();
            }
        }
        //console.log(mousepositon.x, mousepositon.y);

    }
    export function getPercentage(_now: number, _min: number, _max: number): number {       //Rechne prozentwerte für slider aus
        let round: number = 1000;
        let percentage: number = ((_now - _min) / (_max - _min)) * 100;
        return Math.round(percentage * round) / round;
      }
}