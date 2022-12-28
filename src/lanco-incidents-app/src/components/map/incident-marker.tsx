import React from "react";
import { DivMarker, DivMarkerProps } from "components/map/div-marker";
import { To, useLinkClickHandler } from "react-router-dom";
import { LeafletEventHandlerFnMap } from "leaflet";
import { useMap } from "react-leaflet";

interface IncidentMarkerProps
    extends Pick<DivMarkerProps, "html" | "position"> {
    to?: To;
}

export const IncidentMarker: React.FC<IncidentMarkerProps> = ({
    html,
    position,
    to,
}) => {
    const map = useMap();

    const handleClick = useLinkClickHandler(to ?? "", {
        replace: true,
    });

    const eventHandlers: LeafletEventHandlerFnMap | undefined =
        to == null
            ? undefined
            : {
                  click: (evt) => {
                      map.setView(evt.latlng, map.getZoom(), {
                          animate: true,
                      });

                      handleClick({
                          ...(evt as unknown as React.MouseEvent<
                              HTMLAnchorElement,
                              MouseEvent
                          >),
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
