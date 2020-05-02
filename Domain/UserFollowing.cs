namespace Domain
{
    public class UserFollowing
    {
        /*
            1. An observer is one who follows a user. Target is the one who has followers
            2. Added Followers and Followings props in AppUser
            3. DataContext updated with builder code as well
            4. Handlers
        */
        public string ObserverId { get; set; }
        public virtual AppUser Observer { get; set; }
        public string TargetId { get; set; }
        public virtual AppUser Target { get; set; }
    }
}