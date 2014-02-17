
/**
 *@author ricardoSBastos
 */
 
// Hey, I've got you poking around here!!

function animate() {
      if (!paused || !gameOver){
        delta = clock.getDelta();
        uniforms.time.value += delta;
        uniforms.uOffset.value.y += delta * 0.001;
        render();
      }
      requestAnimationFrame(animate);
  }
  
  function initLightsCamerasAndScenes() {
    camera1 = new THREE.PerspectiveCamera(fov, window.innerWidth
            / window.innerHeight, .1, 20000);
    camera1.useQuaternion = true;
    camera = camera1;
    scene = new THREE.Scene();
    //periscope.position = new THREE.Vector3(0,0,0);
    scene.add(periscope);
    periscope.add(camera1);
    var m = 1050;
    var planeGeometry = new THREE.PlaneGeometry(SCREEN_WIDTH/m, SCREEN_HEIGHT/m , 1, 1);
    finalRenderTarget = new THREE.WebGLRenderTarget(SCREEN_WIDTH, SCREEN_HEIGHT, {format: THREE.RGBFormat});
    var planeMaterial = new THREE.MeshBasicMaterial({map: finalRenderTarget, 
        transparent:true, opacity:0.3});
    telaEstadimetro = new THREE.Mesh(planeGeometry, planeMaterial);
    telaEstadimetro.position.set(0, 0, -1);
    camera1.add(telaEstadimetro);
    telaEstadimetro.visible = false;
    
    // 0xDFF8FD matches the skybox at the horizon
    var ambientLight = new THREE.AmbientLight(0x111111);
    var sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.y = 10.0; // overhead (easier to debug and visualize)
    scene.add(ambientLight);
    scene.add(sunLight);
    var cameraLight = new THREE.DirectionalLight(0xffffff, 0.7);
    cameraLight.position.set(0, 0, 1).normalize();
    scene.add(cameraLight);
    renderer = new THREE.WebGLRenderer({antialias: true, autoClearColor: false});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClearColor = false;
    mainCanvas = renderer.domElement;
    mainCanvas.style.zIndex = -1;
    document.body.appendChild(mainCanvas);//renderer.domElement);
    perOverlay = new Overlay(mainCanvas, "PERISCOPE");
    if (!perOverlay.overlay) perOverlay.create();
    window.onkeydown = onKeyDown;
    window.onkeyup = onKeyUp;
    window.onmousedown = onMouseDown;
    window.onresize = onWindowResize;
  }

  function initMaterials() {

    // skybox material
    {
      var path = "textures/sunnysky/";
      var format = '.jpg';
      var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
      ];

      skyCubemap = THREE.ImageUtils.loadTextureCube(urls);

      var shader = THREE.ShaderLib["cube"];
      shader.uniforms["tCube"].value = skyCubemap;

      skyMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
      });
    }

    // Water material
    {
      normalmap = THREE.ImageUtils.loadTexture("textures/normal/ocean/water-normal.png");
      //normalmap = THREE.ImageUtils.loadTexture("textures/normal/flatNormal.png");
      normalmap.wrapS = normalmap.wrapT = THREE.RepeatWrapping;

      // Note addeding all of the lighting uniforms so that three.js will auto update the values.  
      // An easier way to do this is shown commented out below but it has a bug that destroys our normal 
      // texture (submitted to three.js).
      uniforms = {
        time: {type: "f", value: 1.0},
        useNoisePerturbations: {type: "i", value: 1},
        uRepeat: {type: "v2", value: new THREE.Vector2(5.0, 5.0)},
        uOffset: {type: "v2", value: new THREE.Vector2(0.0, 0.0)},
        tCube: {type: "t", value: skyCubemap},
        tNormal: {type: "t", value: normalmap},
        ambientLightColor: {type: "fv", value: []},
        directionalLightDirection: {type: "fv", value: []},
        directionalLightColor: {type: "fv", value: []},
        hemisphereLightDirection: {type: "fv", value: []},
        hemisphereLightSkyColor: {type: "fv", value: []},
        hemisphereLightGroundColor: {type: "fv", value: []},
        pointLightColor: {type: "fv", value: []},
        pointLightPosition: {type: "fv", value: []},
        pointLightDistance: {type: "fv1", value: []},
        spotLightColor: {type: "fv", value: []},
        spotLightPosition: {type: "fv", value: []},
        spotLightDirection: {type: "fv", value: []},
        spotLightDistance: {type: "fv1", value: []},
        spotLightAngleCos: {type: "fv1", value: []},
        spotLightExponent: {type: "fv1", value: []},
        fogDensity: {type: "f", value: 0.00025},
        fogNear: {type: "f", value: 1},
        fogFar: {type: "f", value: 1000},
        fogColor: {type: "c", value: new THREE.Color(0xDBF6FD)}
      };

      // The nicer way to add light uniforms (doesn't work correctly)
      //uniforms = THREE.UniformsUtils.merge( [uniforms, THREE.UniformsLib[ "lights" ] ]);

      testMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertShaderEnvMap').textContent,
        fragmentShader: document.getElementById('fragShaderEnvMap').textContent,
        lights: true,
        transparent: true 
      });
    }
  }

  //

  function initSkybox() {
    // The box dimension size doesn't matter that much when the camera 
    // is in the center.  Experiment with the values.
    skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(1000, 1000, 1000,
            1, 1, 1), skyMaterial);
    scene.add(skyboxMesh);
  }

  function initWater() {

    waterGeom = new THREE.PlaneGeometry(maxDist, maxDist, 100, 100);

    waterGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    waterGeom.computeFaceNormals();
    waterGeom.computeVertexNormals();
    waterGeom.computeTangents();

    mesh = new THREE.Mesh(waterGeom, testMaterial);
    mesh.position.y = -1;
    scene.add(mesh);
    colisores.push(mesh);
    corveta = new Escolta(70, -0.5, -150,'ccb');
    fragata = new Escolta(-200,0,-70,'fcg');
    corveta.load();
    fragata.load();
    THREE.ImageUtils.loadTexture( "textures/waterSmoke.png", undefined, particlesLoaded );
    function particlesLoaded(mapA) {
      var cloud = new THREE.Object3D();
      scene.add(cloud);
      psys = new SpriteParticleSystem({
        particlesMoveWithEmitter:false,
        cloud:cloud,
        rate:50,
        num:100,
        texture:mapA,
        scaleR:[0.001,0.005],
        speedR:[0,0.5],
        rspeedR:[-0.1,0.3],
        lifespanR:[.3,100],
        terminalSpeed:5
      });
      psys.position.set(0,6,-1);
      //psys.scale = new THREE.Vector3(0.1,0.1,0.1);
      psys.addForce(new THREE.Vector3(-15,0,0));
      psys.start();
    }
  }

  function waveUpdate(now) {
    var leng = waterGeom.vertices.length;
    for (var i = 0; i < leng; i++) {
      var noise = Math.round(Math.random() * leng);
      //if (i/noise==0)waterGeom.vertices[ noise ].y += 1;
            waterGeom.vertices[ i ].y = beaufort * 0.1 * (
                    Math.sin(i / 5 + (now * 10 + i) / 15) 
                    + Math.sin((i / 5 + (now * 10 + i) / 15)+Math.PI/4)
                    + Math.cos((i / 5 + (now * 10 + i) / 15)+Math.PI/3));
    }
    mesh.geometry.verticesNeedUpdate = true;
  }
  
  function render() {
    now = new Date().getTime() / 1000;
    deltaT = now - lastRenderTime;
    computeTimes(deltaT);
    waveUpdate(now);
    perOverlay.draw();
    periscopeUpdate(deltaT);
    corveta.prerender(deltaT);
    fragata.prerender(deltaT);
    if(modoEstadimetro){
      telaEstadimetro.visible = false;
      renderer.render(scene, camera1, finalRenderTarget, true);
      telaEstadimetro.visible = true;
    }
    renderer.render(scene, camera1);
    lastRenderTime = now;
  }