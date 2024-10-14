import os
import itertools
from typing import List, Set, Tuple, Iterable


def create_temp_dir(folder_path: str) -> None:
    """
    Create a temporary directory if it does not already exist.
    """

    if not os.path.isdir(folder_path):
        os.makedirs(folder_path)


def remove_temp_dir(folder_path: str) -> None:
    """
    Remove a folder and all of its contents, including subfolders and files.
    """

    if os.path.isdir(folder_path):
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    remove_temp_dir(file_path)
            except Exception as e:
                print(f"Failed to delete {file_path}. Reason: {e}")
        os.rmdir(folder_path)


def generate_unique_pairs(items: List[str]) -> Set[Tuple[str, str]]:
    """
    Generate all unique pairs of items from the provided list.
    """

    item_pairs = set(itertools.combinations(items, 2))

    return item_pairs


def generate_pairs(list_a: List[str], list_b: List[str]) -> Iterable[Tuple[str, str]]:
    """
    Generate all possible pairs of items from two lists.
    """

    item_pairs = itertools.product(list_a, list_b)

    return item_pairs
