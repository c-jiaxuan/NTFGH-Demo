/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/aws-services.js":
/*!*****************************!*\
  !*** ./src/aws-services.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   awsController: () => (/* binding */ awsController)\n/* harmony export */ });\nclass Transcriber {\r\n  async startTranscribe() {\r\n    console.log('startTranscribe');\r\n    try {\r\n      const { startRecording } = await Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_aws-sdk_client-cognito-identity_dist-es_CognitoIdentityClient_js-node_mo-08d2c3\"), __webpack_require__.e(\"vendors-node_modules_aws-sdk_client-transcribe-streaming_dist-es_TranscribeStreamingClient_js-70b976\"), __webpack_require__.e(\"src_libs_transcribeClient_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! ./libs/transcribeClient.js */ \"./src/libs/transcribeClient.js\"));\r\n      await startRecording('en-US', this.onTranscriptionDataReceived);\r\n\r\n      return true;\r\n    } catch (error) {\r\n      alert(\"An error occurred while recording: \" + error.message);\r\n      await this.stopTranscribe();\r\n\r\n      return false;\r\n    }\r\n  };\r\n\r\n  onTranscriptionDataReceived(data, IsPartial) {\r\n    awsController.updateTranscribingText(data, IsPartial);\r\n  };\r\n\r\n  async stopTranscribe() {\r\n    console.log('stopTranscribe');\r\n    const { stopRecording } = await Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_aws-sdk_client-cognito-identity_dist-es_CognitoIdentityClient_js-node_mo-08d2c3\"), __webpack_require__.e(\"vendors-node_modules_aws-sdk_client-transcribe-streaming_dist-es_TranscribeStreamingClient_js-70b976\"), __webpack_require__.e(\"src_libs_transcribeClient_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! ./libs/transcribeClient.js */ \"./src/libs/transcribeClient.js\"));\r\n    stopRecording();\r\n  };\r\n}\r\n\r\nclass Translater {\r\n    async startTranslate(sourceText, targetLanguage) {\r\n      console.log('startTranslate');\r\n  \r\n      try {\r\n        const { translateTextToLanguage } = await Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_aws-sdk_client-cognito-identity_dist-es_CognitoIdentityClient_js-node_mo-08d2c3\"), __webpack_require__.e(\"vendors-node_modules_aws-sdk_client-comprehend_dist-es_ComprehendClient_js-node_modules_aws-s-54b10a\"), __webpack_require__.e(\"src_libs_translateClient_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! ./libs/translateClient.js */ \"./src/libs/translateClient.js\"));\r\n  \r\n        const translation = await translateTextToLanguage(sourceText, targetLanguage);\r\n  \r\n        console.log(translation);\r\n        \r\n      } catch (error) {\r\n        alert(`There was an error translating the text: ${error.message}`);\r\n        return '';\r\n      }\r\n    }\r\n}\r\n\r\nclass AwsController {\r\n    constructor(){\r\n        this.transcribeInit = false;\r\n        this.translateInit = false;\r\n\r\n        this.transcribingText = '';\r\n        this.translatedText = '';\r\n        this.partialText = '';\r\n\r\n        this.timeout = null;\r\n        this.PAUSE_TIME = 5000; // 3 seconds pause time\r\n\r\n        // Callbacks\r\n        this.onUpdateCallbacks = [];\r\n        this.onCompleteCallbacks = [];\r\n\r\n        // Translation listeners\r\n        this.onTranslationCallbacks = [];\r\n    }\r\n\r\n    isTranscriberReady = () => this.translateInit;\r\n    isTranslateeady = () => this.translateInit;\r\n\r\n    // Register callbacks from other scripts\r\n    onUpdate(callback) {\r\n        this.onUpdateCallbacks.push(callback);\r\n    }\r\n\r\n    onComplete(callback) {\r\n        this.onCompleteCallbacks.push(callback);\r\n    }\r\n\r\n    onTranscribeInit() {\r\n        this.transcribeInit = true;\r\n    }\r\n\r\n    onTranslateInit() {\r\n        this.translateInit = true;\r\n    }\r\n\r\n    // ==== TRANSCRIPTION ====\r\n    startTranscribe = async () => {\r\n        transcriber.startTranscribe();\r\n    }\r\n\r\n    // Reset the timeout timer when a new partial transcription is received\r\n    resetTimeout() {\r\n      console.log('Rest Timeout');\r\n\r\n      clearTimeout(this.timeout);\r\n\r\n      this.timeout = setTimeout(() => {\r\n        this.onPauseDetected();\r\n      }, this.PAUSE_TIME);\r\n    }\r\n\r\n    // Handle when the user pauses for 3 seconds\r\n    onPauseDetected() {\r\n      console.log('User has paused for 3 seconds, completing transcription.');\r\n      this.finalizeTranscription();\r\n    }\r\n\r\n    // Finalize the transcription\r\n    finalizeTranscription() {\r\n      console.log('Finalizing Transcription...');\r\n      // Assuming you have a way to process the final transcription here\r\n      this.transcribingText += this.partialText;\r\n      this.partialText = ''; // Reset partial text\r\n      console.log('Final Transcript:', this.transcribingText);\r\n      // Call a callback or process the final transcript further\r\n      awsController.onTranscribeComplete(this.transcribingText);\r\n    }\r\n\r\n    updateTranscribingText = (data, IsPartial) => {\r\n      if (IsPartial) this.resetTimeout();\r\n\r\n      console.log(`updateTranscribingText ${data} - ${IsPartial}`);\r\n        if (IsPartial) {\r\n            // Live update without committing to final transcript\r\n            this.partialText = data;\r\n        } else {\r\n            // Add finalized text to full transcript\r\n            this.transcribingText += (this.partialText || '') + data + ' ';\r\n            this.partialText = ''; // Clear partial once finalized\r\n        }\r\n    \r\n        // Combine finalized + current partial for display\r\n        const displayText = this.transcribingText + (IsPartial ? data : '');\r\n        testDiv.innerHTML = displayText;\r\n        this.onUpdateCallbacks.forEach((cb) => cb(displayText));\r\n    }\r\n\r\n    onTranscribeComplete = async (finalTranscribedText) => {\r\n      console.log(`onTranscribeComplete ${finalTranscribedText}`);\r\n\r\n        transcriber.stopTranscribe();\r\n\r\n        this.onCompleteCallbacks.forEach((cb) => cb(finalTranscribedText));\r\n\r\n        testDiv.innerHTML = finalTranscribedText;\r\n        this.transcribingText = '';\r\n\r\n        clearTimeout(this.timeout);\r\n    }\r\n\r\n    resetTranscribe = () => { \r\n        this.transcribingText = '';\r\n    }\r\n\r\n    // ==== TRANSLATION ====\r\n    onTranslation(callback) {\r\n        this.onTranslationCallbacks.push(callback);\r\n    }\r\n\r\n    async startTranslate(sourceText, targetLang) {\r\n      const translated = await translater.startTranslate(sourceText, targetLang);\r\n      testDiv.innerHTML = translated;\r\n    }\r\n}\r\n\r\nconst awsController = new AwsController();\r\nconst transcriber = new Transcriber();\r\nawsController.onTranscribeInit();\r\n\r\nconst translater = new Translater();\r\nawsController.onTranslateInit();\r\n\r\nconst testDiv = document.getElementById('test-transcribe');\r\n\r\ndocument.addEventListener('aws-start-transcribe', async (e) => {\r\n  const { language } = e.detail;\r\n  await transcriber.startTranscribe();\r\n});\r\n\r\ndocument.addEventListener('aws-stop-transcribe', async () => {\r\n  await transcriber.stopTranscribe();\r\n});\r\n\r\ndocument.addEventListener('aws-start-translate', async (e) => {\r\n  const { sourceText, targetLanguage } = e.detail;\r\n  await translater.startTranslate(sourceText, targetLanguage);\r\n});\n\n//# sourceURL=webpack://nextjs/./src/aws-services.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".aws-services.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "nextjs:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunknextjs"] = self["webpackChunknextjs"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/aws-services.js");
/******/ 	
/******/ })()
;