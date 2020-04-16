import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react'
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, withRouter } from 'react-router-dom';
import { HomePage } from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import { RouteComponentProps, Switch } from 'react-router';
import NotFound from './NotFound';
import {ToastContainer} from 'react-toastify';
import LoginForm from '../../features/user/LoginForm';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
      <ToastContainer position='bottom-right' />
      <Route exact path='/' component={HomePage} />
      <Route path={'/(.+)'} render={() => (
        <Fragment>
          <NavBar />
          <Container style={{ marginTop: '7em' }}>
            <Switch>
              {/* <Switch> tells us that each route is exclusive and dont load any other route in
              some route */}
              <Route exact path='/activities' component={ActivityDashboard} />
              <Route path='/activities/:id' component={ActivityDetails} />
              <Route key={location.key} path={['/createActivity', '/manage/:id']}
                component={ActivityForm} />

              <Route path='/login' component={LoginForm} />

              <Route component={NotFound} />
              {/* // this will load <NotFound/> comp in every route.
              // need to make use of switch */}
            </Switch>
          </Container>
        </Fragment>
      )} />

    </Fragment>
  );
}

export default withRouter(observer(App));
