# Hack2Skill-Task2

## Installation

Steps to install the project locally

```shell
$ git clone https://github.com/Krishna-7777/Hack2Skill-Task2.git
$ cd backend
$ npm i
$ node index.js
```

## API Routes

### GET /api/videos
Retrieve paginated videos.

### Query Parameters:

 page (optional): The page number to fetch (default: 1).

 limit (optional): The number of videos per page (default: 10).

### Response:

```
{
  "totalVideos": 100,
  "totalPages": 10,
  "currentPage": 1,
  "videos": [
    {
      "title": "Video 1",
      "channelTitle": "Channel 1",
      "description": "Video description",
      "thumbnailURL": "https://example.com/video1.jpg",
      "publishedAt": "2023-07-18T12:00:00.000Z"
    },
    // more videos...
  ]
}
```

### GET /api/videos/search
Search for videos based on a query.

### Query Parameters:

q (required): The search query string.

limit (optional): The number of search results to return (default: 5).

### Response:

```
{
  "results": [
    {
      "title": "Video 1",
      "channelTitle": "Channel 1",
      "description": "Video description",
      "thumbnailURL": "https://example.com/video1.jpg",
      "publishedAt": "2023-07-18T12:00:00.000Z"
    },
    // more search results...
  ]
}
```
Feel free to add more API routes and their details as needed for your project.
