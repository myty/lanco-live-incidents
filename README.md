# Central Penn Incidents

Live Progressive Web App (PWA): <https://lanco.mytydev.com/>

![Vercel](https://vercelbadge.vercel.app/api/myty/lanco-live-incidents)

A jazzed-up version of [Lancaster County - Live Incident List](https://www.lcwc911.us/live-incident-list)
Now includes York incidents as well, hence the name change.

## The original concept

The original concept was inspired by an app that is only available on the iOS app store; and was first implemented in React Native and Azure Functions as a backend. So far the frontend has been ported over as a full featured PWA. The Azure Functions code will eventually find it's way to this repo. Both the frontend and backend code are deployed automatically with any new commit to the main branch.

## How it was built

- Progressive Web App
- React
- Vite
- Tailwindcss
- Azure Functions - C# (coming soon)

## Want to run it yourself?

You'll need node, pnpm, and a Google maps API key.

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
pnpm app:dev
```
