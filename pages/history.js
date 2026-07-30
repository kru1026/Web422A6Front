import { searchHistoryAtom } from "@/store";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { ListGroup, Button, Card } from "react-bootstrap";
import styles from '@/styles/History.module.css';
import { removeFromHistory } from "@/lib/userData";


export default function History(){

const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

const router = useRouter();

if(!searchHistory) return null;

let parsedHistory = [];

searchHistory.forEach(h => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
});

function historyClicked(e, index){
    
    router.push(`/artwork?${searchHistory[index]}`)
}

async function removeHistoryClicked(e, index){
    e.stopPropagation(); 
    setSearchHistory(await removeFromHistory(searchHistory[index])); 
}

if (parsedHistory.length==0){
    return <Card><Card.Body><h4>Nothing Here</h4>Try searching for some artwork.</Card.Body></Card>;
}
else{
    
    return (<>
    
    <ListGroup>                  
    
     {parsedHistory.map((e, index)=>
     <ListGroup.Item key={index} className={styles.historyListItem} onClick={(e)=>historyClicked(e, index)}>
     {Object.keys(e).map(element => (<>{element}: <strong>{e[element]}</strong>&nbsp;</>))}
     <Button className="float-end" variant="danger" size="sm" 
      onClick={e => removeHistoryClicked(e, index)}>&times;
     </Button>
     </ListGroup.Item>)}
    
    </ListGroup> 
     
    </>)
}}