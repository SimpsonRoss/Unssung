let apiURLBackend, apiURLFrontend;

if (window.location.hostname === "localhost") {
  apiURLBackend = 'http://localhost:5001';
  apiURLFrontend = 'http://localhost:3000';
} else {
  apiURLBackend = 'https://trkr8-9a9586e5bb16.herokuapp.com';
  apiURLFrontend = 'https://trkr8-9a9586e5bb16.herokuapp.com';
}

export { apiURLBackend, apiURLFrontend };