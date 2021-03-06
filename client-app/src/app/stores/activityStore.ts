import {observable, action, computed, runInAction} from 'mobx';
import { SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setActivityProps, createAttendee } from '../common/util/util';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';

export default class ActivityStore {

    rootStore: RootStore

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable activityRegistry = new Map();
    @observable loadingInitial = false;
    @observable activity: IActivity | null = null;
    @observable submitting = false;
    @observable target = '';
    @observable loading = false;
    @observable.ref hubConnection: HubConnection | null = null;
    // ref: we wont observing whole ChatHub class, but its only one method. so using ref for that


    // we will create a connection ONLY when activity is opened in details view (activitydetails).
    // we have to stop connection when we move away from the activity details view
    @action createHubConnection = (activityId: string) => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/chat', {
                accessTokenFactory: () => this.rootStore.commonStore.token!
                // since it is not an http request we're sending, we need to send our token with hub request as well
                // so that server can identify the token and get the username out of it 
            })
            .configureLogging(LogLevel.Information)
            .build();
        
        this.hubConnection.start()
            .then(() => console.log(this.hubConnection!.state))
            .then(() => {
                console.log('attempting to join the group');
                if (this.hubConnection!.state === 'Connected')
                    this.hubConnection!.invoke('AddToGroup', activityId);
            })
            .catch((error) => console.log('Error establishing connection: ' + error));

        this.hubConnection.on('ReceiveComment', comment => {
            runInAction(() => {
                this.activity!.comments.push(comment);
            })
        });
        this.hubConnection.on('Send', message => {
            toast.info(message);
        })
    }

    @action stopHubConnection = () => {
        this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id)
            .then(() => {
                this.hubConnection!.stop();
            })
            .then(() => console.log('connection stopped'))
            .catch((error) => console.log(error));
    }

    @action addComment = async (values: any) => {
        values.activityId = this.activity!.id;
        try {
            await this.hubConnection!.invoke('SendComment', values);
        } catch(error) {
            console.log(error);
        }
    }

    @computed get activitiesByDate() {
        console.log(this.groupActivitiesByDate(Array.from(this.activityRegistry.values())));
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime());
        return Object.entries(sortedActivities.reduce(
            (activities, activity) => {
                const date = activity.date.toISOString().split('T')[0];
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
                // we want something like this:
                // indexes=> key: id of activity, value: activity or activities (based on filter, like on same date)
        }, {} as {[key: string]: IActivity[]} ));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            let activities = await agent.Activities.list();
            runInAction('loading activities', () => {
                activities.forEach(activity => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activityRegistry.set(activity.id, activity);
                    });
                this.loadingInitial = false;
            })
        } catch (error) {
            runInAction('load activities error', () => {
                this.loadingInitial = false;
            })
            console.log(error);
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('getting activity', () => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })
                return activity;
            } catch (error) {
                runInAction('getting activity error', () => {
                    this.loadingInitial = false;
                })
                // throw error; // catch in activitydetails comp
                console.log(error);
            }
        }
    }

    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity(id: string) {
        return this.activityRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            const attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.comments = [];
            activity.isGoing = true;

            // above code isnt in runinaction because it doesnt involve an observable or action method
            runInAction('creating activity',() => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            })
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            runInAction('create activity error', () => {
                this.submitting = false;
            })
            //this.editMode = false;
            toast.error('Problem submitting data');
            console.log(error.response);
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            })
            history.push(`/activities/${activity.id}`)            
        } catch(error) {
            runInAction('edit activity error', () => {
                this.submitting = false;
            })
            toast.error('Problem submitting data');
            console.log(error.response);
        }
    }

    @action deleteActivity = async (event:SyntheticEvent<HTMLButtonElement>,id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('deleting activity', () => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            })
        } catch(error) {
            runInAction('delete activity error', () => {
                this.submitting = false;
                this.target = '';
            })
            console.log(error);
        }
    }

    @action attendActivity = async () => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try {
            await agent.Activities.attend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch(error) {
            runInAction(() => {
                this.loading = false;
            })
            toast.error('Problem signing up to the activity');
        }
        
    }

    @action cancelAttendance = async () => {
        this.loading = true;
        try {
            await agent.Activities.unattend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees = this.activity.attendees.filter(x => 
                        x.username !== this.rootStore.userStore.user!.username);
                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch(error) {
            runInAction(() => {
                this.loading = false;
            })
            toast.error('Problem cancelling attendance');
        }
    }
}
