// image 右键菜单
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "test",
    title: "Handle Pixel",
    type: "normal",
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: "test1",
    title: "Handle Pixel1",
    type: "normal",
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: "home",
    type: "separator",
    contexts: ["image"],
  });
});

// 右键菜单 click
chrome.contextMenus.onClicked.addListener((item, tab) => {
  if (item.mediaType === "image") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showModal,
    });
  }
});

// extension 图标（需要 manifest.json action:{}）
chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showModal,
    });
  }
});

const showModal = () => {
  const modal = document.createElement("dialog");
  modal.setAttribute(
    "style",
    `
    height: 50%;
    width: 80%;
    top: 150px;
    border-radius: 20px;
    position: fixed; 
    padding: 0px;
    border: none;
    box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
    `
  );
  modal.innerHTML = `
  <iframe id="popup-content"
    style="height:100%; width: 100%; border: none;"
    src="${chrome.runtime.getURL("index.html")}"
  ></iframe>
  <div style="position:absolute; top:0px; left:5px;">
    <button style="padding: 8px 12px; font-size: 16px; border: none; border-radius: 20px;">x</button>
  </div>`;

  document.body.appendChild(modal);
  const dialog = document.querySelector("dialog");
  dialog.showModal();
  const iframe = document.getElementById("popup-content");
  iframe.frameBorder = 0;
  dialog.querySelector("button").addEventListener("click", () => {
    dialog.close();
  });
};
