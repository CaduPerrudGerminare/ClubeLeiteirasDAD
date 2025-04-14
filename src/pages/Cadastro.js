import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Link, useNavigate } from 'react-router-dom';  // Usando useNavigate
import Header1 from "../components/Header1";
import cadastro from '../assets/facaSeuCadastro.png';
import fundoVacas from '../assets/fundoVacas.png';
import pessoa from '../assets/pessoa.png';
import telefone from '../assets/telefone.png';
import cadeado from '../assets/cadeado.png';
import prancheta from '../assets/prancheta.png';

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
    height: "800px",
  },
  
  cadastro: {
    padding: "4% 0 3%",
    position: "absolute",
    top: "22%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "35%",
    height: "fit-content",
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
    "& #nome": {
      background: `url(${pessoa}) no-repeat 10px center`,
      backgroundSize: "20px",
      paddingLeft: "30px",
    },
    "& #telefone": {
      background: `url(${telefone}) no-repeat 10px center`,
      backgroundSize: "20px",
      paddingLeft: "30px",
    },
    "& #email": {
      background: `url(${prancheta}) no-repeat 10px center`,
      backgroundSize: "20px",
      paddingLeft: "30px",
    },
    "& #senha": {
      background: `url(${cadeado}) no-repeat 10px center`,
      backgroundSize: "20px",
      paddingLeft: "30px",
    },
    "& #confirmarSenha": {
      background: `url(${cadeado}) no-repeat 10px center`,
      backgroundSize: "20px",
      paddingLeft: "30px",
    },
    "& img": {
      padding: "0 2%",
      position: "absolute",
      width: "70%",
      backgroundColor: "white",
      top: "-4%",
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

const Cadastro = () => {
  const classes = useStyles();
  const [nomeCompleto, setNome] = useState('');
  const [senha, setPassword] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();  // Agora você usa o hook useNavigate
  const handleCadastro = async () => {
    // Resetar mensagem de erro
    setErrorMessage('');
  
    const credentials = { 
      nm: nomeCompleto, 
      tel: telefone, 
      em: email, 
      password: senha, 
      cfpassword: confirmarSenha 
    };
  
    try {
      const response = await fetch('https://clubeleiteirasdad.onrender.com//Cadastro', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro no cadastro');
      }

      console.log('Cadastro bem-sucedido:', data);
      sessionStorage.setItem("usuario", email);
      navigate("/home");
      
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
      setErrorMessage(error.message || 'Erro de conexão com o servidor');
    }
};
  
  return (
    <div className={classes.container}>
      <Header1 />

      <form className={classes.cadastro}>
  <img src={cadastro} alt="" />
  <input 
    type="text" 
    placeholder="Nome Completo" 
    id="nome"
    value={nomeCompleto}
    onChange={(e) => setNome(e.target.value)}
  />
  <input 
    type="text"  // Mudei de number para tel para melhor experiência em mobile
    placeholder="Telefone" 
    id="telefone"
    value={telefone}
    onChange={(e) => setTelefone(e.target.value)}
  />
  <input 
    type="email" 
    placeholder="E-mail" 
    id="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <input 
    type="password" 
    placeholder="Senha" 
    id="senha"
    value={senha}
    onChange={(e) => setPassword(e.target.value)}
  />
  <input 
    type="password" 
    placeholder="Confirmar Senha" 
    id="confirmarSenha"
    value={confirmarSenha}
    onChange={(e) => setConfirmarSenha(e.target.value)}
  />
  {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
  <button type="button" onClick={handleCadastro}>Cadastrar</button>
  <p>Já tem uma conta? <Link to="/login"> Entre já!</Link></p>
</form>
    </div>
  );
};

export default Cadastro;
