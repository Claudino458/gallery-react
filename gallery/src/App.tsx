import {useState, useEffect, FormEvent } from 'react';
import * as C from './App.styles';
import * as Photo from './services/photos';
import { Photos } from './types/photos';
import { PhotoItem } from './components/Photoitem';

const App = () => {
  const [uploading, setUploading] = useState(false);
  const[loading, setLoading] = useState(false);
  const[photos, setPhotos] = useState<Photos[]>([]);

  useEffect(()=> {
    getPhotos();
  }, [])

  const getPhotos = async () => {
    setLoading(true);
    setPhotos(await Photo.getAll());
    setLoading(false);
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;

    if(file && file.size > 0) {
      setUploading(true);
      let result = await Photo.insert(file);
      setUploading(false);

      if(result instanceof Error) {
        alert(`${result.name} - ${result.message}`);
      } else {
        let newPhotoList = [...photos];
        newPhotoList.push(result);
        setPhotos(newPhotoList);
      }
    }
  }

  const handleDeleteClick = async (name: string) => {
    await Photo.deletePhoto(name);
    getPhotos();
  }

  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de Fotos</C.Header>

        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" value="Enviar" />
          {uploading && "Enviando..."}
        </C.UploadForm>

        {loading && 
          <C.ScreenWarning>
            <div className='emoji'>🤚</div>
            <div>Carregando...</div>
          </C.ScreenWarning>
        } 
        

        {!loading && photos.length > 0 &&
          <C.PhotoList>
            {photos.map((item, index)=>(
              <PhotoItem
                key={index}
                url={item.url}
                name={item.name}
                onDelete={handleDeleteClick}
              />
            ))}
          </C.PhotoList>
        }

        {!loading && photos.length === 0 &&
          <C.ScreenWarning>
            <div className='emoji'>⚠</div>
            <div>Não há fotos cadastradas.</div>
          </C.ScreenWarning>
        }
      </C.Area>
    </C.Container>
  );
}

export default App;