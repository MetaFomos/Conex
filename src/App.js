import { useState, useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FaDiscord, FaTwitter } from "react-icons/fa"
import { ImMap2} from "react-icons/im";
import { BsSpotify } from "react-icons/bs"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { ThreeCircles } from  'react-loader-spinner'

var obj;

function loadGLTFModel(scene, glbPath, options) {
  const { receiveShadow, castShadow } = options;
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      glbPath,
      (gltf) => {
        obj = gltf.scene;
        obj.name = "dinosaur";
        obj.position.y = 1;
        obj.position.x = -0.2;
        obj.receiveShadow = receiveShadow;
        obj.castShadow = castShadow;
        scene.add(obj);

        obj.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }
        });

        resolve(obj);
      },
      undefined,
      function (error) {
        console.log(error);
        reject(error);
      }
    );
  });
}

function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 4));
}

const Dinosaur = () => {
  const refContainer = useRef();
  const [loading, setLoading] = useState(true);
  const [renderer, setRenderer] = useState();

  useEffect(() => {
    const { current: container } = refContainer;
    if (container && !renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(scW, scH);
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);
      setRenderer(renderer);

      const scene = new THREE.Scene();
      // scene.add(new AxesHelper(5));
      const scale = 0.9;
      const camera = new THREE.OrthographicCamera(
        -scale,
        scale,
        scale,
        -scale,
        0.01,
        50000
      );
      const target = new THREE.Vector3(0, 2, 0);
      const initialCameraPosition = new THREE.Vector3(
        20 * Math.sin(0.2 * Math.PI),
        10,
        20 * Math.cos(0.2 * Math.PI)
      );
      const light = new THREE.PointLight(0xFFFFFF);
      scene.add(light);
      light.position.x = 0.2;
      light.position.y = 2.5;
      light.position.z = -0.5;
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = false;
      controls.target = target;
      controls.enableZoom = false;
      controls.enableRotate = false;
      

      loadGLTFModel(scene, "/DState.glb", {
        receiveShadow: false,
        castShadow: false
      }).then(() => {
        animate();
        setLoading(false);
      });

      let req = null;
      let frame = 0;
      const animate = () => {
        req = requestAnimationFrame(animate);
        frame = frame <= 100 ? frame + 1 : frame;

        if (frame <= 100) {
          const p = initialCameraPosition;
         
          camera.position.y = 2.5;
          camera.position.x = 0.2;
          camera.position.z = -1.8;
          camera.lookAt(target);
        } else { 
          controls.update();
        }

        renderer.render(scene, camera);
      };

      return () => {
        cancelAnimationFrame(req);
        renderer.dispose();
      };
    }
  }, []);

  return (
    <div
      style={{ height: "100%", width: "100%", position: "fixed"}}
      ref={refContainer}
    >
      {loading && (
        <span style={{ position: "absolute", left: "40%", top: "30%" }}>
          <ThreeCircles
            color="#23b8fd"
            height={300}
            width={300}
            ariaLabel="three-circles-rotating"
          />
        </span>
      )}
    </div>
  );
};

 function App() {
  const [step, setStep] = useState(0);
  var lastScrollTop = 0;

  window.addEventListener('scroll', function(){
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (obj && st > lastScrollTop){
      obj.rotation.y += 0.001;
    } else if (obj){
      obj.rotation.y -= 0.001;
    }
    lastScrollTop = st <= 0 ? 0 : st;
    console.log(lastScrollTop, window.innerHeight*4)
    if (lastScrollTop < window.innerHeight) {
      setStep(0);
    } else if (lastScrollTop >= window.innerHeight && lastScrollTop < window.innerHeight*2) {
      setStep(1);
    } else if (lastScrollTop >=window.innerHeight*2 && lastScrollTop < window.innerHeight*3) {
      setStep(2)
    } else if (lastScrollTop >=window.innerHeight*3 && lastScrollTop < window.innerHeight*4) {
      setStep(3);
    } else if (lastScrollTop >=window.innerHeight*4 && lastScrollTop < window.innerHeight*5) {
      setStep(4);
    } else if (lastScrollTop == window.innerHeight*5) {
      setStep(5)
    } 
  });

  return (
    <div style={{ width: window.innerWidth-20, height: window.innerHeight * 6, margin: "0 auto" }}>
      <Dinosaur />
      {step == 0 ? 
      <div className="fixed z-[100] w-full h-screen">
        <div className="relative w-full h-screen mt-10">
          <div className="flex justify-between mt-3 mx-24 items-center">
            <img src="/logo.png" />
            <p className='text-white pointer text-3xl border border-white py-1 px-3'
              >&#9776;</p>
          </div>
        </div>
        <div className="relative w-full h-screen bottom-[180px]">
          <div className="flex justify-between">
            <div className="font-mono text-white mx-24">
              <p className="font-[1000] text-[24px]">WE ARE D. STATE</p>
              <p className="font-mono text-[20px]">Define State is the crossroads of Reality and Artificial Intelligence. AI-powered </p>
              <p className="font-mono text-[20px]">apps, elastic tokenomics and real world assets provide value to our investors.</p>
            </div>
            <div className="text-white text-3xl mx-36 flex items-center">
              <p className="border p-2 mx-1"><FaDiscord /></p>
              <p className="border p-2"><FaTwitter /></p>
            </div>
          </div>
        </div>
      </div>
      : ''}
      {step == 1 ?
      <div className="fixed z-[100] w-full h-screen">
        <div className="flex justify-end relative w-full h-screen items-center text-white">
          <div className="mx-24"><p className="font-mono font-[1000] text-[80px] text-right">CHATTER</p><br />
          <p className="font-mono  text-[24px]">Chatter is our AI-powered social media </p>
          <p className="font-mono text-[24px]">aggregator tool. Get all the news, trends, </p>
          <p className="font-mono text-[24px]">and information you need in one place.</p></div>
        </div>
      </div>
      : ''
      }
      {step == 2 ?
        <div className="fixed z-[100] w-full h-screen">
          <div className="flex justify-start relative w-full h-screen items-center text-white">
            <div className="mx-24">
              <p className="font-[Ubuntu_Mono] font-[1000] text-[160px]">10,000</p>
              <p className="font-mono font-[1000] text-[48px] mb-5 tracking-wide">HIGH-QUALITY AVATARS</p>
              <p className="font-mono tracking-wide text-[24px]">in a refreshing art-style. While most</p>
              <p className="font-mono tracking-wide text-[24px]">aggregator tool. Get all the news, trends, </p>
              <p className="font-mono tracking-wide text-[24px]">experimental game theory,  deflationary</p>
              <p className="font-mono tracking-wide text-[24px]"> mechanisms and real-world utility behind</p>
              <p className="font-mono tracking-wide text-[24px]"> the art to gamify the collection. Please</p>
              <p className="font-mono tracking-wide text-[24px]"> see the Campus Map for more information.</p>
            </div>
          </div>
        </div>
        : ''
      }
      {step == 3 ?
      <div className="fixed z-[100] w-full h-screen">
        <div className="mt-20 relative grid grid-cols-2">
          <div className="col-start-2 text-white">
            <p className="font-[Bungee] font-bold text-[70px]">STUDENTS</p>
            <div className="mt-5 text-[28px] tracking-[.15em]">
              <p>are separated into 4 class types - </p>
              <p> Athletes, Hippies, Punks and Devs. Which </p> 
              <p>one will you be in?</p>
            </div>
            <div className="grid grid-cols-3 gap-x-10 font-mono mt-5">
              <div>
                <div className="">
                  <button className="bg-black rounded-md w-full h-full text-white text-[24px] py-10"><p className="font-[Bungee] font-bold text-[80px]">?</p>Atheletes</button>
                </div>
                <div className="mt-10">
                  <button className="bg-black rounded-md w-full h-full text-white text-[24px] py-10"><p className="font-[Bungee] font-bold text-[80px]">?</p>Punks</button>
                </div>
              </div>
              <div>
                <div className="mt-10">
                  <button className="bg-black rounded-md w-full h-full text-white text-[24px] py-10"><p className="font-[Bungee] font-bold text-[80px]">?</p>Hippies</button>
                </div>
                <div className="mt-10">
                  <button className="bg-black rounded-md w-full h-full text-white text-[24px] py-10"><p className="font-[Bungee] font-bold text-[80px]">?</p>Devs</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      : ''
      }
      {step == 4 ?
      <div className="fixed z-[100] w-full h-screen">
        <div className="relative items-center w-full h-screen grid grid-cols-2 ">
          <div className="ml-40 col-start-1 text-white ">
            <p className=" font-[Bungee] font-bold text-[70px]">ALMA MATER</p>
            <div className="mt-5 text-[28px] tracking-[.15em]">
              <p>Everything is changing,</p>
              <p>but why bother waiting?</p>
              <p>The world is yours for the taking,</p>
              <p>and you' ll be the one creating.</p>
              <p>Your choices decide your fate,</p>
              <p>so be careful which ones you make.</p>
              <p>Welcome to Define State,</p>
              <p>I hope you enjoy your stay.</p>
            </div>
          </div>
        </div>
      </div>
      : ''
      }
      {step == 5 ?
      <div className="fixed bg-black z-[100] w-full h-screen">
        <div className="relative w-full h-screen text-white">
          <div className="mt-40 flex justify-center">
            <p className="font-mono font-[800] text-[200px]">SOON</p>
          </div>
        </div>
        <div className="relative w-full h-screen bottom-[320px]">
          <div className="flex justify-center text-white text-3xl gap-2">
            <p className="border p-2"><FaDiscord /></p>
            <p className="border p-2"><FaTwitter /></p>
            <p className="border p-2"><BsSpotify /></p>
            <p className="border p-2"><ImMap2 /></p>
          </div>
          <div className="flex justify-center mt-5">
            <div className="font-mono text-slate-500 mx-24">
              <p className="font-mono text-[20px]">Define State is a registered trademark. All Rights Reserved. All logos are registered trademarks of their</p>
              <p className="font-mono text-[20px]"> respective owners. All contents of this document, unless otherwise credited, are copyright ©️ 2022 Define State. </p>
            </div>
          </div>
        </div>
      </div>
      : ''
      }
    </div>
  );
}

export default App;