import useSWR from 'swr';
import { Card, Button } from 'react-bootstrap';
import Error from 'next/error';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { useState, useEffect } from 'react';
import { addToFavourites } from '@/lib/userData';
import { removeFromFavourites } from '@/lib/userData';


 export default function ArtworkCardDetail(props) {

      const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
      const [showAdded, setShowAdded] = useState(false);

      useEffect(()=>{
        setShowAdded(favouritesList?.includes(props.objectID))
      }, [favouritesList])
    
      const { data, error } = useSWR(props.objectID?`https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`:null);
     
      if (error){
        return <Error statusCode={404} />;
      }

      if (!data){
        return null;
      }

      if (!data?.objectID){
        return <Error statusCode={404} />;
      }
      
      async function favouritesClicked(){
        if (showAdded){
          setFavouritesList(await removeFromFavourites(props.objectID)) 
          setShowAdded(false);
        }
        else{
          
          setFavouritesList(await addToFavourites(props.objectID))
          setShowAdded(true);
        }
      }

      return (
        <>
      
     <Card>
      {data?.primaryImage? <Card.Img variant="top" src={data?.primaryImage}/> : "" }
      <Card.Body>
        <Card.Title>{data?.title || "N/A"}</Card.Title>
        <Card.Text>
          <b>Date: </b>{data?.objectDate || "N/A"}<br />
          <b>Classification: </b>{data?.classification || "N/A"}<br />
          <b>Medium: </b>{data?.medium|| "N/A"}<br /><br />
          <b>Artist: </b>{data?.artistDisplayName || "N/A"}
          
          {(data?.artistDisplayName && data?.artistWikidata_URL) && ' ( '}
          
          {(data?.artistDisplayName && data?.artistWikidata_URL) &&
          <a href={data?.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a>}

          {(data?.artistDisplayName && data?.artistWikidata_URL) && ' )'}<br />

          <b>Credit Line: </b>{data?.creditLine || "N/A"}<br />
          <b>Dimensions: </b>{data?.dimensions || "N/A"}
          <br /><br />
          {/* <Button variant={showAdded? "primary":"outline-primary"} onClick={favouritesClicked} >
          {showAdded? "+ Favourite (added)":"+ Favourite"}
          </Button> */}
          {showAdded ? (
          <Button variant="primary" onClick={favouritesClicked}>
              Remove Favourite
          </Button>
            ) : (
              <Button variant="outline-primary" onClick={favouritesClicked}>
              + Favourite
          </Button>
          )}
          </Card.Text>
        </Card.Body>
    </Card>
  
        </>
      );
}
