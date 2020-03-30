import {observable, action} from 'mobx';
import { createContext } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

class ActivityStore {
    @observable activities: IActivity[] = [];
    @observable loadingInitial = false;
    @observable selectedActivity: IActivity | undefined;
    @observable editMode = false;
    @observable submitting = false;

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            let activities = await agent.Activities.list();
            activities.forEach(activity => {
                activity.date = activity.date.split('.')[0];
                this.activities.push(activity);
                });
            this.loadingInitial = false;
        } catch (error) {
            this.loadingInitial = false;
            console.log(error);
        }
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            debugger;
            await agent.Activities.create(activity);
            this.activities.push(activity);
            //this.selectedActivity = activity;
            this.editMode = false;
            this.submitting = false;
        } catch (error) {
            //this.editMode = false;
            this.submitting = false;
            console.log(error);
        }
    }

    @action openCreateForm = () => {
        this.selectedActivity = undefined;
        this.editMode = true;
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activities.find(a => a.id === id);
        this.editMode = false;
    } 
}

export default createContext(new ActivityStore());