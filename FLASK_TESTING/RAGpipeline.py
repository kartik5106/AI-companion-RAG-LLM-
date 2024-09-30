from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.document_loaders import DirectoryLoader
import chromadb

class RAG_pipeline:
    
    def addToCollection(doc,collection):
        collection.add(
        documents=[doc],

        ids=["doc"+str(collection.count()+1)],)
    
    def make_db(directory) :
        text_loader_kwargs={'autodetect_encoding': True}
        loader = DirectoryLoader(directory,glob="./*.txt",  loader_cls=TextLoader, loader_kwargs=text_loader_kwargs)
        documents = loader.load() 
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=200)
        texts = text_splitter.split_documents(documents)
        chroma_client = chromadb.Client()
        collection=chroma_client.create_collection(name="Rag_collection")
        for txt in texts:
            addToCollection(str(txt),collection)
        return collection
    