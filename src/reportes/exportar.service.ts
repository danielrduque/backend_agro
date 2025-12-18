// src/reportes/exportar.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportarService {
  // =========================================
  // PDF EXPORTS
  // =========================================

  /**
   * Genera PDF de reporte de ventas
   */
  async generateVentasPDF(ventas: any[], res: Response, periodo: string) {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-ventas-${periodo}.pdf`,
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('AGRO ERP', { align: 'center' });
    doc.fontSize(16).text('Reporte de Ventas', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).font('Helvetica').text(`Período: ${periodo}`, { align: 'center' });
    doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, { align: 'center' });
    doc.moveDown(2);

    // Línea separadora
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Headers de tabla
    const tableTop = doc.y;
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('ID', 50, tableTop);
    doc.text('Fecha', 100, tableTop);
    doc.text('Cliente', 180, tableTop);
    doc.text('Total', 400, tableTop, { width: 100, align: 'right' });
    doc.moveDown();

    // Línea bajo headers
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Datos
    let totalGeneral = 0;
    doc.font('Helvetica').fontSize(9);

    ventas.forEach((venta) => {
      const y = doc.y;
      if (y > 700) {
        doc.addPage();
      }

      const total = Number(venta.total) || 0;
      totalGeneral += total;

      doc.text(`#${venta.venta_id}`, 50, doc.y);
      doc.text(new Date(venta.fecha_venta).toLocaleDateString('es-CO'), 100, doc.y - 12);
      doc.text(venta.cliente?.nombre_completo || 'Cliente General', 180, doc.y - 12, {
        width: 200,
      });
      doc.text(`$${total.toLocaleString('es-CO')}`, 400, doc.y - 12, {
        width: 100,
        align: 'right',
      });
      doc.moveDown(0.5);
    });

    // Total
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(12);
    doc.text(`TOTAL: $${totalGeneral.toLocaleString('es-CO')}`, 400, doc.y, {
      width: 100,
      align: 'right',
    });

    // Footer
    doc.moveDown(3);
    doc.fontSize(8).font('Helvetica').fillColor('gray');
    doc.text(`Total de ventas: ${ventas.length}`, { align: 'center' });

    doc.end();
  }

  /**
   * Genera PDF de reporte de productos
   */
  async generateProductosPDF(productos: any[], res: Response) {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-productos.pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('AGRO ERP', { align: 'center' });
    doc.fontSize(16).text('Inventario de Productos', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).font('Helvetica').text(`Generado: ${new Date().toLocaleString('es-CO')}`, {
      align: 'center',
    });
    doc.moveDown(2);

    // Headers de tabla
    const tableTop = doc.y;
    doc.font('Helvetica-Bold').fontSize(9);
    doc.text('Código', 50, tableTop);
    doc.text('Producto', 120, tableTop);
    doc.text('Stock', 320, tableTop, { align: 'right' });
    doc.text('Precio', 380, tableTop, { align: 'right' });
    doc.text('Valor Total', 450, tableTop, { align: 'right' });
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Datos
    let valorTotal = 0;
    doc.font('Helvetica').fontSize(8);

    productos.forEach((p) => {
      if (doc.y > 700) doc.addPage();

      const stock = Number(p.stock_actual) || 0;
      const precio = Number(p.precio_venta) || 0;
      const valor = stock * precio;
      valorTotal += valor;

      doc.text(p.codigo || '-', 50, doc.y);
      doc.text(p.nombre?.substring(0, 30) || 'Sin nombre', 120, doc.y - 10);
      doc.text(stock.toString(), 320, doc.y - 10, { align: 'right' });
      doc.text(`$${precio.toLocaleString('es-CO')}`, 380, doc.y - 10, { align: 'right' });
      doc.text(`$${valor.toLocaleString('es-CO')}`, 450, doc.y - 10, { align: 'right' });
      doc.moveDown(0.5);
    });

    // Total
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(11);
    doc.text(`VALOR TOTAL INVENTARIO: $${valorTotal.toLocaleString('es-CO')}`, { align: 'right' });

    doc.end();
  }

  /**
   * Genera PDF de reporte de clientes
   */
  async generateClientesPDF(clientes: any[], res: Response) {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-clientes.pdf');

    doc.pipe(res);

    doc.fontSize(20).font('Helvetica-Bold').text('AGRO ERP', { align: 'center' });
    doc.fontSize(16).text('Listado de Clientes', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).font('Helvetica').text(`Total: ${clientes.length} clientes`, {
      align: 'center',
    });
    doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, { align: 'center' });
    doc.moveDown(2);

    // Headers
    doc.font('Helvetica-Bold').fontSize(9);
    doc.text('ID', 50, doc.y);
    doc.text('Nombre', 80, doc.y - 10);
    doc.text('Documento', 250, doc.y - 10);
    doc.text('Teléfono', 350, doc.y - 10);
    doc.text('Email', 430, doc.y - 10);
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc.font('Helvetica').fontSize(8);
    clientes.forEach((c) => {
      if (doc.y > 700) doc.addPage();

      doc.text(c.cliente_id?.toString() || '-', 50, doc.y);
      doc.text(c.nombre_completo?.substring(0, 25) || '-', 80, doc.y - 10);
      doc.text(c.numero_documento || '-', 250, doc.y - 10);
      doc.text(c.telefono || '-', 350, doc.y - 10);
      doc.text(c.email?.substring(0, 18) || '-', 430, doc.y - 10);
      doc.moveDown(0.5);
    });

    doc.end();
  }

  // =========================================
  // EXCEL EXPORTS
  // =========================================

  /**
   * Genera Excel de ventas
   */
  async generateVentasExcel(ventas: any[], res: Response, periodo: string) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'AGRO ERP';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Ventas');

    // Título
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = `Reporte de Ventas - ${periodo}`;
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Headers
    worksheet.addRow([]);
    worksheet.addRow(['ID', 'Fecha', 'Cliente', 'Método Pago', 'Total']);
    const headerRow = worksheet.getRow(3);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4472C4' },
    };
    headerRow.font = { color: { argb: 'FFFFFF' }, bold: true };

    // Columnas
    worksheet.columns = [
      { key: 'id', width: 10 },
      { key: 'fecha', width: 15 },
      { key: 'cliente', width: 30 },
      { key: 'metodo', width: 15 },
      { key: 'total', width: 15 },
    ];

    // Datos
    let totalGeneral = 0;
    ventas.forEach((v) => {
      const total = Number(v.total) || 0;
      totalGeneral += total;
      worksheet.addRow({
        id: v.venta_id,
        fecha: new Date(v.fecha_venta).toLocaleDateString('es-CO'),
        cliente: v.cliente?.nombre_completo || 'Cliente General',
        metodo: v.metodo_pago?.nombre || 'Efectivo',
        total: total,
      });
    });

    // Fila de total
    const totalRow = worksheet.addRow(['', '', '', 'TOTAL:', totalGeneral]);
    totalRow.font = { bold: true };
    totalRow.getCell(5).numFmt = '"$"#,##0.00';

    // Formato de moneda
    worksheet.getColumn(5).numFmt = '"$"#,##0.00';

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=ventas-${periodo}.xlsx`);

    await workbook.xlsx.write(res);
  }

  /**
   * Genera Excel de productos
   */
  async generateProductosExcel(productos: any[], res: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos');

    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = 'Inventario de Productos';
    worksheet.getCell('A1').font = { bold: true, size: 16 };

    worksheet.addRow([]);
    worksheet.addRow(['Código', 'Nombre', 'Categoría', 'Stock', 'Precio Venta', 'Valor Total']);
    const headerRow = worksheet.getRow(3);
    headerRow.font = { bold: true };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '70AD47' } };
    headerRow.font = { color: { argb: 'FFFFFF' }, bold: true };

    worksheet.columns = [
      { key: 'codigo', width: 15 },
      { key: 'nombre', width: 35 },
      { key: 'categoria', width: 20 },
      { key: 'stock', width: 10 },
      { key: 'precio', width: 15 },
      { key: 'valor', width: 15 },
    ];

    let valorTotal = 0;
    productos.forEach((p) => {
      const stock = Number(p.stock_actual) || 0;
      const precio = Number(p.precio_venta) || 0;
      const valor = stock * precio;
      valorTotal += valor;

      worksheet.addRow({
        codigo: p.codigo || '-',
        nombre: p.nombre,
        categoria: p.categoria?.nombre || 'Sin categoría',
        stock: stock,
        precio: precio,
        valor: valor,
      });
    });

    worksheet.addRow(['', '', '', '', 'TOTAL:', valorTotal]);
    worksheet.getColumn(5).numFmt = '"$"#,##0.00';
    worksheet.getColumn(6).numFmt = '"$"#,##0.00';

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=productos.xlsx');

    await workbook.xlsx.write(res);
  }

  /**
   * Genera Excel de clientes
   */
  async generateClientesExcel(clientes: any[], res: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Clientes');

    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'Listado de Clientes';
    worksheet.getCell('A1').font = { bold: true, size: 16 };

    worksheet.addRow([]);
    worksheet.addRow(['ID', 'Nombre Completo', 'Documento', 'Teléfono', 'Email']);
    const headerRow = worksheet.getRow(3);
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC000' } };
    headerRow.font = { bold: true };

    worksheet.columns = [
      { key: 'id', width: 10 },
      { key: 'nombre', width: 35 },
      { key: 'documento', width: 20 },
      { key: 'telefono', width: 15 },
      { key: 'email', width: 30 },
    ];

    clientes.forEach((c) => {
      worksheet.addRow({
        id: c.cliente_id,
        nombre: c.nombre_completo,
        documento: c.numero_documento || '-',
        telefono: c.telefono || '-',
        email: c.email || '-',
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=clientes.xlsx');

    await workbook.xlsx.write(res);
  }
}
