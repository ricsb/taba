var Globais = {
    SCREEN_WIDTH: window.innerWidth
    , SCREEN_HEIGHT: window.innerHeight
    , avisando: false
    , aps: {NAVIGATION: 1, PERISCOPE: 2, INFO: 3, LOADING: 5, GAME_OVER: 6}
    , mode: 5
    , tBearing: "000.0"
    , rBearing: "325.0"
    , lang: "eng"
    , eng: {1: "Target Height (feet)", 2: "Stadimeter", 3: "Exposition", 4:"Points: "}
    , por: {1: "Altura do Alvo (em P\u00e7s)", 2: "Estad\u00edmetro", 3: "Exposi\u00e7\u00e3o", 4:"Pontos: "}
    , tempoIndiscreto: 0
    , distance: "00000.0"
    , centerMsg: ""
    , ivh: 0
    , zoom: "1.5x"
    , tgt1Time: 0
    , tgt2Time: 0
    , stad: ""
    , points: 50
    , subPos: new THREE.Vector3(0, 0, 0)
    , maxDist: 1000
    , fragPos: false
    , corvPos: false
    , parlatorium: function(verbete) {
        switch (Globais.lang) {
            case "eng":
                return Globais.eng[verbete];
                break;
            case "por":
                return Globais.por[verbete];
                break;
        }
    }
};


