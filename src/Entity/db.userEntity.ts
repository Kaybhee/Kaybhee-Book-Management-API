import { Role } from 'src/users/Roles/enum.roles';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()

export class User {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({ unique: true})
    username : string;

    @Column()
    email : string;

    @Column({ type: 'enum', enum: Role, default: Role.USER})
    role: Role
    
    @Column()
    password : string;

    @Column({ default : false })
    isDeleted : Boolean

    @Column({ default : false })
    isVerified : Boolean
}