export default async function addFavUser(UserID,MusicID){
  var Url = 'http://136.244.119.40:8000/api/fav/add/'+ UserID + '/' + MusicID
  console.log(Url)
  return await fetch(Url, {
    method : 'GET'
  })
  .then(response => response)
  .catch(err => console.log(err))
}
