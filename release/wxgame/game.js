if ((typeof swan !== 'undefined') && (typeof swanGlobal !== 'undefined')) {
	require("swan-game-adapter.js");
	require("libs/laya.bdmini.js");
} else if (typeof wx!=="undefined") {
	require("weapp-adapter.js");
	require("libs/laya-4be6c19d68.wxmini.js");
}
window.loadLib = require;
require("index-f3547aa504.js");