import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Modal, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Circle, Marker, LocalTile, UrlTile, Region } from 'react-native-maps';
import OfflineManager, { DownloadedRegion } from '../services/OfflineManager';
import POIService, { POI } from '../services/POIService';

const RADIUS_KM = 10; // 10km radius
const MAX_VISIBLE_MARKERS = 120;
const DEFAULT_FALLBACK_LOCATION = {
  latitude: 34.0522, // Los Angeles
  longitude: -118.2437,
};

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [pois, setPOIs] = useState<POI[]>([]);
  const [isLoadingPOIs, setIsLoadingPOIs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'hospital' | 'police' | 'trail'>('all');
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [downloadedRegions, setDownloadedRegions] = useState<DownloadedRegion[]>([]);
  const [cacheSize, setCacheSize] = useState(0);
  const [hasCachedTiles, setHasCachedTiles] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        // Prefer a quick last-known fix so UI can render immediately.
        const lastKnown = await Location.getLastKnownPositionAsync().catch(() => null);

        // Get a fresh location, but avoid hanging indefinitely.
        const freshLocationPromise = Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }).catch((locationError) => {
          console.warn('Unable to fetch current position, falling back:', locationError);
          return null;
        });
        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 10000)
        );

        const freshLocation = await Promise.race([freshLocationPromise, timeoutPromise]);
        const resolvedCoords = freshLocation?.coords ?? lastKnown?.coords ?? DEFAULT_FALLBACK_LOCATION;

        setLocation({
          coords: {
            latitude: resolvedCoords.latitude,
            longitude: resolvedCoords.longitude,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });
        await refreshCachedTileStatus(resolvedCoords.latitude, resolvedCoords.longitude);
        loadPOIs(resolvedCoords.latitude, resolvedCoords.longitude);
      } catch (error) {
        console.error('Location initialization failed:', error);
        setErrorMsg('Unable to get your location right now. Please try again.');
      }
    })();
  }, []);

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadPOIs = async (lat: number, lon: number) => {
    setIsLoadingPOIs(true);
    try {
      const [hospitals, police, trails] = await Promise.all([
        POIService.getHospitals(lat, lon, RADIUS_KM),
        POIService.getPoliceStations(lat, lon, RADIUS_KM),
        POIService.getTrails(lat, lon, RADIUS_KM),
      ]);
      setPOIs([...hospitals, ...police, ...trails]);
    } catch (error) {
      console.error('Failed to load POIs:', error);
    } finally {
      setIsLoadingPOIs(false);
    }
  };

  const refreshCachedTileStatus = async (lat: number, lon: number) => {
    const hasTiles = await OfflineManager.hasCachedRegionForLocation(lat, lon);
    setHasCachedTiles(hasTiles);
  };

  const handleSearch = async () => {
    if (!location || !searchQuery.trim()) return;
    
    setIsLoadingPOIs(true);
    try {
      const results = await POIService.searchPOIs(
        location.coords.latitude,
        location.coords.longitude,
        RADIUS_KM,
        searchQuery
      );
      setPOIs(results);
    } catch (error) {
      console.error('Failed to search POIs:', error);
    } finally {
      setIsLoadingPOIs(false);
    }
  };

  const handleFilter = (filter: 'all' | 'hospital' | 'police' | 'trail') => {
    setActiveFilter(filter);
    if (!location) return;
    
    if (filter === 'all') {
      loadPOIs(location.coords.latitude, location.coords.longitude);
    } else if (filter === 'hospital') {
      POIService.getHospitals(location.coords.latitude, location.coords.longitude, RADIUS_KM)
        .then(setPOIs)
        .catch(console.error);
    } else if (filter === 'police') {
      POIService.getPoliceStations(location.coords.latitude, location.coords.longitude, RADIUS_KM)
        .then(setPOIs)
        .catch(console.error);
    } else if (filter === 'trail') {
      POIService.getTrails(location.coords.latitude, location.coords.longitude, RADIUS_KM)
        .then(setPOIs)
        .catch(console.error);
    }
  };

  const loadStorageInfo = async () => {
    const regions = await OfflineManager.getDownloadedRegions();
    const size = await OfflineManager.getCacheSize();
    setDownloadedRegions(regions);
    setCacheSize(size);
  };

  const handleOpenStorageModal = async () => {
    await loadStorageInfo();
    setShowStorageModal(true);
  };

  const handleDeleteRegion = async (regionId: string) => {
    try {
      await OfflineManager.deleteRegion(regionId);
      await loadStorageInfo();
      if (location) {
        await refreshCachedTileStatus(location.coords.latitude, location.coords.longitude);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete region');
    }
  };

  const handleClearAllCache = async () => {
    try {
      await OfflineManager.clearAllCache();
      await loadStorageInfo();
      setHasCachedTiles(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to clear cache');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownloadRegion = async () => {
    if (!location) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      await OfflineManager.downloadRegion(
        location.coords.latitude,
        location.coords.longitude,
        RADIUS_KM,
        (progress) => setDownloadProgress(progress)
      );
      await loadStorageInfo();
      await refreshCachedTileStatus(location.coords.latitude, location.coords.longitude);
      Alert.alert('Success', 'Region downloaded successfully!');
    } catch (error) {
      Alert.alert('Download failed', 'Failed to download region: ' + (error as Error).message);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const filteredPOIs = useMemo(() => (
    activeFilter === 'all'
      ? pois
      : pois.filter(poi => poi.type === activeFilter)
  ), [activeFilter, pois]);

  const visiblePOIs = useMemo(() => (
    filteredPOIs.slice(0, MAX_VISIBLE_MARKERS)
  ), [filteredPOIs]);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  const initialRegion: Region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        loadingEnabled
        moveOnMarkerPress={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          zIndex={1}
        />
        {hasCachedTiles && (
          <LocalTile
            pathTemplate={OfflineManager.getLocalTilePathTemplate()}
            tileSize={256}
            zIndex={2}
          />
        )}
        <Circle
          center={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
          radius={RADIUS_KM * 1000}
          strokeColor="#007AFF"
          fillColor="rgba(0, 122, 255, 0.15)"
        />
        {visiblePOIs.map((poi) => (
          <Marker
            key={poi.id}
            coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
            title={poi.name}
            description={poi.type}
            tracksViewChanges={false}
            pinColor={
              poi.type === 'hospital' ? 'red' :
              poi.type === 'police' ? 'blue' :
              poi.type === 'trail' ? 'green' : 'purple'
            }
          />
        ))}
      </MapView>
      
      <View style={styles.topBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search places..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={styles.filterContainer} showsHorizontalScrollIndicator={false}>
        {(['all', 'hospital', 'police', 'trail'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => handleFilter(filter)}
          >
            <Text style={[
              styles.filterChipText,
              activeFilter === filter && styles.filterChipTextActive,
            ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredPOIs.length > MAX_VISIBLE_MARKERS && (
        <View style={styles.markerNotice}>
          <Text style={styles.markerNoticeText}>
            Showing {MAX_VISIBLE_MARKERS} of {filteredPOIs.length} places for performance
          </Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.storageButton} onPress={handleOpenStorageModal}>
          <Text style={styles.buttonText}>Manage Storage</Text>
        </TouchableOpacity>
        {isDownloading ? (
          <View style={styles.downloadButton}>
            <Text style={styles.buttonText}>Downloading... {downloadProgress}%</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadRegion}>
            <Text style={styles.buttonText}>Download 10km Region</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showStorageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStorageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Storage Management</Text>
              <TouchableOpacity onPress={() => setShowStorageModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.storageInfo}>
              <Text style={styles.storageLabel}>Total Cache Size:</Text>
              <Text style={styles.storageValue}>{formatBytes(cacheSize)} / 500 MB</Text>
            </View>

            <ScrollView style={styles.regionsList}>
              {downloadedRegions.length === 0 ? (
                <Text style={styles.emptyText}>No downloaded regions</Text>
              ) : (
                downloadedRegions.map((region) => (
                  <View key={region.id} style={styles.regionItem}>
                    <View style={styles.regionInfo}>
                      <Text style={styles.regionTitle}>
                        {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
                      </Text>
                      <Text style={styles.regionSubtitle}>
                        {region.radiusKm}km radius • {formatBytes(region.size)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteRegion(region.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={handleClearAllCache}
            >
              <Text style={styles.clearAllButtonText}>Clear All Cache</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  filterContainer: {
    position: 'absolute',
    top: 110,
    left: 10,
    right: 10,
    paddingVertical: 10,
  },
  markerNotice: {
    position: 'absolute',
    top: 148,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  markerNoticeText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#333',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  storageButton: {
    backgroundColor: '#5856D6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    padding: 5,
  },
  storageInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  storageLabel: {
    fontSize: 14,
    color: '#666',
  },
  storageValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  regionsList: {
    maxHeight: 300,
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  regionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  regionInfo: {
    flex: 1,
  },
  regionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  regionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  clearAllButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
