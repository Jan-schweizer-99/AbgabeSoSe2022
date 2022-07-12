"use strict";
var Gemuesegarten;
(function (Gemuesegarten) {
    window.addEventListener("load", hndLoad);
    let rect;
    let scaleX;
    let scaleY;
    let tool = "fertilizer";
    let selectedblock = 0;
    let block = [];
    let bee;
    //paths
    //let circle: Path2D;
    function hndLoad(_event) {
        let index = 0;
        let startpositon = new Gemuesegarten.Vector(820, 170);
        let positon = new Gemuesegarten.Vector(134, 67);
        let positondown = new Gemuesegarten.Vector(-134, 67);
        bee = new Gemuesegarten.Mob(new Gemuesegarten.Vector(0, 0));
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
        //ctx.requestAnimationFrame(update);
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
            let position = document.querySelector("span"); //deklariere das span
            position.innerHTML = block[selectedblock].waterlevel[1].toString(); //Textausgabe des span
            if (block[index].kill == true) { //Zerstörung durch unter oder überwässerung
                block[index] = new Gemuesegarten.Block(block[index].position, block[index].blocknumber);
            }
            block[index].update();
        }
        bee.update();
        //console.log("test");
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
        let position = document.querySelector("span"); //deklariere das span
        Gemuesegarten.mousepositon.x = (_event.clientX - rect.left) * scaleX; //deklariere die X position mit der eventfunktion der Maus
        Gemuesegarten.mousepositon.y = (_event.clientY - rect.top) * scaleY; //deklariere die y position mit der eventfunktion der Maus
        for (let index = 0; index < block.length; index++) { //Feld makierung anzeigen  <-- bekomme gleich einen Kotzanfall wenn die scheise jetzt dann nicht funktioniert gut habs dirty gelöst
            if (Gemuesegarten.ctx.isPointInPath(block[index].path, _event.clientX, _event.clientY)) {
                position.style.left = (_event.clientX + 30) + "px"; //aendere die Position des span (x) neben der Maus
                position.style.top = (_event.clientY) + "px"; //aendere die position des span (y) neben der Maus
                //position.innerHTML = block[index].waterlevel[1].toString(); //Textausgabe des span
                selectedblock = block[index].blocknumber;
                block[WTF[index]].setHover(); //zeige Hover Position auf Feldern an
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
        waterlevel = [-200, 0, 200]; //Wert 1 minimales Wasserlevel //Wert 2 derzeitiges Wasserlevel // Wert 3 maximales Wasserlevel
        pestlevel;
        fertilizerlevel;
        position;
        plant;
        kill;
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
                        this.waterlevel[1] = 200;
                        this.status = STATUS.WATERED;
                    }
                    else {
                        console.log("erst Wässern dann kann gepflanzt werden");
                    }
                    break;
                case STATUS.WATERED:
                    if (tool == "pumpkinseed") {
                        this.plant = new Gemuesegarten.Plant("pumpkinseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (tool == "carrotseed") {
                        this.plant = new Gemuesegarten.Plant("carrotseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (tool == "potatoseed") {
                        this.plant = new Gemuesegarten.Plant("potatoseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (tool == "beetrootseed") {
                        this.plant = new Gemuesegarten.Plant("beetrootseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (tool == "wheatseed") {
                        this.plant = new Gemuesegarten.Plant("wheatseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    else {
                        console.log("erst Wässern dann kann ");
                    }
                    break;
                case STATUS.GROW:
                    if (tool == "water") {
                        this.waterlevel[1] += 50;
                        /*if (this.waterlevel[2] >= this.waterlevel[1]) {
                            this.kill = true;
                        }*/
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
        update() {
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
            switch (this.status) {
                case STATUS.GROW:
                    this.waterlevel[1]--;
                    this.plant.draw();
                    this.plant.update();
                    if (this.waterlevel[1] < this.waterlevel[0]) {
                        this.kill = true;
                    }
                    if (this.waterlevel[1] > this.waterlevel[2]) {
                        this.kill = true;
                    }
                    if (this.waterlevel[1] <= 0) {
                        this.imgBlock.src = "img/Ackerboden_1.webp";
                    }
                    if (this.waterlevel[1] >= 0) {
                        this.imgBlock.src = "img/Ackerboden_2.webp";
                    }
                    if (this.plant.grown == true) {
                        this.status = STATUS.READY;
                    }
                    break;
                case STATUS.READY:
                    console.log("Plant is Ready");
                    this.plant.draw();
                    break;
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
    class Mob {
        frame;
        position;
        imgMob = new Image();
        mobpath = [];
        flightdirection;
        constructor(_position) {
            this.frame = 0;
            this.position = _position;
            //canvas.addEventListener("click", this.pathclicklisterner);
            this.mobpath[0] = "img/bee/Bee_types_BE_";
            this.mobpath[1] = ".png";
        }
        update() {
            this.frame++;
            this.imgMob.src = this.mobpath[0] + this.frame + this.mobpath[1];
            Gemuesegarten.ctx.save();
            Gemuesegarten.ctx.scale(-1, 1);
            Gemuesegarten.ctx.drawImage(this.imgMob, this.position.x - 40, this.position.y - 40);
            Gemuesegarten.ctx.restore();
            this.position.x -= 4;
            if (this.position.x <= -1940) {
                this.position.x = 40;
            }
            this.position.y += 4;
            if (this.position.y >= 1120) {
                this.position.y = -40;
            }
            if (this.frame == 8) {
                this.frame = 0;
            }
        }
    }
    Gemuesegarten.Mob = Mob;
})(Gemuesegarten || (Gemuesegarten = {}));
var Gemuesegarten;
(function (Gemuesegarten) {
    class Plant {
        imgPlant = new Image();
        blocknumber;
        position = new Gemuesegarten.Vector(0, 0);
        seed;
        growtimecounter;
        growtime; //time to grow
        grown = false;
        maxgrowlvl;
        growlvl = 0;
        path = [];
        constructor(_seed, _position) {
            this.position.x = _position.x;
            this.position.y = _position.y - 155; //verschiebung in Y richtung
            this.seed = _seed;
            this.growlvl = 0;
            if (this.seed == "carrotseed") {
                this.growtime = 100;
                this.maxgrowlvl = 3;
                this.path[0] = "img/Carrot/Carrot_Age_";
            }
            if (this.seed == "beetrootseed") {
                this.growtime = 100;
                this.maxgrowlvl = 3;
                this.path[0] = "img/Beetroot/Beetroot_Age_";
            }
            if (this.seed == "potatoseed") {
                this.growtime = 100;
                this.maxgrowlvl = 3;
                this.path[0] = "img/Potato/Potato_Age_";
            }
            if (this.seed == "pumpkinseed") {
                this.growtime = 100;
                this.maxgrowlvl = 8;
                this.path[0] = "img/Pumpkin/Pumpkin_Stem_Age_";
            }
            if (this.seed == "wheatseed") {
                this.growtime = 100;
                this.maxgrowlvl = 6;
                this.path[0] = "img/Wheat/Wheat_Age_";
            }
            this.path[1] = ".webp";
            this.growlvl = 0;
            this.growtimecounter = 0;
            //setInterval(this.update, this.growtime);
        }
        draw() {
            this.imgPlant.src = this.path[0] + this.growlvl + this.path[1];
            Gemuesegarten.ctx.drawImage(this.imgPlant, this.position.x, this.position.y);
            //console.log(this.growlvl);
        }
        update() {
            this.growtimecounter++;
            if (this.growtimecounter >= this.growtime) {
                if (this.growlvl <= this.maxgrowlvl) {
                    this.growlvl++;
                }
                this.growtimecounter = 0;
            }
            if (this.growlvl == this.maxgrowlvl) {
                this.grown = true;
                console.log("test");
            }
            console.log(this.growtimecounter);
            //console.log(this.maxgrowlvl);
            //}
            //else {
            //console.log("plant is ready sir");
        }
    }
    Gemuesegarten.Plant = Plant;
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