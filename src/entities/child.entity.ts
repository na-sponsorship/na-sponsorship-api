import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('date', { nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  grade: number;

  @Column('text', { nullable: true })
  story: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  @Exclude()
  stripeProduct: string;

  @Column({ nullable: true })
  @Exclude()
  sponsorsNeeded: number;

  @Exclude()
  @Column({ nullable: true })
  activeSponsors: number;
}
