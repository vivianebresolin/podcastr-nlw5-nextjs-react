import { GetStaticProps } from 'next';

type Episode = {
  id: string,
  title: string,
  members: string,
  // ...
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
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
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



