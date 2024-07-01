interface Incident {
  id: string;
  type: string;
  subType: string;
  location: string;
}

interface IncidentService {
  getIncident(id: string): Promise<Incident | undefined>;
}

class NoopIncidentService implements IncidentService {
  getIncident() {
    return Promise.resolve(undefined);
  }
}

class CentralPennIncidentService implements IncidentService {
  constructor(private readonly apiUrl: string) {
    if (!apiUrl) {
      throw new Error("apiUrl is required");
    }
  }

  async getIncident(id: string) {
    const response = await fetch(this.apiUrl);
    const incidents: Array<{
      id: string;
      location: string;
      type: string;
      subType: string;
    }> = await response.json();

    return incidents.find((incident) => incident.id === id);
  }
}

export const IncidentServiceFactory = {
  create(): IncidentService {
    const incidentUrl = Deno.env.get("IncidentsApi");

    return incidentUrl
      ? new CentralPennIncidentService(incidentUrl)
      : new NoopIncidentService();
  },
};
