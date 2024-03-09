import { Router } from "express";
import userModel from "../dao/models/user.model.js";

const router = Router();

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await userModel.findOne({ email });

    if (exists) {
        return res.status(400).send({
            status: "error",
            error: "El usuario ya existe"
        });
    }

    const user = {
        first_name,
        last_name,
        email,
        age,
        password
    };

    try {
        await userModel.create(user);
        res.send({
            status: "success",
            message: "Usuario registrado exitosamente"
        });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send({
            status: "error",
            error: "Error al registrar el usuario"
        });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email, password });

        if (!user) {
            return res.status(400).send({
                status: "error",
                error: "Credenciales incorrectas"
            });
        }

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age
        };

        res.send({
            status: "success",
            payload: req.session.user,
            message: "¡Inicio de sesión exitoso!"
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).send({
            status: "error",
            error: "Error al iniciar sesión"
        });
    }
});

router.get("/logout", (req, res) => {
    console.log("Antes:", req.session);
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).send({
                status: "error",
                error: "No se pudo cerrar sesión"
            });
        }
        res.redirect("/login");
    });
    console.log("Después:", req.session);
});

export default router;
