const validator = require('validator');
const { parse } = require('csv-parse/sync');

// Helpers
const hasDigits = (s) => /\d/.test(s);
const isAlphaWithSpaces = (s) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s'´`\-\.]+$/.test(s);

const validateCSVContent = (fileContent) => {
  try {
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true
    });

    if (!records || records.length === 0) {
      throw new Error('El archivo CSV está vacío o no contiene filas de datos');
    }

    const requiredColumns = ['correo', 'nombre', 'telefono', 'ciudad'];
    const headers = Object.keys(records[0]).map(h => h.trim());

    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      return {
        valid: false,
        errors: [`Faltan columnas requeridas: ${missingColumns.join(', ')}`],
        message: 'Validación CSV fallida'
      };
    }

    const validatedRecords = [];
    const errors = [];

    records.forEach((record, index) => {
      const rowNumber = index + 2; // header + 1-based index
      const rowErrors = [];

      // Fields normalized
      const correo = record.correo ? String(record.correo).trim() : '';
      const nombre = record.nombre ? String(record.nombre).trim() : '';
      const telefono = record.telefono ? String(record.telefono).trim() : '';
      const ciudad = record.ciudad ? String(record.ciudad).trim() : '';
      const notas = record.notas ? String(record.notas).trim() : '';

      // correo
      if (!correo) {
        rowErrors.push(`Fila ${rowNumber}: el campo 'correo' es obligatorio`);
      } else {
        if (hasDigits(correo)) {
          rowErrors.push(`Fila ${rowNumber}: 'correo' no debe contener números`);
        }
        if (!validator.isEmail(correo)) {
          rowErrors.push(`Fila ${rowNumber}: '${correo}' no es un correo válido`);
        }
        if (correo.length > 254) {
          rowErrors.push(`Fila ${rowNumber}: 'correo' excede la longitud máxima de 254 caracteres`);
        }
      }

      // nombre
      if (!nombre) {
        rowErrors.push(`Fila ${rowNumber}: el campo 'nombre' es obligatorio`);
      } else {
        if (hasDigits(nombre)) {
          rowErrors.push(`Fila ${rowNumber}: 'nombre' no debe contener números`);
        }
        if (!isAlphaWithSpaces(nombre)) {
          rowErrors.push(`Fila ${rowNumber}: 'nombre' contiene caracteres inválidos`);
        }
        if (nombre.length < 2 || nombre.length > 100) {
          rowErrors.push(`Fila ${rowNumber}: 'nombre' debe tener entre 2 y 100 caracteres`);
        }
      }

      // telefono
      if (!telefono) {
        rowErrors.push(`Fila ${rowNumber}: el campo 'telefono' es obligatorio`);
      } else {
        if (!/^\d+$/.test(telefono)) {
          rowErrors.push(`Fila ${rowNumber}: 'telefono' solo debe contener números`);
        }
        if (telefono.length > 10) {
          rowErrors.push(`Fila ${rowNumber}: 'telefono' debe tener máximo 10 dígitos`);
        }
        if (telefono.length < 7) {
          rowErrors.push(`Fila ${rowNumber}: 'telefono' debe tener al menos 7 dígitos`);
        }
      }

      // ciudad
      if (!ciudad) {
        rowErrors.push(`Fila ${rowNumber}: el campo 'ciudad' es obligatorio`);
      } else {
        if (hasDigits(ciudad)) {
          rowErrors.push(`Fila ${rowNumber}: 'ciudad' no debe contener números`);
        }
        if (!isAlphaWithSpaces(ciudad)) {
          rowErrors.push(`Fila ${rowNumber}: 'ciudad' contiene caracteres inválidos`);
        }
        if (ciudad.length > 100) {
          rowErrors.push(`Fila ${rowNumber}: 'ciudad' excede la longitud máxima de 100 caracteres`);
        }
      }

      // notas (opcional) - validar que no tenga números si existe
      if (notas) {
        if (notas.length > 1000) {
          rowErrors.push(`Fila ${rowNumber}: 'notas' excede la longitud máxima de 1000 caracteres`);
        }
      }

      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
      } else {
        validatedRecords.push({ correo, nombre, telefono, ciudad, notas });
      }
    });

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
        message: `La validación falló con ${errors.length} error(es)`
      };
    }

    return {
      valid: true,
      records: validatedRecords,
      count: validatedRecords.length
    };

  } catch (error) {
    return {
      valid: false,
      errors: [error.message],
      message: 'Error al parsear el CSV'
    };
  }
};

module.exports = { validateCSVContent };
