import React, { useContext } from 'react'
import {Form as FinalForm, Field} from 'react-final-form';
import { Form, Button } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { observer } from 'mobx-react-lite';

const validate = combineValidators({
    displayName: isRequired('displayName'),
});

const ProfileEditForm = () => {
    
    const rootStore = useContext(RootStoreContext);
    const {
        EditProfile,
        profile
    } = rootStore.profileStore;

    return (
        <FinalForm
        // form.getState() has a property hasSubmitErrors. to make it true upon error in API call
        // while logging in, we have to set it to true. [FORM_ERROR]: error will set it true
            onSubmit={(values: any) => EditProfile(values).catch((error) => ({
                [FORM_ERROR]: error
            }))}

            validate={validate}

            initialValues={profile}

            render={({handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit}) => (
                // dirtySinceLastSubmit resets form errors to nothing after one submit

                <Form 
                    onSubmit={handleSubmit} error
                >
                    
                    <Field 
                        component={TextInput} 
                        name='displayName' 
                        placeholder='Display Name' 
                        rows={3}
                        value={profile!.displayName}
                    />
                    <Field 
                        component={TextAreaInput} 
                        name='bio' 
                        placeholder='Bio'
                        rows={3}
                        value={profile!.bio}
                    />

                    {submitError && !dirtySinceLastSubmit && 
                        <ErrorMessage 
                            error={submitError} 
                            text='Unable to update' 
                        /> }

                    <Button color='teal' 
                        content='Update Profile' 
                        disabled={invalid && !dirtySinceLastSubmit || pristine} 
                        loading={submitting}
                        floated='right'
                    />
                </Form>
            )}
        />
    )
}

export default observer(ProfileEditForm)
