#!/bin/python3

import json
import logging
import argparse
import collections

args_parser = argparse.ArgumentParser(description="fortune checker")
args_parser.add_argument("path", type=str, help="event json file path")

args = args_parser.parse_args()
errors: dict[tuple[str, int], list[str]] = collections.defaultdict(list)
good_fortunes: list[dict] = None
bad_fortunes: list[dict] = None
all_fortunes = None

try:
    with open(args.path) as f:
        all_fortunes = json.loads(f.read())
except json.JSONDecodeError:
    print(f"`{args.path}` json syntax error.")
    exit(-1)

except FileNotFoundError:
    print(f"`{args.path}` not found.")
    print("Please contact developer to solve this problem.")
    exit(-1)

if not isinstance(all_fortunes, dict):
    print(f"`{args.path}` should contain a dict")
    exit(-1)

try:
    good_fortunes = all_fortunes["goodFortunes"]
except KeyError:
    print(f"`{args.path}` should contain `goodFortunes`")

if not isinstance(good_fortunes, list):
    print("`goodFortunes` should be a list.")

try:
    bad_fortunes = all_fortunes["badFortunes"]
except KeyError:
    print(f"`{args.path}` should contain `badFortunes`")

if not isinstance(bad_fortunes, list):
    print("`badFortunes` should be a list.")


def require_field_check(
    obj: dict,
    fortune_idx: tuple[str, int],
    fields: list[tuple[str, type]],
    required_field: str = "",
) -> bool:
    """
    Validates the presence and types of required fields in a given object.

    Args:
        obj (dict): The object (dictionary) to validate.
        fortune_idx (tuple[str, int]): The index of the fortune for associating validation errors.
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
            errors[fortune_idx].append(msg)

        elif not isinstance(obj[field_name], field_type):
            error_found = True
            errors[fortune_idx].append(
                f"`{field_name}` should be a `{field_type}` type."
            )

    if error_found:
        return False
    return True


fortune_names = set()

def check_fortune(fortune, idx: tuple[str, int]):
    if not isinstance(fortune, dict):
        errors[idx].append("fortune should be a dict.")
        return False

    if not require_field_check(fortune, idx, [
        ("event", str),
        ("description", list)
    ]):
        return False

    fortune_name = fortune["event"]
    if fortune_name in fortune_names:
        errors[idx].append(f"fortune `{fortune_name}` already exists.")

    if not fortune_name:
        errors[idx].append("fortune name should not be empty.")


    if not fortune["description"]:
        errors[idx].append("fortune description should not be empty.")
        return False

    descriptions = set()
    for desc in fortune["description"]:
        if not isinstance(desc, str):
            errors[idx].append(f"fortune description {desc} should be a string.")
            continue

        if not desc:
            errors[idx].append(f"fortune description {desc} should not be empty.")
            continue

        if desc in descriptions:
            errors[idx].append(f"fortune description {desc} already exists.")
            continue
        else:
            descriptions.add(desc)

    fortune_names.add(fortune_name)

    return True

if good_fortunes:
    for idx, fortune in enumerate(good_fortunes):
        check_fortune(fortune, ("goodFortunes", idx))

fortune_names.clear()
if bad_fortunes:
    for idx, fortune in enumerate(bad_fortunes):
        check_fortune(fortune, ("badFortunes", idx))

if errors:
    logging.error(args.path)
    for idx, error_msgs in errors.items():
        fortunes = None
        if idx[0] == "goodFortunes":
            fortunes = good_fortunes
        elif idx[0] == "badFortunes":
            fortunes = bad_fortunes

        if not fortunes:
            continue

        logging.error(
            json.dumps(
                fortunes[idx[1]], indent=4, ensure_ascii=False
            )
        )
        for msg in error_msgs:
            logging.error(msg)
    exit(-1)
