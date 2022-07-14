declare namespace Gemuesegarten {
    let ctx: CanvasRenderingContext2D;
    let mousepositon: Vector;
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
        blockinfo: string;
        imgBlock: HTMLImageElement;
        path: Path2D;
        hover: boolean;
        blocknumber: number;
        waterlevel: number[];
        fertilizerlevel: number[];
        pestlevel: number;
        position: Vector;
        plant: Plant;
        mobspawn: number;
        mobspawntime: number;
        mobspawner: boolean;
        kill: Boolean;
        sell: Boolean;
        status: STATUS;
        constructor(_position: Vector, _blocknumber: number);
        newBee(): void;
        killBee(): void;
        doClick(_tool: string, _itemshop: Shop): void;
        getpath(): Path2D;
        setHover(): void;
        clearHover(): void;
        update(): void;
        updatePests(): void;
        drawPath(): void;
    }
}
declare namespace Gemuesegarten {
    enum DIRECTION {
        LEFT = 0,
        RIGHT = 1,
        UP = 2,
        DOWN = 3
    }
    export class Mob {
        direction: DIRECTION;
        frame: number;
        framedelay: number;
        position: Vector;
        minpostion: Vector;
        maxpostion: Vector;
        imgMob: HTMLImageElement[];
        mobpath: string[];
        mode: string;
        constructor(_position: Vector, _mode: string);
        update(): void;
    }
    export {};
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
        emaralamount: number;
        imgeemarald: HTMLImageElement[];
        timer: number;
        item: ITEM[];
        constructor(_emeralamount: number);
        updateshop(): void;
        updateUI(): void;
        randomprice(): void;
        sell(_name: string): void;
        buy(_name: string): void;
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
declare namespace Gemuesegarten {
}
