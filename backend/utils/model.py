from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List


class EmbeddingsEncoder:
    def __init__(
        self, model_name: str = "all-MiniLM-L6-v2", device: str = "cpu"
    ) -> None:
        self.model_name: str = model_name
        self.model = SentenceTransformer(
            self.model_name, trust_remote_code=True, device=device
        )

    def encode(self, texts: List[str]) -> np.ndarray:
        """
        Encode a batch of input texts into embeddings using the SentenceTransformer model.
        """
        if not all(isinstance(text, str) for text in texts):
            raise ValueError("All input texts must be strings.")

        embeddings: np.ndarray = self.model.encode(
            texts, convert_to_numpy=True, batch_size=16
        )

        return embeddings


def cosine_similarity(embedding_1: np.ndarray, embedding_2: np.ndarray) -> float:
    """
    Calculate cosine similarity between two text embeddings.
    """
    dot_product: float = np.dot(embedding_1, embedding_2)
    norm_1: float = np.linalg.norm(embedding_1)
    norm_2: float = np.linalg.norm(embedding_2)

    similarity_score: float = dot_product / (norm_1 * norm_2)

    return similarity_score
