const formLogin = document.getElementById('formLogin');
const usuario = document.getElementById('usuario');
const senha = document.getElementById('senha');
const entrar = document.getElementById('entrar');
const mensagemLogin = document.getElementById('mensagemLogin');
let enviando = false;

formLogin.addEventListener('submit', async evento => {
  evento.preventDefault();
  if (enviando) return;
  enviando = true;
  entrar.disabled = true;
  mensagemLogin.textContent = 'Verificando acesso...';
  console.log('Tentando login...');

  try {
    const resposta = await window.auth.login({
      usuario: usuario.value.trim(),
      senha: senha.value
    });
    if (!resposta.ok) {
      mensagemLogin.textContent = resposta.erro;
      senha.value = '';
      senha.focus();
      console.log('Login falhou');
      return;
    }
    senha.value = '';
    console.log('Login efetuado com sucesso');
    // Delay de 3.95 segundos para mostrar a mensagem de verificação
    setTimeout(() => {
      window.auth.abrirPrincipal();
    }, 3950);
  } catch {
    senha.value = '';
    mensagemLogin.textContent = 'Não foi possível entrar. Tente novamente.';
    console.log('Erro ao tentar login');
  } finally {
    enviando = false;
    entrar.disabled = false;
  }
});
