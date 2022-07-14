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
    let bee = [];
    let beenumber = 4;
    let item = [];
    let gemamount;
    let allitems = ["potato", "wheat", "carrot", "beetroot", "pumpkin", "fertilizer", "pesticide", "beetrootseed", "wheatseed", "pumpkinseed", "potatoseed", "carrotseed"];
    let germanName = ["Kartoffel", "Weizen", "Karotte", "Rote Bete", "Kürbis", "Dünger", "Pestiziede", "Rote Bete", "Weizen", "Kürbis", "kartoffel", "Karotte"];
    let buy = [false, false, false, false, false, true, true, true, true, true, true, true];
    let minprice = [11, 11, 11, 11, 11, 1, 1, 1, 1, 1, 1, 1];
    let maxprice = [15, 15, 15, 15, 15, 5, 5, 5, 5, 5, 5, 5];
    //item[0].germanName = "0";
    //paths
    //let circle: Path2D;
    function hndLoad(_event) {
        let index = 0; // Index für Feld-Feld Generator
        let startpositon = new Gemuesegarten.Vector(810, 110); // start Postion für Feld-Generator
        let positon = new Gemuesegarten.Vector(134, 67); // verschiebung der blöcke
        let positondown = new Gemuesegarten.Vector(-134, 67); // Position nach unten für Feld-Generator
        for (let i = 0; i < allitems.length; i++) {
            item[i] = {
                itemname: allitems[i],
                minprice: 0,
                maxprice: 0,
                buy: buy[i],
                germanName: germanName[i]
            };
        }
        initslider();
        for (let i = 0; i < 6; i++) {
            for (let i = 0; i < 7; i++) {
                block[index] = new Gemuesegarten.Block(new Gemuesegarten.Vector(startpositon.x + i * positon.x, startpositon.y + i * positon.y), index);
                index++;
            }
            startpositon.add(positondown); //Addiere Startposition in die zweite Reihe
        }
        for (let i = 0; i < beenumber; i++) { // Instanzierung der Bienen
            bee[i] = new Gemuesegarten.Mob(new Gemuesegarten.Vector(Math.random() * (1920 - 0) + 0, Math.random() * (1080 - 0) + 0), "world");
        }
        Gemuesegarten.mousepositon = new Gemuesegarten.Vector(0, 0);
        let canvas = document.querySelector("#canvas");
        let tool = document.querySelector("div#shop");
        let slider = document.querySelector("div#menu");
        tool.addEventListener("change", handleChange);
        console.log(slider);
        slider.addEventListener("input", handleslider);
        Gemuesegarten.ctx = canvas.getContext("2d");
        rect = canvas.getBoundingClientRect();
        scaleX = canvas.width / rect.width; //for canvas click listener
        scaleY = canvas.height / rect.height; //for canvas click listener
        canvas.addEventListener("click", pathclicklisterner);
        //canvas.addEventListener("mousemove", pathmouseoverlisterner); //path listener für auswahl
        canvas.addEventListener("mousemove", setmouseposition); //oeffne bei der Mausbewegung irgendwo im auf der Seite die handlemousemove funktion
        //drawWorker();
        setInterval(update, 40);
        //requestAnimationFrame(update());
    }
    function initslider() {
        let beeAmount = document.body.querySelector("#bees");
        let beeslabel = document.body.querySelector("#beesLabel");
        let gemAmount = document.body.querySelector("#startgems");
        let gemlabel = document.body.querySelector("#startgemsLabel");
        for (let i = 0; i < allitems.length; i++) {
            let slider = document.body.querySelector("#max" + allitems[i] + "Price");
            let label = document.body.querySelector("#" + allitems[i] + "Label");
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
    function handleslider(_event) {
        //let progress: HTMLProgressElement = <HTMLProgressElement>document.querySelector("progress");
        let nowAmount = _event.target.value;
        let minAmount = _event.target.min;
        let maxAmount = _event.target.max;
        let name = _event.target.name;
        //progress.value = parseFloat(amount);
        for (let i = 0; i < allitems.length; i++) {
            if (name == allitems[i]) {
                let label = document.body.querySelector("#" + name + "Label");
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
                let label = document.body.querySelector("#" + name + "Label");
                gemamount = Number(nowAmount);
                label.innerHTML = "Startgems: " + gemamount;
            }
            if (name == "bees") {
                let label = document.body.querySelector("#" + name + "Label");
                //beenumber = Number(nowAmount); 
                //label.innerHTML = "Bienen: " + beenumber;
            }
        }
    }
    function handleChange(_event) {
        let formData = new FormData(document.forms[0]); //update Formdatas
        for (let entry of formData) { //array of all Formdata
            let item = document.querySelector("[value='" + entry[1] + "']");
            console.log(item.value);
            tool = item.value; //set selected item
        }
    }
    function update() {
        Gemuesegarten.ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let index = 0; index < block.length; index++) {
            let position = document.querySelector("span"); //deklariere das span
            position.innerHTML = block[selectedblock].blockinfo; //Textausgabe des span
            if (block[index].kill == true) { //Zerstörung des Blockes -> weitere in Block.ts
                block[index] = new Gemuesegarten.Block(block[index].position, block[index].blocknumber); //ersetze zerstörten block 
            }
            block[index].update();
        }
        for (let i = 0; i < beenumber; i++) { //update alle Weltbienen
            bee[i].update(); //..
            for (let index = 0; index < block.length; index++) { //frage alle blöcke ab.
                if (Gemuesegarten.ctx.isPointInPath(block[index].path, bee[i].position.x, bee[i].position.y)) { //Wenn die "Welt" Biene ist im Pfad des blockes
                    if ((block[index].status == Gemuesegarten.STATUS.GROW) || (block[index].status == Gemuesegarten.STATUS.READY)) { //Der Blockzustand im Wachstum oder Fertig und
                        if (block[index].mobspawner == false) { //fals der Mobspawner aus ist
                            block[index].mobspawner = true; //schalte den Mobspawner des Blockes an
                            bee[i] = new Gemuesegarten.Mob(new Gemuesegarten.Vector(-40, Math.random() * (1080 - 0) + 0), "world"); //und setze die gleiche "Welt" Biene wieder an zurück an eine Random Position 
                        }
                    }
                }
            }
        }
    }
    function pathclicklisterner(_event) {
        for (let index = 0; index < block.length; index++) { //instanzierung
            if (Gemuesegarten.ctx.isPointInPath(block[index].path, Gemuesegarten.mousepositon.x, Gemuesegarten.mousepositon.y)) { //wenn innerhalb eines Pfades gedrückt wurde
                block[index].doClick(tool); //dann Führe eine Aktion mit jeweiligem ausgewähltem Werkzeug durch
                console.log(Gemuesegarten.mousepositon.x);
            }
        }
    }
    function setmouseposition(_event) {
        let WTF = [41, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
        let position = document.querySelector("span"); //deklariere das span
        Gemuesegarten.mousepositon.x = (_event.clientX - rect.left) * scaleX; //deklariere die X position mit der eventfunktion der Maus
        Gemuesegarten.mousepositon.y = (_event.clientY - rect.top) * scaleY; //deklariere die y position mit der eventfunktion der Maus
        for (let index = 0; index < block.length; index++) { //Feld makierung anzeigen  <-- bekomme gleich einen Kotzanfall wenn die scheise jetzt dann nicht funktioniert gut habs dirty gelöst
            if (Gemuesegarten.ctx.isPointInPath(block[index].path, _event.clientX, _event.clientY)) { //wenn Mausposition auf dementsprechenden Feld ist
                position.style.left = (_event.clientX + 30) + "px"; //aendere die Position des span (x) neben der Maus
                position.style.top = (_event.clientY) + "px"; //aendere die position des span (y) neben der Maus
                selectedblock = block[index].blocknumber; //update ausgewählten block
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
    })(STATUS = Gemuesegarten.STATUS || (Gemuesegarten.STATUS = {}));
    class Block {
        blockinfo;
        imgBlock = new Image();
        path = new Path2D();
        hover = false;
        blocknumber;
        waterlevel = [-20000, 0, 200]; //Wert 1 minimales Wasserlevel //Wert 2 derzeitiges Wasserlevel // Wert 3 maximales Wasserlevel
        fertilizerlevel = [-20000, 0, 200]; //Wert 1 minimales Wasserlevel //Wert 2 derzeitiges Wasserlevel // Wert 3 maximales Wasserlevel
        pestlevel;
        position;
        plant;
        mobspawn;
        mobspawntime = 250;
        mobspawner = false;
        kill;
        status;
        constructor(_position, _blocknumber) {
            this.mobspawn = this.mobspawntime;
            this.status = STATUS.DEFAULT;
            this.blocknumber = _blocknumber;
            this.position = _position;
            //canvas.addEventListener("click", this.pathclicklisterner);
            this.imgBlock.src = "img/Grasblock.webp";
            this.drawPath();
        }
        newBee() {
            this.plant.bee.push(new Gemuesegarten.Mob(new Gemuesegarten.Vector(this.position.x, this.position.y), "block"));
            //this.mobspawner = true;
            console.log("test");
        }
        killBee() {
            this.plant.bee.pop(); // letztes mob aus pflanze löschen
            if (this.plant.bee.length == 0) {
                this.mobspawner = false; //ausschalten der mobspawner Block
                this.mobspawn = this.mobspawntime; //Reset der Spawnzeit für neue Biene
            }
        }
        doClick(_tool) {
            let tool = _tool;
            switch (this.status) {
                case STATUS.DEFAULT:
                    if (tool == "fertilizer") {
                        this.imgBlock.src = "img/Ackerboden_1.webp";
                        this.waterlevel[1] = 200;
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
                    }
                    if (tool == "fertilizer") {
                        this.fertilizerlevel[1] += 50;
                    }
                    if (tool == "pesticide") {
                        this.killBee();
                    }
                    break;
                case STATUS.READY:
                    if (tool == "pesticide") {
                        this.killBee();
                    }
                    break;
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
            this.blockinfo = "water: " + this.waterlevel[1].toString() + " min: " + this.waterlevel[0].toString() + " max: " + this.waterlevel[2].toString() + "<br> fertilizer: " + this.fertilizerlevel[1].toString() + " min: " + this.fertilizerlevel[0].toString() + " max: " + this.fertilizerlevel[2].toString();
            Gemuesegarten.ctx.drawImage(this.imgBlock, this.position.x, this.position.y);
            if (this.hover == true) {
                Gemuesegarten.ctx.fill(this.path);
                Gemuesegarten.ctx.fillStyle = "#ff000050";
                //this.drawPath();
            }
            if (this.hover == false) {
                Gemuesegarten.ctx.fill(this.path);
                Gemuesegarten.ctx.fillStyle = "#ff000000";
                //this.drawPath();
            }
            switch (this.status) {
                case STATUS.GROW:
                    this.waterlevel[1]--;
                    this.fertilizerlevel[1]--;
                    this.plant.draw();
                    this.plant.update();
                    //water events
                    if (this.waterlevel[1] < this.waterlevel[0]) {
                        this.kill = true;
                    }
                    if (this.waterlevel[1] > this.waterlevel[2]) {
                        this.kill = true;
                    }
                    if (this.waterlevel[1] <= 0) { //change image for image
                        this.imgBlock.src = "img/Ackerboden_1.webp";
                    }
                    if (this.waterlevel[1] >= 0) {
                        this.imgBlock.src = "img/Ackerboden_2.webp";
                    }
                    //fertilizer events
                    if (this.fertilizerlevel[1] < this.waterlevel[0]) {
                        this.kill = true;
                    }
                    if (this.fertilizerlevel[1] > this.waterlevel[2]) {
                        this.kill = true;
                    }
                    //mob events
                    this.updatePests();
                    if (this.plant.grown == true) {
                        this.status = STATUS.READY;
                    }
                    break;
                case STATUS.READY:
                    this.updatePests();
                    console.log("Plant is Ready");
                    this.plant.draw();
                    break;
            }
        }
        updatePests() {
            if (this.plant.bee.length > 2) {
                this.kill = true;
            }
            if (this.mobspawner == true) {
                this.mobspawn++;
                if (this.mobspawn >= this.mobspawntime) {
                    this.mobspawn = 0;
                    this.newBee();
                }
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
    let DIRECTION;
    (function (DIRECTION) {
        DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
        DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
        DIRECTION[DIRECTION["UP"] = 2] = "UP";
        DIRECTION[DIRECTION["DOWN"] = 3] = "DOWN";
    })(DIRECTION || (DIRECTION = {}));
    class Mob {
        direction;
        frame;
        framedelay = 0;
        position;
        minpostion;
        maxpostion;
        imgMob = [];
        mobpath = [];
        mode;
        constructor(_position, _mode) {
            this.mode = _mode;
            console.log(this.mode);
            this.frame = 0;
            this.position = _position;
            this.position.y -= 40;
            //canvas.addEventListener("click", this.pathclicklisterner);
            if (this.mode == "world") {
                this.mobpath[0] = "img/bee/world/Bee_types_BE_";
                this.minpostion = new Gemuesegarten.Vector(-40, -40);
                this.maxpostion = new Gemuesegarten.Vector(1940, 1120);
            }
            if (this.mode == "block") {
                this.mobpath[0] = "img/bee/block/Bee_types_BE_";
                this.minpostion = new Gemuesegarten.Vector(_position.x + 50, _position.y);
                this.maxpostion = new Gemuesegarten.Vector(_position.x + 300 - 50, _position.y + 300);
                this.direction = DIRECTION.RIGHT;
            }
            this.mobpath[1] = ".png";
            for (let i = 0; i <= 8; i++) {
                this.imgMob[i] = new Image();
                this.imgMob[i].src = this.mobpath[0] + i + this.mobpath[1];
            }
        }
        update() {
            this.frame++;
            //this.imgMob.src = this.mobpath[0] + this.frame + this.mobpath[1];
            Gemuesegarten.ctx.drawImage(this.imgMob[this.frame], this.position.x - 40, this.position.y - 40);
            if (this.frame == 8) {
                this.frame = 0;
            }
            if (this.mode == "world") {
                this.position.x += 4;
                this.position.y += 4;
                if (this.position.y >= this.maxpostion.y) {
                    this.position.y = this.minpostion.y;
                }
                if (this.position.x >= this.maxpostion.x) {
                    this.position.x = this.minpostion.x;
                }
            }
            if (this.mode == "block") {
                if (this.direction == DIRECTION.RIGHT) {
                    if (this.position.x >= this.maxpostion.x) {
                        this.direction = DIRECTION.LEFT;
                    }
                    else {
                        this.position.x += 4;
                    }
                }
                if (this.direction == DIRECTION.LEFT) {
                    if (this.position.x <= this.minpostion.x) {
                        this.direction = DIRECTION.RIGHT;
                    }
                    else {
                        this.position.x -= 4;
                    }
                }
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
        bee = [];
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
            if (this.bee.length > 0) {
                for (let i = 0; i < this.bee.length; i++) {
                    this.bee[i].update();
                }
            }
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
    class Shop {
        pricerange;
        emaralamount;
        item = [];
        //allitems: string[] = ["potato", "wheat", "carrot", "beetroot", "pumpkin", "fertilizer", "pesticide" , "beetrootseed" , "wheatseed", "pumpkinseed", "potatoseed", "carrotseed" ];
        //buy: boolean[] = [false, false, false, false, false, false, true, true, true, true, true, true];
        constructor(_pricerange, _emaralamount) {
            this.pricerange = _pricerange;
            this.emaralamount = _emaralamount;
            for (let i = 0; i < this.allitems.length; i++) {
                this.item[i].buy = this.buy[i];
                this.item[i].itemname = this.allitems[i];
                if (i <= 4) {
                    this.item[i].price = this.randomprice();
                }
            }
            update();
            void {};
        }
        randomprice() {
            return Math.floor(Math.random() * this.pricerange);
        }
    }
    Gemuesegarten.Shop = Shop;
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