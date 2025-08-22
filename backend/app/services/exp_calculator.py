import math

def calculate_level_from_exp(total_exp: int) -> int:
    """Calculate level based on total experience"""
    if total_exp < 100:
        return 1
    return int(1 + math.floor(math.log(total_exp / 100) / math.log(1.5))) + 1

def calculate_exp_for_level(level: int) -> int:
    """Calculate total exp required for a specific level"""
    if level <= 1:
        return 0
    return int(100 * (1.5 ** (level - 2)))

def calculate_exp_to_next_level(current_exp: int, current_level: int) -> int:
    """Calculate exp needed to reach next level"""
    next_level_total = calculate_exp_for_level(current_level + 1)
    current_level_total = calculate_exp_for_level(current_level)
    exp_in_current_level = current_exp - current_level_total
    exp_needed = next_level_total - current_level_total
    return max(0, exp_needed - exp_in_current_level)

def add_experience(current_exp: int, current_level: int, exp_gained: int) -> tuple:
    """Add experience and calculate new level if leveled up"""
    new_total_exp = current_exp + exp_gained
    new_level = calculate_level_from_exp(new_total_exp)
    leveled_up = new_level > current_level
    
    return new_total_exp, new_level, leveled_up