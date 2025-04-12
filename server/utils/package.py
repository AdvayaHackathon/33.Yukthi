from datetime import datetime, date, timedelta
from typing import List, Tuple, Dict
import math
from itertools import combinations

def is_long_weekend_2025(input_date: date, holidays_2025: List[Tuple[date, str]]) -> bool:
    """
    Determines if a given date is part of a long weekend in 2025 (considering Indian holidays).

    Args:
        input_date (date): The date to check.
        holidays_2025 (List[Tuple[date, str]]): A list of (date, holiday_name) tuples for 2025.

    Returns:
        bool: True if the date is part of a long weekend, False otherwise.
    """
    for holiday_date, _ in holidays_2025:
        # Check for 3-day long weekends
        if input_date == holiday_date - timedelta(days=1) and input_date.weekday() in [4, 0]:  # Friday or Monday
            return True
        if input_date == holiday_date + timedelta(days=1) and input_date.weekday() in [4, 0]:  # Friday or Monday
            return True
        #check for 4 day long weekends
        if input_date == holiday_date - timedelta(days=2) and input_date.weekday() == 4:
            return True
        if input_date == holiday_date + timedelta(days=2) and input_date.weekday() == 0:
            return True

    # Check for New Year's long weekend
    if input_date == date(2025, 12, 30) or input_date == date(2025, 12, 31):
        return True

    return False

def calculate_day_score_2025(input_date: date, is_long_weekend: bool, is_public_holiday: bool) -> int:
    """
    Calculates a score based on the day of the week and holiday status for 2025.

    Args:
        input_date (date): The date to check.
        is_long_weekend (bool): True if it's a long weekend, False otherwise.
        is_public_holiday (bool): True if it's a public holiday, False otherwise.

    Returns:
        int: The calculated day score.
    """
    if input_date.weekday() in [5, 6]:  # Saturday or Sunday (0 is Monday, 6 is Sunday)
        if is_long_weekend:
            return 10
        else:
            return 9
    elif is_public_holiday:
        if is_long_weekend:
            return 10
        else:
            return 8
    else:
        return 5  # Default score for regular weekdays

def calculate_time_score_2025(time_str: str, is_public_holiday: bool) -> int:
    """
    Calculates a score based on the time of day.

    Args:
        time_str (str): The time string in HH:MM am/pm format
        is_public_holiday (bool): True if it is a public holiday
    Returns:
        int: The calculated time score.
    """
    try:
        time_obj = datetime.strptime(time_str, "%I:%M %p").time()  # Parse with am/pm
    except ValueError:
        return 0

    morning_start = datetime.strptime("09:00 AM", "%I:%M %p").time()
    morning_end = datetime.strptime("11:00 AM", "%I:%M %p").time()
    afternoon_start = datetime.strptime("01:00 PM", "%I:%M %p").time()
    afternoon_end = datetime.strptime("03:00 PM", "%I:%M %p").time()
    evening_start = datetime.strptime("05:00 PM", "%I:%M %p").time()
    evening_end = datetime.strptime("11:00 PM", "%I:%M %p").time()

    if is_public_holiday:
        if morning_start <= time_obj <= morning_end or \
           afternoon_start <= time_obj <= afternoon_end or \
           evening_start <= time_obj <= evening_end:
            return 8
        else:
            return 5
    else:
        return 5 #default

def calculate_final_score(day_score: int, time_score: int) -> int:
    """
    Calculates the final score by adding the day score and time score,
    with a maximum score of 20.

    Args:
        day_score (int): The score calculated based on the day.
        time_score (int): The score calculated based on the time.

    Returns:
        int: The final calculated score.
    """
    final_score = day_score + time_score
    if final_score >= 20:
        return 20
    else:
        return final_score

def calculate_score_2025(time_str: str, input_date: date, holidays_2025: List[Tuple[date, str]]) -> int:
    """
    Calculates a score based on the day of the week, time, and holiday status for 2025.

    Args:
        time_str (str): The time in HH:MM am/pm format (e.g., 10:30 AM).
        input_date (date): The date to calculate the score for.
        holidays_2025 (List[Tuple[date, str]]): A list of (date, holiday_name) tuples for 2025.

    Returns:
        int: The calculated score, or an error message string.
    """
    # Removed day_str from parameters
    is_long_weekend = is_long_weekend_2025(input_date, holidays_2025)
    is_public_holiday = input_date in [h[0] for h in holidays_2025]

    day_score = calculate_day_score_2025(input_date, is_long_weekend, is_public_holiday)
    time_score = calculate_time_score_2025(time_str, is_public_holiday) # Pass time_str
    final_score = calculate_final_score(day_score, time_score)
    return final_score

from datetime import date, timedelta
from typing import List, Tuple, Dict
import math
from itertools import combinations

def get_holidays_2025() -> List[Tuple[date, str]]:
    """
    Returns a list of tuples, where each tuple contains a date and the name of the holiday for 2025 in India.
    """
    holidays = [
        (date(2025, 1, 14), "Pongal/Makar Sankranti"),
        (date(2025, 1, 26), "Republic Day"),
        (date(2025, 2, 26), "Maha Shivaratri"),
        (date(2025, 3, 14), "Holi"),
        (date(2025, 3, 31), "Id-ul-Fitr"),  # Tentative
        (date(2025, 4, 10), "Mahavir Jayanti"),
        (date(2025, 4, 18), "Good Friday"),
        (date(2025, 5, 12), "Buddha Purnima"),
        (date(2025, 6, 7), "Id-ul-Zuha (Bakrid)"), # Tentative
        (date(2025, 7, 6), "Muharram"),  # Tentative
        (date(2025, 8, 15), "Independence Day"),
        (date(2025, 8, 16), "Janmashtami"),
        (date(2025, 9, 5), "Id-e-Milad"),  # Tentative
        (date(2025, 10, 2), "Dussehra/Mahatma Gandhi Jayanti"),
        (date(2025, 10, 20), "Diwali"),
        (date(2025, 11, 5), "Guru Nanak's Birthday"),
        (date(2025, 12, 25), "Christmas Day"),
        (date(2025, 12, 30), "New Year's Eve"),  # Added New Year's Eve
        (date(2025, 12, 31), "New Year's Eve"),  # Added New Year's Eve
    ]
    return holidays

def calculate_total_price(final_score: int, num_people: float, include_hotel: bool,
                         food_times: int,
                         selected_recreational_activities: Dict[str, bool]) -> float:
    """
    Calculates the total price based on the final score, number of people, and selected options.

    Args:
        final_score (int): The final score (day score + time score).
        num_people (float): The number of people.
        include_hotel (bool): Whether hotel stay is included.
        food_times (int): Number of times food is included.
        selected_recreational_activities (Dict[str, bool]):  Dictionary of selected recreational activities.

    Returns:
        float: The total price.
    """
    base_price = 2000
    hotel_price = 1000
    food_price_per_meal = 500
    total_price = 0

    if num_people == 0:
        return 0

    num_rooms = math.ceil(num_people / 2)

    # Hotel cost
    if include_hotel:
        total_price += hotel_price

    # Food cost
    total_price += food_times * food_price_per_meal

    # Recreational activities cost
    for activity, selected in selected_recreational_activities.items():
        if selected:
            if activity == "kayaking":
                total_price += 500
            elif activity == "jet_skiing":
                total_price += 500
            elif activity == "banana_boat":
                total_price += 500
            elif activity == "paragliding":
                total_price += 1000
            elif activity == "quad_bike":
                total_price += 250
            elif activity in ["camel_ride", "horse_ride"]:
                total_price += 250

    total_price += num_rooms * final_score * 250
    return total_price
def main():
    """
    Main function to run the beach resort package generator and selector.
    """
    holidays_2025 = get_holidays_2025()
    base_price = 2000
    hotel_price = 1000
    recreation_price = 2500
    try:
        time_input = input("Enter the time in HH:MM am/pm format (e.g., 10:30 AM): ")
        date_str = input("Enter the date in %Y-%m-%d format (e.g., 2025-01-15): ")
        num_people = float(input("Enter the number of people (e.g., 1, 2, 2.5): "))
        budget = float(input("Enter your budget: "))
        input_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        include_hotel_input = input("Include hotel? (yes/no): ").lower()
        include_hotel = include_hotel_input == "yes"

        food_times = 0
        if input("Include food? (yes/no): ").lower() == "yes":
            food_times = int(input("Enter the number of times food (1, 2, 3, or 4): "))
            if not (1 <= food_times <= 4):
                raise ValueError("Number of meals must be between 1 and 4.")
        recreational_activities = {
            "kayaking": False,
            "jet_skiing": False,
            "banana_boat": False,
            "paragliding": False,
            "quad_bike": False,
            "camel_ride": False,
            "horse_ride": False,
        }

        if include_hotel: # Changed from input_hotel to include_hotel
            print("\nAvailable Recreational Activities:")
            print("1. Kayaking - ₹500")
            print("2. Jet Skiing - ₹500")
            print("3. Banana Boat Ride - ₹500")
            print("4. Paragliding - ₹1000")
            print("5. Quad Bike Ride - ₹250")
            print("6. Camel Ride - ₹250")
            print("7. Horse Ride - ₹250")

            selected_activities = input(
                "Enter the numbers of the activities you want to include (e.g., 1,3,5): "
            ).split(",")
            for activity_num in selected_activities:
                try:
                    activity_num = int(activity_num.strip())
                    if 1 <= activity_num <= len(recreational_activities):
                        activity_names = list(recreational_activities.keys())
                        recreational_activities[activity_names[activity_num - 1]] = True
                    else:
                        print(f"Invalid activity number: {activity_num}")
                except ValueError:
                    print(f"Invalid input: {activity_num}.  Please enter numbers only.")
        final_score = calculate_score_2025(time_input, input_date, holidays_2025)
        day_name = input_date.strftime("%A")
        total_price = calculate_total_price(final_score, num_people, include_hotel, food_times, recreational_activities)

        print(f"The calculated score for {date_str} ({day_name}) is: {final_score}")
        print(f"The  price for 2 people is: ₹{total_price:.2f}")
        print("\nSelected Options:")
        print(f"Include Hotel: {'Yes' if include_hotel else 'No'}")
        print(f"Food Times: {food_times}")
        print("Recreational Activities:")
        for activity, selected in recreational_activities.items():
            if selected:
                print(f"  {activity}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
