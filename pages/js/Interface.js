
/* ************************************************** */
/* *****************Camadas.js*********************** */

var carta = new Image();
 carta.src = "textures/carta.png";
 var circle = new Image();
 circle.src = "textures/circle1.png";
 var subIco = new Image();
 subIco.src = "textures/U-209icone.gif";
 var hvuIco = new Image();
 hvuIco.src = "textures/carrierIcone.gif";
 var fragIco = new Image();
 fragIco.src = "textures/carrierIcone.gif";
 var loadImg = new Image();
 loadImg.src = "textures/loadImg.png";
 var infoImg = new Image();
 infoImg.src = "textures/info.png";
 var obs1 = new Image();
 obs1.src = "textures/obs1.png";
 var obs2 = new Image();
 obs2.src = "textures/obs2.png";
 var next = new Image();
 next.src = "textures/next.png";
 var previous = new Image();
 previous.src = "textures/previous.png";
 var tutor1 = new Image();
 tutor1.src = "textures/tutor1.png";
 var tutor2 = new Image();
 tutor2.src = "textures/tutor2.png";
 var tutor3 = new Image();
 tutor3.src = "textures/tutor3.png";
 var varHor = new Image();
 varHor.src = "textures/vh.png";

var extend = function(o, p) {
    for (prop in p) {                         // For all props in p.
        o[prop] = p[prop];                   // Add the property to o.
    }
    return o;
};

var defClass = function(constructor, methods, statics) // Defines a Java fashioned Class
{
    if (methods)
        extend(constructor.prototype, methods);
    if (statics)
        extend(constructor, statics);
    return constructor;
};

var Overlay = defClass(
        function(mainCanvas, type) { //Constructor
            this.canvas = mainCanvas;
            this.type = type;
            this.overlay;
            this.context;
            for (var nomeImagem in this.imagens) {
                this.nomeImagem.src = this.sources.nomeImagem;
            }
        },
        { // Instance Methods
    

            // Helpers
            /** Translates the origin to the top-left corner
             * and draws the same position on 2D canvas
             */
            worldToChart2D: function(pos, chartWidth, chartHeight) {
                //tirar multiplicadores do maxDist
                var xW = pos.x + Globais.maxDist / 3;
                var yW = pos.z + Globais.maxDist / 3;
                var xC = ((chartWidth - chartHeight) / 2) * (xW / (Globais.maxDist / 3 * 2));
                var yC = chartHeight * (yW / (Globais.maxDist / 3 * 2));
                var pos2D = new THREE.Vector2(xC + (chartWidth - chartHeight) / 2, yC);
                return pos2D;
            },
            create: function() {
                canvasContainer = document.createElement('div');
                canvasContainer.style.zIndex = '100';
                document.body.appendChild(canvasContainer);
                var overlayCanvas = document.createElement('canvas');
                overlayCanvas.style.position = 'absolute';
                var W = Globais.SCREEN_WIDTH;
                var H = Globais.SCREEN_HEIGHT;
                switch (this.type) {
                    case "PERISCOPE":
                        overlayCanvas.style.left = '0px';
                        overlayCanvas.style.top = '0px';
                        overlayCanvas.width = W;
                        overlayCanvas.height = H;
                        break;
                    case "CHART":
                        overlayCanvas.style.left = "75%";
                        overlayCanvas.style.top = "70%";
                        overlayCanvas.width = W / 4;
                        overlayCanvas.height = H / 4;
                        overlayCanvas.style.zIndex = 100;
                }
                canvasContainer.appendChild(overlayCanvas);
                this.overlay = overlayCanvas;
            },
            draw: function() {
                if (!this.overlay || Globais.avisando)
                    return;
                this.context = this.overlay.getContext('2d');
                var x = window.innerWidth / 2;
                var y = window.innerHeight;
                switch (Globais.mode) {
                    case Globais.aps.PERISCOPE:
                        this.context.clearRect(0, 0, x * 2, y);
                        var imgCorner = (Globais.SCREEN_WIDTH - Globais.SCREEN_HEIGHT) / 2;
                        this.context.drawImage(circle, 0, 0, Globais.SCREEN_WIDTH, Globais.SCREEN_HEIGHT);
                        this.context.font = "30pt Impact";
                        this.context.fillStyle = "#ff0000"; // text color
                        this.context.fillText(Globais.tBearing, x / 2, y - 10);
                        this.context.fillText(Globais.rBearing, x * 1.5, y - 10);
                        this.context.fillText(Globais.distance, x - 50, 50);
                        this.context.fillText(Globais.centerMsg, x - 50, y / 2 - 10);
                        this.context.font = "20pt Impact";
                        this.context.fillStyle = "#000000";
                        this.context.fillText(Globais.zoom, x / 3, 30);
                        this.context.fillStyle = "#0000cc";
                        this.context.fillText(Globais.stad, 5 * x / 4, 30);
                        this.context.fillStyle = "#ffffff";
                        var tempo = Globais.parlatorium(3) + "-> " + this.toClockLike(Globais.tempoIndiscreto);
                        var v = "HSI -> " + this.toClockLike(Globais.ivh);
                        var t1 = "OI-1 -> " + this.toClockLike(Globais.tgt1Time);
                        var t2 = "OI-2 -> " + this.toClockLike(Globais.tgt2Time);
                        this.context.fillText(tempo, 0, 30);
                        this.context.fillText(Globais.parlatorium(4) + Globais.points, 0, 70);
                        this.context.fillText(v, 0, y - 110);
                        this.context.fillText(t1, 0, y - 70);
                        this.context.fillText(t2, 0, y - 30);
                        this.context.beginPath();
                        this.context.moveTo(x, 0);
                        this.context.lineTo(x, y);
                        this.context.moveTo(0, y / 2);
                        this.context.lineTo(x * 2, y / 2);
                        for (var i = 1; i < 10; i++) {
                            this.context.moveTo(x - 160, i * y / 10);
                            this.context.lineTo(x - 110, i * y / 10);
                        }
                        this.context.stroke();
                        this.context.closePath();
                        break;
                    case Globais.aps.NAVIGATION:
                        this.context.drawImage(carta, 0, 0, x * 2, y);
                        this.context.drawImage(obs2, x * 2 - 140, y - 140, 100, 100);
                        this.context.drawImage(obs1, x * 2 - 280, y - 140, 100, 100);
                        this.context.drawImage(varHor, x * 2 - 420, y - 140, 100, 100);
                        var tempo = Globais.parlatorium(3) + "-> " + this.toClockLike(Globais.tempoIndiscreto);
                        var v = "IVH -> " + this.toClockLike(Globais.ivh);
                        var t1 = "OI-1 -> " + this.toClockLike(Globais.tgt1Time);
                        var t2 = "OI-2 -> " + this.toClockLike(Globais.tgt2Time);
                        this.context.font = "20pt Impact";
                        this.context.fillStyle = "#ffffff";
                        this.context.fillText(tempo, 0, 30);
                        this.context.fillText(Globais.parlatorium(4) + Globais.points, 0, 70);
                        this.context.fillText(v, 0, y - 110);
                        this.context.fillText(t1, 0, y - 70);
                        this.context.fillText(t2, 0, y - 30);
                        var subPosition = this.worldToChart2D(Globais.subPos, x * 2, y);
                        this.context.drawImage(subIco, subPosition.x - 16, subPosition.y - 12, 32, 24);
                        //for ( t in targetArray){
                        //if (!t.prontoPara)continue;
                        if (Globais.fragPos) {
                            var tgt1Pos = this.worldToChart2D(Globais.fragPos, x * 2, y);
                            this.context.drawImage(hvuIco, tgt1Pos.x - 30, tgt1Pos.y - 15, 60, 30);
                        }
                        if (Globais.corvPos) {
                            var tgt2Pos = this.worldToChart2D(Globais.corvPos, x * 2, y);
                            this.context.drawImage(fragIco, tgt2Pos.x - 30, tgt2Pos.y - 15, 60, 30);
                        }
                        break;
                    case Globais.aps.INFO:
                        this.clear();
                        this.context.drawImage(infoImg, 0, 0, x * 2, y);
                        break;
                    case Globais.aps.LOADING:
                        this.clear();
                        this.context.drawImage(loadImg, 0, 0, x * 2, y);
                        break;
                    case Globais.aps.TUTOR:
                        this.clear();
                        this.context.drawImage(this.tutor[this.tutorIndex], 0, 0, x * 2, y);
                        if (this.tutorIndex < 2)
                            this.context.drawImage(next, x * 2 - 140, y - 140, 100, 100);
                        if (this.tutorIndex > 0)
                            this.context.drawImage(previous, 40, y - 140, 100, 100);
                        break;
                    case Globais.aps.GAME_OVER:
                        this.clear();
                        this.context.drawImage(gameOver, 0, 0, x * 2, y);
                        break;
                }
                this.context.restore();

            },
            avisa: function(str, t) {
                Globais.avisando = true;
                var cont = 0;
                var x = window.innerWidth / 2 - str.length * 10;
                var y = window.innerHeight / 2 - 30;
                this.context.font = "40px Impact";
                this.context.fillStyle = "#ff0000";
                this.context.fillText(str, x, y);
                setInterval(this.limpAviso, t * 1000);
            },
            limpAviso: function() {
                Globais.avisando = false;
            },
            clear: function() {
                this.context.clearRect(0, 0, this.overlay.width,
                        this.overlay.height);
            },
            resize: function(left, top, wDiv, hDiv) {
                this.overlay.style.left = left;
                this.overlay.style.top = top;
                this.overlay.width = this.canvas.clientWidth / wDiv;
                this.overlay.height = this.canvas.clientWidth / hDiv;
                this.overlay.style.zIndex = 1;
            },
            toClockLike: function(t) {
                tString = "";
                var minutos = Math.floor(t / 60);
                if (minutos < 10)
                    minutos = "0" + minutos;
                var segundos = Math.floor(t % 60);
                if (segundos < 10)
                    segundos = "0" + segundos;
                tString += minutos + " : " + segundos;
                return tString;
            }
        },
{// Static fields
   /** imagens: {
        carta: new Image()
        , circle: new Image()
        , subIco: new Image()
        , hvuIco: new Image()
        , fragIco: new Image()
        , loadImg: new Image()
        , infoImg: new Image()
        , obs1: new Image()
        , obs2: new Image()
        , next: new Image()
        , previous: new Image()
        , tutor1: new Image()
        , tutor2: new Image()
        , tutor3: new Image()
        , varHor: new Image()
    },
    sources: {
        carta: "textures/carta.png"
        , circle: "textures/circle1.png"
        , subIco: "textures/U-209icone.gif"
        , hvuIco: "textures/carrierIcone.gif"
        , fragIco: "textures/carrierIcone.gif"
        , loadImg: "textures/loadImg.png"
        , infoImg: "textures/info.png"
        , obs1: "textures/obs1.png"
        , obs2: "textures/obs2.png"
        , next: "textures/next.png"
        , previous: "textures/previous.png"
        , tutor1: "textures/tutor1.png"
        , tutor2: "textures/tutor2.png"
        , tutor3: "textures/tutor3.png"
        , varHor: "textures/vh.png"
    }, */
    tutor: []
    ,tutorIndex: 0

}
);


/**
 * var carta = new Image();
 carta.src = "textures/carta.png";
 var circle = new Image();
 circle.src = "textures/circle1.png";
 var subIco = new Image();
 subIco.src = "textures/U-209icone.gif";
 var hvuIco = new Image();
 hvuIco.src = "textures/carrierIcone.gif";
 var fragIco = new Image();
 fragIco.src = "textures/carrierIcone.gif";
 var loadImg = new Image();
 loadImg.src = "textures/loadImg.png";
 var infoImg = new Image();
 infoImg.src = "textures/info.png";
 var obs1 = new Image();
 obs1.src = "textures/obs1.png";
 var obs2 = new Image();
 obs2.src = "textures/obs2.png";
 var next = new Image();
 next.src = "textures/next.png";
 var previous = new Image();
 previous.src = "textures/previous.png";
 var tutor1 = new Image();
 tutor1.src = "textures/tutor1.png";
 var tutor2 = new Image();
 tutor2.src = "textures/tutor2.png";
 var tutor3 = new Image();
 tutor3.src = "textures/tutor3.png";
 var varHor = new Image();
 varHor.src = "textures/vh.png";
 */



/* ***********Fim Camadas.js************************* */
/* ************************************************** */
