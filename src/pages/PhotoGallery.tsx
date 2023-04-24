import { IonCol, IonFab, IonFabButton, IonGrid, IonIcon, IonImg, IonRow, useIonAlert } from "@ionic/react";
import { PhotoItem } from "../Types/PhotoItem";
import { trash } from "ionicons/icons";
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer';


type Props = {
    photos: PhotoItem[],
    deletePhoto: (fileName:string) => void
}

const PhotoGalery: React.FC<Props> = (props) => {
 const [displayAlert] = useIonAlert();

 const viewPhoto = (photo: PhotoItem) => {
   console.log(photo);
   PhotoViewer.show(photo.webviewPath!);
 }

 const confirmDelete = (fileName: string) => {
    displayAlert({
        message: 'Are you sure you want to delete this photo?',
        buttons: [
            {text: 'Cancel', role: 'cancel'},
            {text: 'OK', role: 'confirm'},
        ],
        onDidDismiss: (e) => {
            if(e.detail.role === 'cancel') return
            props.deletePhoto(fileName);
        }
    })
 }


  return (
    <IonGrid>
        <IonRow>
            {props.photos.map((_photo,idx) => 
                <IonCol size="6" key={idx}>
                    <IonFab vertical="bottom" horizontal="center">
                        <IonFabButton
                        onClick={() => confirmDelete(_photo.filePath)}
                        size="small"
                        color="light"
                        >
                            <IonIcon icon={trash} size="small" color="primary"></IonIcon>
                        </IonFabButton>
                    </IonFab>
                    <IonImg src={_photo.webviewPath} onClick={() => {viewPhoto(_photo)}}/>
                </IonCol>
            )}
        </IonRow>
    </IonGrid>
  )
}

export default PhotoGalery;