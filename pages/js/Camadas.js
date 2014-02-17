/**
 *
 *@author ricardoSBastos
 */
 
 function overlayParent() {
    this.overlay;
    this.context;
    
    // Helpers
    /** Translates the origin to the top-left corner
      * and draws the same position on 2D canvas
      */
    this.worldToChart2D = function (pos,chartWidth,chartHeight){
    //tirar multiplicadores do maxDist
      var xW = pos.x + maxDist/3;   
      var yW = pos.z + maxDist/3;
      var xC = ((chartWidth - chartHeight)/2)*(xW/(maxDist/3*2));
      var yC = chartHeight*(yW/(maxDist/3*2));
      var pos2D = new THREE.Vector2(xC+(chartWidth - chartHeight)/2,yC);
      return pos2D;
    };
    
    
    
    this.create = function (){
      canvasContainer = document.createElement('div');
      canvasContainer.style.zIndex = '100';
      document.body.appendChild(canvasContainer);
      var overlayCanvas = document.createElement('canvas');
      overlayCanvas.style.position = 'absolute';
      var W =SCREEN_WIDTH;
      var H = SCREEN_HEIGHT;
      switch (this.type){
        case "PERISCOPE":
          overlayCanvas.style.left = '0px';
          overlayCanvas.style.top = '0px';
          overlayCanvas.width = W;
          overlayCanvas.height = H;
        break;
        case "CHART":
          overlayCanvas.style.left = "75%";
          overlayCanvas.style.top = "70%";
          overlayCanvas.width = W/4;
          overlayCanvas.height = H/4;
          overlayCanvas.style.zIndex=100;
      }
      canvasContainer.appendChild(overlayCanvas);
      this.overlay = overlayCanvas;
    };
    
    this.draw = function(){
      if(!this.overlay || avisando)return;
      this.context = this.overlay.getContext('2d');
      var x = window.innerWidth/2;
      var y = window.innerHeight;
      switch(mode){
        case aps.PERISCOPE:
          this.context.clearRect(0, 0, x*2,y);
          var imgCorner = (SCREEN_WIDTH - SCREEN_HEIGHT)/2;
          this.context.drawImage(circle,0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
          this.context.font = "30pt Impact";
          this.context.fillStyle = "#ff0000"; // text color
          this.context.fillText(tBearing,x/2, y-10);
          this.context.fillText(rBearing,x*1.5, y-10);
          this.context.fillText(distance,x-50, 50);
          this.context.fillText(centerMsg,x-50,y/2 - 10);
          this.context.font = "20pt Impact";
          this.context.fillStyle = "#000000";
          this.context.fillText(zoom,x/3,30);
          this.context.fillStyle = "#0000cc";
          this.context.fillText(stad,5*x/4,30);
          this.context.fillStyle = "#ffffff";
          var tempo = parlatorium[2]+"-> "+toClockLike(tempoIndiscreto);
          var v = "HSI -> "+toClockLike(ivh);
          var t1 = "OI-1 -> "+toClockLike(tgt1Time);
          var t2 = "OI-2 -> "+toClockLike(tgt2Time);
          this.context.fillText(tempo,0,30);
          this.context.fillText("Points: "+points,0,70);
          this.context.fillText(v,0,y-110);
          this.context.fillText(t1,0,y-70);
          this.context.fillText(t2,0,y-30);
          this.context.beginPath();
          this.context.moveTo(x,0);
          this.context.lineTo(x,y);
          this.context.moveTo(0,y/2);
          this.context.lineTo(x*2,y/2);
          for (var i=1;i<10;i++){
            this.context.moveTo(x-160,i*y/10);
            this.context.lineTo(x-110,i*y/10);
          }
          this.context.stroke();
          this.context.closePath();
        break;
        case aps.NAVIGATION:
          this.context.drawImage(carta,0,0,x*2,y);
          this.context.drawImage(obs2,x*2-140,y-140,100,100);
          this.context.drawImage(obs1,x*2-280,y-140,100,100);
          this.context.drawImage(varHor,x*2-420,y-140,100,100);
          var tempo = parlatorium[2]+"-> "+toClockLike(tempoIndiscreto);
          var v = "IVH -> "+toClockLike(ivh);
          var t1 = "OI-1 -> "+toClockLike(tgt1Time);
          var t2 = "OI-2 -> "+toClockLike(tgt2Time);
          this.context.font = "20pt Impact";
          this.context.fillStyle = "#ffffff";
          this.context.fillText(tempo,0,30);
          this.context.fillText("Points: "+points,0,70);
          this.context.fillText(v,0,y-110);
          this.context.fillText(t1,0,y-70);
          this.context.fillText(t2,0,y-30);
          var subPosition = this.worldToChart2D(subPos,x*2,y);
          this.context.drawImage(subIco,subPosition.x-16,subPosition.y-12,32,24); 
          //for ( t in targetArray){
            //if (!t.prontoPara)continue;
            if(fragPos){
              var tgt1Pos = this.worldToChart2D(fragPos,x*2,y);   
              this.context.drawImage(hvuIco,tgt1Pos.x-30,tgt1Pos.y-15,60,30);
            }
            if (corvPos){
              var tgt2Pos = this.worldToChart2D(corvPos,x*2,y);   
              this.context.drawImage(fragIco,tgt2Pos.x-30,tgt2Pos.y-15,60,30);
            }
        break;
        case aps.INFO:
          this.clear();
          this.context.drawImage(infoImg,0,0,x*2,y);
        break;
        case aps.LOADING:
          this.clear();
          this.context.drawImage(loadImg,0,0,x*2,y);
        break;
        case aps.TUTOR:
          this.clear();
          this.context.drawImage(tutor[tutorIndex],0,0,x*2,y);
          if(tutorIndex <2)this.context.drawImage(next,x*2-140,y-140,100,100);
          if(tutorIndex >0)this.context.drawImage(previous,40,y-140,100,100);
        break;
        case aps.GAME_OVER:
          this.clear();
          this.context.drawImage(gameOver,0,0,x*2,y);
        break;
      }
      this.context.restore();
      
    };
    
    this.avisa = function(str,t){
      avisando = true;
      var cont = 0;
      var x = window.innerWidth/2 - str.length*10;
      var y = window.innerHeight/2 - 30;
      this.context.font = "40px Impact";
      this.context.fillStyle = "#ff0000"; 
      this.context.fillText(str,x, y);
      setInterval (this.limpAviso,t*1000);
    };
    this.limpAviso = function(){avisando = false;};
     
    this.clear = function(){
      this.context.clearRect(0, 0, this.overlay.width, 
      this.overlay.height);
    };
    
    this.resize = function(left,top,wDiv,hDiv){
      this.overlay.style.left = left;
      this.overlay.style.top = top;
      this.overlay.width = this.canvas.clientWidth/wDiv;
      this.overlay.height = this.canvas.clientWidth/hDiv;
      this.overlay.style.zIndex = 1;
    };
  }
  var ol = new overlayParent();
  var Overlay = function(mainCanvas,type){
    this.canvas = mainCanvas;
    this.type = type;
  };
  Overlay.prototype = ol;
