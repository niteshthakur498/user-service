import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({name: "userId"})
  userId: string;

  @Column({unique : true,name:"username"})
  username: string;

  @Column({unique : true, name : "email", nullable: false })
  email: string;

  @Column({name : "user_password"})
  passwordHash: string;

  @Column({ nullable: true })
  refreshToken: string; 

  @Column({ nullable: true })
  refreshTokenExpiry: Date;
}
