import { IonContent, IonFab, IonFabButton, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import './Home.css';
import {camera} from 'ionicons/icons';
import { usePhotoGalery } from '../hooks/usePhotoGalery';
import PhotoGalery from './PhotoGallery';
const Home: React.FC = () => {
  const {photos, takePhoto, deletePhoto} =usePhotoGalery()
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Galery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <PhotoGalery photos={photos} deletePhoto={deletePhoto}/>

         <IonFab vertical="bottom" horizontal='center' slot='fixed'>
          <IonFabButton onClick={() => {takePhoto()}} color="dark">
              <IonIcon icon={camera}/>
          </IonFabButton>
         </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
