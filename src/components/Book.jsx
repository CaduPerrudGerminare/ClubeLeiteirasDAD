import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from 'react-router-dom';

/* Cores */
const rosaClarinho = "#FAD9D1";
const rosaPessego = "#FF9B8B";
const rosaBlush = "#EF7E6D";
const rosaVermelhinho = "#892E2E";
const verdeConfirmado = "#4CAF50";
const amareloSol = "#FACC15";

const useStyles = makeStyles({
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
            borderBottom: (props) => `7px solid ${props.bgColor}`,
        },
    },
    bookTitle: {
        width: "100px",
        marginTop: "7%",
        textAlign: "center",
        fontSize: "12px",
    },
    popupOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    popupContent: {
        width: "70%",
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
    popupCard: {
        marginTop: "2%",
        width: "90%",
        height: "90%",
        display: "flex",
    },
    popupInfos: {
        margin: "0 2%",
        textAlign: "start",
        width: "90%",
        height: "44%",
        "& p": {
            fontSize: "14px",
            padding: "0 15px",
            textAlign: "justify",
        }
    },
    nomeAutor: {
        fontSize: "small",
    },
    capaPopup: {
        marginRight: "20px",
        borderRadius: "20px",
        width: "200px",
        height: "240px",
    },
    popupFooter: {
        margin: "0 0 1%",
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
});

const BookCard = ({ nomeLivro, capa, sinopse, nomeAutor, anoPublicacao, categorias }) => {
    const classes = useStyles();
    const [bgColor, setBgColor] = useState(rosaVermelhinho);
    const [showPopup, setShowPopup] = useState(false);
    const [favorito, setFavorito] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const [statusLivro, setStatusLivro] = useState({
        disponivel: true,
        emprestadoPorUsuario: false
    });

    // Função para verificar favoritos
    const verificarFavorito = async () => {
        const usuario = sessionStorage.getItem("usuario");
        if (!usuario) {
            setFavorito(false);
            return;
        }
    
        try {
            const response = await fetch('https://clubeleiteirasdad-1.onrender.com/verificarFavorito', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    nomeLivro: nomeLivro,
                    usuario: usuario 
                }),
            });
    
            const data = await response.json();
            setFavorito(data.favorito);
            
        } catch (error) {
            console.error("Erro ao verificar favorito:", error);
            setFavorito(false);
        }
    };

    // Função para alternar favoritos
    const toggleFavorito = async () => {
        const usuario = sessionStorage.getItem("usuario");
        if (!usuario) {
            alert("Faça login para gerenciar favoritos");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch('https://clubeleiteirasdad-1.onrender.com/toggleFavorito', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    titulo: nomeLivro,
                    usuario_id: usuario
                }),
            });

            const data = await response.json();
            setFavorito(data.favorito);
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    // Funções de empréstimo
    const realizarEmprestimo = async () => {
        const response = await fetch('https://clubeleiteirasdad-1.onrender.com/realizarEmprestimo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nomeLivro,
                usuario: sessionStorage.getItem("usuario")
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao realizar empréstimo");
        }
    };

    const verificarDisponibilidade = async () => {
        try {
            const usuario = sessionStorage.getItem("usuario");
            if (!usuario) return;

            const response = await fetch('https://clubeleiteirasdad-1.onrender.com/verificarDisponibilidade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ nomeLivro, usuario }),
            });

            const data = await response.json();
            
            setStatusLivro({
                disponivel: data.disponivel,
                emprestadoPorUsuario: data.mesmo_usuario
            });
        } catch (error) {
            console.error("Erro:", error);
            setStatusLivro({
                disponivel: false,
                emprestadoPorUsuario: false
            });
        }
    };

    const devolverEmprestimo = async () => {
        try {
            const usuario = sessionStorage.getItem("usuario");
            if (!usuario) {
                throw new Error("Usuário não logado");
            }

            const response = await fetch('https://clubeleiteirasdad-1.onrender.com/devolverEmprestimo', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    nomeLivro,
                    usuario_id: usuario
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao devolver livro");
            }

            await verificarDisponibilidade();
            alert("Livro devolvido com sucesso!");
        } catch (error) {
            console.error('Erro ao devolver livro:', error);
            alert(error.message);
        }
    };

    const handleEmprestimo = async () => {
        try {
            await verificarDisponibilidade();
            
            const { disponivel, emprestadoPorUsuario } = statusLivro;
            
            if (disponivel) {
                const response = await realizarEmprestimo();
                if (response.error) {
                    setErrorMessage(response.error);
                } else {
                    setStatusLivro({
                        disponivel: false,
                        emprestadoPorUsuario: true
                    });
                }
            } else if (emprestadoPorUsuario) {
                const confirmacao = window.confirm(
                    "Você já tem este livro emprestado. Deseja devolvê-lo?"
                );
                if (confirmacao) {
                    await devolverEmprestimo();
                    setStatusLivro({
                        disponivel: true,
                        emprestadoPorUsuario: false
                    });
                }
            } else {
                alert("Este livro já está emprestado por outro usuário.");
            }
        } catch (error) {
            console.error("Erro no empréstimo/devolução:", error);
            setErrorMessage(error.message);
        }
    };

    const handleBookClick = async () => {
        try {
            await verificarDisponibilidade();
            await verificarFavorito();
            setShowPopup(true);
        } catch (error) {
            console.error("Erro ao verificar livro:", error);
            setErrorMessage("Erro ao carregar informações do livro");
        }
    };

    // Efeitos para sincronização
    useEffect(() => {
        if (showPopup) {
            verificarFavorito();
            verificarDisponibilidade();
        }
    }, [showPopup, nomeLivro]);

    useEffect(() => {
        const handleStorageChange = () => {
            const usuario = sessionStorage.getItem("usuario");
            if (!usuario) {
                setFavorito(false);
            } else if (showPopup) {
                verificarFavorito();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [showPopup]);

    return (
        <div className={classes.bookContent}>
            <div 
                className={classes.book} 
                style={{ backgroundColor: bgColor }} 
                onClick={handleBookClick}
            >
                <img src={capa} alt={nomeLivro} className={classes.cover} />
                <div className={classes.bottomBar}></div>
                <div className={classes.bookmark}></div>
            </div>
            <p className={classes.bookTitle}>{nomeLivro}</p>
            
            {showPopup && (
                <div className={classes.popupOverlay} onClick={() => setShowPopup(false)}>
                    <div className={classes.popupContent} onClick={(e) => e.stopPropagation()}>
                        <div className={classes.popupCard}>
                            <div style={{ display: "flex", alignItems:"center", flexDirection: "column" }}>
                                <img src={capa} alt={nomeLivro} width="100" className={classes.capaPopup}/>
                            </div>
                            <div className={classes.popupInfos}>
                                <h3>{nomeLivro}:</h3>
                                <p>{sinopse}</p>
                                <div style={{ display: "flex" }}>
                                    <p className={classes.nomeAutor}><strong>Autor: </strong> {nomeAutor}</p>
                                    <p className={classes.nomeAutor}><strong>Ano de publicação: </strong> {anoPublicacao}</p>
                                    <p className={classes.nomeAutor}><strong>Categoria: </strong> {categorias}</p>
                                </div>
                            </div>
                        </div>

                        <div className={classes.popupFooter}>
                            <button
                                className={classes.button}
                                onClick={toggleFavorito}
                                style={{
                                    backgroundColor: favorito ? amareloSol : rosaPessego,
                                    color: "#FFF"
                                }}
                                disabled={!sessionStorage.getItem("usuario")}
                            >
                                {!sessionStorage.getItem("usuario") ? "Faça login para favoritar" :
                                favorito ? "★ Livro Favoritado" : "✩ Favoritar Livro"}
                            </button>
                           
                            <button
                                className={classes.button}
                                onClick={handleEmprestimo}
                                style={{
                                    backgroundColor: statusLivro.emprestadoPorUsuario ? verdeConfirmado : 
                                                statusLivro.disponivel ? rosaPessego : rosaBlush,
                                    cursor: (statusLivro.disponivel || statusLivro.emprestadoPorUsuario) ? "pointer" : "not-allowed"
                                }}
                                disabled={!statusLivro.disponivel && !statusLivro.emprestadoPorUsuario}
                            >
                                {statusLivro.emprestadoPorUsuario ? "Devolver Livro" :
                                statusLivro.disponivel ? "Realizar Empréstimo" : "Livro Indisponível"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookCard;