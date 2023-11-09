import * as THREE from 'three';

function removeArrayElement(array, element) {
    const ndx = array.indexOf(element);
    if (ndx >= 0) {
      array.splice(ndx, 1);
    }
}

class SafeArray {
    constructor() {
        this.array = [];
        this.addQueue = [];
        this.removeQueue = new Set();
    }
    get isEmpty() {
        return this.addQueue.length + this.array.length > 0;
    }
    add(element) {
        this.addQueue.push(element);
    }
    remove(element) {
        this.removeQueue.add(element);
    }
    findByName(name) {
        this._addQueued();
        this._removeQueued();
        return this.array.find(element=>element.name===name);
    }
    forEach(fn) {
        this._addQueued();
        this._removeQueued();
        for (const element of this.array) {
        if (this.removeQueue.has(element)) {
            continue;
        }
        fn(element);
        }
        this._removeQueued();
    }
    _addQueued() {
        if (this.addQueue.length) {
        this.array.splice(this.array.length, 0, ...this.addQueue);
        this.addQueue = [];
        }
    }
    _removeQueued() {
        if (this.removeQueue.size) {
        this.array = this.array.filter(element => !this.removeQueue.has(element));
        this.removeQueue.clear();
        }
    }
}

function getSine(tick, amplitude, offset=0) {
    var x = 1;
    var y = 0;
    var frequency = 0.25
    var height = 1
    var x = 1;
    var y = 0;

    y = height/2 + amplitude * Math.sin((x+tick)/frequency);
    x++;

    return y + offset
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateCapsuleCollider(start, end, radius) {
    start.visible = false
    end.visible = false
    radius.visible = false

    const startWorldPos = new THREE.Vector3()
    const endWorldPos = new THREE.Vector3()

    const capsuleBottom = start
    const capsuleTop = end
    const capsuleRadius = radius.position.distanceTo(capsuleBottom.position)
    const line = new THREE.Line3(capsuleBottom.getWorldPosition(startWorldPos), capsuleTop.getWorldPosition(endWorldPos))

    // Vision helper
    const material = new THREE.LineBasicMaterial({
        color: 0xFFFFFF
    });
    const points = [];
    points.push( capsuleBottom.position );
    points.push( capsuleTop.position);
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const lineMesh = new THREE.Line( geometry, material );

    // body (used for visualizing and click events)
    const color = new THREE.Color( 0xFF000D );

    const tubeGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        12,// path segments
        capsuleRadius,// THICKNESS
        8, //Roundness of Tube
        true //closed
      );

    const tubeWireframe = new THREE.Mesh(
        tubeGeometry,
        new THREE.MeshStandardMaterial( { color: color } )
    )
    tubeWireframe.material.opacity = 1
    tubeWireframe.material.wireframe = true
    tubeWireframe.visible = false

    
    const torusGeometry = new THREE.TorusGeometry( capsuleRadius, 0.02, 12, 40 ); 
    const torusMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ); 
    const capsuleRing = new THREE.Mesh( torusGeometry, torusMaterial );
    capsuleRing.rotation.x = Math.PI / 2
    capsuleRing.visible = false

    const capsule = {
        radius: capsuleRadius,
        segment: line,
        body: tubeWireframe,
        spine: lineMesh,
        velocity: new THREE.Vector3(),
        ring: capsuleRing,
    }
    return capsule
}

function checkCapsuleCollision(capsule1, capsule2) {
    // Get the line segments and radii of the capsules
    const segment1 = capsule1.segment;
    const segment2 = capsule2.segment;
    const radius1 = capsule1.radius;
    const radius2 = capsule2.radius;
  
    // Get the start and end points of the line segments
    const start1 = segment1.start.clone();
    const end1 = segment1.end.clone();
    const start2 = segment2.start.clone();
    const end2 = segment2.end.clone();
  
    // Calculate the vectors representing the line segments
    const dir1 = end1.clone().sub(start1).normalize();
    const dir2 = end2.clone().sub(start2).normalize();
    
    // Calculate the projections of start2 onto the line segment 1
    const projection1Start2 = start2.clone().sub(start1).dot(dir1);
    const projection1End2 = end2.clone().sub(start1).dot(dir1);
    const projection1 = Math.max(Math.min(projection1Start2, projection1End2), 0);
    const closestPoint1 = new THREE.Vector3().copy(dir1).multiplyScalar(projection1).add(start1);
  
    // Calculate the projections of start1 onto the line segment 2
    const projection2Start1 = start1.clone().sub(start2).dot(dir2);
    const projection2End1 = end1.clone().sub(start2).dot(dir2);
    const projection2 = Math.max(Math.min(projection2Start1, projection2End1), 0);
    const closestPoint2 = new THREE.Vector3().copy(dir2).multiplyScalar(projection2).add(start2);
  
    // Check if the closest points are within the line segment bounds
    if (projection1Start2 < 0 || projection1Start2 > segment1.distance()) {
      closestPoint1.copy(projection1Start2 < 0 ? start1 : end1);
    }
  
    if (projection2Start1 < 0 || projection2Start1 > segment2.distance()) {
      closestPoint2.copy(projection2Start1 < 0 ? start2 : end2);
    }
  
    // Calculate the squared distance between the closest points
    const closestDistanceSq = closestPoint1.distanceToSquared(closestPoint2);
  
    // Calculate the sum of the radii
    const sumRadii = radius1 + radius2;
    // Check if the squared distance is smaller than the sum of the radii squared
    if (closestDistanceSq < sumRadii * sumRadii) {
      // Collision detected
      return {isColliding: true, closestPoint1, closestPoint2};
    }
  
    // No collision
    return {isColliding: false, closestPoint1, closestPoint2};
}

function distancePointToLine(point, line, parent) {
    // Get the world matrix of the parent object
    const worldMatrix = new THREE.Matrix4();
    parent.updateMatrixWorld(); // Make sure the parent's world matrix is up to date
    worldMatrix.copy(parent.matrixWorld);

    // Apply the world matrix to the line's start and end points
    const worldStart = new THREE.Vector3().copy(line.start).applyMatrix4(worldMatrix);
    const worldEnd = new THREE.Vector3().copy(line.end).applyMatrix4(worldMatrix);

    // Create a vector that points from the worldStart to the point
    const v1 = new THREE.Vector3();
    v1.subVectors(point, worldStart);

    // Create a vector representing the direction of the line
    const lineDirection = new THREE.Vector3();
    lineDirection.subVectors(worldEnd, worldStart).normalize();

    // Project v1 onto the line direction
    const projection = v1.dot(lineDirection);

    // If the projection is outside the line segment, clamp it
    const clampedProjection = Math.max(0, Math.min(projection, worldStart.distanceTo(worldEnd)));

    // Calculate the closest point on the line
    const closestPoint = new THREE.Vector3();
    closestPoint.copy(lineDirection).multiplyScalar(clampedProjection).add(worldStart);

    // Calculate the distance between the point and the closest point on the line
    const distance = point.distanceTo(closestPoint);

    return distance;
}

function getScreenCoordinatesAndDistance(gameObject, collider, offsetY) {
    const position = new THREE.Vector3();
    const cameraPosition = new THREE.Vector3();
    position.copy(gameObject.transform.position);
    position.y+=offsetY
    position.project(Avern.State.camera);
  
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
  
    const x = (position.x * halfWidth) + halfWidth;
    const y = -(position.y * halfHeight) + halfHeight;

    const distanceToCamera = gameObject.transform.position.distanceTo(Avern.State.camera.getWorldPosition(cameraPosition));
    const frustum = new THREE.Frustum()
    const matrix = new THREE.Matrix4().multiplyMatrices(Avern.State.camera.projectionMatrix, Avern.State.camera.matrixWorldInverse)
    frustum.setFromProjectionMatrix(matrix)

    const towardsTarget = gameObject.transform.position.clone()
    towardsTarget.y += offsetY/2
    towardsTarget.sub(Avern.Player.transform.position.clone());
    const raycaster = new THREE.Raycaster(Avern.Player.transform.position, towardsTarget.normalize());

    const intersects = raycaster.intersectObjects([collider.body, Avern.State.collider], false);
    const obstructed = intersects[0] && intersects[0].object.name === "worldCollider"
    const visible = frustum.intersectsObject(collider.body) && (intersects[0] && intersects[0].object.name !== "worldCollider")

    return { x, y, distanceToCamera, visible, obstructed };
}

function calculateDamageByDistance(baseDamage, distance, maxDistance, exponent=2) {
    
    // Calculate the scaled distance
    const scaledDistance = Math.min(distance / maxDistance, 1);
    
    // Calculate the damage based on the scaled distance and exponent
    const calculatedDamage = Math.min(baseDamage / Math.pow(scaledDistance, exponent),35);
    
    return calculatedDamage;
}

function findClosestPointOnMeshToPoint(mesh, point) {
    // Create two raycast directions: +Y and -Y
    const raycastDirections = [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0)];

    // Initialize variables to store the closest distance and point
    let closestDistance = Number.POSITIVE_INFINITY;
    let closestPoint = new THREE.Vector3();

    // Loop through the raycast directions
    for (const direction of raycastDirections) {
        const raycaster = new THREE.Raycaster(point, direction);
        const intersects = raycaster.intersectObject(mesh);
        if (intersects.length > 0) {
        // The ray intersects the mesh, get the closest intersection point
        const intersectionPoint = intersects[0].point;

        // Calculate the distance between the intersection point and the original point
        const distance = point.distanceTo(intersectionPoint);
        // Update closest point and distance if this intersection is closer
        if (distance < closestDistance) {
            closestDistance = distance;
            closestPoint = intersectionPoint.clone();
        }
        }
    }
    if (closestDistance == Number.POSITIVE_INFINITY) return null
    return closestPoint;
}

function updateRotationToFacePoint(object, targetPoint, lerpFactor) {
    // Calculate the direction from the object's position to the target point
    var direction = targetPoint.clone().sub(object.position);
    
    // Calculate the angle between the direction vector and the positive Z-axis
    var targetAngle = Math.atan2(direction.x, direction.z);
    
    // Wrap both angles to the range [-π, π] for proper interpolation
    var currentAngle = object.rotation.y;
    if (currentAngle > Math.PI) {
      currentAngle -= 2 * Math.PI;
    } else if (currentAngle < -Math.PI) {
      currentAngle += 2 * Math.PI;
    }
    
    // Calculate the angular distance between current and target angles
    var angularDistance = targetAngle - currentAngle;
    
    // Choose the shortest angular distance (clockwise or counterclockwise)
    if (angularDistance > Math.PI) {
      angularDistance -= 2 * Math.PI;
    } else if (angularDistance < -Math.PI) {
      angularDistance += 2 * Math.PI;
    }
    
    // Apply lerp to interpolate between the current angle and the target angle
    var newAngle = currentAngle + angularDistance * lerpFactor;
    
    // Update the rotation of the object
    object.rotation.y = newAngle;
}
export { 
    generateCapsuleCollider, 
    checkCapsuleCollision, 
    distancePointToLine,
    removeArrayElement, 
    getSine, 
    randomIntFromInterval,
    calculateDamageByDistance,
    findClosestPointOnMeshToPoint,
    getScreenCoordinatesAndDistance,
    updateRotationToFacePoint,
    SafeArray 
}