using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController] 
    /* 
    Benefits of [ApiController] :
    1:
        this checks before-hand whether passed object fulfil data anotations or not
        if we skip this, then we'll have to do something like:
        if (!ModelState.isValid)
            return BadRequestObjectResult(ModelState)
    2:
        without it, in create method, we'll have to tell in paramters that you should get the data
        from the body:
        public async Task<ActionResult<Unit>> Create([FromBody]Create.Command command)
        using [ApiController], we dont need to do so. 
    */
    public class BaseController : ControllerBase
    {
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ?? 
            (_mediator = HttpContext.RequestServices.GetService<IMediator>());
    }
}