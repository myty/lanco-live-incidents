import Layout from "components/layout";
import IncidentsList from "components/incidents-list";
import useIncidents from "hooks/use-incidents";
import React from "react";
import { SITE_TITLE } from "constants/app-constants";

interface HomeProps {}

export default function Home(props: HomeProps) {
    const { incidents, loading, refresh } = useIncidents();

    const rotateClass = loading ? "animate-reverse-spin" : "";

    const refreshButton = (
        <button
            className="w-6 text-xs font-semibold text-white bg-blue-900 hover:text-blue-100"
            onClick={refresh}
            disabled={loading}>
            <svg
                className={`${rotateClass}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
            </svg>
        </button>
    );

    return (
        <Layout headerLeft={SITE_TITLE} headerRight={refreshButton}>
            <div className="p-3">
                <IncidentsList incidents={incidents} />
            </div>
        </Layout>
    );
}
