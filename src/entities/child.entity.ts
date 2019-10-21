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

  @Column({ nullable: true, default: false })
  archived: boolean;

  @Column({ nullable: true })
  @Exclude()
  stripeProduct: string;

  @Column({ nullable: false, default: 0 })
  @Exclude()
  sponsorsNeeded: number;

  @Exclude()
  @Column({ nullable: false, default: 0 })
  activeSponsors: number;

  @Column({ nullable: true })
  image: string;

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}
