import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()

export class users {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    username : string;

    @Column()
    email : string;

    @Column()
    password : string;

    @Column({ default : false })
    isDeleted : Boolean

    @Column({ default : false })
    isVerified : Boolean
}