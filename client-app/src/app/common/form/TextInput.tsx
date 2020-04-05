import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<string, HTMLInputElement>, FormFieldProps {}
/*
it was initially FieldRenderProps<string, HTMLInputElement> but it caused error due to
new version of react-final-form
as a workaround, downgrading using npm install react-final-form@6.3.0 which worked

another workaround would be to :
    1. Replace HTMLInputElement with HTMLElement in any FieldRenderProps<,>
    2. Remove ...rest and { ...rest} in DateInput component
*/
const TextInput: React.FC<IProps> = ({
    input,
    width,
    type,
    placeholder,
    meta: {
        touched,
        error
    }
}) => {
    return (
        <Form.Field error={touched && !!error} type={type} width={width}>
            <input {...input} placeholder={placeholder} />
            {/* {...input} means all the blur, touch handlers we're getting, 
            pass them to this */}

            {touched && error && (
                <Label basic color='red'>
                    {error}
                </Label>
            )}
        </Form.Field>
    )
}

export default TextInput
