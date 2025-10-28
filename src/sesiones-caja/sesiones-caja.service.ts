// src/sesiones-caja/sesiones-caja.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SesionCaja } from './entities/sesion-caja.entity';
import { CreateSesionCajaDto } from './dto/create-sesion-caja.dto';
import { CerrarSesionCajaDto } from './dto/cerrar-sesion-caja.dto';
import { Venta } from '../ventas/entities/venta.entity';
import { Gasto } from '../gastos/entities/gasto.entity';
import { AbonoCliente } from '../abonos-clientes/entities/abono-cliente.entity';
import { AbonoProveedor } from '../abonos-proveedores/entities/abono-proveedor.entity';
import { SesionCajaEstado } from '../sesiones-caja-estados/entities/sesion-caja-estado.entity';

// Asumimos que los IDs de los estados son fijos.
const ESTADO_ABIERTA = 1;
const ESTADO_CERRADA = 2;

@Injectable()
export class SesionesCajaService {
  constructor(
    @InjectRepository(SesionCaja)
    private readonly sesionCajaRepository: Repository<SesionCaja>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<SesionCaja[]> {
    return this.sesionCajaRepository.find({
      relations: ['usuario', 'caja', 'estado'],
    });
  }

  async abrirCaja(createSesionDto: CreateSesionCajaDto): Promise<SesionCaja> {
    const sesionActiva = await this.sesionCajaRepository.findOne({
      where: {
        caja: { caja_id: createSesionDto.caja_id },
        estado: { id: ESTADO_ABIERTA },
      },
    });

    if (sesionActiva) {
      throw new BadRequestException(
        `La caja #${createSesionDto.caja_id} ya tiene una sesión abierta.`,
      );
    }

    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
    // Construimos el objeto de la entidad con sus relaciones
    const nuevaSesionData = {
      usuario: { usuario_id: createSesionDto.usuario_id },
      caja: { caja_id: createSesionDto.caja_id },
      monto_base_inicial: createSesionDto.monto_base_inicial,
      estado: { id: ESTADO_ABIERTA } as SesionCajaEstado,
    };

    const nuevaSesion = this.sesionCajaRepository.create(nuevaSesionData);

    return this.sesionCajaRepository.save(nuevaSesion);
  }

  async cerrarCaja(
    id: number,
    cerrarSesionDto: CerrarSesionCajaDto,
  ): Promise<SesionCaja> {
    const sesion = await this.sesionCajaRepository.findOne({
      where: { sesion_id: id },
      relations: ['estado'],
    });

    if (!sesion) {
      throw new NotFoundException(
        `Sesión de caja con ID #${id} no encontrada.`,
      );
    }
    if (sesion.estado.id === ESTADO_CERRADA) {
      throw new BadRequestException('Esta sesión de caja ya ha sido cerrada.');
    }

    const {
      totalVentasEfectivo,
      totalAbonosClientes,
      totalGastos,
      totalPagosProveedores,
    } = await this.calcularMovimientos(id);

    const montoEsperado =
      Number(sesion.monto_base_inicial) +
      totalVentasEfectivo +
      totalAbonosClientes -
      totalGastos -
      totalPagosProveedores;

    const diferencia = cerrarSesionDto.monto_contado_final - montoEsperado;

    sesion.fecha_cierre = new Date();
    sesion.monto_contado_final = cerrarSesionDto.monto_contado_final;
    sesion.notas_cierre = cerrarSesionDto.notas_cierre;
    sesion.monto_esperado_final = montoEsperado;
    sesion.diferencia = diferencia;
    sesion.estado = { id: ESTADO_CERRADA } as SesionCajaEstado;

    return this.sesionCajaRepository.save(sesion);
  }

  async obtenerEstadoActual(cajaId: number) {
    const sesion = await this.sesionCajaRepository.findOne({
      where: { caja: { caja_id: cajaId }, estado: { id: ESTADO_ABIERTA } },
    });

    if (!sesion) {
      return { mensaje: 'No hay ninguna sesión abierta para esta caja.' };
    }

    const movimientos = await this.calcularMovimientos(sesion.sesion_id);
    const montoEsperadoActual =
      Number(sesion.monto_base_inicial) +
      movimientos.totalVentasEfectivo +
      movimientos.totalAbonosClientes -
      movimientos.totalGastos -
      movimientos.totalPagosProveedores;

    return {
      sesion_id: sesion.sesion_id,
      fecha_apertura: sesion.fecha_apertura,
      monto_base_inicial: sesion.monto_base_inicial,
      ...movimientos,
      monto_esperado_actual: montoEsperadoActual,
    };
  }

  private async calcularMovimientos(sesionId: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Sumar Ventas en efectivo
      const ventas = await queryRunner.manager.sum(Venta, 'total', {
        sesion_caja: { sesion_id: sesionId },
        metodo_pago: { es_efectivo: true },
      });

      // Sumar Abonos de Clientes en efectivo
      const abonosClientes = await queryRunner.manager.sum(
        AbonoCliente,
        'monto',
        {
          sesion_caja: { sesion_id: sesionId },
          metodo_pago: { es_efectivo: true },
        },
      );

      // Sumar Gastos en efectivo
      const gastos = await queryRunner.manager.sum(Gasto, 'monto', {
        sesion_caja: { sesion_id: sesionId },
        metodo_pago: { es_efectivo: true },
      });

      // Sumar Abonos a Proveedores en efectivo
      const abonosProveedores = await queryRunner.manager.sum(
        AbonoProveedor,
        'monto',
        {
          sesion_caja: { sesion_id: sesionId },
          metodo_pago: { es_efectivo: true },
        },
      );

      return {
        totalVentasEfectivo: ventas || 0,
        totalAbonosClientes: abonosClientes || 0,
        totalGastos: gastos || 0,
        totalPagosProveedores: abonosProveedores || 0,
      };
    } finally {
      await queryRunner.release();
    }
  }
}
