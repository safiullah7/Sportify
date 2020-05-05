import React from 'react'
import { List, Image, Popup } from 'semantic-ui-react';
import { IAttendee } from '../../../app/models/activity';

interface IProps {
    attendees: IAttendee[]
}

const styles = {
    borderColor: 'orange',
    borderWidth: 2
};

const ActivityListItemAttendees: React.FC<IProps> = ({attendees}) => {
    return (
        <List horizontal>
            {attendees.map((attendee) => (
                <List.Item key={attendee.username}>
                    <Popup
                        header={attendee.displayName}
                        trigger={
                            <Image circular size='mini' 
                                src={attendee.image || '/assets/user.png'} 
                                bordered style={attendee.following ? styles : null}
                            />
                        } />
                    {/* popup is just a hover. Images are shown. and upon hover, their 'Display Name'
                        will be shown in tooltip */}
                </List.Item>
            ))}
        </List>
    )
}

export default ActivityListItemAttendees
