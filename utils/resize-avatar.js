const Jimp = require('jimp');

async function resizeImageToMaxSize(inputImagePath, outputImagePath, maxSizeInBytes) {
  try {
    const image = await Jimp.read(inputImagePath);

    // Calculate the target dimensions to get close to the desired file size
    const targetWidth = image.getWidth();
    const targetHeight = image.getHeight();
    
    let quality = 100; // Start with 100% quality

    while (quality > 0) {
      const buffer = await image.clone().quality(quality).getBufferAsync(Jimp.MIME_JPEG);
      const currentSizeInBytes = buffer.length;

      if (currentSizeInBytes <= maxSizeInBytes) {
        await Jimp.read(buffer).resize(targetWidth, targetHeight).writeAsync(outputImagePath);
        console.log(`Image resized with quality ${quality} to size: ${currentSizeInBytes} bytes`);
        break;
      }

      // Reduce quality gradually if the target size is not reached
      quality -= 5;
    }

    console.log('Resize complete.');
  } catch (error) {
    console.error('Error:', error);
  }
};

// const maxSizeInBytes = 1024 * 1024; // 1 MB in bytes
// resizeImageToMaxSize('input.jpg', 'output_resized.jpg', maxSizeInBytes);

module.exports = resizeImageToMaxSize;