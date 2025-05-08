import { BaseView } from './base-view.js';

export class DeliveryView extends BaseView {
    constructor(id)
    {
        super(id);
        
        this.selectionView = this.element.querySelector('.item-grid');
        this.deliveryStatus = this.element.querySelector('#delivery-guide');
        this.deliveringView = this.element.querySelector('#delivering');
        this.deliveredView = this.element.querySelector('#delivered');

        this.buttons = this.element.querySelectorAll('.item');
    }

    bindButtonClick(callback) {
        Object.entries(this.buttons).forEach(([key, button]) => {
            button.addEventListener('click', () => 
                {
                    button.classList.add("selected");
                    callback(key);
                });
        });
    }

    showSelection(){
        this.selectionView.style.display = 'grid';
        // this.deliveringView.style.display = 'none';
        // this.deliveredView.style.display = 'none';
        this.deliveringView.classList.add('hidden');
        this.deliveredView.classList.add('hidden');
        this.deliveryStatus.innerHTML = 'Please select what you require to be delivered.';

        this.buttons.forEach(button => button.classList.remove("selected"));
    }

    showDelivering(){
        this.deliveryStatus.innerHTML = 'Please while your items are being delivered.';
        // this.selectionView.style.display = 'none';
        // this.deliveringView.style.display = 'flex';
        this.selectionView.classList.add('hidden');
        this.deliveringView.classList.remove('hidden');
    }

    showDelivered(){
        this.deliveryStatus.innerHTML = 'Items are delivered. Please check and confirm.';
        // this.deliveringView.style.display = 'none';
        // this.deliveredView.style.display = 'flex';
        this.deliveringView.classList.add('hidden');
        this.deliveredView.classList.remove('hidden');
    }
}