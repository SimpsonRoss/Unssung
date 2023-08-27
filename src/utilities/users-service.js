// src/utilities/users-service.js

// Serice modules hold the code that implements
// "business"/application logic
// Service methods often depend upon or use
// methods in the API modules

// Import all named exports
import * as usersAPI from './users-api';

export async function signUp(userData) {
  console.log("Signing up with data:", userData);
  const token = await usersAPI.signUp(userData);
  console.log("Received token:", token);
  localStorage.setItem('token', token);
  return getUser();
}

export function getToken() {
  // getItem will return null if the key does not exist
  // console.log("Trying to recieve token from local storage in getToken  " + localStorage.getItem('token'));
  const token = localStorage.getItem('token');
  // console.log("Token const in getToken: " + token);
  if (!token) {
    console.log("No token found in getToken returning Null");
    return null;
  }
  // Let's check if token has expired...
  const payload = JSON.parse(atob(token.split('.')[1]));
  if (payload.exp < Date.now() / 1000) {
    // Token has expired
    localStorage.removeItem('token');
    return null;
  }
  return token;
}

export function getUser() {
  const token = getToken();
  return token ?
    JSON.parse(atob(token.split('.')[1])).user
    :
    null;
}

export function logOut() {
  localStorage.removeItem('token');
}

export async function login(credentials) {
  console.log("Logging in with credentials:", credentials);
  const token = await usersAPI.login(credentials);
  console.log("Received token:", token);
  localStorage.setItem('token', token);
  console.log("Trying to recieve token from local storage" + localStorage.getItem('token'));
  return getUser();
}

