import React, { useContext } from 'react'
import {Form as FinalForm, Field} from 'react-final-form';
import { Form, Button, Label } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IUserFormValues } from '../../app/models/user';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
});

const LoginForm = () => {
    
    const rootStore = useContext(RootStoreContext);
    const {login} = rootStore.userStore;

    return (
        <FinalForm
        // form.getState() has a property hasSubmitErrors. to make it true upon error in API call
        // while logging in, we have to set it to true. [FORM_ERROR]: error will set it true
            onSubmit={(values: IUserFormValues) => login(values).catch((error) => ({
                [FORM_ERROR]: error
            }))}
            validate={validate}
            render={({handleSubmit, submitting, form, submitError, invalid, pristine, dirtySinceLastSubmit}) => (
                // dirtySinceLastSubmit resets form errors to nothing after one submit
                <Form onSubmit={handleSubmit}>
                    <Field component={TextInput} name='email' placeholder='Email' />
                    <Field component={TextInput} name='password' placeholder='Password' type='password' />

                    {submitError && !dirtySinceLastSubmit && 
                        <Label basic color='red' content={submitError.statusText} />}
                    <br/>
                    <Button positive content='Login' 
                        disabled={invalid && !dirtySinceLastSubmit || pristine} 
                        loading={submitting} />
                    <pre>{JSON.stringify(form.getState(), null, 2)}</pre>
                </Form>
            )}
        />
    )
}

export default LoginForm
