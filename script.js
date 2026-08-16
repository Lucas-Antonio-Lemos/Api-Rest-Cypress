const form = document.querySelector('.form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));

      try {
        const response = await fetch('http://localhost:1001/api/employes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('Resposta da API:', result);
        alert(result.message || 'Cliente cadastrado com sucesso!');
      } catch (error) {
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao cadastrar cliente');
      }
    });