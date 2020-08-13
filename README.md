This project started as a clone of [Ryan Florence](https://twitter.com/ryanflorence)'s [Planner](https://planner.now.sh)
which I committed to building for 15 days (around an hour per day) as application of what I read in Clone Open Source Applications section
of Swyx's excellent book The Coding Career Handbook.

The app is hosted in Vercel at https://planner-pearl.vercel.app/

# Running

Create `.env.local` and add the following firebase credentials from your project settings page

```
REACT_APP_FIREBASE_API_KEY=APIKEY
REACT_APP_FIREBASE_AUTH_DOMAIN=AUTHDOMAIN
REACT_APP_FIREBASE_PROJECT_ID=PROJECTID
```

Then run the app

```
$ yarn start
```