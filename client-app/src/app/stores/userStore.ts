import { IUser, IUserFormValues } from './../models/user';
import { observable, computed, action } from "mobx";
import agent from '../api/agent';
import { RootStore } from './rootStore';

export default class UserStore {

    rootStore: RootStore

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable user: IUser | null = null;

    // if something is in the 'user' observable or something changes in it, 
    // then runs the computed property
    @computed get isLoggedIn() { return !!this.user }

    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);
            this.user = user;
        } catch(error) {
            console.log(error);
        }
    }

}