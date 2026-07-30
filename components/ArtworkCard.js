import useSWR from 'swr';
import { Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import Error from 'next/error';


   export default function ArtworkCard(props) {
      const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`);
     
      if (error){
        return <Error statusCode={404} />;
      }

      if (!data){
        return null;
      }

      if (!data?.objectID){
        return <Error statusCode={404} />;
      }
     
      return (
        <>
        
    <Card>
      <Card.Img variant="top" src={data?.primaryImageSmall || `https://via.placeholder.com/375x375.png?text=[+Not+Available+]`}/>
      <Card.Body>
        <Card.Title>{data?.title || "N/A"}</Card.Title>
        <Card.Text>
          <b>Date: </b>{data?.objectDate || "N/A"}<br />
          <b>Classification: </b>{data?.classification || "N/A"}<br />
          <b>Medium: </b>{data?.medium || "N/A"}
        </Card.Text>
        <Link href={`/artwork/${data?.objectID}`} passHref ><Button variant="primary">ID: {data?.objectID}</Button></Link>
      </Card.Body>
    </Card>
  
        </>
      );
    }
