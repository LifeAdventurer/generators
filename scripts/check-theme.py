#!/bin/python3

import json
import logging
import argparse
import collections

args_parser = argparse.ArgumentParser(description="theme checker")
args_parser.add_argument("path", type=str, help="event json file path")

args = args_parser.parse_args()
errors: dict[int, list[str]] = collections.defaultdict(list)
themes: list[dict[str]] = None
j = None

try:
    with open(args.path) as f:
        j = json.loads(f.read())
except json.JSONDecodeError:
    print(f"`{args.path}` json syntax error.")
    exit(-1)

except FileNotFoundError:
    print(f"`{args.path}` not found.")
    print("Please contact developer to solve this problem.")
    exit(-1)

if not isinstance(j, dict):
    print(f"`{args.path}` should contain a dict")
    exit(-1)

try:
    themes = j["themes"]
except KeyError:
    print(f"`{args.path}` should contain `themes`")
    exit(-1)

if not isinstance(themes, list):
    print("`themes` should be a list.")
    exit(-1)

def require_field_check(
    obj: dict,
    theme_idx: int,
    fields: list[tuple[str, type]],
    required_field: str = "",
) -> bool:
    """
    Validates the presence and types of required fields in a given object.

    Args:
        obj (dict): The object (dictionary) to validate.
        theme_idx (int): The index of the fortune for associating validation errors.
        fields (list[tuple[str, type]]): A list of tuples where each tuple contains a field name and its expected type.
        required_field (str, optional): An optional prefix for error messages to indicate a higher-level required field. Defaults to "".

    Returns:
        bool: True if all required fields are present and have the correct types, otherwise False.

    Validation Rules:
        - If a required field is missing, an error message is recorded.
        - If a field is present but its type does not match the expected type, an error message is recorded.
        - The `required_field` parameter, if provided, is prepended to error messages for context.
    """

    error_found = False
    for field_name, field_type in fields:
        if field_name not in obj:
            error_found = True
            msg = ""
            if required_field != "":
                msg = f"`{required_field}` "

            msg += f"missing `{field_name}`."
            errors[theme_idx].append(msg)

        elif not isinstance(obj[field_name], field_type):
            error_found = True
            errors[theme_idx].append(
                f"`{field_name}` should be a `{field_type}` type."
            )

    if error_found:
        return False
    return True


theme_names = set()

def check_theme(theme, idx: int):
    if not isinstance(theme, dict):
        errors[idx].append("theme should be a dict.")
        return False

    if not require_field_check(theme, idx, [
        ("name", str),
        ("properties", dict)
    ]):
        return False

    theme_name = theme["name"]
    if theme_name in theme_names:
        errors[idx].append(f"theme `{theme_name}` already exists.")

    if not theme_name:
        errors[idx].append("theme name should not be empty.")

    properties = theme["properties"]
    properties_field_required = [
        ("bg-color", str),
        ("good-fortune-color", str),
        ("bad-fortune-color", str),
        ("middle-fortune-color", str),
        ("title-color", str),
        ("desc-color", str),
        ("button-color", str),
        ("button-hover-color", str),
        ("toggle-theme-button-color", str),
        ("copy-result-button-color", str),
        ("copy-preview-result-url-button-color", str),
        ("date-color", str),
        ("special-event-color", str),
    ]
    if not require_field_check(properties, idx, properties_field_required):
        return False

    for field_name in (v[0] for v in properties_field_required):
        color: str = properties[field_name]
        if color[0] != "#":
            errors[idx].append(f"color {color} should starts with `#`.")
            continue

        color = color[1:]
        if any(not ch.isdigit() and not ch.islower() for ch in color):
            errors[idx].append(f"color {color} should be all lowercase.")
            continue

        hex = set("0123456789abcdef")
        if any(ch not in hex for ch in color):
            errors[idx].append(f"color {color} should be a hex value.")
            continue

        if len(color) != len("rrggbb") and len(color) != len("rrggbbaa"):
            errors[idx].append(f"color {color} should be in `rrggbb` or `rrggbbaa` format.")
            continue


    theme_names.add(theme_name)

    return True

for idx, theme in enumerate(themes):
    check_theme(theme, idx)

if errors:
    logging.error(args.path)
    for idx, error_msgs in errors.items():
        logging.error(
            json.dumps(
                themes[idx], indent=4, ensure_ascii=False
            )
        )
        for msg in error_msgs:
            logging.error(msg)
    exit(-1)
