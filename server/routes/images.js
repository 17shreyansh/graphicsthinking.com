const express = require('express');
const fs = require('fs');
const path = require('path');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get all images with optional folder filtering
router.get('/images', protect, async (req, res) => {
    try {
        const { folder } = req.query;
        const uploadsDir = path.join(__dirname, '../uploads');
        let directories = ['general', 'portfolio', 'services', 'blog'];

        if (folder && folder !== 'all') {
            directories = [folder];
        }

        let allImages = [];

        for (const dir of directories) {
            const dirPath = path.join(uploadsDir, dir);
            if (fs.existsSync(dirPath)) {
                const files = fs.readdirSync(dirPath);
                const imageFiles = files.filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
                });

                const images = imageFiles.map(filename => {
                    const filePath = path.join(dirPath, filename);
                    const stats = fs.statSync(filePath);
                    return {
                        filename,
                        url: `/uploads/${dir}/${filename}`,
                        size: stats.size,
                        uploadDate: stats.mtime,
                        folder: dir
                    };
                });

                allImages = [...allImages, ...images];
            }
        }

        // Sort by upload date, newest first
        allImages.sort((a, b) => b.uploadDate - a.uploadDate);

        res.json({ images: allImages });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Error fetching images' });
    }
});

// Delete an image
router.delete('/images/:filename', protect, async (req, res) => {
    try {
        const { filename } = req.params;
        const uploadsDir = path.join(__dirname, '../uploads');
        let fileFound = false;

        // Search in all directories
        const directories = ['general', 'portfolio', 'services', 'blog'];
        
        for (const dir of directories) {
            const filePath = path.join(uploadsDir, dir, filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                fileFound = true;
                break;
            }
        }

        if (!fileFound) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Error deleting image' });
    }
});

module.exports = router;