#!/bin/python3

import logging
import collections
import datetime
import argparse
import enum
import json

class DateType(enum.Enum):
    CUSTOM = "custom"
    STATIC = "static"
    CYCLICAL = "cyclical"

    def __str__(self):
        return self.name.lower()

    def __repr__(self):
        return str(self)

    @staticmethod
    def argparse(s):
        try:
            return DateType[s.upper()]
        except KeyError:
            return s


args_parser = argparse.ArgumentParser(description="special events checker")
args_parser.add_argument("path", type=str, help="event json file path")
args_parser.add_argument(
    "type",
    type=DateType.argparse,
    choices=[t for t in DateType],
    help="event date type",
)

args = args_parser.parse_args()

special_events: dict[str, list[dict]] = {}

try:
    with open(args.path) as f:
        special_events = json.loads(f.read())
except json.JSONDecodeError:
    print(f"`{args.path}` json syntax error.")
    exit(-1)

except FileNotFoundError:
    print(f"`{args.path}` not found.")
    print("Please contact developer to solve this problem.")
    exit(-1)

if not isinstance(special_events, dict):
    print("`special_events` should be a dict")
    exit(-1)

if "special_events" not in special_events:
    print(f"`special_events` not found in `{args.path}`.")
    exit(-1)

if not isinstance(special_events["special_events"], list):
    print(f"`special_events` in `{args.path}` should be a list.")
    exit(-1)

MIN_STATUS_INDEX = 0
MAX_STATUS_INDEX = 7
DAYSPERMONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

errors: dict[int, list[str]] = collections.defaultdict(list)


def is_leap_year(year: int) -> bool:
    """Determines whether a given year is a leap year.

    Args:
        year (int): The year to check.

    Returns:
        bool: True if the year is a leap year, False otherwise.
    """

    if year % 400 == 0:
        return True
    if year % 100 == 0:
        return False
    if year % 4 == 0:
        return True

    return False


def validate_number(event_idx: int, value, min: int, max: int, field_name: str) -> int | None:
    """Validates whether a given value is an integer within a specified range.

    Args:
        event_idx (int): The index of the event for associating validation errors.
        value (Any): The value to validate.
        min (int): The minimum acceptable value (inclusive).
        max (int): The maximum acceptable value (inclusive).
        field_name (str): The name of the field being validated, used in error messages.

    Returns:
        int | None: The validated integer value if it is within the range, otherwise None.

    Raises:
        ValueError: If `value` cannot be converted to an integer.

    Validation Rules:
        - If `value` cannot be converted to an integer, an error is recorded and None is returned.
        - If `value` is outside the range defined by `min` and `max`, an error is recorded and None is returned.
    """

    try:
        value = int(value)
    except ValueError:
        errors[event_idx].append(f"`{field_name}` should be between {min} and {max}")
        return None

    if value < min or value > max:
        errors[event_idx].append(f"`{field_name}` should be between {min} and {max}")
        return None

    return value


def require_field_check(
    obj: dict, event_idx: int, fields: list[tuple[str, type]], required_field: str = ""
) -> bool:
    """
    Validates the presence and types of required fields in a given object.

    Args:
        obj (dict): The object (dictionary) to validate.
        event_idx (int): The index of the event for associating validation errors.
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
            errors[event_idx].append(msg)

        elif not isinstance(obj[field_name], field_type):
            error_found = True
            errors[event_idx].append(f"`{field_name}` should be a `{field_type}` type.")

    if error_found:
        return False
    return True


event_names = set()
event_dates = set()


def check_structure(event, idx: int):
    if not isinstance(event, dict):
        errors[idx].append("should be a dict")
        return False

    if not require_field_check(
        event,
        idx,
        [
            ("event", str),
            ("triggerDate", dict),
            ("status_index", str),
            ("goodFortunes", dict),
            ("badFortunes", dict),
        ],
    ):
        return False

    event_name: str = event["event"]
    if event_name.strip() == "":
        errors[idx].append("event name should not empty.")
        return

    if event_name in event_names:
        errors[idx].append(f"event `{event_name}` already exists.")

    validate_number(
        idx, event["status_index"], MIN_STATUS_INDEX, MAX_STATUS_INDEX, "status_index"
    )

    if require_field_check(
        event["goodFortunes"],
        idx,
        [
            ("l_1_event", str),
            ("l_1_desc", str),
            ("l_2_event", str),
            ("l_2_desc", str),
        ],
        "goodFortunes"
    ):
        if bool(event["goodFortunes"]["l_1_event"]) ^ bool(event["goodFortunes"]["l_1_desc"]):
            # Check for inconsistency: XOR is used to ensure both l_1_event and l_1_desc
            # are either both provided or both missing. If only one is provided, log an error.
            errors[idx].append("First good fortune is incomplete.")

        if bool(event["goodFortunes"]["l_2_event"]) ^ bool(event["goodFortunes"]["l_2_desc"]):
            # Check for inconsistency: XOR is used to ensure both l_2_event and l_2_desc
            # are either both provided or both missing. If only one is provided, log an error.
            errors[idx].append("Second good fortune is incomplete.")

    if require_field_check(
        event["badFortunes"],
        idx,
        [
            ("r_1_event", str),
            ("r_1_desc", str),
            ("r_2_event", str),
            ("r_2_desc", str),
        ],
        "badFortunes"
    ):
        if bool(event["badFortunes"]["r_1_event"]) ^ bool(event["badFortunes"]["r_1_desc"]):
            # Check for inconsistency: XOR is used to ensure both r_1_event and r_1_desc
            # are either both provided or both missing. If only one is provided, log an error.
            errors[idx].append("First bad fortune is incomplete.")

        if bool(event["badFortunes"]["r_2_event"]) ^ bool(event["badFortunes"]["r_2_desc"]):
            # Check for inconsistency: XOR is used to ensure both r_2_event and r_2_desc
            # are either both provided or both missing. If only one is provided, log an error.
            errors[idx].append("Second bad fortune is incomplete.")

    event_names.add(event_name)

    return True

def check_static_date(event: dict, idx: int):
    trigger_date: dict = event["triggerDate"]
    corrected = require_field_check(
        trigger_date,
        idx,
        [
            ("month", str),
            ("date", str),
        ],
        "triggerDate",
    )

    event_name: str = event["event"]
    if "year" in trigger_date:
        errors[idx].append(
            f"this event `{event_name}` should be placed in `custom_special.json`."
        )

    if "week" in trigger_date or "weekday" in trigger_date:
        errors[idx].append(
            f"this event `{event_name}` should be placed in `cyclical_special.json`."
        )

    if not corrected:
        return

    month = validate_number(idx, trigger_date["month"], 1, 12, "triggerDate.month")
    if month is not None:
        validate_number(
            idx, trigger_date["date"], 1, DAYSPERMONTH[month], "triggerDate.date"
        )

    key = f'"{event_name}:{trigger_date["month"]}/{trigger_date["date"]}'
    if key in event_dates:
        errors[idx].append(f"The `{key}` is repeated.")

    event_dates.add(key)


def check_cyclical_date(event: dict, idx: int):
    trigger_date: dict = event["triggerDate"]
    corrected = require_field_check(
        trigger_date,
        idx,
        [
            ("month", str),
            ("week", str),
            ("weekday", str),
        ],
        "triggerDate",
    )

    event_name: str = event["event"]
    if "year" in trigger_date:
        errors[idx].append(
            f"this event `{event_name}` should be placed in `custom_special.json`."
        )

    elif "date" in trigger_date:
        errors[idx].append(
            f"this event `{event_name}` should be placed in `static_special.json`."
        )

    if not corrected:
        return

    validate_number(idx, trigger_date["month"], 1, 12, "triggerDate.month")
    validate_number(idx, trigger_date["week"], 1, 5, "triggerDate.week")
    validate_number(idx, trigger_date["weekday"], 1, 7, "triggerDate.weekday")

    key = f'"{event_name}:{trigger_date["month"]}/{trigger_date["week"]}/{trigger_date["weekday"]}'
    if key in event_dates:
        errors[idx].append(f"The `{key}` is repeated.")

    event_dates.add(key)


def check_custom_date(event: dict, idx: int):
    trigger_date: dict = event["triggerDate"]
    corrected = require_field_check(
        trigger_date,
        idx,
        [
            ("year", str),
            ("month", str),
            ("date", str),
        ],
        "triggerDate",
    )

    event_name: str = event["event"]
    if "week" in trigger_date or "weekday" in trigger_date:
        errors[idx].append(
            f"this event `{event_name}` should be placed in `cyclical_special.json`.",
        )

    elif "year" not in trigger_date:
        errors[idx].append(
            f"this event `{event_name}` should be placed in `static_special.json`."
        )

    if not corrected:
        return

    year = validate_number(
        idx,
        trigger_date["year"],
        datetime.datetime.min.year,
        datetime.datetime.max.year,
        "triggerDate.year",
    )
    month = validate_number(idx, trigger_date["month"], 1, 12, "triggerDate.month")

    if year is None or month is None:
        return

    days = DAYSPERMONTH[month]
    if month == 2 and is_leap_year(year):
        days += 1  # 29

    date = validate_number(idx, trigger_date["date"], 1, days, "triggerDate.date")
    if date is None:
        return

    key = f'"{event_name}:{year}/{month}/{date}'
    if key in event_dates:
        errors[idx].append(f"The `{key}` is repeated.")

    event_dates.add(key)


date_checker = {
    DateType.CUSTOM: check_custom_date,
    DateType.STATIC: check_static_date,
    DateType.CYCLICAL: check_cyclical_date,
}
check_triggerdate = date_checker[args.type]

for idx, event in enumerate(special_events["special_events"]):
    if check_structure(event, idx):
        check_triggerdate(event, idx)

if errors:
    logging.error(args.path)
    for idx, error_msgs in errors.items():
        logging.error(json.dumps(special_events["special_events"][idx], indent=4, ensure_ascii=False))
        for msg in error_msgs:
            logging.error(msg)
    exit(-1)
