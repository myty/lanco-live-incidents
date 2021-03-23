using AutoMapper;

namespace LancoIncidentsFunc.Dtos.Mappings
{
    public class IncidentProfile : Profile
    {
        public IncidentProfile()
        {
            CreateMap<Models.Incident, Incident>();
        }
    }
}
