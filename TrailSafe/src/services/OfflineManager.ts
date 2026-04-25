import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

const MAX_CACHE_SIZE = 500 * 1024 * 1024; // 500MB
const REGIONS_STORAGE_KEY = '@trailsafe_downloaded_regions';
const TILE_CACHE_DIR = `${FileSystem.documentDirectory}tile-cache/`;
const MIN_ZOOM = 12;
const MAX_ZOOM = 14;

export interface DownloadedRegion {
  id: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  timestamp: number;
  size: number;
  tileCount: number;
  tileDir: string;
}

class OfflineManager {
  private regions: DownloadedRegion[] = [];
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    try {
      const raw = await AsyncStorage.getItem(REGIONS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.regions = parsed as DownloadedRegion[];
        }
      }
    } catch (error) {
      console.error('Failed to load cached regions:', error);
      this.regions = [];
    } finally {
      this.initialized = true;
    }
  }

  private async persistRegions(): Promise<void> {
    await AsyncStorage.setItem(REGIONS_STORAGE_KEY, JSON.stringify(this.regions));
  }

  async downloadRegion(
    latitude: number,
    longitude: number,
    radiusKm: number,
    onProgress?: (progress: number) => void
  ): Promise<boolean> {
    await this.ensureInitialized();

    try {
      const regionId = `${latitude.toFixed(4)}_${longitude.toFixed(4)}_${radiusKm}`;
      const tileUrls = this.getTileUrls(latitude, longitude, radiusKm);
      const tileCount = tileUrls.length;
      const estimatedSize = tileCount * 50 * 1024; // ~50KB per tile

      // Check if we have enough space
      const currentSize = await this.getCacheSize();
      if (currentSize + estimatedSize > MAX_CACHE_SIZE) {
        throw new Error('Not enough storage space. Please delete some regions first.');
      }

      await this.ensureTileCacheDir();
      const existingRegion = this.regions.find(region => region.id === regionId);
      if (existingRegion) {
        await this.deleteTileDirectory(existingRegion.tileDir);
      }

      const tileDir = `${TILE_CACHE_DIR}${regionId}/`;
      let completed = 0;

      for (const tile of tileUrls) {
        const tilePath = `${tileDir}${tile.z}/${tile.x}/${tile.y}.png`;
        await this.ensureParentDir(tilePath);

        try {
          await FileSystem.downloadAsync(tile.url, tilePath);
        } catch (error) {
          console.warn('Failed to download tile:', tile.url, error);
        }

        completed += 1;
        onProgress?.(Math.round((completed / tileCount) * 100));
      }

      const regionSize = await this.calculateDirectorySize(tileDir);
      const region: DownloadedRegion = {
        id: regionId,
        latitude,
        longitude,
        radiusKm,
        timestamp: Date.now(),
        size: regionSize,
        tileCount,
        tileDir,
      };

      await this.saveRegionMetadata(region);
      
      return true;
    } catch (error) {
      console.error('Failed to download region:', error);
      throw error;
    }
  }

  private estimateTileCount(
    centerLat: number,
    centerLon: number,
    radiusKm: number,
    zoomLevel: number
  ): number {
    const R = 6371; // Earth's radius in km
    const latDelta = (radiusKm / R) * (180 / Math.PI);
    const lonDelta = (radiusKm / R) * (180 / Math.PI) / Math.cos(centerLat * Math.PI / 180);
    
    const tilesAtZoom = Math.pow(2, zoomLevel);
    const latFraction = (latDelta * 2) / 180;
    const lonFraction = (lonDelta * 2) / 360;
    return Math.ceil(tilesAtZoom * latFraction * tilesAtZoom * lonFraction);
  }

  private getTileUrls(
    centerLat: number,
    centerLon: number,
    radiusKm: number
  ): Array<{ z: number; x: number; y: number; url: string }> {
    const bbox = this.calculateBoundingBox(centerLat, centerLon, radiusKm);
    const tiles: Array<{ z: number; x: number; y: number; url: string }> = [];

    for (let z = MIN_ZOOM; z <= MAX_ZOOM; z += 1) {
      const xMin = this.lonToTileX(bbox.minLon, z);
      const xMax = this.lonToTileX(bbox.maxLon, z);
      const yMin = this.latToTileY(bbox.maxLat, z);
      const yMax = this.latToTileY(bbox.minLat, z);

      for (let x = xMin; x <= xMax; x += 1) {
        for (let y = yMin; y <= yMax; y += 1) {
          tiles.push({
            z,
            x,
            y,
            url: `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
          });
        }
      }
    }

    return tiles;
  }

  private calculateBoundingBox(
    centerLat: number,
    centerLon: number,
    radiusKm: number
  ): { minLat: number; maxLat: number; minLon: number; maxLon: number } {
    const R = 6371;
    const latDelta = (radiusKm / R) * (180 / Math.PI);
    const lonDelta = (radiusKm / R) * (180 / Math.PI) / Math.cos(centerLat * Math.PI / 180);

    return {
      minLat: centerLat - latDelta,
      maxLat: centerLat + latDelta,
      minLon: centerLon - lonDelta,
      maxLon: centerLon + lonDelta,
    };
  }

  private lonToTileX(lon: number, zoom: number): number {
    const maxTile = Math.pow(2, zoom) - 1;
    return Math.max(0, Math.min(maxTile, Math.floor(((lon + 180) / 360) * Math.pow(2, zoom))));
  }

  private latToTileY(lat: number, zoom: number): number {
    const maxTile = Math.pow(2, zoom) - 1;
    const latRad = (lat * Math.PI) / 180;
    const n = Math.pow(2, zoom);
    const value = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
    return Math.max(0, Math.min(maxTile, value));
  }

  private async ensureTileCacheDir(): Promise<void> {
    const info = await FileSystem.getInfoAsync(TILE_CACHE_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(TILE_CACHE_DIR, { intermediates: true });
    }
  }

  private async ensureParentDir(filePath: string): Promise<void> {
    const parent = filePath.substring(0, filePath.lastIndexOf('/'));
    await FileSystem.makeDirectoryAsync(parent, { intermediates: true });
  }

  private async calculateDirectorySize(baseDir: string): Promise<number> {
    const info = await FileSystem.getInfoAsync(baseDir);
    if (!info.exists) return 0;

    const entries = await FileSystem.readDirectoryAsync(baseDir);
    let total = 0;

    for (const entry of entries) {
      const entryPath = `${baseDir}${entry}`;
      const entryInfo = await FileSystem.getInfoAsync(entryPath);

      if (!entryInfo.exists) continue;
      if (entryInfo.isDirectory) {
        total += await this.calculateDirectorySize(`${entryPath}/`);
      } else if (typeof entryInfo.size === 'number') {
        total += entryInfo.size;
      }
    }

    return total;
  }

  private async deleteTileDirectory(directory: string): Promise<void> {
    const info = await FileSystem.getInfoAsync(directory);
    if (info.exists) {
      await FileSystem.deleteAsync(directory, { idempotent: true });
    }
  }

  private getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async getCacheSize(): Promise<number> {
    await this.ensureInitialized();
    return this.regions.reduce((total, region) => total + region.size, 0);
  }

  async getDownloadedRegions(): Promise<DownloadedRegion[]> {
    await this.ensureInitialized();
    return [...this.regions];
  }

  async hasCachedRegionForLocation(latitude: number, longitude: number): Promise<boolean> {
    await this.ensureInitialized();
    return this.regions.some(region => {
      const distance = this.getDistanceKm(latitude, longitude, region.latitude, region.longitude);
      return distance <= region.radiusKm;
    });
  }

  getLocalTilePathTemplate(): string {
    return `${TILE_CACHE_DIR}{z}/{x}/{y}.png`;
  }

  private async saveRegionMetadata(region: DownloadedRegion): Promise<void> {
    const existingIndex = this.regions.findIndex(r => r.id === region.id);
    
    if (existingIndex >= 0) {
      this.regions[existingIndex] = region;
    } else {
      this.regions.push(region);
    }
    await this.persistRegions();
  }

  async deleteRegion(regionId: string): Promise<void> {
    await this.ensureInitialized();
    const region = this.regions.find(r => r.id === regionId);
    if (region) {
      await this.deleteTileDirectory(region.tileDir);
    }
    this.regions = this.regions.filter(r => r.id !== regionId);
    await this.persistRegions();
  }

  async clearAllCache(): Promise<void> {
    await this.ensureInitialized();
    await this.deleteTileDirectory(TILE_CACHE_DIR);
    this.regions = [];
    await this.persistRegions();
  }
}

export default new OfflineManager();
