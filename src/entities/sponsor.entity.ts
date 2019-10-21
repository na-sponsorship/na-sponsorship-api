import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Child } from './child.entity';

@Entity()
export class Sponsor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  loginAttempts: number;

  @Column({ nullable: true })
  stripeCustomer: string;

  @ManyToMany(type => Child, child => child.sponsors)
  children: Child[];
}
