import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationtoTimeString';

type Episode = {
  id: string,
  title: string,
  members: string,
  published_at: string,
  thumbnail: string,
  description: string,
  url: string,
  duration: number,
  durationAsString: string,
}

type HomeProps = {
  episodes: Episode[],
}

//SSG
export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  //usando fetch
  // const response = await fetch('http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc');
  // const data = await response.json();

  //usando axios
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      published_at: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  });

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8, //revalidate - tempo em segundos, serve para dizer a cada quanto tempo se quer que seja gerada uma nova página estática (gera uma nova chamada para a API).
  }                          //nesse exemplo, seria gerada a cada 8 horas  
}



//SSR
// export default function Home(props) {
//   return (
//     <div>
//       <h1>Index</h1>
//       <p>{JSON.stringify(props.episodes)}</p>
//     </div>
//   )
// }

// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes');
//   const data = await response.json();

//   return {
//     props: {
//       episodes: data,
//     }
//   }
// }

//SPA
// import { useEffect } from 'react';

// export default function Home() {
//   useEffect(() => {
//     fetch('http://localhost:3333/episodes')
//       .then(response => response.json())
//       .then(data => console.log(data));
//   }, []);

//   return (
//     <h1>Index</h1>
//   )
// }



