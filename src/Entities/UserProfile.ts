import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class UserProfile {
  @PrimaryColumn({name: "userId"})
  userId: string;

  @Column({nullable:true})
  DOB: Date;

  @Column({nullable:true})
  gender: string

  @Column({ default: 'IND' })
  country: string;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ nullable: true })//Married(M) or UnMrried(U)
  maritalStatus: string

  @Column({ default: 'ENG' })
  languagePreference: string;

  @Column({ nullable: true })
  timeZone: string;

  @Column()
  income: number;

}
