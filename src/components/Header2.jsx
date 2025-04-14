import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import logo from "../assets/vaquinha.png";

// Cores:
const rosaClarinho = "#FAD9D1";
const rosaPessego = "#FF9B8B";
const rosaBlush = "#EF7E6D";
const rosaVermelhinho = "#892E2E";

const useStyles = makeStyles({
  header: {
    zIndex: 2,
    position: "fixed",
    top: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "35px",
    padding: "0.8% 0",
    backgroundColor: "white",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
    fontFamily: "Montserrat",
  },

  link: {
    textDecoration: "none",
  },

  logo: {
    width: "100%",
    marginLeft: "25%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Agbalumo",
    fontSize: "150%",
    "& img": {
      width: "50px",
    },
  },

  clube: {
    color: rosaVermelhinho,
  },

  leiteras: {
    color: rosaPessego,
  },

  search: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2%",
    width: "100%",
    "& button": {
      backgroundColor: "black",
      color: "white",
      borderRadius: "6px",
      border: "none",
      padding: "10px 15px",
      cursor: "pointer",
    },
    "& input": {
      borderRadius: "6px",
      border: `2px solid ${rosaPessego}`,
      padding: "10px 15px",
      width: "40%",
    },
  },

  options: {
    marginRight: "4%",
    display: "flex",
    gap: "15%",
    "& a": {
      color: "black",
      textDecoration: "none",
      fontSize: "85%",
      cursor: "pointer",
    },
    "& a:hover": {
      color: rosaBlush,
      textShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
    },
  },

  resultCard: {
    border: "1px solid #ddd",
    padding: "10px",
    margin: "10px",
    display: "flex",
    alignItems: "center",
  },

  resultImage: {
    width: "128px",
    height: "auto",
    marginRight: "10px",
  },

  resultInfo: {
    fontFamily: "Arial, sans-serif",
  },
});

function Header() {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const apiKey = "AIzaSyAYa0pAMWc6pwPwZqKQYhMDifIl6woRDSA";
        const maxResults = 20; // Aumentando o número de resultados
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&langRestrict=pt&maxResults=${maxResults}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            navigate("/buscaErro", { state: { query: searchTerm } });
            return;
        }


        const booksData = data.items.map((livro) => {
          const nomeLivro = livro.volumeInfo.title;
          const nomeAutor = livro.volumeInfo.authors ? livro.volumeInfo.authors.join(", ") : "Autor desconhecido";
          const anoPublicacao = livro.volumeInfo.publishedDate ?
              livro.volumeInfo.publishedDate.substring(0, 4) || "Data não disponível" :
              "Data não disponível"; // Adicionada verificação para publishedDate
          const capa = livro.volumeInfo.imageLinks?.thumbnail || require("../assets/capaDefault.png");
          const sinopse = livro.volumeInfo.description || "Sinopse não disponível.";
          const categorias = livro.volumeInfo.categories?.join(", ") || "Categoria não disponível";
      
          return {
              nomeLivro,
              nomeAutor,
              anoPublicacao,
              capa,
              sinopse,
              categorias,
          };
      });

      navigate("/resultados", { state: { books: booksData, query: searchTerm } });
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      navigate("/buscaErro", { state: { query: searchTerm } });
    }
  };

  return (
    <>
      <div className={classes.header}>
        <Link to="/home" className={classes.link}>
          <div className={classes.logo}>
            <img src={logo} alt="Logo" />
            <h5 className={classes.clube}>Clube</h5>
            <h5 className={classes.leiteras}>Leiteras</h5>
          </div>
        </Link>

        <div className={classes.search}>
          <input
            type="text"
            placeholder="Pesquisar livro"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>BUSCAR</button>
        </div>

        <div className={classes.options}>
          <Link to="/favoritados">Favoritados</Link>
          <Link to="/perfil">Perfil</Link>
        </div>
      </div>
    </>
  );
}

export default Header;
