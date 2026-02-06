import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, CreateDateColumn,  } from 'typeorm'
import { User } from './db.userEntity'
import { Books } from './db.bookEntity'

@Entity()
export class Borrow {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, user => user.borrowHistory)
    user: User

    @ManyToOne(() => Books)
    book: Books

    @Column()
    returnDate: Date

    @Column({ nullable: true })
    returnedAt: Date

    @Column({ default: false})
    isReturned: boolean

    @CreateDateColumn()
    borrowedAt: Date

    @Column({ default: 0})
    fine: number
}