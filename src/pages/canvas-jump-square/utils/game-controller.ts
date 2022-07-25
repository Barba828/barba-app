const listeners: Function[] = [];
let controlType = "keyboard";

export const addListener = (callback: () => void) => {
  listeners.push(callback);
};

const notify = () => {
  listeners.forEach((listener) => listener());
};

const eventDispatcher = (type: "audio" | "keyboard") => {
  if (controlType === type) {
    notify();
  }
};

function initKeyboardListener() {
  window.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "ArrowUp") {
      eventDispatcher("keyboard");
    }
  });
  window.addEventListener("touchstart", (event) => {
    eventDispatcher("keyboard");
  });
}

// function initAudioListener() {
//   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     let audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     // 获取用户的 media 信息
//     navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
//       const mediaStreamSource = audioContext.createMediaStreamSource(stream);
//       const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
//       mediaStreamSource.connect(scriptProcessor);
//       scriptProcessor.connect(audioContext.destination);

//       scriptProcessor.onaudioprocess = function (e) {
//         // 获得缓冲区的输入音频，转换为包含了PCM通道数据的32位浮点数组
//         let buffer = e.inputBuffer.getChannelData(0);
//         // 获取缓冲区中最大的音量值
//         let maxVal = Math.max.apply(Math, buffer);
//         if (maxVal * 100 > 2 && performance.now() - lastTime > 300) {
//           lastTime = performance.now();
//           eventDispatcher("audio");
//           console.log(maxVal);
//         }
//       };
//     });
//   }
// }

function once(factory: () => any) {
  let inited = false;
  return () => {
    if (!inited) {
      factory();
      inited = true;
    }
  };
}

initKeyboardListener();
