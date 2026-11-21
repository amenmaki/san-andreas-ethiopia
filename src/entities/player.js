import * as THREE from 'three';

export function createPlayer(scene) {
  const player = new THREE.Group();

  const bodyMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 1.8, 0.7),
    new THREE.MeshLambertMaterial({ color: 0x16a34a })
  );
  bodyMesh.position.y = 1.4;

  const headMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    new THREE.MeshLambertMaterial({ color: 0x78350f })
  );
  headMesh.position.y = 2.75;

  const jetpackMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.1, 0.45),
    new THREE.MeshLambertMaterial({ color: 0x94a3b8 })
  );
  jetpackMesh.position.set(0, 1.6, -0.5);
  jetpackMesh.visible = false;

  player.add(bodyMesh, headMesh, jetpackMesh);
  player.position.set(0, 0, 28);
  scene.add(player);

  return {
    mesh: player,
    jetpackMesh,
    velY: 0,
    onGround: true
  };
}

export function updatePlayer(playerObj, state, input, colliders, dt) {
  const player = playerObj.mesh;
  player.rotation.y += input.turnInput * 2.8 * dt;

  const walkSpeed = (input.isSprint ? 15 : 8.5) * input.moveForward;
  const nx = player.position.x + Math.sin(player.rotation.y) * walkSpeed * dt;
  const nz = player.position.z + Math.cos(player.rotation.y) * walkSpeed * dt;

  const blocked = colliders.some(
    (c) => Math.abs(nx - c.x) < c.hw && Math.abs(nz - c.z) < c.hd
  );
  if (!blocked) {
    player.position.x = nx;
    player.position.z = nz;
  }

  if (state.jetpack && input.isJump) {
    playerObj.velY = 14;
    playerObj.onGround = false;
  } else if (input.isJump && playerObj.onGround) {
    playerObj.velY = 10.5;
    playerObj.onGround = false;
  }

  player.position.y += playerObj.velY * dt;
  if (player.position.y > 0) {
    playerObj.velY -= 24 * dt;
  } else {
    player.position.y = 0;
    playerObj.velY = 0;
    playerObj.onGround = true;
  }
}
