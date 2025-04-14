import vaquinha from '../assets/vaquinha-com-borda.png';
import manchinhas from '../assets/manchinhas.png';
import clubeNome from '../assets/clube-nome.png';
import { makeStyles } from "@mui/styles";

/* Cores: */
const rosaClarinho = "#FAD9D1";
const rosaPessego = "#FF9B8B";
const rosaBlush = "#EF7E6D";
const rosaVermelhinho = "#892E2E";

const useStyles = makeStyles({
  '@global': {
    '@import': "url('https://fonts.googleapis.com/css2?family=Montserrat&family=Agbalumo&display=swap')",
  },
  
  partePrincipal: {
    marginTop: "-5%",
    backgroundImage: `url(${manchinhas})`,
    backgroundSize: "cover",
    backgroundPosition: 'center',
    width: "100%",
    height: "880px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
  },

  img: {
    width: "34%",
  },

  clubeNome: {
    width: "40%",
  }
});

const Slogan = () =>  {
  const classes = useStyles();

  return (
    <div className={classes.partePrincipal}>
        <img src={vaquinha} alt="Logo" className={classes.img}/>
        <img src={clubeNome} alt="Logo" className={classes.clubeNome}/>
    </div>
  );
}

export default Slogan;
