import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Link } from 'react-router-dom';
import manchinhas from "../assets/manchinhas-blur.png";
import fotoPerfil from "../assets/default-perfil.png";
import vaquinha from "../assets/vaquinha-com-borda.png";
import clubeNome from "../assets/clube-nome.png";
import lapis from "../assets/lapis.png";
import Header2 from "../components/Header2";
import { useNavigate } from 'react-router-dom';

/* Cores: */
const rosaClarinho = "#FAD9D1";
const rosaPessego = "#FF9B8B";
const rosaBlush = "#EF7E6D";
const rosaVermelhinho = "#892E2E";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    backgroundImage: `url(${manchinhas})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  carteirinhaContainer: {
    top: "4%",
    position: "relative",
    width: "40%",
    height: "55%",
    perspective: "1000px",
  },

  carteirinha: {
    width: "100%",
    height: "100%",
    position: "absolute",
    transformStyle: "preserve-3d",
    transition: "transform 0.6s ease-in-out",
  },

  flipped: {
    transform: "rotateY(180deg)",
  },

  frente: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 40,
    border: `3px solid ${rosaBlush}`,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },

  verso: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 40,
    border: `3px solid ${rosaBlush}`,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transform: "rotateY(180deg)",
    backfaceVisibility: "hidden",
  },

  titulo: {
    margin: "0 0 1% 0",
  },

  informacoes: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  forms: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
  },

  input: {
    width: "90%",
    height: "32px",
    padding: "5px 10px",
    borderRadius: 10,
    border: `3px solid ${rosaClarinho}`,
    outline: "none",
  },

  label: {
    position: "relative",
    top: 10,
    left: 20,
    padding: "0 5px",
    fontSize: "small",
    backgroundColor: "white",
  },

  fotoPerfil: {
    marginTop: "2%",
    width: "35%",
    height: "50%",
    borderRadius: 20,
  },

  editar: {
    position: "absolute",
    top: "6%",
    right: "5%",
    width: "5%",
    cursor: "pointer",
  },

  img: {
    width: "40%",
  },

  clubeNome: {
    width: "50%",
  },

  // Estilos do pop-up
  popupOverlay: {
    position: "fixed",
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  popupContent: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  },

  tituloEditar: {
    margin: "2% 0 -2% 0",
  },

  editarPopup: {
    marginLeft: "-6%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  formsEditar: {
    width: "80%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },

  inputEditar: {
    width: "100%",
    height: "32px",
    padding: "5px 10px",
    borderRadius: 10,
    border: `3px solid ${rosaClarinho}`,
    outline: "none",
  },

  labelEditar: {
    position: "relative",
    top: 10,
    right: 140,
    padding: "0 5px",
    fontSize: "small",
    backgroundColor: "white",
  },

  button: {
    margin: "2% 20px 2%",
    padding: "8px 15px",
    border: "none",
    backgroundColor: rosaPessego,
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: rosaBlush,
    },
  },
}));

const Perfil = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [virado, setVirado] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [userData, setUserData] = useState({
    nome: "",
    telefone: "",
    email: "",
    usuario: sessionStorage.getItem("usuario")
  });
  const [editData, setEditData] = useState({
    nome: "",
    telefone: "",
    email: ""
  });

  // Função para atualizar os campos editáveis
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para enviar as alterações para o backend
  const handleSubmitEdit = async () => {
    try {
      const response = await fetch("https://clubeleiteirasdad-1.onrender.com/editarPerfil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          usuario: sessionStorage.getItem("usuario"),
          nome: editData.nome,
          telefone: editData.telefone,
          email: editData.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar perfil");
      }

      // Atualiza os dados locais e fecha o popup
      setUserData(prev => ({
        ...prev,
        nome: editData.nome,
        telefone: editData.telefone,
        email: editData.email
      }));
      setPopupOpen(false);
      
    } catch (error) {
      console.error("Erro ao editar perfil:", error);
      alert(error.message);
    }
  };

  // Função para buscar os dados do usuário (atualizada)
  const fetchUserData = async () => {
    try {
      const usuario = sessionStorage.getItem("usuario");
      if (!usuario) {
        throw new Error("Usuário não autenticado");
      }
  
      const response = await fetch("https://clubeleiteirasdad-1.onrender.com/preencherCarteirinha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ usuario })
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }
  
      const data = await response.json();
      setUserData({
        ...data,
        usuario,
        usuario_id: sessionStorage.getItem("usuario_id")
      });
      setEditData({
        nome: data.nome,
        telefone: data.telefone,
        email: data.email
      });
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      if (error.message.includes("não autenticado")) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
        

  return (
    <div className={classes.container}>
      <Header2 />
      <p style={{ position: "absolute", top: "15%" }}>Clique na carteirinha para vira-lá</p>

      <div className={classes.carteirinhaContainer} onClick={() => setVirado(!virado)}>
        <div className={`${classes.carteirinha} ${virado ? classes.flipped : ""}`}>
          {/* Frente da carteirinha */}
          <div className={classes.frente}>
            <h3 className={classes.titulo}>Carteirinha do Clube</h3>

            <div>
              <div className={classes.informacoes}>
                <form className={classes.forms}>
                  <div onClick={(e) => {e.stopPropagation();}}>
                    <label className={classes.label}>Nome</label>
                    <input className={classes.input} value={userData.nome} readOnly />
                  </div>

                  <div onClick={(e) => {e.stopPropagation();}}>
                    <label className={classes.label}>E-mail</label>
                    <input className={classes.input} value={userData.email} readOnly />
                  </div>

                  <div onClick={(e) => {e.stopPropagation();}}>
                    <label className={classes.label}>Telefone</label>
                    <input className={classes.input} value={userData.telefone} readOnly />
                  </div>
                </form>

                <img src={fotoPerfil} className={classes.fotoPerfil} alt="Perfil" onClick={(e) => {e.stopPropagation();}}/>
              </div>

              <img src={lapis} alt="Editar" className={classes.editar} onClick={(e) => {e.stopPropagation(); setPopupOpen(true);}}/>
            </div>
          </div>

          {/* Verso da carteirinha */}
          <div className={classes.verso}>
            <img src={vaquinha} alt="Logo" className={classes.img} />
            <img src={clubeNome} alt="Clube Nome" className={classes.clubeNome} />
          </div>
        </div>
      </div>

      {popupOpen && (
      <div className={classes.popupOverlay}>
        <div className={classes.popupContent}>
          <h3 className={classes.tituloEditar}>Edite suas informações</h3>

          <div className={classes.editarPopup}>
            <div className={classes.formsEditar}>
              <div>
                <label className={classes.labelEditar}>Nome</label>
                <input 
                  className={classes.inputEditar} 
                  name="nome"
                  value={editData.nome}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div>
              <label className={classes.labelEditar}>E-mail</label>
              <input 
                className={classes.inputEditar} 
                name="email"
                value={editData.email}
                onChange={handleEditChange}
              />
            </div>

            <div>
              <label className={classes.labelEditar}>Telefone</label>
              <input 
                className={classes.inputEditar} 
                name="telefone"
                value={editData.telefone}
                onChange={handleEditChange}
              />
            </div>
          </div>

          <div>
            <button className={classes.button} onClick={handleSubmitEdit}>Salvar</button>
            <button className={classes.button} onClick={() => setPopupOpen(false)}>Cancelar</button>
          </div>
        </div>
      </div>
    )}

      <Link to="/" style={{ position: "absolute", bottom: "4%", color: rosaVermelhinho, textDecoration: "none", fontWeight: "bold" }}>Sair da conta</Link>
    </div>
  );
};

export default Perfil;