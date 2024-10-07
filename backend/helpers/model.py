from sentence_transformers import SentenceTransformer
import torch


class EmbeddingsEncoder:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize the EmbeddingsEncoder class with a specified model name.

        Args:
            model_name (str, optional): Name of the sentence-transformers model to load. Defaults to "all-MiniLM-L6-v2".
        """
        self.model_name = model_name
        self.model = SentenceTransformer(
            self.model_name, trust_remote_code=True)

    def encode(self, text: str) -> list:
        """
        Encode input data into embeddings using the initialized SentenceTransformer model.

        Args:
            text (str): Input data to encode into embeddings.

        Returns:
            list: List of embeddings corresponding to the input data.
        """
        if not isinstance(text, str):
            raise ValueError("Input text must be a string.")

        embeddings = self.model.encode(text, convert_to_tensor=True)
        return embeddings

    def similarity(self, text_1: str, text_2: str) -> float:
        """
        Calculate cosine similarity between two text embeddings.

        Args:
            text_1 (str): First text to compare.
            text_2 (str): Second text to compare.

        Returns:
            float: Cosine similarity score between text_1 and text_2.
        """
        tensor_1 = self.encode(text_1)
        tensor_2 = self.encode(text_2)

        return  torch.nn.functional.cosine_similarity(tensor_1, tensor_2, dim=0).item()
