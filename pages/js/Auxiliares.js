

/**
  * @author ricardoSBastos
  *
  * Given an Object3D this function calculates the course based 
  * in it's yaw ( Basically written to compute
  * the bearing of periscope view - won't work for quaternions)
  */
var computeBearing = function (objeto){
  if (!objeto)return;
  
  // Returns the angle rounded to 2 decimals
  this.roundToBearing = function (angle){
    return Math.round(10.0*angle)/10;
  };
  
  // formats the bearing to the naval usage of three digitis
  this.to3Digits = function (angle){
    if (angle === 360)return "000.0";
    var decimal = "";
    if(angle === Math.round(angle))decimal = ".0";
    if(angle<10){
      return "00"+angle+decimal;
    }
    else if (angle <100){
      return "0"+angle+decimal;
    }
    else{
      return angle+decimal;
    }
  };
  
  // returns the inverse of a bearing in naval format
  this.reciproca = function (angle){
    if (angle >= 180) {
      return roundToBearing(angle - 180);
    }
    else{
      return roundToBearing(angle + 180);
    }
  };
  
  // returns the bearing relatively to a ship's bow
  this.relativa = function (marcV,rumo){
    if (marcV > rumo)return roundToBearing(marcV-rumo);
    else  return roundToBearing(360-rumo+marcV);
  };
  
  var angle = -roundToBearing(THREE.Math.radToDeg(objeto.rotation.y));
  if (angle > 360) angle = roundToBearing(angle %= 360.0);
  if (angle < 0){
    if (angle < -360){angle = roundToBearing((angle %= 360.0)+360);}
    else {angle = roundToBearing(angle += 360);}
  } 
  tBearing = to3Digits(angle);
  rBearing = to3Digits(relativa(angle,sbHead));
};

var toClockLike = function (t) {
  tString = "";
  var minutos = Math.floor(t/60);
  if (minutos<10)minutos = "0"+minutos;
  var segundos = Math.floor(t%60);
  if (segundos<10)segundos = "0"+segundos;
  tString += minutos+" : "+segundos;
      return tString;
};

function setHeight(){
    tgtHeight = Number(prompt(parlatorium[0],"40.0"));
    computeDistance (grauEstadimetro);
  }

var computeIO = function(marc,dist){
  var vdist = Math.round(Number(dist/100))*100;
  var vmarc = Number(marc);
  var setor;
  var io;
  if(vmarc >= 300 || vmarc <= 60)setor = 1;
  if((vmarc <300 && vmarc >=270) || (vmarc>60 && vmarc<=90))setor = 2;
  if((vmarc <270 && vmarc >=240) || (vmarc>90 && vmarc<=120))setor = 3;
  if(vmarc < 240 || vmarc > 120)setor = 4;
  switch(setor){
    case 1:
      io = (vdist - 1200)/100*5;
      console.log(io);
    break;
    case 2:
      io = (vdist - 1100)/100*5;
      console.log(io);
    break;
    case 3:
      io = (vdist - 1000)/100*6;
      console.log(io);
    break;
    case 4:
      io = (vdist - 900)/100*6;
      console.log(io);
    break;
  }
  if(io < 0)return 0;
  else if (io <18){alert("Contact is too close - keep looking and measuring distance until it is at a safe distance.");}
  else{return io;}
};

function computeTimes(dt){
  if (dt > 1)return; // don't know why, but it happens sometimes!!
  if (mode == aps.PERISCOPE)tempoIndiscreto += deltaT;
  simTime += deltaT;
  if(varredura){
    ivh += deltaT;
    tgt1Time += deltaT;
    tgt2Time += deltaT;
  }
  if(ivh >= 180)gameOverBaby();
  if (fazOMovimento === "obs1"
    && tgt1Time > 15){
    alert("You need to improve your movements, you took more than 15 seconds to observe the contact!!");
    points -= 10;
    mode = aps.NAVIGATION;
    fazOMovimento = null;
  }
  if (fazOMovimento === "obs2"
    && tgt2Time > 18){
    alert("You took more than 18 seconds to observe the contact!! Less 10 points...");
    points -= 10;
    mode = aps.NAVIGATION;
    fazOMovimento = null;
  }
  if (fazOMovimento === "vh"
    && ivh > 35){
    alert("You need to improve your movements, you're supposed to take less than 35 seconds to check tactical situation around you");
    points -= 10;
    mode = aps.NAVIGATION;
    fazOMovimento = null;
  }
  if (points <= 0 || ivh >= 180 || tgt1Time >= io1 || tgt2Time >= io2) gameOverBaby();
  if (corvPos){
    if (corvPos.z > 0) unveil();
  }
}

function unveil(){
  window.location = "unveil.html";
}

var computeMarcDist = function(tgt){
  if (!tgt.mesh)return;
  var pos = tgt.mesh.position;
  var pos2 = new THREE.Vector2(pos.x-subPos.x,pos.z-subPos.z);
  var len = Math.sqrt(pos2.x*pos2.x + pos2.y*pos2.y);
  var cos = Math.abs(pos2.x/len);
  var sin = pos2.z/len;
  var setor;
  if(cos > 0.5){
    sin > 0 ? setor = 2 : setor = 3;
  }else {
    sin > 0 ? setor = 1 : setor = 4;
  }
  
};



var computeDistance = function(altura){
  if(altura <= 0)return;
  
  var distancia = tgtHeight/100*126/altura;
  distancia = Math.round(distancia*10)/10;
  console.log(distancia);
  var decimal = "";
  if (Math.round(distancia) == distancia){
    decimal += ".0";
  }
  
  if (distancia > 20000.0){
    distance = "20000.0";
    return;
  }
  if (distancia < 10){
    distance = "0000"+distancia+decimal;
    return;
  }else
  if (distancia < 100){
    distance = "000"+distancia+decimal;
    return;
  }else
  if (distancia < 1000){
    distance = "00"+distancia+decimal;
    return;
  }else
  if (distancia < 10000){
    distance = "0"+distancia+decimal;
    return;
  }
  
};


function onWindowResize() {
    if(!(camera && renderer))return;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

  
function angleBetweenQuats(qBefore,qAfter) {
  q1 = new THREE.Quaternion();
  q1.copy(qBefore);
  q1.inverse();
  q1.multiply(qAfter);
  var halfTheta = Math.acos( q1.w );
  return 2*halfTheta;
}

function lookTowards(fromObject,toPosition, dTheta) {
  var quat0 = new THREE.Quaternion();
  quat0.setFromRotationMatrix( fromObject.matrix );
  var eye = fromObject.position;
  var center = toPosition;
  var up = new THREE.Vector3(0,1,0);
  var mat = new THREE.Matrix4();
  mat.lookAt(center,eye,up);
  var quat1 = new THREE.Quaternion();
  quat1.setFromRotationMatrix( mat );
  var deltaTheta = angleBetweenQuats(quat0,quat1);
  var frac = dTheta/deltaTheta;
  if (frac>1)  frac=1;
  fromObject.quaternion.slerp(quat1,frac);
}

function doObs1(){
    if (!varredura){
      alert("Your first movement must always be an All Around Search, to figure out the tactical situation.");
      return;
    }
    tgt1Time = 0;
    mode = aps.PERISCOPE;
    tgt1 = true;
    tgt2 = false;
    fazOMovimento = "obs1";
    if(primatgt1 && primatgt2){
      alert("You have up to 18 seconds to obtain the target data (bearing and distance).  You need to know how to use the stadimeter. In case of doubt press '1'.");
      alert("Don't forget to set target's height pressing 's', and to press 'c' to send the data to weapons system, lower the periscope and send data to weapons system.");
    }
    if(primatgt1)primatgt1 = false;
  }
  function doObs2(){
    if (!varredura){
      alert("Your first movement must always be an All Around Search, to figure out the tactical situation.");
      return;
    }
    tgt2Time =0;
    mode = aps.PERISCOPE;
    tgt2 = true;
    tgt1 = false;
    fazOMovimento = "obs2";
    if(primatgt1 && primatgt2){
      alert("You have up to 18 seconds to obtain the target data (bearing and distance).  You need to know how to use the stadimeter. In case of doubt press '1'.");
      alert("Don't forget to set target's height pressing 's', and to press 'c' to send the data to weapons system, lower the periscope and send data to weapons system.");
    }
    if(primatgt2)primatgt2 = false;
  }
  function doVH(){
    fazOMovimento = "vh";
    if (!varredura){
      alert("You have up to 35 seconds to turn the periscope 360º and look for new targets. You might need to accelerate your turning by holding down 'Shift' key. Use zoom = 1.5x, and try to set elevation for 1/3 of sea and 2/3 of sky.");
      varredura = true;
      mode = aps.PERISCOPE;
      perOverlay.draw();
      alert("Make sure to perform another All Around Search before HSI = 03:00. As soon as you finish the turn, press '2' to lower the periscope and go back to Navigation Mode.");
    }
    mode = aps.PERISCOPE;
    ivh = 0;
  }
  
  function gameOverBaby(){
    window.location = "gameOver.html";
  }
