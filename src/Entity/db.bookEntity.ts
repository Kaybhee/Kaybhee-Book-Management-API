import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class Books {
    @PrimaryGeneratedColumn()
    bookId: number

    @Column({ length: 10})
    ISSN: string

    @Column( {length: 13})
    ISBN: string

    @Column()
    bookName: string

    @Column()
    Author: string

    @CreateDateColumn()
    producedDate: Date

    @Column({ default: false })
    isAvailable: boolean
}