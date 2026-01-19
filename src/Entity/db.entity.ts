import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()

export class User {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({ unique: true})
    username : string;

    @Column()
    email : string;
    
    @Column({ default : "user", enum: ["user", "admin"]})
    role : string

    @Column()
    password : string;

    @Column({ default : false })
    isDeleted : Boolean

    @Column({ default : false })
    isVerified : Boolean
}