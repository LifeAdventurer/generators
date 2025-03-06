# Contributing

## Fortune Generator

### Fortune Events and Descriptions

1. Fortune Type:
   - Good fortunes
     - These should be added under the `"goodFortunes"` section in the JSON
       file.
     - Represent positive or beneficial events.
   - Bad fortunes
     - These should be added under the `"badFortunes"` section in the JSON file.
     - Represent challenging or less favorable events.

2. Unique Content:
   - Ensure your event and descriptions are original and not repeated in
     existing entries.

3. Event Structure - Each fortune event should be added as new JSON object with
   the following structure:
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

4. Maintain a positive and encouraging tone.

### Special Events
#### Date Structure
1. With year, month and date
    ```json
    "triggerDate": {
        "year": "Year",
        "month": "Month",
        "date": "Date"
    }
    ```

    We should place events of this type in the `fortune_generator/json/custom_special.json`.

    For one-time or irregular events, or events with complex date calculations (like the Moon Festival in the lunar calendar).

    **NOTE: Any special event that does not fit into either**
    - Static events (fixed date every year)
    - Cyclical events (recurring on a pattern like "fourth Thursday")

2. With only month and day
    ```json
    "triggerDate": {
        "month": "Month",
        "date": "Date"
    }
    ```

    We should place events of this type in the `fortune_generator/json/static_special.json`.

    For events with fixed dates.

3. With only month, week, weekday (like Mother's Day)
    ```json
    "triggerDate": {
        "month": "Month",
        "week": "Week",
        "weekday": "Weekday"
    }
    ```

    We should place events of this type in the `fortune_generator/json/cyclical_special.json`.

    For recurring events (e.g., holidays like Thanksgiving and Mother's Day).

#### Event Structure
Special events require a more detailed structure.

1. Structure:
   ```json
   {
     "event": "Event Name",
     "triggerDate": {}, // Please refer to explaination above
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

2. Empty Fields: If there are no fortunes to add, leave the corresponding fields
   as empty strings (`""`).

3. We support adding multiple special events on the same day,
   and the hash function will determine which event will be shown for that day.

### Adding New Themes

#### JSON Theme Structure

When adding a new theme to `fortune_generator/json/themes.json`, follow this
structure:

```json
{
  "name": "theme_name",
  "properties": {
    "bg-color": "#hexcode",
    "good-fortune-color": "#hexcode",
    "bad-fortune-color": "#hexcode",
    "middle-fortune-color": "#hexcode",
    "title-color": "#hexcode",
    "desc-color": "#hexcode",
    "button-color": "#hexcode",
    "button-hover-color": "#hexcode",
    "toggle-theme-button-color": "#hexcode",
    "copy-result-button-color": "#hexcode",
    "date-color": "#hexcode",
    "special-event-color": "#hexcode"
  }
}
```

#### Guidelines for Adding Themes

1. Naming: Choose a unique and descriptive name for the theme.
2. Properties:
   - Ensure that all property values are in valid hexadecimal format (`#rrggbb`
     or `#rrggbbaa` for transparency).
   - Hex Format: Use lowercase for all hex color codes for consistency.
   - Make sure the colors have sufficient contrast for readability.
3. Consistency: Maintain a visually coherent set of colors.
4. Testing: Preview your theme in the app to confirm that colors display as
   expected and are user-friendly.
5. Pull Request Naming:
   - Use a clear PR name like `Impr(theme): Add {theme_name} theme`.

## Quote Generator

### Quotes

- Exclude content that includes any unlawful, defamatory, abusive, threatening
  or obscene text.
- Verify that your contribution meets JSON standards, specifically avoiding
  trailing comma at the end of a list.
- Ensure that the added quotes are not duplicates of any existing ones.
- Remember to name your pull request properly. For example, if you are adding
  new quotes, your pull request should be named
  `Impr(quotes): Add {count} new quotes`.
