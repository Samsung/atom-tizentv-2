var launchEmulatorApp = (function () {
	const common = require('./common');
	const logger = require('./logger');
	const path = require('path');
	var TVWebApp = require('@tizentv/webide-common-tizentv').TVWebApp;
    
	var moduleName = 'Run on TV Emulator';

	return {
		// Handle 'Run on TV Emulator' command
		handleCommand:async function(debugMode) {
			if (debugMode == undefined) {
				debugMode = false;
			}

			let workspacePath = common.getWorkspacePath();
			if (typeof(workspacePath) == 'undefined')
			{
				let noWorkspace = 'No project in workspace, please check and select your project!';
				logger.error(moduleName, noWorkspace);
				common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.ERROR, noWorkspace);
				return;
			}

			let projectName = '';
			let pathArray = workspacePath.split(path.sep);
			if (pathArray.length > 0) {
				projectName = projectName + pathArray[pathArray.length - 1];
			}

			let chromeExecPath = atom.config.get('atom-tizentv-2.tizentv.chromeExecutable');
			if (chromeExecPath == null) {
				logger.error(moduleName, 'Chrome Exec file is not config.');
			}

			let newApp = TVWebApp.openProject(workspacePath);
			if (newApp == null) {
				logger.error(moduleName, 'newApp is null.');
				return;
			}
			try {
				await newApp.launchOnEmulator(chromeExecPath, debugMode);
			} catch(err) {
				logger.error(moduleName, err);
				let commandFailMsg = 'Can not execute the command, please check your setting: Packages > Setting view > Open > Packages > search [atom-tizentv-2] > Settings';
				common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.ERROR, commandFailMsg);
				logger.error(moduleName, commandFailMsg);
			}
		}
	}
})(); 
module.exports = launchEmulatorApp; 
