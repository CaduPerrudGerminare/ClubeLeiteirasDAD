import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Link, useNavigate } from 'react-router-dom';  // ✅ Corrigido para evitar duplicação
import Header1 from "../components/Header1";
import login from '../assets/login.png';
import fundoVacas from '../assets/fundoVacas.png';
import cadeado from '../assets/cadeado.png';
import prancheta from '../assets/prancheta.png';

// Código continua...

/* Cores: */
const rosaClarinho = "#FAD9D1";
const rosaPessego = "#FF9B8B";
const rosaBlush = "#EF7E6D";
const rosaVermelhinho = "#892E2E";

const useStyles = makeStyles(() => ({
  container: {
    backgroundImage: `url(${fundoVacas})`,
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "645px",
  },

  login: {
    paddingTop: "2%",
    position: "absolute",
    top: "25%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "35%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: "20px",
    border: `3px solid ${rosaClarinho}`,

    "& input": {
      width: "70%",
      margin: "2% 0",
      padding: "2.5% 0",
      border: `3px solid ${rosaClarinho}`,
      borderRadius: "10px",
    },

    "& #telefoneEmail": {
      background: `url(${prancheta}) no-repeat 10px center`,
      backgroundSize: "20px",
      paddingLeft: "35px",
    },

    "& #senha": {
        background: `url(${cadeado}) no-repeat 10px center`,
        backgroundSize: "22px",
        paddingLeft: "35px",
    },

    "& img": {
      padding: "0 2%",
      position: "absolute",
      width: "60%",
      backgroundColor: "white",
      top: "-8%",
    },

    "& p": {
        fontSize: "small",
        margin: "1.5% 0 0",
    },

    "& a": {
      textDecoration: "none",
      color: "#AB3939",
      fontWeight: "bold",
    },

    "& button": {
      margin: "4% 0",
      padding: "2.5% 5%",
      border: "none",
      backgroundColor: rosaClarinho,
      color: rosaVermelhinho,
      fontWeight: "bold",
      borderRadius: "10px",
      cursor: "pointer",
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
 

  const navigate = useNavigate(); // ✅ Hook precisa estar dentro do componente

  const handleLogin = async () => {
    const credentials = { telefoneEmail: emailOrPhone, senha: password};

    try {
      const response = await fetch('https://clubeleiteirasdad.onrender.com/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Sucesso no login
        console.log('Login bem-sucedido:', data);
        navigate("/home"); // ✅ Correto: usando a função navigate()
        sessionStorage.setItem("usuario",emailOrPhone );
      } else {
        setErrorMessage(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
      setErrorMessage('Erro de conexão');
    }
  };

  return (
    <div className={classes.container}>
        <Header1 />

        <form action="" className={classes.login}>
            <img src={login} alt="" />
            <input
              type="text"
              placeholder="Telefone ou Email"
              name="telefoneEmail"
              id="telefoneEmail"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              name="senha"
              id="senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <button type="button" className="btnEntrar" onClick={handleLogin}>
              ENTRAR
            </button>
            {errorMessage && <p id="erro">{errorMessage}</p>}
            <p>Não tem uma conta?<Link to="/cadastro"> Cadastre-se agora!</Link></p>
        </form>
    </div>
  );
};


export default Login;
