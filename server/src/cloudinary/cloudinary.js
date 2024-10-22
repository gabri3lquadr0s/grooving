import { v2 as cloudinary } from 'cloudinary'

const uploadImage = async (file) => {
    try {
        if(file.size > 5000000) {
            return "err";
        }
        const imageResult = await new Promise(
            (resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error)
                        resolve({
                            url: result?.secure_url,
                            id: result?.public_id,
                        });
                    }
                );
                stream.end(file.buffer);
            }
        )
        return imageResult.url;
    }
    catch(e) {
        return "err";
    }
}

const uploadAudio = async (file) => {
    try {
        if(file.size > 10000000) {
            return "err";
        }
        const audioResult = await new Promise(
            (resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'video' },
                    (error, result) => {
                        if (error) reject(error);
                        resolve({
                            url: result?.secure_url,
                            id: result?.public_id,
                        });
                    }
                );
            }
        );
        return audioResult.url;
    }
    catch (e) {
        return "err";
    }
}

export { uploadImage, uploadAudio };