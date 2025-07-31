import { BasePageController } from './base-page-controller.js';
import { MainMenuView } from '../view/main-menu-view.js';
import { EventBus, Events } from '../event-bus.js';
import { appSettings } from '../config/appSettings.js';
import { send } from '../client.js'

export class MainMenuPageController extends BasePageController {
	constructor(id){
		const view = new MainMenuView(id);
		super(id, view);

		this.view.setLanguage(appSettings.language);

		this.view.bindButtonClick(this.handleSubpageSwitch.bind(this));

		EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })

		this.isTranscribeActive = false;
	}

	//Handle events for language and input mode 
	onUpdateLanguage(language){
		//update view to new language
		this.view.setLanguage(language);
	}

	handleSubpageSwitch(key) {
		switch (key){
		case "chat":
			EventBus.emit(Events.CHATBOT_PRESS);
			break;
		case "text2Img":
			EventBus.emit(Events.TEXT2IMG_PRESS);
			break;
		case "text2Vid":
			EventBus.emit(Events.TEXT2VID_PRESS);
			break;
		case "img2Vid":
			EventBus.emit(Events.GETTING_START_PRESS);
			break;
		}
	}

	onEnter() {
		super.onEnter();
		console.log('Main Menu page initialized');
		// Run animations, load data, start timers, etc.
		this.view.setLanguage(appSettings.language);
		send('DEFAULT');
	}

	onExit() {
		super.onExit();
		console.log('Leaving Main Menu page');
		// Cleanup, stop audio, etc.
	}
}