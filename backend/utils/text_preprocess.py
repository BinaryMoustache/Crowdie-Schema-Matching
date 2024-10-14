import re
from typing import List


class SchemaProcessor:
    def split_words(self, text: str) -> List[str]:
        """
        Splits the input text into words based on camelCase, PascalCase, snake_case, and kebab-case conventions.
        """

        text = re.sub("([a-z])([A-Z])", r"\1 \2", text)
        text = text.replace("_", " ").replace("-", " ")
        words = text.split()

        return words

    def clean_words(self, words: List[str]) -> List[str]:
        """
        Cleans the list of words by removing numbers, punctuation, and links, and converting all words to lowercase.
        """

        cleaned_words = []
        for word in words:
            word = re.sub(r"\d+", "", word)
            word = re.sub(r"[^\w\s]", "", word)
            word = re.sub(r"http\S+|www\S+", "", word)
            word = word.strip().lower()
            if word:
                cleaned_words.append(word)

        return cleaned_words

    def get_processed_text(self, text: str) -> str:
        """
        Processes the input text by first splitting it into words and then cleaning those words.
        """

        words = self.split_words(text)
        cleaned_words = self.clean_words(words)

        return " ".join(cleaned_words)
