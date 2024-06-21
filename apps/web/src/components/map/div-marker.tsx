import { type EventedProps, createElementObject, createLayerComponent, extendContext } from "@react-leaflet/core";
import { DivIcon as LeafletDivIcon, type LatLngExpression, Marker as LeafletMarker, type MarkerOptions } from "leaflet";

export interface DivMarkerProps extends Omit<MarkerOptions, "icon" | "children">, EventedProps {
  html: string;
  position: LatLngExpression;
}

export const DivMarker = createLayerComponent<LeafletMarker, DivMarkerProps>(
  function createMarker({ position, html, ...options }, ctx) {
    const leafletDivIcon = new LeafletDivIcon({
      className: "",
      html,
    });

    const marker = new LeafletMarker(position, {
      ...options,
      icon: leafletDivIcon,
    });

    return createElementObject(marker, extendContext(ctx, { overlayContainer: marker }));
  },

  function updateDivIcon(divIcon, props, prevProps) {
    if (props.position !== prevProps.position) {
      divIcon.setLatLng(props.position);
    }
    if (props.html !== prevProps.html) {
      const leafletDivIcon = new LeafletDivIcon({
        className: "",
        html: props.html,
      });

      divIcon.setIcon(leafletDivIcon);
    }
    if (props.zIndexOffset != null && props.zIndexOffset !== prevProps.zIndexOffset) {
      divIcon.setZIndexOffset(props.zIndexOffset);
    }
    if (props.opacity != null && props.opacity !== prevProps.opacity) {
      divIcon.setOpacity(props.opacity);
    }
    if (divIcon.dragging != null && props.draggable !== prevProps.draggable) {
      if (props.draggable === true) {
        divIcon.dragging.enable();
      } else {
        divIcon.dragging.disable();
      }
    }
  }
);
