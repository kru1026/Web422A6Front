import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/authenticate';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '@/lib/userData';

const PUBLIC_PATHS = ['/login', '/', '/_error', '/register'];

export default function RouteGuard(props) {

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom); 
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);  

  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {

    updateAtoms();
    
    authCheck(router.pathname);

    
    router.events.on('routeChangeComplete', authCheck);

    
    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  async function updateAtoms(){
    setFavouritesList(await getFavourites()); 
    setSearchHistory(await getHistory()); 
  }

  function authCheck(url) {
    
    const path = url.split('?')[0];
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
      setAuthorized(false);
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }

  return <>{authorized && props.children}</>
}