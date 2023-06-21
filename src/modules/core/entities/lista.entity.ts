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

  @Entity('listas', {schema: 'core'})
  export class ListaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name:'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        comment: 'Fecha de la creacion de la lista',
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
        name: 'nombre_lista',
        length: 10,
        nullable: true,
        unique: true,
        comment: 'Nombre de la lista',
      })
      nombreLista: string;
    
      @Column('varchar', {
        name: 'eslogan_lista',
        nullable: true,
        length: 500,
        comment: 'Eslogan de la lista',
      })
      esloganLista: string;
    
      @Column('varchar', {
        name: 'plan_trabajo_lista',
        length: 500,
        comment: 'Enlace al documento del plan de trabajo',
      })
      planTrabajoLista: string; 
      
      @Column('varchar', {
        name: 'color_lista',
        length: 50,
        comment: 'Color de la lista',
      })
      colorLista: string; 
      
      @Column('varchar', {
        name: 'numero_lista',
        length: 3,
        comment: 'Numero de la lista',
      })
      numeroLista: string; 
      
      @Column('varchar', {
        name: 'logo_lista',
        length: 500,
        comment: 'Enlace al archivo del logo',
      })
      logoLista: string; 
      
      @Column({
        name: 'estado_lista',
        type: 'varchar',       
        comment: 'Estado de la lista',
      })
      estadoLista: string; 
  }

  