import React from 'react'
import { AxiosResponse } from 'axios';
import { Message } from 'semantic-ui-react';

interface IProps {
    error: AxiosResponse,
    text?: string
}

const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
    return (
        <Message error>
            <Message.Header>{error.statusText}</Message.Header>

            {/* serverside validations return json like field a, b, c 
            etc.
            error.data.erros has that info. we need to flatten that t0 1 array
            to loop over all the indexes and print as Message.Lists */}

            {error.data && Object.keys(error.data.errors).length > 0 && (
                <Message.List>
                    {Object.values(error.data.errors).flat().map((err,i) => (
                        <Message.Item key={i}>{err}</Message.Item>
                    ))}
                </Message.List>
            )}


            {text && <Message.Content content={text} /> }
        </Message>
    )
}

export default ErrorMessage
