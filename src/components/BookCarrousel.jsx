import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import BookCard from "./Book";

const rosaVermelhinho = "#892E2E";

const useStyles = makeStyles({
    container: {
        margin: "2% 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    bookContainer: {
        display: "flex",
        gap: 25,
        margin: "0 15px",
        width: "100%",
        flexWrap: "wrap",
    },
    bookList: {
        margin: "1% 0",
    },
    carousel: {
        width: "fit-content",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    button: {
        "&:hover": {
            backgroundColor: "transparent",
        },
    },
});

const Carrousel = ({ divisaoTitulo, livros }) => {
    const classes = useStyles();
    const [indice, setIndice] = useState(0);

    const avancar = () => {
        if (indice + 5 < livros.length) setIndice(indice + 1);
    };

    const voltar = () => {
        if (indice > 0) setIndice(indice - 1);
    };

    return (
        <div className={classes.bookList}>
            <h2>{divisaoTitulo}</h2>
            <div className={classes.carousel}>
                <Button onClick={voltar} disabled={indice === 0} className={classes.button} style={{ color: rosaVermelhinho }}>❮</Button>

                <div className={classes.bookContainer}>
                    {Array.isArray(livros) && livros.slice(indice, indice + 5).map((livro, index) => (
                        <BookCard 
                            key={index}
                            nomeLivro={livro.nomeLivro}
                            capa={livro.capa}
                            sinopse={livro.sinopse}
                            nomeAutor={livro.nomeAutor}
                            anoPublicacao={livro.anoPublicacao}
                            categorias={livro.categorias}
                        />
                    ))}
                </div>

                <Button onClick={avancar} disabled={indice + 5 >= livros.length} className={classes.button} style={{ color: rosaVermelhinho }}>❯</Button>
            </div>
        </div>
    );
};

const CarrouselBooks = () => {
    const classes = useStyles();
    const [livros, setLivros] = useState([]);
    const [livros_favoritos, setLivrosFavoritos] = useState([])
    const telefoneEmail = sessionStorage.getItem("usuario");


    useEffect(() => {
        fetch(`http://localhost:5000/livros?telefoneemail=${telefoneEmail}`)            
            .then((res) => res.json())
            .then((data) => setLivros(data))
            .catch((error) => console.error("Erro ao buscar livros:", error));
    }, []);
    useEffect(() => {
        fetch(`http://localhost:5000/livrosFavoritos?telefoneemail=${telefoneEmail}`)
            .then((res) => res.json())
            .then((data) => setLivrosFavoritos(data))
            .catch((error) => console.error("Erro ao buscar livros:", error));
    }, []);

    return (
        <div className={classes.container}>
            <Carrousel divisaoTitulo="Últimos Favoritados:" livros={livros_favoritos} />
            <Carrousel divisaoTitulo="Últimos Empréstimos:" livros={livros} />
        </div>
    );
};

export default CarrouselBooks;