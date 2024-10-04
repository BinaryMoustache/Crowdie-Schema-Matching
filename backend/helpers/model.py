import torch
from transformers import AutoTokenizer, AutoModel


class EmbeddingsEncoder:
    def __init__(self, model_name: str = "bert-base-uncased"):
        self.model_name = model_name

        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModel.from_pretrained(self.model_name)

    def encode(self, text: str) -> torch.Tensor:
        """
        Encode input data into embeddings using the initialized Hugging Face model.

        Args:
            text (str): Input data to encode into embeddings.

        Returns:
            torch.Tensor: Tensor of embeddings corresponding to the input data.
        """
        if not isinstance(text, str):
            raise ValueError("Input text must be a string.")

        inputs = self.tokenizer(
            text, padding=True, truncation=True, return_tensors="pt")

        with torch.no_grad():
            outputs = self.model(**inputs)

        embeddings = outputs.last_hidden_state.mean(dim=1)
        return embeddings

    def similarity(self, text_1: str, text_2: str) -> float:
        """
        Calculate cosine similarity between two tensors.

        Args:
            text_1 (str): First text to compare.
            text_2 (str): Second text to compare.

        Returns:
            float: Cosine similarity score between text_1 and text_2.
        """

        tensor_1 = self.encode(text_1)
        tensor_2 = self.encode(text_2)

        return torch.nn.functional.cosine_similarity(tensor_1, tensor_2).item()
