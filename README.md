# Stuff To Do (Server)

This is the backend code for the Stuff To Do app. This app will allow a user to create an account/ login, and then view a currated list of things to do in cities accross the US.

- [Link to Live App](https://wonderful-music-contraption.vercel.app/)
- [Link to Client Repo](https://github.com/ashen-develops/Wonderful-Music-Contraption)

## API Documentation

### Users Endpoints

### ▸ `GET /api/states`
### ▸ `GET /api/states`
### ▸ `GET /api/states`
### ▸ `GET /api/states`
### ▸ `GET /api/states`

## App Structure

* __migration__ folder contains all the sql files necesay for the DB setup
* __public__ folder contains the View related files
* __seed__ folder contains the seed files for the SQL tables
* __src__ folder contains the Controller related files
    * __server.js__ is the entry point of the Controller logic (where all the general app settings live)
    * __app.js__ is the starting pint for the routes
    * __config.js__ where the db config (url etc.) lives
    * __logger.js__ logs errors
    * __validate-bearer-token.js__ is used for api auth

    * __auth__ folder contains the router with all the auth API endpoints
        * __auth-router.js__ Auth Router
            * POST Endpoint: Add a POST endpoint to this server (takes care of users logging in)
        * __auth-service.js__ Service file for the Controller connection with the Model
        
    * __users__ folder contains the router with all the user API endpoints
        * __users-router.js__ Users Router
            * POST Endpoint: Add a POST endpoint to this server (takes care of users registering)
        * __users-service.js__ Service file for the Controller connection with the Model

    * __suggestions__ folder contains the router with all the music API endpoints
        * __suggestions-router.js__ Music Router
            * POST Endpoint: Add a POST endpoint to this server (takes care of users saving their tracks)
            * GET Endpoint: Add a POST endpoint to this server (takes care of users seeing their tracks)
            * DELETE Endpoint: Add a POST endpoint to this server (takes care of users deleting their tracks)
        * __suggestions-service.js__ Service file for the Controller connection with the Model

    * __states__ folder contains the router with all the music API endpoints
        * __states-router.js__ Music Router
            * POST Endpoint: Add a POST endpoint to this server (takes care of users saving their tracks)
            * GET Endpoint: Add a POST endpoint to this server (takes care of users seeing their tracks)
            * DELETE Endpoint: Add a POST endpoint to this server (takes care of users deleting their tracks)
        * __states-service.js__ Service file for the Controller connection with the Model
        
    * __middleware__ folder contains functions that are used by the controller in multiple places
        * __error-handler.js__ handles errors
* __test__ folder contains the Test files

**Sample query**

```URL
/api/images/?sort={SORTBY}&lat={LATITUDE}&lon={LONGITUDE}&distance={DISTANCE}
```

- <small>`{SORTBY}`</small> - either **new**, where the response is ordered by timestamp, or **top**, where the response is ordered by the number of karma (i.e. upvotes)
- <small>`{LATITUDE}`</small> - the latitude of the query location, which can be provided by the HTML5 Geolocation API
- <small>`{LONGITUDE}`</small> - the longitude of the query location, which can be provided by the HTML5 Geolocation API
- <small>`{DISTANCE}`</small> - the distance in kilometers within the query location to find image posts. If not included in the query, the distance defaults to 20km.

**Example response**

```JSON
[
  {
    "id": 42,
    "image_text": "amazing waterslide across the street!",
    "image_url": "https://anonygram-images.s3.amazonaws.com/58f5951ccc35f88f3594172657d81f31",
    "karma_total": 3,
    "latitude": "51.482",
    "longitude": "-0.007",
    "user_id": "7ad87401-dda8-48f0-8ed8-a6bc9756e53c",
    "create_timestamp": "2019-12-12T17:58:03.868Z",
  }
]
```

- **`id`**`- string` - uuid of an image post
- **`image_text`**`- string` - the description, flavor text, or caption of an image post
- **`image_url`**`- string` - URL of where the image is hosted on Anonygram's S3 server
- **`karma_total`**`- integer` - the number of upvotes that an image post has
- **`latitude`**`- float` - latitude of the image post's location **\***
- **`longitude`**`- float` - longitude of the image post's location **\***
- **`user_id`**`- string` - uuid of the user that submitted the image post (returns _null_ if it is an anonymous post from an unregistered user)
- **`create_timestamp`**`- string` - timestamp in ISO format denoting when the post was submitted

> \* _note that latitude and longitude are truncated to 3 decimal places to maintain anonymity_

### ▸ `POST /api/music`

A typical image submission is made via a <small>POST</small> request using the `multipart/form-data` encoding type in a form submit. The uploaded file must have a file extension of either `jpeg, jpg, png, gif`. The server compresses the transmitted data to JPEG format, auto-rotates it based on the image's EXIF metadata (i.e. if the image were taken in portrait mode on an iPhone), and then stores the image on Anonygram's S3 server. The resulting URL that points to the asset on S3 is stored as a field in the images table within Anonygram's database.

If the user making the image submission is registered and logged in, their `user_id` is stored with the image in the database. This allows the user to delete their submission later, which is documented in the <small>DELETE</small> request below.

**Example request**

```JavaScript
{
  body: {
    image_text: 'amazing waterslide across the street!',
    latitude: '51.4825766',
    longitude: '-0.0076589'
  },
  user: {
    id: '7ad87401-dda8-48f0-8ed8-a6bc9756e53c',
    username: 'admin',
    password: '$2a$12$WtU7R79oJnrqDqVpGlDSyuvk5ELkkrk8uOZ3ki6CkRlP.SP6p6G8y',
    karma_balance: 25
  },
  file: {
    fieldname: 'someImage',
    originalname: 'waterslide.png',
    encoding: '7bit',
    mimetype: 'image/png',
    destination: 'uploads/',
    filename: '58f5951ccc35f88f3594172657d81f31',
    path: 'uploads\\58f5951ccc35f88f3594172657d81f31',
    size: 141628
  }
}
```

> _A successful <small>POST</small> requires a **latitude**, **longitude**, and the **image file** itself. Latitude and longitude can be provided by the HTML5 Geolocation API._

> _The submitted image must meet community guidelines and will be rejected with a status `400` if questionable content is detected by the Google Vision API._

### ▸ `PATCH /api/images/:submission_id`

This endpoint upvotes an image submission specified by `submission_id`, by incrementing the image's `karma_total` by 1. The upvoter must be a registered and logged in user with a positive `karma_balance`. Additionally, the submission's `user_id` must match the upvoter's `id`, otherwise the server responds with a status `403` (i.e. users may not upvote their own submissions).

If no submission could be found by `submission_id`, the server responds with a status `400`.

### ▸ `DELETE /api/music/:id`

This endpoint allows a registered and logged in user to remove an image that they posted from the database, specified by `submission_id`. If the `id` of the user making the <small>DELETE</small> request does not match the `user_id` of the submission, the server responds with a status `401`.

If no submission could be found by `submission_id`, the server responds with a status `400`.

### Users Endpoints

### ▸ `GET /api/users`

Returns an array of comments associated with an image submission specified by `submission_id`. Every comment contains a `user_id` of the user that posted the comment, but the displayed username is randomly generated on the client to maintain anonymity.

If no submission could be found by `submission_id`, the server responds with a status `404`.

**Example response**

```JSON
[
  {
    "comment_id": "fcf3fa7b-a1ca-4314-bbd5-5dba75ba5991",
    "comment_text": "wow that's wild!",
    "comment_timestamp": "2019-12-12T23:32:14.876Z",
    "submission_id": 42,
    "user_id": "7ad87401-dda8-48f0-8ed8-a6bc9756e53c"
  }
]
```

- **`comment_id`**`- string` - uuid of a comment
- **`comment_text`**`- string` - the contents of a posted comment
- **`comment_timestamp`**`- string` - timestamp in ISO format denoting when the comment was created
- **`submission_id`**`- integer` - the id of an image submission that the comment was posted to
- **`user_id`**`- string` - uuid of the user that posted the comment

### ▸ `POST /api/users`

This endpoint allows a registered and logged in user to post a comment to an image submission specified by `submission_id`.

If no submission could be found by `submission_id`, the server responds with a status `404`.

**Example request**

```JSON
{
  "user_id": "7ad87401-dda8-48f0-8ed8-a6bc9756e53c",
  "comment_text": "wow that's wild!"
}
```

### Auth Endpoints

### ▸ `GET /api/auth`

Returns the data for the user specified by `user_id`.

If no user could be found by `user_id`, the server responds with a status `400`.

**Example response**

```JSON
{
  "id": "7ad87401-dda8-48f0-8ed8-a6bc9756e53c",
  "karma_balance": 25
}
```

> _The **karma_balance** (i.e. the number of remaining upvotes that a user has) of each registered user in the Anonygram database is reset to 25 every hour, whether or not any karma was spent in that hour._

> _Note that the `username` of the specified user is not included in the response so as to maintain anonymity._

## Technology Stack

### Backend
- **Express** for handling API requests
- **Node** for interacting with the file system 
- **Knex.js** for interfacing with the **PostgreSQL** database
- **Postgrator** for database migration
- **Mocha**, **Chai**, **Supertest** for endpoints testing
- **JSON Web Token**, **bcryptjs** for user authentication / authorization
