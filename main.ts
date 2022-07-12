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
    let bee: Mob;


    //paths





    //let circle: Path2D;


    function hndLoad(_event: Event): void {
        let index: number = 0;

        let startpositon: Vector = new Vector(820, 170);
        let positon: Vector = new Vector(134, 67);
        let positondown: Vector = new Vector(-134, 67);
        bee = new Mob(new Vector(0, 0));
        for (let i: number = 0; i < 6; i++) {
            for (let i: number = 0; i < 7; i++) {

                block[index] = new Block(new Vector(startpositon.x + i * positon.x, startpositon.y + i * positon.y), index);
                index++;
            }
            startpositon.add(positondown);
        }



        mousepositon = new Vector(0, 0);
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector("#canvas");

        let tool: HTMLInputElement = <HTMLInputElement>document.querySelector("div");

        tool.addEventListener("change", handleChange);


        ctx = canvas.getContext("2d")!;
        rect = canvas.getBoundingClientRect();

        scaleX = canvas.width / rect.width; //for canvas click listener
        scaleY = canvas.height / rect.height; //for canvas click listener


        canvas.addEventListener("click", pathclicklisterner);
        //canvas.addEventListener("mousemove", pathmouseoverlisterner); //path listener für auswahl
        canvas.addEventListener("mousemove", setmouseposition); //oeffne bei der Mausbewegung irgendwo im auf der Seite die handlemousemove funktion



        //drawWorker();
        setInterval(update, 50);
        //ctx.requestAnimationFrame(update);
    }
    function handleChange(_event: Event): void {

        let formData: FormData = new FormData(document.forms[0]);
        for (let entry of formData) {
            let item: HTMLInputElement = <HTMLInputElement>document.querySelector("[value='" + entry[1] + "']");
            tool = item.value; //set selected item
        }
    }
    function update(): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let index: number = 0; index < block.length; index++) {
            let position: HTMLElement = <HTMLElement>document.querySelector("span");  //deklariere das span
            position.innerHTML = block[selectedblock].waterlevel[1].toString(); //Textausgabe des span
            if (block[index].kill == true) {                           //Zerstörung durch unter oder überwässerung
                block[index] = new Block (block[index].position, block[index].blocknumber);
            }
            block[index].update();
        }
        bee.update();
        //console.log("test");
        //ctx.stroke(block[0].path);
    }
    function pathclicklisterner(_event: MouseEvent): void {
        for (let index: number = 0; index < block.length; index++) {
            if (ctx.isPointInPath(block[index].path, mousepositon.x, mousepositon.y)) {
                block[index].doClick(tool);
            }
        }

    }

    function setmouseposition(_event: MouseEvent): void {
        let WTF: number[] = [41, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
        let position: HTMLElement = <HTMLElement>document.querySelector("span");  //deklariere das span
        mousepositon.x = (_event.clientX - rect.left) * scaleX;         //deklariere die X position mit der eventfunktion der Maus
        mousepositon.y = (_event.clientY - rect.top) * scaleY;         //deklariere die y position mit der eventfunktion der Maus

        for (let index: number = 0; index < block.length; index++) {        //Feld makierung anzeigen  <-- bekomme gleich einen Kotzanfall wenn die scheise jetzt dann nicht funktioniert gut habs dirty gelöst

            if (ctx.isPointInPath(block[index].path, _event.clientX, _event.clientY)) {

                

                position.style.left = (_event.clientX + 30) + "px";  //aendere die Position des span (x) neben der Maus
                position.style.top = (_event.clientY) + "px";  //aendere die position des span (y) neben der Maus
                //position.innerHTML = block[index].waterlevel[1].toString(); //Textausgabe des span
                selectedblock = block[index].blocknumber;
                block[WTF[index]].setHover();   //zeige Hover Position auf Feldern an
                
            }
            else {
                block[WTF[index]].clearHover();
            }
        }
        //console.log(mousepositon.x, mousepositon.y);

    }
}