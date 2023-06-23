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
import { CandidatoEntity } from './candidato.entity';
import { CargoEntity } from './cargo.entity';

@Entity('candidatoListas', { schema: 'core' })
export class CandidatoListaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de la creacion de candidato-lista',
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
  */
  @ManyToOne(() => CandidatoEntity)
  @JoinColumn({ name: 'idcandidato' })
  candidatos: CandidatoEntity[];
  
  @ManyToOne(() => CargoEntity)
  @JoinColumn({ name: 'idcargo' })
  cargos: CargoEntity[];
  


}
