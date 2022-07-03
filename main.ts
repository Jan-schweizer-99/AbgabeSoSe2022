namespace Gemuesegarten {

    export let ctx: CanvasRenderingContext2D;
    window.addEventListener("load", hndLoad);
    let mousepositon: Vector;
    let circle: Path2D;


    function hndLoad(_event: Event): void {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector("#canvas");
        
        
        ctx = canvas.getContext("2d")!;
        document.addEventListener("mousemove", setInfobox); //oeffne bei der Mausbewegung irgendwo im auf der Seite die handlemousemove funktion
        
       
    }
    export function drawWorker(): void {
        circle = new Path2D();
        ctx.scale(1, 1);
        ctx.beginPath();
        ctx.fillStyle = "rgb(0, 0, 255)";
        ctx.strokeStyle = "rgb(0, 0, 255)";
        ctx.lineWidth = 2;
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        ctx.miterLimit = 4;
        ctx.moveTo(0, 0);
        ctx.lineTo (100, 0);
        ctx.lineTo (100, 100);
        ctx.lineTo (0, 100);
        ctx.closePath();
        

        ctx.fill();
        ctx.stroke();
        ctx.resetTransform();

    }
    function setInfobox(_event: MouseEvent): void {

        mousepositon.x = _event.clientX;         //deklariere die X position mit der eventfunktion der Maus
        mousepositon.y = _event.clientY;         //deklariere die y position mit der eventfunktion der Maus

        console.log(mousepositon.x, mousepositon.y)

    }
}