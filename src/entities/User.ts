import { Column, Entity, ManyToOne } from 'typeorm';

import { SerializedUser } from '../common/types';
import App from './App';
import Base from './Base';

@Entity('users')
class User extends Base {
  @Column({ unique: true })
  uuid: string;

  @Column({ unique: true })
  deviceToken: string;

  @Column()
  isNotificationsEnabled: boolean;

  @ManyToOne(type => App, app => app.users, {
    onDelete: 'CASCADE'
  })
  app: App;

  serialize(): SerializedUser {
    return {
      ...super.serialize(),
      deviceToken: this.deviceToken,
      isNotificationsEnabled: this.isNotificationsEnabled,
      uuid: this.uuid
    };
  }
}

export default User;