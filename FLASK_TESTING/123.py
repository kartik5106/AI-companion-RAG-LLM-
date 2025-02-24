from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader, DirectoryLoader
import chromadb
import time
import ollama  


class AI:
    def __init__(self, directory):
        self.directory = directory
        self.collection
    
    def add_to_collection(self,collection,doc):
        """
        Add a document to the Chroma collection.
        """
        collection.add(
            documents=[doc],
            ids=["doc" + str(collection.count() + 1)],
        )
    
    def make_db(self, directory):
        """
        Initialize the Chroma database with documents from a directory.
        """
        text_loader_kwargs = {'autodetect_encoding': True}
        loader = DirectoryLoader(directory, glob="./*.txt", loader_cls=TextLoader, loader_kwargs=text_loader_kwargs)
        documents = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=200)
        texts = text_splitter.split_documents(documents)
        
        chroma_client = chromadb.Client()
        collection = chroma_client.create_collection(name="123")
        
        for txt in texts:
            self.add_to_collection(collection,str(txt))
        
        return collection
    
    def get_rag_documents(self, query_text, n_results=3):
        """
        Retrieve relevant documents from the collection based on a query.
        """
        results = self.collection.query(query_texts=[query_text], n_results=n_results)
        documents = "\n\n".join([doc.split("page_content='")[1].split("'")[0] for doc in results['documents'][0]])
        
        return documents

    def call_llm_with_context(self, query_text, context_documents):
        """
        Call the language model with context documents and the user query using ollama.
        """
        prompt = f"""
        You are an AI assistant. Use the following documents as context to answer the user's query. 
        {context_documents}

        Query: {query_text}

        Answer:
        """
        
        # Stream the response from Ollama
        stream = ollama.chat(
            model='llama3.1',
            messages=[{'role': 'user', 'content': prompt}],
            stream=True,
        )

        # Print LLM's response in a conversational way
        for chunk in stream:
            print(chunk['message']['content'], end='', flush=True)

    def chatbot(self):
        """
        A simple chatbot loop for interactive querying.
        """
        print("Chatbot started! Type 'exit' to quit.")
        while True:
            user_query = input("You: ")
            if user_query.lower() == "exit":
                print("Chatbot: Goodbye!")
                break
            
            context = self.get_rag_documents(user_query)
            self.call_llm_with_context(user_query, context)
            
            time.sleep(1)
