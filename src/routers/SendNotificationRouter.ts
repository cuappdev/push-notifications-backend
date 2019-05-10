import apn from 'apn';
import { Request } from 'express';

import { APN_AUTH_KEY_ID, APPLE_TEAM_ID, NODE_ENV } from '../utils/EnvUtils';
import { PRODUCTION } from '../common/constants';
import ApplicationRouter from '../appdev/ApplicationRouter';
import UsersRepo from '../repos/UsersRepo';

const options = {
  token: {
    key: `./AuthKey_${APN_AUTH_KEY_ID}.p8`,
    keyId: APN_AUTH_KEY_ID,
    teamId: APPLE_TEAM_ID
  },
  production: NODE_ENV === PRODUCTION
}

// Use node-apn module to send Apple Push Notifications
// [Github Repo]: https://github.com/node-apn/node-apn
const apnProvider = new apn.Provider(options);
const BAD_DEVICE_TOKEN = 'BadDeviceToken';

class SendNotificationRouter extends ApplicationRouter<Object> {
  constructor() {
    super('POST');
  }

  getPath() {
    return '/notify/';
  }

  async content(req: Request): Promise<Object> {
    const { apnPayload, deviceToken, uuid } = req.body;
    let user = await UsersRepo.getUserByUUID(uuid);

    // Ensure user has notifications enabled
    if (!user.isNotificationsEnabled) {
      throw Error('User does not have notifications enabled');
    }

    // Update the user's deviceToken if its current one is different
    if (user.deviceToken !== deviceToken) {
      user = await UsersRepo.updateDeviceTokenWithUUID(uuid, deviceToken);
    }

    // Create Notification and send it to Apple Push Notification Server
    const notification = new apn.Notification(apnPayload);
    const result = await apnProvider.send(notification, deviceToken);

    // Handle response from Apple Push Notification Server.
    // [result.sent] : an array of device tokens to which the notification was sent succesfully
    // [result.failed] : an array of objects containing the device token (`device`) and either an 
    // `error`, or a `status` and `response` from the API
    const response = {
      'failedTokens': result.failed,
      'successfulTokens': result.sent,
    };

    // Disable push notification for user if failed because of invalid device token.
    if (result.failed.length > 0) {
      const failedDeviceResponse = result.failed[0].response;
      if (failedDeviceResponse && failedDeviceResponse.reason === BAD_DEVICE_TOKEN) {
        await UsersRepo.updateIsNotificationsEnabledWithUUID(uuid, false);
      }
    }

    return response;
  }
}

export default new SendNotificationRouter().router;