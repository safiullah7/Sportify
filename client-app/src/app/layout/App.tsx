import React, { useEffect, Fragment, useContext } from 'react';
import { Container } from 'semantic-ui-react'
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite';

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);
  // to run this once and not infinitly to keep getting the data
  // when state changes, useEffect is called. So it will become infinite loop

  if (activityStore.loadingInitial)
    return <LoadingComponent content='Loading activities...'/>
  else
    return (
      <Fragment>
        <NavBar />
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard />
        </Container>
      </Fragment>
    );
}

export default observer(App);
