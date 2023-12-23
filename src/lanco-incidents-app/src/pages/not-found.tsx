import PageTitle from "components/page-title";
import { useAppLayout } from "containers/app-layout";
import React from "react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();
  const handleGoBack = () => navigate("/", { replace: true });

  useAppLayout(
    () => ({
      pageBgStyle: "bg-white",
      headerLeft: <PageTitle onBack={handleGoBack}>Not Found</PageTitle>,
    }),
    []
  );

  return (
    <>
      <div className="grid h-full grid-cols-1 place-content-center">
        <p className="px-10 text-center">Page not found.</p>
      </div>
    </>
  );
}
