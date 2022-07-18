"use strict";
var Gemuesegarten;
(function (Gemuesegarten) {
    window.addEventListener("load", hndLoad);
    let mousepositon;
    let rect;
    let scaleX;
    let scaleY;
    let tool = "fertilizer";
    let selectedblock = 0;
    let block = [];
    let bee = [];
    let beenumber;
    //data for shop 
    let itemShop;
    let item = [];
    let gemamount;
    //let world: World[] = [];
    function hndLoad(_event) {
        buildField();
        initslider();
        mousepositon = new Gemuesegarten.Vector(0, 0); // erstelle deine Mausposition
        let canvas = document.querySelector("#canvas");
        let startgame = document.querySelector("button#start");
        let tool = document.querySelector("div#shop");
        let slider = document.querySelector("div#menu");
        let shopbutton = [];
        for (let i = 0; i < 7; i++) { //installing shopbutton listener
            shopbutton[i] = document.querySelector("button#buy" + item[i].itemname);
            shopbutton[i].addEventListener("click", buyItem);
        }
        tool.addEventListener("change", handleChange);
        slider.addEventListener("input", handleslider);
        startgame.addEventListener("click", startGame);
        Gemuesegarten.ctx = canvas.getContext("2d");
        rect = canvas.getBoundingClientRect(); //initialisierung für canvas click listener
        scaleX = canvas.width / rect.width; //initialisierung für canvas click listener
        scaleY = canvas.height / rect.height; //initialisierung für canvas click listener
        canvas.addEventListener("click", pathclicklisterner); //click listener für canvas
        canvas.addEventListener("mousemove", setmouseposition); //oeffne bei der Mausbewegung irgendwo im auf der Seite die handlemousemove funktion
    }
    function buyItem(_event) {
        itemShop.buy(_event.target.id.slice(3));
    }
    function buildField() {
        let index = 0; // Index für Feld-Feld Generator
        let startpositon = new Gemuesegarten.Vector(660, 150); // start Postion für Feld-Generator
        let positon = new Gemuesegarten.Vector(134, 67); // verschiebung der blöcke
        let positondown = new Gemuesegarten.Vector(-134, 67); // Position nach unten für Feld-Generator
        for (let i = 0; i < 6; i++) {
            for (let i = 0; i < 7; i++) {
                block[index] = new Gemuesegarten.Block(new Gemuesegarten.Vector(startpositon.x + i * positon.x, startpositon.y + i * positon.y), index);
                index++;
            }
            startpositon.add(positondown); //Addiere Startposition in die zweite Reihe
        }
    }
    function initslider() {
        let itemsnames = ["potato", "wheat", "carrot", "beetroot", "pumpkin", "fertilizer", "pesticide", "beetrootseed", "wheatseed", "pumpkinseed", "potatoseed", "carrotseed"];
        let germanName = ["Kartoffel", "Weizen", "Karotte", "Rote Bete", "Kürbis", "Dünger", "Pestiziede", "Rote Bete", "Weizen", "Kürbis", "kartoffel", "Karotte"];
        let buy = [false, false, false, false, false, true, true, true, true, true, true, true];
        for (let i = 0; i < itemsnames.length; i++) {
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
        let beeAmount = document.body.querySelector("#bees");
        let beeslabel = document.body.querySelector("#beesLabel");
        let gemAmount = document.body.querySelector("#startgems");
        let gemlabel = document.body.querySelector("#startgemsLabel");
        for (let i = 0; i < itemsnames.length; i++) {
            let slider = document.body.querySelector("#max" + itemsnames[i] + "Price");
            let label = document.body.querySelector("#" + itemsnames[i] + "Label");
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
    function startGame(_event) {
        let startScreen = document.body.querySelector("#menu"); //definiere das slider menü
        itemShop = new Gemuesegarten.Shop(gemamount); //erstellen neuen shop
        for (let i = 0; i < item.length; i++) { //schiebe eingestellte slider werte in den shop 
            itemShop.item.push(item[i]);
        }
        itemShop.randomprice(); //generiere einen zufälligen shop preis
        startScreen.style.visibility = "hidden"; //verstecke das slider menü
        for (let i = 0; i < beenumber; i++) { // Instanzierung der Bienen
            bee[i] = new Gemuesegarten.Worldbee(new Gemuesegarten.Vector(Math.random() * (1920 - 0) + 0, Math.random() * (1080 - 0) + 0));
        }
        setInterval(update, 40); //stare update funktion
        setInterval(updatetime, 1000); //stare updateshopzeit funktion
    }
    function updatetime() {
        itemShop.updateshop();
    }
    function handleslider(_event) {
        let nowAmount = _event.target.value;
        let minAmount = _event.target.min;
        let maxAmount = _event.target.max;
        let name = _event.target.name;
        //progress.value = parseFloat(amount);
        for (let i = 0; i < item.length; i++) {
            if (name == item[i].itemname) {
                let label = document.body.querySelector("#" + name + "Label");
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
                let label = document.body.querySelector("#" + name + "Label");
                gemamount = Number(nowAmount);
                label.innerHTML = "Startgems: " + gemamount;
            }
            if (name == "bees") {
                let label = document.body.querySelector("#" + name + "Label");
                beenumber = Number(nowAmount);
                label.innerHTML = "Bienen: " + beenumber;
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
        let canvas = document.querySelector("#canvas");
        Gemuesegarten.ctx.clearRect(0, 0, canvas.width, canvas.height);
        Gemuesegarten.ctx.fillStyle = "#2e2e2e";
        Gemuesegarten.ctx.fillRect(0, 0, canvas.width, canvas.height);
        Gemuesegarten.ctx.fill();
        for (let index = 0; index < block.length; index++) {
            setprogressbar();
            if (block[index].kill == true) { //Zerstörung des Blockes -> weitere in Block.ts
                block[index] = new Gemuesegarten.Block(block[index].position, block[index].blocknumber); //ersetze zerstörten block 
            }
            block[index].update(); //update des blockes
        }
        for (let i = 0; i < beenumber; i++) { //update alle Weltbienen
            bee[i].update(); //..
            for (let index = 0; index < block.length; index++) { //frage alle blöcke ab.
                if (Gemuesegarten.ctx.isPointInPath(block[index].path, bee[i].position.x, bee[i].position.y)) { //Wenn die "Welt" Biene ist im Pfad des blockes
                    if ((block[index].status == Gemuesegarten.STATUS.GROW) || (block[index].status == Gemuesegarten.STATUS.READY)) { //Der Blockzustand im Wachstum oder Fertig und
                        if (block[index].mobspawner == false) { //fals der Mobspawner aus ist
                            block[index].mobspawner = true; //schalte den Mobspawner des Blockes an
                            bee[i] = new Gemuesegarten.Worldbee(new Gemuesegarten.Vector(-40, Math.random() * (1080 - 0) + 0)); //und setze die gleiche "Welt" Biene wieder an zurück an eine Random Position 
                        }
                    }
                }
            }
        }
    }
    function pathclicklisterner(_event) {
        for (let index = 0; index < block.length; index++) { //instanzierung
            if (Gemuesegarten.ctx.isPointInPath(block[index].path, mousepositon.x, mousepositon.y)) { //wenn innerhalb eines Pfades gedrückt wurde
                block[index].doClick(tool, itemShop); //dann Führe eine Aktion mit auf dem dementsprechenden Block mit jeweiligem ausgewähltem Werkzeug durch
            }
        }
    }
    function setprogressbar() {
        let progresbarWater = document.querySelector("#prog-bar-water"); //dekleration der Progress bar
        let progresbarFertilizer = document.querySelector("#prog-bar-fertilizer"); //dekleration der Progressbar vom Wasser
        progresbarWater.max = 100;
        progresbarFertilizer.max = 100;
        progresbarWater.value = getPercentage(block[selectedblock].waterlevel[1], block[selectedblock].waterlevel[0], block[selectedblock].waterlevel[2]);
        progresbarFertilizer.value = getPercentage(block[selectedblock].fertilizerlevel[1], block[selectedblock].fertilizerlevel[0], block[selectedblock].fertilizerlevel[2]);
    }
    function setmouseposition(_event) {
        let position = document.querySelector("span"); //deklariere das span
        mousepositon.x = (_event.clientX - rect.left) * scaleX; //deklariere die X position mit der eventfunktion der Maus
        mousepositon.y = (_event.clientY - rect.top) * scaleY; //deklariere die y position mit der eventfunktion der Maus
        for (let index = 0; index < block.length; index++) { //Feld makierung anzeigen  <-- bekomme gleich einen Kotzanfall wenn die scheise jetzt dann nicht funktioniert gut habs dirty gelöst
            if (Gemuesegarten.ctx.isPointInPath(block[index].path, _event.clientX, _event.clientY)) { //wenn Mausposition auf dementsprechenden Feld ist
                position.style.left = (_event.clientX + 30) + "px"; //aendere die Position des span (x) neben der Maus
                position.style.top = (_event.clientY) + "px"; //aendere die position des span (y) neben der Maus
                selectedblock = block[index].blocknumber; //update ausgewählten block
                block[index].setHover(); //zeige Hover Position auf Feldern an
            }
            else {
                block[index].clearHover();
            }
        }
        //console.log(mousepositon.x, mousepositon.y);
    }
    function getPercentage(_now, _min, _max) {
        let round = 1000;
        let percentage = ((_now - _min) / (_max - _min)) * 100;
        return Math.round(percentage * round) / round;
    }
    Gemuesegarten.getPercentage = getPercentage;
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
        status; //Status des Blocks
        hover = false; //hoverzustand des Blocks
        blocknumber; //Block nummer für auswertung
        position; //Position des Blocks
        path = new Path2D(); //klickbarer Pfad des Blocks
        waterlevel = [-100, -100, 400]; //Wert 1 minimales Wasserlevel //Wert 2 derzeitiges Wasserlevel // Wert 3 maximales Wasserlevel
        fertilizerlevel = [-100, -100, 500]; //Wert 1 minimales Wasserlevel //Wert 2 derzeitiges Wasserlevel // Wert 3 maximales Wasserlevel
        pestlevel;
        kill; //block zerstören aktiv
        sell = false; //Pflanze verkaufbar
        mobspawner = false; //Mob spawner an falls sich Biene in Pflanze befindet
        mobspawntime = 250; //zeit bis mob spawnt
        mobspawn;
        plant; //Pflanze die später gekapselt wird
        imgBlock = new Image(); //Bildquelle für Block
        constructor(_position, _blocknumber) {
            this.mobspawn = this.mobspawntime;
            this.status = STATUS.DEFAULT;
            this.blocknumber = _blocknumber;
            this.position = _position;
            this.imgBlock.src = "img/Grasblock.webp";
            this.drawPath();
        }
        update() {
            Gemuesegarten.ctx.drawImage(this.imgBlock, this.position.x, this.position.y); //male Block
            if (this.hover == true) { //wenn gehovert wurde setze Transparenz auf 50%
                Gemuesegarten.ctx.fillStyle = "#ff000050";
                Gemuesegarten.ctx.fill(this.path);
            }
            if (this.hover == false) { //wenn nicht gehovert wurde setze Transparenz auf 0%
                Gemuesegarten.ctx.fillStyle = "#ff000000";
                Gemuesegarten.ctx.fill(this.path);
            }
            /**********************/
            /**ENUM STATUS EVENTS**/
            /**********************/
            switch (this.status) {
                case STATUS.GROW: /** Status GROW **/
                    this.waterlevel[1]--; //dezimieren aktuelles Wasserlevel
                    this.fertilizerlevel[1]--; //dezimieren aktuelles Düngerlevel
                    this.plant.draw(); //zeichne Pflanze
                    this.plant.update(); //update die Pflanze
                    this.updatePests(); //akualisiere den Mobspawner
                    //water events
                    if (this.waterlevel[1] < this.waterlevel[0]) { //setze den Blockstatus auf zerstören wenn Block unterwässert ist
                        this.kill = true;
                    }
                    if (this.waterlevel[1] > this.waterlevel[2]) { //setze den Blockstatus auf zerstören wenn Block überrwässert ist
                        this.kill = true;
                    }
                    if (this.waterlevel[1] <= 0) { //ändere Bild wenn pflanze kurz vor der unterwässerung steht
                        this.imgBlock.src = "img/Ackerboden_1.webp";
                    }
                    if (this.waterlevel[1] >= 0) { //ändere Bild wenn pflanze genug wasser hat
                        this.imgBlock.src = "img/Ackerboden_2.webp";
                    }
                    //fertilizer events
                    if (this.fertilizerlevel[1] < this.fertilizerlevel[0]) { //setze den Blockstatus auf zerstören wenn Block unterdüngt ist
                        this.kill = true;
                    }
                    if (this.fertilizerlevel[1] > this.fertilizerlevel[2]) { //setze den Blockstatus auf zerstören wenn Block unterdüngt ist
                        this.kill = true;
                    }
                    if (this.plant.grown == true) { //Wenn die Pflanze gewachsen ist setze den Status auf Ready
                        this.status = STATUS.READY;
                    }
                    break;
                case STATUS.READY:
                    this.updatePests();
                    this.plant.draw();
                    if (this.plant.bee.length > 0) { //wenn Bienen auf der Pflanze sind kann der Block nicht verkauft werden
                        this.sell = false;
                    }
                    else {
                        this.sell = true;
                    }
                    break;
            }
        }
        doClick(_tool, _itemshop) {
            /*********************/
            /**ENUM CLICK EVENTS**/
            /*********************/
            switch (this.status) {
                /*Startdüngen*/
                case STATUS.DEFAULT:
                    if (_tool == "fertilizer" && (_itemshop.item[5].amount > 0)) { //wenn Werkzeug Dünger und gemügent vorhanden ist
                        _itemshop.item[5].amount--; //verwende ein Dünger
                        _itemshop.updateUI(); //und update den shop
                        this.fertilizerlevel[1] = this.fertilizerlevel[2] - 100; //und setze einen Startwert für den Block
                        this.imgBlock.src = "img/Ackerboden_1.webp"; //ändere die Blocktextur
                        this.status = STATUS.FERTILIZED; //update in den nächsten Status
                    }
                    break;
                /*Startwässern*/
                case STATUS.FERTILIZED:
                    if (_tool == "water") { //wenn Werkzeug Wasser
                        this.imgBlock.src = "img/Ackerboden_2.webp"; //update die Textur
                        this.waterlevel[1] = this.waterlevel[2] - 100; //und setze einen Startwert für den Block
                        this.status = STATUS.WATERED; //update in den nächsten Status
                    }
                    break;
                /*anpflanzen*/
                case STATUS.WATERED:
                    if (_tool == "pumpkinseed" && (_itemshop.item[9].amount > 0)) { //wenn Werkzeug Kürbis und genügent vorhanden ist
                        _itemshop.item[9].amount--; //verwende ein Kürbiskern
                        _itemshop.updateUI(); //und update den shop
                        this.plant = new Gemuesegarten.Pumpkin("pumpkinseed", this.position); //Kapsel die Pflanzen in den Block
                        this.status = STATUS.GROW; //update für den nächsten Status
                    }
                    if (_tool == "carrotseed" && (_itemshop.item[11].amount > 0)) {
                        _itemshop.item[11].amount--;
                        _itemshop.updateUI();
                        this.plant = new Gemuesegarten.Carrot("carrotseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (_tool == "potatoseed" && (_itemshop.item[10].amount > 0)) {
                        _itemshop.item[10].amount--;
                        _itemshop.updateUI();
                        this.plant = new Gemuesegarten.Potato("potatoseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (_tool == "beetrootseed" && (_itemshop.item[7].amount > 0)) {
                        _itemshop.item[7].amount--;
                        _itemshop.updateUI();
                        this.plant = new Gemuesegarten.Beetroot("beetrootseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    if (_tool == "wheatseed" && (_itemshop.item[8].amount > 0)) {
                        _itemshop.item[8].amount--;
                        _itemshop.updateUI();
                        this.plant = new Gemuesegarten.Wheat("wheatseed", this.position);
                        this.status = STATUS.GROW;
                    }
                    break;
                case STATUS.GROW:
                    if (_tool == "water") { //update das Wasserlevel des blocks mit 100
                        this.waterlevel[1] += 100;
                    }
                    if (_tool == "fertilizer" && (_itemshop.item[5].amount > 0)) { //update das Düngerlevel des blocks mit 100
                        _itemshop.item[5].amount--;
                        _itemshop.updateUI();
                        this.fertilizerlevel[1] += 100;
                    }
                    if (_tool == "pesticide" && (_itemshop.item[6].amount > 0) && (this.plant.bee.length > 0)) { //wenn das Werkzeug Pestizide ist, mehr als 1 biene im Feld ist und genügent Pestizide vorhanden sind
                        _itemshop.item[6].amount--; //update die anzahl der Pestizide im Inventar
                        _itemshop.updateUI(); //update den Itemshop           
                        this.killBee(); //und Töte eine Biene
                    }
                    break;
                case STATUS.READY:
                    if (_tool == "pesticide" && (_itemshop.item[6].amount > 0) && (this.plant.bee.length > 0)) { //wenn das Werkzeug Pestizide ist, mehr als 1 biene im Feld ist und genügent Pestizide vorhanden sind
                        _itemshop.item[6].amount--;
                        _itemshop.updateUI(); //update den shop
                        this.killBee(); //töte eine Biene
                    }
                    if ((_tool == "sell") && this.sell == true) { //wenn das Werkzeug ist verkaufen und keine Bienen auf dem feld sind
                        _itemshop.sell(this.plant.seed.substring(0, this.plant.seed.length - 4)); //dann verkauf dieses Item
                        this.kill = true; //und zerstöre den Block
                    }
                    break;
            }
        }
        setHover() {
            this.hover = true;
        }
        clearHover() {
            this.hover = false;
        }
        drawPath() {
            this.path.moveTo(16 + this.position.x, 67 + this.position.y);
            this.path.lineTo(150 + this.position.x, 0 + this.position.y);
            this.path.lineTo(284 + this.position.x, 67 + this.position.y);
            this.path.lineTo(150 + this.position.x, 2 * 67 + this.position.y);
            this.path.closePath();
        }
        updatePests() {
            if (this.plant.bee.length > 2) { //wenn mehr als 2 bzw 3 Bienen im Feld sind zerstöre den Block
                this.kill = true;
            }
            if (this.mobspawner == true) { //wenn der mobspawner an ist 
                this.mobspawn++;
                if (this.mobspawn >= this.mobspawntime) { //
                    this.mobspawn = 0;
                    //this.plant.bee.push(new Blockbee(new Vector(this.position.x, this.position.y), "block")); //neue block Biene
                    this.plant.bee.push(new Gemuesegarten.Blockbee(new Gemuesegarten.Vector(this.position.x, this.position.y))); //neue block Biene
                }
            }
        }
        killBee() {
            this.plant.bee.pop(); //letztes Biene aus pflanze löschen
            if (this.plant.bee.length == 0) { //wenn keine Bienen mehr drinn sind
                this.mobspawner = false; //ausschalten des mobspawners
                this.mobspawn = this.mobspawntime; //Reset der Spawnzeit für neue Biene
            }
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
    })(DIRECTION = Gemuesegarten.DIRECTION || (Gemuesegarten.DIRECTION = {}));
    class Mob {
        position;
        frame;
        imgMob = [];
        mobpath = [];
        minpostion;
        maxpostion;
        direction;
        constructor(_position) {
            this.frame = 1;
            this.position = _position;
            this.position.y -= 40;
            this.mobpath[1] = ".png"; //Pfad ende
        }
        updateframe() {
            this.frame++; //add ne frame
            Gemuesegarten.ctx.drawImage(this.imgMob[this.frame], this.position.x - 40, this.position.y - 40); //male Biene
            if (this.frame == 8) { //reset zu frame 0
                this.frame = 0;
            }
        }
        preloading() {
            for (let i = 0; i <= 8; i++) { //preload für Bilder der der Biene
                this.imgMob[i] = new Image();
                this.imgMob[i].src = this.mobpath[0] + i + this.mobpath[1];
            }
        }
    }
    Gemuesegarten.Mob = Mob;
})(Gemuesegarten || (Gemuesegarten = {}));
var Gemuesegarten;
(function (Gemuesegarten) {
    class Plant {
        //public blocknumber: number;
        bee = [];
        grown = false;
        seed;
        maxgrowlvl; //max Texturenumber set in Class Carrot Pumpkin....
        path = []; //path of Texture of plant
        growtime = 0; //time to grow set in Class Carrot Pumpkin....
        growtimecounter = 0;
        imgPlant = new Image(); //texture of this plant
        position = new Gemuesegarten.Vector(0, 0);
        growlvl = 0;
        constructor(_seed, _position) {
            this.seed = _seed;
            this.position.x = _position.x;
            this.position.y = _position.y - 155; //verschiebung in Y richtung
            this.path[1] = ".webp";
        }
        draw() {
            this.imgPlant.src = this.path[0] + this.growlvl + this.path[1];
            Gemuesegarten.ctx.drawImage(this.imgPlant, this.position.x, this.position.y);
            if (this.bee.length > 0) {
                for (let i = 0; i < this.bee.length; i++) {
                    this.bee[i].update();
                }
            }
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
        }
    }
    Gemuesegarten.Plant = Plant;
})(Gemuesegarten || (Gemuesegarten = {}));
var Gemuesegarten;
(function (Gemuesegarten) {
    class Shop {
        item = [];
        timer = 30;
        imgeemarald = [];
        emaralamount;
        constructor(_emeralamount) {
            this.emaralamount = _emeralamount;
            this.updateUI();
        }
        updateshop() {
            let storetime = document.body.querySelector("#timer"); //definition des shop timers
            this.timer--;
            if (this.timer <= -1) { //wenn der timer 0
                this.timer = 30; //setze den shop timer wieder auf 30
                this.randomprice(); //erstelle wieder neue random shop preise
                this.updateUI(); //update die UI
            }
            storetime.innerHTML = this.timer.toString() + "s"; //aktualisiere shopzeit im HTML
        }
        updateUI() {
            let emaraldLabel = document.body.querySelector("#emarals");
            for (let i = 0; i < this.item.length; i++) {
                this.imgeemarald[i] = new Image();
                this.imgeemarald[i].src = "img/items/Emerald.webp";
                this.imgeemarald[i].width = 24;
                this.imgeemarald[i].height = 24;
                let tool = document.body.querySelector("#" + this.item[i].itemname + "price");
                tool.innerHTML = this.item[i].randomprice.toString();
                tool.appendChild(this.imgeemarald[i]);
            }
            for (let i = 5; i < this.item.length; i++) {
                let tool = document.body.querySelector("#" + this.item[i].itemname + "amount");
                tool.innerHTML = this.item[i].amount.toString();
            }
            emaraldLabel.innerHTML = this.emaralamount.toString() + "x"; //verkette die emaralzahl mit x und aktualisier sie im shop
        }
        randomprice() {
            for (let i = 0; i < this.item.length; i++) {
                this.item[i].randomprice = Math.floor(Math.random() * (this.item[i].maxprice - this.item[i].minprice + 1) + this.item[i].minprice);
            }
            this.updateUI();
        }
        sell(_name) {
            let itemname = _name;
            for (let i = 0; i < this.item.length; i++) {
                if (this.item[i].itemname == itemname) {
                    console.log(itemname);
                    this.emaralamount += this.item[i].randomprice;
                    this.updateUI();
                }
            }
        }
        buy(_name) {
            for (let i = 0; i < this.item.length; i++) { //frage alle seed items ab ob eines richtig 
                if ((this.item[i].itemname == _name + "seed")) { //(kleine hilfe) verkette den itemnamen mit dem seed
                    this.buyhelp(i); //öffne kaufhilfe (also ob es kaufbar ist)
                }
            }
            if ((_name == "fertilizer")) { //wenn es Dünger ist 
                this.buyhelp(5); //öffne kaufhilfe
            }
            if ((_name == "pesticide")) { //wenn es Pestiziede sind 
                this.buyhelp(6); //öffne kaufhilfe
            }
        }
        buyhelp(_number) {
            if (this.emaralamount - this.item[_number].randomprice >= 0) {
                this.emaralamount -= this.item[_number].randomprice;
                this.item[_number].amount++;
                this.updateUI();
            }
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
var Gemuesegarten;
(function (Gemuesegarten) {
    class Blockbee extends Gemuesegarten.Mob {
        constructor(_position) {
            super(_position);
            this.mobpath[0] = "img/bee/block/Bee_types_BE_"; //pfad start
            this.minpostion = new Gemuesegarten.Vector(_position.x + 50, _position.y); //minimale grenzen wo die Biene Fliegt
            this.maxpostion = new Gemuesegarten.Vector(_position.x + 300 - 50, _position.y + 300); //maximale grenze wo die Biene Fliegt
            this.direction = Gemuesegarten.DIRECTION.RIGHT; //ändere Richtung
            this.preloading();
        }
        update() {
            this.updateframe();
            if (this.direction == Gemuesegarten.DIRECTION.RIGHT) { //und die Richtung Rechts ist
                if (this.position.x >= this.maxpostion.x) { //die maximale Position erreicht wurde
                    this.direction = Gemuesegarten.DIRECTION.LEFT; //ändere die Richtung nach Links
                }
                else {
                    this.position.x += 4; //ansonsten fliege weiter nach rechts
                }
            }
            if (this.direction == Gemuesegarten.DIRECTION.LEFT) { //wenn die Richtung Links ist
                if (this.position.x <= this.minpostion.x) { //und die minimalste Position erreicht wurde
                    this.direction = Gemuesegarten.DIRECTION.RIGHT; //ändere die Richtung nach Rechts
                }
                else {
                    this.position.x -= 4; //ansonsten flieg weiter nach links
                }
            }
        }
    }
    Gemuesegarten.Blockbee = Blockbee;
})(Gemuesegarten || (Gemuesegarten = {}));
var Gemuesegarten;
(function (Gemuesegarten) {
    class Worldbee extends Gemuesegarten.Mob {
        constructor(_position) {
            super(_position);
            this.mobpath[0] = "img/bee/world/Bee_types_BE_"; //pfad für Biene
            this.minpostion = new Gemuesegarten.Vector(-40, -40); //größe des canvases - halbe Biene
            this.maxpostion = new Gemuesegarten.Vector(1940, 1120); //größe des canvases + halbe Biene
            this.preloading();
        }
        update() {
            this.updateframe();
            this.position.x += 4; //geschwindigkeit in x richtung
            this.position.y += 4; //geschwindigkeit in y richtung
            if (this.position.y >= this.maxpostion.y) { //wenn die maximale canvas höhe erreicht wurde
                this.position.y = this.minpostion.y; //setze die Höhe wieder auf die minimalste
            }
            if (this.position.x >= this.maxpostion.x) { //wenn die maximale canvas breite erreicht wurde
                this.position.x = this.minpostion.x; //setze die breite wieder auf die minimalste
            }
        }
    }
    Gemuesegarten.Worldbee = Worldbee;
})(Gemuesegarten || (Gemuesegarten = {}));
var Gemuesegarten;
(function (Gemuesegarten) {
    class Beetroot extends Gemuesegarten.Plant {
        constructor(_seed, _position) {
            super(_seed, _position);
            this.growtime = 100;
            this.maxgrowlvl = 3;
            this.path[0] = "img/Beetroot/Beetroot_Age_";
            //console.log("Constructor wird aufgerufen");
        }
    }
    Gemuesegarten.Beetroot = Beetroot;
})(Gemuesegarten || (Gemuesegarten = {}));
var Gemuesegarten;
(function (Gemuesegarten) {
    class Carrot extends Gemuesegarten.Plant {
        constructor(_seed, _position) {
            super(_seed, _position);
            this.growtime = 100;
            this.maxgrowlvl = 3;
            this.path[0] = "img/Carrot/Carrot_Age_";
        }
    }
    Gemuesegarten.Carrot = Carrot;
})(Gemuesegarten || (Gemuesegarten = {}));
var Gemuesegarten;
(function (Gemuesegarten) {
    class Potato extends Gemuesegarten.Plant {
        constructor(_seed, _position) {
            super(_seed, _position);
            this.growtime = 100;
            this.maxgrowlvl = 3;
            this.path[0] = "img/Potato/Potato_Age_";
        }
    }
    Gemuesegarten.Potato = Potato;
})(Gemuesegarten || (Gemuesegarten = {}));
var Gemuesegarten;
(function (Gemuesegarten) {
    class Pumpkin extends Gemuesegarten.Plant {
        constructor(_seed, _position) {
            super(_seed, _position);
            this.growtime = 60;
            this.maxgrowlvl = 8;
            this.path[0] = "img/Pumpkin/Pumpkin_Stem_Age_";
        }
    }
    Gemuesegarten.Pumpkin = Pumpkin;
})(Gemuesegarten || (Gemuesegarten = {}));
var Gemuesegarten;
(function (Gemuesegarten) {
    class Wheat extends Gemuesegarten.Plant {
        constructor(_seed, _position) {
            super(_seed, _position);
            this.growtime = 80;
            this.maxgrowlvl = 6;
            this.path[0] = "img/Wheat/Wheat_Age_";
            console.log("der HUSO FUNZT");
        }
    }
    Gemuesegarten.Wheat = Wheat;
})(Gemuesegarten || (Gemuesegarten = {}));
//# sourceMappingURL=Build.js.map