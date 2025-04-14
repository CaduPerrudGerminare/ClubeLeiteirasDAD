const apiKey = "AIzaSyAYa0pAMWc6pwPwZqKQYhMDifIl6woRDSA";
const query = "harry potter";
fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:harry+potter&maxResults=5&key=${apiKey}`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Erro:", error));
