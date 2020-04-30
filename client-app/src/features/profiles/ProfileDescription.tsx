import React, { useContext, useState, Fragment } from 'react'
import { Tab, Grid, Header, Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileEditForm from './ProfileEditForm';
import { observer } from 'mobx-react-lite';


const ProfileDescription = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        isCurrentUser,
        profile
    } = rootStore.profileStore;

    const [editMode, setEditMode] = useState(false);
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{ paddingBottom: 9 }}>
                    <Header floated='left' icon='user' content={`About ${profile!.displayName}`} />
                    {isCurrentUser && (
                        <Button onClick={() => setEditMode(!editMode)} floated='right'
                            basic content={editMode ? 'Cancel' : 'Edit Profile'} />
                    )}
                </Grid.Column>
            </Grid>

            <Grid>
                <Grid.Column width={16}>
                    {editMode ? (
                        <ProfileEditForm />
                    ) : (
                            <Fragment>
                                {profile!.bio}
                            </Fragment>
                        )}
                </Grid.Column>
            </Grid>

        </Tab.Pane>
    )
}

export default observer(ProfileDescription)
