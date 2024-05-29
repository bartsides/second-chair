using AutoMapper;
using SecondChair.Api.ViewModels;
using SecondChair.Api.Entities;
using Models = SecondChair.Api.ViewModels;

namespace SecondChair.Api.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Case, CaseDetails>();

            CreateMap<Case, CaseSummary>();

            CreateMap<Entities.Strikes, Models.Strikes>();
        }
    }
}
