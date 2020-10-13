# Discanner

## Description

Discanner is a map to show the places in Berlin, where people face different kind of discrimination in public spaces. Registered users can report these places with description and uploading a photo. After reporting a point a unique QRCode will generate for it. Users can print this QRCode and stick them in the city in order to bring a connection between public and virtual spaces. This project is my final project at Spiced Academy, which is done in one week.

In case you are interested to look at it, it would be better to open it on Google Chrome.

## Technology

-   Google Maps Javascript API
-   Google Geocoding API
-   Google Places API
-   React
-   React Hooks
-   Node.js
-   Express.js
-   axios
-   PostgreSQL
-   AWS
-   HTML/CSS

## Features

-   The first page of the website shows all the points marked by different users.
    CLicking on the points opens a window which shows the detailed information of the incident
    with uploaded photo and a unique QR-Code for that point. The QR-Codes are printable for the users in order to stick on public spaces. It's also possible to search on the map for a specific place.

![Marked points on the map](public/readme/points.gif)

-   For reporting an incident, users must register to the site or login to their account.
    They can serach on the map, zoom the points and find the exact place that the incident has happened and click on the point.

![Login or register to report](public/readme/login.gif)

-   After marking the point, a window will open and allow the user to enter the date and time of the incident, tell the story, upload a photo and delete or edit their inputs.
    Afterwards the point will show on the map with a QR-Code which is generated for it.

![Report an incident](public/readme/report.gif)
