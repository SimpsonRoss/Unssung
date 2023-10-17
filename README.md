# Unssung - the best tracks you've never heard

![Example of Unssung Branding](https://github.com/SimpsonRoss/trkR8/blob/main/public/branding.png)

<a name="readme-top"></a>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about">About The Project</a>
    <li><a href="#website">Visit the Unssung Site</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#planning">Planning</a></li>
    <li><a href="#erd">ERD</a></li>
    <li><a href="#wireframe">Wireframe</a></li>
    <li><a href="#inspiration">Inspiration</a></li>
    <li><a href="#biggest-challenge">Biggest Challenge</a></li>
    <li><a href="#key-learnings">Key Learnings</a></li>
    <li><a href="#wins">Wins</a></li>
    <li><a href="#next-steps">Next Steps</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About

Unssung gamifies the sharing of music between friends. Players compete to find the best tracks that their friends have never heard, sharing them to earn points and win games.

The game takes all the submitted tracks from each round and makes a playlist directly on the user's Spotify profile, so that they're able to listen to the tracks in Unssung in the mini player, or on Spotify directly.

![Playlist created by Unssung](https://github.com/SimpsonRoss/trkR8/blob/main/public/create-playlist.png)

![Spotify player in Unssung](https://github.com/SimpsonRoss/trkR8/blob/main/public/playlist-in-app.png)

**Built With**

To build Unssung I used the following tools:

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)
![JQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)

## Website

<strong><p><a href="https://trkr8-9a9586e5bb16.herokuapp.com/">Click to view the Unssung website (Optimised for mobile viewing)</a></p></strong>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

- Visit the <a href="https://trkr8-9a9586e5bb16.herokuapp.com/">website</a>

**How it works**

![How it works](https://github.com/SimpsonRoss/trkR8/blob/main/public/how-it-works.png)

**Set Up**

- Hit 'Sign up' and create an account
- Go to the account page to connect your Spotify account
- After that you're ready to start creating games

**Games Dashboard**

- Create a game using by hitting the 'Create new game' button
- Invite friends by copying your unique code and sharing it with others
- Games need a minimum of 3 players to begin
  - If you need other accounts to view the functionality
    - email: test@test.com / password: test
    - email test1@test.com / password: test1

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Project Brief

This was my final project in my General Assembly bootcamp. The criteria I had to satisfy was as follows:

- Working MERN stack app.
- Token-based authentication implemented (sign-up, login & logout)
- Navigation dynamically responds to the login status of the user.
- Authorization is implemented that restricts access to create/update/delete functionality from anonymous users.
- Have a consistent and polished user interface.
- App has full Create/Read/Update/Delete and/or consumes an API, has admin user functionality or real time communication.
- Be deployed online via Heroku

## Planning

**Aim:**
To create a mobile first music sharing game with robust game logic, intuitive user flow, and a tie in the Spotify API to source information and create playlists.

## ERD

![Unssung ERD](https://github.com/SimpsonRoss/trkR8/blob/main/public/ERD.jpeg)

## Wireframe

![Unssung Wireframe](https://github.com/SimpsonRoss/trkR8/blob/main/public/wireframe.png)

## Component Hierarchy

![React Component Hierarchy Planning](https://github.com/SimpsonRoss/trkR8/blob/main/public/react-hierarchy.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Inspiration

The idea for this game came from a good friend of mine, who dreamt it up during the Covid pandemic. Me and 5 of my friends would submit songs to a spreadsheet each week, one of us would build a playlist of the tracks and share it, we'd all listen to the songs for a few days and then head back to the spreadsheet to rate them. Then we'd meet once a week to reveal the scores, and joke about everyone's submissions. It kept us sane during those times, and was an amazing way to find new music and connect with your friends. We spoke about making it into an app one day, and here we are - and this will be a surprise to those same friends.

Here's how it used to look:

![Scoring Sheet](https://github.com/SimpsonRoss/trkR8/blob/main/public/spreadsheet.jpeg)

![The Leaderboard](https://github.com/SimpsonRoss/trkR8/blob/main/public/scoring.jpeg)

## MVP - Minimum Viable Product

- [x] A way to login and logout
- [x] Start a new game and invite friends
- [x] Submit songs via Spotify link
- [x] Listen to all songs
- [x] Rank and score the songs
- [x] See the round and game results

## NTH - Nice to have

- [x] See profile photo and details from Spotify
- [x] Have playlist auto generated on Spotify
- [ ] Earn badges and achievements
- [ ] Add friends and watch other’s games
- [ ] See a playlist of the game’s top tracks

## Biggest Challenge

- **Deployment**

- **Conditionally displaying components for the game**
  The large amount of conditionally visible components required for this game were overhelming for 9 days turnaround. The games and rounds each have multiple status's and then each user's page must look different depending on what action they've taken. It took a lot of testing to find unexpected behaviours and ensure the pages were concise without blocking integral user actions.
- **Implementing Spotify API**
  It was the first time I'd implemented an API that required credentials not only at a site level, but also access and refresh tokens at a user level. Building in guardrails to check for these and refesh tokens when needed was time consuming, and took a lot of hours in Postman running API checks.
- **Handling user state and use effect**
  Working in react for the first time was a challenging experience, and working with props, state and use effect took some getting used to. For a long time I didn't know what was going to refresh with or without a hard page refresh.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Key Learnings

- **How to build an original full stack React app**
  I'd built a few other full stack apps with React, during my course at General Assembly but this was the first time I'd had to architect an entire original React app, from concept, designing the component hierarchy and use of State across them.
- **How to troubleshoot issues with API calls**
  Setting up the Spotify API was something that took me quite a long time to figure out. I had to store each individual user's Access token and Refresh Access token in the user model and build functions to check these tokens and update them when needed. Learning to use Postman and being able to check token validity, and what was being returned by Spotify was invaluable and helped me persevere and get it working.

## Wins

-**Successfully using the Spotify API to improve the game**
When I first considered this as an option I wasn't even sure that the functionality was possible, so learning how to do this and taking the submitted tracks, parsing the URLs to retrieve the URIs and then using these to populate a new playlist in the users account was a big achievement. I used template literals to populate the track title and description, and add in the deadline dates for the Round.

-**Building a complex original game in a short timeframe**
One of the hardest parts of the project was the game logic, and understanding the user flow and what information and functionality was needed to create an intuitive experience. It took a large amount of testing, gathering user feedback and implementing changes. I had to be very critical about what would be prioritised in the short time I had, and optimise for playability.

## Next Steps

- I'll use the spotify API to load the album artwork and details for the submitted tracks, to improve the UX.
- The app needs to be made Desktop and Tablet responsive.
- I'm looking to release this game live, so I'll continue to work on implementing some nice-to-have features and getting it fully production ready.
- I'm lucky enough to have some willing testers and so we'll be playing the game a lot, to identify key improvement areas and continue building the backlog
- I'll build extensive unit tests, so the codebase is easier for collaborators to get involved.
- I'll deploy to the production domain.

## Mistakes / Bugs

- **Using session storage to hold user ID**
  This caused me a lot of headaches when trying to deploy, as it wasn't a scalable solution for a game where multiple players could be playing at one time. I've since used Redis to fix this, but it needs further testing.

- **Player names not showing on the Game detail page**
  When the Game detail page loads it doesn't show the player names at first, and instead needs to be reloaded. I've attempted to use async/await to remedy this, but I'm yet to solve the issue.

- **Spotify player not rendering fully in the Heroku deploy**
  Currently the Spotify player isn't rendering all the playlist details in the live deploy of the site. It works fine locally, so I need to dig into this further and investigate the API calls in Postman.

- **No default avatar image**
  If the user is missing an avatar image then it shows as a broken image link, so I'll need to add in a default avatar image for these scenarios.

- **Submitting Spotify short links**
  It's not currrenty possible to submit the short links Spotfy provides via the mobile app. Unfortunately they don't contain the track URI and therefore I've stuggled to parse them into something I can add to a playlist. This is something I need to investigate further.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- CONTACT -->

## Contact

Ross Simpson - [My LinkedIn](https://www.linkedin.com/in/simpsonre/) - thisisrosssimpson@gmail.com

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

These resources helped me greatly in the completion of my game:

- [Bootstrap](https://getbootstrap.com/)
- [Trello](https://trello.com/)
- [Photopea](https://www.photopea.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
