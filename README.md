# Lancaster County Live Incidents

Live Progressive Web App (PWA): https://lanco-live-incidents.netlify.app/

[![Netlify Status](https://api.netlify.com/api/v1/badges/a304cedd-afca-4827-a3bd-34b272c23ad3/deploy-status)](https://app.netlify.com/sites/lanco-live-incidents/deploys)

A jazzed-up version of [Lancaster County - Live Incident List](https://www.lcwc911.us/live-incident-list)

## The original concept

The original concept was inspired by an app that is only available on the iOS app store; and was first implemented in React Native and Azure Functions as a backend.  So far the frontend has been ported over as a full featured PWA.  The Azure Functions code will eventually find it's way to this repo.  Both the frontend and backend code are deployed automatically with any new commit to the main branch.

## How it was built

- Progressive Web App
- React
- Vite
- Tailwindcss
- Azure Functions - C# (coming soon)

## Want to run it yourself?

You'll need node, yarn, and a Google maps API key.

From a terminal run

```bash
touch src/lanco-incidents-app/.env.local
```

and inside that file 

```plain
VITE_GOOGLE_MAPS_KEY=<GOOGLE MAPS API KEY>
```

and then

```bash 
yarn dev
```
