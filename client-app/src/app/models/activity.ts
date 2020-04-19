export interface IActivity {
    id: string,
    title: string,
    description: string,
    category: string,
    date: Date,
    city: string,
    venue: string,
    isGoing: boolean, // specific to currentlyLoggedIn user
    isHost: boolean, // specific to currentlyLoggedIn user
    attendees: IAttendee[]
}

export interface IActivityFormValues extends Partial<IActivity> {
    time? : Date
}

export class ActivityFormValues implements IActivityFormValues {
    id?: string = undefined;
    title: string = '';
    description: string = '';
    category: string = '';
    date?: Date = undefined;
    time?: Date = undefined;
    city: string = '';
    venue: string = '';

    constructor(init? : IActivityFormValues) {
        if (init && init.date) {
            init.time = init.date;
        }
        Object.assign(this, init); // maps passed object values to class props 
    }
}

export interface IAttendee {
    username: string,
    displayName: string,
    image: string,
    isHost: boolean,
}