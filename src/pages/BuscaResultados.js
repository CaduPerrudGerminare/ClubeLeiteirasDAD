import React from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Header2 from "../components/Header2";
import BookCard from "../components/Book";

const useStyles = makeStyles({
  boxResultados: {
    padding: "0.2% 4%",
    marginTop: "4.5%",

    "& p": {
        fontSize: "small",
    },
  },

  bookList: {
    width: "100%",
    margin: "3.5% 0",
    display: "flex",
    flexWrap: "wrap",
    gap: "5%",
    justifyContent: "center",
  },
});

function BuscaResultados() {
  const classes = useStyles();
  const location = useLocation();
  const books = location.state?.books || [];
  const searchQuery = location.state?.query;

  return (
    <div className={classes.container}>
        <Header2 />

        <div className={classes.boxResultados}>
            <p style={{ display: "flex", justifyContent: "start" }}>Livros achados para a busca: <strong style={{ marginLeft: "5px" }}> {searchQuery}</strong></p>

            <div className={classes.bookList}>
                {books.length > 0 ? (
                books.map((book, index) => <BookCard key={index} {...book} />)
            ) : (
                <p>Nenhum livro encontrado.</p>
            )}
            </div>
        </div>
    </div>
  );
}

export default BuscaResultados;
