import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import { ActivityDetailedInfo } from './ActivityDetailedInfo';
import { ActivityDetailedChat } from './ActivityDetailedChat';
import { RootStoreContext } from '../../../app/stores/rootStore';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

interface DetailParams {
    id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({ 
    match
 }) => {

    const rootStore = useContext(RootStoreContext);
    const { 
        activity,
        loadActivity, 
        loadingInitial 
    } = rootStore.activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
        // .catch(() => {
        //     history.push('/notfound'); //anythingBecauseItllGoToNotFoundPage
        // });
    }, [loadActivity, match.params.id]) // if we dont put second param, it'll run after every time component mounts
    // if we put second param, it ensures that it runs once only after component mounts

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    else if (!activity) return <h1>Activity Not found</h1>

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity} />
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar attendees={activity.attendees} />
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDetails);
