import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { PaginationDto} from '@core/dto';
import { ServiceResponseHttpModel } from '@shared/models';
import { RepositoryEnum } from '@shared/enums';
import { CandidatoListaEntity } from '../entities/candidato-lista.entity';

@Injectable()
export class CandidatoListaService {
  constructor(
    @Inject(RepositoryEnum.CANDIDATOLISTA_REPOSITORY)
    private candidatoListaRepository: Repository<CandidatoListaEntity>,
    /*private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService*/
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.candidatoListaRepository.findAndCount({
      relations: ['usuarios', 'lista', 'cargo', 'candidatoListas'  ],
      take: 1000,
    });

    return {
      pagination: {
        totalItems: response[1],
        limit: 10,
      },
      data: response[0],
    };
  }

  async create(payload: any): Promise<ServiceResponseHttpModel> {
    const nuevoCandidatoLista = this.candidatoListaRepository.create(payload);

    // newCareer.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

  

    const creacionCandidatoLista = await this.candidatoListaRepository.save(nuevoCandidatoLista);

    return { data: creacionCandidatoLista };
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.candidatoListaRepository.findAndCount({
      relations: ['usuarios', 'lista', 'cargo', 'candidatoListas'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const candidatoLista = await this.candidatoListaRepository.findOne({
      relations: ['usuarios', 'lista', 'cargo', 'candidatoListas' ],
      where: {
        id,
      },
    });

    if (!candidatoLista) {
      throw new NotFoundException(`El candidato de lista con el id:  ${id} no se encontro`);
    }
    return { data: candidatoLista };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const candidatoLista = await this.candidatoListaRepository.findOneBy({ id });
    if (!candidatoLista) {
      throw new NotFoundException(`el candidato de la lista con id:  ${id} no se encontro`);
    }
    this.candidatoListaRepository.merge(candidatoLista, payload);
    const votoActualizado = await this.candidatoListaRepository.save(candidatoLista);
    return { data: votoActualizado };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const candidatoLista = await this.candidatoListaRepository.findOneBy({ id });

    if (!candidatoLista) {
      throw new NotFoundException(`El candidatoLista con el :  ${id} no se encontro`);
    }

    const candidatoListaELiminado = await this.candidatoListaRepository.softRemove(candidatoLista);

    return { data: candidatoListaELiminado };
  }

  async removeAll(payload: CandidatoListaEntity[]): Promise<ServiceResponseHttpModel> {
    const candidatosListaEliminados = await this.candidatoListaRepository.softRemove(payload);
    return { data: candidatosListaEliminados};
  }

  private async paginateAndFilter(
    params: any,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<CandidatoListaEntity>
      | FindOptionsWhere<CandidatoListaEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];

    }

    const response = await this.candidatoListaRepository.findAndCount({
      relations: ['usuarios', 'lista', 'cargo', 'candidatoListas' ],
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      pagination: { limit, totalItems: response[1] },
      data: response[0],
    };
  }
}