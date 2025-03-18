# Weather App

## A Weather Web App built using Vue and Nuxt 3

You can see and use the live version [here](https://tms-weather-app.netlify.app/)

## Technologies

- Vue 3 <img width="20" height="20" alt="Vue" src="https://vuejsbr-docs-next.netlify.app/logo.png">

- Nuxt 3 <img width="20" height="20" alt="Nuxt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Nuxt_logo.svg/512px-Nuxt_logo.svg.png">

- Sass <img width="20" height="20" alt="Sass" src="https://sass-lang.com/assets/img/styleguide/seal-color.png">

- Pinia <img width="20" height="20" alt="Pinia" src="https://pinia-docs-pt.netlify.app/logo.svg">

- Open Weather Map API <img width="20" height="20" alt="Open Weather Map API" src="https://avatars.githubusercontent.com/u/1743227?s=200&v=4">

- Netlify <img width="20" height="20" alt="Netlify" src="https://cdn.worldvectorlogo.com/logos/netlify.svg">

## Running the project 

To run this Project, you need to use **Node.js** 20 and **Yarn**

### Clone the Project
```
git clone https://github.com/ThiagoMartinsSaraiva/weather-app
```

### Installing the Dependencies
```
yarn
```

### Adding Env Variables
As you may notice, there is a **.env.example**, you can copy it and change it's name to **.env**

Fill **API_URL=** with the base API URL (http://api.openweathermap.org/) <br>
Fill **API_KEY=** with your own OpenWeatherMap API KEY <br>

Now you are all set up to run the project!

### Running the Code
```
yarn dev
```

## Description
This App was developed to demonstrate and practice my knowledge of Vue 3 and Nuxt 3. I built a micro BFF API, to help group and consume the original API data. 
This App uses the user's current geolocation data to fetch real-time weather information, but also allows users to search for a city to get real-time weather updated. It also provides a forecast for the next three days. You can even pin a city so you won't need to search for it repeatedly - just click on it's name to the see real-time weather info.

## Main challenges:
- Forecast data, I needed to group some data and perform calculations to display the information correctly
- Getting precipitation data. I even tried to learn more about it, but I haven't been successful so far
- Today's forecast. The way the API handles time zones and current day was really challenging, especially in the beginning
- Understanding weather and forecast concepts, this was essential to building the app and creating a great UI/UX
- Rendering the lat/lon route. I even decide to remove it because sometimes it was requiring a second request to work properly

## Next Steps:
- Adding type definitions, from the Micro API to the Components
- Improving SSR, SEO and Open Graph integrations
- Adding E2E and Unit tests with Vitest
- Creating more micro components
- Enhancing code reusability
