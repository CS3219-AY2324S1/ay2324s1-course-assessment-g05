# History Service

## Setting up the service locally
First, create a .env file directly under the `history-service` path.
The .env file should contain:
```
SERVICE_PORT=5400

DATABASE_URL=<REPLACE_WITH_OUR_DATABASE_URL>
```

## Endpoint and usage

### `POST /api/history`
This endpoint creates a user id and question id history to the database if there is no error.
**Request Body**
```
{
    userId: string | string[] (with max length of 2) 
    questionId: string
}
```
**Example**:
```
POST /api/history

{
    "userId": ["exampleUserId123", "exampleUserId456"]
    "questionId": "exampleQuestionId123"
}
```
**Response**
```
status: 201 Created
{
    "message": "History created successfully" 
}
```
**Example**:
```
{
    "userId": "exampleUserId789",
    "questionId": "exampleQuestionId456"
}
```
**Response**
```
status: 204 Created
{
    "message": "History created successfully" 
}
```

### `GET /api/history`
This endpoint is used to retrieve the attempted questions given a user id, or the users who attempted a given question. If only a specific history is needed, you can provide a pair of user id and a question id.

For a successful call, the endpoint requires at least a query parameter of user id or question id.

**Request**
```
GET /api/history?userId=<USER_ID1>&questionId=<QUESTION_ID>
```
Please note that multiple user ids and question ids are acceptable, with a maximum limit of 10 each.

**Example**
```
GET /api/history?userId=exampleUserId123
```
**Response**
```
status: 200 OK
{
    "count": 3,
    "data": [
        {
            "userId": "exampleUserId123",
            "questionId": "exampleQuestionId1"
        },
        {
            "userId": "exampleUserId123",
            "questionId": "exampleQuestionId2"
        },
        {
            "userId": "exampleUserId123",
            "questionId": "exampleQuestionId3"
        },
    ] 
}
```

**Example**
```
GET /api/history?questionId=exampleQuestionId1&questionId=exampleQuestionId2
```
**Response**
```
status: 200 OK
{
    "count": 2,
    "data": [
        {
            "userId": "exampleUserId123",
            "questionId": "exampleQuestionId1"
        },
        {
            "userId": "exampleUserId123",
            "questionId": "exampleQuestionId2"
        }
    ]
}
```

### `DELETE /api/history/user/:userId/question/:questionId`
This endpoint allow deleting a history record.
**Example**:
```
DELETE /api/history/user/exampleUserId123/question/exampleQuestionId123
```
**Response**
```
status: 204 NO CONTENT
```