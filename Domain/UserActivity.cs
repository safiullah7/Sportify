using System;

namespace Domain
{
    /*
        this class is for joining table between User - Activity. relationship b/w User - Activity
        is many to manay.
        after this joining table, relationship will be:
        AppUser (one) - (many) UserActivity (many) - (one) Activity

        1. This class
        2. Add ICollection in User and Activity class
        3. Add another DbSet in DbContext class
            a. OnModelCreating: Define the primary key of joining table
            b. OnModelCreating: Define the kind of relationship
        4. Create new Migration (API should be stopped)
    */
    public class UserActivity
    {
        public string AppUserId { get; set; }

        /*
            1. we wont see this below prop in joined table. EF is convention based, it recognizes
               that AppUserId is from AppUser table
            2. to tell EF Core about the navigation property for lazy loading,
               we add 'virtual' keyword to them
        */
        public virtual AppUser AppUser { get; set; }

        /*
            Same for this ActivityId and Activity prop here. Activity prop wont be in table
        */
        public Guid ActivityId { get; set; }

        /*
            1. to tell EF Core about the navigation property for lazy loading,
               we add 'virtual' keyword to them.
        */
        public virtual Activity Activity { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
    }
}