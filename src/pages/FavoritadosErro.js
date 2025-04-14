import React from "react";
import { makeStyles } from "@mui/styles";
import Header2 from "../components/Header2";
import vaca from '../assets/vaca-procurar.png';

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

    img: {
      marginTop: "2%",
      width: "32%",
    },

    texto: {
      fontSize: "17px",
      marginLeft: "4%",
      width: "fit-content",
      textAlign: "center",
    }
}));

const Favoritados = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
        <Header2 />

        <div className={classes.box}>
            <img src={vaca} alt="Vaca" className={classes.img} />
            <p className={classes.texto}><strong>A vaquinha está investigando...mas não encontrou nada!</strong><br/>Salve seus livros favoritos para não perder nenhuma leitura incrível!</p>
        </div>
    </div>
  );
};

export default Favoritados;