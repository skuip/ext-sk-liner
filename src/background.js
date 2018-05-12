/* global chrome */

function changeSettings(tab) {
	chrome.tabs.executeScript(tab.id, {file: `content_script.js`});
}

chrome.browserAction.onClicked.addListener(changeSettings);
