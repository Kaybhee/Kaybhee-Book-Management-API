import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class Books {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    Title: string

    @Column()
    Publisher: string

    @Column()
    Edition: string

    @Column()
    Genre: string

    @Column( {length: 13})
    ISBN: string

    @Column()
    Author: string

    @Column({ default: false })
    isAvailable: boolean

    @CreateDateColumn()
    publishingDate: Date
 
}