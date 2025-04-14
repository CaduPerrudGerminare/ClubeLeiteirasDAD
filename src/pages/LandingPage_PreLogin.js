import React, {useEffect, useState} from "react";
import Header1 from '../components/Header1';
import Slogan from '../components/Slogan';
import mocaLendo from "../assets/mocaLendo2.png";
import mocaLendo2 from "../assets/mocaLendo.png";
import fraseDia from "../assets/fraseDia.png";
import { makeStyles } from "@mui/styles";
import Book from '../components/Book';

/* Cores: */
const rosaClarinho = "#FAD9D1";
const rosaPessego = "#FF9B8B";
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

  sobreNos: {
    marginTop: "-5%",
    padding: "5% 0",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    "& h1": {
      margin: "0",
      fontFamily: "Agbalumo",
      fontSize: "50px",
    },

    "& p": {
      lineHeight: "25px",
      borderRadius: "25px",
      padding: "4% 3%",
      backgroundColor: rosaPessego,
      width: "40%",
    }
  },

  mocaLendo: {
    width: "25%",
  },

  mocaLendo2: {
    width: "30%",
  },

  sobreNosTexto: {
    margin: "0.5% 0 -2%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: "7%",

    "& p": {
      color: "white",
    }
  },

  box1: {
    position: "relative",
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
      padding: "0 1%",
      position: "absolute",
      top: "-15%",
      left: "5%",
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
    position: "relative",
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
      padding: "0 1%",
      position: "absolute",
      right: "5%",
      top: "-20%",
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

const LandingPage_PosLogin = (capa) => {
  const classes = useStyles();
  const [dadosLivro, setDadosLivro] = useState({
      frase: '',
      nomeLivro: '',
      sinopse: '',
      capa: '',
    });
  
    useEffect(() => {
      fetch('http://localhost:5000/frase-do-dia')
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
      <Header1 />
      <Slogan />

      <div className={classes.container}>
        <div className={classes.sobreNos}>
          <h1>O que é o nosso clube?</h1>
          <div class={classes.sobreNosTexto}>
            <p>Nosso clube é um espaço para debate e aprendizado, criado por estudantes instituto J&F com o objetivo de incentivar o hábito de leitura e apoiar outras jovens na jornada dos vestibulares. Nossa proposta é que uma vez ao mês haja o sorteio de pelo menos 2 livros, sendo um, uma obra obrigatória para os vestibulares da Fuvest ou Unicamp e outro indicado pelas membros.</p>
            <img src={mocaLendo} alt="" class={classes.mocaLendo} />
          </div>
          <div class={classes.sobreNosTexto}>
            <img src={mocaLendo2} alt="" class={classes.mocaLendo2} />  
            <p>Durante a leitura do livro obrigatório, é indicada a criação de um documento, que anote os principais pontos e sirva de apoio para a discução sobre a obra. Nossa plataforma serve de apoio para esse processo, a ideia é que cada vez mais essas moças tenham apreço pela literatura.</p>
          </div>
        </div>

        <div className={classes.box1}>
          <img src={fraseDia} alt="fraseDiaImg" />
      
          <h3>Frase do Dia:</h3>
          <div className={classes.textoFrase}>
            <p className={classes.frase} >{dadosLivro.frase}</p>
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
            <p className={classes.nomeLivro} >{dadosLivro.nomeLivro}</p> 
            <p className={classes.sinopse} >{dadosLivro.sinopse}</p> 
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage_PosLogin;