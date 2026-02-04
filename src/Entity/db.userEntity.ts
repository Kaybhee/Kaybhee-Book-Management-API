import { Role } from 'src/users/Roles/enum.roles';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Borrow } from './db.borrowEntity';

@Entity()

export class User {
    @PrimaryGeneratedColumn()
    userId : number;

    @Column({ unique: true})
    username : string;

    @Column()
    email : string;

    @Column({ type: 'enum', enum: Role, default: Role.USER})
    role: Role
    
    @Column()
    password : string;

    @OneToMany(() => Borrow, borrow => borrow.user)
    borrowHistory: Borrow[]

    @Column({ default : false })
    isDeleted : Boolean

    @Column({ default : false })
    isVerified : Boolean
}