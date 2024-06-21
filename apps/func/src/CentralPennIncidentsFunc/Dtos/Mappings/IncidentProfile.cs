using AutoMapper;

namespace LancoIncidentsFunc.Dtos.Mappings
{
    public class IncidentProfile : Profile
    {
        public IncidentProfile()
        {
            CreateMap<Models.Incident, Incident>()
                .ForMember(dst => dst.Id, opt => opt.MapFrom(src => src.GlobalId.Uid));
        }
    }
}
