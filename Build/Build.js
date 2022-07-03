"use strict";
var Gemuesegarten;
(function (Gemuesegarten) {
    window.addEventListener("load", hndLoad);
    function hndLoad(_event) {
        let canvas = document.querySelector("#canvas");
        Gemuesegarten.ctx = canvas.getContext("2d");
        drawWorker();
    }
    function drawWorker() {
        console.log("tet");
        Gemuesegarten.ctx.scale(1, 1);
        Gemuesegarten.ctx.beginPath();
        Gemuesegarten.ctx.fillStyle = "rgb(0, 0, 255)";
        Gemuesegarten.ctx.strokeStyle = "rgb(0, 0, 255)";
        Gemuesegarten.ctx.lineWidth = 2;
        Gemuesegarten.ctx.lineCap = "butt";
        Gemuesegarten.ctx.lineJoin = "miter";
        Gemuesegarten.ctx.miterLimit = 4;
        Gemuesegarten.ctx.moveTo(0, 0);
        Gemuesegarten.ctx.lineTo(100, 0);
        Gemuesegarten.ctx.lineTo(100, 100);
        Gemuesegarten.ctx.lineTo(0, 100);
        Gemuesegarten.ctx.closePath();
        Gemuesegarten.ctx.fill();
        Gemuesegarten.ctx.stroke();
        Gemuesegarten.ctx.resetTransform();
    }
    Gemuesegarten.drawWorker = drawWorker;
})(Gemuesegarten || (Gemuesegarten = {}));
//# sourceMappingURL=Build.js.map