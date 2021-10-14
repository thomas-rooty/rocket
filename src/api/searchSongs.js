export default async function searchSongs(value){
  var Url = 'http://136.244.119.40:8000/api/musics/search/'+value;
  return await fetch(Url, {
    method : 'GET'
  })
  .then(response => response.json())
  .catch(err => console.log(err))
}
