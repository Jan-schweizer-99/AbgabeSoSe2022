"use strict";
var Gemuesegarten;
(function (Gemuesegarten) {
    window.addEventListener("load", hndLoad);
    let rect;
    let scaleX;
    let scaleY;
    let tool = "fertilizer";
    let block = [];
    //paths
    //let circle: Path2D;
    function hndLoad(_event) {
        let index = 0;
        let startpositon = new Gemuesegarten.Vector(820, 170);
        let positon = new Gemuesegarten.Vector(134, 67);
        let positondown = new Gemuesegarten.Vector(-134, 67);
        for (let i = 0; i < 6; i++) {
            for (let i = 0; i < 7; i++) {
                block[index] = new Gemuesegarten.Block(new Gemuesegarten.Vector(startpositon.x + i * positon.x, startpositon.y + i * positon.y), index);
                index++;
            }
            startpositon.add(positondown);
        }
        Gemuesegarten.mousepositon = new Gemuesegarten.Vector(0, 0);
        let canvas = document.querySelector("#canvas");
        let tool = document.querySelector("div");
        tool.addEventListener("change", handleChange);
        Gemuesegarten.ctx = canvas.getContext("2d");
        rect = canvas.getBoundingClientRect();
        scaleX = canvas.width / rect.width; //for canvas click listener
        scaleY = canvas.height / rect.height; //for canvas click listener
        canvas.addEventListener("click", pathclicklisterner);
        //canvas.addEventListener("mousemove", pathmouseoverlisterner); //path listener für auswahl
        canvas.addEventListener("mousemove", setmouseposition); //oeffne bei der Mausbewegung irgendwo im auf der Seite die handlemousemove funktion
        //drawWorker();
        setInterval(update, 50);
    }
    function handleChange(_event) {
        let formData = new FormData(document.forms[0]);
        for (let entry of formData) {
            let item = document.querySelector("[value='" + entry[1] + "']");
            tool = item.value; //set selected item
        }
    }
    function update() {
        Gemuesegarten.ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let index = 0; index < block.length; index++) {
            block[index].draw();
        }
        //ctx.stroke(block[0].path);
    }
    function pathclicklisterner(_event) {
        for (let index = 0; index < block.length; index++) {
            if (Gemuesegarten.ctx.isPointInPath(block[index].path, Gemuesegarten.mousepositon.x, Gemuesegarten.mousepositon.y)) {
                block[index].doClick(tool);
            }
        }
    }
    function setmouseposition(_event) {
        let WTF = [41, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
        Gemuesegarten.mousepositon.x = (_event.clientX - rect.left) * scaleX; //deklariere die X position mit der eventfunktion der Maus
        Gemuesegarten.mousepositon.y = (_event.clientY - rect.top) * scaleY; //deklariere die y position mit der eventfunktion der Maus
        for (let index = 0; index < block.length; index++) { //Feld makierung anzeigen  <-- bekomme gleich einen Kotzanfall wenn die scheise jetzt dann nicht funktioniert gut habs dirty gelöst
            if (Gemuesegarten.ctx.isPointInPath(block[index].path, _event.clientX, _event.clientY)) {
                block[WTF[index]].setHover();
            }
            else {
                block[WTF[index]].clearHover();
            }
        }
        //console.log(mousepositon.x, mousepositon.y);
    }
})(Gemuesegarten || (Gemuesegarten = {}));
var Gemuesegarten;
(function (Gemuesegarten) {
    let STATUS;
    (function (STATUS) {
        STATUS[STATUS["DEFAULT"] = 0] = "DEFAULT";
        STATUS[STATUS["FERTILIZED"] = 1] = "FERTILIZED";
        STATUS[STATUS["WATERED"] = 2] = "WATERED";
        STATUS[STATUS["GROW"] = 3] = "GROW";
        STATUS[STATUS["READY"] = 4] = "READY";
    })(STATUS || (STATUS = {}));
    class Block {
        imgBlock = new Image();
        path = new Path2D();
        hover = false;
        blocknumber;
        position;
        status;
        constructor(_position, _blocknumber) {
            this.status = STATUS.DEFAULT;
            this.blocknumber = _blocknumber;
            this.position = _position;
            //canvas.addEventListener("click", this.pathclicklisterner);
            this.imgBlock.src = "img/Grasblock.webp";
            this.drawPath();
        }
        doClick(_tool) {
            let tool = _tool;
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
                    }
                    else {
                        console.log("erst Wässern");
                    }
            }
        }
        getpath() {
            return this.path;
        }
        setHover() {
            this.hover = true;
        }
        clearHover() {
            this.hover = false;
        }
        /*pathclicklisterner(_event: MouseEvent): void {
            if (ctx.isPointInPath(this.path, mousepositon.x, mousepositon.y)) {
                console.log("Pfad wurde gedrückt");
                console.log("test für pfad in ");
            }
    
        }*/
        draw() {
            Gemuesegarten.ctx.drawImage(this.imgBlock, this.position.x, this.position.y);
            if (this.hover == true) {
                Gemuesegarten.ctx.fill(this.path);
                Gemuesegarten.ctx.fillStyle = "#ff000050";
                this.drawPath();
            }
            if (this.hover == false) {
                Gemuesegarten.ctx.fill(this.path);
                Gemuesegarten.ctx.fillStyle = "#ff000000";
                this.drawPath();
            }
        }
        drawPath() {
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
    Gemuesegarten.Block = Block;
})(Gemuesegarten || (Gemuesegarten = {}));
var Gemuesegarten;
(function (Gemuesegarten) {
    class Vector {
        x;
        y;
        constructor(_x, _y) {
            this.set(_x, _y);
        }
        set(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
        scale(_factor) {
            this.x *= _factor;
            this.y *= _factor;
        }
        add(_addend) {
            this.x += _addend.x;
            this.y += _addend.y;
        }
        copy() {
            let copy = new Vector(this.x, this.y);
            return (copy);
        }
    }
    Gemuesegarten.Vector = Vector;
})(Gemuesegarten || (Gemuesegarten = {}));
//# sourceMappingURL=Build.js.map