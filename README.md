# react-mapbox-playground

![react-mapbox-playground vercel app_](https://github.com/ipod1g/react-mapbox-playground/assets/105120582/89f5b6c8-3cba-499a-9f95-cf5cb424a0b8)


Try the [Demo](https://react-mapbox-playground.vercel.app/) !

- A simple test on integrating map directions with api retries
- Works on both desktop and mobile devices!

Time spent coding: **~3 days**
## 👁️ Instruction

- You will get different responses from the backend everytime you try to get route.
- DO NOT WORRY if you get `Internal Server Error`, this app is made to test api retries and show different user interfaces depending on the response status.

### Reminder
- Currently it is connected to a mock server to provide the `waypoints`, therefore we will always get the same waypoints no matter our destination
- However, the route service is connected to the actual `mapbox` directions api, so if we change the mock server to return other array of paths/waypoints, it will show accordingly
---

##  Tech stack

- Application: `react` & `typescript` & `vite`
- API layer: `axios`
- Map: `mapbox`
- Styling: `tailwindcss`
- Deployment: `vercel`
- Testing: `React Testing Library` & `jest` & `vitest`
- Other: `eslint`

## Project Structure

Most of the code lives in the `src` folder and looks like this

<details open>

<summary><b>File Structure</b></summary>
<br/>

```sh
src
|
+-- apis              # apis for each feature
|   |    
|   +-- map.tsx
|
+-- components         
|   |       
|   +-- RouteForm.tsx
|   +-- RouteForm.test.tsx           
|   +-- ...
|
+-- config            # base configuration files for each feature
|
+-- context           # context provider and reducer
|
+-- lib               # re-exporting different libraries preconfigured for the application
|
+-- test              # stores test setup
|
+-- types             # base types used across the application
|
+-- utils             # shared utility functions
```

</details>

## 🌐 How to deploy locally

### Environment

- Node.js >= 18
- pnpm >= 8

Setup the following environment variables and run with `pnpm run dev` (recommended)

> `.env`

```
MAPBOX_ACCESS_TOKEN = "your mapbox url"
API_URL = "your backend api url"
```

### Starting it up

> terminal

```bash
pnpm install
pnpm run dev
```

### Testing

```bash
pnpm run test
```

