const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizarImagenParaArte(nombreArchivoEntrada) {
  try {
    const rutaEntrada = path.join(__dirname, nombreArchivoEntrada);

    // Validar si el archivo existe
    if (!fs.existsSync(rutaEntrada)) {
      console.log(`⚠️ No se encontró el archivo "${nombreArchivoEntrada}". Coloca una foto en la carpeta con ese nombre.`);
      return;
    }

    console.log('🎨 Procesando imagen en Alta Fidelidad...');

    // 1. Leer el archivo original
    const bufferOriginal = fs.readFileSync(rutaEntrada);
    const pesoOriginalKB = (bufferOriginal.length / 1024).toFixed(2);

    // 2. Procesar con WebP (Calidad 85% + Smart Subsampling)
    const bufferWebP = await sharp(bufferOriginal)
      .resize({ 
        width: 1200, 
        withoutEnlargement: true 
      })
      .webp({ 
        quality: 85,           // Alta nitidez visual
        effort: 6,             // Máximo esfuerzo de compresión sin romper colores
        smartSubsampling: true  // Mantiene la viveza de los colores
      })
      .toBuffer();

    const pesoFinalKB = (bufferWebP.length / 1024).toFixed(2);

    // 3. Guardar el archivo optimizado en la carpeta
    const rutaSalida = path.join(__dirname, 'resultado_optimizada.webp');
    fs.writeFileSync(rutaSalida, bufferWebP);

    // 4. Imprimir la comparativa en pantalla
    console.log('\n==================================================');
    console.log('🎉 ¡PRUEBA DE COMPRESIÓN FINALIZADA!');
    console.log('==================================================');
    console.log(`📸 Imagen Original : ${pesoOriginalKB} KB`);
    console.log(`✨ Imagen WebP     : ${pesoFinalKB} KB`);
    console.log(`📉 Ahorro de espacio: ${(((pesoOriginalKB - pesoFinalKB) / pesoOriginalKB) * 100).toFixed(1)}%`);
    console.log(`📁 Guardada como   : resultado_optimizada.webp`);
    console.log('==================================================\n');

  } catch (error) {
    console.error('❌ Error durante el procesamiento:', error.message);
  }
}

// Ejecutar pasando el nombre de la foto de prueba
optimizarImagenParaArte('falda_encaje.jpg');