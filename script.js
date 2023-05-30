const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaccc, 1);
document.body.appendChild(renderer.domElement);


const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.z = 15;


const cube = {
  geometry: new THREE.BoxGeometry(1, 1, 1),
  material: new THREE.MeshBasicMaterial({ color: 0x00ff00 })
};
cube.mesh = new THREE.Mesh(cube.geometry, cube.material);
scene.add(cube.mesh);


function createSpiralPath(radius, height, segments) {
  const path = [];
  const angleStep = (2 * Math.PI) / segments;
  const heightStep = height / segments;

  for (let i = 0; i <= segments; i++) {
    const angle = angleStep * i;
    const x = Math.cos(angle) * radius;
    const y = heightStep * i - height / 2;
    const z = Math.sin(angle) * radius;

    path.push(new THREE.Vector3(x, y, z));
  }
  return path;
}



function createObj(scene) {
  const obj = {
    geometry: new THREE.ConeGeometry(0.08, 0.4, 32),
    material: new THREE.MeshBasicMaterial({ color: 0x11ddbb })

  };
  obj.mesh = new THREE.Mesh(obj.geometry, obj.material);
  scene.add(obj.mesh);
  return obj
}

var numCones = 60;

// Create a spiral path around the cube
const spiralPath = createSpiralPath(1.5, 5, numCones);

// Add cones along the spiral path
var objs = []
for (let i = 0; i < spiralPath.length; i++) {
  const obj = createObj(scene);
  obj.mesh.position.copy(spiralPath[i]);
  objs.push(obj);
}


function render() {
  renderer.render(scene, camera);

  // Update cone positions
  for (let i = 0; i < objs.length; i++) {
    // Increment the vertical position
    objs[i].mesh.position.y += 0.01;

    // Calculate the spiral motion
    const angle = objs[i].mesh.position.y * 1;
    const radius = objs[i].mesh.position.y * 4;

    // Update the cone's position using the spiral equation
    objs[i].mesh.position.x = Math.cos(angle) * radius;
    objs[i].mesh.position.z = Math.sin(angle) * radius;

    // Reset cone's y position when it reaches the top
    if (objs[i].mesh.position.y > 3) {
      objs[i].mesh.position.y = -3;

    }
  }

  cube.mesh.rotation.x += 0.01;
  cube.mesh.rotation.y -= 0.01;

  requestAnimationFrame(render);
}

render();