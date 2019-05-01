import { Column, Entity, OneToMany } from 'typeorm';

import { SerializedApp } from '../common/types';
import Base from './Base';
import User from './User';

@Entity('apps')
class App extends Base {
  @Column({ unique: true })
  name: string;

  @OneToMany(type => User, user => user.app, {
    cascade: ['remove'],
  })
  users: User[];

  serialize(): SerializedApp {
    return {
      ...super.serialize(),
      name: this.name
    };
  }
}

export default App;