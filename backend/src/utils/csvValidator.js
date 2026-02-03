const validator = require('validator');
const { parse } = require('csv-parse/sync');

const validateCSVContent = (fileContent) => {
  try {
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true
    });

    if (records.length === 0) {
      throw new Error('CSV file is empty or has no data rows');
    }

    // Required columns
    const requiredColumns = ['correo', 'nombre', 'telefono', 'ciudad'];
    const headers = Object.keys(records[0]);

    // Check if all required columns exist
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Validate each record
    const validatedRecords = [];
    const errors = [];

    records.forEach((record, index) => {
      const rowNumber = index + 2; // +2 because: 1 for header, 1 for 0-based index
      const rowErrors = [];

      // Validate correo (email)
      if (!record.correo || !record.correo.trim()) {
        rowErrors.push(`Row ${rowNumber}: 'correo' is required`);
      } else if (!validator.isEmail(record.correo)) {
        rowErrors.push(`Row ${rowNumber}: '${record.correo}' is not a valid email`);
      }

      // Validate nombre
      if (!record.nombre || !record.nombre.trim()) {
        rowErrors.push(`Row ${rowNumber}: 'nombre' is required`);
      }

      // Validate telefono (must be numeric)
      if (!record.telefono || !record.telefono.trim()) {
        rowErrors.push(`Row ${rowNumber}: 'telefono' is required`);
      } else if (!/^\d+$/.test(record.telefono.trim())) {
        rowErrors.push(`Row ${rowNumber}: 'telefono' must contain only numbers, got '${record.telefono}'`);
      }

      // Validate ciudad
      if (!record.ciudad || !record.ciudad.trim()) {
        rowErrors.push(`Row ${rowNumber}: 'ciudad' is required`);
      }

      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
      } else {
        validatedRecords.push({
          correo: record.correo.trim(),
          nombre: record.nombre.trim(),
          telefono: record.telefono.trim(),
          ciudad: record.ciudad.trim(),
          notas: record.notas ? record.notas.trim() : ''
        });
      }
    });

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
        message: `CSV validation failed with ${errors.length} error(s)`
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
      message: 'CSV parsing error'
    };
  }
};

module.exports = { validateCSVContent };
