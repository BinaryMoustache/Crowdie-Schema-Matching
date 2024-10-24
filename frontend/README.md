# Crowdie Frontend 

This is the frontend implementation for Crowdie using React. It also leverages the following technologies:

- React Router DOM for client-side routing.
- React Icons for including icons in the application.
- CSS Modules for styling components.

## Project Structure


```
.
├── Dockerfile                          # Dockerfile for containerizing the frontend application
├── nginx                               # Nginx configuration directory
├── package.json                        # React application dependencies and scripts
├── vite.config.js                      # Vite configuration file
└── src/                                # Main source directory for the React application
    ├── main.jsx                        # Entry point for the React application
    ├── index.css                       # Global CSS styles for the application
    ├── App.jsx                         # Main application component
    ├── App.css                         # CSS styles specific to the App component
    ├── utils/                          # Utility functions and helpers
    ├── pages/                          # Page components 
    ├── components/                     # Functional and UI components
```

## Installation 

Ensure that you have **Node.js** installed on your machine. You can download it from the [Node.js Official Download Page](https://nodejs.org/en/download/).

Once Node.js is installed, you can install the required packages using:

```bash
npm install
```

To start the development server, use:

```bash
npm run dev
```
