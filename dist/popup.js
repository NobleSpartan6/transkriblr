/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup/popup.js":
/*!****************************!*\
  !*** ./src/popup/popup.js ***!
  \****************************/
/***/ (() => {

eval("var isRecording = false;\ndocument.getElementById('startBtn').addEventListener('click', startRecording);\ndocument.getElementById('stopBtn').addEventListener('click', stopRecording);\ndocument.getElementById('exportBtn').addEventListener('click', exportTranscript);\nfunction startRecording() {\n  chrome.runtime.sendMessage({\n    action: 'startRecording'\n  });\n  isRecording = true;\n  updateUI();\n}\nfunction stopRecording() {\n  chrome.runtime.sendMessage({\n    action: 'stopRecording'\n  });\n  isRecording = false;\n  updateUI();\n}\nfunction exportTranscript() {\n  var transcriptText = document.getElementById('transcriptArea').textContent;\n  var blob = new Blob([transcriptText], {\n    type: 'text/plain'\n  });\n  var timestamp = new Date().toISOString().replace(/[:.]/g, '-');\n  chrome.downloads.download({\n    url: URL.createObjectURL(blob),\n    filename: \"transcript-\".concat(timestamp, \".txt\"),\n    saveAs: true\n  });\n}\nfunction updateUI() {\n  document.getElementById('startBtn').disabled = isRecording;\n  document.getElementById('stopBtn').disabled = !isRecording;\n  document.getElementById('recordingIndicator').style.display = isRecording ? 'inline' : 'none';\n}\n\n// Listen for transcript updates\nchrome.runtime.onMessage.addListener(function (message) {\n  if (message.action === 'updateTranscript') {\n    var transcriptArea = document.getElementById('transcriptArea');\n    transcriptArea.textContent = message.transcript;\n    if (message.interim) {\n      transcriptArea.textContent += message.interim;\n    }\n  }\n});\n\n//# sourceURL=webpack://transkriblr/./src/popup/popup.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/popup/popup.js"]();
/******/ 	
/******/ })()
;