import logging
import os
from flask import Flask, render_template, request, jsonify, stream_with_context, Response
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import DirectoryLoader, TextLoader
import chromadb
from chromadb.config import Settings
import ollama

# Configuration parameters
CHUNK_SIZE = 500
CHUNK_OVERLAP = 200
MODEL_NAME = 'llama3.1'
PERSISTENCE_DIR = "./chroma_db"

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure the persistence directory exists
os.makedirs(PERSISTENCE_DIR, exist_ok=True)

# Initialize the persistent Chroma client
chroma_client = chromadb.PersistentClient(
    path=PERSISTENCE_DIR,
    settings=Settings(
        allow_reset=True,
        is_persistent=True
    )
)

# Get or create the collection
collection = chroma_client.get_or_create_collection(name="Rag_collection_1")

def load_and_embed_documents():
    if collection.count() == 0:
        logger.info("Collection is empty. Loading and embedding documents...")
        loader = DirectoryLoader('text documents', glob="./*.txt", loader_cls=TextLoader, loader_kwargs={'autodetect_encoding': True})
        documents = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
        texts = text_splitter.split_documents(documents)

        for i, txt in enumerate(texts):
            try:
                collection.add(
                    documents=[str(txt.page_content)],
                    metadatas=[txt.metadata],
                    ids=[f"doc{i+1}"]
                )
            except Exception as e:
                logger.error(f"Error adding document to collection: {e}")
        logger.info(f"Added {len(texts)} documents to the collection.")
    else:
        logger.info(f"Collection already contains {collection.count()} documents.")

# Load documents into the collection
load_and_embed_documents()

def get_rag_documents(query_text):
    try:
        results = collection.query(
            query_texts=[query_text],
            n_results=5,
            include=["documents", "metadatas"]
        )
        documents = "\n\n".join(results['documents'][0])
        return documents
    except Exception as e:
        logger.error(f"Error retrieving documents: {e}")
        return ""

def call_llm_with_context(query_text, context_documents):
    prompt = f"""
    You are a personal AI assistant for people with memory issues. Use the following documents as context 
    and use this information to understand the patient and the query, then skillfully give the user an answer.
    Your responses should be human-like and meaningful. Don't hallucinate.
    Context:
    {context_documents}

    Query: {query_text}

    Answer:"""
    # prompt = f"""just say yes thants all only one word dont think"""
    try:
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[{'role': 'user', 'content': prompt}],
            stream=False,
        )
        return response
    except Exception as e:
        logger.error(f"Error calling LLM: {e}")
        return None

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# Updated chat route
@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message', '')
        if not user_message:
            return jsonify({"error": "Empty message received"}), 400
        
        context = get_rag_documents(user_message)
        bot_response = call_llm_with_context(user_message, context)

        if not bot_response or 'message' not in bot_response:
            return jsonify({"error": "LLM failed to generate response"}), 500

        # Return properly structured response
        return jsonify({
            "content": bot_response['message']['content']
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)

