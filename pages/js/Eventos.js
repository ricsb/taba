
/**
 *@author ricardoSBastos
 */

function onKeyDown(evt) {
    switch (evt.keyCode) {
      case 16: //'shift'
        periRotVeloc = 2.5;
        estadiVeloc = 0.01;
        break;
      case 17: //'ctrl'
        if (mode !== aps.PERISCOPE)return;
        if (modoEstadimetro){
          modoEstadimetro = false;
          telaEstadimetro.visible = false;
          stad = "";
        }
        else{
          modoEstadimetro = true;
          if(tgtHeight === 0)alert("You must set the target's height (press 's' to set)");
          telaEstadimetro.visible = true;
          stad = parlatorium[1];
        }
        break;
      case 39: // 'right arrow' turns periscope right
        if (mode !== aps.PERISCOPE)return;
        event.preventDefault();
        turnRight = true;
        break;
      case 37: // 'left arrow' turns periscope left
        if (mode !== aps.PERISCOPE)return;
        event.preventDefault();
        turnLeft = true;
        break;
      case 38: // 'up arrow' increase periscope elevation
        if (mode !== aps.PERISCOPE)return;
        event.preventDefault();
        turnUp = true;
        break;
      case 40: // 'down arrow' decrease periscope elevation
        if (mode !== aps.PERISCOPE)return;  
        event.preventDefault();
        turnDown = true;
        break;
      case 49: // '1' toggle to mode Info
        if(mode === aps.INFO){
          mode = lastMode;
          paused = false;
          centerMsg = "";
        }else{
          lastMode = mode;
          mode = aps.INFO;
          perOverlay.draw();
          paused = true;
          
        }
      break;
      case 50: // '2' toggle to mode Navigation
        mode = aps.NAVIGATION;
        fazOMovimento = null;
      break;
      case 51: // '3' toggle to mode Tutor
        if(mode === aps.TUTOR){
          mode = lastMode;
          paused = false;
          centerMsg = "";
        }else{
          lastMode = mode;
          mode = aps.TUTOR;
          perOverlay.draw();
          paused = true;
          
        }
      break;
      
      case 67: // 'c' compute bearing & distance
        if (mode !== aps.PERISCOPE)return;
        if(tgtHeight == 0){
          alert("You need to compute the target's data!! Use the stadimeter ('CTRL')");
          return;
        }
        if (tgt1){
          io1 = computeIO(tBearing,distance);
          alert("Make sure to observe the same contact again before OI-1 (Observation Interval) is equal to "+toClockLike(io1));
          mode = aps.NAVIGATION;
          fazOMovimento = null;
        }else if (tgt2){
          io2 = computeIO(tBearing,distance);
          alert("Make sure to observe the same contact again before OI-1 (Observation Interval) is equal to "+toClockLike(io2));
          mode = aps.NAVIGATION;
          fazOMovimento = null;
        }else{
          alert("You are not supposed to stop your scan to observe any contact. You must choose a target to observe from Navigation Mode!!");
        }
        
      break;
      case 77: // 'm' on/off music
        if (music){
          chan1.volume = 0.0;
          music = false;
        }else {
          chan1.volume = 0.3;
          music = true;
        }
      break;
      case 80: // 'p' pause
        if(paused){
          paused = false;
          centerMsg = "";
        }
        else{
          centerMsg = "PAUSED";
          perOverlay.draw();
          paused = true;
        }
      break;
      case 83: // 's' set target height for stadimeter
        setHeight();
      break;
      case 90: // 'z' periscope's zoom
        if (mode !== aps.PERISCOPE)return;
        switch (fov) {
          case 40:
            fov = 20;
            camera1.fov = fov;
            camera1.updateProjectionMatrix();
            telaEstadimetro.scale = new THREE.Vector3(0.5,0.5,0.5);
            zoom = "6.0x";
            psys.scaleR = [0.02,0.1];
            break;
          case 20:
            fov = 5;
            camera1.fov = fov;
            camera1.updateProjectionMatrix();
            telaEstadimetro.scale = new THREE.Vector3(0.125,0.125,0.125);
            zoom = "12.0x";
            psys.scaleR = [0.04,0.4];
            break;
          case 5:
            fov = 40;
            camera1.fov = fov;
            camera1.updateProjectionMatrix();
            telaEstadimetro.scale = new THREE.Vector3(1,1,1);
            zoom = "1.5x";
            psys.scaleR = [0.001,0.005];
            break;
        }
    }
  }

  function onKeyUp(evt) {
    switch (evt.keyCode) {
      case 16: //'shift'
        periRotVeloc = 5;
        estadiVeloc = 0.001;
        break;
      case 39: // 'right arrow' turns periscope right
        event.preventDefault();
        turnRight = false;
        break;
      case 37: // 'left arrow' turns periscope right
        event.preventDefault();
        turnLeft = false;
        break;
      case 38:
        event.preventDefault();
        turnUp = false;
        break;
      case 40:
        event.preventDefault();
        turnDown = false;
        break;
    }
  }
  
  
  
  function periscopeUpdate(deltaT) {
    if (!periscope)return;
    if (!(turnRight || turnDown || turnUp || turnLeft))return;
    if (turnRight) {
      periscope.rotation.y -= deltaT / periRotVeloc;
      computeBearing(periscope);
    }
    else if (turnLeft) {
      periscope.rotation.y += deltaT / periRotVeloc;
      computeBearing(periscope);
    }
    if (modoEstadimetro && turnUp &&
          telaEstadimetro.position.y<0.4){
      telaEstadimetro.position.y += estadiVeloc;
      grauEstadimetro += estadiVeloc;
      computeDistance(grauEstadimetro);
    }
    else if (modoEstadimetro && turnDown && 
          telaEstadimetro.position.y >0){
      telaEstadimetro.position.y -= estadiVeloc;
      grauEstadimetro -= estadiVeloc;
      computeDistance(grauEstadimetro);
    }
    else if (turnUp && !modoEstadimetro) {
      quat.setFromAxisAngle(X_UNIT, deltaT / 5);
      if (elevation < Math.PI / 2) {
        elevation += deltaT / 5;
        camera1.quaternion.multiply(quat);
      }
    }
    else if (turnDown && !modoEstadimetro) {
      quat.setFromAxisAngle(X_UNIT_NEG, deltaT / 5);
      if (elevation > -Math.PI / 36) {
        elevation -= deltaT / 5;
        camera1.quaternion.multiply(quat);
      }
    }
  }
  
  function onMouseDown(evt){
    if(!(mode== aps.NAVIGATION || mode == aps.TUTOR))return;
    var mouseX = evt.pageX;
    var mouseY = evt.pageY;
    var x = window.innerWidth;
    var y = window.innerHeight;
    if(mode == aps.NAVIGATION){
      mouseX = evt.pageX;
      mouseY = evt.pageY;
      if ((mouseY>=y-140) && (mouseY <= y-40)){
        if ((mouseX >= x-140) && (mouseX <= x-40))doObs2();
        if ((mouseX >= x-280) && (mouseX <= x-180))doObs1();
        if ((mouseX >= x-420) && (mouseX <= x-320))doVH();
      }
    }
    if(mode == aps.TUTOR){
      if ((mouseY>=y-140) && (mouseY <= y-40)){
        if ((mouseX >= x-140) && (mouseX <= x-40)
            && tutorIndex<2){
          tutorIndex += 1;
          perOverlay.draw();
        }
          
        if ((mouseX >= 40) && (mouseX <= 140)
            && tutorIndex>0){
          tutorIndex -= 1;
          perOverlay.draw();
        }
      }
    }
  }