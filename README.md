# AppDev Push Notifications Backend

This is our backend service which handles Push Notifications across all of our apps.

### Setting up database:
Make sure `PostgreSQL` is installed. After installation, start `PostgreSQL` and run the command
````
CREATE DATABASE push-notifications;
````
If you get a database error, upon running `npm run start:dev` and you already have the database created try
````
DROP DATABASE push-notifications;
CREATE DATABASE push-notifications;
````
Connect to the database by running
````
psql push-notifications
````

### Required variables & files:
Create a .envrc file in the repository by running the following and setting the correct values:

```bash
cp envrc.template .envrc
```

You will also need a `.p8` file which is tied to the Apple Developer account that owns the apps which will be receiving push notifications. Contact an AppDev member to get the `.p8` file tied to our account.

Using [`direnv`](https://direnv.net) is recommended. Otherwise, you need to source it using `source .envrc`.

### To run:
Make sure you have [`Node.js`](https://nodejs.org/en/download/) installed, and then run

````bash
npm install (first time)
npm run start:dev
````

# Endpoints

# **/apps/create/** • POST

**Description:** Registers a new app which can then be tied to users.

## Request Body
    {
      "name": String
    }

*required* **name** : String

| **description** | The name of the app.                                         |
| --------------- | ----------------------------------------------------------------------------- |
| **notes**       | N/A |

## Returns: App

*class* App

| **Name**        | **Type**                                       | **Description**                                                                                                                                                                                 |
| --------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id              | String                                            | The UUID of the app.                                                                                                                                                                     |
| name         | String                                         | The name of the app.                                                                                                                                                                       |
| createdAt        | String                                         | The timestamp of when the app was created at.                                                                               |
| updatedAt          | String                                         | The timestamp of when the app was last updated.                                                                                                                                                                |
----------
# **/users/create/** • POST

**Description:** Creates a new user which can then be sent a push notification to.

## Request Body
    {
      "appName": String,
      "deviceToken: String,
      "uuid": String
    }

*required* **appName** : String

| **description** | The name of the app for which this user is tied to.                                         |
| --------------- | ----------------------------------------------------------------------------- |
| **notes**       | If appName is the name of an App that has not yet been created, calling this route will create an App with name of appName. |

*required* **deviceToken** : String

| **description** | The deviceToken that is assigned to an iPhone user by Apple.                                         |
| --------------- | ----------------------------------------------------------------------------- |
| **notes**       | Client receives this deviceToken from Apple after the user approves to receiving Push Notifications on the iOS app. |

*required* **uuid** : String

| **description** | The unique identifier that is used to identify the user for this app.                                         |
| --------------- | ----------------------------------------------------------------------------- |
| **notes**       | This should be unique. |

## Returns: User

*class* User

| **Name**        | **Type**                                       | **Description**                                                                                                                                                                                 |
| --------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id              | String                                            | The UUID of the app.                                                                                                                                                                     |
| deviceToken         | String                                         | The deviceToken that is assigned to an iPhone user by Apple.                                                                                                                                                                       |
| isNotificationsEnabled         | Boolean                                         | The boolean representing whether push notifications are currently enabled for this user (default: true).                                                                                                                                                                       |
| uuid        | String                                         | The unique identifier that is used to identify the user for this app.                                                                               |
| createdAt        | String                                         | The timestamp of when the app was created at.                                                                               |
| updatedAt          | String                                         | The timestamp of when the app was last updated.                                                                                                                                                                |


----------
# **/apps/** • GET

**Description:** Returns a list of all the apps that are currently registered to receive push notifications.

## Returns: [App]

----------
# **/notify/** • POST

**Description:** Send a push notification to a user.

## Request Body
    {
      "apnPayload": Object,
      "deviceToken: String,
      "uuid": String
    }

*required* **apnPayload** : String

| **description** | The object containing information about the notification to send to the user. [View docs here](https://github.com/node-apn/node-apn/blob/master/doc/notification.markdown) to see how this object should be formatted.                                |
| --------------- | ----------------------------------------------------------------------------- |
| **notes**       | At minimum, this should contain an `alert` key which is a *String* representing the message to be displayed in the push notification and a `topic` key which is a *String* representing the app bundle identifier. |

*required* **deviceToken** : String

| **description** | The deviceToken that is assigned to an iPhone user by Apple.                                         |
| --------------- | ----------------------------------------------------------------------------- |
| **notes**       | Client receives this deviceToken from Apple after the user approves to receiving Push Notifications on the iOS app. |

*required* **uuid** : String

| **description** | The unique identifier that is used to identify the user for this app.                                         |
| --------------- | ----------------------------------------------------------------------------- |
| **notes**       | This should be unique. |

## Returns: PushNotificationResponse

*class* PushNotificationResponse

| **Name**        | **Type**                                       | **Description**                                                                                                                                                                                 |
| --------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| successfulTokens              | [String]                                            | The list of device tokens to which the notification was sent succesfully.                                                                                                                                                                     |
| failedTokens         | [String]                                         | The list of objects containing the device token (`device`) and either an `error`, or a `status` and `response` representing the reason the notification failed to send for this device.                                                                                                                                                                       |

## Sample Failed Response:
    {
      "success": true,
      "data": {
          "failedTokens": [
              {
                  "device": "ajklfaskfdlkwneflaknwflknasdlknf",
                  "status": "400",
                  "response": {
                      "reason": "BadDeviceToken"
                  }
              }
          ],
          "successfulTokens": []
      }
    }

## Sample Successful Response:
    {
        "success": true,
        "data": {
            "failedTokens": [],
            "successfulTokens": [
                {
                    "device": "ajklfaskfdlkwneflaknwflknasdlknf"
                }
            ]
        }
    }


----------
# **/users/update/** • POST

**Description:** Updates information about a registered user.

## Request Body
    {
      "deviceToken": ?String,
      "isNotificationsEnabled": ?Boolean,
      "uuid": String
    }

*optional* **deviceToken** : String

| **description** | The deviceToken that is assigned to an iPhone user by Apple.                                         |
| --------------- | ----------------------------------------------------------------------------- |
| **notes**       | Client receives this deviceToken from Apple after the user approves to receiving Push Notifications on the iOS app. |

*optional* **isNotificationsEnabled** : Boolean

| **description** | The boolean representing whether push notifications are currently enabled for this user.                                         |
| --------------- | ----------------------------------------------------------------------------- |
| **notes**       | N/A |

*required* **uuid** : String

| **description** | The unique identifier that is used to identify the user for this app.                                         |
| --------------- | ----------------------------------------------------------------------------- |
| **notes**       | N/A |

## Returns: User


----------
