import os
import itertools
from typing import List, Set, Tuple, Iterable


def create_temp_dir(folder_path: str) -> None:
    """
    Create a temporary directory if it does not already exist.

    Args:
        folder_path (str): The path of the directory to create.

    Returns:
        None: This function does not return any value.
    """
    if not os.path.isdir(folder_path):
        os.makedirs(folder_path)


def remove_temp_dir(folder_path: str) -> None:
    """
    Remove a folder and all of its contents, including subfolders and files.

    Args:
        folder_path (str): The path of the folder to remove.

    Returns:
        None: This function does not return any value.

    Raises:
        Exception: Raises an exception if there is an issue deleting a file or folder.
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

    Args:
        items (List[str]): A list of strings from which to generate item pairs.

    Returns:
        Set[Tuple[str, str]]: A set containing unique tuples, 
        where each tuple consists of two distinct items from the input list.    
    """
    item_pairs = set(itertools.combinations(items, 2))
    return item_pairs


def generate_pairs(list_a: List[str], list_b: List[str]) -> Iterable[Tuple[str, str]]:
    """
    Generate all possible pairs of items from two lists.

    Args:
        list_a (List[str]): The first list of strings.
        list_b (List[str]): The second list of strings.

    Returns:
        Iterable[Tuple[str, str]]: An iterable of tuples, each containing a pair of items,
        where the first item is from list_a and the second item is from list_b.
    """
    item_pairs = itertools.product(list_a, list_b)
    return item_pairs
