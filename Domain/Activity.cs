using System;
using System.Collections.Generic;

namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }


        /*
            1. to introduce UserActivity (many) to Activity (one) relationship:
            2. to tell EF Core about the navigation property for lazy loading,
               we add 'virtual' keyword to them
        */
        public virtual ICollection<UserActivity> UserActivities { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
    }
}