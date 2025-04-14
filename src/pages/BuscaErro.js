import React from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Header2 from "../components/Header2";
import estante from '../assets/estante.png';

/* Cores: */
const rosaClarinho = "#FAD9D1";
const rosaPessego = "#FF9B8B";
const rosaBlush = "#EF7E6D";
const rosaVermelhinho = "#892E2E";

const useStyles = makeStyles(() => ({
    container: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        margin: "6% 0",
    },

    box: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    searchQuery: {
      position: "absolute",
      top: "10%",
      left: "4%",
      fontSize: "small",
    },

    img: {
      marginTop: "2%",
      width: "30%",
    },

    texto: {
      fontSize: "20px",
      marginLeft: "4%",
      width: "30%",
      textAlign: "center",
    }
}));

const BuscaErro = () => {
  const classes = useStyles();
  const location = useLocation();
  const searchQuery = location.state?.query;

  return (
    <div className={classes.container}>
        <Header2 />
        <p className={classes.searchQuery}>Livros achados para a busca: <strong> {searchQuery}</strong></p>

        <div className={classes.box}>
            <img src={estante} alt="Estante" className={classes.img} />
            <p className={classes.texto}><strong>Este livro não pode ser encontrado!</strong><br />Talvez ele esteja esperando para ser escrito.</p>
        </div>
    </div>
  );
};

export default BuscaErro;