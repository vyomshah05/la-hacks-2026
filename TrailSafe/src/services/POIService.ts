export interface POI {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'trail' | 'general';
  latitude: number;
  longitude: number;
  tags?: Record<string, string>;
}

class POIService {
  private OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
  private cache: Map<string, { data: POI[], timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private lastRequestTime = 0;
  private MIN_REQUEST_INTERVAL = 1000; // 1 second between requests
  private MAX_RESULTS_BY_TYPE: Record<POI['type'], number> = {
    hospital: 60,
    police: 60,
    trail: 120,
    general: 100,
  };

  async getHospitals(lat: number, lon: number, radiusKm: number): Promise<POI[]> {
    const query = this.buildBBoxQuery(lat, lon, radiusKm, 'node["amenity"="hospital"]');
    return this.executeQuery(query, 'hospital');
  }

  async getPoliceStations(lat: number, lon: number, radiusKm: number): Promise<POI[]> {
    const query = this.buildBBoxQuery(lat, lon, radiusKm, 'node["amenity"="police"]');
    return this.executeQuery(query, 'police');
  }

  async getTrails(lat: number, lon: number, radiusKm: number): Promise<POI[]> {
    const query = this.buildBBoxQuery(lat, lon, radiusKm, 'way["highway"~"path|track|footway"]');
    return this.executeQuery(query, 'trail');
  }

  async searchPOIs(lat: number, lon: number, radiusKm: number, searchTerm: string): Promise<POI[]> {
    // General search using name tag
    const query = `
      [out:json][timeout:25];
      (
        node["name"~"${searchTerm}", i](around:${radiusKm * 1000},${lat},${lon});
        way["name"~"${searchTerm}", i](around:${radiusKm * 1000},${lat},${lon});
      );
      out center;
    `;
    return this.executeQuery(query, 'general');
  }

  private buildBBoxQuery(lat: number, lon: number, radiusKm: number, filter: string): string {
    const bbox = this.calculateBoundingBox(lat, lon, radiusKm);
    return `
      [out:json][timeout:25];
      (
        ${filter}(${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
      );
      out center;
    `;
  }

  private calculateBoundingBox(
    centerLat: number,
    centerLon: number,
    radiusKm: number
  ): { minLat: number; maxLat: number; minLon: number; maxLon: number } {
    const R = 6371; // Earth's radius in km
    const latDelta = (radiusKm / R) * (180 / Math.PI);
    const lonDelta = (radiusKm / R) * (180 / Math.PI) / Math.cos(centerLat * Math.PI / 180);

    return {
      minLat: centerLat - latDelta,
      maxLat: centerLat + latDelta,
      minLon: centerLon - lonDelta,
      maxLon: centerLon + lonDelta,
    };
  }

  private async executeQuery(query: string, type: POI['type']): Promise<POI[]> {
    const cacheKey = `${type}_${query}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      await new Promise<void>(resolve => setTimeout(resolve, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }

    try {
      const response = await fetch(this.OVERPASS_API_URL, {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - wait and retry once
          await new Promise<void>(resolve => setTimeout(resolve, 2000));
          const retryResponse = await fetch(this.OVERPASS_API_URL, {
            method: 'POST',
            body: query,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          if (!retryResponse.ok) {
            throw new Error(`Overpass API rate limited. Please try again later.`);
          }
          const data = await retryResponse.json();
          const result = this.parseOverpassResponse(data, type);
          this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
          this.lastRequestTime = Date.now();
          return result;
        }
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data = await response.json();
      const result = this.parseOverpassResponse(data, type);
      
      // Cache the result
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      this.lastRequestTime = Date.now();
      
      return result;
    } catch (error) {
      console.error('Failed to execute Overpass query:', error);
      throw error;
    }
  }

  private parseOverpassResponse(data: any, type: POI['type']): POI[] {
    if (!data.elements) return [];

    const parsed = data.elements.map((element: any) => {
      const lat = element.lat || element.center?.lat;
      const lon = element.lon || element.center?.lon;
      const name = element.tags?.name || element.tags?.amenity || 'Unknown';

      return {
        id: element.id.toString(),
        name,
        type,
        latitude: lat,
        longitude: lon,
        tags: element.tags,
      };
    }).filter((poi: POI) => poi.latitude && poi.longitude);

    return parsed.slice(0, this.MAX_RESULTS_BY_TYPE[type]);
  }
}

export default new POIService();
