# Sports NewsScraper

### Overview

Web application that allow users to view and leave comments on the latest news. With the use of Mongoose and Cheerio, I was able to scrape data from Fox News.

### Before You Begin

1. Create a GitHub repo for this assignment and clone it to your computer.

2. Run `npm init`. When that's finished, install and save these npm packages:

   1. express

   2. mongoose

   3. cheerio

   4. axios

3. When you go to connect your mongo database to mongoose, do so the following way:

```js
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
```

## Instructions

- Create an app that accomplishes the following:

  1. Whenever a user visits your site, the app should scrape stories from a news outlet of your choice and display them for the user. Each scraped article should be saved to your application database. At a minimum, the app should scrape and display the following information for each article:

     - Headline - the title of the article

     - Summary - a short summary of the article

     - URL - the url to the original article

     - Feel free to add more content to your database (photos, bylines, and so on).

  2. Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.
