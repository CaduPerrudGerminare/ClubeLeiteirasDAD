from flask import Flask, make_response, jsonify, request
from flask_cors import CORS
import psycopg2
import requests
import random
from datetime import date
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash, check_password_hash
import logging
import os

app = Flask(__name__)

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuração CORS
CORS(app, 
     supports_credentials=True, 
     origins=["https://clubeleiteirasdad.onrender.com"],
     expose_headers=["Content-Type"],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Função para obter conexão com o banco de dados com tratamento de erros
def get_db_connection():
       conn = psycopg2.connect(os.getenv("DATABASE_URL"))
       return conn

@app.route("/")
def home():
    return {"status": "Backend Flask está funcionando 🐮🚀"}

# ----------- LOGIN -----------
@app.route('/login', methods=["POST"])
def login():
    data = request.get_json()
    telefone_email = data.get('telefoneEmail')
    senha = data.get('senha')

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT id_usuario, senha FROM Usuarios WHERE telefone = %s OR email = %s
        ''', (telefone_email, telefone_email))
        
        user = cursor.fetchone()

        if not user:
            print("🔴 Usuário não encontrado")
            return jsonify({"error": "Usuário não encontrado!"}), 401

        usuario_id, senha_armazenada = user
        print(f"🟢 Usuário encontrado: {usuario_id}")

        if check_password_hash(senha_armazenada, senha):  
            print("✅ Login bem-sucedido!")
            return jsonify({
                "message": "Login bem-sucedido!", 
                "usuario_id": usuario_id,
                "telefone_email": telefone_email
            }), 200
        else:
            print("🔴 Senha incorreta")
            return jsonify({"error": "Senha incorreta!"}), 401

    except Exception as e:
        conn.rollback()
        print(f"❌ Erro no login: {e}")
        return jsonify({"error": f"Erro ao realizar login: {e}"}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/toggleFavorito', methods=['POST'])
def toggle_favorito():
    data = request.get_json()
    titulo = data.get("titulo")
    usuario_id = data.get("usuario_id")

    if not titulo or not usuario_id:
        return jsonify({"error": "Dados incompletos"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Verifica se já é favorito
        cursor.execute('''
            SELECT titulo FROM Favoritos 
            WHERE titulo = %s AND telefoneEmail = %s
        ''', (titulo, usuario_id))
        
        if cursor.fetchone():
            # Remove dos favoritos
            cursor.execute('''
                DELETE FROM Favoritos 
                WHERE titulo = %s AND telefoneEmail = %s
            ''', (titulo, usuario_id))
            action = "removido"
            is_favorito = False
        else:
            # Adiciona aos favoritos
            cursor.execute('''
                INSERT INTO Favoritos (titulo, telefoneEmail) 
                VALUES (%s, %s)
            ''', (titulo, usuario_id))
            action = "adicionado"
            is_favorito = True
        
        conn.commit()
        return jsonify({
            "message": f"Livro {action} dos favoritos!",
            "favorito": is_favorito
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
      
@app.route('/verificarFavorito', methods=['POST'])
def verificar_favorito():
    data = request.get_json()
    nomeLivro = data.get("nomeLivro")  
    usuario = data.get("usuario")      

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('''
            SELECT 1 FROM Favoritos 
            WHERE titulo = %s AND telefoneEmail = %s
        ''', (nomeLivro, usuario))  # Corrigido para verificar 'usuario' em vez de 'id_usuario'
        
        return jsonify({
            "favorito": bool(cursor.fetchone())
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ---------------------------- REALIZAR EMPRÉSTIMO ----------------------------
@app.route("/realizarEmprestimo", methods=["POST"])
def realizar_emprestimo():
    if not request.is_json:
        return jsonify({"error": "Request deve ser JSON"}), 400
    
    data = request.get_json()
    nomeUsuario = data.get("usuario")
    nomeLivro = data.get("nomeLivro")

    if not nomeUsuario:
        return jsonify({"error": "Usuário não informado!"}), 401
    if not nomeLivro:
        return jsonify({"error": "Nome do livro não informado!"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Verifica se o livro já está emprestado
        cursor.execute('''
            SELECT telefoneemail FROM Emprestados 
            WHERE titulo = %s
        ''', (nomeLivro,))
        emprestimo_existente = cursor.fetchone()
        
        if emprestimo_existente:
            return jsonify({
                "error": "Livro já emprestado",
                "disponivel": False,
                "emprestado_por": emprestimo_existente[0]
            }), 400

        # Realiza o empréstimo
        cursor.execute('''
            INSERT INTO Emprestados (titulo, telefoneemail) 
            VALUES (%s, %s)
        ''', (nomeLivro, nomeUsuario))
        conn.commit()
        
        return jsonify({
            "message": "Empréstimo realizado com sucesso!",
            "livro": nomeLivro,
            "usuario": nomeUsuario
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
# ---------------------------- DEVOLVER EMPRÉSTIMO ----------------------------

@app.route("/devolverEmprestimo", methods=["POST"])
def devolver_emprestimo():
    data = request.get_json()
    usuario_id = data.get("usuario_id")  # Recebe usuario_id
    nomeLivro = data.get("nomeLivro")

    if not usuario_id:
        return jsonify({"error": "Usuário não informado!"}), 401
    if not nomeLivro:
        return jsonify({"error": "Nome do livro não informado!"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Verifica se o livro foi emprestado pelo usuário
        cursor.execute('''
            SELECT * FROM Emprestados 
            WHERE titulo = %s AND telefoneemail = %s
        ''', (nomeLivro, usuario_id))
        
        if not cursor.fetchone():
            return jsonify({"error": "Este livro não foi emprestado por você"}), 403

        # Remove o empréstimo
        cursor.execute('''
            DELETE FROM Emprestados 
            WHERE titulo = %s AND telefoneemail = %s
        ''', (nomeLivro, usuario_id))
        conn.commit()
        
        return jsonify({"message": "Empréstimo devolvido com sucesso!"}), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Erro ao devolver livro: {e}"}), 500
    finally:
        cursor.close()
        conn.close()
# ---------------------------- VERIFICAR DISPONIBILIDADE ----------------------------

@app.route('/verificarDisponibilidade', methods=["POST"])
def verificar_disponibilidade():
    data = request.get_json()
    nomeLivro = data.get("nomeLivro")
    usuario = data.get("usuario")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT telefoneemail FROM Emprestados 
            WHERE titulo = %s
        ''', (nomeLivro,))
        result = cursor.fetchone()
        
        disponivel = result is None
        mesmo_usuario = result and result[0] == usuario
        
        return jsonify({
            "disponivel": disponivel,
            "mesmo_usuario": mesmo_usuario,
            "emprestado_por": result[0] if result else None
        }), 200
            
    except Exception as e:
        return jsonify({
            "disponivel": False,
            "mesmo_usuario": False,
            "error": str(e)
        }), 500
    finally:
        cursor.close()
        conn.close()
# ---------------------------- VERIFICAR USUÁRIO DO EMPRÉSTIMO ----------------------------
@app.route('/verificarUsuarioEmprestimo', methods=["POST"])
def verificar_usuario_emprestimo():
    data = request.get_json()
    nomeLivro = data.get("nomeLivro")
    usuario = data.get("usuario")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT telefoneemail FROM Emprestados 
            WHERE titulo = %s
        ''', (nomeLivro,))
        result = cursor.fetchone()
        
        return jsonify({
            "emprestado_por_usuario": result[0] if result else None,
            "mesmo_usuario": result[0] == usuario if result else False
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ---------------------------- PREENCHER CARTEIRINHA ----------------------------
@app.route('/preencherCarteirinha', methods=['POST'])
def preencher_carteirinha():
    data = request.get_json()
    usuario = data.get("usuario")

    if not usuario:
        return jsonify({"error": "Usuário não fornecido!"}), 400  

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        print(f"🔍 Buscando dados para: {usuario}")  # Log para debug
        
        # Corrigido o nome da tabela para Usuarios (maiúsculo)
        cursor.execute('''
            SELECT nome, telefone, email 
            FROM Usuarios 
            WHERE telefone = %s OR email = %s
        ''', (usuario, usuario))
        
        usuario_data = cursor.fetchone()
        print(f"📄 Dados encontrados: {usuario_data}")  # Log para debug

        if not usuario_data:
            return jsonify({"error": "Usuário não encontrado"}), 404

        return jsonify({
            "nome": usuario_data[0],
            "telefone": usuario_data[1],  
            "email": usuario_data[2]      
        })
    except Exception as e:
        print(f"❌ Erro na consulta: {str(e)}")  # Log para debug
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
        
# ---------------------------- EDITAR PERFIL ----------------------------

@app.route('/editarPerfil', methods=['POST', 'OPTIONS'])
def editar_perfil():
    if request.method == 'OPTIONS':
        return '', 200
    
    data = request.get_json()
    usuario = data.get("usuario")  # Pode ser email ou telefone
    nome = data.get("nome")
    telefone = data.get("telefone")
    email = data.get("email")

    if not usuario:
        return jsonify({"error": "Usuário não autenticado"}), 401
    
    if not all([nome, telefone, email]):
        return jsonify({"error": "Todos os campos são obrigatórios!"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Verifica se novos email ou telefone já pertencem a outro usuário
        cursor.execute('''
            SELECT id_usuario FROM Usuarios 
            WHERE (email = %s OR telefone = %s)
            AND (email != %s AND telefone != %s)
        ''', (email, telefone, usuario, usuario))
        
        if cursor.fetchone():
            return jsonify({"error": "Email ou telefone já cadastrados por outro usuário!"}), 409

        # Atualiza os dados
        cursor.execute('''
            UPDATE Usuarios 
            SET nome = %s, telefone = %s, email = %s 
            WHERE email = %s OR telefone = %s
            RETURNING nome, telefone, email
        ''', (nome, telefone, email, usuario, usuario))
        
        updated_data = cursor.fetchone()
        conn.commit()
        
        if not updated_data:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        return jsonify({
            "message": "Perfil atualizado com sucesso!",
            "nome": updated_data[0],
            "telefone": updated_data[1],
            "email": updated_data[2]
        }), 200

    except Exception as e:
        conn.rollback()
        print(f"Erro ao editar perfil: {str(e)}")
        return jsonify({"error": f"Erro ao editar perfil: {str(e)}"}), 500
    finally:
        cursor.close()
        conn.close()
# ---------------------------- REALIZAR CADASTRO ----------------------------

@app.route('/Cadastro', methods=['POST', 'OPTIONS'])
def handle_cadastro():
    
    if request.method == 'OPTIONS':
        return '', 200  # resposta vazia com status 200 para o preflight

    
    data = request.get_json()
    nome = data.get("nm")
    telefone = data.get("tel")
    email = data.get("em")
    senha = data.get("password")
    confirmarSenha = data.get("cfpassword")

    # Validação básica
    if not all([nome, telefone, email, senha, confirmarSenha]):
        return jsonify({"error": "Todos os campos são obrigatórios!"}), 400
    
    if senha != confirmarSenha:
        return jsonify({"error": "As senhas não coincidem!"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Verifica se usuário já existe
        cursor.execute('''
            SELECT id_usuario FROM Usuarios 
            WHERE email = %s OR telefone = %s
        ''', (email, telefone))
        if cursor.fetchone():
            return jsonify({"error": "Usuário já cadastrado!"}), 409

        # Insere novo usuário
        cursor.execute('''
            INSERT INTO Usuarios (nome, telefone, email, senha) 
            VALUES (%s, %s, %s, %s)
        ''', (nome, telefone, email, generate_password_hash(senha)))
        
        conn.commit()
        
        response = jsonify({
            "message": "Usuário cadastrado com sucesso!"
        })
        return response, 201

    except Exception as e:
        conn.rollback()
        print(f"Erro no cadastro: {str(e)}")  # Log para depuração
        return jsonify({"error": f"Erro ao cadastrar usuário: {str(e)}"}), 500

    finally:
        cursor.close()
        conn.close()

#Buscar dados na API
import requests
import urllib.parse

def buscar_dados_google_books(titulo):
    def fazer_requisicao(query):
        url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=5"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get("items", [])
        return []

    titulo_codificado = urllib.parse.quote(titulo)

    # 1ª tentativa: busca com intitle
    itens = fazer_requisicao(f"intitle:{titulo_codificado}")

    # 2ª tentativa: busca geral se a primeira falhar
    if not itens:
        itens = fazer_requisicao(titulo_codificado)

    for item in itens:
        info = item.get("volumeInfo", {})
        if "title" in info:
            return {
                "nomeLivro": info.get("title", ""),
                "capa": info.get("imageLinks", {}).get("thumbnail", ""),
                "sinopse": info.get("description", ""),
                "nomeAutor": ", ".join(info.get("authors", [])),
                "anoPublicacao": info.get("publishedDate", ""),
                "categorias": ", ".join(info.get("categories", []))
            }

    return None


# Traz os livros da api que sejam os ultimos emprestados 
@app.route('/livros', methods=['GET'])
def listar_livros():
    livros = []
    try:
        telefone_email = request.args.get("telefoneemail")
        if not telefone_email:
            return jsonify({"erro": "Campo 'telefoneEmail' é obrigatório"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT titulo FROM Emprestados WHERE telefoneemail = %s", (telefone_email,))
        titulos = cur.fetchall()

        for (titulo,) in titulos:
            dados = buscar_dados_google_books(titulo)
            if dados:
                livros.append(dados)

        cur.close()
        conn.close()
        return jsonify(livros)

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

    
# Traz os livros da api que sejam os ultimos emprestados 
@app.route('/livrosFavoritos', methods=['GET'])
def listar_livros_favoritos():
    livros_favoritos = []
    try:
        telefone_email = request.args.get("telefoneemail")
        if not telefone_email:
            return jsonify({"erro": "Campo 'telefoneEmail' é obrigatório"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT titulo FROM Favoritos WHERE telefoneemail = %s LIMIT 8", (telefone_email,))
        titulos = cur.fetchall()

        for (titulo,) in titulos:
            dados = buscar_dados_google_books(titulo)
            if dados:
                livros_favoritos.append(dados)

        cur.close()
        conn.close()
        return jsonify(livros_favoritos)

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route('/todosFavoritos', methods=['GET'])
def listar_favoritos():
    livros_favoritos = []
    try:
        telefone_email = request.args.get("telefoneemail")
        print("📥 telefone_email recebido:", telefone_email)

        if not telefone_email:
            return jsonify({"erro": "Campo 'telefoneemail' é obrigatório"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT titulo FROM Favoritos WHERE telefoneemail = %s", (telefone_email,))
        titulos = cur.fetchall()
        print("🎯 Títulos encontrados no banco:", titulos)

        for (titulo,) in titulos:
            dados = buscar_dados_google_books(titulo)
            print(f"🔍 Dados do Google Books para '{titulo}':", dados)
            if dados:
                livros_favoritos.append(dados)

        cur.close()
        conn.close()
        return jsonify(livros_favoritos)

    except Exception as e:
        print("❌ Erro no backend:", e)
        return jsonify({"erro": str(e)}), 500

# Busca a frase do dia, titulo e sinopse no banco 
@app.route('/frase-do-dia', methods=['GET'])
def frase_do_dia():
    conn = get_db_connection()
    cursor = conn.cursor()

    dia_do_ano = date.today().timetuple().tm_yday

    # Se seu banco só tem 365 frases, vamos garantir que não pegue 366 num ano bissexto
    if dia_do_ano > 365:
        dia_do_ano = 365
    cursor.execute("SET search_path TO public")
    cursor.execute("SELECT titulo, sinopse, frase FROM public.livros WHERE id = %s", (dia_do_ano,))
    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if row:
        titulo, sinopse, frase = row
        return jsonify({
            'nomeLivro': titulo,
            'sinopse': sinopse,
            'frase': frase
        })
    else:
        return jsonify({'error': 'Nenhum livro encontrado'}), 404


if __name__ == "__main__":
    app.run(debug=True)