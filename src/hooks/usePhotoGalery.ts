import { Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import { isPlatform } from '@ionic/core';
import { useEffect, useState } from "react";
import {Directory, Filesystem} from '@capacitor/filesystem';
import { PhotoItem } from '../Types/PhotoItem';
import { Capacitor } from '@capacitor/core';
import {Preferences} from '@capacitor/preferences';


const PHOTO_PREF_KEY = 'photos';

export const usePhotoGalery = () => {
    const [photos, setPhoto] = useState<PhotoItem[]>([]);
    
    useEffect(() => {
        const loadSave = async () => {
           const {value} = await Preferences.get({key: PHOTO_PREF_KEY});
           const photoPref : PhotoItem[] = value ? JSON.parse(value) : [];

           if(!isPlatform('hybrid')) {
             for (let photo of photoPref) {
                const file = await Filesystem.readFile({
                    path: photo.filePath,
                    directory: Directory.Data
                })
                photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
             }
           }
           setPhoto([...photoPref])
        }
       loadSave();
    }, [])
    
    useEffect(() => {
      if(photos.length > 0) {
        Preferences.set({key: PHOTO_PREF_KEY, value: JSON.stringify(photos)})
      }
    }, [photos])

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        });
        console.log(photo);
        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePhoto(photo, fileName);
        setPhoto([...photos, savedFileImage]);


    }

   const savePhoto = async (photo: Photo, fileName: string): Promise<PhotoItem> => {
    let base64data: string = await base64FromPath(photo.webPath!);
     const savedFile = await Filesystem.writeFile({
        path: fileName,
        directory: Directory.Data,
        data: base64data
    });
    
    if(isPlatform('hybrid')) {
        return {
            filePath: savedFile.uri,
            webviewPath: Capacitor.convertFileSrc(savedFile.uri)
        }
    }


    return {
        filePath: fileName,
        webviewPath: photo.webPath!
    }
   }

   async function base64FromPath(path: string): Promise<string> {
      const response = await fetch(path);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            if(typeof reader.result === 'string') {
                 resolve(reader.result);
            } else {
                reject('method did not return a string')
            }
        };

        reader.readAsDataURL(blob)
      })
   }

    const deletePhoto = async (fileName: string) => {
        setPhoto(photos.filter((photo) => photo.filePath !== fileName));

        await Filesystem.deleteFile({
            path: fileName,
            directory: Directory.Data
        });
    };

    return {
        photos,
        takePhoto,
        deletePhoto
    }
}