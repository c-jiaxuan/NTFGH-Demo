
export class BasePageController {
    constructor(id, view) {
      this.id = id;
      this.view = view;
      this.isActive = false;

      this.intervals = [];
    }
  
    show() {
      this.view.show();
      this.onEnter();
    }
  
    hide() {
      this.clearAllIntervals();

      this.view.hide();
      this.onExit();
    }
    
    clearAllIntervals() {
      this.intervals.forEach(id => clearInterval(id));
      this.intervals = [];
    }
  
    onEnter() {
      // Optional: override in child
      this.isActive = true;
    }
  
    onExit() {
      // Optional: override in child
      this.isActive = false;
    }
  }