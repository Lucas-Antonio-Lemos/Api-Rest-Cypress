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

app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO Employes (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    res.status(201).json({ message: 'Cadastro realizado com sucesso!', user: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
})

app.get('/api/users', async (req, res) => {
  try {
    // Faz a consulta no banco
    const result = await pool.query('SELECT * FROM Employes ORDER BY id ASC')

    // Retorna todos os registros em formato JSON
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar usuários' })
  }
})

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params; // pega o id da URL
  const { name, email, password } = req.body; // pega os dados enviados no corpo da requisição

  try {
    const result = await pool.query(
      'UPDATE Employes SET name=$1, email=$2, password=$3 WHERE id=$4 RETURNING *',
      [name, email, password, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json({ message: 'Usuário atualizado com sucesso!', user: result.rows[0] })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar usuário' })
  }
})

app.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id

  try {
    const result = await pool.query(
      'DELETE FROM Employes WHERE id=$1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.status(200).json({ message: 'Usuário removido com sucesso!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao deletar usuário' })
  }
})


app.listen(porta, () => {
  console.log(`Servidor online na porta ${porta}`)
})
