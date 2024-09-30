from flask import Flask, render_template, request, jsonify
# from langchain.vectorstores import Chroma
# from langchain.embeddings import OpenAIEmbeddings
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.llms import OpenAI
# from langchain.chains import RetrievalQA
# from langchain.document_loaders import TextLoader
# from langchain.document_loaders import DirectoryLoader
from RAGpipeline import *

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('chatbot.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json['message']
    
    # if 'hello' in user_message.lower():
    #     bot_reply = "Hello! How can I assist you today?"
    # elif 'bye' in user_message.lower():
    #     bot_reply = "Goodbye! Have a nice day!"
    # else:
    #     bot_reply = "I'm not sure how to respond to that."
    relevant_docs = 
    bot_reply = call_llm_with_context("user_message","")
    return jsonify({'reply': bot_reply})

if __name__ == '__main__':
    app.run(debug=True)
