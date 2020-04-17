import React, { useState, useContext, useEffect } from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import { Form as FinalForm, Field } from 'react-final-form'
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import {combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';

const validate = combineValidators({
    title: isRequired({message: 'The event title is required'}),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time'),
})

interface DetailParams {
    id: string
}
const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
    match,
    history
}) => {

    const rootStore = useContext(RootStoreContext);
    const {
        createActivity,
        submitting,
        editActivity,
        loadActivity
    } = rootStore.activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id)
                .then((activity) => setActivity(new ActivityFormValues(activity)))
                .finally(() => setLoading(false));
        }
    }, [loadActivity, match.params.id])
    // [] means run once. adding dependencies in this array (which are being used in useEffect)

    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateAndTime;
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        validate={validate}
                        initialValues={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit, invalid, pristine }) => ( 
                            // invalid: to stop user from submitting if invalid inputs
                            // for edit activity, if user hasnt changed anything from existing data, button disabled
                            <Form onSubmit={handleSubmit} loading={loading} >
                                {/* <Form.Input 
                                    onChange={handleInputChange} */}
                                <Field
                                    placeholder='Title'
                                    name='title'
                                    value={activity.title}
                                    component={TextInput}
                                />
                                <Field
                                    //rows={2} 
                                    placeholder='Description'
                                    name='description'
                                    rows={3}
                                    value={activity.description}
                                    component={TextAreaInput}
                                />
                                <Field
                                    component={SelectInput}
                                    placeholder='Category'
                                    name='category'
                                    options={category}
                                    value={activity.category} />
                                <Form.Group widths='equal'>
                                    <Field
                                        component={DateInput}
                                        name='date'
                                        date={true}
                                        placeholder='Date'
                                        value={activity.date}
                                    />
                                    <Field
                                        component={DateInput}
                                        name='time'
                                        time={true}
                                        placeholder='Time'
                                        value={activity.date}
                                    />
                                </Form.Group>
                                <Field
                                    component={TextInput}
                                    placeholder='City'
                                    name='city'
                                    value={activity.city} />
                                <Field
                                    component={TextInput}
                                    placeholder='Venue'
                                    name='venue'
                                    value={activity.venue} />

                                <Button loading={submitting} floated='right' positive
                                    type='submit' content='Submit' disabled={loading || invalid || pristine} />
                                <Button floated='right' type='button' content='Cancel' disabled={loading}
                                    onClick={ activity.id 
                                                ? () => history.push(`/activities/${activity.id}`) 
                                                : () => history.push('/activities')}  />
                            </Form>
                        )} />

                </Segment>
            </Grid.Column>
        </Grid>

    )
}

export default observer(ActivityForm);