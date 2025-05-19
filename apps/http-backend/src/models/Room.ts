import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, HasMany, BelongsToMany } from 'sequelize-typescript';
import { User } from './User';
import { RoomParticipant } from './RoomParticipant';

@Table({
  tableName: 'rooms',
  timestamps: true
})
export class Room extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  createdById!: number;

  @BelongsTo(() => User, 'createdById')
  createdBy!: User;

  @BelongsToMany(() => User, () => RoomParticipant)
  participants!: User[];


  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isPrivate!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  accessCode!: string | null;
} 