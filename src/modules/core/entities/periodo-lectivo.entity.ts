import { DateSchema } from 'joi';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('periodosLectivos', { schema: 'core' })
export class PeriodoLectivoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        comment: 'Fecha de creacion del periodo lectivo',
    })

    createdAt: Date;

    @UpdateDateColumn({
        name: 'update_at',
        type: 'timestamptz',
    })
    updateAt: Date;

    @DeleteDateColumn({
        name: 'delete_at',
        type: 'timestamptz',
    })
    deleteAt: Date;
    /*
      @OneToOne(() => CatalogueEntity)
      @JoinColumn({ name: 'address_id' })
      address: CatalogueEntity;
    
      @ManyToOne(() => CatalogueEntity)
      @JoinColumn({ name: 'state_id' })
      state: CatalogueEntity;
    */
    @Column('varchar', {
        name: 'nombre_periodo_lectivo',
        length: 50,
        default: 'none',
        nullable: true,
        unique: true,
        comment: 'Nombre del periodo lectivo. Ej. Ago 2023 - Abr 2024',
    })
    nombrePeriodoLectivo: string;

    @Column({
        name: 'fecha_inicio_periodo_lectivo',
        type: 'varchar',
        comment: 'Fecha de inicio del periodo lectivo',
    })
    fechaInicioPeriodoLectivo: string;

    @Column({
        name: 'fecha_finalizacion_periodo_lectivo',
        type: 'varchar',
        comment: 'Fecha de finalizacion del periodo lectivo',
    })
    fechaFinalizacionPeriodoLectivo: string;
}
