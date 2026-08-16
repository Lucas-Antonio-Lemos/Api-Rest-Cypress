const pool = require('./db')
const express = require('express')
const app = express()
const cors = require('cors');
const porta = 1001

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Servidor express!' })
});

// CREATE
app.post('/api/employes', async (req, res) => {
  const {
    nome_completo,
    email,
    telefone,
    cpf,
    data_nascimento,
    cep,
    endereco,
    numero,
    complemento,
    bairro,
    cidade
  } = req.body;

  if (!nome_completo || !email || !cpf) {
    return res.status(400).json({ error: 'Nome, email e CPF são obrigatórios!' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO employes 
        (nome_completo, email, telefone, cpf, data_nascimento, cep, endereco, numero, complemento, bairro, cidade) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [nome_completo, email, telefone, cpf, data_nascimento, cep, endereco, numero, complemento, bairro, cidade]
    );
    res.status(201).json({ message: 'Cadastro realizado com sucesso!', employe: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar cliente' });
  }
});

// READ
app.get('/api/employes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employes ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// UPDATE
app.put('/api/employes/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nome_completo,
    email,
    telefone,
    cpf,
    data_nascimento,
    cep,
    endereco,
    numero,
    complemento,
    bairro,
    cidade
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE employes SET 
        nome_completo=$1, email=$2, telefone=$3, cpf=$4, data_nascimento=$5,
        cep=$6, endereco=$7, numero=$8, complemento=$9, bairro=$10, cidade=$11
       WHERE id=$12 RETURNING *`,
      [nome_completo, email, telefone, cpf, data_nascimento, cep, endereco, numero, complemento, bairro, cidade, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json({ message: 'Cliente atualizado com sucesso!', employe: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

// DELETE
app.delete('/api/employes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM employes WHERE id=$1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.status(200).json({ message: 'Cliente removido com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
});

app.listen(porta, () => {
  console.log(`Servidor online na porta ${porta}`)
});

