declare namespace Gemuesegarten {
    let ctx: CanvasRenderingContext2D;
    let mousepositon: Vector;
}
declare namespace Gemuesegarten {
    class Block {
        imgBlock: HTMLImageElement;
        path: Path2D;
        hover: boolean;
        blocknumber: number;
        position: Vector;
        private status;
        constructor(_position: Vector, _blocknumber: number);
        doClick(_tool: string): void;
        getpath(): Path2D;
        setHover(): void;
        clearHover(): void;
        draw(): void;
        drawPath(): void;
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
