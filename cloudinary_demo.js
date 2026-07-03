const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary using inline credentials
cloudinary.config({
  cloud_name: 'sraichxr', // ← replace this
  api_key: '263158979286162', // ← replace this
  api_secret: 'K5HdH4J21fIsoyxNgRSovfx3I-U', // ← replace this
});

async function run() {
  try {
    // 2. Upload an image from Cloudinary's demo domains
    const uploadResult = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg', {
      public_id: 'my_sample_image'
    });
    console.log('--- Upload Successful ---');
    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);

    // 3. Get image details (metadata)
    console.log('\n--- Image Metadata ---');
    console.log('Width:', uploadResult.width);
    console.log('Height:', uploadResult.height);
    console.log('Format:', uploadResult.format);
    console.log('File size (bytes):', uploadResult.bytes);

    // 4. Transform the image
    // f_auto tells Cloudinary to automatically serve the image in the most efficient format for the requesting browser.
    // q_auto tells Cloudinary to automatically compress the image to a smaller file size without noticeable visual degradation.
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });

    console.log('\n--- Transformation Successful ---');
    console.log('Done! Click link below to see optimized version of the image. Check the size and the format.');
    console.log('Transformed URL:', transformedUrl);

  } catch (error) {
    console.error('Error during Cloudinary integration:', error);
  }
}

run();
