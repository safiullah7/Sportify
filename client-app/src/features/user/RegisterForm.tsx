import React, { useContext } from 'react'
import {Form as FinalForm, Field} from 'react-final-form';
import { Form, Button, Header } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IUserFormValues } from '../../app/models/user';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';
import ErrorMessage from '../../app/common/form/ErrorMessage';

const validate = combineValidators({
    username: isRequired('username'),
    displayName: isRequired('display name'),
    email: isRequired('email'),
    password: isRequired('password')
});

const RegisterForm = () => {
    
    const rootStore = useContext(RootStoreContext);
    const {register} = rootStore.userStore;

    return (
        <FinalForm
        // form.getState() has a property hasSubmitErrors. to make it true upon error in API call
        // while logging in, we have to set it to true. [FORM_ERROR]: error will set it true
            onSubmit={(values: IUserFormValues) => register(values).catch((error) => ({
                [FORM_ERROR]: error
            }))}

            // validate={validate}

            render={({handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit}) => (
                // dirtySinceLastSubmit resets form errors to nothing after one submit

                <Form onSubmit={handleSubmit} error>

                    <Header as='h2' content='Sign up to Reactivities' color='teal' textAlign='center' />
                    
                    <Field 
                        component={TextInput} 
                        name='username' 
                        placeholder='Username' />
                    
                    <Field 
                        component={TextInput} 
                        name='displayName' 
                        placeholder='Display Name' />
                    
                    <Field 
                        component={TextInput} 
                        name='email' 
                        placeholder='Email' />
                    
                    <Field 
                        component={TextInput} 
                        name='password' 
                        placeholder='Password' 
                        type='password' />

                    {submitError && !dirtySinceLastSubmit && 
                        <ErrorMessage 
                            error={submitError} 
                            // text='Invalid email or password'
                        /> }

                    <Button color='teal' 
                        content='Register' 
                        disabled={invalid && !dirtySinceLastSubmit || pristine} 
                        loading={submitting}
                        fluid />
                </Form>
            )}
        />
    )
}

export default RegisterForm
