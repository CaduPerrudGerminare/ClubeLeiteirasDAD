import React, { useEffect, useState } from "react";
import Book from '../components/Book';
import BookCarrousel from '../components/BookCarrousel';
import Header2 from '../components/Header2';
import Slogan from '../components/Slogan';
import fraseDia from "../assets/fraseDia.png";
import { makeStyles } from "@mui/styles";

/* Cores: */
const rosaClarinho = "#FAD9D1";
const rosaPessego = "#FF9B8B";
const rosaBlush = "#EF7E6D";
const rosaVermelhinho = "#892E2E";
const amareloSol = "#FACC15";

const useStyles = makeStyles({
  container: {
    margin: "5% 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 80,
  },
  box1: {
    zIndex: -1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "30px",
    padding: "1.5% 5%",
    width: "40%",
    border: `3px solid ${rosaVermelhinho}`,
    "& img": {
      zIndex: -1,
      position: "relative",
      right: "-80%",
      width: "35%",
    },
    "& h3": {
      zIndex: -1,
      padding: "0 0.5%",
      position: "absolute",
      top: "203.5%",
      left: "27%",
      color: rosaVermelhinho,
      backgroundColor: "white",
    },
  },


  textoFrase: {
    marginLeft: "-50%",
    width: "90%",
    textAlign: "start",
  },
  frase: {
    fontSize: "20px",
  },
  nomeLivroFrase: {
    marginTop: "4%",
    textAlign: "end",
    fontWeight: "bold",
  },
  box2: {
    zIndex: -1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "30px",
    padding: "1.5% 5%",
    width: "40%",
    border: `3px solid ${rosaVermelhinho}`,
    "& h3": {
      zIndex: -1,
      padding: "0 0.5%",
      position: "absolute",
      bottom: "-158.9%",
      right: "27%",
      color: rosaVermelhinho,
      backgroundColor: "white",
  },
},
  bookContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  book: {
    zIndex: 1,
    position: "relative",
    display: "flex",
    justifyContent: "flex-end",
    width: "120px",
    height: "150px",
    borderRadius: "20px 12px 12px 20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    alignItems: "flex-end",
    overflow: "hidden",
    cursor: "pointer",
  },
  cover: {
    position: "absolute",
    top: 0,
    width: "81%",
    height: "80%",
    borderRadius: "0px 12px 0px 0px",
  },
  bottomBar: {
    width: "84%",
    height: "10%",
    backgroundColor: "#EDE6DE",
    position: "absolute",
    bottom: 10,
    borderRadius: "8px 0px 0px 8px",
  },
  bookmark: {
    position: "absolute",
    bottom: "0.8%",
    left: "75%",
    width: "10%",
    height: "16%",
    backgroundColor: amareloSol,
    borderRadius: "2px",
    "&::after": {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 0,
      height: 0,
      borderLeft: "5px solid transparent",
      borderRight: "5px solid transparent",
      borderBottom: `7px solid ${rosaVermelhinho}`,
    },
  },
  textoLivro: {
    marginLeft: "-15%",
    width: "135%",
    textAlign: "start",
  },
  livroDia: {
    zIndex: -1,
    position: "relative",
    left: "-25%",
    transform: "rotate(-8deg)",
  },
  nomeLivro: {
    fontWeight: "bold",
  },
});

const LandingPage_PosLogin = ({ capa }) => {
  const classes = useStyles();
  const [dadosLivro, setDadosLivro] = useState({
    frase: '',
    nomeLivro: '',
    sinopse: '',
    capa: '',
  });

  useEffect(() => {
    fetch('https://clubeleiteirasdad-1.onrender.com/frase-do-dia')
      .then(res => res.json())
      .then(data => {
        setDadosLivro(data);
      })
      .catch(err => {
        console.error("Erro ao buscar frase do dia:", err);
      });
  }, []);

  useEffect(() => {
        if (dadosLivro.nomeLivro && !dadosLivro.capa) {
          const fetchCapaLivro = async () => {
            try {
              const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(dadosLivro.nomeLivro)}&langRestrict=pt&key=AIzaSyAYa0pAMWc6pwPwZqKQYhMDifIl6woRDSA`
              );
              const result = await response.json();
      
              if (result.items && result.items.length > 0) {
                const livro = result.items[0];
                const imagem = livro.volumeInfo?.imageLinks?.thumbnail || '';
      
                if (imagem && imagem !== dadosLivro.capa) {
                  setDadosLivro(prev => ({
                    ...prev,
                    capa: imagem,
                  }));
                }
              }
            } catch (error) {
              console.error("Erro ao buscar capa do livro:", error);
            }
          };
      
          fetchCapaLivro();
        }
      }, [dadosLivro.nomeLivro, dadosLivro.capa]);
  

  return (
    <>
      <Header2 />
      <Slogan />
      <BookCarrousel />

      <div className={classes.container}>
        <div className={classes.box1}>
          <img src={fraseDia} alt="fraseDiaImg" />
          <h3>Frase do Dia:</h3>
          <div className={classes.textoFrase}>
            <p className={classes.frase}>{dadosLivro.frase}</p>
            <p className={classes.nomeLivroFrase}>{dadosLivro.nomeLivro}</p>
          </div>
        </div>

        <div className={classes.box2}>
          <div className={classes.livroDia}>
            <div className={classes.bookContent}>
              <div className={classes.book} style={{ backgroundColor: rosaVermelhinho }}>
                <img src={dadosLivro.capa || capa} className={classes.cover} alt="Capa do livro" />
                <div className={classes.bottomBar}></div>
                <div className={classes.bookmark}></div>
              </div>
            </div>
          </div>

          <h3>Livro do Dia:</h3>
          <div className={classes.textoLivro}>
            <p className={classes.nomeLivro}>{dadosLivro.nomeLivro}</p>
            <p className={classes.sinopse}>{dadosLivro.sinopse}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage_PosLogin;
