# Contributing

## Fortune Generator

### Fortune Events and Descriptions

1. Event Structure - Each fortune event should be added as new JSON object with the following structure:
    ```json
    {
      "event": "Event Name",
      "description": [
        "Description 1",
        "Description 2",
        "Description 3",
        "Description 4"
      ]
    }
    ```

2. Maintain a positive and encouraging tone.

### Special Events

Special events require a more detailed structure.

1. Structure:
    ```json
    {
      "event": "Event Name",
      "year": "Year",
      "month": "Month",
      "date": "Date",
      "status_index": "Status Index",
      "goodFortunes": {
        "l_1_event": "Good Fortune 1",
        "l_1_desc": "Description 1",
        "l_2_event": "Good Fortune 2",
        "l_2_desc": "Description 2"
      },
      "badFortunes": {
        "r_1_event": "Bad Fortune 1",
        "r_1_desc": "Description 1",
        "r_2_event": "Bad Fortune 2",
        "r_2_desc": "Description 2"
      }
    }
    ```

## Quote Generator

### Quotes

- Exclude content that includes any unlawful, defamatory, abusive, threatening or obscene text.
- Verify that your contribution meets JSON standards, specifically avoiding trailing comma at the end of a list.
- Ensure that the added quotes are not duplicates of any existing ones.
- Remember to name your pull request properly. For example, if you are adding new quotes, your pull request should be named `Impr(quotes): Add {count} new quotes`.
