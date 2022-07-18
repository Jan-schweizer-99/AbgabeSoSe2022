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
        status: STATUS;
        hover: boolean;
        blocknumber: number;
        position: Vector;
        path: Path2D;
        waterlevel: number[];
        fertilizerlevel: number[];
        pestlevel: number;
        kill: Boolean;
        sell: Boolean;
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
    enum DIRECTION {
        LEFT = 0,
        RIGHT = 1,
        UP = 2,
        DOWN = 3
    }
    abstract class Mob {
        position: Vector;
        protected frame: number;
        protected imgMob: HTMLImageElement[];
        protected mobpath: string[];
        protected minpostion: Vector;
        protected maxpostion: Vector;
        protected direction: DIRECTION;
        constructor(_position: Vector);
        abstract update(): void;
        protected updateframe(): void;
        protected preloading(): void;
    }
}
declare namespace Gemuesegarten {
    class Plant {
        bee: Mob[];
        grown: Boolean;
        seed: string;
        protected maxgrowlvl: number;
        protected path: string[];
        protected growtime: number;
        private growtimecounter;
        private imgPlant;
        private position;
        private growlvl;
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
declare namespace Gemuesegarten {
    class Blockbee extends Mob {
        constructor(_position: Vector);
        update(): void;
    }
}
declare namespace Gemuesegarten {
    class Worldbee extends Mob {
        constructor(_position: Vector);
        update(): void;
    }
}
declare namespace Gemuesegarten {
    class Beetroot extends Plant {
        constructor(_seed: string, _position: Vector);
    }
}
declare namespace Gemuesegarten {
    class Carrot extends Plant {
        constructor(_seed: string, _position: Vector);
    }
}
declare namespace Gemuesegarten {
    class Potato extends Plant {
        constructor(_seed: string, _position: Vector);
    }
}
declare namespace Gemuesegarten {
    class Pumpkin extends Plant {
        constructor(_seed: string, _position: Vector);
    }
}
declare namespace Gemuesegarten {
    class Wheat extends Plant {
        constructor(_seed: string, _position: Vector);
    }
}
