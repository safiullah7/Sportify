import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<string, HTMLTextAreaElement>, FormFieldProps {}

const TextAreaInput: React.FC<IProps> = ({
    input,
    width,
    rows,
    placeholder,
    meta: {
        touched,
        error
    }
}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
            <textarea rows={rows} {...input} placeholder={placeholder} />
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

export default TextAreaInput
