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
REACT_APP_TRIAL_USER_ID=TRIALUSERID
```

Then run the app

```
$ yarn start
```

# Release notes

## Aug 30

- add option to repeat a todo every day
- new icons
- only show delete button when editing a todo

## Aug 29

- Separate incomplete and completed todos

## Aug 28

- currently displayed date can now be changed one day at a time

## Aug 21

- enable anonymous app usage using a guest user

## Aug 16

- improve todo component: better handling of long titles and custom checkbox component
- update favicon, logos, title and meta tags

## Aug 15

- usable mobile view. For now it only displays current day

## Aug 13

- navbar is now white
- press enter to add a new todo after typing the title
- focus input automatically when adding a new todo