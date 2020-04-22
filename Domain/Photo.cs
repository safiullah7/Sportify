namespace Domain
{
    public class Photo
    {
        /*
            1. Created a separate entity
            2. Added it as a Collection in AppUser to represent one to many relationship with user.
            3. Added it in DataContext class to CRUD in this table using EF.
            4. New Migration after that
        */
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
    }
}