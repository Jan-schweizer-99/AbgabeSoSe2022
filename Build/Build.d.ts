declare namespace Gemuesegarten {
    let ctx: CanvasRenderingContext2D;
    function getPercentage(_now: number, _min: number, _max: number): number;
}
declare namespace Gemuesegarten {
    enum STATUS {
        DEFAULT = 0,
        FERTILIZED = 1,
        WATERED = 2,
        GROW = 3,
        READY = 4
    }
    class Block {
        hover: boolean;
        blocknumber: number;
        position: Vector;
        path: Path2D;
        waterlevel: number[];
        fertilizerlevel: number[];
        pestlevel: number;
        kill: Boolean;
        sell: Boolean;
        status: STATUS;
        mobspawner: boolean;
        private mobspawntime;
        private mobspawn;
        private plant;
        private imgBlock;
        constructor(_position: Vector, _blocknumber: number);
        update(): void;
        doClick(_tool: string, _itemshop: Shop): void;
        setHover(): void;
        clearHover(): void;
        private drawPath;
        private updatePests;
        private killBee;
    }
}
declare namespace Gemuesegarten {
    class Mob {
        position: Vector;
        private direction;
        private minpostion;
        private maxpostion;
        private imgMob;
        private mobpath;
        private mode;
        private frame;
        constructor(_position: Vector, _mode: string);
        update(): void;
    }
}
declare namespace Gemuesegarten {
    class Plant {
        imgPlant: HTMLImageElement;
        blocknumber: number;
        position: Vector;
        seed: string;
        growtimecounter: number;
        growtime: number;
        grown: Boolean;
        maxgrowlvl: number;
        growlvl: number;
        bee: Mob[];
        private path;
        constructor(_seed: string, _position: Vector);
        draw(): void;
        update(): void;
    }
}
declare namespace Gemuesegarten {
    interface ITEM {
        itemname: string;
        minprice: number;
        maxprice: number;
        buy: boolean;
        germanName: string;
        randomprice: number;
        amount: number;
    }
    class Shop {
        item: ITEM[];
        private timer;
        private imgeemarald;
        private emaralamount;
        constructor(_emeralamount: number);
        updateshop(): void;
        updateUI(): void;
        randomprice(): void;
        sell(_name: string): void;
        buy(_name: string): void;
        private buyhelp;
    }
}
declare namespace Gemuesegarten {
    class Vector {
        x: number;
        y: number;
        constructor(_x: number, _y: number);
        set(_x: number, _y: number): void;
        scale(_factor: number): void;
        add(_addend: Vector): void;
        copy(): Vector;
    }
}
