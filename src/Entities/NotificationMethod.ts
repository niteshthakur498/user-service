// src/models/NotificationMethod.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class NotificationMethod {
  @PrimaryGeneratedColumn({name : "notification_method_id"})
  methodId: number;

  @Column({name: "notification_method"})
  method: string;

  @Column({name:"user_id"})
  userId: number; // Store the user ID for the relationship
}
