import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Sponsor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  temporaryCode!: string;

  @Column('date', { nullable: true })
  passcodeGeneratedDate: Date;

  @Column({ nullable: true })
  loginAttempts: number;

  @Column({ nullable: true })
  stripeCustomer: number;
}
