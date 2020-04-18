using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }

        /*
            1. to introduce User (one) to UserActivity (many) relationship:
            2. to tell EF Core about the navigation property for lazy loading,
               we add 'virtual' keyword to them
        */
        public virtual ICollection<UserActivity> UserActivities {get; set;}
    }
}