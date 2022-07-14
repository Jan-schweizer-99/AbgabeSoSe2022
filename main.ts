namespace Gemuesegarten {

    export let ctx: CanvasRenderingContext2D;
    window.addEventListener("load", hndLoad);
    export let mousepositon: Vector;
    let rect: DOMRect;
    let scaleX: number;
    let scaleY: number;

    let tool: string = "fertilizer";
    let selectedblock: number = 0;

    let block: Block[] = [];
    let bee: Mob[] = [];
    let beenumber: number = 4;


    let item: ITEM[] = [];
    let gemamount: number;
    let allitems: string[] = ["potato", "wheat", "carrot", "beetroot", "pumpkin", "fertilizer", "pesticide", "beetrootseed", "wheatseed", "pumpkinseed", "potatoseed", "carrotseed"];
    let germanName: string[] = ["Kartoffel", "Weizen", "Karotte", "Rote Bete", "Kürbis", "Dünger", "Pestiziede", "Rote Bete", "Weizen", "Kürbis", "kartoffel", "Karotte"];
    let buy: boolean[] = [false, false, false, false, false, true, true, true, true, true, true, true];
    let minprice: number[] = [11, 11, 11, 11, 11, 1, 1, 1, 1, 1, 1, 1];
    let maxprice: number[] = [15, 15, 15, 15, 15, 5, 5, 5, 5, 5, 5, 5];

    //item[0].germanName = "0";


    //paths





    //let circle: Path2D;


    function hndLoad(_event: Event): void {
        let index: number = 0;                                                                                      // Index für Feld-Feld Generator


        let startpositon: Vector = new Vector(810, 110);                                                            // start Postion für Feld-Generator
        let positon: Vector = new Vector(134, 67);                                                                  // verschiebung der blöcke
        let positondown: Vector = new Vector(-134, 67);                                                             // Position nach unten für Feld-Generator

        for (let i: number = 0; i < allitems.length; i++) {

            item[i] = {
                itemname: allitems[i],
                minprice: 0,
                maxprice: 0,
                buy: buy[i],
                germanName: germanName[i]
            };
        }
        initslider();

        for (let i: number = 0; i < 6; i++) {
            for (let i: number = 0; i < 7; i++) {

                block[index] = new Block(new Vector(startpositon.x + i * positon.x, startpositon.y + i * positon.y), index);
                index++;
            }

            startpositon.add(positondown);                                                                                      //Addiere Startposition in die zweite Reihe
        }

        for (let i: number = 0; i < beenumber; i++) {                                                               // Instanzierung der Bienen
            bee[i] = new Mob(new Vector(Math.random() * (1920 - 0) + 0, Math.random() * (1080 - 0) + 0), "world");
        }

        mousepositon = new Vector(0, 0);
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector("#canvas");

        let tool: HTMLInputElement = <HTMLInputElement>document.querySelector("div#shop");
        let slider: HTMLInputElement = <HTMLInputElement>document.querySelector("div#menu");

        tool.addEventListener("change", handleChange);
        console.log(slider);
        slider.addEventListener("input", handleslider);


        ctx = canvas.getContext("2d")!;
        rect = canvas.getBoundingClientRect();

        scaleX = canvas.width / rect.width; //for canvas click listener
        scaleY = canvas.height / rect.height; //for canvas click listener


        canvas.addEventListener("click", pathclicklisterner);
        //canvas.addEventListener("mousemove", pathmouseoverlisterner); //path listener für auswahl
        canvas.addEventListener("mousemove", setmouseposition); //oeffne bei der Mausbewegung irgendwo im auf der Seite die handlemousemove funktion


        setInterval(update, 40);
        //requestAnimationFrame(update());
    }
    function initslider(): void {
        let beeAmount: HTMLInputElement = <HTMLInputElement>document.body.querySelector("#bees");
        let beeslabel: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#beesLabel");
        let gemAmount: HTMLInputElement = <HTMLInputElement>document.body.querySelector("#startgems");
        let gemlabel: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#startgemsLabel");
        
        for (let i: number = 0; i < allitems.length; i++) {

            let slider: HTMLInputElement = <HTMLInputElement>document.body.querySelector("#max" + allitems[i] + "Price");
            let label: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#" + allitems[i] + "Label");
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


    }
    function handleslider(_event: Event): void {
        //let progress: HTMLProgressElement = <HTMLProgressElement>document.querySelector("progress");


        let nowAmount: string = (<HTMLInputElement>_event.target).value;
        let minAmount: string = (<HTMLInputElement>_event.target).min;
        let maxAmount: string = (<HTMLInputElement>_event.target).max;

        let name: string = (<HTMLInputElement>_event.target).name;
        //progress.value = parseFloat(amount);

        for (let i: number = 0; i < allitems.length; i++) {
            if (name == allitems[i]) {
                let label: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#" + name + "Label");
                //document.getElementById(name + "Label").innerHTML = name;
                item[i].maxprice = Number(nowAmount);
                item[i].minprice = Number(minAmount);


                if (item[i].buy == false) {
                    label.innerHTML = item[i].germanName + " Gewinn: " + minAmount + "/" + nowAmount + "/" + maxAmount;
                }
                if (item[i].buy == true) {
                    label.innerHTML = item[i].germanName + " kosten: " + minAmount + "/" + nowAmount + "/" + maxAmount;
                }
                //console.log(item[0].itemname);
                //console.log(amount);
            }
            if (name == "startgems") {
                let label: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#" + name + "Label");
                gemamount = Number(nowAmount);

                label.innerHTML = "Startgems: " + gemamount;
            }
            if (name == "bees") {
                let label: HTMLParagraphElement = <HTMLParagraphElement>document.body.querySelector("#" + name + "Label");
                //beenumber = Number(nowAmount); 

                //label.innerHTML = "Bienen: " + beenumber;
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let index: number = 0; index < block.length; index++) {
            let position: HTMLElement = <HTMLElement>document.querySelector("span");                    //deklariere das span
            position.innerHTML = block[selectedblock].blockinfo;                                        //Textausgabe des span

            if (block[index].kill == true) {                                                            //Zerstörung des Blockes -> weitere in Block.ts
                block[index] = new Block(block[index].position, block[index].blocknumber);              //ersetze zerstörten block 

            }
            block[index].update();
        }
        for (let i: number = 0; i < beenumber; i++) {                                                                               //update alle Weltbienen
            bee[i].update();                                                                                                        //..
            for (let index: number = 0; index < block.length; index++) {                                                            //frage alle blöcke ab.
                if (ctx.isPointInPath(block[index].path, bee[i].position.x, bee[i].position.y)) {                                   //Wenn die "Welt" Biene ist im Pfad des blockes
                    if ((block[index].status == STATUS.GROW) || (block[index].status == STATUS.READY)) {                            //Der Blockzustand im Wachstum oder Fertig und
                        if (block[index].mobspawner == false) {                                                                     //fals der Mobspawner aus ist
                            block[index].mobspawner = true;                                                                         //schalte den Mobspawner des Blockes an
                            bee[i] = new Mob(new Vector(-40, Math.random() * (1080 - 0) + 0), "world");  //und setze die gleiche "Welt" Biene wieder an zurück an eine Random Position 
                        }
                    }
                }
            }
        }
    }
    function pathclicklisterner(_event: MouseEvent): void {
        for (let index: number = 0; index < block.length; index++) {                    //instanzierung
            if (ctx.isPointInPath(block[index].path, mousepositon.x, mousepositon.y)) { //wenn innerhalb eines Pfades gedrückt wurde
                block[index].doClick(tool);                                             //dann Führe eine Aktion mit jeweiligem ausgewähltem Werkzeug durch
                console.log(mousepositon.x);
            }
        }

    }

    function setmouseposition(_event: MouseEvent): void {
        let WTF: number[] = [41, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
        let position: HTMLElement = <HTMLElement>document.querySelector("span");  //deklariere das span
        mousepositon.x = (_event.clientX - rect.left) * scaleX;                   //deklariere die X position mit der eventfunktion der Maus
        mousepositon.y = (_event.clientY - rect.top) * scaleY;                    //deklariere die y position mit der eventfunktion der Maus

        for (let index: number = 0; index < block.length; index++) {        //Feld makierung anzeigen  <-- bekomme gleich einen Kotzanfall wenn die scheise jetzt dann nicht funktioniert gut habs dirty gelöst

            if (ctx.isPointInPath(block[index].path, _event.clientX, _event.clientY)) { //wenn Mausposition auf dementsprechenden Feld ist
                position.style.left = (_event.clientX + 30) + "px";                     //aendere die Position des span (x) neben der Maus
                position.style.top = (_event.clientY) + "px";                           //aendere die position des span (y) neben der Maus

                selectedblock = block[index].blocknumber;                       //update ausgewählten block
                block[WTF[index]].setHover();                                   //zeige Hover Position auf Feldern an

            }
            else {
                block[WTF[index]].clearHover();
            }
        }
        //console.log(mousepositon.x, mousepositon.y);

    }
}