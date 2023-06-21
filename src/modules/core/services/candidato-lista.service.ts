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
      relations: ['institution', 'modality', 'state', 'type'],
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
    const nuevoVoto = this.candidatoListaRepository.create(payload);

    // newCareer.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

  

    const creacionVoto = await this.candidatoListaRepository.save(nuevoVoto);

    return { data: creacionVoto };
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.candidatoListaRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const voto = await this.candidatoListaRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!voto) {
      throw new NotFoundException(`El voto con el id:  ${id} no se encontro`);
    }
    return { data: voto };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const voto = await this.candidatoListaRepository.findOneBy({ id });
    if (!voto) {
      throw new NotFoundException(`La carrera con id:  ${id} no se encontro`);
    }
    this.candidatoListaRepository.merge(voto, payload);
    const votoActualizado = await this.candidatoListaRepository.save(voto);
    return { data: votoActualizado };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const voto = await this.candidatoListaRepository.findOneBy({ id });

    if (!voto) {
      throw new NotFoundException(`El voto con el :  ${id} no se encontro`);
    }

    const votoELiminado = await this.candidatoListaRepository.softRemove(voto);

    return { data: votoELiminado };
  }

  async removeAll(payload: CandidatoListaEntity[]): Promise<ServiceResponseHttpModel> {
    const votosEliminados = await this.candidatoListaRepository.softRemove(payload);
    return { data: votosEliminados};
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
      relations: ['institution', 'modality', 'state', 'type'],
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