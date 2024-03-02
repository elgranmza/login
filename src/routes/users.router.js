import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { uploader } from "../utils.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const users = await userModel.find();
        res.send({
            status: "success",
            message: users
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al obtener usuarios"
        });
    }
});

router.get("/:uid", async (req, res) => {
    const id = req.params.uid;
    try {
        const user = await userModel.findById(id);
        res.send({
            status: "success",
            message: user
        });
    } catch (error) {
        res.status(404).send({
            status: "error",
            message: "Usuario no encontrado"
        });
    }
});

router.post("/", uploader.single("thumbnail"), async (req, res) => {
    const { first_name, last_name, email } = req.body;
    const filename = req.file.filename;

    if (!first_name || !last_name || !email || !filename) {
        return res.status(400).send({
            status: "error",
            message: "Faltan valores requeridos"
        });
    }

    const user = new userModel({
        first_name,
        last_name,
        email,
        thumbnail: `http://localhost:8080/images/${filename}`
    });

    try {
        const result = await user.save();
        res.send({
            status: "success",
            message: result
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al crear usuario"
        });
    }
});

router.delete("/:uid", async (req, res) => {
    const id = req.params.uid;
    try {
        const result = await userModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            res.status(404).send({
                status: "error",
                message: "Usuario no encontrado"
            });
        } else {
            res.send({
                status: "success",
                message: result
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al eliminar usuario"
        });
    }
});

router.put("/:uid", async (req, res) => {
    const id = req.params.uid;
    const { first_name, last_name, email } = req.body;
    const updateuser = {
        first_name,
        last_name,
        email
    };
    try {
        const result = await userModel.updateOne({ _id: id }, { $set: updateuser });
        res.send({
            status: "success",
            message: result
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al actualizar usuario"
        });
    }
});

export default router;
