
/**
 *@author ricardoSBastos
 */
 
 // Hey!, I've got you poking around here !!
 
function AlvoPai (){
  var that = this;
  this.prerender = function(dt) {
    if (!this.mesh)return;
    this.mesh.add(psys);
    if (!this.loaded){
      loadedShips++;
      targetArray.push (this.mesh);
      this.loaded = true;
      if(loadedShips === 2){
        chan1.volume = 0.3;
        mode = aps.NAVIGATION;
        perOverlay.draw();
        perOverlay.avisa("There are no active contacts. All Around Search recommended",5);
      }
    }
    var checkPos = new THREE.Vector3(this.mesh.position.x,
            this.mesh.position.y + 1, this.mesh.position.z);
    var rayDown = new THREE.Raycaster(this.mesh.position, Y_UNIT_NEG);
    var rayUp = new THREE.Raycaster(this.mesh.position, Y_UNIT);
    var collisionsDown = rayDown.intersectObjects(colisores);
    var collisionsUp = rayUp.intersectObjects(colisores);
    if (collisionsDown.length > 0) {
      this.mesh.position.setY(collisionsDown[0].point.y + 0.01);
    }
    switch(this.id){
      case 'fcg':
        this.mesh.translateY(dt/2);
        fragPos = this.mesh.position;
      break;
      case 'ccb':
        this.mesh.translateX(dt/2);
        corvPos = this.mesh.position;
      break;
    }
    this.balanco(dt,this.id);
    this.caturro(dt,this.id);
  };
  this.balanco = function (dt,id){
    if (!this.mesh || beaufort === 0 || dt>1)return;
    var axis;
    var v;
    var quantum = dt*beaufort/90;
    switch(id){
      case 'ccb':axis = X_UNIT; v = new THREE.Vector3(this.fator1*quantum,0,0); break;
      case 'fcg':axis = Y_UNIT; v = new THREE.Vector3(0,this.fator1*quantum,0); break;
    }
    var jogoB = 36 + 48 * (3-beaufort);
    if (this.banda < -Math.PI/jogoB) {this.fator1 = 1;}
    if (this.banda > Math.PI/jogoB){this.fator1 = -1;}
    var qb = new THREE.Quaternion();
    qb.setFromEuler(v);
    this.mesh.quaternion.multiply(qb);
    this.banda += this.fator1 *quantum;
  };
  this.caturro = function (dt,id){
    if (!this.mesh || beaufort === 0 || dt>1)return;
    var axis;
    var v;
    var quantum = dt * beaufort / 180;
    switch(id){
      case 'ccb':axis = X_UNIT; v = new THREE.Vector3(0,0,this.fator2*quantum); break;
      case 'fcg':axis = Y_UNIT; v = new THREE.Vector3(this.fator2*quantum,0,0); break;
    }
    var jogoC = 72 + 36 * (3-beaufort);
    if (this.trim < -Math.PI/jogoC) {this.fator2 = 1;}
    if (this.trim > Math.PI/jogoC){this.fator2 = -1;}
    var qc = new THREE.Quaternion();
    qc.setFromEuler(v);
    this.mesh.quaternion.multiply(qc);
    this.trim += this.fator2 *quantum;
  };

}

var ap = new AlvoPai();

function Escolta(x, y, z,id) {
  var th = this;
  this.loaded = false;
  this.prontoPara = false;
  this.loader = new THREE.OBJMTLLoader();
  this.id = id;
  this.obj = null;
  this.mtl = null;
  this.banda = 0;
  this.trim = 0;
  this.fator1 = 1;
  this.fator2 = 1;
  this.marcs = new Array();
  this.dists = new Array();
  this.load = function() {
    switch(th.id){
        case 'fcg':
          th.obj = 'models/F46.obj';
          th.mtl = 'models/F46.mtl';
          break;
        case 'ccb':
          th.obj = 'models/V34.obj';
          th.mtl = 'models/V34.mtl';
          break;
    }
    th.loader.addEventListener('load', function(event) {
      th.mesh = event.content;
      th.mesh.useQuaternion = true;
      th.mesh.position.set(x, y, z);
      var q1 = new THREE.Quaternion();
      var q2 = new THREE.Quaternion();
      switch(th.id){
        case 'fcg':
          q1.setFromAxisAngle(X_UNIT_NEG,Math.PI/2);
          th.mesh.quaternion.multiply(q1);
          q2.setFromAxisAngle(Z_UNIT,-Math.PI/2);
          th.mesh.quaternion.multiply(q2);
          break;
        case 'ccb':
          q1.setFromAxisAngle(Y_UNIT,-Math.PI/2);
          th.mesh.quaternion.multiply(q1);
          break;
      }
      th.prontoPara = true;
      scene.add(th.mesh);
    });
    th.loader.load(th.obj,th.mtl);
  };
}
Escolta.prototype = ap;