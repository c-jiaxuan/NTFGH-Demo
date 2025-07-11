import { klingAI_Img_config } from "../../../public/js/config/klingAI-config.js";
import { klingAI_Vid_config } from "../../../public/js/config/klingAI-config.js";
import fs from 'fs';
import path from 'path';

export async function saveURLMedia(url, baseName = 'klingAI_generation_') {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

    const contentType = response.headers.get('content-type');
    const extension = getExtensionFromContentType(contentType);
    const mediaType = getMediaType(contentType);

    const buffer = Buffer.from(await response.arrayBuffer());

    // Select folder based on media type
    let folder;
    if (mediaType === 'image') {
        folder = klingAI_Img_config.saveFolder;
    } else if (mediaType === 'video') {
        folder = klingAI_Vid_config.saveFolder;
    } else {
        throw new Error(`Unsupported media type: ${contentType}`);
    }

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    const filename = getTimestampedFilename(baseName, extension);
    const filePath = path.join(folder, filename);
    fs.writeFileSync(filePath, buffer);

    return filePath;
}

// Dynamically generates the file names for the images generated
function getTimestampedFilename(baseName = 'klingAI_', extension = '.bin') {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  return `${baseName}_${timestamp}.${extension}`;
}

// Helper to get the file extension from Content-Type
function getExtensionFromContentType(contentType) {
    const map = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'video/mp4': 'mp4',
        'video/webm': 'webm',
        'video/ogg': 'ogg',
    };
    return map[contentType] || 'bin'; // fallback
}

// Helper: Get media type from Content-Type
function getMediaType(contentType) {
    if (contentType.startsWith('image/')) return 'image';
    if (contentType.startsWith('video/')) return 'video';
    return 'unknown';
}