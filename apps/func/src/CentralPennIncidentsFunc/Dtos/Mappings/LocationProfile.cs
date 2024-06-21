using AutoMapper;

namespace CentralPennIncidentsFunc.Dtos.Mappings;

public class LocationProfile : Profile
{
    public LocationProfile()
    {
        CreateMap<Models.LocationEntity, Location>()
            .ForMember(d => d.Lat, opt => opt.MapFrom(src => src.Lat_VC))
            .ForMember(d => d.Lng, opt => opt.MapFrom(src => src.Lng_VC));
    }
}
