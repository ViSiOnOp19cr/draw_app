import { Table, Column, Model, ForeignKey, BelongsTo, DataType, CreatedAt } from 'sequelize-typescript';
import { User } from './User';
import { Room } from './Room';

@Table({
  tableName: 'room_participants',
  timestamps: true
})
export class RoomParticipant extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  roomId!: number;

  @BelongsTo(() => Room)
  room!: Room;


  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  joinedAt!: Date;
} 