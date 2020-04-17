import { RootStore } from "./rootStore";
import { observable, action } from "mobx";

export default class ModalStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    // to tell mobx that dont observe this object in all nested levels
    // instead, just observe till object's 1st level. like open/body level tk
    @observable.shallow modal = {
        open: false,
        body: null
    }
    
    @action openModal = (content: any) => {
        this.modal.open = true;

        // content will be the component to be displayed in modal
        this.modal.body = content;
    }
    @action closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
    }
}