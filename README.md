# CineSky - Weather App

CineSky is a modern weather application built with Next.js that provides real-time weather information and forecasts. The app features a clean, responsive UI and integrates with OpenWeatherMap API for accurate weather data.

## Features

- **Real-time Weather Information**: Get current weather for your location
- **Weather Search**: Look up weather in any city worldwide
- **Location Management**: Save and manage your favorite locations
- **Map View**: View your current location on a map
- **User Authentication**: Secure user accounts with Firebase
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technology Stack

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Authentication
- **API**: OpenWeatherMap API
- **Icons**: React Icons
- **Weather Animations**: React Animated Weather
- **Time/Date**: React Live Clock

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/cinesky.git
   cd cinesky
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   
   NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
   ```

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```
npm run build
```

Then to start the production server:

```
npm start
```

## Deployment

This project can be deployed to Vercel, Netlify, or any other hosting service that supports Next.js applications.

## License

This project is licensed under the MIT License
