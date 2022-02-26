import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export  class MachineID extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    value: string;

    @Column({ default: false })
    status: boolean
}