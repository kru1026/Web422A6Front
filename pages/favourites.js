import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { Card, Row, Col } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard";


export default function Favourites(){

const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

if(!favouritesList) return null;

if (favouritesList){

    if (favouritesList?.length>0){
    var ret1 = favouritesList.map((e) => <Col lg={3} key={e}><ArtworkCard objectID={e} /></Col>); 
    }
    if (favouritesList?.length==0){
        ret1 = <Card><Card.Body><h4>Nothing Here</h4>Try adding some new artwork to the list.</Card.Body></Card>;
    }
    
    return <Row className="gy-4">{ret1}</Row>;
}
}
