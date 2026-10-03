import { useEffect } from 'react';
import { Icon, Map as LeafletMap, Marker, layerGroup } from 'leaflet';
import { BookingType, Coords } from '../../types/booking';
import { MapSetting } from '../../const/app-const';
import { BemBlock } from '../../const/template-const';

export type Location = {
  lat: number;
  lng: number;
};

const defaultCustomIcon = new Icon({
  iconUrl: MapSetting.Markers.DefaultMarker,
  iconSize: [27, 40],
  iconAnchor: [15, 40],
  shadowUrl: '',
});

const currentCustomIcon = new Icon({
  iconUrl: MapSetting.Markers.ActiveMarker,
  iconSize: [27, 40],
  iconAnchor: [15, 40],
  shadowUrl: '',
});

const adaptLocation = ([lat, lng]: Coords) => ({
  lat,
  lng,
  zoom: MapSetting.Zoom,
});

const useUpdateLocation = (map: LeafletMap | null, location: Location) => {
  useEffect(() => {
    if (map) {
      map.setView(location);
      const markerLayer = layerGroup().addTo(map);
      map.removeLayer(markerLayer);
    }
  });
};

const useUpdateMarkers = (
  map: LeafletMap | null,
  booking?: BookingType[],
  activeBooking?: BookingType,
  onClick?: (place: BookingType) => void,
  bemBlock?: string,
  coords?: Coords
) => {
  const isBooking = bemBlock === BemBlock.Map.Booking;

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);

      if (coords && !isBooking) {
        new Marker({
          lat: coords[0],
          lng: coords[1],
        })
          .setIcon(defaultCustomIcon)
          .addTo(markerLayer);
      }

      if (coords && activeBooking && onClick && booking && isBooking) {
        new Marker({
          lat: coords[0],
          lng: coords[1],
        })
          .setIcon(currentCustomIcon)
          .addTo(markerLayer);
        booking.forEach((place) => {
          const marker = new Marker({
            lat: place.location.coords[0],
            lng: place.location.coords[1],
          }).on('click', () => onClick(place));
          marker
            .setIcon(
              activeBooking.id && place.id === activeBooking.id
                ? currentCustomIcon
                : defaultCustomIcon
            )
            .addTo(markerLayer);
        });
      }

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, booking, activeBooking, coords, bemBlock, isBooking, onClick]);
};

export { adaptLocation, useUpdateLocation, useUpdateMarkers };
