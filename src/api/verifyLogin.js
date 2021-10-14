export default async function verifyLogin(Mail, Pwd){
  var Url = 'http://136.244.119.40:8000/api/users/' + Mail + "/" + Pwd;
  return await fetch(Url, {
    method : 'GET'
  })
  .then(response => response.json())
  .catch(err => console.log(err))
}
