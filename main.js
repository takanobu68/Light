"use strict"

{
	window.addEventListener('load', init)

	function init() {

		const stats = initStats();

		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		camera.position.set(-25, 30, 25);

		camera.lookAt(new THREE.Vector3(10, 0, 0));

		const renderer = new THREE.WebGLRenderer()

		renderer.setClearColor(new THREE.Color(0xeeeeee));
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true;

		const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
		const planeMaterial = new THREE.MeshLambertMaterial({
			color: 0xffffff
		});
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.receiveShadow = true;

		plane.rotation.x = -0.5 * Math.PI;
		plane.position.set(15, 0, 0);

		scene.add(plane);

		const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
		const cubeMaterial = new THREE.MeshLambertMaterial({
			color: 0xff0000
		})
		const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.castShadow = true;

		cube.position.set(-10, 3, 0);

		scene.add(cube);

		const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
		const sphereMaterial = new THREE.MeshLambertMaterial({
			color: 0x7777ff
		});
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.castShadow = true;

		sphere.position.set(20, 0, 2);


		scene.add(sphere);

		// 環境光源を作成
		// new THREE.AmbientLight(色, 光の強さ)
		// 特定の入射角がないので、影を落とさない
		// 全ての面を同じ色にしてしまう。
		let ambiColor = "#0c0c0c"
		const ambientLight = new THREE.AmbientLight(ambiColor);
		scene.add(ambientLight);

		// SpotLightクラスは、単一の点から一方向に放出され、
		// 円錐に沿って放出される光源
		// ex)懐中電灯や、ステージのスポットライト
		// new THREE.SpotLight(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
		const spotLight = new THREE.SpotLight(0xffffff,1,100,500,1,1);
		spotLight.position.set(-25, 30, -5);
		spotLight.castShadow = true;
		scene.add(spotLight);

		// spotLightのヘルパークラスの実装
		const lightHelper = new THREE.SpotLightHelper(spotLight);
		scene.add(lightHelper);

		document.getElementById("WebGL-output").appendChild(renderer.domElement);

		const controls = new function () {
			this.rotationSpeed = 0.02;
			this.bouncingSpeed = 0.03;
			this.ambientColor = ambiColor;
			this.disableSpotlight = false;
		};

		const gui = new dat.GUI();
		// addColor関数を使用すると実際の色を確認しながら選択できるような
		// オプションを追加できる
		gui.addColor(controls, 'ambientColor').onChange(e => {
			ambientLight.color = new THREE.Color(e)
		});
		gui.add(controls, 'disableSpotlight').onChange(e => {
			spotLight.visible = !e;
		});

		let step = 0;

		render();

		function render() {
			stats.update();
			lightHelper.update();

			cube.rotation.x += controls.rotationSpeed;
			cube.rotation.y += controls.rotationSpeed;
			cube.rotation.z += controls.rotationSpeed;

			step += controls.bouncingSpeed;
			sphere.position.x = 20 + (10 * (Math.cos(step)));
			sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

			requestAnimationFrame(render);
			renderer.render(scene, camera);
		}

		function initStats() {

			var stats = new Stats();

			stats.setMode(0);

			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';

			document.getElementById("Stats-output").appendChild(stats.domElement);

			return stats;
		}
	}
}
