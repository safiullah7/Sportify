using System;

namespace Domain
{
    /*
        1. Create entity (this class).
        2. Create Dto class. Also create Mapping profile to map Comment and CommentDto
        3. Add Comments (CommentDto) as Collection in ActivityDto.cs
        4. Handler
        5. Startup > add service SignalR + give it a special endpoint in the Configure method
        6. SignalR Folder in API + ChatHub class. Derive from Hub. Since we need to Create comment, need Mediator as well
            i. Create Hub method that will be invoked from client
            ii. get username from hub context (but you need to make token available for hub context to get username)
            iii. mediator send to handler and get created 'comment' and send it back to all clients attached to this method
        7. to make token available, add new options of 'JwtBearerEvents' in 'AddJwtBearer' in startup
        8. Add 'AllowCredentials' in cors policy in startup class
    */
    public class Comment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }

        // adding virtual for ef lazy loading
        public virtual AppUser Author { get; set; }
        public virtual Activity Activity { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}