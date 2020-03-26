import React, {useState, FormEvent} from 'react'
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import {v4 as uuid} from 'uuid';

interface IProps {
    setEditMode: (editMode: Boolean) => void
    activity: IActivity,
    createActivity: (activity: IActivity) => void,
    editActivity: (activity: IActivity) => void
}

export const ActivityForm: React.FC<IProps> = 
    ({ setEditMode, activity: initalFormState, createActivity, editActivity }) => {

    const initializeForm = () => {
        if (initalFormState) {
            return initalFormState;
        } else {
            return {
                id: '',
                title: '',
                description: '',
                category: '',
                date: '',
                city: '',
                venue: '',
            }
        }
    };

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    };
    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value});
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input 
                    onChange={handleInputChange}
                    placeholder='Title'
                    name='title'
                    value={activity.title}/>
                <Form.TextArea rows={2} 
                    onChange={handleInputChange}
                    placeholder='Description' 
                    name='description'
                    value={activity.description}/>
                <Form.Input 
                    onChange={handleInputChange}
                    placeholder='Category'
                    name='category'
                    value={activity.category}/>
                <Form.Input 
                    onChange={handleInputChange}
                    type='datetime-local' 
                    name='date'
                    placeholder='Date' 
                    value={activity.date}/>
                <Form.Input 
                    onChange={handleInputChange}
                    placeholder='City'
                    name='city'
                    value={activity.city}/>
                <Form.Input 
                    onChange={handleInputChange}
                    placeholder='Venue'
                    name='venue'
                    value={activity.venue}/>
                
                <Button floated='right' positive type='submit' content='Submit' />
                <Button onClick={() => setEditMode(false)} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}