import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { PaginationDto } from '@core/dto';
import { ServiceResponseHttpModel } from '@shared/models';
import { RepositoryEnum } from '@shared/enums';
import { UsuarioEntity } from '../entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @Inject(RepositoryEnum.USUARIO_REPOSITORY)
    private usuarioRepository: Repository<UsuarioEntity>,
    /*private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService*/
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.usuarioRepository.findAndCount({
      relations: [''],
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
    const nuevoUsuario = this.usuarioRepository.create(payload);

    // newCareer.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

    const creacionUsuario = await this.usuarioRepository.save(nuevoUsuario);

    return { data: creacionUsuario };
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.usuarioRepository.findAndCount({
      relations: [''],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({
      relations: [''],
      where: {
        id,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`El usuario con el id:  ${id} no se encontro`);
    }
    return { data: usuario };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`El usuario con id:  ${id} no se encontro`);
    }
    this.usuarioRepository.merge(usuario, payload);
    const votoUsuario = await this.usuarioRepository.save(usuario);
    return { data: votoUsuario };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const usuario = await this.usuarioRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException(`El usuario con el :  ${id} no se encontro`);
    }

    const usuarioELiminado = await this.usuarioRepository.softRemove(usuario);

    return { data: usuarioELiminado };
  }

  async removeAll(payload: UsuarioEntity[]): Promise<ServiceResponseHttpModel> {
    const usuariosEliminados = await this.usuarioRepository.softRemove(payload);
    return { data: usuariosEliminados};
  }

  private async paginateAndFilter(
    params: any,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<UsuarioEntity>
      | FindOptionsWhere<UsuarioEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ cedula: ILike(`%${search}%`) });
      where.push({ nombreUsuario: ILike(`%${search}%`) });
      where.push({ apellidoUsuario: ILike(`%${search}%`) });
      where.push({ semestre: ILike(`%${search}%`) });
      where.push({ correo: ILike(`%${search}%`) });
      where.push({ tipoUsuario: ILike(`%${search}%`) });
      where.push({ claveUsuario: ILike(`%${search}%`) });
      where.push({ periodoUltimoVoto: ILike(`%${search}%`) });
      where.push({ estadoVoto: ILike(`%${search}%`) });
      where.push({ estadoUsuario: ILike(`%${search}%`) });
    }

    const response = await this.usuarioRepository.findAndCount({
      relations: [''],
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