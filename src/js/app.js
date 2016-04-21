import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'backbone';
// import THREE      from 'three';
// import Stats      from 'stats-js';

window.$ = $;
window.Backbone = Backbone;

Backbone.View.prototype.close = function () {
  this.remove();
  this.unbind();
  if (this.onClose) {
    this.onClose();
  }
};

import LoginView    from './views/p-login';
import MainMenuView from './views/p-mainMenu';
import GameUIView   from './views/p-gameUI';

let App = {
  setMainRegion: function (newView) {
    if (this.mainRegion)
      this.mainRegion.close();
    this.mainRegion = newView;
    $('#main-content').html(newView.render().$el);
  }
};

let loginView = new GameUIView();
App.setMainRegion(loginView);
loginView.on('login', createMainMenu);

function createMainMenu() {
  let mainMenuView = new MainMenuView();
  App.setMainRegion(mainMenuView);
  mainMenuView.on('joined-to-game', (params) => {
    let inGameView = new GameUIView(params)
    App.setMainRegion(inGameView);
    inGameView.on('close', createMainMenu );
  });
}


// THREE.PointerLockControls = function ( camera ) {
//
//   var scope = this;
//
//   camera.rotation.set( 0, 0, 0 );
//
//   var pitchObject = new THREE.Object3D();
//   pitchObject.add( camera );
//
//   var yawObject = new THREE.Object3D();
//   yawObject.position.y = 10;
//   yawObject.add( pitchObject );
//
//   var PI_2 = Math.PI / 2;
//
//   var onMouseMove = function ( event ) {
//
//     if ( scope.enabled === false ) return;
//
//     var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
//     var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
//
//     yawObject.rotation.y -= movementX * 0.002;
//     pitchObject.rotation.x -= movementY * 0.002;
//
//     pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
//
//   };
//
//   this.dispose = function() {
//
//     document.removeEventListener( 'mousemove', onMouseMove, false );
//
//   };
//
//   document.addEventListener( 'mousemove', onMouseMove, false );
//
//   this.enabled = false;
//
//   this.getObject = function () {
//
//     return yawObject;
//
//   };
//
//   this.getDirection = function() {
//
//     // assumes the camera itself is not rotated
//
//     var direction = new THREE.Vector3( 0, 0, - 1 );
//     var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );
//
//     return function( v ) {
//
//       rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );
//
//       v.copy( direction ).applyEuler( rotation );
//
//       return v;
//
//     };
//
//   }();
//
// };
//
// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(45
//   , window.innerWidth / window.innerHeight, 0.1, 1000);
//
// let mouseControl = new THREE.PointerLockControls(camera);
//
// mouseControl.enabled = true;
//
// scene.add(mouseControl.getObject());
//
// var renderer = new THREE.WebGLRenderer();
// renderer.setClearColor(0xEEEEEE);
// renderer.setSize(window.innerWidth, window.innerHeight);
//
// var axes = new THREE.AxisHelper(20);
// scene.add(axes);
//
// var planeGeometry = new THREE.PlaneGeometry(40, 40, 1, 1);
// var planeMaterial = new THREE.MeshLambertMaterial(
//   {color: 0xffffff});
// var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.rotation.x = -0.5 * Math.PI;
// plane.position.x = 15;
// plane.position.y = 0;
// plane.position.z = 0;
// scene.add(plane);
//
// var cubeGeometry = new THREE.CubeGeometry(4, 4, 4);
// var cubeMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('img/crate.jpg') } );
// var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// cube.position.x = -4;
// cube.position.y = 3;
// cube.position.z = 0;
// scene.add(cube);
//
// var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
// var sphereMaterial = new THREE.MeshLambertMaterial(
//   {color: 0x7777ff});
// var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// sphere.position.x = 20;
// sphere.position.y = 4;
// sphere.position.z = 2;
// scene.add(sphere);
//
// var spotLight = new THREE.SpotLight( 0xffffff );
// spotLight.position.set( -40, 60, -10 );
// scene.add(spotLight );
//
// camera.position.x = -20;
// camera.position.y = 40;
// camera.position.z = 30;
// camera.lookAt(scene.position);
// $("body").append(renderer.domElement);
//
// var stats = new Stats();
// stats.setMode(0);
//
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.left = '0px';
// stats.domElement.style.top = '0px';
//
// $('body').append( stats.domElement );
//
// window.stats = stats;
//
// function renderScene() {
//   stats.begin();
//
//   cube.rotation.x += 0.02;
//   cube.rotation.y += 0.02;
//   cube.rotation.z += 0.02;
//
//
//   requestAnimationFrame(renderScene);
//   renderer.render(scene, camera);
//   stats.end();
// };
//
// renderScene();