interface Incident {
  id: string;
  type: string;
  subType: string;
  location: string;
}

interface IncidentService {
  getIncident(id: string): Promise<Incident | undefined>;
}

class BaseIncidentService implements IncidentService {
  getIncident(id: string): Promise<Incident | undefined> {
    return Promise.reject(
      `Id, ${id} not found. No incident service configured.`,
    );
  }
}

class CentralPennIncidentService extends BaseIncidentService
  implements IncidentService {
  constructor(private readonly apiUrl: string) {
    super();
  }

  async getIncident(id: string) {
    if (!this.apiUrl) {
      return super.getIncident(id);
    }

    const response = await fetch(this.apiUrl);
    const incidents: Array<Incident> = await response.json();

    return incidents.find((incident) => incident.id === id);
  }
}

export const IncidentServiceFactory = {
  create(): IncidentService {
    const incidentUrl = Deno.env.get("INCIDENTS_API");

    return incidentUrl
      ? new CentralPennIncidentService(incidentUrl)
      : new BaseIncidentService();
  },
};
