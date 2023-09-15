# Simple guide about how to launch the user service

## Set up

As we are currently running our PostgreSQL database locally, you need to ensure you have installed PostgreSQL.
Create a database in your local device, named it `peerprep`. 

Create a .env file directly under `/user-service`. Create 2 env variables as shown below:
```
SERVICE_PORT=xxx (the port that we are going to use to run the user service)

DATABASE_URL="postgresql://postgres:<your_local_database_password>localhost:5432/peerprep?schema=public"
```

## Running the service

Once you have set up the `SERVICE_PORT`, you may start the dev server by running `npm run dev`.

All the API endpoints' route are available in `src/routes` directory, so for example, if you want to get a user data by the user id, you can call the `GET /api/users/:userId` endpoint, replace the `:userId` with the actual user id.

On your side, you can try calling the API by using either Postman/cURL request.