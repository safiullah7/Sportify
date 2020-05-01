using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; }
            // need username here because it'll be a signalR request and web sockets and not usual Http 
            // request, from where we can use IUserAccessor and get username from. so need username here
        }
        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            async Task<CommentDto> IRequestHandler<Command, CommentDto>.Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);
                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new {Activity = "Not found"});
                
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new Comment 
                {
                    Body = request.Body,
                    Author = user,
                    Activity = activity,
                    CreatedAt = DateTime.Now
                };
                activity.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<CommentDto>(comment);
                throw new Exception("Problem saving activity");
            }
        }
    }
}