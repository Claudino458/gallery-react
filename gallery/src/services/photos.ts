import { Photos } from '../types/photos';
import { storage } from '../libs/firebase';
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { v4 as createId } from 'uuid';

export const getAll = async () => {
    let list: Photos[] = []

    //Faz referencia da pasta
    const imagesFolder = ref(storage, "images");
    //Lê os arquivos que estão dentro da pasta
    const photoList = await listAll(imagesFolder);

    //faz um loope
    for(let i in photoList.items){
        //Pega o link de download para acessa a foto.
        let photoUrl = await getDownloadURL(photoList.items[i])

        //Monta o array
        list.push({
            name: photoList.items[i].name,
            url: photoUrl
        })
    }

    return list;
}

export const insert = async (file: File) => {
    if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {

        let randomName = createId();
        let newFile = ref(storage, `images/${randomName}`);

        let upload = await uploadBytes(newFile, file);
        let photoUrl = await getDownloadURL(upload.ref);

        return { name: upload.ref.name, url: photoUrl } as Photos;
    } else {
        return new Error('Tipo de arquivo não permitido.');
    }
}

export const deletePhoto = async (name: string) => {
    let photoRef = ref(storage, `images/${name}`);
    await deleteObject(photoRef);
}