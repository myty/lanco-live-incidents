import IncidentsList from "components/incidents-list";
import React from "react";
import RefreshButton from "components/refresh-button";
import SettingsButton from "components/settings-button";
import useIncidents from "hooks/use-incidents";
import { useAppLayout } from "containers/app-layout";

const Home: React.FC = () => {
    const { loading, incidents, refresh } = useIncidents();

    useAppLayout(
        () => ({
            headerRight: (
                <>
                    <SettingsButton />
                    <RefreshButton
                        disabled={loading}
                        animate={loading}
                        onClick={refresh}
                    />
                </>
            ),
        }),
        [loading, refresh]
    );

    return (
        <div className="px-2 pt-2 text-xs overscroll-y-contain">
            <IncidentsList incidents={incidents} loading={loading} />
        </div>
    );
};

export default Home;
