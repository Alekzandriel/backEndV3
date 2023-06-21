import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {  CandidatoListaEntity } from '@core/entities';

import { ResponseHttpModel } from '@shared/models';
import { CandidatoListaService } from '../services/candidato-lista.service';

@ApiTags('CandidatoLista')
@Controller('candidatoLista')
export class CandidatoListaController {
  constructor(private candidatoListaService: CandidatoListaService) {}

  @ApiOperation({ summary: 'Crear Cronograma' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.candidatoListaService.create(payload);
    return {
      data: serviceResponse.data,
      message: `El cronograma fue creado`,
      title: 'Candidato Lista Creado',
    };
  }

  @ApiOperation({ summary: 'Buscar todos los cronograma' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() params: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.candidatoListaService.findAll(params);
    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Cronogramas fueron encontrado`,
      title: 'Cronogramas encontrados',
    };
  }

  @ApiOperation({ summary: 'Buscar cronograma' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.candidatoListaService.findOne(id);
    return {
      data: serviceResponse.data,
      message: 'Cronograma fue encontrado',
      title: `Cronograma encontrado`,
    };
  }

  @ApiOperation({ summary: 'Actualizar Cronograma' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.candidatoListaService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: 'Cronograma fue actualizado',
      title: `Institution Updated`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Cronograma' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.candidatoListaService.remove(id);
    return {
      data: serviceResponse.data,
      message: 'Cronograma fue eliminado',
      title: 'Cronograma Eliminado',
    };
  }

  @ApiOperation({ summary: 'Eliminar todos los cronogramas' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(
    @Body() payload: CandidatoListaEntity[],
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.candidatoListaService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: 'Cronogramas fueron eliminados',
      title: 'Cronogramas Eliminados',
    };
  }
}
