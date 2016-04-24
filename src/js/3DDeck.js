import $          from 'jquery';
import THREE      from 'three';

require('./3rd-party/TrackballControls');

import statsModule from './3DStats';

const TILE_SIZE = 5;

let scene;
let controls;
let stats;
let renderer;
let camera;
let geometries;
let pieces = [];

let init = ($container) => {


  scene = new THREE.Scene();

  stats = statsModule.init();

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0xEEEEEE);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;


// поле

  let deck = null;

  let TextureLoader = new THREE.TextureLoader();

  TextureLoader.load('img/back.jpg', (deckTexture) => {

    deckTexture.wrapS = deckTexture.wrapT = THREE.RepeatWrapping;
    deckTexture.repeat.set(4, 4);

    let deckMaterial = new THREE.MeshBasicMaterial({map: deckTexture, side: THREE.DoubleSide});

    deck = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40, 1, 1),
      deckMaterial
    );

    deck.position.x = 20;
    deck.position.y = 20;
    deck.position.z = 0;

    deck.receiveShadow	= true;

    scene.add(deck);

  });


// освещение
  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(20, 20, 50);
  scene.add(spotLight);


// камера
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 0;
  camera.position.y = -55;
  camera.position.z = 30;
  camera.rotation.x = Math.PI/2;

  window.camera = camera;

  controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;


  let raycaster = new THREE.Raycaster();

  let plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2000, 2000, 8, 8),
    new THREE.MeshBasicMaterial({visible: false})
  );
  scene.add(plane);

  let mouse  = new THREE.Vector2(),
      offset = new THREE.Vector3(),
      INTERSECTED, SELECTED;

  renderer.domElement.addEventListener('mousemove', onMouseMove, false);
  renderer.domElement.addEventListener('mousedown', onMouseDown, false);
  renderer.domElement.addEventListener('mouseup',   onMouseUp, false);

  window.addEventListener('resize', onWindowResize, false);


  return loadAllGeometries()
    .then( (loadedGeometries) => {
      geometries = loadedGeometries;

      $container.append(renderer.domElement);
      
      if (stats)
        $container.append(stats.domElement);

      startRenderScene();
    });

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }


  function onMouseDown(event) {
    event.preventDefault();

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(pieces);

    if (intersects.length > 0) {
      controls.enabled = false;
      SELECTED = intersects[0].object;

      intersects = raycaster.intersectObject(plane);
      if (intersects.length > 0)
        offset.copy(intersects[0].point).sub(plane.position);
    }
  }


  function onMouseUp(event) {
    event.preventDefault();
    controls.enabled = true;

    if ( INTERSECTED ) {
      plane.position.copy( INTERSECTED.position );
      SELECTED = null;
    }
  }


  function onMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects;

    if ( SELECTED ) {
      intersects = raycaster.intersectObject( plane );

      if ( intersects.length > 0 )
        SELECTED.position.copy( intersects[0].point.sub( offset ) );

      return;
    }

    intersects = raycaster.intersectObjects( pieces );

    if (intersects.length > 0) {
      if (INTERSECTED != intersects[0].object ) {

        if (INTERSECTED)
          INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

        INTERSECTED = intersects[0].object;
        INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

        plane.position.copy( INTERSECTED.position );
        plane.lookAt( camera.position );
      }
    } else {
      if ( INTERSECTED )
        INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

      INTERSECTED = null;
    }
  }

};


function startRenderScene() {
  controls.update();
  if (stats) stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(startRenderScene);
}

function loadAllGeometries() {

  function loadGeometry(src) {
    return new Promise( (resolve) => {
      loader.load( src, (geometry) => resolve(geometry) );
    });
  }


  let geometries = {};

  let loader = new THREE.JSONLoader();

  let modelSources= {
    pawn:   'models/pawn.json',
    rook:   'models/rook.json',
    knight: 'models/knight.json',
    king:   'models/king.json',
    bishop: 'models/bishop.json',
    queen:  'models/queen.json'
  };


  return Promise.all(Object.keys(modelSources).map( (pieceType) => {
    return loadGeometry(modelSources[pieceType])
      .then( (geometry) => {
        geometries[pieceType] = geometry;
      });
    }))
    .then( () => {
      return geometries;
    });

}

function addPiece(pieceType, x, y, color) {
  let mesh = new THREE.Mesh(
    geometries[pieceType],
    new THREE.MeshLambertMaterial({
      color: color == 'white' ? 0xffffff : 0x333333
    })
  );

  mesh.castShadow = true;
  pieces.push(mesh);

  mesh.position.x = x * TILE_SIZE + TILE_SIZE/2;
  mesh.position.y = y * TILE_SIZE + TILE_SIZE/2;
  mesh.position.z = 0;
  mesh.rotation.x = Math.PI;

  if (pieceType == 'knight')
    mesh.rotation.z = (color == 'black'? -1 : 1 ) * Math.PI /2;

  scene.add(mesh);
}

function movePiece(from, to) {
  let curX = from.x * TILE_SIZE + TILE_SIZE/2;
  let curY = from.y * TILE_SIZE + TILE_SIZE/2;

  let piece = pieces.find( (piece) => piece.position.x == curX  && piece.position.y == curY);

  piece.position.x = to.x * TILE_SIZE + TILE_SIZE/2;
  piece.position.y = to.y * TILE_SIZE + TILE_SIZE/2;
}

export {init, addPiece, movePiece};