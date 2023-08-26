// src/utilities/send-request.js

import { getToken } from './users-service';

export default async function sendRequest(url, method = 'GET', payload = null) {
  console.log(`Sending request to ${url} with method ${method}`);
  
  const options = { method };
  if (payload) {
    console.log("Payload:", payload);
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(payload);
  }
  
  const token = getToken();
  if (token) {
    console.log('Token exists:', token);
    options.headers = options.headers || {};
    options.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log("Final request options:", options);

  const res = await fetch(url, options);
  
  if (res.ok) {
    console.log("Request was successful");
    return res.json();
  } else {
    console.error("Request failed");
  }
  
  throw new Error('Bad Request');
}
