#!/bin/python3

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

special_events: dict[str, list[dict]] = None

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

if "special_events" not in special_events:
    print(f"`special_events` not found in `{args.path}`.")
    exit(-1)

if not isinstance(special_events["special_events"], list):
    print(f"`special_events` in `{args.path}` should be a list.")
    exit(-1)

MIN_STATUS_INDEX = 0
MAX_STATUS_INDEX = 7
DAYSPERMONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]


def is_leap_year(year: int) -> bool:
    if year % 400 == 0:
        return True
    if year % 100 == 0:
        return False
    if year % 4 == 0:
        return True

    return False


def validate_number(value, min, max, field_name) -> int:
    try:
        value = int(value)
    except ValueError:
        print(f"`{field_name}` should be between {min} and {max}")
        exit(-1)

    if value < min or value > max:
        print(f"`{field_name}` should be between {min} and {max}")
        exit(-1)

    return value


def require_field_check(
    obj: dict, fields: list[tuple[str, type]], required_field: str = ""
):
    for field_name, field_type in fields:
        if field_name not in obj:
            if required_field != "":
                print(f"`{required_field}` ", end="")

            print(f"missing `{field_name}`.\n", obj)
            exit(-1)

        elif not isinstance(obj[field_name], field_type):
            print(f"`{field_name}` should be a `{field_type}` type.\n", obj)
            exit(-1)


event_names = set()
event_dates = set()


def check_structure(event: dict):
    require_field_check(
        event,
        [
            ("event", str),
            ("triggerDate", dict),
            ("status_index", str),
            ("goodFortunes", dict),
            ("badFortunes", dict),
        ],
    )

    event_name: str = event["event"]
    if event_name.strip() == "":
        print("event name should not empty", event)
        exit(-1)

    if event_name in event_names:
        print(f"event `{event_name}` already exists.")

    validate_number(
        event["status_index"], MIN_STATUS_INDEX, MAX_STATUS_INDEX, "status_index"
    )
    require_field_check(
        event["goodFortunes"],
        [
            ("l_1_event", str),
            ("l_1_desc", str),
            ("l_2_event", str),
            ("l_2_desc", str),
        ],
    )
    require_field_check(
        event["badFortunes"],
        [
            ("r_1_event", str),
            ("r_1_desc", str),
            ("r_2_event", str),
            ("r_2_desc", str),
        ],
    )

    event_names.add(event_name)


def check_static_date(event: dict):
    trigger_date: dict = event["triggerDate"]
    require_field_check(
        trigger_date,
        [
            ("month", str),
            ("date", str),
        ],
        "triggerDate",
    )

    event_name: str = event["event"]
    if "year" in trigger_date:
        print(
            f"this event `{event_name}` should be placed in `custom_special.json`.\n",
            event,
        )
        exit(-1)

    elif "week" in trigger_date or "weekday" in trigger_date:
        print(
            f"this event `{event_name}` should be placed in `cyclical_special.json`.\n",
            event,
        )
        exit(-1)

    month = validate_number(trigger_date["month"], 1, 12, "triggerDate.month")
    validate_number(trigger_date["date"], 1, DAYSPERMONTH[month], "triggerDate.date")


def check_cyclical_date(event: dict):
    trigger_date: dict = event["triggerDate"]
    require_field_check(
        trigger_date,
        [
            ("month", str),
            ("week", str),
            ("weekday", str),
        ],
        "triggerDate",
    )

    event_name: str = event["event"]
    if "year" in trigger_date:
        print(
            f"this event `{event_name}` should be placed in `custom_special.json`.\n",
            event,
        )
        exit(-1)

    elif "date" in trigger_date:
        print(
            f"this event `{event_name}` should be placed in `static_special.json`.\n",
            event,
        )
        exit(-1)

    validate_number(trigger_date["month"], 1, 12, "triggerDate.month")
    validate_number(trigger_date["week"], 1, 5, "triggerDate.week")
    validate_number(trigger_date["weekday"], 1, 7, "triggerDate.weekday")


def check_custom_date(event: dict):
    trigger_date: dict = event["triggerDate"]
    require_field_check(
        trigger_date,
        [
            ("year", str),
            ("month", str),
            ("date", str),
        ],
        "triggerDate",
    )

    event_name: str = event["event"]
    if "week" in trigger_date or "weekday" in trigger_date:
        print(
            f"this event `{event_name}` should be placed in `cyclical_special.json`.\n",
            event,
        )
        exit(-1)

    year = validate_number(
        trigger_date["year"],
        datetime.datetime.min.year,
        datetime.datetime.max.year,
        "triggerDate.year",
    )
    month = validate_number(trigger_date["month"], 1, 12, "triggerDate.month")

    days = DAYSPERMONTH[month]
    if month == 2 and is_leap_year(year):
        days += 1  # 29

    date = validate_number(trigger_date["date"], 1, days, "triggerDate.date")

    date_str = f"{year}/{month}/{date}"
    if date_str in event_dates:
        print(f"The date `{date_str}` of `{event_name}` is repeated.")

    event_dates.add(date_str)


date_checker = {
    DateType.CUSTOM: check_custom_date,
    DateType.STATIC: check_static_date,
    DateType.CYCLICAL: check_cyclical_date,
}
check_triggerdate = date_checker[args.type]

for event in special_events["special_events"]:
    check_structure(event)
    check_triggerdate(event)
