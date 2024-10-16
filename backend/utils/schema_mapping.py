import pandas as pd
from typing import List, Tuple


def infer_datetime_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Converts columns with potential date/time-related names to datetime format.
    """
    date_keywords = ["date", "time", "year", "month", "day", "hour", "minute", "second"]

    for col in df.columns:
        if any(keyword in col.lower() for keyword in date_keywords):
            try:
                df[col] = pd.to_datetime(df[col], infer_datetime_format=True)
            except (ValueError, TypeError):
                continue

    return df


def check_column_types(df1: pd.DataFrame, df2: pd.DataFrame) -> List[Tuple[str, str]]:
    """
    Finds matching or compatible column types between two DataFrames.
    """
    df1 = infer_datetime_columns(df1)
    df2 = infer_datetime_columns(df2)

    types1 = df1.dtypes.to_dict()
    types2 = df2.dtypes.to_dict()

    type_map1 = {}
    type_map2 = {}

    for col, dtype in types1.items():
        type_name = pd.api.types.pandas_dtype(dtype).name
        if type_name not in type_map1:
            type_map1[type_name] = []
        type_map1[type_name].append(col)

    for col, dtype in types2.items():
        type_name = pd.api.types.pandas_dtype(dtype).name
        if type_name not in type_map2:
            type_map2[type_name] = []
        type_map2[type_name].append(col)

    matches = []

    compatible_types = {
        "int64": "float64",
        "float64": "int64",
        "object": "string",
        "bool": "boolean",
        "datetime64[ns]": "datetime",
        "category": "category",
    }

    for type_name1, cols1 in type_map1.items():
        for type_name2, cols2 in type_map2.items():
            if type_name1 == type_name2 or (
                type_name1 in compatible_types
                and compatible_types[type_name1] == type_name2
            ):
                for col1 in cols1:
                    for col2 in cols2:
                        matches.append((col1, col2))

    return matches
