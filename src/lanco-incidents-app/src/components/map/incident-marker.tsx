import type { LeafletEventHandlerFnMap } from "leaflet";
import { useMap } from "react-leaflet";
import { type To, useLinkClickHandler } from "react-router-dom";
import { DivMarker, type DivMarkerProps } from "./div-marker";

interface IncidentMarkerProps extends Pick<DivMarkerProps, "html" | "position"> {
  to?: To;
}

export const IncidentMarker: React.FC<IncidentMarkerProps> = ({ html, position, to }) => {
  const map = useMap();

  const handleClick = useLinkClickHandler(to ?? "", {
    replace: true,
  });

  const eventHandlers: LeafletEventHandlerFnMap | undefined =
    to == null
      ? undefined
      : {
          click: evt => {
            map.setView(evt.latlng, map.getZoom(), {
              animate: true,
            });

            handleClick({
              ...(evt as unknown as React.MouseEvent<HTMLAnchorElement, MouseEvent>),
              button: 0,
              preventDefault: () => {},
            } as React.MouseEvent<HTMLAnchorElement>);
          },
        };

  const props: DivMarkerProps = {
    position,
    html,
    eventHandlers,
  };

  return <DivMarker {...props} />;
};
