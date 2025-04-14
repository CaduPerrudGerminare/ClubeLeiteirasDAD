import React from "react";
import { makeStyles } from "@mui/styles";

/* Cores: */
const rosaClarinho = "#FAD9D1";
const rosaPessego = "#FF9B8B";
const rosaBlush = "#EF7E6D";
const rosaVermelhinho = "#892E2E";

const useStyles = makeStyles({
    footer: {
        position: "relative",
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "4.5%",
        padding: "0.2% 0",
        backgroundColor: rosaClarinho,
        fontSize: "small",
        color: rosaVermelhinho,
    }
})

const Footer = () => {
    const classes = useStyles();

    return (
        <div className={classes.footer}>
            <p>©2025 - Clube Leiteras - Todos os direitos estão reservados</p>
        </div>
    );
};

export default Footer;
