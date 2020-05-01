using System;

namespace Domain
{
    /*
        1. Create entity (this class).
        2. Create Dto class. Also create Mapping profile to map Comment and CommentDto
        3. Add Comments as Collection in ActivityDto.cs
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