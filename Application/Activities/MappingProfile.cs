using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    /*
        1. AutoMapper.Extension.Microsoft.DependencyInjection
        2. Startup.cs > add automapper in services
        3. List/Details.cs > IMapper in ctor, get the mapped object and return
        4. change return type in controller method as well
    */
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // below line will automatically map all the common props b/w these two
            CreateMap<Activity, ActivityDto>();

            // about the conflicting props, we'll create another Map
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}