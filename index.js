const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());
const pool = mysql.createPool({
    host: 'a',
    user: 'a',
    database: 'a',
    password: 'a'
});

async function createTableIfNotExists() {
    try {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                numero VARCHAR(255) NOT NULL UNIQUE,
                statusLogin VARCHAR(50) NOT NULL,
                premium VARCHAR(50) NOT NULL,
                dataTerminoPremium DATE NOT NULL,
                acesso VARCHAR(255) NOT NULL,
                codeAuth VARCHAR(255) NOT NULL
            );
        `);
        console.log("Criado com sucesso");
    } catch (error) {
        console.error("Erro ao criar uma tabela:", error.message);
    }
}

app.post('/user', async (req, res) => {
    try {
        const { numero, statusLogin, premium, dataTerminoPremium, acesso, codeAuth } = req.body;
        const [rows] = await pool.execute(
            "INSERT INTO users (numero, statusLogin, premium, dataTerminoPremium, acesso, codeAuth) VALUES (?, ?, ?, ?, ?, ?)",
            [numero, statusLogin, premium, dataTerminoPremium, acesso, codeAuth]
        );
        res.json({ id: rows.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/user/numero/:numero', async (req, res) => {
    try {
        const { numero, statusLogin, premium, dataTerminoPremium, acesso, codeAuth } = req.body;
        await pool.execute(
            "UPDATE users SET numero = ?, statusLogin = ?, premium = ?, dataTerminoPremium = ?, acesso = ?, codeAuth = ? WHERE numero = ?",
            [numero, statusLogin, premium, dataTerminoPremium, acesso, codeAuth, req.params.numero]
        );
        res.json({ message: "Ocorreu tudo certo" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/user/:numero', async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM users WHERE numero = ?", [req.params.numero]);
        res.json(rows[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', async() => {
    console.log(`Servidor Online para uso ${PORT}`);
    await createTableIfNotExists();
});
